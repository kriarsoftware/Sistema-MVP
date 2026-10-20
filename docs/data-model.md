# Modelo inicial

Identidade: User → Session e Account. Verification pertence à biblioteca de autenticação.
Organização: Tenant → Company → Branch → Warehouse.
Acesso: User → Membership → MembershipRole → Role → RolePermission.
Filiais autorizadas: Membership → BranchAccess → Branch.
Auditoria: AuditLog, append-only para o papel runtime.

O schema canônico está em `packages/database/prisma/schema.prisma`.
A migration inclui RLS e grants que não são representados pelo schema Prisma.

Tenant e Membership têm políticas de diretório baseadas no usuário, e não na seleção de tenant. Assim a tela de seleção pode ser carregada antes de existir contexto comercial.
As outras tabelas exigem tenant e vínculo ativo.

FKs compostas: Company/Branch, Branch/Warehouse, Membership/BranchAccess e vínculos de perfis.
Não há exclusão comercial em cascata. O seed só funciona em banco vazio.

Auditoria não possui snapshots pessoais, apenas IDs, ação, requestId e instante.
O cadastro de depósito aceita somente name/code; tenant e filial vêm do contexto validado.
