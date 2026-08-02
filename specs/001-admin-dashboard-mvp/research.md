# Research — Admin Dashboard MVP RapidoLar

**Date**: 2026-08-01
**Status**: Resolved (todos os `NEEDS CLARIFICATION` do Technical Context decididos)

## PDF — Geração de relatório

- **Decision**: Visão de impressão dedicada (`/relatorio/imprimir`) + `window.print()` /
  "Salvar como PDF", estilizada com Tailwind v4 via `@media print` (cabeçalho de tabela
  repetido com `thead { display: table-header-group }`, `break-inside: avoid` em linhas).
- **Rationale**: Zero dependência nova, texto nativo pesquisável, acentuação pt-BR segura,
  reutiliza o CSS existente (Tailwind/shadcn), e o conteúdo (totais + duas tabelas top 10)
  é exatamente o caso de "imprimir sem download". Evita ~250–400 KB de bundle client-side.
- **Alternatives considered**: `@react-pdf/renderer` (bug de reconciler aberto com React
  19.2+, JSX-only, ~400 KB); `jsPDF + html2canvas` (saída rasterizada, não pesquisável,
  posicionamento manual). Se um artefato `.pdf` real for necessário depois, gerar no
  servidor via Route Handler com `renderToBuffer` — fora do escopo do MVP.

## Autenticação Supabase + Next.js App Router

- **Decision**: Pacote `@supabase/ssr` com **dois clientes** — `createBrowserClient`
  (componentes client) e `createServerClient` (Server Components / Route Handlers /
  Server Actions), usando `await cookies()` com `getAll()`/`setAll()` (setAll em try/catch,
  refresh tratado no middleware). Middleware chama `getUser()` em toda requisição para
  validar o JWT (não `getSession()`) e redireciona a `/login` se não autenticado. Guarda
  dupla também em layout/página de rotas protegidas.
- **Rationale**: Padrão oficial e estável; sessão httpOnly; `getUser()` valida o token de
  verdade para autorização, evitando a falha conhecida do `getSession()`.
- **Alternatives considered**: Sessão exclusivamente no client (inseguro para autorização),
  cookies sem httpOnly (vetado pela Constituição).

## Recuperação de senha

- **Decision**: Fluxo nativo do Supabase Auth (link/código por e-mail) a partir da tela de
  login, redirecionando para redefinição de senha. Confirmado na Clarificação Q4.
- **Rationale**: Sem infraestrutura própria de e-mail; mantém o vendedor em campo autônomo.

## shadcn/ui + Tailwind v4

- **Decision**: `npx shadcn@latest init` (auto-detecta Tailwind v4 e React 19; sem
  `tailwind.config.js` — config CSS-first em `globals.css` via `@theme inline`). Adicionar
  componentes: `button`, `table`, `dialog`, `form`/`input`, `select`, `label`, `toast`,
  `skeleton`, `badge`, `card`, `dropdown-menu`, `pagination` (ou equivalente), `chart`.
- **Rationale**: Compatível com a stack mandatória; componente `chart` da shadcn já é
  construído sobre Recharts v3.
- **Alternatives considered**: Config Tailwind v4 via `tailwind.config.js` (não suportado);
  chart lib alternativa (Tremor) — descartada em favor do Recharts v3 que a shadcn adota.

## Gráficos (Recharts)

- **Decision**: Recharts **v3** (suporte nativo React 19; corrige o problema do React 19
  da v2). Componentes de gráfico marcados com `"use client"`. Seletor de período
  (7 dias / 30 dias / 12 meses) controla o agrupamento da query.
- **Rationale**: Suporte nativo, integração oficial com o componente `chart` da shadcn.
- **Alternatives considered**: Recharts 2.x + `react-is` override (descartado).

## RLS — política multi-cargo

- **Decision**: RLS habilitado em **todas** as tabelas; uma policy por operação; **omissão
  de policy DELETE** para vendedores (= impossível deletar); helper `is_admin()`
  `SECURITY DEFINER` consultando `profiles` para dar acesso total ao admin; colunas de
  política indexadas; `auth.uid()` envolvido em `(select ...)` para caching do planner;
  `service_role` nunca no client.
- **Rationale**: Menor privilégio real (vendedor não consegue deletar nem enxergar fora do
  escopo), consistente com o princípio IV da Constituição.
- **Alternatives considered**: Policies únicas mesclando condições (menos legível e com
  risco de falha de segurança); controle de acesso só no frontend (vetado).

## Seed de dados

- **Decision**: Script Node/TS autônomo (`scripts/seed.ts`): cria 2 usuários
  (admin@rapidolar.com / vendedor@rapidolar.com) via Admin API do Supabase, insere
  `profiles`, gera 50 produtos (limpeza, descartáveis, higiene), 30 clientes, e 6 meses de
  pedidos (3–5/dia) com itens, distribuídos entre admin e vendedor para validar RLS.
  Estoque inicial coerente; alguns produtos ≤ 10 para validar a sinalização de estoque baixo.
- **Rationale**: Dados reais simulados permitem validar métricas, gráficos e filtros.
