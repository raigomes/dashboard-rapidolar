<!--
SYNC IMPACT REPORT
- Version change: (n/a — initial ratification from template) → 1.0.0
- Modified principles: none (template placeholders filled for first time)
- Added sections: Core Principles (I–V), Segurança de Dados, Workflow de Desenvolvimento, Governance
- Removed sections: none
- Deferred TODOs: none
-->

# Dashboard RapidoLar Constitution

## Core Principles

### I. Stack Mandatória
Todo código do projeto MUST usar: Next.js (App Router estruturado conforme o template
clonado), Tailwind CSS, componentes shadcn/ui e Supabase (PostgreSQL + Auth). Nenhuma
tecnologia fora dessa stack MUST ser introduzida sem emenda constitucional. TypeScript
strict é obrigatório em todo arquivo `.ts`/`.tsx`. Rationale: manter um único ecossistema
consistente, testável e de baixo atrito para a squad.

### II. Security-First (NON-NEGOTIABLE)
Segurança é pré-requisito, não feature. Toda decisão de design, query e mutação MUST
presumir o pior caso. Autenticação via Supabase Auth é obrigatória; nenhuma rota protegida
pode operar sem sessão validada no servidor. Rationale: o produto manipula dados comerciais
de clientes reais e o acesso deve ser auditável em todos os níveis.

### III. RLS Obrigatório em Todas as Tabelas
Toda tabela do Supabase MUST ter Row Level Security habilitado e policies explícitas,
seguindo a matriz definida no PRD (`docs/PRD.md` §3.4). Nenhuma tabela pode ser criada sem
RLS ativo. O frontend NUNCA deve ser a única camada de autorização — o servidor (Server
Actions / Route Handlers) MUST revalidar permissões. Rationale: RLS é a última linha de
defesa; confiar apenas na UI é aceitar vazamento.

### IV. Princípio do Menor Privilégio por Cargo
Vendedores NUNCA podem deletar dados — delete MUST ser exclusivo do admin em todas as
entidades. Vendedores enxergam apenas as próprias operações (pedidos); dados fora do escopo
MUST ser invisíveis via policy RLS. Admin possui CRUD completo. Rationale: garantir que o
erro humano ou credencial comprometida de um vendedor nunca alcance dados fora do seu
escopo.

### V. Verificação de Qualidade (DoD)
Nenhuma task está "done" sem: `npx tsc --noEmit` e `npm run lint` sem erros; layout
conferido com `docs/DESIGN_SYSTEM.md` e `docs/layout/dashboard.pen`; e conformidade com as
policies RLS desta Constituição. Rationale: gate objetivo e mensurável, prevenindo
regressões silenciosas de tipagem, segurança e visual.

## Segurança de Dados

- `SUPABASE_URL` e `SUPABASE_ANON_KEY` via variáveis de ambiente; `.env` NUNCA versionado.
- Credenciais e secrets jamais em código, logs ou comentários.
- Server Actions MUST validar cargo (admin/vendedor) e propriedade no servidor, não apenas
  no RLS do cliente.
- Relatórios (`/relatorios`) são exclusivos de admin; vendedor recebe acesso negado.
- Sessão persistente via cookie httpOnly (Supabase); middleware protege rotas não
  autenticadas.
- Erros de autorização não devem expor detalhes internos do banco.

## Workflow de Desenvolvimento

- Squad sequencial: Owner (PRD + TASKS) → Designer (DESIGN_SYSTEM.md + Pencil.dev) →
  Coder (`src/`) → Reviewer (tsc + conferência visual).
- Implementação segue estritamente `docs/TASKS.md` e `docs/DESIGN_SYSTEM.md`.
- Falhas recorrentes identificadas pelo Reviewer MUST ser registradas em `docs/failures/`.
- Mudanças de assinatura de componentes UI existentes exigem autorização do Reviewer.
- Definição de Done conforme Princípio V.

## Governance

Esta Constituição prevalece sobre práticas ad hoc e toda documentação conflitante. Emendas
MUST ser documentadas neste arquivo, aprovadas pela squad, e refletidas em bump de versão
semântico (MAJOR para remoção/redefinição de princípios; MINOR para novos princípios ou
seções; PATCH para esclarecimentos). Toda PR e revisão MUST verificar conformidade com os
Princípios I–V. Revisão de conformidade ocorre a cada fase da squad e a cada nova task.
Runtime de desenvolvimento segue `docs/PRD.md` e `docs/DESIGN_SYSTEM.md`.

**Version**: 1.0.0 | **Ratified**: 2026-08-01 | **Last Amended**: 2026-08-01
