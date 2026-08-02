# Contract — Server Mutations (Contrato de Mutações)

**Date**: 2026-08-01
**Source**: [spec.md](../spec.md) (FR-010 a FR-024, FR-026), [data-model.md](../data-model.md).

Mutações executadas exclusivamente via **Server Actions** (`src/lib/actions/`), que
revalidam sessão, cargo e propriedade **no servidor** (nunca confiar apenas no RLS do
frontend). Regra: pré-validação no servidor + RLS como segunda camada.

## Operações

### Autenticação
- `signIn(email, password)` — FR-001; erros genéricos ao usuário.
- `signOut()` — FR-006.
- `resetPassword(email)` / `updatePassword(token, novaSenha)` — FR-025.

### Produtos (admin: CRUD; vendedor: só SELECT)
- `createProduto(input)` / `updateProduto(id, input)` / `deleteProduto(id)` — FR-014;
  exigem `is_admin()`. `deleteProduto` respeita `ON DELETE RESTRICT` (FR-015): bloqueado
  com mensagem quando o produto está em `pedido_itens`.
- Validações (FR-021): `nome` e `categoria` obrigatórios, `preco > 0`, `estoque >= 0`.

### Clientes (admin: CRUD; vendedor: só SELECT)
- `createCliente` / `updateCliente` / `deleteCliente` — FR-014/FR-015 (mesmas regras).

### Pedidos
- `createPedido({cliente, data, itens[]})` — FR-010/FR-011/FR-022:
  1. Valida cliente e itens (produto existe, `qtd > 0`, `qtd <= estoque` — FR-021).
  2. Em transação: insere `pedidos` (total=0) + `pedido_itens`; calcula `total`; atualiza
     `total`; **decrementa `estoque`** dos produtos (Q1).
  3. `created_by = auth.uid()`.
- `updatePedido(id, {cliente, data, status, itens[]})` — FR-010/FR-013/FR-023/FR-024:
  bloqueado para pedidos `entregue`/`cancelado`; ajusta estoque pela diferença entre itens
  (reverte + reaplica) de forma atômica.
- `changeStatus(id, novoStatus)` — FR-013/FR-023: valida transição
  (`pendente→confirmado→entregue`; `cancelado` só de pendente/confirmado). `entregue` e
  `cancelado` são terminais. Cancelar reverte estoque (Q1).
- `deletePedido(id)` — FR-003/FR-014: **somente admin**; pedidos `entregue`/`cancelado`
  imutáveis não são excluíveis (FR-024); ao excluir pedido não terminal, reverte estoque.

### Listagens (FR-026)
- Queries de listagem paginadas (25 itens) via Server Components; filtros de pedidos por
  data/cliente/status (FR-012) aplicados no servidor; paginação preservada após filtro.

## Regras transversais

1. Toda Server Action inicia com verificação de sessão (`getUser()`) e, quando aplicável,
   `is_admin()`.
2. Transações: criação/edição de pedido + baixa/reversão de estoque + cálculo de total são
   atômicas — nunca estado intermediário.
3. Erros de negócio retornam mensagens claras (pt-BR) para toast (FR-019/FR-020); nunca
   detalhes de banco.
4. Idempotência esperada: reenvio de mesma ação não duplica registros (validações de
   integridade no servidor).
5. Nenhuma mutação é permitida para pedidos `entregue`/`cancelado` (FR-024), validado no
   servidor E garantido por trigger de segurança no banco.

## Verificação (quickstart)

- Vendedor tentando `deleteProduto`/`deletePedido`/`deleteCliente` → ação rejeitada no
  servidor com acesso negado.
- `createPedido` reduz `produtos.estoque`; `changeStatus(→cancelado)` restaura o estoque.
- `changeStatus` bloqueado para `pendente → entregue` (pula `confirmado`), a menos que a
  regra aprovada permita — conforme Q3, o fluxo é linear, portanto bloqueado.
- Edição de pedido `entregue` → rejeitada com mensagem de imutabilidade.
