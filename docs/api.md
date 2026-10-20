# API — entrega 01

Backend local: `http://127.0.0.1:3001`. Navegador usa proxy do Next em `http://localhost:3000/api`.
OpenAPI em desenvolvimento: `http://127.0.0.1:3001/api/docs`.

| Método e rota | Autorização | Comportamento |
|---|---|---|
| POST /api/auth/sign-in/email | Origin confiável + credenciais | Login Better Auth |
| POST /api/auth/sign-out | Origin confiável + sessão | Revoga sessão |
| GET /api/v1/auth/me | Sessão | Identidade mínima |
| GET /api/v1/me/tenants | Sessão | Tenants com membership ativo |
| GET /api/v1/branches | organization.read + x-tenant-id | Somente filiais autorizadas |
| GET /api/v1/context | organization.read + tenant/filial | Contexto e permissões efetivas |
| GET /api/v1/warehouses | organization.read + tenant/filial | Até 200 depósitos |
| POST /api/v1/warehouses | warehouses.create + tenant/filial + Origin | Criação e auditoria atômicas |
| GET /api/v1/audit-logs | audit.read + tenant/filial | Últimas 50 atividades |
| GET /api/v1/health | Pública | Processo vivo |
| GET /api/v1/ready | Pública | Banco responde |

Headers comerciais: `x-tenant-id` e `x-branch-id`. São seletores não confiáveis até autorização.
POST de depósito: `{ "name": "Estoque loja", "code": "LOJA" }`.
Campos extras são rejeitados; código admite A–Z, 0–9, _ e -, até 30 caracteres.

Erros: 400 entrada inválida, 401 sem sessão, 403 acesso/origem negados, 409 código duplicado, 500 erro sanitizado.
Erros Nest contêm `error.code`, `error.message`, `error.requestId`. Endpoints Better Auth preservam o contrato da biblioteca; o frontend trata os dois formatos.

Não há PATCH de status nem exclusão nesta entrega. Paginação completa de auditoria/depósitos é pendência, e os limites são mostrados na interface.
