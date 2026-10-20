import { Body, Controller, Get, Headers, Post, Req, UseGuards, BadRequestException } from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiHeader, ApiOperation, ApiTags } from "@nestjs/swagger";
import { asUser, inTenant, requireBranch, requirePermission } from "@varejo360/database";
import { z } from "zod";
import { SessionGuard, type AuthRequest } from "./session.guard.js";
import { selectedId } from "./security.js";

const warehouseInput = z.strictObject({
  name: z.string().trim().min(2).max(100),
  code: z.string().trim().regex(/^[A-Z0-9_-]{1,30}$/),
});

function contextId(value: unknown) {
  const id = selectedId(value);
  if (!id) throw new BadRequestException("Selecione uma organização e uma filial válidas.");
  return id;
}

@ApiTags("Organização")
@ApiCookieAuth()
@UseGuards(SessionGuard)
@Controller()
export class OrganizationController {
  @Get("auth/me")
  me(@Req() req: AuthRequest) { return req.identity; }

  @Get("me/tenants")
  tenants(@Req() req: AuthRequest) {
    return asUser(req.identity.id, (tx) => tx.membership.findMany({
      where: { userId: req.identity.id, active: true, tenant: { active: true } },
      select: { tenant: { select: { id: true, name: true, slug: true } } },
      orderBy: { tenantId: "asc" },
    }).then((rows) => rows.map((row) => row.tenant)));
  }

  @Get("branches")
  @ApiHeader({ name: "x-tenant-id", required: true })
  branches(@Req() req: AuthRequest, @Headers("x-tenant-id") tenant: string) {
    const tenantId = contextId(tenant);
    return inTenant(req.identity.id, tenantId, async (tx, membershipId) => {
      await requirePermission(tx, tenantId, membershipId, "organization.read");
      return tx.branch.findMany({
        where: { tenantId, active: true, access: { some: { tenantId, membershipId } } },
        select: { id: true, name: true, code: true, timezone: true, company: { select: { name: true } } },
        orderBy: { code: "asc" },
      });
    });
  }

  @Get("context")
  @ApiHeader({ name: "x-tenant-id", required: true })
  @ApiHeader({ name: "x-branch-id", required: true })
  context(@Req() req: AuthRequest, @Headers("x-tenant-id") tenant: string, @Headers("x-branch-id") branch: string) {
    const tenantId = contextId(tenant);
    return inTenant(req.identity.id, tenantId, async (tx, membershipId) => {
      await requirePermission(tx, tenantId, membershipId, "organization.read");
      const selectedBranch = await requireBranch(tx, tenantId, membershipId, contextId(branch));
      const roles = await tx.membershipRole.findMany({
        where: { tenantId, membershipId },
        select: { role: { select: { name: true, permissions: { select: { code: true } } } } },
      });
      return {
        user: req.identity,
        tenant: await tx.tenant.findUniqueOrThrow({ where: { id: tenantId }, select: { id: true, name: true } }),
        branch: { id: selectedBranch.id, name: selectedBranch.name, code: selectedBranch.code },
        roles: roles.map((r) => r.role.name),
        permissions: [...new Set(roles.flatMap((r) => r.role.permissions.map((p) => p.code)))],
      };
    });
  }

  @Get("warehouses")
  warehouses(@Req() req: AuthRequest, @Headers("x-tenant-id") tenant: string, @Headers("x-branch-id") branch: string) {
    const tenantId = contextId(tenant), branchId = contextId(branch);
    return inTenant(req.identity.id, tenantId, async (tx, membershipId) => {
      await requirePermission(tx, tenantId, membershipId, "organization.read");
      await requireBranch(tx, tenantId, membershipId, branchId);
      return tx.warehouse.findMany({ where: { tenantId, branchId }, orderBy: { createdAt: "asc" }, take: 200 });
    });
  }

  @Post("warehouses")
  @ApiOperation({ summary: "Cria depósito na filial autorizada e registra auditoria na mesma transação" })
  @ApiBody({ schema: { type: "object", required: ["name", "code"], additionalProperties: false,
    properties: { name: { type: "string", minLength: 2, maxLength: 100 }, code: { type: "string", pattern: "^[A-Z0-9_-]{1,30}$" } } } })
  createWarehouse(@Req() req: AuthRequest, @Headers("x-tenant-id") tenant: string,
    @Headers("x-branch-id") branch: string, @Body() body: unknown) {
    const tenantId = contextId(tenant), branchId = contextId(branch);
    const parsed = warehouseInput.safeParse(body);
    if (!parsed.success) throw new BadRequestException("Informe nome e código válidos. Código aceita letras maiúsculas, números, _ e -.");
    return inTenant(req.identity.id, tenantId, async (tx, membershipId) => {
      await requirePermission(tx, tenantId, membershipId, "warehouses.create");
      await requireBranch(tx, tenantId, membershipId, branchId);
      const warehouse = await tx.warehouse.create({ data: { ...parsed.data, tenantId, branchId } });
      await tx.auditLog.create({ data: {
        tenantId, branchId, actorId: req.identity.id, action: "warehouse.created",
        entityId: warehouse.id, requestId: req.requestId,
      } });
      return warehouse;
    });
  }

  @Get("audit-logs")
  audit(@Req() req: AuthRequest, @Headers("x-tenant-id") tenant: string, @Headers("x-branch-id") branch: string) {
    const tenantId = contextId(tenant), branchId = contextId(branch);
    return inTenant(req.identity.id, tenantId, async (tx, membershipId) => {
      await requirePermission(tx, tenantId, membershipId, "audit.read");
      await requireBranch(tx, tenantId, membershipId, branchId);
      return tx.auditLog.findMany({ where: { tenantId, branchId }, orderBy: [{ createdAt: "desc" }, { id: "desc" }], take: 50 });
    });
  }
}
