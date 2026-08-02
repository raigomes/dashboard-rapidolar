# Quickstart — Validação do Admin Dashboard RapidoLar

**Date**: 2026-08-01
**Goal**: Validar ponta a ponta o MVP (FR-001 a FR-026) com cenários executáveis. Guia de
validação — execução detalhada em `docs/TASKS.md` (fonte única da squad).

## Pré-requisitos

- Node.js + npm (usar `npm`; há dois lockfiles no repo — não usar pnpm).
- Projeto Supabase (nuvem ou local) com as credenciais.
- Variáveis de ambiente: `SUPABASE_URL`, `SUPABASE_ANON_KEY` (`.env` nunca versionado).

## Setup

```bash
npm install
npx shadcn@latest init            # Tailwind v4 + React 19 auto-detect
npx shadcn@latest add button table dialog form input select label toast skeleton badge card dropdown-menu chart
```

## Banco de dados

1. Aplicar migração: `supabase/migrations/00001_init.sql` (schema + RLS + policies +
   triggers — ver [data-model.md](./data-model.md) e [contracts/rls-policies.md](./contracts/rls-policies.md)).
2. Verificar RLS: `select tablename, rowsecurity from pg_tables where schemaname='public';`
   → todas `true`.
3. Verificar policies (garantia do contrato): nenhuma policy `DELETE` para vendedor em
   `produtos`, `clientes`, `pedidos`, `pedido_itens`.

## Seed

```bash
npm run seed   # scripts/seed.ts
```

Cria admin@rapidolar.com e vendedor@rapidolar.com, 50 produtos (alguns com estoque ≤ 10),
30 clientes e ~6 meses de pedidos (3–5/dia) distribuídos entre os dois usuários.

## Execução

```bash
npm run dev   # http://localhost:3000
```

## Cenários de validação

### 1. Autenticação e sessão (FR-001 a FR-006, FR-025)
| Cenário | Ação | Esperado |
|---------|------|----------|
| Acesso sem sessão | Abrir `/dashboard` deslogado | Redireciona a `/login` |
| Login admin | admin@rapidolar.com + senha | Vai a `/dashboard`; relatórios visíveis |
| Login vendedor | vendedor@rapidolar.com + senha | Vai a `/dashboard`; relatórios ocultos/negados |
| Logout | Clicar Sair | Volta a `/login`; rotas protegidas bloqueadas |
| Senha esquecida | Link "Esqueceu a senha?" | Link/código chega por e-mail e redefine a senha |

### 2. Dashboard (FR-007 a FR-009, SC-001/SC-002)
| Cenário | Ação | Esperado |
|---------|------|----------|
| Métricas | Abrir `/dashboard` | Cards de faturamento dia/mês, pedidos hoje, ticket médio coerentes; <2s com 6 meses |
| Gráfico | Alternar 7/30 dias/12 meses | Gráfico atualiza o período |
| Top 10 | Ler tabelas | Produtos e clientes ordenados por receita |
| Escopo vendedor | Login vendedor → dashboard | Métricas refletem apenas pedidos dele |
| Sem dados | Período sem vendas | Estado vazio claro (não erro) |

### 3. Pedidos (FR-010 a FR-013, FR-022 a FR-024, FR-026)
| Cenário | Ação | Esperado |
|---------|------|----------|
| Criar pedido | Novo pedido com itens | Total automático; `estoque` do produto diminuiu; visível na lista |
| Estoque insuficiente | Pedir qtd > estoque | Bloqueado com alerta |
| Cancelar | Mudar status para cancelado | `estoque` restaurado |
| Transição inválida | pendente → entregue direto | Bloqueado (fluxo linear, Q3) |
| Imutável | Editar pedido entregue/cancelado | Rejeitado |
| Delete por vendedor | Vendedor tenta excluir pedido | Acesso negado (server + RLS) |
| Filtros | Filtrar por data/cliente/status | Lista correta; paginação de 25 mantida |

### 4. Produtos e clientes (FR-014 a FR-016, FR-021, FR-026)
| Cenário | Ação | Esperado |
|---------|------|----------|
| CRUD admin | Criar/editar/excluir produto e cliente | OK com confirmação antes de excluir |
| Em uso | Excluir produto/cliente referenciado | Bloqueado com mensagem |
| Vendedor | Acessar produtos/clientes | Só leitura; sem ações de escrita |
| Estoque baixo | Listagem | Produtos com `estoque <= 10` sinalizados |
| Paginação | Lista com >25 itens | Páginas de 25 |

### 5. Relatórios (FR-017, FR-018)
| Cenário | Ação | Esperado |
|---------|------|----------|
| Exportar admin | Selecionar período → Exportar | Print view `/relatorio/imprimir` com período, faturamento, total de pedidos, top 10 produtos e top 10 clientes; `window.print()` gera PDF com texto pesquisável |
| Acesso negado | Vendedor abre relatórios | Mensagem de acesso negado |

## Critérios de aceite (da spec)

- SC-001: login em até 5s · SC-002: dashboard <2s com 6 meses · SC-003: pedido registrado
  em <1 min · SC-004: 100% de tentativas de delete por vendedor bloqueadas · SC-005: 100%
  de acessos fora do escopo negados · SC-006: 95% dos filtros corretos na 1ª tentativa ·
  SC-007: apuração mensal em ≤5 min via relatório.
