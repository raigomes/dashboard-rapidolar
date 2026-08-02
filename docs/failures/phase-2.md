# Phase 2 — Failure Memory (Validação Reviewer 2026-08-02)

> Desvios registrados da Phase 2 (T2.1 metric cards, T2.2 sales chart + period selector, T2.3 top produtos, T2.4 top clientes, T2.5 página).
> **Nenhuma falha grave ou recorrente.** Verdict: **aprovado**.
> Checks: `tsc --noEmit` ✅ (0), `npm run lint` ✅ (0), `npm run build` ✅.
> 1 desvio de cor ACEITO com justificativa técnica (Recharts x paleta hex); 2 desvios LEVE de icon mapping (§6) — **CORRIGIDOS em fast-follow**; nits não bloqueantes.
>
> **Fast-follow aplicado (2026-08-02):** swap de ícones §6 (Faturamento Mês → `DollarSign`, Ticket Médio → `TrendingUp`, removido `Receipt`); `CHART_COLORS` centralizado em `src/lib/chart-theme.ts` com comentário apontando para `globals.css` (single source of truth).

## 1. ACEITO — Recharts usa hex literais em vez de `hsl(var(--border))` do §3.2

- **Onde:** `src/components/dashboard/sales-chart.tsx` (L33–41, `CHART_COLORS`)
- **Sintoma (se copiasse o snippet do DS):** `DESIGN_SYSTEM §3.2` (L535–539) instrui `stroke="hsl(var(--border))"`. Porém a paleta definida na **própria seção de tokens do DS** (L854–877) e no `src/app/globals.css` (L58–98) usa **hex**: `--border: #e5e5e5`, `--muted-foreground: #737373`, `--primary: #0f766e`, `--card: #ffffff`. `hsl(#e5e5e5)` é CSS inválido (hsl() exige H S L, não um cor hex) → o stroke do SVG cairia para o default do browser, quebrando o visual do grid/eixos/linha.
- **Análise do Reviewer:** o snippet §3.2 é herança do template shadcn default (vars oklch/hsl) e é **internamente inconsistente com a própria paleta hex do DS**. O Coder tem razão. `var(--border)` direto (sem `hsl()`) poderia resolver em navegadores modernos (presentation attributes são parseados como CSS), mas há relatos de falha no contexto SVG/Recharts e adicionaria dependência de herança; hex literal é o mais seguro e visualmente idêntico no tema light-only.
- **Decisão:** ACEITO. Requisito de tema: light-only (MVP, nota do DS L880).
- **Recomendação (fast-follow opcional):** centralizar `CHART_COLORS` em `src/lib/chart-theme.ts` com comentário apontando para `globals.css` L65/70/75 (single source of truth). Se dark mode chegar, adotar o padrão shadcn chart (custom prop via inline style `--color-x` + `stroke="var(--color-x)"`), que é o caminho que funciona em Recharts com vars.

## 2. LEVE — Icon mapping §6: Faturamento Mês e Ticket Médio divergem do mapeamento

- **Onde:** `src/components/dashboard/metric-cards.tsx` (L104–131)
- **Sintoma:** §6 mapeia `TrendingUp` → Card Ticket Médio e `DollarSign` → Card Faturamento. A implementação usa `TrendingUp` em Faturamento Mês e `Receipt` (fora do mapping) em Ticket Médio Mês.
- **Impacto:** puramente semântico/visual de ícone; `DollarSign` ✅ (Faturamento Hoje) e `ShoppingCart` ✅ (Pedidos Hoje) conformes; setas `TrendingUp`/`TrendingDown`/`Minus` nas variações ✅.
- **Fix aplicado (fast-follow):** Faturamento Mês → `DollarSign`; Ticket Médio → `TrendingUp`; import de `Receipt` removido. Conforme §6.

## 3. NITS

- Rankings agregados em JS com `.limit(10000)` (`fetchTopProdutos`/`fetchTopClientes`, page.tsx L58–119) — aceitável no volume do seed (1417 itens / 722 pedidos); revisar para RPC/view quando houver escala.
- Phase 2 não commitada no momento da validação (`page.tsx` M, `src/components/dashboard/`, `src/lib/format.ts`, `src/types/dashboard.ts` untracked) — processo, não falha técnica.

## Padrão recorrente (lição)

Snippets de código embutidos no DESIGN_SYSTEM (ex.: Recharts com `hsl(var(--x))`) foram herdados de templates shadcn com vars oklch/hsl e podem divergir da paleta real do projeto (hex). Antes de seguir snippet de DS para SVG/gráficos, conferir o formato real das variáveis em `globals.css` / seção de tokens do próprio DS.
