# Matriz inicial

| Operação | Permissão | Administrador demo | Consulta demo | Escopo |
|---|---|---|---|---|
| Listar organizações | Sessão e membership ativo | Sim | Sim | Somente vínculos próprios |
| Listar filiais e consultar contexto | organization.read | Sim | Sim | Filiais explicitamente autorizadas |
| Listar depósitos | organization.read | Sim | Sim | Tenant + filial |
| Criar depósito | warehouses.create | Sim | Não | Tenant + filial |
| Ler auditoria | audit.read | Sim | Não | Tenant + filial |

Administrador demo tem acesso explícito às filiais dos dois tenants. Consulta demo só tem acesso à Loja Centro de Aurora.
Não há bypass implícito por nome do perfil.
Perfis de vendedor, financeiro, comprador e estoquista serão incluídos com os respectivos módulos.
