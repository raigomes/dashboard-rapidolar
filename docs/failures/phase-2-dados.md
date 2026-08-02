# Phase 2 — Failure Memory: DADOS (Validação Reviewer 2026-08-02)

> Validação de DADOS pós-correção do faturamento zerado (sumTotal/fetchDaily com
> `select("total")` + soma em JS). **Verdict: aprovado** — valores do dashboard
> conferem com a base (snapshot reconciliado com o reportado pelo Coder).
> Scripts temporários removidos; checks: `tsc --noEmit` ✅.

## 1. RECORRENTE (causa raiz corrigida) — PostgREST `select("soma:sum(total)")`

- **Onde:** qualquer query de agregação no Supabase via supabase-js.
- **Sintoma:** `select("soma:sum(total)")` falha com *"Could not find a relationship
  between 'pedidos' and 'sum' in the schema cache"* → `data` null → cards zerados.
  Aconteceu em `sumTotal()` (dashboard/page.tsx) e `fetchDaily()` (sales-chart.tsx).
- **Fix validado:** buscar linhas cruas (`select("total")` + filtros) e somar em JS.
  Confere com a base (soma JS = soma manual, 100%). `countPedidos()` usa count exact
  (intocado, funciona).
- **Lição:** NÃO usar `sum()` do PostgREST neste projeto. Para novas agregações,
  usar linhas cruas + redução em JS (ou RPC/view quando houver escala).

## 2. ATENÇÃO — Dados são MÓVEIS (job de simulação)

- Pedidos com `data = hoje` são inseridos por job a cada ~15 min (`created_at` em
  intervalos regulares). Qualquer comparação de "hoje" precisa de timestamp.
  Ex.: Coder reportou Faturamento Hoje R$ 3.910,06 / 53 pedidos; minutos depois a
  base tinha R$ 4.074,06 / 54 (um pedido novo de R$ 164,00). Diferença = dados novos,
  NÃO bug de código.
- `revalidate = 60` no dashboard → valores podem ficar até 60s defasados. Esperado.

## 3. RESSALVA — Fuso horário — ✅ MITIGADO (fast-follow)

- `data` é DATE. O dashboard calcula "hoje" pela TZ local do servidor
  (`toISODate` usa getFullYear/getMonth/getDate). O seed/job grava data via
  `toISOString()` (UTC). Neste ambiente (America/Sao_Paulo) ambas coincidem agora,
  mas entre 00:00–03:00 local (03:00–06:00 UTC) um pedido UTC de "amanhã" pode cair
  em "hoje" local (ou vice-versa se o servidor rodar em UTC).
- **Fix aplicado (fast-follow 2026-08-02):** scripts do `package.json` fixam
  `TZ=America/Sao_Paulo` (dev/build/start/lint/seed) → `toISODate` do servidor
  coincide com o fuso do negócio; `.lte("data", hoje)` adicionado no
  `fetchMonthly()` (12m) blinda contra data futura.

## 4. DADOS — observações de qualidade (sem impacto no dashboard)

- 246 pedidos (177 de faturamento) não têm `pedido_itens` (job escreve só `total`) →
  entram no faturamento (via `pedidos.total`) mas NÃO no Top Produtos (derivado de
  itens). Comportamento esperado pelo modelo; não é bug.
- 1 pedido cancelado (2026-06-09) tem `total` ≠ soma(itens) — irrelevante, excluído
  do faturamento. Todos os confirmado/entregue conferem `total` vs soma(itens).

## 5. NUANCE DE REGRA

- Briefing diz "anterior=0 → null". Dashboard retorna 0 quando ambos os períodos são
  0 (neutro) e null apenas quando anterior=0 com atual>0 ("—"). Decisão de UX aceitável.
