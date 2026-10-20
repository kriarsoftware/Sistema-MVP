import { randomUUID } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import { hashPassword } from "better-auth/crypto";

if (process.env.NODE_ENV === "production" || process.env.ALLOW_DEMO_SEED !== "true") {
  throw new Error("Seed bloqueado. Use ALLOW_DEMO_SEED=true somente em desenvolvimento.");
}
const password = process.env.DEMO_PASSWORD;
if (!password || password.length < 12) throw new Error("DEMO_PASSWORD precisa ter ao menos 12 caracteres.");
if (!process.env.MIGRATION_DATABASE_URL) throw new Error("MIGRATION_DATABASE_URL ausente.");
const db = new PrismaClient({ datasourceUrl: process.env.MIGRATION_DATABASE_URL });
try {
  if (await db.user.count()) throw new Error("Seed exige banco vazio; não sobrescreve dados existentes.");
  const hash = await hashPassword(password);
  await db.$transaction(async (tx) => {
    for (const [id, email, name] of [
      ["demo-admin", "admin@varejo360.test", "Marina Costa"],
      ["demo-operator", "operador@varejo360.test", "Lucas Santos"],
    ]) {
      await tx.user.create({ data: { id, email, name, emailVerified: true } });
      await tx.account.create({ data: { id: randomUUID(), userId: id, providerId: "credential", accountId: id, password: hash } });
    }
    for (const [tenantId, name, slug] of [
      ["demo-aurora", "Aurora Varejo", "aurora"],
      ["demo-horizonte", "Horizonte Calçados", "horizonte"],
    ]) {
      await tx.tenant.create({ data: { id: tenantId, name, slug } });
      await tx.company.create({ data: { id: `${tenantId}-company`, tenantId, name: `${name} Ltda.` } });
      const role = await tx.role.create({ data: { tenantId, name: "Administrador" } });
      for (const code of ["organization.read", "warehouses.create", "audit.read"]) {
        await tx.rolePermission.create({ data: { tenantId, roleId: role.id, code } });
      }
      const admin = await tx.membership.create({ data: { tenantId, userId: "demo-admin" } });
      await tx.membershipRole.create({ data: { tenantId, membershipId: admin.id, roleId: role.id } });
      for (const [code, branchName] of [["01", "Loja Centro"], ["02", "Loja Shopping"]]) {
        const branchId = `${tenantId}-${code}`;
        await tx.branch.create({ data: { id: branchId, tenantId, companyId: `${tenantId}-company`, code, name: branchName } });
        await tx.branchAccess.create({ data: { tenantId, membershipId: admin.id, branchId } });
        await tx.warehouse.create({ data: { tenantId, branchId, name: "Estoque principal", code: "PRINCIPAL" } });
      }
      if (tenantId === "demo-aurora") {
        const operatorRole = await tx.role.create({ data: { tenantId, name: "Consulta" } });
        await tx.rolePermission.create({ data: { tenantId, roleId: operatorRole.id, code: "organization.read" } });
        const operator = await tx.membership.create({ data: { tenantId, userId: "demo-operator" } });
        await tx.membershipRole.create({ data: { tenantId, membershipId: operator.id, roleId: operatorRole.id } });
        await tx.branchAccess.create({ data: { tenantId, membershipId: operator.id, branchId: "demo-aurora-01" } });
      }
    }
  });
  console.log("Seed criado: dois tenants, quatro filiais e dois usuários. Senha definida por DEMO_PASSWORD.");
} finally {
  await db.$disconnect();
}
