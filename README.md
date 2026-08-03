# RapidoLar Dashboard

Painel de vendas para a **Distribuidora RapidoLar** (projeto fictício de portfólio) — distribuição de produtos de limpeza e descartáveis para mercadinhos, restaurantes e padarias. Substitui as planilhas Excel compartilhadas por um painel web com login, CRUD completo, visão em tempo real e relatórios em PDF.

## Stack

- **Next.js 16** (App Router + Turbopack) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** (CSS-first, sem `tailwind.config.js`) + **shadcn/ui**
- **Supabase**: Auth + Postgres + RLS (Row Level Security)
- **Recharts** (gráficos) · **@react-pdf/renderer** (exportação PDF)
- **react-hook-form + zod** (formulários) · **sonner** (toasts) · **lucide-react** (ícones)

## Começando

Pré-requisitos: Node 20+, npm e um projeto Supabase.

1. `npm install`
2. Crie `.env.local` na raiz:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_ANON_KEY=...
   SUPABASE_SERVICE_ROLE_KEY=...   # usado apenas pelo seed
   ```

3. Aplique as migrations do schema (`supabase/migrations/00001_init.sql` e seguintes): tabelas, triggers e políticas RLS.
4. `npm run seed` — cria os 2 usuários e 6 meses de histórico de vendas.
5. `npm run dev` → http://localhost:3000

> Use **npm** (não pnpm) — o projeto tem dois lockfiles e os scripts do `package.json` são configurados para npm.

## Usuários de teste (criados pelo seed)

| Email | Senha | Cargo |
| --- | --- | --- |
| admin@rapidolar.com | admin123 | admin (acesso total) |
| vendedor@rapidolar.com | vendedor123 | vendedor (vê/gerencia apenas os próprios pedidos) |

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run lint` | ESLint (core-web-vitals + TypeScript) |
| `npm run seed` | Seed de usuários + 6 meses de vendas |

## Estrutura de páginas

```
/login          → autenticação
/dashboard      → métricas (faturamento dia/mês, pedidos hoje, ticket médio),
                  gráfico de vendas (7 dias / 30 dias / 12 meses),
                  top produtos, top clientes
/produtos       → lista + CRUD (admin) / leitura (vendedor)
/clientes       → lista + CRUD (admin) / leitura (vendedor)
/pedidos        → lista com filtros por data, cliente e status + CRUD
/relatorios     → exportação de relatórios em PDF (admin)
```

## Acesso por cargo (RLS)

As políticas do Supabase aplicam **menor privilégio** (`is_admin()` + escopo por usuário):

- **admin**: CRUD completo de produtos, clientes e pedidos; vê todos os pedidos e perfis.
- **vendedor**: SELECT em produtos/clientes; vê e gerencia apenas os **próprios** pedidos; sem DELETE.
- `pedido_itens` herda a visibilidade do pedido pai.
- Perfis: cada usuário vê apenas o próprio perfil (admin vê todos).

## Estrutura do banco

`profiles` (id, nome, email, cargo) · `produtos` (id, nome, categoria, preco, estoque) · `clientes` (id, nome, telefone, endereco) · `pedidos` (id, cliente_id, data, status, total) · `pedido_itens` (id, pedido_id, produto_id, qtd, preco_unit) — criados em `supabase/migrations/00001_init.sql`.

## Identidade visual

- **Logo**: ícone SprayCan (lucide-react) em caixa `bg-primary/10` — presente na sidebar (área logada), login e landing.
- **Cores**: primary `#0f766e` (teal), fundo claro, badges de status com alto contraste.
- Tokens e componentes definidos em `docs/DESIGN_SYSTEM.md` (v1.4.1); protótipo em `docs/layout/dashboard.pen`.

## Cobertura do briefing (`docs/briefing.md`)

| Requisito | Status |
| --- | --- |
| Login com 2 usuários (admin + vendedor) | ✅ Supabase Auth + seed |
| Dashboard <2s com 6 meses de dados | ✅/⚠️ FCP 0.9s nas públicas (Lighthouse); rotas internas com sessão não medidas |
| CRUD completo (produtos, clientes, pedidos) | ✅ |
| Filtros por data, cliente, status em `/pedidos` | ✅ |
| Faturamento dia/mês, top produtos, top 10 clientes | ✅ |
| Estoque baixo | ⚠️ estoque exibido no CRUD de produtos; sem alerta dedicado |
| Exportação PDF | ✅ `/relatorios` (admin) |
| Recharts, Supabase + RLS, layout responsivo | ✅ |

## Documentação

- `docs/briefing.md` — briefing original do cliente
- `docs/PRD.md` — Product Requirements Document
- `docs/TASKS.md` — desmembramento em tarefas
- `docs/DESIGN_SYSTEM.md` — design system (identidade, cores, componentes)
- `docs/failures/` — relatórios de auditoria (acessibilidade, fases)
