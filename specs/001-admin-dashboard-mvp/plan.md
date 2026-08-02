# Implementation Plan: Admin Dashboard MVP RapidoLar

**Branch**: `001-admin-dashboard-mvp` | **Date**: 2026-08-01 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-admin-dashboard-mvp/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command; its definition describes the execution workflow.

## Summary

Dashboard administrativo web (MVP) para a Distribuidora RapidoLar, substituindo as planilhas
Excel: login por e-mail/senha com controle de acesso por cargo, visão em tempo real de
faturamento/pedidos/ticket médio, gráfico de vendas, top 10 produtos e top 10 clientes,
CRUD de produtos/clientes/pedidos (com itens, total automático e baixa de estoque) e
exportação de relatório em PDF. Segurança-first: RLS obrigatório em todas as tabelas,
vendedores sem exclusão e com visão restrita às próprias operações. Abordagem técnica em
`research.md`, modelo de dados em `data-model.md`, contratos em `contracts/`.

## Technical Context

**Language/Version**: TypeScript 5.x (strict)

**Primary Dependencies**: Next.js 16 (App Router), React 19, Tailwind CSS v4,
shadcn/ui (Radix primitives), Recharts v3 (chart), @supabase/supabase-js + @supabase/ssr

**Storage**: Supabase (PostgreSQL + Auth + Row Level Security)

**Testing**: Validação via `npx tsc --noEmit`, `npm run lint`, `npm run build`; cenários
manuais descritos em `quickstart.md` (sem framework de testes automatizados no MVP)

**Target Platform**: Web — desktop (escritório) e tablet (campo); responsivo

**Project Type**: Web application (Next.js App Router fullstack)

**Performance Goals**: Dashboard com dados de 6 meses (~500–900 pedidos) carregando em <2s;
listagens paginadas em 25 itens

**Constraints**: RLS ativo em todas as tabelas; validação de permissão no servidor (Server
Actions) além do RLS; vendedores sem DELETE; pedidos entregue/cancelado imutáveis; baixa de
estoque na criação e reversão no cancelamento

**Scale/Scope**: 12 usuários, 300+ produtos, ~900 pedidos/6 meses, 5 telas principais + login

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Gate | Status |
|-----------|------|--------|
| I. Stack Mandatória | Next.js App Router + Tailwind + shadcn/ui + Supabase + TS strict | PASS |
| II. Security-First | Auth via Supabase Auth; permissões revalidadas no servidor; secrets em env | PASS |
| III. RLS Obrigatório | RLS habilitado em todas as tabelas com policies explícitas | PASS |
| IV. Menor Privilégio | Vendedores sem DELETE; vendedores veem apenas os próprios pedidos | PASS |
| V. Verificação | `npx tsc --noEmit` + `npm run lint` limpos; layout vs `DESIGN_SYSTEM.md` | PASS |

**Pós-Phase 1**: Sem violações. Nenhuma justificativa de complexidade necessária.

## Project Structure

### Documentation (this feature)

```text
specs/001-admin-dashboard-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── rls-policies.md  # Contrato de segurança RLS (por tabela)
│   ├── auth-session.md  # Contrato de autenticação/sessão
│   └── server-mutations.md  # Contrato de mutações via Server Actions
# (tasks geradas pela squad em docs/TASKS.md — fonte única de execução)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/login/         # Login + recuperação de senha
│   ├── dashboard/            # Métricas, gráfico, top 10
│   ├── produtos/             # Lista (paginação) + formulário
│   ├── clientes/             # Lista (paginação) + formulário
│   ├── pedidos/              # Lista com filtros + formulário
│   ├── relatorios/           # Seleção de período
│   ├── relatorio/imprimir/   # Print view (window.print)
│   ├── layout.tsx
│   ├── globals.css           # Tailwind v4 (CSS-first) + print CSS
│   └── middleware.ts         # Proteção de rotas + refresh de sessão
├── components/
│   ├── ui/                   # shadcn/ui (button, table, dialog, ...)
│   ├── charts/               # Gráficos Recharts v3 (use client)
│   ├── dashboard/
│   ├── pedidos/
│   └── relatorios/
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # createBrowserClient
│   │   ├── server.ts         # createServerClient (cookies)
│   │   └── middleware.ts     # createServerClient p/ middleware
│   ├── actions/              # Server Actions (mutations)
│   ├── permissions.ts        # Cargo/is_admin checks no servidor
│   └── utils.ts              # cn() e helpers
├── types/
│   └── index.ts              # Tipos do domínio (Produto, Cliente, Pedido...)
└── utils/
scripts/
└── seed.ts                   # Seed 6 meses + 2 usuários
supabase/
└── migrations/
    └── 00001_init.sql        # Schema + RLS + policies + triggers
```

**Structure Decision**: Estrutura única Next.js App Router (fullstack), com Supabase como
banco/auth. Mutações via Server Actions (`src/lib/actions/`), sessão via `@supabase/ssr`
com dois clientes (browser/server) e middleware de proteção. Migrations SQL versionadas em
`supabase/migrations/` para garantir RLS desde a primeira tabela.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

Sem violações constitucionais identificadas — tabela intencionalmente vazia.
