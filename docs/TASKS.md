# Tasks — Dashboard de Vendas RapidoLar

> **Gerado pelo Owner.** Tarefas ordenadas por dependência.
> **Total:** 26 tarefas em 6 fases (Phase -1 a Phase 4)

---

## Phase -1 — Design System (Pencil.dev)

### Task D.1: Layout Prototyping
- **Dependencies:** Nenhuma
- **Agent:** Designer
- **Files affected:** `docs/DESIGN_SYSTEM.md`
- **Acceptance criteria:**
  - Layout de todas as páginas definido no Pencil.dev
  - Paleta de cores, tipografia, espaçamentos documentados
  - Componentes UI mapeados (cards, tabelas, forms, modals)
  - Responsividade definida (desktop, tablet, mobile)
  - Exportado para `docs/DESIGN_SYSTEM.md`
- **Description:**
  Designer consome o PRD.md, cria wireframes e high-fidelity layouts no Pencil.dev para: login, dashboard (com métricas, gráfico, tabelas), produtos (tabela + CRUD), clientes (tabela + CRUD), pedidos (tabela + filtros + form com itens), relatórios (PDF export). Exporta especificação visual para DESIGN_SYSTEM.md.

---

## Phase 0 — Setup & Foundation

### Task 0.1: Initialize Dependencies
- **Dependencies:** Nenhuma
- **Files affected:** `package.json`, `tsconfig.json`
- **Acceptance criteria:**
  - Projeto compila com `npx tsc --noEmit` sem erros
  - `npm run dev` abre em `http://localhost:3000`
  - Tailwind CSS v4 funcional (classe `text-3xl font-bold` renderiza estilizado)
- **Description:**
  Instalar dependências necessárias: `@supabase/supabase-js`, `@supabase/ssr`, `recharts`, `shadcn/ui` (configure com `npx shadcn@latest init`), `lucide-react`, `sonner` (toast), `@react-pdf/renderer` (PDF). Garantir que `tailwindcss` v4 e `@tailwindcss/postcss` estão configurados. Verificar que `postcss.config.mjs` usa `@tailwindcss/postcss`.

### Task 0.2: Configure Supabase Client
- **Dependencies:** T0.1
- **Files affected:** `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`, `src/lib/supabase/middleware.ts`, `.env.local`
- **Acceptance criteria:**
  - Client browser criado com `@supabase/ssr` (`createBrowserClient`)
  - Server client criado com `createServerClient` (lê cookies)
  - Middleware client para uso em `src/middleware.ts`
  - `.env.local` com `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Description:**
  Seguir padrão do `@supabase/ssr` para Next.js App Router. Criar três módulos: `client.ts` (uso em browser), `server.ts` (uso em Server Components / Server Actions), `middleware.ts` (para refresh de sessão). Tipar o `Database` usando `supabase gen types`.

### Task 0.3: SQL Migration — Schema & RLS
- **Dependencies:** T0.2
- **Files affected:** `supabase/migrations/001_initial.sql` (ou script SQL inline)
- **Acceptance criteria:**
  - Tabelas `profiles`, `produtos`, `clientes`, `pedidos`, `pedido_itens` criadas
  - Índices em `pedidos(cliente_id)`, `pedidos(data)`, `pedidos(status)`, `pedido_itens(pedido_id)`
  - RLS habilitado em todas as tabelas
  - Policies criadas conforme seção 3.4 do PRD
  - Trigger `handle_new_user()` que cria registro em `profiles` ao signup
  - `profiles` tem FK para `auth.users(id) ON DELETE CASCADE`
- **Description:**
  Escrever migration SQL com CREATE TABLE, índices, RLS policies e trigger de profile. Executar via Supabase Dashboard ou `supabase migration up`. Garantir que as policies cobrem admin (tudo) e vendedor (apenas seus pedidos, apenas SELECT em produtos/clientes).

### Task 0.4: Seed Script — 6 Months of Data
- **Dependencies:** T0.3
- **Files affected:** `scripts/seed.ts`, `package.json` (add script)
- **Acceptance criteria:**
  - Script cria 2 usuários Auth: `admin@rapidolar.com` / `vendedor@rapidolar.com` (senha: `123456`)
  - Insere perfis em `profiles` com cargo `admin` e `vendedor`
  - Gera 50 produtos em 5 categorias (limpeza, descartáveis, higiene, alimentos, bebidas)
  - Gera 30 clientes fictícios com nomes brasileiros
  - Gera ~500-900 pedidos nos últimos 6 meses (média 3-5/dia) com 1-5 itens cada
  - Admin vê todos os pedidos, vendedor vê ~40% deles (para testar RLS)
  - Script pode ser executado múltiplas vezes sem duplicar (idempotente)
- **Description:**
  Criar script TypeScript executado com `tsx scripts/seed.ts`. Usar `@supabase/supabase-js` com `service_role` key para bypass de RLS. Usar `@faker-js/faker` ou geração manual com arrays de nomes brasileiros. Distribuir datas aleatórias nos últimos 180 dias.

### Task 0.5: Shadcn/UI Components Setup
- **Dependencies:** T0.1
- **Files affected:** `src/components/ui/*` (gerado pelo shadcn)
- **Acceptance criteria:**
  - `npx shadcn@latest init` concluído com configuração correta (CSS variables, base style)
  - Componentes instalados: `button`, `card`, `table`, `dialog`, `input`, `label`, `select`, `badge`, `skeleton`, `toast`/`sonner`, `form`, `dropdown-menu`, `sheet`
  - `globals.css` configurado com `@import "tailwindcss"` e variáveis CSS para tema
- **Description:**
  Executar `npx shadcn@latest init` (new-york style, neutral ou slate base color, CSS variables). Depois adicionar componentes via `npx shadcn@latest add button card table dialog input label select badge skeleton sonner form dropdown-menu sheet`. Verificar que `tailwindcss` v4 está funcionando com as CSS variables do shadcn.

---

### 🔍 Reviewer Validation — Phase 0
- **Dependencies:** All tasks in Phase 0
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-0.md`

---

## Phase 1 — Auth & Layout Shell

### Task 1.1: Auth Middleware & Session Management
- **Dependencies:** T0.2
- **Files affected:** `src/middleware.ts`, `src/lib/supabase/middleware.ts`
- **Acceptance criteria:**
  - Middleware executa em todas as requisições para `/(dashboard|produtos|clientes|pedidos|relatorios)/*`
  - Se não há sessão, redireciona para `/login`
  - Se já autenticado acessa `/login`, redireciona para `/dashboard`
  - Cookie de sessão é atualizado a cada request (refresh)
  - Rotas `/login` e `/auth/*` são públicas
- **Description:**
  Implementar `src/middleware.ts` usando o padrão `@supabase/ssr`. Criar `src/lib/supabase/middleware.ts` com `createMiddlewareClient`. Matcher no middleware para excluir `_next/static`, `_next/image`, `favicon.ico`. Usar `updateSession` para refresh automático.

### Task 1.2: Login Page
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

### Task 1.3: App Shell — Sidebar + Header + Layout
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

### Task 1.4: Profile Page (Self-Service)
- **Dependencies:** T1.3
- **Files affected:** `src/app/(dashboard)/perfil/page.tsx`
- **Acceptance criteria:**
  - Página `/perfil` acessível pelo dropdown do usuário
  - Exibe nome, email, cargo do usuário logado
  - Admin pode editar nome; vendedor apenas visualiza
- **Description:**
  CRUD simples no próprio perfil. Server Component que busca dados da `profiles` e exibe em card. Se for admin, botão "Editar" abre dialog para alterar nome. (P2 — pode ser simplificada.)

---

### 🔍 Reviewer Validation — Phase 1
- **Dependencies:** All tasks in Phase 1
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-1.md`

---

## Phase 2 — Dashboard

### Task 2.1: Metric Cards Component
- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/metric-cards.tsx`
- **Acceptance criteria:**
  - 4 cards em grid: Faturamento Hoje, Faturamento Mês, Pedidos Hoje, Ticket Médio Mês
  - Cada card exibe valor formatado em R$ ou número inteiro
  - Variação percentual vs período anterior (seta verde/vermelha)
  - Skeleton enquanto carrega
  - Busca dados via Server Component (query agregada no Supabase)
- **Description:**
  Componente Client Component (para animação/entrada de dados). Recebe dados por props de um Server Component pai. Formatação de moeda com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`. Variação calculada: ((atual - anterior) / anterior) * 100.

### Task 2.2: Sales Chart with Period Selector
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

### Task 2.3: Top 10 Products Table
- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/top-products.tsx`
- **Acceptance criteria:**
  - Tabela com 10 linhas: #| Produto | Categoria | Qtd Vendida | Receita Total
  - Ordenado por receita total decrescente
  - Formatação de moeda na coluna receita
  - Badge de categoria
  - Scroll em telas menores
- **Description:**
  Query SQL: `SELECT p.nome, p.categoria, SUM(pi.qtd) as qtd_vendida, SUM(pi.qtd * pi.preco_unit) as receita FROM pedido_itens pi JOIN produtos p ON p.id = pi.produto_id GROUP BY p.id ORDER BY receita DESC LIMIT 10`. Usar shadcn `Table`.

### Task 2.4: Top 10 Clients Table
- **Dependencies:** T1.3, T0.5
- **Files affected:** `src/components/dashboard/top-clients.tsx`
- **Acceptance criteria:**
  - Tabela com 10 linhas: #| Cliente | Telefone | Total Compras | Qtd Pedidos
  - Ordenado por total compras decrescente
  - Link para página do cliente (futuro)
- **Description:**
  Query SQL: `SELECT c.nome, c.telefone, SUM(ped.total) as total_compras, COUNT(ped.id) as qtd_pedidos FROM pedidos ped JOIN clientes c ON c.id = ped.cliente_id GROUP BY c.id ORDER BY total_compras DESC LIMIT 10`. Usar shadcn `Table`.

### Task 2.5: Dashboard Page Assembly
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

### 🔍 Reviewer Validation — Phase 2
- **Dependencies:** All tasks in Phase 2
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-2.md`

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

---

## Phase 4 — Reports & Polish

### Task 4.1: Reports Page with PDF Export
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

---

### 🔍 Reviewer Validation — Phase 4
- **Dependencies:** All tasks in Phase 4
- **Agent:** Reviewer
- **Checks:**
  - `npx tsc --noEmit` passes
  - `npm run lint` passes
  - Layout matches `DESIGN_SYSTEM.md` (visual comparison)
- **On failure:** Log to `docs/failures/phase-4.md`
