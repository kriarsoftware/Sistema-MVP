import { Injectable, UnauthorizedException, type CanActivate, type ExecutionContext } from "@nestjs/common";
import type { Request } from "express";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "./auth.js";

export type AuthRequest = Request & { identity: { id: string; name: string; email: string }; requestId: string };

@Injectable()
export class SessionGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const result = await auth.api.getSession({ headers: fromNodeHeaders(req.headers) });
    if (!result) throw new UnauthorizedException("Entre novamente para continuar.");
    req.identity = { id: result.user.id, name: result.user.name, email: result.user.email };
    return true;
  }
}
