# Failures — Phase 3 (CRUD Modules, T3.1–T3.5)

> Reviewer: 2026-08-02 · Veredito: **APROVADO COM RESSALVAS**
> Checks de tooling passam (`tsc`/`lint`/`build` = 0 erros). Achados abaixo são
> **leves (fast-follow)** — nenhum bloqueia o uso básico, mas devem ser corrigidos
> antes de fechar a fase.

---

## LEVE 1 — Vendedor editando pedido NÃO remove itens (dessincroniza `pedido_itens`)

- **Arquivo:** `src/app/(dashboard)/pedidos/actions.ts` (`updatePedido`, linha 156–181)
- **Problema:** No caminho do vendedor, os itens são sincronizados por `produto_id`
  (UPDATE nos existentes + INSERT dos novos), mas itens REMOVIDOS no form não são
  deletados. O RLS não dá DELETE ao vendedor em `pedido_itens`
  (`pedido_itens_delete_admin` — `supabase/migrations/00001_init.sql` linha 225),
  então a remoção é silenciosamente ignorada. Efeito: ao reabrir o pedido, o item
  "removido" volta; `pedido_itens` não reflete mais o `total` recalculado.
- **Corolário:** no `createPedido` (linha 89–92), o rollback (`delete` do pedido
  recém-criado) também falha silenciosamente para vendedor (sem policy de DELETE
  em `pedidos`), podendo deixar pedido órfão sem itens se o INSERT de itens falhar.
- **Solução sugerida:**
  1. Adicionar policy RLS `pedido_itens_delete_own_via_parent` (DELETE quando o
     pedido pai `created_by = auth.uid()`) — alinha com a permissão da tabela §5
     do DESIGN_SYSTEM ("editar pedidos: ✅ apenas seus"); OU
  2. Criar função `SECURITY DEFINER` `replace_pedido_itens(pedido_id, itens jsonb)`
     que faz delete-all + insert em transação, usada pelo vendedor e admin.
- **Impacto:** nenhum para admin (caminho admin usa delete+insert corretamente).

## LEVE 2 — Race nos filtros de data de pedidos (perde filtro ao alterar os 2 rapidamente)

- **Arquivo:** `src/components/pedidos/pedidos-filtros.tsx` (linhas 41–51)
- **Problema:** Dois `useEffect` com debounce separados capturam `searchParams`
  obsoleto na closure. Se o usuário define `data_inicio` e `data_fim` dentro da
  mesma janela de ~300ms (fluxo típico de date range), o timer do segundo campo
  reconstrói a URL a partir dos params antigos e **descarta o primeiro filtro**.
- **Solução sugerida:** unificar em um único `useEffect` com um state
  `{ dataInicio, dataFim }` (um debounce só), ou ler `window.location.search` de
  dentro do timer em vez da closure.

## LEVE 3 — Select de cliente NÃO é searchable (acceptance criteria T3.3 / DESIGN_SYSTEM §3.5)

- **Arquivo:** `src/components/pedidos/pedidos-filtros.tsx` (linha 81) e
  `src/components/pedidos/pedido-form.tsx` (linha 214)
- **Problema:** TASKS 3.3 e DESIGN_SYSTEM §3.5 especificam "Cliente: select
  searchable (combobox)". Implementação usa `Select` simples com até 200 clientes
  — funciona com os 30 do seed, mas não escala e não atende o critério.
- **Solução sugerida:** combobox (shadcn `Command`/`Popover`) em fast-follow.

---

## NITs (cosméticos / melhorias, sem ação obrigatória)

1. **`src/app/(dashboard)/pedidos/page.tsx` (linhas 16–33):** `PedidosQuery`
   tipado como `PostgrestFilterBuilder<..., any × 8>` com 8 eslint-disable —
   funcional e lint-clean, mas enfraquece o strict typing. Sugestão: tipar com os
   tipos reais dos campos ou `GenericSchema`.
2. **Paginação (§7 DESIGN_SYSTEM):** spec usa shadcn `Pagination` com links de
   página e limit 10; implementação usa Anterior/Próxima + "Página X de Y" com
   limit 20. Consistente com o padrão mobile da própria spec e permitido pelo
   TASKS ("10 ou 20"), mas desvia do desktop.
3. **FK RESTRICT em `deleteProduto`/`deleteCliente`:** excluir registro com
   vínculos (pedido/produto) retorna mensagem crua do Postgres no toast.
   Sugestão: mapear `23503` para "Existem pedidos vinculados a este registro".

---

## Pendência registrada (não executado)

- **Smoke test de runtime** (`npm run dev` + rotas autenticadas + checagem de
  ações admin vs vendedor): **não executado** — requer sessão de browser com
  login. Coberto indiretamente por `npm run build` (todas as rotas compilaram) e
  pela análise estática de RLS.

## Confirmado OK (sem ação)

- ✅ `npx tsc --noEmit` / `npm run lint` / `npm run build` — 0 erros
- ✅ Total do pedido recalculado NO SERVIDOR (`calcTotal` com reduce JS) — nunca
  o total do cliente
- ✅ Sem agregação PostgREST (`sum(`) em nenhum arquivo novo; contagem via
  `count: "exact"`; paginação com `range()`
- ✅ Role checks: produtos/clientes/deletePedido admin-only; vendedor pode criar
  pedido; `updatePedido` verifica `created_by`
- ✅ Badges de status com cores exatas do DESIGN_SYSTEM §2.6 (amber/blue/green/red)
- ✅ Busca produtos/clientes com debounce 300ms → `?q=`
- ✅ Modais `sm:max-w-lg` (produtos/clientes) e `sm:max-w-2xl` (pedidos) com itens
  dinâmicos e total bold
