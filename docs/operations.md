# Operação local e limites

Este pacote não foi publicado e não deve ser usado com dados reais antes da homologação.
API escuta loopback. Para deploy, definir infraestrutura, TLS, proxy confiável, segredos, backup e observabilidade antes de alterar o bind.

## Credenciais
Compose contém senhas públicas exclusivamente locais. Nunca reutilizá-las fora da máquina.
DATABASE_URL é varejo_app; MIGRATION_DATABASE_URL é varejo_owner.
No Compose, o usuário bootstrap do PostgreSQL é superusuário. O runtime é separado, sem bypass.
Não disponibilize credencial de migration ao processo runtime em produção.

## Backup
Antes de alterações com dados importantes, executar pg_dump em formato customizado com uma conta operacional apropriada.
Restaurar em banco separado com pg_restore e executar testes de integridade.
Não foi executado teste de restauração nesta entrega. Não há alegação de backup automatizado.
Nunca apagar o volume do Compose para corrigir uma migration sem revisar os dados existentes.

## Limites atuais
Rate limiting em memória, adequado apenas à execução local de instância única.
Sem e-mail transacional, onboarding, convites ou reset disponível na interface.
Sem lockfile, build ou homologação até resolver instalação e disponibilidade do PostgreSQL.
Sem auditoria de login/logout nesta entrega; auditoria cobre criação de depósito.
CSS responsivo implementado, mas ainda sem inspeção visual em navegador.
