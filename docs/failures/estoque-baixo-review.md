# Failure Log — Revisão: Feature "Estoque Baixo" + Infra npm (Round 2026-08-03)

> **Reviewer:** @reviewer
> **Rodada:** working tree NÃO commitado (feature "estoque baixo" + remoção do pnpm/`packageManager`)
> **Design System de referência:** `docs/DESIGN_SYSTEM.md` **v1.4.1** · protótipo `docs/layout/dashboard.pen` **v2.14**
> **Veredito:** ⚠️ **APROVADO COM NITS** — sem falhas de a11y/contraste, sem falhas de build. Nits de documentação/cosmética + **drift do DESIGN_SYSTEM/.pen** que exige follow-up do Designer (seção 3).

---

## 1. Verificações automatizadas (resultado)

| Check | Comando | Resultado |
| --- | --- | --- |
| Typecheck | `npx tsc --noEmit` | ✅ PASS (exit 0) |
| Lint | `npm run lint` | ✅ PASS (exit 0) |
| Build | `npm run build` | ✅ PASS (Next.js 16.2.12, Turbopack; exit 0) — remoção do pnpm + `packageManager` não quebram o build |
| Infra npm | `npm --version` = **11.16.0** (bate com `"packageManager": "npm@11.16.0"`); `package-lock.json` v3 válido; `pnpm-workspace.yaml` deletado; sem arquivos pnpm no repo | ✅ PASS |
| Git status | Working tree contém APENAS: `src/lib/estoque.ts` (novo), `src/components/produtos/produtos-tabela.tsx`, `src/components/dashboard/metric-cards.tsx`, `src/app/(dashboard)/dashboard/page.tsx`, `package.json`, `AGENTS.md`, `README.md`, deleção `pnpm-workspace.yaml` | ✅ PASS |

## 2. Validação de runtime (sessão real, admin + vendedor)

Servidor de produção (`npm run start`) + login real via Supabase Auth (admin@rapidolar.com/admin123 e vendedor@rapidolar.com/vendedor123), inspecionado via curl e Playwright (Chrome for Testing 151).

| Item | Admin | Vendedor |
| --- | --- | --- |
| Badge "Estoque baixo" em `/produtos` | ✅ 5 badges (estoques 0,2,2,5,10) | ✅ 5 badges (mesmos produtos — RLS ok) |
| Coluna Ações em `/produtos` | ✅ presente (5 colunas) | ✅ ausente (4 colunas — role preservado) |
| 5º MetricCard em `/dashboard` | ✅ valor 5, label "Estoque baixo", variação "—" | ✅ idem |
| Grid responsivo (cols) | 5 @1440 · 3 @1100 · 2 @800 · 1 @500 | — |

**Badge (estilos computados):** `text-amber-800`/`bg-amber-100`/`border-amber-300` resolvidos corretamente (twMerge aplica override sobre `variant="outline"`); `text-xs font-medium`, pill `h-5` (`rounded-full` ~20.8px), `title="Estoque baixo: até 10 unidades"`. Célula de estoque: número + badge em `flex justify-end gap-2`. Tabela com `overflow-x-auto` + `min-w-[600px]` no mobile (badge não estoura). `<h1>` único nas 4 páginas testadas.

**Contraste (WCAG relative luminance):**

| Par | Razão | Resultado |
| --- | --- | --- |
| amber-800 / amber-100 (badge) | **6.37:1** | ✅ ≥ 4.5 |
| amber-800 / branco (borda amber-300 decorativa) | 7.09:1 | ✅ |
| muted-foreground / branco (variação "—") | 4.74:1 | ✅ |
| red-600 / branco (variação negativa, inalterada) | 4.83:1 | ✅ |
| emerald-700 / branco (variação positiva, inalterada) | 5.48:1 | ✅ |

**Limitação do revisor:** screenshots gerados (`/tmp/opencode/review-*-*.png`) não puderam ser inspecionados visualmente (modelo sem suporte a imagem). A validação visual foi feita por DOM/estilos computados/layout via Playwright, cobrindo as propriedades visuais relevantes.

## 3. Nits e follow-ups (nenhum bloqueante)

### Nits (para Coder/Owner)
- **N-01** `README.md:89` — tabela "Cobertura do briefing": linha "Estoque baixo" ainda diz *"⚠️ estoque exibido no CRUD de produtos; sem alerta dedicado"*. Agora há alerta dedicado (badge + metric card). Atualizar para ✅ (e citar badge/card).
- **N-02** `src/components/dashboard/metric-cards.tsx:136` — label `"Estoque baixo"` com "baixo" minúsculo vs. padrão title-case dos irmãos ("Faturamento Hoje", "Pedidos Hoje", "Ticket Médio Mês"). Sugestão: `"Estoque Baixo"`. Cosmético.
- **N-03** Comportamento responsivo: em 640–1023px (grid de 2 colunas), o 5º card fica órfão na 3ª linha (alinhado à esquerda). Padrão comum e aceitável para grids; Designer pode decidir tratamento alternativo ao atualizar a spec.

### Follow-up obrigatório do Designer (docs fora de sync com a implementação)
O `.pen` v2.14 e o `DESIGN_SYSTEM` v1.4.1 **não contêm** o card "estoque baixo" nem o badge. A implementação segue os tokens/patterns existentes, mas os artefatos do Designer precisam ser atualizados (não editados por mim — follow-up para @designer):

- `docs/DESIGN_SYSTEM.md`
  - §2.2 Metric Card: grid "4 colunas (desktop)" → 5 (`xl:grid-cols-5`); documentar a variante do 5º card (ícone `PackageOpen`, `formatInteger`, variação "—").
  - §3.2 `/dashboard`: grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4` → `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5`; adicionar 5º card no wireframe.
  - §4 Responsividade: desktop `grid-cols-4` → `grid-cols-5`; tablet landscape (1024–1279px) passa a `lg:grid-cols-3` (3+2).
  - §2.6 Badges: adicionar linha "Estoque baixo" (`variant="outline"` + `border-amber-300 bg-amber-100 text-amber-800`).
  - §3.3 `/produtos`: célula Estoque pode conter badge (número + badge `gap-2`).
  - §6 Icon Mapping: adicionar "Card — Estoque baixo → `PackageOpen`".
- `docs/layout/dashboard.pen` (v2.14 → v2.15)
  - Frame `MetricsRow` (`urL8F`): adicionar 5º card "Metric Estoque Baixo" (ref `9k3Ga`, variação "—" `$muted`).
  - Frame `Row Produto` (`CellEstoque` `xsWZQ`): adicionar badge amber ao lado do número.
  - Bump de versão + changelog.

## 4. Conclusão

✅ **APROVADO COM NITS.** Feature "estoque baixo" correta em código, dados, RLS (admin e vendedor) e a11y (contraste 6.37:1, h1 único, badge com texto visível + `title`). Infra npm validada (npm 11.16.0, lockfile único, build ok). Pendências: 2 nits de documentação/cosmética (N-01, N-02) e atualização dos artefatos do Designer (seção 3) para refletir a 5ª métrica e o badge.
