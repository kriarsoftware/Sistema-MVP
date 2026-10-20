# Validação

## Testes independentes
`node --experimental-strip-types --test apps/api/test/security.test.ts`
Verificam Origin e parsing seguro de seletores. Não provam autenticação nem isolamento de banco.

## Integração PostgreSQL
Depois de instalar, migrar e executar o seed:
`pnpm test:integration`

São 14 cenários com PostgreSQL real e credencial varejo_app, incluindo:
sem contexto, tenant alheio, filial alheia, permissão negada, pool com uma conexão,
rollback, FK composta, INSERT proibido e auditoria imutável.
Os testes exigem seed e não são substituídos por mocks ou ignorados quando o banco falta.
Gravações de teste são revertidas por transação.

## Interface/API
Com servidores em execução e DEMO_PASSWORD no ambiente:
`pnpm --filter @varejo360/web exec playwright install chromium`
`pnpm test:e2e`

Os testes criam depósito de verificação no banco demo (persistência intencional), validam auditoria,
logout efetivo, acesso por tenant/filial, permissão de escrita e rejeição de Origin.

## Gate de conclusão
Instalação + Prisma validate/generate + build + typecheck + integração + E2E.
Executar também revisão de segurança de dependências antes de deploy.
Sem PostgreSQL e dependências, a entrega é código preparado, não etapa homologada.
