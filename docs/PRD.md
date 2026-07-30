# PRD — Dashboard de Vendas RapidoLar

> **Gerado pelo Owner.** Não edite manualmente.
> **Versão:** 1.0
> **Data:** 2026-07-30

---

## 1. Product Overview

### 1.1 Visão do Produto

Dashboard administrativo web para a **Distribuidora RapidoLar** (distribuição de produtos de limpeza e descartáveis) que substitui o gerenciamento baseado em planilhas Excel por um sistema centralizado com visibilidade em tempo real de vendas, estoque e clientes.

### 1.2 Problema

A RapidoLar gerencia pedidos, estoque e financeiro em planilhas Excel compartilhadas via e-mail. As planilhas travam, versões se perdem e o dono não sabe o lucro real do mês até fechar tudo manualmente. Decisões são tomadas "no chute" por falta de visibilidade em tempo real.

### 1.3 Objetivos de Negócio

- Eliminar planilhas manuais para gestão de vendas e estoque
- Prover visibilidade em tempo real de faturamento, produtos mais vendidos e clientes top 10
- Reduzir o tempo de fechamento mensal de dias para minutos
- Permitir acesso mobile via tablet para uso em campo

### 1.4 Usuários-alvo

| Perfil                   | Descrição                                                    | Permissões                                                             |
| ------------------------ | ------------------------------------------------------------ | ---------------------------------------------------------------------- |
| **Admin** (dono/gerente) | Acesso total ao sistema, gestão de cadastros, relatórios     | CRUD completo em todas as entidades + relatórios                       |
| **Vendedor**             | Consulta dashboard, registra pedidos, vê clientes e produtos | Leitura em dashboard + CRUD em pedidos; leitura em produtos e clientes |

### 1.5 Critérios de Sucesso

1. Login funcional com 2 usuários (admin + vendedor)
2. Dashboard carregar em <2s com 6 meses de dados históricos
3. CRUD completo de produtos, clientes e pedidos
4. Filtros (data, cliente, status) funcionando na tabela de pedidos
5. Exportação de relatório em PDF funcional

---

## 2. Functional Requirements

### 2.1 Autenticação (`/login`)

| ID   | Requisito                                             | Prioridade |
| ---- | ----------------------------------------------------- | ---------- |
| F-01 | Tela de login com e-mail + senha via Supabase Auth    | P0         |
| F-02 | Redirecionamento pós-login para `/dashboard`          | P0         |
| F-03 | Redirecionamento para `/login` se não autenticado     | P0         |
| F-04 | Logout com limpeza de sessão                          | P0         |
| F-05 | Controle de acesso por cargo (admin/vendedor) via RLS | P0         |
| F-06 | Sessão persistente via cookie/httpOnly (Supabase)     | P0         |

### 2.2 Dashboard (`/dashboard`)

| ID   | Requisito                                                                                           | Prioridade |
| ---- | --------------------------------------------------------------------------------------------------- | ---------- |
| F-07 | Cards de métricas: faturamento (dia/mês), total de pedidos (dia/mês), clientes ativos, ticket médio | P0         |
| F-08 | Gráfico de vendas (linha) com seletor: 7 dias, 30 dias, 12 meses                                    | P0         |
| F-09 | Tabela "Top 10 Produtos" (nome, qtd vendida, receita)                                               | P0         |
| F-10 | Tabela "Top 10 Clientes" (nome, total compras, nº pedidos)                                          | P0         |
| F-11 | Loading skeleton enquanto dados carregam                                                            | P1         |
| F-12 | Estado vazio para quando não há dados                                                               | P1         |

### 2.3 Produtos (`/produtos`)

| ID   | Requisito                                                     | Prioridade |
| ---- | ------------------------------------------------------------- | ---------- |
| F-13 | Lista de produtos em tabela (nome, categoria, preço, estoque) | P0         |
| F-14 | CRUD completo: criar, editar, excluir produto                 | P0         |
| F-15 | Modal/formulário para criar/editar produto                    | P0         |
| F-16 | Confirmação antes de excluir                                  | P1         |
| F-17 | Feedback visual (toast) em cada operação                      | P1         |
| F-18 | Campo de busca por nome                                       | P2         |

### 2.4 Clientes (`/clientes`)

| ID   | Requisito                                              | Prioridade |
| ---- | ------------------------------------------------------ | ---------- |
| F-19 | Lista de clientes em tabela (nome, telefone, endereço) | P0         |
| F-20 | CRUD completo: criar, editar, excluir cliente          | P0         |
| F-21 | Modal/formulário para criar/editar cliente             | P0         |
| F-22 | Confirmação antes de excluir                           | P1         |
| F-23 | Feedback visual (toast) em cada operação               | P1         |

### 2.5 Pedidos (`/pedidos`)

| ID   | Requisito                                                          | Prioridade |
| ---- | ------------------------------------------------------------------ | ---------- |
| F-24 | Lista de pedidos em tabela (ID, cliente, data, status, total)      | P0         |
| F-25 | Filtros: por data (range), por cliente (select/search), por status | P0         |
| F-26 | CRUD: criar pedido com itens (produto + qtd), editar, excluir      | P0         |
| F-27 | Cálculo automático do total do pedido com base nos itens           | P0         |
| F-28 | Status do pedido: pendente, confirmado, entregue, cancelado        | P0         |
| F-29 | Modal/formulário para criar/editar pedido                          | P0         |
| F-30 | Confirmação antes de excluir                                       | P1         |

### 2.6 Relatórios (`/relatorios`)

| ID   | Requisito                                                                                           | Prioridade |
| ---- | --------------------------------------------------------------------------------------------------- | ---------- |
| F-31 | Página com seleção de período (data início / data fim)                                              | P0         |
| F-32 | Botão "Exportar PDF" com resumo de vendas do período                                                | P0         |
| F-33 | PDF contém: período selecionado, faturamento total, total pedidos, top 10 produtos, top 10 clientes | P1         |
| F-34 | Apenas admin pode acessar (vendedor vê mensagem de acesso negado)                                   | P0         |

---

## 3. Technical Architecture

### 3.1 Stack

| Camada       | Tecnologia                                 | Versão |
| ------------ | ------------------------------------------ | ------ |
| Framework    | Next.js (App Router)                       | 16+    |
| UI / React   | React                                      | 19     |
| Estilização  | Tailwind CSS                               | v4     |
| Componentes  | shadcn/ui (Radix primitives)               | latest |
| Gráficos     | Recharts                                   | latest |
| Banco + Auth | Supabase (PostgreSQL + Auth + RLS)         | latest |
| Tipagem      | TypeScript strict                          | 5.x    |
| PDF          | @react-pdf/renderer ou jsPDF + html2canvas | TBD    |

### 3.2 Path Alias

```
@/* → ./src/*
```

### 3.3 Supabase Schema

#### `profiles`

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cargo TEXT NOT NULL CHECK (cargo IN ('admin', 'vendedor')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### `produtos`

```sql
CREATE TABLE produtos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  categoria TEXT NOT NULL,
  preco DECIMAL(10,2) NOT NULL CHECK (preco > 0),
  estoque INTEGER NOT NULL DEFAULT 0 CHECK (estoque >= 0),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `clientes`

```sql
CREATE TABLE clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  telefone TEXT,
  endereco TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `pedidos`

```sql
CREATE TABLE pedidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES clientes(id) ON DELETE RESTRICT,
  data DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente','confirmado','entregue','cancelado')),
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

#### `pedido_itens`

```sql
CREATE TABLE pedido_itens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID NOT NULL REFERENCES pedidos(id) ON DELETE CASCADE,
  produto_id UUID NOT NULL REFERENCES produtos(id) ON DELETE RESTRICT,
  qtd INTEGER NOT NULL CHECK (qtd > 0),
  preco_unit DECIMAL(10,2) NOT NULL CHECK (preco_unit > 0),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 3.4 Row Level Security (RLS)

| Tabela         | Policy                                                            | Efeito |
| -------------- | ----------------------------------------------------------------- | ------ |
| `profiles`     | Admin vê todos; vendedor vê próprio                               | SELECT |
| `profiles`     | Apenas admin pode editar cargos                                   | UPDATE |
| `produtos`     | Ambos podem SELECT; apenas admin INSERT/UPDATE/DELETE             | ALL    |
| `clientes`     | Ambos podem SELECT; apenas admin INSERT/UPDATE/DELETE             | ALL    |
| `pedidos`      | Admin vê todos; vendedor vê apenas seus pedidos                   | SELECT |
| `pedidos`      | Admin pode INSERT/UPDATE/DELETE qualquer; vendedor apenas os seus | ALL    |
| `pedido_itens` | Mesmo policy do pedido pai (herdado via FK)                       | ALL    |

### 3.5 Data Flow

```
Browser → Next.js (Server Components + Client Components)
              ↓
         Server Actions / Route Handlers
              ↓
     Supabase (@supabase/supabase-js)
              ↓
         PostgreSQL + RLS
```

- **Server Components** para fetching inicial de dados (SSR)
- **Client Components** para interatividade (formulários, gráficos, filtros)
- **Server Actions** para mutações (create/update/delete)
- **Middleware** Next.js para proteção de rotas (check de session)

### 3.6 Seed Script

Script Node.js autônomo (`scripts/seed.ts`) que:

1. Cria 2 usuários no Supabase Auth (admin@rapidolar.com / vendedor@rapidolar.com)
2. Insere seus perfis na tabela `profiles`
3. Gera 50 produtos variados (categorias: limpeza, descartáveis, higiene)
4. Gera 30 clientes fictícios
5. Gera 6 meses de pedidos históricos (médias: 3-5 pedidos/dia) com itens
6. Distribui pedidos entre admin e vendedor para testar RLS

---

## 4. Routes & Navigation

### 4.1 Route Map

```
/login                  → LoginPage (pública, não autenticados)
/dashboard              → DashboardPage (protegida)
/produtos               → ProdutosListPage (protegida)
/produtos/novo          → ProdutoFormPage (protegida, admin)
/produtos/[id]/editar   → ProdutoFormPage (protegida, admin)
/clientes               → ClientesListPage (protegida)
/clientes/novo          → ClienteFormPage (protegida, admin)
/clientes/[id]/editar   → ClienteFormPage (protegida, admin)
/pedidos                → PedidosListPage (protegida)
/pedidos/novo           → PedidoFormPage (protegida)
/pedidos/[id]/editar    → PedidoFormPage (protegida)
/relatorios             → RelatoriosPage (protegida, admin)
```

### 4.2 Navigation Structure (Sidebar)

```
[Logo RapidoLar]
Dashboard
Produtos
Clientes
Pedidos
Relatórios    ← (visível apenas para admin)
─────────────
[Sair]        ← logout
```

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Dashboard deve carregar em <2s com 6 meses de dados (~500-900 pedidos)
- Queries no Supabase devem usar índices apropriados (cliente_id, data, status)
- Imagens e assets estáticos minimizados
- Lazy loading para componentes pesados (gráficos)

### 5.2 Security

- Autenticação via Supabase Auth (magic link ou email+senha)
- RLS obrigatório em todas as tabelas
- Server Actions validam permissões no servidor (não confiar apenas no RLS do frontend)
- Variáveis de ambiente para SUPABASE_URL e SUPABASE_ANON_KEY
- .env nunca versionado
- Rate limiting em login (Supabase gerencia)

### 5.3 Responsiveness

- **Desktop (1440px+)**: Layout completo com sidebar expandida
- **Tablet (768-1024px)**: Sidebar colapsável, grids adaptáveis (2 colunas)
- **Mobile (<768px)**: Sidebar em overlay, cards empilhados, tabelas com scroll horizontal

### 5.4 Accessibility

- Navegação por teclado em formulários CRUD
- Labels semânticas em todos os inputs
- Contraste mínimo WCAG AA
- Estados de foco visíveis

### 5.5 Error Handling

- Toast notifications para sucesso/erro em operações CRUD
- Páginas de erro 404 e 500 customizadas
- Fallback UI quando Supabase estiver offline
- Timeout de 10s em queries com retry 1x

---

## 6. Future Considerations

| Item                   | Descrição                                                |
| ---------------------- | -------------------------------------------------------- |
| Multi-tenancy          | Separar dados por empresa usando `tenant_id` nas tabelas |
| Notificações           | Alertas de estoque baixo, pedidos atrasados              |
| Integração NF-e        | API para emissão de nota fiscal                          |
| App Mobile             | React Native ou PWA para vendedores em campo             |
| Painel Financeiro      | Contas a pagar/receber, fluxo de caixa                   |
| Importação CSV         | Importar produtos/clientes em massa                      |
| Histórico de Preços    | Tracking de alterações de preço ao longo do tempo        |
| Métricas em Tempo Real | WebSockets via Supabase Realtime para dashboard ao vivo  |

---

## 7. Squad Process

### 7.1 Workflow Sequencial

| Fase | Agente   | Entrada                                                                 | Saída                                                |
| ---- | -------- | ----------------------------------------------------------------------- | ---------------------------------------------------- |
| 1    | Owner    | `docs/briefing.md`                                                      | `docs/PRD.md`, `docs/TASKS.md`                       |
| 2    | Designer | `docs/PRD.md`                                                           | `docs/DESIGN_SYSTEM.md`, `docs/layout/dashboard.pen` |
| 3    | Coder    | `docs/TASKS.md` + `docs/DESIGN_SYSTEM.md` + `docs/layout/dashboard.pen` | Código em `src/`                                     |
| 4    | Reviewer | Código implementado                                                     | Validação + `docs/failures/`                         |

### 7.2 Responsabilidades

| Agente       | Responsabilidades                                                                                                                                                                    |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Owner**    | Guardião do backlog. Atualiza `TASKS.md` conforme progresso, inclusive as falhas apontadas pelo Reviewer. Prioriza, reprioriza, e fecha tasks. Orquestra squads, não toca no código. |
| **Designer** | Consome `PRD.md`, gera protótipo no Pencil.dev (`dashboard.pen`), exporta `DESIGN_SYSTEM.md`. Não toca código.                                                                       |
| **Coder**    | Executa task por task seguindo `DESIGN_SYSTEM.md`. Código enxuto, tipado, sem explicações.                                                                                           |
| **Reviewer** | Valida cada task: `npx tsc --noEmit` + conferência visual vs Pencil.dev. Grava falhas recorrentes em `docs/failures/`.                                                               |

### 7.3 Definição de Done (por task)

Uma task só é considerada "done" quando:

1. Código implementado e funcionando
2. `npx tsc --noEmit` passa sem erros
3. `npm run lint` passa sem erros
4. Layout confere com `docs/DESIGN_SYSTEM.md` e `docs/layout/dashboard.pen`
5. Owner marca como concluída em `TASKS.md`
