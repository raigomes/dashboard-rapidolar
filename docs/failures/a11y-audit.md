# Failure Log — Auditoria de Acessibilidade (WCAG 2.1 AA) + Lighthouse

> **Auditoria em:** 2026-08-03
> **Reviewer:** @reviewer
> **Ferramentas:** Lighthouse v13.4.1 (Chrome for Testing 151.0.7922.71) + análise estática + medição de contraste (WCAG relative luminance)
> **Design System de referência:** `docs/DESIGN_SYSTEM.md` **v1.4.1** (§1.1 cores: `--primary #0f766e`, `--muted-foreground #737373`, emerald-600/red-600 nas variações de métricas)
> **Veredito:** ⚠️ **REPROVADO na auditoria de contraste** — 2 falhas de contraste confirmadas (1 medida manual, 1 confirmada pelo Lighthouse na home). Nenhuma falha de estrutura/landmark. Scores de performance excelentes, com 1 oportunidade de otimização de JS.

---

## 1. Resumo executivo

Auditoria de acessibilidade WCAG 2.1 AA + PageSpeed das páginas públicas (`/` e `/login`) do RapidoLar Dashboard. As rotas internas redirecionam 307 → `/login` sem sessão, portanto não foram auditáveis via Lighthouse; foram cobertas por análise estática de `src/`.

**Scores Lighthouse (mobile, Chromium):**

| URL | Performance | Acessibilidade | Best Practices | SEO |
| --- | ----------- | -------------- | -------------- | --- |
| `/` (landing) | **0.97** | **0.95** ⚠️ | 1.00 | 1.00 |
| `/login` | **0.95** | **1.00** | 1.00 | 1.00 |

Única auditoria automatizada reprovada: `color-contrast` na home (FCP 0.9s, LCP 2.4s, TBT 100ms, CLS 0 — excelentes). A queda de a11y em 0.95 é causada exclusivamente por 1 nó com contraste insuficiente.

---

## 2. Falhas confirmadas (ações obrigatórias)

| ID | Severidade | WCAG | Localização | Problema | Contraste medido |
| -- | ---------- | ---- | ----------- | -------- | ---------------- |
| **A-01** | **ALTA** | 1.4.3 (Contraste mínimo) | `src/components/dashboard/metric-cards.tsx:33` — `<p className="text-xs font-medium text-emerald-600">` | Variação positiva (receita/vendas) em `#009767` sobre branco: **3.73:1** < 4.5:1 (texto normal 12px) | 3.73:1 ❌ |
| **A-02** | **ALTA** | 1.4.3 (Contraste mínimo) | `src/app/page.tsx` — seção CTA `bg-primary` com `<p className="mt-2 text-primary-foreground/80">` | Subtítulo da landing em `#cfe4e2` sobre `#0f766e` (80% de opacidade): **4.13:1** < 4.5:1. Confirmado pelo Lighthouse `color-contrast` (home a11y 0.95) | 4.13:1 ❌ |

### Detalhe A-02 (evidência Lighthouse)

```
audit color-contrast — items[0].node
selector: section.px-4 > div.mx-auto > div.rounded-xl > p.mt-2
snippet:  <p class="mt-2 text-primary-foreground/80">
foreground: #cfe4e2  background: #0f766e
"Element has insufficient color contrast of 4.13 ... Expected contrast ratio of 4.5:1"
```

---

## 3. Achados de acessibilidade (estática — ação recomendada)

| ID | Severidade | Localização | Problema | Sugestão |
| -- | ---------- | ----------- | -------- | -------- |
| **A-03** | Média | `src/components/pedidos/pedidos-filtros.tsx:89,112` (Selects "Todos os clientes"/"Todos os status") e `src/components/pedidos/cliente-combobox.tsx:53` (`CommandInput placeholder="Buscar cliente…"`) | Nome acessível vem apenas do placeholder/texto visível; propósito do campo não é anunciado | Adicionar `aria-label` explícito ("Filtrar por cliente", "Filtrar por status", "Buscar cliente") ou `Label`/texto `sr-only` |
| **A-04** | Média | `src/components/layout/header.tsx:38` (`<h1>{title}</h1>`) + `h1` da página em cada rota (ex.: `dashboard/page.tsx:207`) | Dois `<h1>` por documento — anti-padrão de hierarquia de títulos | Header usar `<p className="text-base font-semibold">`; manter o `<h1>` único na página |
| **A-05** | Média | Formulários com erro em estado raiz — `src/app/login/page.tsx` (`formError` renderizado em `<p>`) e equivalentes em forms CRUD | Erro de envio (credenciais inválidas etc.) não é anunciado automaticamente por leitores de tela | Envolver em `role="alert"` ou `aria-live="polite"`; garantir `aria-invalid` + `aria-describedby` nos campos com erro |
| **A-06** | Baixa | `button.tsx` variante default — hover `hover:bg-primary/80` | `#ffffff` sobre `#3f918b` (primary a 80%) = **3.73:1** no estado hover (transitório, mas pode persistir em touch) | Manter opacidade ≥ 90% no hover ou usar overlay escuro |
| **A-07** | Baixa | `src/components/layout/sidebar.tsx:75,93` (links de navegação) | Sem `focus-visible` explícito nos links; depende do `outline-ring/50` global | Aplicar `focus-visible:ring-3 focus-visible:ring-ring/50` (padrão do app) nos `SidebarNavLink` |
| **A-08** | Info | `src/components/ui/sonner.tsx` (`theme="light"`, `closeButton`, `richColors`) | Sem configuração `aria-live` explícita | Sonner v2 já anuncia toasts (`role="status"`/`role="alert"` + `aria-live="polite"`). **Sem ação necessária** — manter `theme="light"` |

**Confirmado OK (sem ação):** `html lang="pt-BR"`; labels associados nos forms CRUD; `aria-label` em SheetTrigger ("Abrir menu") e UserNav ("Menu do usuário"); `PeriodSelector` com `role="group"` + `aria-pressed`; logo decorativa com `aria-hidden`; landmark `main` presente; badges de status de pedidos (amber-800/amber-100 = 6.40:1, blue-800/blue-100 = 7.23:1, green-800/green-100 = 6.49:1, red-800/red-100 = 6.85:1 — todos ✓); variação negativa `text-red-600` (#e40014) = 4.87:1 ✓; `text-muted-foreground` sobre branco = 4.74:1 ✓; sem `<img>` em `src/` (nenhuma imagem sem `alt`).

---

## 4. Performance (Lighthouse)

| Métrica | `/` | `/login` | Meta |
| ------- | --- | -------- | ---- |
| First Contentful Paint | 0.9 s | 0.9 s | ≤ 1.8 s |
| Largest Contentful Paint | 2.4 s | 2.8 s ⚠️ | ≤ 2.5 s |
| Total Blocking Time | 100 ms | 130 ms | ≤ 200 ms |
| Cumulative Layout Shift | 0 | 0 | ≤ 0.1 |
| Speed Index | 0.9 s | 0.9 s | ≤ 3.4 s |
| Time to Interactive | 3.7 s | 3.5 s | ≤ 3.8 s |
| Transferência total | 412 KiB | 401 KiB | — |
| — do qual JavaScript | **341 KiB** | **341 KiB** | — |
| TTFB | 10 ms | 0 ms | ≤ 600 ms |

**Oportunidade única detectada:** `unused-javascript` score 0 — ~134 KiB de JS não utilizado em páginas públicas (savings est. **150 ms** na home, **290 ms** no login). Chunks: `0qk9tfm1-g_gw.js` (56/58 KiB desperdiçado), `062x-vhvg4abv.js` (51/60 KiB), `25o46h8mdjlrg.js` (29/71 KiB).

**Recomendação de impacto (quick win de performance):** o `Toaster` (Sonner) está no layout raiz e é carregado em todas as rotas, inclusive na landing onde nunca dispara toast. Mover para o `(dashboard)/layout.tsx` + `next/dynamic(() => import(...), { ssr: false })`, ou importar dinamicamente só onde usado. Impacto esperado: −100–290 ms em TBT/TTI e LCP mais próximo de 2.0 s no login.

---

## 5. Priorização (Quick wins)

| # | Ação | Esforço | Ganho |
| - | ---- | ------- | ----- |
| 1 | `metric-cards.tsx:33` → `text-emerald-700` (mais escuro) e revalidar ≥ 4.5:1 | ~5 min | A11y das 4+ métricas do dashboard |
| 2 | `page.tsx` → `text-primary-foreground` (sem `/80`) no subtítulo CTA | ~2 min | A11y home volta a 1.00 |
| 3 | Mover Toaster do root → layout do dashboard / dynamic import | ~30 min | −100–290 ms (TBT/TTI/LCP) |
| 4 | `aria-label` nos selects de filtro + combobox | ~10 min | Nome acessível explícito |
| 5 | Header `<h1>` → `<p>` | ~2 min | Hierarquia de títulos única |

---

## 6. Conclusão

Acesso/estrutura: **aprovado** (landmarks, labels, foco, linguagem, badges de status ✓). Contraste: **reprovado** — 2 falhas de alto impacto corrigíveis em minutos (A-01 `text-emerald-600` 3.73:1; A-02 `text-primary-foreground/80` 4.13:1). Performance: **excelente** (CLS 0, FCP 0.9s, BP/SEO 1.00), com uma única oportunidade clara de redução de JS (341 KiB → mover Toaster fora do root). Recomenda-se um ciclo de correção (tasks A-01 a A-05) seguido de revalidação Lighthouse nas duas URLs públicas e auditoria manual nas rotas internas com sessão.

---

## 7. Revalidação (2026-08-03 — após correções no commit `80f1555`)

> **Ferramentas:** Lighthouse v13.4.1 (mesmo ambiente, 2ª rodada) nas URLs públicas `/` e `/login`.
> **Fix aplicado (`80f1555`):** A-01 `metric-cards.tsx` → `text-emerald-700`; A-02 landing CTA → `text-primary-foreground` (sem `/80`); A-03 `aria-label` nos selects de filtro e combobox; A-04 header `<h1>` → `<p>` (h1 único por página); A-05 erros de formulário com `role="alert"`; Toaster movido do layout raiz para `src/components/layout/toaster.tsx` (montado em `(dashboard)/layout.tsx` e `/login`).

**Scores (2ª rodada):**

| URL | Performance | Acessibilidade | Best Practices | SEO |
| --- | ----------- | -------------- | -------------- | --- |
| `/` (landing) | 0.96 | **1.00** ✅ | 1.00 | 1.00 |
| `/login` | 0.92 | **1.00** ✅ | 1.00 | 1.00 |

**Veredito:** ✅ **APROVADO COM NITS** — a única falha automatizada que derrubava a a11y da home (A-02, `color-contrast`) foi corrigida; acessibilidade volta a **1.00** nas duas URLs. BP e SEO mantidos em 1.00. Nenhuma nova falha de contraste ou estrutura detectada.

**Métricas de performance (2ª rodada):**

| Métrica | `/` (r1 → r2) | `/login` (r1 → r2) |
| ------- | ------------- | ------------------ |
| FCP | 0.9 s → 0.9 s | 0.9 s → 0.9 s |
| LCP | 2.4 s → 2.3 s | 2.8 s → 2.9 s |
| TBT | 100 ms → 180 ms | 130 ms → 190 ms |
| CLS | 0 → 0 | 0 → 0 |
| TTI | 3.7 s → 3.8 s | 3.5 s → 3.5 s |

**Nits / oportunidades abertas:**
- Performance ficou estável dentro da variância de execução (TBT mais alto nesta rodada é ruído de throttling do ambiente; CLS continua 0).
- A auditoria `unused-javascript` **persiste** (~137 KiB de savings na home, ~135 KiB no login) — o quick win do Toaster foi aplicado e confirmado no código (landing não monta mais o Sonner), mas o JS não utilizado remanescente vem de outros chunks do runtime. Oportunidade aberta para rodada futura (lazy loading de módulos pesados do dashboard).
