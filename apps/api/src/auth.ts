import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { database } from "@varejo360/database";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret || secret.length < 32 || secret.startsWith("replace-")) {
  throw new Error("Configure BETTER_AUTH_SECRET com pelo menos 32 caracteres aleatórios.");
}
export const webOrigin = process.env.WEB_ORIGIN ?? "http://localhost:3000";
if (process.env.NODE_ENV === "production" && !webOrigin.startsWith("https://")) {
  throw new Error("WEB_ORIGIN deve usar HTTPS em produção.");
}

export const auth = betterAuth({
  appName: "Varejo360",
  baseURL: webOrigin,
  basePath: "/api/auth",
  secret,
  database: prismaAdapter(database, { provider: "postgresql" }),
  trustedOrigins: [webOrigin],
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    revokeSessionsOnPasswordReset: true,
  },
  session: {
    expiresIn: 60 * 60 * 8,
    updateAge: 60 * 30,
    cookieCache: { enabled: false },
  },
  advanced: { useSecureCookies: process.env.NODE_ENV === "production" },
  rateLimit: { enabled: true, window: 60, max: 30 },
});
