# Failure Log — Phase 4 (Reports & Polish)

> **Revalidação em:** 2026-08-02
> **Reviewer:** @reviewer
> **Commit avaliado:** `023abc8` (`feat: implementar Phase 4 — relatórios com PDF, error/loading states e landing page`)
> **Design System de referência:** `docs/DESIGN_SYSTEM.md` **v1.3** (§3.0 Landing + §3.6 Relatórios) e `docs/layout/dashboard.pen` (frame `LndPg` corrigido — T4.7)
> **Veredito:** ✅ **APROVADO** — 3 gates passam (tsc/lint/build), validação visual conforme §3.0/§3.6, nits anteriores (T4.3 chart 350px, T4.4 toast erro 6s) corrigidos. Nenhuma falha bloqueante; 3 nits opcionais listados abaixo.

---

## 1. Resumo executivo

A revalidação anterior (`be5d311`) reprovou por **incompletude**: T4.1 (relatórios/PDF), T4.2 (error/loading) e T4.6 (landing) não existiam no filesystem. Desde então o Coder entregou o commit `023abc8` implementando as três tasks + T4.5, e o Designer corrigiu o frame `LndPg` do protótipo (T4.7). Esta revalidação confirma que **tudo o que faltava foi implementado e está conforme** o DESIGN_SYSTEM v1.3.

| Task | Status | Evidência |
| ---- | ------ | --------- |
| **T4.1** Relatórios + PDF | ✅ Concluída | 3 arquivos presentes; rota `/relatorios` (ƒ dinâmica) no build; admin-only com recheck na Server Action; PDF via `@react-pdf/renderer` |
| **T4.2** Error & Loading states | ✅ Concluída | `not-found.tsx`, `error.tsx`, 4× `loading.tsx` presentes; 404 customizado verificado em runtime |
| **T4.3** Responsividade (nit chart) | ✅ Corrigida | `sales-chart.tsx:165/167/171` → `h-[200px] … md:h-[350px]` (desktop 350px ✓) |
| **T4.4** Toast erro 6s (nit) | ✅ Corrigida | `src/lib/toast.ts` → `toast.error(msg, { duration: 6000 })`; zero `toast.error` cru em CRUDs |
| **T4.5** TypeScript & Lint pass | ✅ PASSA | `tsc` 0 erros; `lint` 0 warnings; build OK |
| **T4.6** Landing raiz `/` | ✅ Concluída | `src/app/page.tsx` reescrita; conforme §3.0; verificado em runtime (sem emoji) |
| **T4.7** Fix frame Landing (Designer) | ✅ Concluída | `dashboard.pen` JSON válido; CtaCard `width: 1152`; sem emoji; rótulos Lucide kebab; `$secondary` declarada |

---

## 2. Checks obrigatórios

### 2.1 `npx tsc --noEmit` — ✅ PASSA
Saída: sem erros (exit 0).

### 2.2 `npm run lint` — ✅ PASSA
Saída: `TZ=America/Sao_Paulo eslint`, sem warnings/erros (exit 0).

### 2.3 `npm run build` — ✅ PASSA
Saída: compilação OK, 8 páginas estáticas/dinâmicas (exit 0).

**Evidência (tabela de rotas do build):**
```
Route (app)
┌ ○ /
├ ○ /_not-found
├ ƒ /clientes
├ ƒ /dashboard
├ ○ /login
├ ƒ /pedidos
├ ƒ /perfil
├ ƒ /produtos
└ ƒ /relatorios

ƒ Proxy (Middleware)
```
> ✅ `/relatorios` existe (ƒ dinâmica). `/_not-found` segue listado (rota interna padrão do Next), mas o **404 customizado está ativo** — `src/app/not-found.tsx` presente e confirmado em runtime (`/nao-existe` → HTTP 404 com "Página não encontrada" + "Voltar ao Dashboard").

### 2.4 Validação runtime (dev server, porta 3000)

| Rota | Resultado |
| ---- | --------- |
| `/` | 200 — landing completa (hero, features, CTA band, footer); **zero emojis** no HTML |
| `/nao-existe` | 404 — página customizada ("Erro 404", "Página não encontrada", "Voltar ao Dashboard") |
| `/relatorios` (sem sessão) | 307 → `/login` (middleware) |
| `/login` | 200 |

---

## 3. Validação visual vs DESIGN_SYSTEM.md v1.3

### T4.1 — §3.6 `/relatorios` ✅ CONFORME

| Critério (§3.6) | Implementação | Status |
| ---------------- | ------------- | ------ |
| Admin-only via Server Component | `src/app/(dashboard)/relatorios/page.tsx:28` — `profile?.cargo !== "admin"` | ✅ |
| Acesso negado: `ShieldAlert` + texto + "Voltar ao Dashboard" | `page.tsx:34-46` — `ShieldAlertIcon size-12` + "Esta página é restrita a administradores." + `Link href="/dashboard"` outline | ✅ |
| 2× date inputs | `relatorio-form.tsx:83-98` — `Input type="date"` "Data início"/"Data fim" | ✅ |
| Botões "Gerar Relatório" (primary) + "Exportar PDF" (outline + `FileDown`) | `relatorio-form.tsx:101-127` — primary com `RefreshCw`/spinner; outline com `FileDownIcon` | ✅ |
| Preview card `p-6` | `relatorio-form.tsx:150-242` — Card `shadow-sm`, `CardContent p-4 md:p-6` (p-6 desktop, padrão do app em mobile) | ✅ |
| PDF: logo/período/faturamento/total pedidos/top 10 produtos/top 10 clientes | `relatorio-pdf.tsx` — header teal com marca "R", período, 2 cards de resumo, tabelas top 10 produtos (com qtd) e top 10 clientes, rodapé com data de geração | ✅ |
| Loading "Gerando…" + skeleton no preview | `relatorio-form.tsx:107-112` (spinner + "Gerando…") e `136-149` (skeleton espelhando o preview) | ✅ |
| Recheck admin na Server Action | `relatorios/actions.ts:114-116` — retorna erro se não admin; zod valida datas; evita `.sum()` PostgREST (gotcha) somando com reduce | ✅ |

### T4.6 — §3.0 Landing `/` ✅ CONFORME

| Critério (§3.0) | Implementação (`src/app/page.tsx`) | Status |
| ---------------- | ---------------------------------- | ------ |
| Nav própria (logo mark + "RapidoLar" + "Entrar" → `/login`) | `page.tsx:50-58` — mark `h-4 w-4 rounded-md bg-primary` + `text-2xl font-bold tracking-tight`; CTA "Entrar" `buttonVariants` → `/login` | ✅ |
| Badge hero pill secondary | `page.tsx:61-63` — `rounded-full bg-secondary text-secondary-foreground text-xs font-medium px-4 py-1.5` "Para distribuidoras de limpeza e descartáveis" | ✅ |
| Hero título `text-4xl/5xl bold tracking-tight` | `page.tsx:64-66` — `text-4xl md:text-5xl font-bold tracking-tight max-w-3xl` | ✅ |
| Hero subtítulo muted `max-w-xl` | `page.tsx:67-70` — `text-muted-foreground max-w-xl` | ✅ |
| CTA row primary + outline | `page.tsx:71-87` — "Entrar no painel" (lg, primary) + "Conhecer o painel" (outline, âncora `#funcionalidades`) | ✅ |
| Features `id="funcionalidades"`, 5 cards, grid 3+2 | `page.tsx:90-126` — seção com `id="funcionalidades"`; flex-wrap `lg:w-[calc(33.333%-16px)]` → 3+2 centralizados; `sm:w-[calc(50%-12px)]` → 2+2+1; 1 col no mobile | ✅ (flex equivalente ao grid da spec, com centralização da última linha) |
| Ícones Lucide em icon box secondary, **sem emoji** | `page.tsx:20-44` + `105-113` — `LayoutDashboardIcon, PackageIcon, UsersIcon, ShoppingCartIcon, FileTextIcon` em box `h-10 w-10 rounded-lg bg-secondary text-secondary-foreground` `size-5`; runtime: zero emojis | ✅ |
| CTA band `bg-primary` + botão branco `bg-background text-primary` | `page.tsx:128-148` — `rounded-xl bg-primary py-10 md:py-12` dentro de `max-w-6xl mx-auto`; botão `mt-6 bg-background text-primary hover:bg-background/90` | ✅ |
| Footer "© 2026 RapidoLar" | `page.tsx:150-152` — "© 2026 RapidoLar · Sistema de gestão", `text-xs text-muted-foreground` | ✅ |
| Responsivo | breakpoints sm/md/lg nas seções; CTA row `flex-col sm:flex-row`; botões `w-full sm:w-auto` | ✅ |
| Motion §3.0/§9: fade-up hero + reduced-motion | `globals.css:112-132` — `@keyframes fade-up` 300ms `cubic-bezier(0.4,0,0.2,1)` aplicado ao h1/p; bloco `prefers-reduced-motion: reduce` desliga a animação | ✅ |

### T4.2 — §5 Estados Globais ✅ CONFORME

| Arquivo | Conteúdo | Status |
| ------- | -------- | ------ |
| `src/app/not-found.tsx` | `SearchXIcon` + "Erro 404"/"Página não encontrada" + link "Voltar ao Dashboard" | ✅ |
| `src/app/error.tsx` | `TriangleAlertIcon` + "Algo deu errado" + botão "Tentar novamente" (`reset()`) + digest | ✅ |
| `src/app/(dashboard)/dashboard/loading.tsx` | título + 4 metric skeletons + chart `h-[200px] md:h-[350px]` + 2 top tables | ✅ |
| `src/app/(dashboard)/produtos/loading.tsx` | título + busca/novo + table skeleton `min-w-[600px]` | ✅ |
| `src/app/(dashboard)/clientes/loading.tsx` | idem produtos | ✅ |
| `src/app/(dashboard)/pedidos/loading.tsx` | título + filtros (2 date + selects) + table skeleton | ✅ |

### T4.3 / T4.4 — nits anteriores ✅ CORRIGIDOS

| Nit (revalidação `be5d311`) | Correção | Status |
| --------------------------- | -------- | ------ |
| Chart desktop 300px vs spec 350px | `sales-chart.tsx:165/167/171` → `h-[200px] w-full md:h-[350px]` (igual no `dashboard/loading.tsx:29`) | ✅ |
| Toast de erro 4s vs spec 6s | `src/lib/toast.ts` → `toast.error(message, { duration: 6000 })`; `Toaster` global mantém 4000 para sucesso | ✅ |
| Toast de erro cru nos CRUDs | `grep` → todo `toast.error` está apenas em `src/lib/toast.ts`; 12 chamadas em componentes usam `toastError` (produto-form, produtos-tabela, cliente-form, clientes-tabela, pedido-form, pedidos-tabela, editar-nome, login, relatorio-form) | ✅ |

### T4.5 — Qualidade de código ✅ PASSA

- `npx tsc --noEmit` ✅ 0 erros
- `npm run lint` ✅ 0 warnings
- Sem `console.log/warn/error` no `src/` (grep)
- Sem `any` no `src/` (grep — casts usam `as unknown as`)
- Sem imports relativos `../` (path alias `@/*` consistente)
- Gotcha `.sum(` do PostgREST respeitado (reduce no cliente em `relatorios/actions.ts:146` e `sales-chart.tsx`)
- `TZ=America/Sao_Paulo` nos scripts do `package.json`
- Rota `/relatorios` rechecada na Server Action (defesa em profundidade além do UI)

### T4.7 — Protótipo `dashboard.pen` (Designer) ✅ CONFORME

- JSON válido (parseável)
- Sem emojis; rótulos Lucide kebab presentes (`layout-dashboard`, `package`, `users`, `shopping-cart`, `file-text`)
- `CtaCard` (Ld131) `width: 1152`; `CtaTitle`/`CtaSub` `width: fill_container`
- Variável `$secondary` declarada

---

## 4. Nits opcionais (não bloqueiam; aceitos para MVP)

| # | Local | Descrição |
| - | ----- | --------- |
| 1 | `src/app/page.tsx:55` | Nav CTA "Entrar" usa `size="lg"`; §3.0 especifica `size="md"` (h-10 vs h-9). Impacto visual mínimo. |
| 2 | `src/app/page.tsx:99` | Grid features implementado com `flex flex-wrap justify-center` em vez de `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`; resultado visual equivalente — e centraliza a 2ª linha (3+2) conforme o wireframe. |
| 3 | `src/components/relatorios/relatorio-form.tsx:152` | Preview `CardContent p-4 md:p-6` vs §3.6 "p-6"; `p-6` no desktop (padrão do app em mobile). |

---

## 5. Checklist da revalidação

- [x] T4.1 `/relatorios` — página admin-only, form período, preview, exportação PDF
- [x] T4.2 `not-found.tsx`, `error.tsx`, 4× `loading.tsx`
- [x] T4.3 re-check chart height desktop (350px) — corrigido
- [x] T4.4 re-check duração toast de erro (6s) — corrigido via `src/lib/toast.ts`
- [x] T4.5 `tsc` + `lint` finais após implementação
- [x] T4.6 landing `/` com CTA "Entrar" → `/login` + spec §3.0 (v1.3) — conforme, sem emoji
- [x] T4.7 frame `LndPg` do `dashboard.pen` corrigido (CtaCard 1152, sem emoji, Lucide kebab)

---

## 6. Conclusão

A Phase 4 está **APROVADA**. Todos os gates passam, as três tasks que faltavam (T4.1, T4.2, T4.6) foram implementadas conforme o DESIGN_SYSTEM v1.3, e os dois nits do fast-follow (chart 350px, toast 6s) foram corrigidos. Nenhuma falha bloqueante. Os 3 nits da seção 4 são opcionais e não exigem novo ciclo.
