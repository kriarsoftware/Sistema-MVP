import "reflect-metadata";
import { randomUUID } from "node:crypto";
import { NestFactory } from "@nestjs/core";
import { Module, Controller, Get, Catch, HttpException, ServiceUnavailableException, type ArgumentsHost, type ExceptionFilter } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { json, type Request, type Response, type NextFunction } from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { toNodeHandler } from "better-auth/node";
import { AccessDenied, database, Prisma } from "@varejo360/database";
import { auth, webOrigin } from "./auth.js";
import { OrganizationController } from "./organization.controller.js";
import { SessionGuard } from "./session.guard.js";
import { allowedMutationOrigin } from "./security.js";

@Controller()
class HealthController {
  @Get("health") health() { return { status: "ok" }; }
  @Get("ready") async ready() {
    try { await database.$queryRaw`SELECT 1`; return { status: "ready" }; }
    catch { throw new ServiceUnavailableException("Banco indisponível."); }
  }
}

@Catch()
class Errors implements ExceptionFilter {
  catch(error: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const req = http.getRequest<Request & { requestId: string }>();
    let status = 500, code = "INTERNAL_ERROR", message = "Não foi possível concluir. Tente novamente.";
    if (error instanceof AccessDenied) { status = 403; code = "ACCESS_DENIED"; message = error.message; }
    else if (error instanceof HttpException) { status = error.getStatus(); code = `HTTP_${status}`; message = error.message; }
    else if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      status = 409; code = "ALREADY_EXISTS"; message = "Esse código já está em uso nesta filial.";
    }
    if (status === 500) console.error(JSON.stringify({ level: "error", requestId: req.requestId, code }));
    http.getResponse<Response>().status(status).json({ error: { code, message, requestId: req.requestId } });
  }
}

@Module({ controllers: [HealthController, OrganizationController], providers: [SessionGuard] })
class AppModule {}

async function main() {
  // Nunca inicializar runtime com credencial de migração/superusuário.
  const roles = await database.$queryRaw<{ rolsuper: boolean; rolbypassrls: boolean; owner: boolean }[]>`
    SELECT r.rolsuper, r.rolbypassrls,
      EXISTS(SELECT 1 FROM pg_tables WHERE schemaname='public' AND tableowner=current_user) AS owner
    FROM pg_roles r WHERE r.rolname=current_user`;
  if (!roles[0] || roles[0].rolsuper || roles[0].rolbypassrls || roles[0].owner) {
    throw new Error("Runtime requer usuário PostgreSQL sem superuser, BYPASSRLS ou propriedade de tabelas.");
  }
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  app.use(helmet());
  app.use((req: Request & { requestId?: string }, res: Response, next: NextFunction) => {
    req.requestId = randomUUID();
    res.setHeader("x-request-id", req.requestId);
    res.setHeader("Cache-Control", "no-store");
    if (!allowedMutationOrigin(req.method, req.headers.origin, webOrigin)) {
      res.status(403).json({ error: { code: "ORIGIN_REJECTED", message: "Origem não autorizada.", requestId: req.requestId } });
      return;
    }
    next();
  });
  app.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: true, legacyHeaders: false }));
  app.getHttpAdapter().getInstance().all("/api/auth/*splat", toNodeHandler(auth));
  app.use(json({ limit: "32kb" }));
  app.setGlobalPrefix("api/v1");
  app.useGlobalFilters(new Errors());
  if (process.env.NODE_ENV !== "production") {
    SwaggerModule.setup("api/docs", app, SwaggerModule.createDocument(app,
      new DocumentBuilder().setTitle("Varejo360 — Fundação").setVersion("0.1.0").addCookieAuth().build()));
  }
  app.enableShutdownHooks();
  await app.listen(Number(process.env.API_PORT ?? 3001), "127.0.0.1");
}
main().catch(() => {
  console.error("Falha ao iniciar API. Verifique banco, credenciais runtime, migrations e configuração.");
  process.exitCode = 1;
});
