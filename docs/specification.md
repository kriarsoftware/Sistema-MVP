# PROMPT MESTRE — IMPLEMENTAÇÃO DE ERP SAAS MULTITENANT PARA VAREJO

## 1. Papel, missão e forma de trabalhar

Atue como arquiteto de software, engenheiro full stack sênior, especialista em sistemas de varejo e responsável pela qualidade técnica.

Implemente um ERP SaaS multitenant para pequenas e médias empresas brasileiras de varejo, incluindo lojas de roupas, calçados, acessórios e produtos em geral.

O sistema deve ser funcionalmente inspirado em processos comuns de ERPs como o Linx Microvix, mas possuir identidade visual, código, arquitetura e experiência próprios. Não copie marcas, textos, telas ou ativos proprietários.

Nome provisório: **Varejo360**. Centralize esse nome em configuração para facilitar sua alteração.

Meu objetivo é obter um sistema real, executável, testável e preparado para evoluir. Não quero apenas telas demonstrativas, CRUDs desconectados ou operações financeiras simuladas apresentadas como integrações reais.

Trabalhe por entregas verticais: banco, regras de negócio, API, interface e testes do fluxo correspondente.

### Regras de execução

1. Examine o repositório e suas instruções antes de modificar arquivos.
2. Se não houver projeto, crie um monorepositório conforme esta especificação.
3. Apresente um plano curto e inicie a primeira etapa na mesma execução.
4. Faça escolhas técnicas razoáveis e registre as decisões.
5. Pergunte somente quando uma informação ausente impedir uma implementação correta.
6. Não implemente todas as fases de uma vez.
7. Não avance silenciosamente para recursos fora do MVP.
8. Não declare uma funcionalidade concluída quando houver apenas interface sem persistência e regras.
9. Não invente resultados de testes, homologações, credenciais ou integrações.
10. Não deixe TODOs em regras críticas de segurança, estoque, vendas ou financeiro.
11. Se uma dependência externa estiver indisponível, implemente seu contrato e um adaptador de desenvolvimento claramente identificado.
12. Documente pendências e limitações.
13. Ao terminar cada etapa, informe o que funciona, como executar, o que foi validado e o próximo passo.
14. Preserve o progresso em documentos do repositório para permitir continuação em outra sessão.
15. Não execute operações destrutivas em produção nem publique automaticamente sem autorização.

## 2. Objetivo do produto e limites

O ERP deve permitir que uma organização:

- Administre empresas e filiais.
- Cadastre produtos com variações e códigos de barras.
- Gerencie clientes e fornecedores.
- Compre mercadorias e receba produtos.
- Controle estoque e custos.
- Realize vendas em PDV online.
- Abra, movimente e feche caixas.
- Controle contas a receber e a pagar.
- Faça baixas, devoluções e estornos rastreáveis.
- Consulte relatórios operacionais.
- Gerencie usuários, permissões e auditoria.
- Contrate o software por assinatura, em uma fase posterior.

### Premissas iniciais

- País: Brasil.
- Idioma da interface: português brasileiro.
- Moeda inicial: BRL.
- Interface responsiva, com foco operacional em desktop.
- PDV online no MVP.
- Produtos físicos, sem fabricação no MVP.
- Um tenant pode possuir várias empresas; cada empresa pode possuir várias filiais.
- Um usuário pode participar de vários tenants.
- Catálogo compartilhado no tenant; preços, disponibilidade e operações podem variar por filial.
- Estoque segregado por filial e depósito.
- Toda quantidade deve respeitar a precisão da unidade de medida.
- Configuração de fuso horário por tenant ou filial.
- Datas operacionais devem respeitar o fuso da filial.

O MVP é operacional e gerencial. A emissão fiscal, TEF, conciliação automática e pagamentos integrados exigem etapas próprias.

Um comprovante gerencial não é documento fiscal. A documentação deve explicar essa limitação, e o sistema não pode apresentar o MVP como solução fiscal pronta para uso comercial em qualquer cenário.

## 3. Divisão de escopo

### MVP obrigatório

1. Autenticação e sessões.
2. Multitenancy e isolamento.
3. Empresas, filiais e depósitos.
4. Usuários, convites, perfis e permissões.
5. Produtos, variantes, unidades, marcas e categorias.
6. Clientes e fornecedores.
7. Tabelas de preços.
8. Compras e recebimento parcial.
9. Estoque, reservas, ajustes e histórico.
10. PDV online.
11. Pagamentos registrados manualmente.
12. Caixa e fechamento.
13. Contas a receber e a pagar.
14. Baixas parciais e estornos.
15. Devoluções parciais e totais.
16. Dashboard e relatórios básicos.
17. Auditoria.
18. Importação e exportação controladas.
19. Testes de isolamento, concorrência e integridade.
20. Ambiente local reproduzível e documentação.

### Fase 2 — Gestão ampliada

- Transferências entre filiais.
- Inventário com contagem cega.
- Orçamentos e pedidos comerciais.
- Promoções e regras comerciais.
- Comissão de vendedores.
- Aprovação de compras e descontos.
- Crédito de cliente e vale-troca.
- Conciliação bancária.
- Lotes, validade e números de série, se necessários.
- Assinaturas SaaS com cobrança integrada.
- MFA e recursos avançados de administração.

### Fase 3 — Fiscal e integrações

- Integração com provedor fiscal.
- NF-e e NFC-e conforme escopo definido.
- Cancelamento e demais eventos fiscais suportados.
- Integração Pix e adquirentes.
- TEF, se houver SDK e homologação aplicáveis.
- E-commerce e marketplaces.
- Webhooks e API pública.
- Integração contábil.

### Fase 4 — Escala e operação avançada

- PDV offline com estratégia explícita de sincronização.
- Omnichannel.
- Fidelidade.
- Franquias.
- BI avançado.
- Previsão de demanda.
- Reposição automática.
- Aplicativo de inventário.
- Isolamento dedicado para tenants específicos.

Mantenha as fases posteriores no roadmap. Não crie botões funcionais fictícios nem recursos incompletos expostos como disponíveis.

## 4. Arquitetura obrigatória

Use:

- Next.js com App Router no frontend.
- React e TypeScript em modo estrito.
- NestJS no backend.
- Prisma como ferramenta de acesso e migrations do banco.
- PostgreSQL como fonte primária dos dados.
- Redis e BullMQ para tarefas assíncronas quando necessárias.
- Armazenamento compatível com S3 para anexos.
- OpenAPI para documentação da API.
- Docker Compose para desenvolvimento.
- pnpm workspaces para o monorepositório.

Para a interface:

- Tailwind CSS.
- Componentes acessíveis, por exemplo shadcn/ui.
- React Hook Form.
- Zod para validações de formulário.
- TanStack Query para consultas interativas e invalidação de cache.
- Biblioteca de tabelas adequada a paginação no servidor.

Escolha versões estáveis e compatíveis no início da implementação. Registre versões exatas e mantenha lockfile. Não presuma APIs de uma versão diferente das dependências instaladas.

### Organização arquitetural

Adote um monólito modular.

- O Next.js implementa a interface e, quando necessário, uma camada de comunicação com a API.
- O NestJS concentra autorização, regras de negócio e transações.
- O frontend não acessa o banco diretamente.
- Não duplique regras financeiras em Server Actions.
- Workers utilizam os mesmos serviços de aplicação e contexto de tenant.
- Não introduza microserviços sem necessidade demonstrável.

Separe:

1. Apresentação: controllers, DTOs e interface.
2. Aplicação: casos de uso, autorização operacional e transações.
3. Domínio: estados, cálculos, invariantes e políticas.
4. Infraestrutura: banco, filas, arquivos e integrações.

Nos módulos simples, evite abstrações excessivas. Nos módulos críticos, mantenha regras testáveis sem depender da interface.

### Processamento síncrono e assíncrono

Devem ocorrer de forma atômica no banco:

- Confirmação de venda.
- Consumo de estoque.
- Registro financeiro correspondente.
- Registro de pagamento manual.
- Movimento de caixa pertinente.
- Registro de auditoria crítica.
- Persistência de evento de outbox, quando aplicável.

Devem ocorrer após o commit:

- E-mails.
- Exportações extensas.
- Notificações.
- Webhooks.
- Processamento de arquivos.
- Comunicação com serviços externos.

Não mantenha uma transação de banco aberta durante chamadas de rede.

## 5. Multitenancy, empresas e filiais

### Conceitos

- **Tenant:** organização cliente do SaaS.
- **Company:** empresa jurídica dentro do tenant.
- **Branch:** estabelecimento ou filial.
- **Warehouse:** depósito pertencente a uma filial.
- **User:** identidade de acesso global.
- **Membership:** vínculo do usuário com o tenant.
- **BranchAccess:** escopo de filiais permitido ao vínculo.

### Estratégia inicial

Use banco e schema compartilhados, com `tenantId` em todas as tabelas de negócio.

Não coloque `tenantId` em tabelas globais sem necessidade, como identidade global do usuário ou catálogo global de planos. Documente a classificação de cada tabela.

### Regras obrigatórias

1. Obtenha a identidade da sessão autenticada.
2. Valide o vínculo ativo com o tenant selecionado.
3. Valide o acesso à filial da operação.
4. Não confie em `tenantId` enviado no corpo da requisição.
5. Se houver seletor de tenant em header ou rota, trate-o apenas como seleção a ser validada.
6. Valide o tenant de todos os recursos referenciados.
7. Um ID válido de outro tenant nunca pode permitir leitura ou alteração.
8. Não use um tenant padrão como fallback.
9. Requisições sem contexto válido devem falhar de forma fechada.
10. Inclua tenant em chaves de cache, jobs, arquivos, eventos e índices de busca.

### Restrições no banco

Use chaves compostas para impedir relacionamentos cruzados:

- Pai com unicidade `(tenantId, id)`.
- Filho com FK `(tenantId, parentId)`.
- Quando necessário, inclua empresa e filial na restrição.

Exemplo conceitual:

- Uma venda não pode referenciar cliente de outro tenant.
- Um recebimento não pode apontar para item de outra compra.
- Um depósito não pode pertencer a uma filial de outra empresa.
- Uma devolução deve apontar para item da venda original dentro do mesmo tenant.

### Row Level Security

Implemente RLS como defesa adicional, além do escopo explícito na aplicação.

- Ative as políticas nas tabelas de negócio.
- Use papel de aplicação sem `BYPASSRLS` e sem propriedade das tabelas.
- Separe credenciais de migration e runtime.
- Considere `FORCE ROW LEVEL SECURITY` conforme o desenho.
- Configure o contexto por transação usando mecanismo local à transação.
- Nunca mantenha contexto de tenant preso a uma conexão reutilizada pelo pool.
- Execute todas as consultas protegidas dentro do contexto correto.
- Não considere RLS um substituto para permissões de filial.

Valide a estratégia com as versões reais de Prisma, driver e pool escolhidas. Use SQL parametrizado e migrations SQL quando necessário.

Teste especialmente a reutilização da mesma conexão entre tenants e a execução sem contexto.

## 6. Usuários, autenticação e permissões

### Perfis iniciais

- Administrador do tenant.
- Gerente.
- Operador de caixa.
- Vendedor.
- Estoquista.
- Comprador.
- Financeiro.
- Auditor.

Perfis são conjuntos configuráveis de permissões. Não espalhe verificações por nome do perfil no código.

### Permissões exemplificativas

- `products.read`
- `products.create`
- `products.update`
- `products.archive`
- `prices.update`
- `customers.read`
- `customers.update`
- `purchases.create`
- `purchases.receive`
- `inventory.read`
- `inventory.adjust`
- `sales.create`
- `sales.confirm`
- `sales.discount`
- `sales.cancel`
- `returns.create`
- `cash.open`
- `cash.withdraw`
- `cash.close`
- `finance.read`
- `finance.settle`
- `finance.reverse`
- `reports.export`
- `users.manage`
- `audit.read`

Combine permissão com tenant, filial, propriedade do recurso e estado do documento.

### Autenticação

Prefira biblioteca madura e compatível com a arquitetura. Evite criptografia ou protocolo de autenticação próprios.

Requisitos:

- Senhas protegidas por algoritmo adequado, como Argon2id.
- Sessões revogáveis.
- Cookies `HttpOnly`, `Secure` em produção e política `SameSite` apropriada.
- Proteção CSRF nas mutações autenticadas por cookie.
- Rotação ou renovação segura de sessão.
- Logout efetivo.
- Revogação após alteração de senha e eventos relevantes.
- Rate limiting.
- Recuperação de senha com token de uso único, armazenado por hash e com expiração.
- Convites vinculados a tenant e e-mail.
- Mensagens que evitem enumeração de usuários.
- Nenhuma senha ou token nos logs.
- Nenhuma credencial de sessão persistida em `localStorage`.

Proteja controllers, endpoints, Server Actions e serviços sensíveis. Esconder um botão não constitui autorização.

### Administração da plataforma

Separe a administração do SaaS da administração dos tenants.

Não permita que um administrador da plataforma consulte livremente todos os dados comerciais usando as mesmas rotas. Eventual acesso de suporte deve ter autorização explícita, escopo, duração e auditoria.

## 7. Módulos e telas

Para cada tela, implemente carregamento, estado vazio, erro, validação, falta de permissão e confirmação de ações críticas.

### Acesso e onboarding

Rotas:

- `/login`
- `/recuperar-senha`
- `/redefinir-senha`
- `/convites/[token]`
- `/selecionar-organizacao`
- `/onboarding`

Fluxo:

1. Autenticar.
2. Selecionar tenant, quando houver mais de um.
3. Selecionar filial autorizada.
4. Configurar empresa e filial inicial, quando necessário.
5. Criar depósito.
6. Configurar meios de pagamento e caixa.
7. Iniciar operação.

### Dashboard

Rota: `/dashboard`

Exibir, respeitando permissões:

- Vendas confirmadas no período.
- Devoluções.
- Valor líquido de vendas.
- Ticket médio com definição documentada.
- Produtos mais vendidos.
- Estoque abaixo do mínimo.
- Contas vencidas.
- Recebimentos e pagamentos previstos.
- Caixas abertos.
- Alertas operacionais.

Exibir período, filial e horário de atualização.

Não confundir venda realizada com dinheiro recebido.

### Cadastros

Rotas:

- `/cadastros/produtos`
- `/cadastros/produtos/novo`
- `/cadastros/produtos/[id]`
- `/cadastros/categorias`
- `/cadastros/marcas`
- `/cadastros/unidades`
- `/cadastros/clientes`
- `/cadastros/fornecedores`
- `/cadastros/tabelas-preco`

Produto com abas:

- Dados gerais.
- Variantes.
- Preços.
- Estoque por depósito.
- Histórico.
- Imagens.
- Dados fiscais preparatórios, quando aplicável.

Toda mercadoria vendável deve possuir uma variante. Produtos sem grade terão uma variante padrão.

Variante:

- SKU.
- Código de barras opcional.
- Cor e tamanho opcionais.
- Unidade.
- Precisão de quantidade.
- Peso e dimensões opcionais.
- Status.

Preserve zeros à esquerda dos códigos de barras.

### Compras

Rotas:

- `/compras/pedidos`
- `/compras/pedidos/novo`
- `/compras/pedidos/[id]`
- `/compras/recebimentos`
- `/compras/recebimentos/[id]`

Funcionalidades:

- Fornecedor.
- Filial e depósito.
- Itens e custos.
- Descontos e despesas.
- Previsão de entrega.
- Recebimentos parciais.
- Histórico.
- Geração de contas a pagar conforme política explícita.

### Estoque

Rotas:

- `/estoque/saldos`
- `/estoque/movimentacoes`
- `/estoque/ajustes`
- `/estoque/reservas`

Fase posterior:

- `/estoque/transferencias`
- `/estoque/inventarios`

Exibir:

- Saldo físico.
- Quantidade reservada.
- Quantidade disponível.
- Custo médio.
- Estoque mínimo.
- Origem de cada movimentação.

Ajustes exigem motivo e permissão específica.

### Vendas e PDV

Rotas:

- `/vendas`
- `/vendas/[id]`
- `/pdv`
- `/vendas/devolucoes`

PDV:

- Busca por código de barras, SKU e descrição.
- Inclusão por leitor que emula teclado.
- Identificação opcional de cliente.
- Vendedor.
- Carrinho.
- Quantidade.
- Desconto autorizado.
- Pagamento dividido.
- Troco somente para dinheiro.
- Finalização com proteção contra duplicidade.
- Comprovante gerencial.
- Consulta de vendas anteriores.

Não exponha custo e margem para usuários sem permissão.

### Caixa

Rotas:

- `/caixa/terminais`
- `/caixa/sessoes`
- `/caixa/sessoes/[id]`
- `/caixa/abrir`
- `/caixa/fechar`

Recursos:

- Abertura com fundo inicial.
- Suprimento.
- Sangria.
- Recebimento em dinheiro.
- Devolução em dinheiro.
- Conferência por meio de pagamento.
- Fechamento.
- Diferença e justificativa.
- Histórico do operador.

### Financeiro

Rotas:

- `/financeiro/receber`
- `/financeiro/pagar`
- `/financeiro/contas`
- `/financeiro/movimentacoes`
- `/financeiro/fluxo-caixa`

Recursos:

- Títulos.
- Parcelas.
- Vencimentos.
- Baixa parcial.
- Juros, multa e desconto explícitos.
- Estorno de baixa.
- Categorias financeiras.
- Contas financeiras.
- Extrato gerencial.
- Filtros por competência, vencimento e pagamento.

### Administração

Rotas:

- `/configuracoes/empresas`
- `/configuracoes/filiais`
- `/configuracoes/depositos`
- `/configuracoes/usuarios`
- `/configuracoes/perfis`
- `/configuracoes/pagamentos`
- `/configuracoes/auditoria`
- `/configuracoes/importacoes`

Na fase SaaS:

- `/configuracoes/assinatura`
- `/configuracoes/integracoes`

## 8. Fluxos de negócio obrigatórios

### 8.1 Produto até a venda

1. Cadastrar produto.
2. Criar variante.
3. Definir preço.
4. Receber estoque por compra ou ajuste autorizado.
5. Abrir caixa.
6. Localizar variante no PDV.
7. Informar quantidade.
8. Calcular valores no servidor.
9. Validar disponibilidade.
10. Registrar pagamentos.
11. Confirmar a venda.
12. Baixar estoque e produzir registros financeiros atomicamente.
13. Emitir comprovante gerencial.
14. Atualizar consultas e relatórios.

### 8.2 Compra até o recebimento

1. Criar pedido em rascunho.
2. Selecionar fornecedor.
3. Informar itens, quantidades e custos.
4. Confirmar pedido.
5. Registrar recebimento parcial ou total.
6. Impedir recebimento superior ao saldo pendente, salvo fluxo explícito de tolerância.
7. Registrar entrada no depósito.
8. Recalcular custo médio.
9. Criar obrigação financeira conforme política adotada.
10. Atualizar situação do pedido.

Política do MVP: gerar contas a pagar a partir de cada recebimento confirmado, com valor e vencimentos informados e rastreáveis.

Não gerar a mesma obrigação novamente ao confirmar o pedido. Documente essa simplificação e prepare evolução para faturas de fornecedor independentes.

### 8.3 Venda e pagamento manual

1. Caixa deve estar aberto.
2. Operador deve ter acesso à filial e ao terminal.
3. Backend valida itens, preços e descontos.
4. Backend calcula totais.
5. Operador informa meios e valores.
6. Finalização valida a composição financeira.
7. Transação registra venda, itens, estoque, títulos e liquidações.
8. Movimento de dinheiro afeta o caixa físico.
9. Registro manual de cartão ou Pix não significa confirmação pelo provedor.
10. Comprovante identifica adequadamente a natureza gerencial.

Para venda a prazo, o saldo não recebido deve gerar títulos com vencimentos. Não exija pagamento integral imediato quando a condição de venda permitir crédito.

### 8.4 Devolução

1. Localizar venda confirmada.
2. Selecionar itens e quantidades.
3. Validar saldo devolvível considerando devoluções anteriores.
4. Informar motivo.
5. Informar destino: estoque disponível ou depósito de avarias.
6. Calcular restituição com base nos valores históricos da venda.
7. Registrar devolução.
8. Reverter proporcionalmente valores e obrigações aplicáveis.
9. Registrar reembolso ou obrigação de reembolso.
10. Manter vínculo com a venda original.

Não use preço atual para calcular devolução de venda antiga.

No MVP, troca corresponde a devolução vinculada e nova venda. Não faça compensações financeiras silenciosas.

### 8.5 Fechamento de caixa

1. Bloquear novas movimentações durante o fechamento por estratégia transacional.
2. Apurar dinheiro esperado.
3. Solicitar valores contados.
4. Apurar diferenças.
5. Exigir justificativa conforme configuração.
6. Confirmar fechamento.
7. Tornar a sessão imutável.
8. Impedir vendas posteriores vinculadas à sessão encerrada.

Fórmula:

`dinheiro esperado = abertura + entradas em dinheiro + suprimentos − saídas em dinheiro − sangrias`

Pagamentos por cartão, Pix ou a prazo não aumentam o dinheiro físico esperado.

### 8.6 Baixa financeira

1. Selecionar título aberto.
2. Informar valor, data, conta e meio.
3. Validar saldo em transação.
4. Registrar liquidação.
5. Registrar movimento na conta.
6. Atualizar saldo e estado.
7. Permitir estorno por lançamento compensatório.
8. Preservar histórico.

## 9. Estados e transições

Modele estados explicitamente. Não permita alterar status por um PATCH genérico.

### Pedido de compra

- `DRAFT`
- `CONFIRMED`
- `PARTIALLY_RECEIVED`
- `RECEIVED`
- `CANCELLED`

Pedido parcialmente recebido permite cancelar apenas o saldo pendente. Recebimentos existentes exigem reversão própria.

### Recebimento

- `DRAFT`
- `POSTED`
- `REVERSED`

### Venda

- `DRAFT`
- `CONFIRMED`
- `VOIDED`

Situação de devolução deve ser separada ou calculada:

- `NONE`
- `PARTIAL`
- `FULL`

`VOIDED` exige fluxo compensatório. Não pode apagar venda nem ignorar pagamentos, devoluções ou documentos fiscais.

### Devolução

- `DRAFT`
- `POSTED`
- `REVERSED`

### Caixa

- `OPEN`
- `CLOSED`

Se usar estado intermediário de fechamento, defina recuperação após falha.

### Título financeiro

- `OPEN`
- `PARTIALLY_SETTLED`
- `SETTLED`
- `CANCELLED`

Atraso é condição derivada de vencimento e saldo, e não substitui a situação de liquidação.

### Integrações de pagamento futuras

- `PENDING`
- `AUTHORIZED`
- `CAPTURED`
- `FAILED`
- `CANCELLED`
- `PARTIALLY_REFUNDED`
- `REFUNDED`

Não reutilize estados de integração para fingir validação de pagamentos manuais.

## 10. Valores, estoque e concorrência

### Valores monetários

- Não use ponto flutuante binário para cálculos financeiros.
- Use `Decimal` e colunas numéricas adequadas.
- Serialize decimais como strings na API.
- Valores monetários finais: duas casas para BRL.
- Custos e preços intermediários podem exigir maior precisão.
- Quantidades: até seis casas, limitadas pela unidade.
- Defina arredondamento explicitamente.
- Centralize cálculos em funções testadas.
- Distribua resíduos de arredondamento deterministicamente.

Sugestão:

- Valores finais: `Decimal(19,2)`.
- Custo unitário e preço intermediário: `Decimal(19,6)`.
- Quantidade: `Decimal(19,6)`.

### Totalização

Documente a ordem:

1. Quantidade × preço.
2. Desconto do item.
3. Rateio do desconto global.
4. Rateio de acréscimos aplicáveis.
5. Arredondamento e fechamento dos totais.

O servidor recalcula tudo. Totais enviados pelo navegador não são confiáveis.

Armazene snapshots de SKU, descrição, unidade, preço, descontos e custo de saída nos itens históricos.

### Estoque

Use:

- Ledger imutável de movimentações.
- Tabela de saldo para consulta e atualização eficiente.
- Reservas separadas.
- Vínculo com documento de origem.

`disponível = físico − reservado`

Não permita saldo negativo no MVP.

Nunca use apenas “ler saldo, verificar e atualizar” sem controle de concorrência.

Implemente bloqueio de linha ou atualização condicional atômica, com criação segura de saldos e verificação do número de linhas alteradas.

Adquira bloqueios em ordem determinística para reduzir deadlocks. Defina retry limitado para conflitos recuperáveis.

### Custo médio

Use custo médio ponderado móvel por variante e depósito.

`novo custo médio = (valor anterior + valor da entrada) ÷ nova quantidade`

Defina:

- Custo de entrada e rateio de despesas.
- Custo de saída capturado na venda.
- Devolução de venda pelo custo histórico de saída.
- Comportamento quando saldo chega a zero.
- Reversões sem reescrever movimentos posteriores.
- Proibição de retroatividade não controlada no MVP.

Armazene quantidade e valor das movimentações para permitir reconciliação.

### Idempotência

Exija `Idempotency-Key` em operações críticas:

- Confirmar venda.
- Postar recebimento.
- Efetuar devolução.
- Baixar título.
- Estornar baixa.
- Fechar caixa.
- Processar eventos externos.

A chave deve ser associada a tenant, operação e identidade ou contexto autorizado.

Armazene hash do payload, resultado e situação.

- Mesma chave e mesmo payload: retornar resultado original.
- Mesma chave e payload diferente: responder conflito.
- Requisições simultâneas com a mesma chave: apenas uma operação.
- Falha da operação: não deixar efeitos parciais nem sucesso fictício.

A deduplicação de negócio deve permanecer mesmo após eventual expiração do registro de idempotência.

## 11. Modelo de dados

Implemente o schema Prisma completo das entidades do MVP. Crie migrations SQL complementares para RLS, índices parciais, constraints e recursos não expressáveis diretamente.

Não crie todas as tabelas futuras sem uso. Documente seu desenho e adicione-as na fase correspondente.

### Convenções

Nas entidades do tenant:

- `id`
- `tenantId`
- `createdAt`
- `updatedAt`, quando mutáveis
- `createdById`, quando aplicável
- `version`, quando houver controle otimista

Use identificadores opacos consistentes.

Datas de vencimento devem ser datas civis. Instantes de eventos devem ser armazenados com timezone adequado, preferencialmente em UTC.

### Identidade e organização

- `User`: e-mail normalizado, nome, status.
- `AuthIdentity`: vínculo com mecanismo de autenticação escolhido.
- `Session`: usuário, expiração, revogação e metadados mínimos.
- `Tenant`: nome, slug, status, moeda e fuso.
- `Membership`: tenant, usuário, status.
- `Invitation`: tenant, e-mail, tokenHash, expiração, situação.
- `Role`: tenant, nome.
- `Permission`: código global.
- `RolePermission`: perfil e permissão.
- `MembershipRole`: vínculo e perfil.
- `Company`: tenant, razão social, nome fantasia, documento.
- `Branch`: tenant, empresa, código, nome, endereço e fuso.
- `BranchAccess`: vínculo e filial.
- `Warehouse`: tenant, filial, código, nome, tipo e status.
- `TenantSettings`: configurações validadas e versionadas.

Evite duplicar tabelas que a biblioteca de autenticação já forneça.

### Cadastros

- `Customer`: nome, tipo, documento opcional, contatos e status.
- `CustomerAddress`: cliente e endereço.
- `Supplier`: nome, documento, contatos e status.
- `SupplierAddress`: fornecedor e endereço.
- `Category`: nome e categoria pai opcional.
- `Brand`: nome.
- `UnitOfMeasure`: código, nome, precisão e quantidade fracionável.
- `Product`: nome, descrição, categoria, marca e status.
- `ProductVariant`: produto, SKU, atributos, unidade e status.
- `ProductBarcode`: variante, código e tipo.
- `ProductImage`: produto ou variante, chave do objeto e ordenação.
- `PriceList`: nome, moeda, vigência e status.
- `PriceListItem`: tabela, variante e preço.
- `BranchPriceList`: filial, tabela e prioridade.
- `StockPolicy`: filial ou depósito, variante e estoque mínimo.

Use atributos de variantes bem definidos. Não use JSON como substituto de relacionamentos críticos.

### Estoque

- `InventoryBalance`: depósito, variante, físico, reservado, custo médio e versão.
- `InventoryMovement`: depósito, variante, quantidade com sinal, custo, valor, tipo, documento de origem, movimento revertido e instante.
- `InventoryReservation`: depósito, variante, quantidade, origem, expiração e estado.
- `InventoryAdjustment`: depósito, motivo, estado e responsável.
- `InventoryAdjustmentItem`: ajuste, variante, quantidade e custo aplicável.

O ledger não deve aceitar edição ou exclusão pelo papel normal da aplicação. Correções são novos movimentos.

### Compras

- `PurchaseOrder`: fornecedor, filial, estado, datas e totais.
- `PurchaseOrderItem`: pedido, variante, quantidade, custo e descontos.
- `GoodsReceipt`: pedido, depósito, estado, data e totais.
- `GoodsReceiptItem`: recebimento, item do pedido, quantidade e custo de entrada.
- `PurchaseExpense`: recebimento, tipo, valor e critério de rateio.

### Vendas

- `Sale`: filial, caixa, cliente opcional, vendedor, número, estado e totais.
- `SaleItem`: venda, variante, quantidade, snapshots, descontos, valor líquido e custo histórico.
- `SalePayment`: venda, meio, valor aplicado, valor entregue, troco e natureza manual ou integrada.
- `SaleInstallment`: venda, número, vencimento, valor e título associado.
- `SalesReturn`: venda original, filial, motivo, estado e totais.
- `SalesReturnItem`: devolução, item original, quantidade, valor e destino.
- `Refund`: devolução, valor, meio, estado e referência financeira.

No MVP, uma linha de venda pode sair de um depósito definido para a operação. Se permitir múltiplos depósitos, crie entidade de alocação de estoque por item.

### Caixa

- `CashRegister`: filial, código, nome e status.
- `CashSession`: terminal, operador, abertura, fechamento, valores e estado.
- `CashMovement`: sessão, tipo, meio, valor, origem e motivo.
- `CashCount`: sessão, meio, valor esperado, declarado e diferença.

Use índice único parcial para impedir mais de uma sessão aberta por terminal.

### Financeiro

- `FinancialAccount`: filial ou empresa, nome, tipo, moeda e status.
- `FinancialCategory`: nome, natureza e hierarquia.
- `FinancialTitle`: direção `RECEIVABLE` ou `PAYABLE`, contraparte, origem, emissão, competência, vencimento, valor e estado.
- `Settlement`: direção, conta, data, valor, meio e eventual estorno.
- `SettlementAllocation`: baixa, título, principal, juros, multa e desconto.
- `FinancialMovement`: conta, entrada ou saída, valor, origem e movimento revertido.

Registre explicitamente a diferença entre:

- Receita de venda.
- Direito a receber.
- Recebimento.
- Entrada em conta financeira.
- Dinheiro físico do caixa.

Esses registros representam aspectos relacionados da mesma operação; relatórios não podem somá-los como receitas distintas.

### Infraestrutura e governança

- `AuditLog`: ator, tenant, filial, ação, entidade, ID, campos alterados sanitizados e requestId.
- `IdempotencyRecord`: escopo, chave, hash, estado e resultado.
- `OutboxEvent`: evento, agregado, versão, payload, tentativas e situação.
- `ProcessedEvent`: consumidor e evento processado.
- `Attachment`: chave do arquivo, tipo, tamanho e proprietário.
- `ImportJob`: tipo, arquivo, progresso, resultado e erros.
- `ExportJob`: filtros, solicitante, estado e arquivo.
- `DocumentSequence`: tenant, filial, tipo e próximo número.

### Entidades futuras

- Transferências e itens.
- Inventários e contagens.
- Promoções.
- Comissões.
- Crédito de cliente.
- Assinatura, plano, limites e eventos de cobrança.
- Integrações e credenciais criptografadas.
- Documentos e eventos fiscais.
- Intenções e eventos de pagamento.

### Restrições obrigatórias

- Membership único por tenant e usuário.
- SKU único por tenant.
- Código de barras único por tenant quando presente.
- Saldo único por tenant, depósito e variante.
- Item de preço único por tabela e variante.
- Número de documento único no escopo definido.
- Valores e quantidades dentro dos limites válidos.
- FKs compostas para integridade entre tenants.
- Sem cascata destrutiva em documentos comerciais.
- Produtos e pessoas referenciados devem ser arquivados, preservando histórico.
- Quantidade devolvida nunca superior ao saldo devolvível, com validação concorrente.
- Total liquidado nunca superior ao saldo permitido, com validação concorrente.

Não confie em constraints `CHECK` para regras que dependam de somas em outras linhas; implemente essas regras transacionalmente.

## 12. APIs e contratos

Prefixo: `/api/v1`.

Use REST com contratos OpenAPI.

### Convenções

- IDs como strings.
- Decimais como strings.
- Instantes em ISO 8601.
- Datas civis em `YYYY-MM-DD`.
- Paginação no servidor.
- Ordenação por campos permitidos.
- Limite máximo de página.
- Filtros validados.
- DTOs explícitos.
- Campos desconhecidos rejeitados quando apropriado.
- Nenhuma exposição direta de modelos completos do ORM.

Resposta de erro:

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Estoque insuficiente para concluir a venda.",
    "details": [
      {
        "field": "items",
        "message": "Um dos produtos não possui quantidade disponível."
      }
    ],
    "requestId": "identificador-da-requisicao"
  }
}
```

Não vaze dados de outro tenant nas mensagens.

### Endpoints principais

Autenticação:

- `POST /auth/login`
- `POST /auth/logout`
- `GET /auth/me`
- `POST /auth/password/forgot`
- `POST /auth/password/reset`
- `GET /auth/sessions`
- `DELETE /auth/sessions/:id`

Organização:

- `GET /me/tenants`
- `GET /companies`
- `POST /companies`
- `GET /branches`
- `POST /branches`
- `GET /warehouses`
- `POST /warehouses`
- `GET /memberships`
- `POST /invitations`
- `PATCH /memberships/:id`

Cadastros:

- `GET /products`
- `POST /products`
- `GET /products/:id`
- `PATCH /products/:id`
- `POST /products/:id/archive`
- `POST /products/:id/variants`
- `GET /variants/lookup?barcode=...`
- `GET /customers`
- `POST /customers`
- `GET /suppliers`
- `POST /suppliers`
- `GET /price-lists`
- `POST /price-lists`

Compras:

- `POST /purchase-orders`
- `GET /purchase-orders`
- `GET /purchase-orders/:id`
- `PATCH /purchase-orders/:id`
- `POST /purchase-orders/:id/confirm`
- `POST /purchase-orders/:id/cancel-remainder`
- `POST /goods-receipts`
- `POST /goods-receipts/:id/post`
- `POST /goods-receipts/:id/reverse`

Estoque:

- `GET /inventory/balances`
- `GET /inventory/movements`
- `POST /inventory/adjustments`
- `POST /inventory/adjustments/:id/post`
- `GET /inventory/reservations`

Vendas:

- `POST /sales`
- `GET /sales`
- `GET /sales/:id`
- `PATCH /sales/:id`
- `POST /sales/:id/quote`
- `POST /sales/:id/confirm`
- `POST /sales/:id/void`
- `POST /sales/:id/returns`
- `POST /sales-returns/:id/post`

Caixa:

- `GET /cash-registers`
- `POST /cash-sessions/open`
- `GET /cash-sessions/:id`
- `POST /cash-sessions/:id/supply`
- `POST /cash-sessions/:id/withdraw`
- `POST /cash-sessions/:id/close`

Financeiro:

- `GET /financial-titles`
- `POST /financial-titles`
- `GET /financial-titles/:id`
- `POST /settlements`
- `POST /settlements/:id/reverse`
- `GET /financial-accounts`
- `GET /financial-movements`
- `GET /reports/cash-flow`

Governança:

- `GET /audit-logs`
- `POST /imports/products`
- `GET /imports/:id`
- `POST /exports`
- `GET /exports/:id`
- `GET /reports/sales`
- `GET /reports/inventory`
- `GET /reports/financial-aging`

Documente para cada endpoint:

- Permissão.
- Escopo de filial.
- Payload.
- Resposta.
- Erros.
- Idempotência.
- Efeitos transacionais.

## 13. Estrutura do repositório

Adote estrutura semelhante a:

```text
varejo360/
├── apps/
│   ├── web/
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (public)/
│   │   │   │   │   ├── login/
│   │   │   │   │   └── recuperar-senha/
│   │   │   │   ├── (erp)/
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── cadastros/
│   │   │   │   │   ├── compras/
│   │   │   │   │   ├── estoque/
│   │   │   │   │   ├── vendas/
│   │   │   │   │   ├── caixa/
│   │   │   │   │   ├── financeiro/
│   │   │   │   │   └── configuracoes/
│   │   │   │   └── (pos)/pdv/
│   │   │   ├── features/
│   │   │   │   ├── auth/
│   │   │   │   ├── products/
│   │   │   │   ├── purchases/
│   │   │   │   ├── inventory/
│   │   │   │   ├── sales/
│   │   │   │   ├── cash/
│   │   │   │   └── finance/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── lib/
│   │   │   └── providers/
│   │   └── tests/
│   ├── api/
│   │   ├── src/
│   │   │   ├── main.ts
│   │   │   ├── app.module.ts
│   │   │   ├── common/
│   │   │   │   ├── auth/
│   │   │   │   ├── tenant/
│   │   │   │   ├── permissions/
│   │   │   │   ├── errors/
│   │   │   │   ├── idempotency/
│   │   │   │   └── observability/
│   │   │   └── modules/
│   │   │       ├── auth/
│   │   │       ├── tenancy/
│   │   │       ├── organization/
│   │   │       ├── users/
│   │   │       ├── catalog/
│   │   │       ├── customers/
│   │   │       ├── suppliers/
│   │   │       ├── pricing/
│   │   │       ├── purchasing/
│   │   │       ├── inventory/
│   │   │       ├── sales/
│   │   │       ├── returns/
│   │   │       ├── cash/
│   │   │       ├── finance/
│   │   │       ├── reporting/
│   │   │       ├── audit/
│   │   │       └── files/
│   │   └── test/
│   └── worker/
│       ├── src/
│       │   ├── main.ts
│       │   └── jobs/
│       │       ├── outbox/
│       │       ├── imports/
│       │       ├── exports/
│       │       └── notifications/
│       └── test/
├── packages/
│   ├── database/
│   │   ├── prisma/
│   │   │   ├── schema.prisma
│   │   │   ├── migrations/
│   │   │   └── seed.ts
│   │   └── src/
│   │       ├── client.ts
│   │       └── tenant-transaction.ts
│   ├── contracts/
│   ├── api-client/
│   ├── domain/
│   ├── application/
│   ├── ui/
│   ├── config/
│   └── test-utils/
├── infra/
│   ├── docker/
│   └── compose.yaml
├── docs/
│   ├── architecture.md
│   ├── domain-rules.md
│   ├── data-model.md
│   ├── permission-matrix.md
│   ├── api.md
│   ├── security.md
│   ├── testing.md
│   ├── operations.md
│   ├── roadmap.md
│   ├── progress.md
│   └── adr/
├── .github/workflows/
├── .env.example
├── package.json
├── pnpm-workspace.yaml
└── README.md
```

Nos módulos críticos, use:

```text
sales/
├── presentation/
│   ├── sales.controller.ts
│   └── dto/
├── application/
│   ├── create-sale.use-case.ts
│   ├── quote-sale.use-case.ts
│   ├── confirm-sale.use-case.ts
│   └── void-sale.use-case.ts
├── domain/
│   ├── sale-state.ts
│   ├── sale-calculator.ts
│   └── sale-policies.ts
├── infrastructure/
│   └── sales.repository.ts
├── sales.module.ts
└── tests/
```

Ajuste a localização de serviços compartilhados entre API e worker sem duplicar lógica e sem criar dependências circulares.

Não exponha o pacote de banco ao bundle do navegador.

## 14. Segurança e privacidade

Requisitos:

- Validação de entrada no backend.
- Autorização por operação e recurso.
- Proteção contra IDOR.
- Queries parametrizadas.
- Nenhum SQL montado por concatenação de dados do usuário.
- Proteção contra mass assignment.
- CORS restrito.
- Cabeçalhos de segurança.
- CSP compatível com a aplicação.
- Limites de upload e requisição.
- Verificação de tipo real de arquivo.
- URLs assinadas de curta duração.
- Arquivos privados por padrão.
- Segredos fora do repositório.
- Criptografia de credenciais de integração com gestão adequada de chaves.
- Sanitização de logs e erros.
- Proteção de exportações CSV contra interpretação de fórmulas.
- Política de retenção de arquivos e dados.
- Auditoria de alterações de permissões.
- Dependências verificadas no pipeline.

Não armazene dados completos de cartão nem CVV.

Para privacidade:

- Minimize dados pessoais.
- Documente finalidade e retenção.
- Implemente exportação autorizada.
- Planeje anonimização compatível com vínculos históricos e obrigações aplicáveis.
- Não prometa conformidade legal automática.
- Regras legais e fiscais devem ser verificadas em fontes oficiais na fase de implementação correspondente.

Auditoria não deve copiar senhas, tokens, documentos completos ou payloads pessoais indiscriminadamente.

## 15. Filas, outbox e integrações

Implemente transactional outbox para eventos que precisem sobreviver a falhas entre banco e fila.

Fluxo:

1. Operação grava dados e evento na mesma transação.
2. Dispatcher publica o evento.
3. Worker processa.
4. Consumidor deduplica.
5. Falhas geram retry limitado.
6. Falhas persistentes ficam visíveis para intervenção.

Assuma entrega pelo menos uma vez. Não prometa processamento exatamente uma vez sem deduplicação.

Jobs devem carregar contexto de tenant validado. Não use papel superusuário para simplificar processamento.

Para webhooks futuros:

- Valide assinatura.
- Preserve corpo necessário à validação.
- Deduplicate pelo identificador externo.
- Trate eventos fora de ordem.
- Aplique limites e proteção contra replay quando suportados.
- Não confie no redirecionamento do navegador como confirmação de pagamento.

## 16. Experiência de uso

- Layout administrativo consistente.
- Menu lateral por módulos.
- Cabeçalho com tenant, filial e usuário.
- Troca de filial explícita.
- PDV com menos distrações.
- Busca e filtros previsíveis.
- Paginação no servidor.
- Formulários com erros junto aos campos.
- Atalhos documentados e sem conflitos essenciais.
- Navegação por teclado.
- Foco visível.
- Contraste adequado.
- Rótulos acessíveis.
- Confirmação antes de ações irreversíveis.
- Prevenção de perda de formulário.
- Botões bloqueados durante envio, sem depender disso para idempotência.
- Layout utilizável em resoluções comuns de balcão.
- Datas, moeda e números formatados em pt-BR.

Quando o usuário trocar de tenant ou filial:

- Invalide caches dependentes.
- Cancele requisições obsoletas.
- Não reaproveite carrinho em outra filial.
- Não mostre temporariamente dados do contexto anterior.
- Peça tratamento explícito de rascunhos pendentes.

## 17. Relatórios e definições

Implemente no MVP:

1. Vendas por período.
2. Vendas por produto.
3. Vendas por vendedor.
4. Pagamentos registrados por meio.
5. Devoluções.
6. Estoque disponível e mínimo.
7. Movimentações de estoque.
8. Contas vencidas e a vencer.
9. Fluxo de caixa previsto e realizado.
10. Fechamento de caixa.
11. Margem bruta gerencial, quando os custos forem confiáveis.

Defina cada métrica:

- Vendas confirmadas excluem rascunhos.
- Devoluções possuem data própria.
- Relatórios devem distinguir valor original e efeito de devoluções.
- Fluxo realizado usa liquidações.
- Fluxo previsto usa saldos e vencimentos.
- Custo das mercadorias vendidas usa snapshots históricos.
- Margem bruta não equivale a lucro líquido.
- Estornos não podem ser contados como nova receita ou despesa sem sinal apropriado.

Filtros e totais da exportação devem coincidir com o relatório exibido.

Não calcule relatórios grandes no navegador.

## 18. SaaS, assinatura e limites

Prepare contratos de domínio no MVP; implemente cobrança real na fase correspondente.

Modelo:

- Plano.
- Assinatura.
- Situação.
- Limites.
- Funcionalidades habilitadas.
- Eventos do provedor de cobrança.

Limites possíveis:

- Filiais.
- Usuários ativos.
- Armazenamento.
- Integrações.
- Recursos avançados.

Valide limites no servidor e sob concorrência.

Não determine funcionalidades apenas pelo nome textual do plano.

Não apague dados por inadimplência. Defina política de carência, restrição e exportação.

Suspensão administrativa e indisponibilidade do provedor de cobrança devem ser estados distintos.

## 19. Testes e critérios de aceite

Use:

- Testes unitários para cálculos e políticas.
- Testes de integração com PostgreSQL real.
- Testes de API.
- Playwright para fluxos essenciais.
- Testes de concorrência.
- Testes de isolamento entre tenants e filiais.

Não substitua testes de isolamento por mocks de repositório.

### Cenário A — Isolamento

Dado um usuário do tenant A:

- Não consulta produtos do tenant B.
- Não altera registros do tenant B.
- Não referencia cliente do tenant B em sua venda.
- Não baixa anexos ou exportações do tenant B.
- Não encontra dados do tenant B em buscas e relatórios.
- Não acessa dados após trocar manualmente IDs.
- Não herda contexto de tenant anterior pelo pool.

### Cenário B — Concorrência de estoque

Dado saldo de uma unidade:

- Duas vendas simultâneas disputam a unidade.
- Apenas uma é confirmada.
- A outra recebe erro de negócio.
- Saldo final é zero.
- Apenas uma baixa e um conjunto financeiro são registrados.

### Cenário C — Idempotência

Dada uma confirmação reenviada com a mesma chave:

- Existe uma única venda confirmada.
- Existe uma única baixa correspondente.
- Não surgem títulos ou pagamentos duplicados.
- A resposta aponta para o mesmo resultado.
- Payload diferente com a mesma chave gera conflito.

### Cenário D — Recebimento parcial

Dado pedido de dez unidades:

- Receber quatro gera estoque de quatro.
- Pedido fica parcialmente recebido.
- Receber seis conclui o pedido.
- Nova tentativa de receber uma unidade falha.
- Contas a pagar não duplicam o valor já registrado.

### Cenário E — Venda a prazo

Dada venda de R$ 300:

- R$ 100 são recebidos imediatamente.
- R$ 200 são parcelados conforme condição.
- Caixa físico recebe apenas a parcela em dinheiro.
- Títulos representam corretamente o saldo.
- A venda não é contabilizada duas vezes.

### Cenário F — Devolução parcial

Dada venda de três unidades:

- Devolver uma repõe uma unidade no destino selecionado.
- O valor usa preço e descontos históricos.
- O custo revertido usa o custo histórico da saída.
- Devoluções acumuladas não ultrapassam três.
- Tentativas simultâneas respeitam esse limite.

### Cenário G — Financeiro

Dado título de R$ 100:

- Baixa de R$ 40 deixa saldo de R$ 60.
- Segunda baixa de R$ 60 liquida o título.
- Estornar a primeira reabre saldo de R$ 40.
- Histórico permanece.
- Baixas concorrentes não excedem o saldo.

### Cenário H — Caixa

Dada abertura de R$ 100, venda em dinheiro de R$ 50 e sangria de R$ 20:

- Dinheiro esperado é R$ 130.
- Venda de R$ 80 em cartão não altera esse valor.
- Fechamento registra diferença.
- Não permite novas vendas na sessão fechada.
- Fechamento concorrente com venda mantém integridade.

### Cenário I — Falha transacional

Dada falha durante a confirmação:

- Não sobra venda confirmada sem estoque.
- Não sobra estoque baixado sem venda.
- Não sobram títulos órfãos.
- Auditoria e outbox não afirmam sucesso inexistente.

### Cenário J — Valores e permissões

- Manipular total pelo navegador não altera o cálculo oficial.
- Desconto acima do limite exige autorização.
- Quantidade fracionária é rejeitada para unidade indivisível.
- Arquivar produto mantém vendas antigas legíveis.
- Usuário de uma filial não fecha caixa de outra sem acesso.

### Definição de pronto

Uma entrega só está concluída quando:

- Fluxo funciona pela interface.
- Dados persistem.
- Regras são aplicadas no servidor.
- Há isolamento correto.
- Migrations funcionam em banco novo e atualizado.
- Testes relevantes passam.
- Build, lint e verificação de tipos passam.
- Documentação foi atualizada.
- Não existem segredos no código.
- Não há mocks apresentados como integração real.
- Limitações estão explícitas.

## 20. Etapas de construção

### Etapa 0 — Especificação executável

Entregue:

- Decisões arquiteturais.
- Dependências e versões.
- Matriz de permissões.
- Modelo de dados.
- Estados e transições.
- Backlog por fluxo.
- Critérios de aceite.
- Plano de testes.
- Riscos e dúvidas realmente bloqueantes.

### Etapa 1 — Fundação segura

Implemente:

- Monorepositório.
- Ambiente local.
- Banco e migrations.
- Autenticação.
- Tenant, membership, empresa, filial e depósito.
- Contexto transacional de tenant.
- RLS.
- Permissões.
- Layout.
- Tratamento de erros.
- Auditoria básica.
- Testes de isolamento.

Não avance sem isolamento demonstrado.

### Etapa 2 — Catálogo e estoque inicial

Implemente:

- Produtos e variantes.
- Códigos de barras.
- Clientes e fornecedores.
- Preços.
- Ledger e saldo.
- Ajuste inicial.
- Consultas de estoque.

Aceite: cadastrar produto, inserir saldo autorizado e consultar seu histórico.

### Etapa 3 — Compras

Implemente:

- Pedido.
- Recebimento parcial.
- Rateio simples de despesas.
- Custo médio.
- Contas a pagar originadas do recebimento.
- Reversão controlada.

### Etapa 4 — PDV e caixa

Implemente:

- Abertura.
- Carrinho.
- Cálculo no servidor.
- Venda.
- Pagamentos manuais.
- Venda a prazo.
- Estoque atômico.
- Idempotência.
- Comprovante.
- Fechamento.

### Etapa 5 — Financeiro e devoluções

Implemente:

- Títulos.
- Baixas parciais.
- Estornos.
- Contas financeiras.
- Devoluções.
- Reembolsos.
- Conciliação interna entre vendas, estoque, títulos e caixa.

### Etapa 6 — Relatórios e operação

Implemente:

- Dashboard.
- Relatórios.
- Importação com validação.
- Exportação.
- Filas.
- Observabilidade.
- Backup e restauração documentados.
- Testes completos dos fluxos críticos.

### Etapa 7 — Evolução

Somente após o MVP:

- Inventário.
- Transferências.
- Assinaturas.
- Fiscal.
- Pagamentos integrados.
- E-commerce.
- Recursos avançados.

## 21. Dados de demonstração

Crie seed apenas para desenvolvimento e testes:

- Dois tenants.
- Usuário com acesso a apenas um tenant.
- Usuário com vínculos em ambos.
- Duas filiais no tenant principal.
- Depósitos distintos.
- Produtos simples e com grade.
- Clientes e fornecedores fictícios.
- Estoque inicial por movimentos.
- Compra parcialmente recebida.
- Venda à vista.
- Venda a prazo.
- Devolução parcial.
- Títulos vencidos e futuros.
- Caixa aberto e caixa fechado.

Use credenciais locais documentadas e bloqueie o seed de demonstração em produção.

Não utilize dados pessoais reais.

## 22. Operação, desempenho e manutenção

- Healthcheck e readiness separados.
- Logs estruturados com requestId.
- Métricas de erros, latência, filas e falhas de integração.
- Alertas para inconsistências financeiras e de estoque.
- Índices baseados nas consultas reais.
- Paginação e limites de exportação.
- Eliminação de consultas N+1.
- Pool de conexões configurado.
- Backup automatizado.
- Procedimento de restauração testado.
- Migrations executadas por processo controlado.
- Credenciais diferentes por ambiente.
- Estratégia de rollback da aplicação e compatibilidade de schema.
- Nenhuma migration destrutiva automática em produção.

Como meta inicial de teste, use massa com pelo menos dez mil variantes por tenant e carga concorrente documentada. Meça busca de produto e confirmação de venda; registre ambiente e percentis. Não afirme desempenho sem medição.

Estoque, caixa e financeiro devem continuar consistentes mesmo quando notificações, filas ou e-mails falharem.

## 23. Formato de entrega em cada execução

Ao trabalhar neste projeto:

1. Informe a etapa atual.
2. Liste brevemente o que será implementado.
3. Implemente os arquivos completos da etapa.
4. Execute verificações pertinentes.
5. Atualize `docs/progress.md`.
6. Informe os comandos necessários para executar.
7. Descreva o fluxo disponível para validação.
8. Relate testes executados e resultados reais.
9. Liste limitações e dependências externas.
10. Indique a próxima entrega.

Se o tempo ou contexto acabarem, deixe o projeto em estado coerente e registre exatamente onde continuar.

Não encerre dizendo apenas “estrutura pronta” se o fluxo prometido ainda não funcionar.

## 24. Instrução final para começar

Comece pela Etapa 0 e avance para a Etapa 1.

Antes de codificar, verifique a compatibilidade real das versões de Next.js, NestJS, Prisma, PostgreSQL e biblioteca de autenticação escolhidas.

Priorize nesta ordem:

1. Isolamento entre tenants.
2. Autorização.
3. Integridade transacional.
4. Estoque.
5. Valores financeiros.
6. Fluxos operacionais.
7. Usabilidade.
8. Desempenho medido.
9. Funcionalidades adicionais.

A primeira entrega deve permitir autenticar, selecionar uma organização e uma filial autorizadas e acessar uma estrutura administrativa funcional, com isolamento comprovado por testes.

O resultado final do MVP deve permitir executar, de ponta a ponta:

**cadastrar produto → receber compra → atualizar estoque → abrir caixa → vender → registrar recebimento ou parcela → devolver quando necessário → fechar caixa → consultar relatórios e auditoria.**