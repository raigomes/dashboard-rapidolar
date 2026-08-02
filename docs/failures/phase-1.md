# Phase 1 — Failure Memory (Validação Reviewer 2026-08-02)

> Desvios registrados da Phase 1 (T1.2 login, T1.3 app shell, T1.4 perfil).
> Nenhum desvio crítico. Verdict: **aprovado** com ressalvas leves/nits abaixo.
> **Fast-follow aplicado (2026-08-02):** desvios LEVE 1 e LEVE 2 corrigidos (Sheet controlado via `DashboardShell`); nits corrigidos: `UserRoundIcon`→`UserIcon`, `aria-current="page"` no nav ativo, `border-destructive` + `aria-invalid` em inputs com erro, espaçamento logo/form 32px (`gap-8`) conforme §3.1. Nits não corrigidos (aceitos p/ MVP): `/` anônimo sem redirect p/ `/login` (T0.0), query de `profiles` duplicada (perf).

## 1. LEVE — Sheet mobile ignora `w-64` (largura 75vw em vez de 256px) — ✅ CORRIGIDO

- **Onde:** `src/app/(dashboard)/layout.tsx` + `src/components/ui/sheet.tsx`
- **Sintoma:** `SheetContent className="w-64 p-0"` não impõe 256px no mobile. O `SheetContent` padrão do shadcn/base-nova traz `data-[side=left]:w-3/4`. `twMerge` v3.6 NÃO trata `data-[side=left]:w-3/4` como conflitante com `w-64` (mantém ambos), e no CSS o seletor com atributo `[data-side="left"]` tem especificidade maior → prevalece `w-3/4`. Resultado renderizado: ~75vw (≈281px @375px; 384px via `sm:max-w-sm` @≥640px) em vez dos 256px delegados.
- **Fix aplicado:** `SheetContent className="data-[side=left]:w-64 p-0"` (override com a própria variante de atributo, mesmo nível de especificidade).

## 2. LEVE — Sheet mobile não fecha ao navegar (UX) — ✅ CORRIGIDO

- **Onde:** `src/app/(dashboard)/layout.tsx` (Sheet sem estado controlado)
- **Sintoma:** após tocar um item de navegação no Sheet (<1024px), a rota muda mas o overlay permanece aberto; usuário precisa fechar manualmente (X ou overlay).
- **Fix aplicado:** novo `src/components/layout/dashboard-shell.tsx` (client) controla `open`/`onOpenChange` do Sheet e passa `onNavigate={() => setSheetOpen(false)}` para o `Sidebar`, que chama no clique dos links de navegação.

## 3. NITS

- ~~Nav item ativo sem `aria-current="page"`~~ → ✅ adicionado (`aria-current={active ? "page" : undefined}`).
- ~~Input com erro não recebe `border-destructive`~~ → ✅ adicionado + `aria-invalid` no login.
- ~~Dropdown "Perfil" usa `UserRoundIcon`~~ → ✅ trocado para `UserIcon` (DESIGN_SYSTEM §6).
- ~~Login: logo sem `mb-8` explícito~~ → ✅ `gap-8` no CardContent (32px, equivalente ao `mb-8` do §3.1).
- `/` anônimo mostra placeholder em vez de redirecionar para `/login` (proxy só trata `/` com sessão). Aceitável p/ MVP (T0.0). → **mantido**
- Query de `profiles` duplicada (layout + page `/perfil`) — perf, não visual. → **mantido** (custo 1 query extra por página de perfil)

## Padrão recorrente (lição)

Sempre que sobrescrever largura/layout de primitivas Base UI (Sheet/Dialog) com variantes `data-[side=...]:*`, verificar com `twMerge` + cascata CSS: classes base com variante de atributo vencem classes utilitárias simples. Preferir a própria variante `data-[side=...]` no override.
