# Tasks — Dashboard de Vendas RapidoLar

> **Gerado pelo Owner.** Tarefas ordenadas por dependência.
> **Total:** 29 tarefas em 7 fases (Phase -1 a Phase 4)
> **Atualizado:** 2026-08-02 — Phase 4 delegada ao Coder (T4.1 parcial, T4.2, T4.5, T4.6) + nova tarefa Designer T4.7 (frame Landing Page quebrado); hotfix 0.0 (page.tsx) e hotfix 0.1 (selects exibindo value cru) concluídos.

---

## Phase -1 — Design System (Pencil.dev) ✅

### Task D.1: Layout Prototyping ✅

- **Status:** Concluída
- **Agent:** Designer (Impeccable + Pencil.dev)
- **Files affected:** `docs/DESIGN_SYSTEM.md`, `docs/layout/dashboard.pen`
- **Dependencies:** Nenhuma
- **Deliverables:**
  - ✅ `docs/DESIGN_SYSTEM.md` — 12 seções, ~1.450 linhas
    - Cobre: paleta de cores (brand, neutros, semânticos), tipografia (Inter, scale completa), espaçamento (Tailwind v4 scale), wireframes de 6 páginas (login, dashboard, produtos, clientes, pedidos, relatorios), tokens de componentes (cards, tables, buttons, badges, forms, modals, sidebar, header, charts, skeleton, pagination), responsividade (desktop/tablet/mobile com breakpoints), mapeamento de ícones (Lucide, 30+ ícones), empty states, error states, motion guidelines, acessibilidade (WCAG AA), estrutura de arquivos, hierarquia de componentes
  - ✅ `docs/layout/dashboard.pen` — Protótipo Pencil.dev v2.14 com 6 páginas:
    - Login: 14 elementos (card, inputs, botão)
    - Dashboard: 97 elementos (sidebar, header, 4 metric cards, chart com grade, top tables)
    - Produtos: 100 elementos (tabela com 8 linhas, busca, modal CRUD)
    - Clientes: 78 elementos (tabela com 5 linhas, busca, modal CRUD)
    - Pedidos: 102 elementos (filtros, tabela com 7 linhas + badges de status)
    - Relatórios: 50 elementos (período, botões, preview com dados)
- **Acceptance criteria:**
  - ✅ Layout de todas as páginas definido com wireframes detalhados (ASCII + Pencil.dev)
  - ✅ Paleta de cores, tipografia, espaçamentos documentados
  - ✅ Componentes UI mapeados com tokens e estados
  - ✅ Responsividade definida com breakpoints e comportamentos por viewport
  - ✅ Protótipo Pencil.dev exportado para `docs/layout/dashboard.pen`
  - ✅ Icon mapping completo (Lucide, 31 ícones mapeados)
  - ✅ Motion guidelines, acessibilidade, file structure documentados
- **Notas:** Pencil.dev MCP tools não estavam autenticados — protótipo foi gerado manualmente no formato Pencil.dev v2.14 via script Python. O DESIGN_SYSTEM.md é a fonte única de verdade visual para o Coder.

---

## Phase 0 — Setup & Foundation

> **Estado (2026-08-02):** Phase 0 completa — T0.0, T0.1, T0.2, T0.3, T0.4, T0.5 concluídos; validação RLS pelo Reviewer ✅ (0 falhas). Phase 1 (T1.1–T1.4) destravada.

### Task 0.0: Hotfix — Restaurar página inicial quebrada 🔥 (BLOQUEADOR)

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** Nenhuma
- **Files affected:** `src/app/page.tsx`
- **Acceptance criteria:**
  - `src/app/page.tsx` não contém query a tabela inexistente (`todos`)
  - `npm run build` e `npx tsc --noEmit` passam
  - `npm run dev` abre em `http://localhost:3000` sem erro de runtime
- **Description:**
  A página foi sobrescrita por uma query de exemplo em `todos` (tabela que NÃO existe no schema `00001_init.sql`), quebrando o build. Restaurar a página padrão do template (ou um placeholder válido sem query a tabela inexistente). **Alerta ao Coder:** a estrutura de rotas ainda não segue `docs/DESIGN_SYSTEM.md` — o placeholder deve respeitar o mapeamento de rotas do PRD §4.1 (raiz pode redirecionar para `/dashboard` quando houver shell; por ora manter simples e válido).

### Task 0.1: Initialize Dependencies ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** Nenhuma
- **Files affected:** `package.json`, `tsconfig.json`
- **Acceptance criteria:**
  - Projeto compila com `npx tsc --noEmit` sem erros
  - `npm run dev` abre em `http://localhost:3000`
  - Tailwind CSS v4 funcional (classe `text-3xl font-bold` renderiza estilizado)
- **Feito (2026-08-02):** `@supabase/ssr` + `@supabase/supabase-js` + `tsx` (seed) instalados; `tailwindcss` v4 e `@tailwindcss/postcss` já configurados (`postcss.config.mjs`).
- **Faltando:** `recharts`, `lucide-react`, `sonner`, `react-hook-form`, `zod`, `@react-pdf/renderer`. Configurar `npx shadcn@latest init` (parte da Task 0.5).

### Task 0.2: Configure Supabase Client ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** T0.1
- **Files affected:** `src/utils/supabase/client.ts`, `src/utils/supabase/server.ts`, `src/utils/supabase/middleware.ts`, `.env.local`
- **Acceptance criteria:**
  - Client browser criado com `@supabase/ssr` (`createBrowserClient`)
  - Server client criado com `createServerClient` (lê cookies)
  - Middleware client para uso em `src/middleware.ts`
  - `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- **Notas de execução:** Módulos criados em `src/utils/supabase/` (não `src/lib/supabase/` como descrito originalmente). Env usa `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (padrão novo do Supabase, equivalente ao anon key) + `SUPABASE_SERVICE_ROLE_KEY` (só seed). **Pendência de revisão:** `src/middleware.ts` ainda não existe — Task 1.1 criará usando o `createClient` de `middleware.ts`.

### Task 0.3: SQL Migration — Schema & RLS ✅

- **Status:** ✅ Concluída (2026-08-01/02) — aplicada no Supabase
- **Agent:** Coder (implementação) → Reviewer (validação, ✅ 2026-08-02)
- **Dependencies:** T0.2
- **Files affected:** `supabase/migrations/00001_init.sql`
- **Acceptance criteria:**
  - Tabelas `profiles`, `produtos`, `clientes`, `pedidos`, `pedido_itens` criadas
  - Índices em `pedidos(cliente_id)`, `pedidos(data)`, `pedidos(status)`, `pedido_itens(pedido_id)`
  - RLS habilitado em todas as tabelas
  - Policies criadas conforme seção 3.4 do PRD
  - Trigger `handle_new_user()` que cria registro em `profiles` ao signup
  - `profiles` tem FK para `auth.users(id) ON DELETE CASCADE`
- **Feito:** Schema UUID + `pedidos.created_by` + 4 status + RLS menor privilégio + índices + triggers `set_updated_at`/`handle_new_user` + helper `is_admin()`. Banco recriado e aplicado.
- **Validação Reviewer (2026-08-02):** ✅ PASSA vs `contracts/rls-policies.md` — RLS nas 5 tabelas, 20 policies `TO authenticated`, vendedores SEM DELETE em produtos/clientes/pedidos/pedido_itens, `is_admin()` SECURITY DEFINER correto, `pedido_itens` herda visibilidade do pedido pai (FK `EXISTS`), índices OK. Divergências leves citadas: nomes de policies diferem dos rótulos do contrato (semântica idêntica); FK `created_by` sem ON DELETE (defensivo). Pendências para Phase 1: fonte Inter (§1.2), tokens teal/neutral (§1.1), metadata `layout.tsx` (lang pt-BR, título RapidoLar), redirect `/` → `/dashboard`.

### Task 0.4: Seed Script — 6 Months of Data ✅

- **Status:** ✅ Concluída (2026-08-02) — seed rodado com sucesso
- **Agent:** Coder
- **Dependencies:** T0.3
- **Files affected:** `scripts/seed.ts`, `package.json` (script `npm run seed`)
- **Acceptance criteria:**
  - Script cria 2 usuários Auth: `admin@rapidolar.com` / `vendedor@rapidolar.com` (senha: `123456`)
  - Insere perfis em `profiles` com cargo `admin` e `vendedor`
  - Gera 50 produtos em 5 categorias (limpeza, descartáveis, higiene, alimentos, bebidas)
  - Gera 30 clientes fictícios com nomes brasileiros
  - Gera ~500-900 pedidos nos últimos 6 meses (média 3-5/dia) com 1-5 itens cada
  - Admin vê todos os pedidos, vendedor vê ~40% deles (para testar RLS)
  - Script pode ser executado múltiplas vezes sem duplicar (idempotente)
- **Resultado verificado:** `profiles=2`, `produtos=54`, `clientes=30`, `pedidos=722`, `pedido_itens=1417`.

### Task 0.5: Shadcn/UI Components Setup ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** T0.1 (faltam deps de UI)
- **Files affected:** `src/components/ui/*` (gerado pelo shadcn)
- **Acceptance criteria:**
  - `npx shadcn@latest init` concluído com configuração correta (CSS variables, base style)
  - Componentes instalados: `button`, `card`, `table`, `dialog`, `input`, `label`, `select`, `badge`, `skeleton`, `toast`/`sonner`, `form`, `dropdown-menu`, `sheet`
  - `globals.css` configurado com `@import "tailwindcss"` e variáveis CSS para tema
- **Feito (2026-08-02):** Init shadcn (style `base-nova`, baseColor neutral, CSS vars oklch, icon lucide) + 14 componentes: badge, button, card, chart, dialog, dropdown-menu, input, label, select, sheet, skeleton, sonner, table, toast. `components.json` criado; `globals.css` com `tw-animate-css` + variáveis shadcn (corrigida referência circular `--font-sans` → Geist). Deps: recharts ^3.8.0, lucide-react ^1.28.0, sonner ^2.0.7, react-hook-form ^7.84.0, zod ^4.4.3, @react-pdf/renderer ^4.5.1, next-themes ^0.4.6. **Pendência:** componente `form` NÃO disponível no registry base-nova (react-hook-form + zod instalados; pattern montado manualmente quando precisar). `tsc`/`lint`/`build` ✅ (0 erros).

---

### 🔍 Reviewer Validation — Phase 0 ✅

- **Dependencies:** T0.3, T0.4 (já concluídas) — validação formal executada em 2026-08-02
- **Agent:** Reviewer
- **Checks:**
  - [x] Validar `supabase/migrations/00001_init.sql` contra `specs/001-admin-dashboard-mvp/contracts/rls-policies.md` (omissão de DELETE para vendedores; políticas por operação; helper `is_admin()` security definer)
  - [ ] Validar `00001_init.sql` contra `docs/layout/dashboard.pen` + `docs/DESIGN_SYSTEM.md` (nomes/campos usados no layout)
  - [ ] `npx tsc --noEmit` passes (após hotfix T0.0)
  - [ ] `npm run lint` passes
- **On failure:** Log to `docs/failures/phase-0.md`
- **Nota:** Delegação acionada em 2026-08-02 — aguardando retorno do Reviewer.

---

## Phase 1 — Auth & Layout Shell (F-01 a F-06)

> **Mapa PRD:** T1.1 → F-03/F-06; T1.2 → F-01/F-02; T1.3 → F-04/F-05 (shell + logout); T1.4 → F-05 (perfil/controle por cargo). T0.5 (shadcn) bloqueia T1.2/T1.3.
>
> **Estado (2026-08-02):** ✅ Phase 1 completa — T1.1, T1.2, T1.3 e T1.4 concluídas; validação Reviewer APROVADA (commit `849f7f5`). Phase 2 (dashboard) destravada, aguardando comando do usuário.

### Task 1.1: Auth Middleware & Session Management ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** T0.2
- **Files affected:** `src/middleware.ts`, `src/utils/supabase/middleware.ts` (já existe `createClient` — criar `updateSession` no topo)
- **Acceptance criteria:**
  - Middleware executa em todas as requisições para `/(dashboard|produtos|clientes|pedidos|relatorios)/*`
  - Se não há sessão, redireciona para `/login`
  - Se já autenticado acessa `/login`, redireciona para `/dashboard`
  - Cookie de sessão é atualizado a cada request (refresh)
  - Rotas `/login` e `/auth/*` são públicas
- **Description:**
  Implementar `src/middleware.ts` usando o padrão `@supabase/ssr`. Criar `src/lib/supabase/middleware.ts` com `createMiddlewareClient`. Matcher no middleware para excluir `_next/static`, `_next/image`, `favicon.ico`. Usar `updateSession` para refresh automático.

### Task 1.2: Login Page ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** T1.1, T0.5
- **Files affected:** `src/app/login/page.tsx`, `src/app/login/layout.tsx`, `src/app/auth/confirm/route.ts`
- **Acceptance criteria:**
  - Página `/login` com formulário e-mail + senha
  - Botão "Entrar" com estado de loading
  - Mensagem de erro para credenciais inválidas
  - Redirect para `/dashboard` após login bem-sucedido
  - Layout limpo (sem sidebar), centralizado
  - Logo RapidoLar no topo
  - Rota de callback `/auth/confirm` para confirmação de e-mail (se aplicável)
- **Description:**
  Implementar com `signInWithPassword` do Supabase. Usar `sonner` para toast de erro. Layout da página de login é minimalista, sem o shell principal. Usar componentes shadcn `Button`, `Input`, `Card`.

### Task 1.3: App Shell — Sidebar + Header + Layout ✅

- **Status:** ✅ Concluída (2026-08-02) — cobertura do layout confirmada pelo Designer
- **Agent:** Coder
- **Dependencies:** T1.2, T0.5
- **Files affected:** `src/app/(dashboard)/layout.tsx`, `src/components/layout/sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/layout/user-nav.tsx`
- **Acceptance criteria:**
  - Rota agrupada `(dashboard)` com layout próprio
  - Sidebar esquerda com logo e navegação (Dashboard, Produtos, Clientes, Pedidos, Relatórios)
  - Item "Relatórios" visível apenas para admin
  - Ícone de sair (logout) no final da sidebar ou no header
  - Sidebar colapsável (ícone de menu hamburger)
  - Header com nome do usuário logado e avatar (iniciais)
  - Layout responsivo: sidebar vira overlay em mobile/tablet
  - Breadcrumb ou indicação de página ativa na sidebar
- **Description:**
  Criar grupo `(dashboard)` no App Router. Sidebar com `Lucide` icons. Estado "active" baseado no pathname (`usePathname()`). Logout via `signOut()` do Supabase + redirect. Usar `Sheet` do shadcn para sidebar mobile overlay. Header com `DropdownMenu` para perfil/logout.

### Task 1.4: Profile Page (Self-Service) ✅

- **Status:** ✅ Concluída (2026-08-02)
- **Agent:** Coder
- **Dependencies:** T1.3
- **Files affected:** `src/app/(dashboard)/perfil/page.tsx`
- **Acceptance criteria:**
  - Página `/perfil` acessível pelo dropdown do usuário
  - Exibe nome, email, cargo do usuário logado
  - Admin pode editar nome; vendedor apenas visualiza
- **Description:**
  CRUD simples no próprio perfil. Server Component que busca dados da `profiles` e exibe em card. Se for admin, botão "Editar" abre dialog para alterar nome. (P2 — pode ser simplificada.)

---

### 🔍 Reviewer Validation — Phase 1 ✅

- **Dependencies:** All tasks in Phase 1 — executada em 2026-08-02, veredito **APROVADO**
- **Agent:** Reviewer
- **Checks:**
  - [x] `npx tsc --noEmit` passes
  - [x] `npm run lint` passes
  - [x] Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-1.md` — 2 desvios leves corrigidos em fast-follow; nits corrigidos (UserIcon, aria-current, border-destructive, gap-8); 2 aceitos p/ MVP. Nenhuma falha crítica.

---

## Phase 2 — Dashboard

> **Estado (2026-08-02):** ✅ Phase 2 completa — T2.1, T2.2, T2.3, T2.4 e T2.5 concluídas; validação Reviewer APROVADA (commit `ec153d0`). Phase 3 (CRUD) destravada, aguardando comando do usuário.

### Task 2.1: Metric Cards Component ✅

> **Decisão do Owner (2026-07-31):** F-07 alinhado a 4 cards (faturamento hoje, faturamento do mês, pedidos hoje, ticket médio). "Clientes ativos" e "pedidos (mês)" descopados — removidos do PRD F-07. Protótipo `dashboard.pen` e `DESIGN_SYSTEM.md` são a fonte de verdade.

- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/metric-cards.tsx`
- **Acceptance criteria:**
  - 4 cards em grid: Faturamento Hoje, Faturamento Mês, Pedidos Hoje, Ticket Médio Mês
  - Cada card exibe valor formatado em R$ ou número inteiro
  - Variação percentual vs período anterior (seta verde/vermelha)
  - Skeleton enquanto carrega
  - Busca dados via Server Component (query agregada no Supabase)
- **Description:**
  Componente Client Component (para animação/entrada de dados). Recebe dados por props de um Server Component pai. Formatação de moeda com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Variação calculada: ((atual - anterior) / anterior) \* 100.

### Task 2.2: Sales Chart with Period Selector ✅

- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/sales-chart.tsx`, `src/components/dashboard/period-selector.tsx`
- **Acceptance criteria:**
  - Gráfico de linha (Recharts `LineChart`) com vendas ao longo do tempo
  - Seletor de período: 7 dias, 30 dias, 12 meses
  - Eixo X com datas formatadas (dd/mm ou mês/ano)
  - Eixo Y com valores em R$
  - Tooltip ao passar mouse sobre pontos
  - Botões de período estilizados (active state no selecionado)
  - Loading skeleton
- **Description:**
  Agrupar pedidos por data (7d/30d agrupamento diário; 12m agrupamento mensal). Recharts `ResponsiveContainer`, `LineChart`, `Line`, `XAxis`, `YAxis`, `Tooltip`, `CartesianGrid`. Dados passados por props. Seletor controla estado no Client Component e faz fetch via Server Action ou query param.

### Task 2.3: Top 10 Products Table ✅

- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/top-products.tsx`
- **Acceptance criteria:**
  - Tabela com 10 linhas: #| Produto | Qtd Vendida | Receita Total (sem coluna "Categoria" — alinhado ao PRD F-09 e protótipo)
  - Ordenado por receita total decrescente
  - Formatação de moeda na coluna receita
  - Scroll em telas menores
- **Description:**
  Query SQL: `SELECT p.nome, p.categoria, SUM(pi.qtd) as qtd_vendida, SUM(pi.qtd * pi.preco_unit) as receita FROM pedido_itens pi JOIN produtos p ON p.id = pi.produto_id GROUP BY p.id ORDER BY receita DESC LIMIT 10`. Usar shadcn `Table`.

### Task 2.4: Top 10 Clients Table ✅

- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/top-clients.tsx`
- **Acceptance criteria:**
  - Tabela com 10 linhas: #| Cliente | Telefone | Total Compras | Qtd Pedidos
  - Ordenado por total compras decrescente
  - Link para página do cliente (futuro)
- **Description:**
  Query SQL: `SELECT c.nome, c.telefone, SUM(ped.total) as total_compras, COUNT(ped.id) as qtd_pedidos FROM pedidos ped JOIN clientes c ON c.id = ped.cliente_id GROUP BY c.id ORDER BY total_compras DESC LIMIT 10`. Usar shadcn `Table`.

### Task 2.5: Dashboard Page Assembly ✅

- **Dependencies:** T2.1, T2.2, T2.3, T2.4
- **Files affected:** `src/app/(dashboard)/dashboard/page.tsx`
- **Acceptance criteria:**
  - Página `/(dashboard)/dashboard/page.tsx` monta todos os componentes do dashboard
  - Server Component: busca dados de métricas, top produtos, top clientes
  - Client Component: gráfico com seletor de período
  - Layout responsivo: métricas em grid 2x2 (desktop) → 2x2 (tablet) → 1x4 (mobile)
  - Gráfico ocupa largura total; tabelas lado a lado em desktop (2 colunas)
  - Página carrega em <2s (medido com console.time ou DevTools)
  - Título "Dashboard" e data de atualização
- **Description:**
  Página principal que orquestra todos os sub-componentes. Server Component faz as queries agregadas e passa como props. O gráfico é Client Component porque precisa de interação (seletor de período). Usar grid layout do Tailwind para responsividade. Adicionar `revalidate = 60` (ISR) ou manter SSR com cache curto.

---

### 🔍 Reviewer Validation — Phase 2 ✅

- **Dependencies:** All tasks in Phase 2 — executada em 2026-08-02, veredito **APROVADO**
- **Agent:** Reviewer
- **Checks:**
  - [x] `npx tsc --noEmit` passes
  - [x] `npm run lint` passes
  - [x] Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-2.md` — 1 desvio de cor ACEITO (hex vs hsl(var) no Recharts), 2 swaps de ícone §6 corrigidos em fast-follow. Nenhuma falha crítica.

---

## Phase 3 — CRUD Modules

### Task 3.1: Products CRUD

- **Dependencies:** T1.3, T0.5
- **Files affected:**
  - `src/app/(dashboard)/produtos/page.tsx`
  - `src/components/produtos/produtos-tabela.tsx`
  - `src/components/produtos/produto-form.tsx`
  - `src/app/(dashboard)/produtos/actions.ts`
- **Acceptance criteria:**
  - Tabela listando todos os produtos (nome, categoria, preço, estoque)
  - Botão "Novo Produto" abre modal com formulário
  - Modal com campos: nome, categoria (select), preço, estoque
  - Botão de editar em cada linha abre modal preenchido
  - Botão de excluir com confirmação (alert dialog)
  - Admin pode criar/editar/excluir; vendedor vê apenas leitura (ocultar ações)
  - Toast de sucesso/erro após cada operação
  - Validação: preço > 0, estoque >= 0, nome obrigatório
  - Server Actions para cada operação com verificação de role
- **Description:**
  Implementar CRUD completo. Server Action verifica `cargo` do usuário logado antes de mutar. Formulário usa `react-hook-form` + `zod` para validação (shadcn form pattern). Modal é `Dialog` do shadcn. Tabela com `Table`. Categoria como `Select`. Tudo tipado com TypeScript strict.

### Task 3.2: Clients CRUD

- **Dependencies:** T1.3, T0.5
- **Files affected:**
  - `src/app/(dashboard)/clientes/page.tsx`
  - `src/components/clientes/clientes-tabela.tsx`
  - `src/components/clientes/cliente-form.tsx`
  - `src/app/(dashboard)/clientes/actions.ts`
- **Acceptance criteria:**
  - Tabela listando todos os clientes (nome, telefone, endereço)
  - Botão "Novo Cliente" abre modal com formulário
  - Modal com campos: nome, telefone (masked), endereço (textarea)
  - Editar e excluir similares ao Task 3.1
  - Mesmas regras de role (admin edita, vendedor leitura)
  - Validação: nome obrigatório, telefone opcional com formato brasileiro
  - Toast de feedback
- **Description:**
  CRUD de clientes. Feature similar ao de produtos. Input de telefone pode usar `pattern` regex (`^\(\d{2}\) \d{4,5}-\d{4}$`) ou lib de mask (InputMask ou implementação simples). Server Actions com role check.

### Task 3.3: Orders List with Filters

- **Dependencies:** T1.3, T0.5, T3.1, T3.2
- **Files affected:**
  - `src/app/(dashboard)/pedidos/page.tsx`
  - `src/components/pedidos/pedidos-tabela.tsx`
  - `src/components/pedidos/pedidos-filtros.tsx`
- **Acceptance criteria:**
  - Tabela de pedidos com colunas: ID (abreviado), Cliente, Data, Status, Total
  - Filtros:
    - Data: date range picker (data início / data fim)
    - Cliente: select searchable com todos os clientes
    - Status: multi-select ou select com (todos/pendente/confirmado/entregue/cancelado)
  - Filtros refletem via URL search params (compartilháveis)
  - Paginação (10 ou 20 por página)
  - Badge de status com cor: pendente (amarelo), confirmado (azul), entregue (verde), cancelado (vermelho)
  - Botão "Novo Pedido" → abre modal/form de criação
  - Loading state durante fetch
- **Description:**
  Lista com filtros usando `useSearchParams` para estado. Server Component lê search params e monta query Supabase com filtros. Paginação com `range()` no Supabase (offset + limit). Badge de status usando `cva` ou variantes do shadcn `Badge`.

### Task 3.4: Order Form (Create/Edit with Items)

- **Dependencies:** T3.3, T3.1, T3.2
- **Files affected:**
  - `src/components/pedidos/pedido-form.tsx`
  - `src/components/pedidos/pedido-item-row.tsx`
  - `src/components/pedidos/selecionar-produto.tsx`
  - `src/app/(dashboard)/pedidos/actions.ts`
- **Acceptance criteria:**
  - Modal/formulário para criar/editar pedido
  - Seção de dados do pedido: cliente (select searchable), data (date picker), status
  - Seção de itens: lista dinâmica de linhas (produto, qtd, preço unit, subtotal)
  - Botão "Adicionar Item" insere nova linha vazia
  - Ao selecionar produto, preço unitário preenche automaticamente (pode editar)
  - Subtotal calculado em tempo real (qtd × preco_unit)
  - Total do pedido calculado e exibido (soma dos subtotais)
  - Botão "Remover" em cada item
  - Ao salvar: valida se há ao menos 1 item
  - Server Action: insere pedido + itens em transação
  - Admin pode editar qualquer pedido; vendedor apenas os seus
- **Description:**
  Componente complexo com estado dinâmico de array de itens. Usar `useFieldArray` do `react-hook-form` ou estado local com `useReducer`. Select de produto com busca (combo box). Preço unitário vem do produto mas é editável. Server Action usa `upsert` para edição (exclui itens antigos e reinsere).

### Task 3.5: Search & Quick Filter for Products/Clients

- **Dependencies:** T3.1, T3.2
- **Files affected:** `src/components/produtos/produtos-search.tsx`, `src/components/clientes/clientes-search.tsx`
- **Acceptance criteria:**
  - Campo de busca na página de produtos (filtra por nome)
  - Campo de busca na página de clientes (filtra por nome)
  - Debounce de 300ms no input
  - Filtro reflete via URL search params
- **Description:**
  Input de busca com `useTransition` para não travar UI. Debounce simples com `useEffect` + `setTimeout`. Atualiza search params sem causar navegação full-page (usar `useRouter` + `useSearchParams`).

---

### 🔍 Reviewer Validation — Phase 3

- **Dependencies:** All tasks in Phase 3
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-3.md`

> **Estado (2026-08-02):** ✅ Phase 3 completa — T3.1, T3.2, T3.3, T3.4 e T3.5 concluídas; validação Reviewer **APROVADO COM RESSALVAS** (commit `be303f5`). 3 leves + 3 nits do fast-follow corrigidos e validados em browser (RLS delete do vendedor, debounce de filtros, combobox de cliente, tipagem sem `any`, erro FK 23503). Migration `00002` (policies delete_own_or_admin / delete_own_via_parent) aplicada no banco via SQL Editor. Phase 4 destravada, aguardando comando do usuário.

---

## Phase 4 — Reports & Polish

> **Estado (2026-08-02):** ✅ Phase 4 **APROVADA** (commit `023abc8`, revalidação Reviewer em `docs/failures/phase-4.md`) — T4.1, T4.2, T4.5 e T4.6 pelo Coder; T4.7 (fix frame Landing Page + CtaCard) pelo Designer. 3 nits opcionais aceitos para MVP (§3.0 nav CTA `size=lg` vs `md`, features com `flex-wrap` vs grid, preview `p-4 md:p-6`). Fast-follows aplicados: T4.3 (chart desktop 350px) e T4.4 (toast erro 6s via `src/lib/toast.ts`). **Projeto concluído** — todas as 7 fases (Phase -1 a Phase 4) validadas.
>
> **Hotfix 0.1 (2026-08-02, commit `be5d311`):** `SelectValue` do base-ui renderizava o value cru (UUID de produto / status cru) quando o popup de itens ainda não estava montado (lazy) — exibindo o id do item no modal de pedidos. Corrigido com children function do `SelectValue` em 5 pontos (pedido-form, pedidos-filtros, produto-form). Bug extra: seed gravava categorias capitalizadas (`"Limpeza"`) mas app valida minúsculo (`limpeza`) — corrigido no seed + migration `00003_normaliza_categoria_produto.sql` (aplicada no banco via SQL Editor).

### Task 4.1: Reports Page with PDF Export

- **Status:** ✅ Concluída (2026-08-02, commit `023abc8`) — rota `/relatorios` presente no build (ƒ dinâmica)
- **Agent:** Coder
- **Dependencies:** T1.3, T0.5
- **Files affected:**
  - `src/app/(dashboard)/relatorios/page.tsx`
  - `src/components/relatorios/relatorio-form.tsx`
  - `src/components/relatorios/relatorio-pdf.tsx`
- **Acceptance criteria:**
  - Página acessível apenas por admin (vendedor vê mensagem de acesso negado)
  - Seletor de período (data início / data fim)
  - Botão "Gerar Relatório" → exibe preview na tela
  - Botão "Exportar PDF" → download do PDF
  - Conteúdo do PDF: logo RapidoLar, período selecionado, faturamento total, total de pedidos, top 10 produtos, top 10 clientes
  - PDF formatado profissionalmente (tabelas, cores)
  - Loading state enquanto gera
- **Description:**
  Usar `@react-pdf/renderer` (renderização no cliente) ou `html2canvas` + `jsPDF`. Para `@react-pdf/renderer`: criar documento PDF com `Document`, `Page`, `View`, `Text`, `Table` (biblioteca ou manual). Para alternatives: Server-side com `puppeteer` ou `wkhtmltopdf`. A rota deve verificar `cargo === 'admin'` via Server Component.

### Task 4.2: Error & Loading States

- **Status:** ✅ Concluída (2026-08-02, commit `023abc8`) — `not-found.tsx`, `error.tsx`, 4× `loading.tsx` criados
- **Dependencies:** T1.3, T2.5, T3.1, T3.2, T3.3
- **Files affected:**
  - `src/app/not-found.tsx` (404 global)
  - `src/app/error.tsx` (500 global)
  - `src/app/(dashboard)/dashboard/loading.tsx`
  - `src/app/(dashboard)/produtos/loading.tsx`
  - `src/app/(dashboard)/clientes/loading.tsx`
  - `src/app/(dashboard)/pedidos/loading.tsx`
- **Acceptance criteria:**
  - Página 404 customizada com mensagem e link para /dashboard
  - Página 500 customizada com mensagem e botão "Tentar novamente"
  - Loading pages com skeleton para cada seção
  - Estados de erro em operações CRUD (toast + feedback visual)
- **Description:**
  Criar arquivos `loading.tsx` e `error.tsx` para cada rota que precisa. Loading exibe skeletons compatíveis com o layout da página. Error page captura exceções e oferece "Tentar novamente" (botão que chama `reset()`).

### Task 4.3: Responsive & Mobile Adjustments

- **Dependencies:** T2.5, T3.1, T3.2, T3.3, T4.1
- **Files affected:**
  - `src/components/layout/sidebar.tsx` (overlay em mobile)
  - `src/components/dashboard/metric-cards.tsx` (grid adaptável)
  - `src/components/dashboard/sales-chart.tsx` (altura ajustável)
  - `src/components/produtos/produtos-tabela.tsx` (horizontal scroll)
  - `src/components/clientes/clientes-tabela.tsx` (horizontal scroll)
  - `src/components/pedidos/pedidos-tabela.tsx` (horizontal scroll)
- **Acceptance criteria:**
  - Sidebar colapsa em <1024px com overlay (Sheet)
  - Tabelas têm scroll horizontal em <768px (`overflow-x-auto`)
  - Cards de métricas em grid 1 coluna em <640px
  - Gráfico reduz altura em mobile
  - Modais em tela cheia no mobile (`Dialog` com `fullscreen` ou classes custom)
  - Formulários adaptados (inputs empilhados em mobile)
  - Navegação funcional em touch (focus visível, botões grandes o suficiente)
- **Description:**
  Testar em viewports 375px, 768px, 1024px, 1440px. Ajustar classes Tailwind com breakpoints `sm:`, `md:`, `lg:`. Sidebar usa `Sheet` do shadcn para mobile. Tabelas ganham `min-w-[600px]` e wrapper com overflow. Modais do shadcn já são responsivos por padrão — ajustar `DialogContent` para mobile.

### Task 4.4: Toast Notifications & UX Polish

- **Dependencies:** T3.1, T3.2, T3.4
- **Files affected:** `src/components/ui/sonner.tsx`, `src/app/(dashboard)/layout.tsx`
- **Acceptance criteria:**
  - Toaster `<Toaster />` configurado no layout principal
  - Toda mutação CRUD exibe toast de sucesso ("Produto criado com sucesso!")
  - Erros exibem toast com mensagem descritiva
  - Toasts com ícones e cores (success=verde, error=vermelho)
  - Duração: 4s para sucesso, 6s para erro
  - Posição: bottom-right
- **Description:**
  Adicionar `<Toaster />` do `sonner` no layout raiz. Em cada Server Action, retornar `{ success: true, message: "..." }` ou `{ error: "..." }`. No Client Component, chamar `toast.success()` ou `toast.error()` com base no retorno.

### Task 4.5: Final TypeScript & Lint Pass

- **Status:** ✅ Concluída (2026-08-02, commit `023abc8`) — tsc 0 erros, lint 0 warnings
- **Dependencies:** T0.1 a T4.4 (tudo)
- **Files affected:** Todos os arquivos `.ts` e `.tsx`
- **Acceptance criteria:**
  - `npx tsc --noEmit` passa sem erros
  - `npm run lint` passa sem erros (ESLint configurado)
  - Sem imports não utilizados
  - Sem `any` implícitos
  - Path alias `@/*` usado consistentemente (sem `../../` relativos)
- **Description:**
  Revisão final. Rodar `npx tsc --noEmit` e corrigir todos os erros de tipo. Rodar `npm run lint` e corrigir warnings. Verificar que todos os componentes são strict typed. Garantir que não há `console.log` esquecidos.

### Task 4.6: Root Page — Landing → Login (Designer + Coder)

- **Status:** ✅ Implementada (2026-08-02, commit `023abc8`) — aguardando validação do Reviewer; frame `LndPg` corrigido na T4.7 (Designer)
- **Agent:** Designer (especificação visual em `docs/DESIGN_SYSTEM.md` + protótipo Pencil.dev) → Coder (implementação)
- **Dependencies:** T0.5 (UI components), T1.2 (login existe), T4.7 (fix do frame pelo Designer, não bloqueia implementação — DESIGN_SYSTEM.md §3.0 é a fonte de verdade)
- **Files affected:**
  - Designer: `docs/DESIGN_SYSTEM.md` (seção §3.0 Página Raiz — já criada v1.1), `docs/layout/dashboard.pen` (ver T4.7)
  - Coder: `src/app/page.tsx`
- **Acceptance criteria:**
  - Página raiz (`/`) é uma landing atrativa da RapidoLar (não mais o placeholder "em construção")
  - Apresenta o produto: título, subtítulo, destaque de funcionalidades (dashboard, produtos, clientes, pedidos, relatórios)
  - CTA primário "Entrar" leva para `/login`
  - Sem sidebar/header do shell; página pública e leve
  - Responsivo: mobile e desktop
  - Segue paleta, tipografia e tokens do `DESIGN_SYSTEM.md` (§1, §2)
  - `npx tsc --noEmit` e `npm run lint` passam
- **Description:**
  A raiz `src/app/page.tsx` hoje é um placeholder mínimo ("Painel de vendas em construção"). O Designer definiu o wireframe/layout da landing na seção §3.0 do DESIGN_SYSTEM.md (análogo ao §3.1 do login), e o Coder implementa seguindo a especificação — **ignorar os ícones emoji do frame no `dashboard.pen` (quebrado); usar os ícones Lucide do mapeamento §6** (LayoutDashboard, Package, Users, ShoppingCart, FileText). Middleware já redireciona autenticados para `/dashboard`, então a landing é exibida apenas para visitantes não autenticados.

### Task 4.7: Fix Landing Page Frame (Designer) 🔧

- **Status:** ✅ Concluída (2026-08-02) — frame `LndPg` corrigido em 2 rodadas: (1) emoji→rótulos Lucide kebab nos Feature Cards, refs/descendants validados; (2) **CtaCard** `width: fill_container`→`1152` (max-w-6xl centralizada, não cobre mais a tela) + `CtaTitle`/`CtaSub` com `width: fill_container` (fim da quebra "letra embaixo da outra"). DESIGN_SYSTEM.md bumped p/ v1.3
- **Agent:** Designer
- **Dependencies:** T4.6 (spec §3.0 já criada — validar alinhamento)
- **Files affected:**
  - `docs/layout/dashboard.pen` (frame `LndPg` + componentes reutilizáveis `FXcRd` Feature Card e `BTNLt` Button Light)
  - `docs/DESIGN_SYSTEM.md` (seção §3.0 — ajustar se necessário após correção)
- **Acceptance criteria:**
  - Frame `LndPg` (Landing Page) do `dashboard.pen` renderiza sem elementos quebrados (refs válidos, descendants sobrepondo texto corretamente)
  - Ícones dos Feature Cards usam o **mapeamento Lucide da §6** (LayoutDashboard, Package, Users, ShoppingCart, FileText) — hoje usam emoji (📊📦👥🛒📄) como texto, divergente da spec §3.0
  - Estrutura de grid confere com §3.0: 3 cards na 1ª linha + 2 centralizados na 2ª (`Row1`/`Row2` com `justifyContent=center`), icon box `h-10 w-10` com `$secondary`
  - CTA band (`$brand`), Nav (`h-72`), Hero e Footer alinhados ao wireframe §3.0
  - `dashboard.pen` continua um JSON válido (parseável) e as variáveis `$secondary`/`$secondaryfg` declaradas
- **Description:**
  O frame "Landing Page" (`LndPg`) adicionado em v1.1 do protótipo contém elementos quebrados: o componente reutilizável `FXcRd` (Feature Card) renderiza o ícone como **texto emoji** (`📊`) em vez de ícone Lucide, divergindo do `DESIGN_SYSTEM.md` §3.0/§6; verificar também que todos os `descendants` dos refs (`Ld105`, `Ld116`, `Ld117`, `Ld124`-`Ld129`, `Ld134`) apontam para ids existentes dentro dos componentes referenciados (`qV94Q`, `joEV9`, `FXcRd`, `BTNLt`) e que os textos de override (título/descrição dos cards, botões) renderizam corretamente por instância. Corrigir no `dashboard.pen` e, se necessário, ajustar a §3.0 do `DESIGN_SYSTEM.md` para refletir o que foi corrigido.

---

### 🔍 Reviewer Validation — Phase 4

- **Dependencies:** All tasks in Phase 4 (T4.1, T4.2, T4.3, T4.4, T4.5, T4.6, T4.7)
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-4.md`

> **Estado (2026-08-02):** ✅ **APROVADO** — revalidação executada sobre o commit `023abc8` (ver `docs/failures/phase-4.md`). tsc 0 erros, lint 0 warnings, build PASS com rota `/relatorios`; 404 customizado confirmado em runtime; landing `/` conforme §3.0 (ícones Lucide, zero emoji); nits T4.3/T4.4 corrigidos. 3 nits opcionais aceitos (nav CTA `size=lg` vs `md`, features `flex-wrap` vs grid, preview `p-4 md:p-6`). Nenhuma falha bloqueante.
