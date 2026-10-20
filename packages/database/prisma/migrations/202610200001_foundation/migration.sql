CREATE TABLE "user" (
  "id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "email" TEXT NOT NULL UNIQUE,
  "emailVerified" BOOLEAN NOT NULL DEFAULT false, "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE TABLE "session" (
  "id" TEXT PRIMARY KEY, "expiresAt" TIMESTAMP(3) NOT NULL, "token" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL,
  "ipAddress" TEXT, "userAgent" TEXT, "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "session_userId_idx" ON "session"("userId");
CREATE TABLE "account" (
  "id" TEXT PRIMARY KEY, "accountId" TEXT NOT NULL, "providerId" TEXT NOT NULL,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  "accessToken" TEXT, "refreshToken" TEXT, "idToken" TEXT,
  "accessTokenExpiresAt" TIMESTAMP(3), "refreshTokenExpiresAt" TIMESTAMP(3),
  "scope" TEXT, "password" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  UNIQUE("providerId", "accountId")
);
CREATE INDEX "account_userId_idx" ON "account"("userId");
CREATE TABLE "verification" (
  "id" TEXT PRIMARY KEY, "identifier" TEXT NOT NULL, "value" TEXT NOT NULL, "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "updatedAt" TIMESTAMP(3) NOT NULL
);
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");
CREATE TABLE "Tenant" (
  "id" TEXT PRIMARY KEY, "name" TEXT NOT NULL, "slug" TEXT NOT NULL UNIQUE,
  "active" BOOLEAN NOT NULL DEFAULT true, "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  "currency" TEXT NOT NULL DEFAULT 'BRL', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "Membership" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON UPDATE CASCADE,
  "userId" TEXT NOT NULL REFERENCES "user"("id") ON UPDATE CASCADE, "active" BOOLEAN NOT NULL DEFAULT true,
  UNIQUE("tenantId", "userId"), UNIQUE("tenantId", "id")
);
CREATE TABLE "Company" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON UPDATE CASCADE,
  "name" TEXT NOT NULL, "document" TEXT, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("tenantId", "id")
);
CREATE TABLE "Branch" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL, "companyId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "code" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true,
  "timezone" TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("tenantId", "id"), UNIQUE("tenantId", "code"),
  FOREIGN KEY ("tenantId", "companyId") REFERENCES "Company"("tenantId", "id") ON UPDATE CASCADE
);
CREATE TABLE "Warehouse" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL, "branchId" TEXT NOT NULL,
  "name" TEXT NOT NULL, "code" TEXT NOT NULL, "active" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("tenantId", "id"), UNIQUE("tenantId", "branchId", "code"),
  FOREIGN KEY ("tenantId", "branchId") REFERENCES "Branch"("tenantId", "id") ON UPDATE CASCADE
);
CREATE TABLE "BranchAccess" (
  "tenantId" TEXT NOT NULL, "membershipId" TEXT NOT NULL, "branchId" TEXT NOT NULL,
  PRIMARY KEY ("tenantId", "membershipId", "branchId"),
  FOREIGN KEY ("tenantId", "membershipId") REFERENCES "Membership"("tenantId", "id") ON UPDATE CASCADE,
  FOREIGN KEY ("tenantId", "branchId") REFERENCES "Branch"("tenantId", "id") ON UPDATE CASCADE
);
CREATE TABLE "Role" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL REFERENCES "Tenant"("id") ON UPDATE CASCADE, "name" TEXT NOT NULL,
  UNIQUE("tenantId", "id"), UNIQUE("tenantId", "name")
);
CREATE TABLE "RolePermission" (
  "tenantId" TEXT NOT NULL, "roleId" TEXT NOT NULL, "code" TEXT NOT NULL,
  PRIMARY KEY ("tenantId", "roleId", "code"),
  FOREIGN KEY ("tenantId", "roleId") REFERENCES "Role"("tenantId", "id") ON UPDATE CASCADE
);
CREATE TABLE "MembershipRole" (
  "tenantId" TEXT NOT NULL, "membershipId" TEXT NOT NULL, "roleId" TEXT NOT NULL,
  PRIMARY KEY ("tenantId", "membershipId", "roleId"),
  FOREIGN KEY ("tenantId", "membershipId") REFERENCES "Membership"("tenantId", "id") ON UPDATE CASCADE,
  FOREIGN KEY ("tenantId", "roleId") REFERENCES "Role"("tenantId", "id") ON UPDATE CASCADE
);
CREATE TABLE "AuditLog" (
  "id" TEXT PRIMARY KEY, "tenantId" TEXT NOT NULL, "branchId" TEXT,
  "actorId" TEXT NOT NULL, "action" TEXT NOT NULL, "entityId" TEXT NOT NULL,
  "requestId" TEXT NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX "AuditLog_tenantId_createdAt_idx" ON "AuditLog"("tenantId", "createdAt");

ALTER TABLE "Membership" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Membership" FORCE ROW LEVEL SECURITY;
CREATE POLICY membership_self ON "Membership"
  USING ("userId" = current_setting('app.user_id', true))
  WITH CHECK (false);
ALTER TABLE "Tenant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Tenant" FORCE ROW LEVEL SECURITY;
CREATE POLICY tenant_member ON "Tenant"
  USING (EXISTS (
    SELECT 1 FROM "Membership" m WHERE m."tenantId" = "Tenant"."id" AND m."active"
      AND m."userId" = current_setting('app.user_id', true)
  )) WITH CHECK (false);

DO $$
DECLARE tab TEXT;
BEGIN
  FOREACH tab IN ARRAY ARRAY['Company','Branch','Warehouse','BranchAccess','Role','RolePermission','MembershipRole','AuditLog']
  LOOP
    EXECUTE format('ALTER TABLE %I ENABLE ROW LEVEL SECURITY', tab);
    EXECUTE format('ALTER TABLE %I FORCE ROW LEVEL SECURITY', tab);
    EXECUTE format(
      'CREATE POLICY tenant_scope ON %I USING (
        "tenantId" = current_setting(''app.tenant_id'', true)
        AND EXISTS (SELECT 1 FROM "Membership" m JOIN "Tenant" t ON t.id = m."tenantId"
          WHERE m."tenantId" = current_setting(''app.tenant_id'', true) AND m.active AND t.active
          AND m."userId" = current_setting(''app.user_id'', true))
       ) WITH CHECK (
        "tenantId" = current_setting(''app.tenant_id'', true)
        AND EXISTS (SELECT 1 FROM "Membership" m JOIN "Tenant" t ON t.id = m."tenantId"
          WHERE m."tenantId" = current_setting(''app.tenant_id'', true) AND m.active AND t.active
          AND m."userId" = current_setting(''app.user_id'', true))
       )', tab);
  END LOOP;
END $$;

-- Runtime não administra identidades de autorização nem altera auditoria.
GRANT SELECT, INSERT, UPDATE, DELETE ON "user","session","account","verification" TO varejo_app;
GRANT SELECT ON "Tenant","Membership","Company","Branch","BranchAccess","Role","RolePermission","MembershipRole" TO varejo_app;
GRANT SELECT, INSERT ON "Warehouse","AuditLog" TO varejo_app;
