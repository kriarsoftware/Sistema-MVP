import test, { after } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";

if (!process.env.DATABASE_URL) throw new Error("Teste exige PostgreSQL real e DATABASE_URL runtime.");
// Força reutilização da mesma conexão para detectar vazamentos de contexto.
const url = new URL(process.env.DATABASE_URL);
url.searchParams.set("connection_limit", "1");
process.env.DATABASE_URL = url.toString();
const { database, asUser, inTenant, requireBranch, requirePermission, AccessDenied } = await import("../src/index.ts");
after(async () => { await database.$disconnect(); });

test("a credencial de teste não pode ignorar RLS", async () => {
  const [role] = await database.$queryRaw<{ rolsuper: boolean; rolbypassrls: boolean }[]>`
    SELECT rolsuper, rolbypassrls FROM pg_roles WHERE rolname=current_user`;
  assert.equal(role.rolsuper, false);
  assert.equal(role.rolbypassrls, false);
});

test("seed esperado está presente e operador vê apenas sua organização", async () => {
  const rows = await asUser("demo-operator", (tx) => tx.membership.findMany({
    where: { userId: "demo-operator", active: true }, include: { tenant: true },
  }));
  assert.deepEqual(rows.map(r => r.tenantId), ["demo-aurora"]);
});

test("sem contexto, leitura de tabelas comerciais retorna vazio", async () => {
  assert.deepEqual(await database.company.findMany(), []);
  assert.deepEqual(await database.warehouse.findMany(), []);
});

test("operador não seleciona tenant alheio", async () => {
  await assert.rejects(inTenant("demo-operator", "demo-horizonte", tx => tx.company.findMany()), AccessDenied);
});

test("consulta sem filtro não vaza o segundo tenant graças a RLS", async () => {
  const rows = await inTenant("demo-admin", "demo-aurora", tx => tx.company.findMany());
  assert.equal(rows.length, 1);
  assert.ok(rows.every(r => r.tenantId === "demo-aurora"));
});

test("troca de tenant não deixa contexto na conexão reutilizada", async () => {
  const a = await inTenant("demo-admin", "demo-aurora", tx => tx.company.findMany());
  const b = await inTenant("demo-admin", "demo-horizonte", tx => tx.company.findMany());
  assert.equal(a[0].tenantId, "demo-aurora");
  assert.equal(b[0].tenantId, "demo-horizonte");
  assert.deepEqual(await database.company.findMany(), []);
});

test("rollback também limpa contexto da conexão", async () => {
  await assert.rejects(inTenant("demo-admin", "demo-aurora", async () => { throw new Error("rollback intencional"); }));
  assert.deepEqual(await database.company.findMany(), []);
});

test("ID de filial de outro tenant é rejeitado", async () => {
  await assert.rejects(inTenant("demo-admin", "demo-aurora", (tx, member) =>
    requireBranch(tx, "demo-aurora", member, "demo-horizonte-01")), AccessDenied);
});

test("filial não autorizada dentro do tenant é rejeitada", async () => {
  await assert.rejects(inTenant("demo-operator", "demo-aurora", (tx, member) =>
    requireBranch(tx, "demo-aurora", member, "demo-aurora-02")), AccessDenied);
});

test("operador sem permissão não cria depósito", async () => {
  await assert.rejects(inTenant("demo-operator", "demo-aurora", (tx, member) =>
    requirePermission(tx, "demo-aurora", member, "warehouses.create")), AccessDenied);
});

test("FK composta impede depósito com filial de outro tenant", async () => {
  await assert.rejects(inTenant("demo-admin", "demo-aurora", tx => tx.warehouse.create({
    data: { tenantId: "demo-aurora", branchId: "demo-horizonte-01", name: "Inválido", code: randomUUID() },
  })), (error: unknown) => typeof error === "object" && error !== null && "code" in error && error.code === "P2003");
});

test("RLS rejeita INSERT em outro tenant", async () => {
  await assert.rejects(inTenant("demo-admin", "demo-aurora", tx => tx.warehouse.create({
    data: { tenantId: "demo-horizonte", branchId: "demo-horizonte-01", name: "Inválido", code: randomUUID() },
  })));
});

test("depósito e auditoria fazem rollback juntos", async () => {
  const id = randomUUID();
  await assert.rejects(inTenant("demo-admin", "demo-aurora", async tx => {
    await tx.warehouse.create({ data: { id, tenantId: "demo-aurora", branchId: "demo-aurora-01", code: id, name: "Rollback" } });
    await tx.auditLog.create({ data: {
      tenantId: "demo-aurora", branchId: "demo-aurora-01", actorId: "demo-admin",
      action: "warehouse.created", entityId: id, requestId: randomUUID(),
    } });
    throw new Error("falha simulada antes do commit");
  }));
  await inTenant("demo-admin", "demo-aurora", async tx => {
    assert.equal(await tx.warehouse.count({ where: { id } }), 0);
    assert.equal(await tx.auditLog.count({ where: { entityId: id } }), 0);
  });
});

test("papel runtime não pode alterar auditoria", async () => {
  await assert.rejects(inTenant("demo-admin", "demo-aurora", tx =>
    tx.$executeRaw`UPDATE "AuditLog" SET action = 'tampered' WHERE "tenantId" = 'demo-aurora'`));
});
