# Arquitetura e decisões — entrega 01

## Escopo implementado em código
Next.js App Router → proxy same-origin → NestJS/Express → Better Auth + Prisma → PostgreSQL.
Sessão em cookie HttpOnly; seleção de tenant/filial na URL e em headers validados pelo backend.
Sem regras de negócio ou acesso direto a banco no frontend.

O monólito começa com o módulo de organização. Workers, Redis, S3, contratos gerados e pacotes de domínio serão adicionados quando houver casos de uso que precisem deles; não há pastas vazias simulando implementação.

## Isolamento
- Identidades e sessões globais pertencem ao Better Auth.
- Membership e Tenant formam um diretório protegido por RLS baseada em `app.user_id`.
- Tabelas comerciais usam `tenantId`, FKs compostas e RLS.
- `asUser` abre transação e configura o usuário localmente.
- `inTenant` verifica membership e tenant ativo, configura tenant apenas nessa transação.
- Serviços verificam permissão e filial antes de acessar a operação.
- Todas as consultas comerciais usam o cliente transacional. Não exportar consultas comerciais feitas diretamente pelo cliente global para novos serviços.
- Runtime PostgreSQL não possui tabelas, não é superusuário e não tem BYPASSRLS. A API verifica isso na inicialização.
- Migrations/seed possuem credencial separada; essa credencial nunca deve iniciar a API.
- RLS protege tenant, enquanto permissões de filial são verificadas no serviço.

## Autenticação
Better Auth com adaptador Prisma e hash padrão da biblioteca (scrypt). Não há criptografia própria.
Registro público desabilitado; seed fornece apenas contas fictícias de desenvolvimento.
Sessões expiram em 8 horas; renovação configurada na biblioteca; cache de sessão desabilitado.
POSTs exigem Origin exato também antes do handler de autenticação.
Não há tokens em localStorage. O cookie é Secure em produção.

## Dados e transações
Criar depósito grava depósito e auditoria na mesma transação.
Código único por tenant/filial evita duplicação em reenvios; conflito retorna 409.
Histórico é somente append pelo papel runtime. Campos pessoais não são copiados no log.
Datas de infraestrutura são tratadas como UTC pela aplicação; o schema inicial usa timestamp padrão do Prisma. Antes dos documentos operacionais, padronizar tipos de instante com timestamptz e datas civis com date.

## Versões candidatas
Versões estão fixadas nos package.json; não há lockfile porque a rede não permitiu resolver os pacotes.
Node disponível: 24.16.0. Next 16.2.4 / React 19.2.0, Nest 11.1.8, Prisma 6.19.0, Better Auth 1.7.12, PostgreSQL 17.6.
São candidatas, não uma matriz homologada. Antes de deploy: instalação, audit de segurança, revisão dos patches suportados, build e testes completos.
Prisma 6 foi escolhido pela API convencional do client e compatibilidade com adaptador de autenticação; seu ciclo de suporte está próximo do fim e deve ser reavaliado antes de produção.

## Referências consultadas
- https://nextjs.org/blog/next-16-2
- https://better-auth.com/docs/adapters/prisma
- https://better-auth.com/docs/integrations/express
- https://docs.prisma.io/docs/orm/v6/reference/system-requirements
- https://www.postgresql.org/docs/17/ddl-rowsecurity.html

## Não concluído nesta entrega
Onboarding público, CRUD de empresas/filiais/usuários, convites, redefinição por e-mail, MFA e configuração de perfis via interface.
As estruturas de autorização existem, mas sua administração é provisionada apenas pelo seed local.
Também não há catálogo, estoque, PDV, financeiro, fiscal, cobrança SaaS ou deploy.
