# Plano por entregas

0. Especificação: arquitetura, dados, permissões, contratos e plano de testes documentados.
1. Fundação: código inicial criado; execução e homologação pendentes de ambiente.
   Antes de concluir: validar dependências, migrations, RLS, login e E2E; completar administração e recuperação de acesso.
2. Catálogo/estoque: variantes, SKU, preços, ledger e saldo, ajuste autorizado.
3. Compras: recebimento parcial, custo médio, obrigação financeira sem duplicação.
4. PDV/caixa: confirmação atômica, idempotência, concorrência por última unidade, dinheiro físico separado.
5. Financeiro/devoluções: baixas parciais, lançamentos compensatórios, devolução histórica.
6. Operação: relatórios, importação, exportação, observabilidade e recuperação.
7. Evolução: fiscal, adquirentes, e-commerce, assinaturas e demais integrações.

Não avançar ao estoque até comprovar isolamento no banco.
Não apresentar comprovante gerencial como documento fiscal.
As próximas etapas devem preservar os critérios A–J do prompt fornecido em `specification.md`.
