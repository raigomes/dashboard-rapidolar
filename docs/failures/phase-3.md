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

---

# Revalidação 2026-08-02 (fast-follow — commits `be303f5`, `04d77d9`)

> Reviewer: 2026-08-02 · Veredito: **APROVADO COM RESSALVAS (apenas nits)**
> Todos os 3 leves e 2 dos 3 nits anteriores foram corrigidos. Sem falha
> bloqueante e sem regressão. Nits residuais abaixo não impedem o fechamento.

## Status dos achados anteriores

| # | Achado anterior | Status |
| - | --------------- | ------ |
| LEVE 1 | Remoção de itens por vendedor | ✅ **Corrigido** — `updatePedido` faz delete+insert completo; `deletePedido` permite ao dono; migration 00002 cria `pedidos_delete_own_or_admin` + `pedido_itens_delete_own_via_parent` (consistente com 00001: `TO authenticated`, `public.is_admin()`, drops `IF EXISTS`). Corolário do rollback do `createPedido` também resolvido. |
| LEVE 2 | Race de debounce de datas | ✅ **Corrigido** — 1 useEffect único sobre `[dataInicio, dataFim]`, timer limpo a cada mudança, params reconstruídos do `searchParams` atual + estado. Não perde o primeiro filtro. |
| LEVE 3 | Combobox de cliente | ✅ **Corrigido** — `cliente-combobox.tsx` (Command+Popover/cmdk + base-ui), busca e teclado OK, seleção por closure (sem ambiguidade de nomes duplicados). |
| NIT 1 | 8× `any` em `/pedidos/page.tsx` | ✅ **Corrigido** — zero `any` em `src/` (única ocorrência é comentário pré-existente em `middleware.ts`). Tipagem estrutural genérica `aplicarFiltros <T,>` + `as unknown as` pragmático. |
| NIT 2 | Paginação (Anterior/Próxima vs shadcn `Pagination`) | ⏸ **Mantido** — fora do escopo do fast-follow; permitido pelo TASKS ("10 ou 20"). |
| NIT 3 | FK 23503 cru em delete | ✅ **Corrigido** — `src/lib/db-errors.ts` (`mensagemErroDelete`) usado em `deleteProduto`/`deleteCliente`. |

## Tooling (refeito nesta revalidação)

- ✅ `npx tsc --noEmit` — 0 erros
- ✅ `npm run lint` — 0 erros
- ✅ `npm run build` — OK (7 rotas compiladas, sem warnings)
- ✅ Runtime: `/pedidos` sem auth → 307 `/login` (middleware OK); `/login` renderiza

## Nits novos / observações (não bloqueantes)

1. **Race cruzada residual nos filtros (pré-existente, não regressão):** o timer do
   debounce de datas captura `searchParams` do render em que rodou. Se o usuário
   alterar uma data e, dentro de ~300ms, mudar o Select de cliente/status, o timer
   pode emitir URL com snapshot antigo e descartar a mudança do Select. A solução
   definitiva seria ler `window.location.search` dentro do timer (sugestão 2 do
   LEVE 2 original) — não bloqueia, janela muito estreita.
2. **`updatePedido` sem transação DB:** o delete+insert de itens não é atômico; se
   o INSERT falhar após o DELETE, o pedido fica com 0 itens e `total` atualizado.
   Não é regressão (padrão pré-existente do caminho admin) e o retry com o mesmo
   form recupera. Melhoria futura: função `SECURITY DEFINER` transacional.
3. **A11y do combobox:** o trigger tem `role="combobox"` + `aria-expanded`, mas o
   `Label` "Cliente" não aponta para ele (`htmlFor`/`aria-labelledby`). O nome
   acessível vem só do texto do botão. Sugestão: `aria-labelledby` no trigger.
4. **Pendência de validação:** não há testes Playwright versionados no repo — a
   validação de browser reportada foi manual/adhoc. Recomenda-se commit de um
   smoke test (login + /pedidos + combobox) para as próximas fases.

## Confirmação RLS vs DESIGN_SYSTEM §5

- "Criar/editar/excluir pedidos: ✅ (todos) / ✅ (apenas seus)" — **implementado**:
  RLS + checks em app (`created_by === userId` para não-admin) em `updatePedido` e
  `deletePedido`; UI esconde ações para pedidos alheios (`podeEditar`).
