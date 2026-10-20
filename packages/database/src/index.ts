import { PrismaClient, type Prisma } from "@prisma/client";

export { PrismaClient, Prisma } from "@prisma/client";
export const database = new PrismaClient();

export class AccessDenied extends Error {
  constructor() { super("Acesso não autorizado."); }
}

export function asUser<T>(userId: string, run: (tx: Prisma.TransactionClient) => Promise<T>) {
  if (!userId) throw new AccessDenied();
  return database.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.user_id', ${userId}, true)`;
    return run(tx);
  });
}

export function inTenant<T>(
  userId: string,
  tenantId: string,
  run: (tx: Prisma.TransactionClient, membershipId: string) => Promise<T>,
) {
  if (!tenantId) throw new AccessDenied();
  return asUser(userId, async (tx) => {
    const member = await tx.membership.findUnique({
      where: { tenantId_userId: { tenantId, userId } },
      include: { tenant: true },
    });
    if (!member?.active || !member.tenant.active) throw new AccessDenied();
    await tx.$executeRaw`SELECT set_config('app.tenant_id', ${tenantId}, true)`;
    return run(tx, member.id);
  });
}

export async function requirePermission(tx: Prisma.TransactionClient, tenantId: string, membershipId: string, code: string) {
  const granted = await tx.membershipRole.findFirst({
    where: { tenantId, membershipId, role: { permissions: { some: { tenantId, code } } } },
    select: { roleId: true },
  });
  if (!granted) throw new AccessDenied();
}

export async function requireBranch(tx: Prisma.TransactionClient, tenantId: string, membershipId: string, branchId: string) {
  const access = await tx.branchAccess.findUnique({
    where: { tenantId_membershipId_branchId: { tenantId, membershipId, branchId } },
    include: { branch: true },
  });
  if (!access?.branch.active) throw new AccessDenied();
  return access.branch;
}
