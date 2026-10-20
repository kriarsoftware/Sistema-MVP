# Varejo360

Primeira entrega de um ERP SaaS multitenant, baseada no prompt fornecido.

**Estado:** código inicial criado; não homologado. O ambiente de criação bloqueou acesso ao npm e não possui PostgreSQL/Docker disponível. Build, login e isolamento ainda precisam ser executados e validados.

## O que foi criado
- Frontend Next.js com identidade visual própria e layout responsivo.
- Login Better Auth com sessões revogáveis.
- Seleção de organização e filial conforme permissões.
- NestJS com autorização por recurso.
- Schema Prisma e migration PostgreSQL com RLS.
- Cadastro de depósitos e auditoria na mesma transação.
- Seed fictício e testes unitários, de integração e E2E.

Produtos, compras, PDV, financeiro e fiscal são próximas entregas; não há operações fictícias apresentadas como prontas.

## Executar localmente
Requisitos: Node 22.12+ ou 24, pnpm e Docker com Compose (ou PostgreSQL 17 preparado manualmente).

Na pasta deste README:

```powershell
Copy-Item .env.example .env
```

Edite `.env`:
- Gere um segredo aleatório para BETTER_AUTH_SECRET, sem usar o placeholder.
- Defina DEMO_PASSWORD com pelo menos 12 caracteres.
- Defina ALLOW_DEMO_SEED=true apenas para o primeiro seed.

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
pnpm install
docker compose -f infra/compose.yaml up -d
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm dev
```

Depois do seed, volte ALLOW_DEMO_SEED para false.
Não execute seed em produção ou em banco com dados existentes.

Abra `http://localhost:3000`. Use localhost, e não 127.0.0.1 na barra do navegador, para coincidir com WEB_ORIGIN.

Contas fictícias:
- `admin@varejo360.test`: Aurora + Horizonte, todas as filiais demo.
- `operador@varejo360.test`: Aurora, somente Loja Centro, sem criação de depósitos/auditoria.

Senha: o valor definido por você em DEMO_PASSWORD.

Fluxo de validação:
Entrar → escolher organização → escolher filial → Depósitos → Novo depósito → recarregar → Histórico de atividades → Sair.

## Verificações
```powershell
pnpm --filter @varejo360/database validate
pnpm build
pnpm typecheck
pnpm test
pnpm test:integration
pnpm --filter @varejo360/web exec playwright install chromium
# Em outro terminal, com pnpm dev ativo e DEMO_PASSWORD definido:
pnpm test:e2e
```

Teste independente que não requer instalar pacotes:
```powershell
node --experimental-strip-types --test apps/api/test/security.test.ts
```

## Documentação
- [Arquitetura e limites](docs/architecture.md)
- [Modelo de dados](docs/data-model.md)
- [Permissões](docs/permission-matrix.md)
- [API](docs/api.md)
- [Testes](docs/testing.md)
- [Operação](docs/operations.md)
- [Plano de evolução](docs/roadmap.md)
- [Progresso e retomada](docs/progress.md)

As versões fixadas são candidatas. A ausência de instalação impediu gerar lockfile e verificar compatibilidade completa. Faça revisão de segurança das dependências e execute os gates antes de usar dados reais.
