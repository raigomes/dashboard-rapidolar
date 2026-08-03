# Repository Agent Harness & Squad Rules

## Commands

```bash
npm install          # install deps (uses package-lock.json)
npm run dev          # dev server → http://localhost:3000
npm run lint         # eslint (next/core-web-vitals + typescript rules)
npm run build        # production build
npx tsc --noEmit     # typecheck (used by Reviewer)
```

## Workflow Sequencial da Squad

1. **OWNER (@owner / Skill: Superpowers)**: Lê o briefing bruto em `docs/briefing.md`, cria o `docs/PRD.md` e desmembra em sub-tarefas atômicas em `docs/TASKS.md`.
2. **DESIGNER (@designer / Skill: Impeccable + Pencil.dev)**: Consome o `PRD.md`, gera o protótipo/layout no Pencil.dev e exporta a especificação visual para `docs/DESIGN_SYSTEM.md`.
3. **CODER (@coder / Skill: Caveman)**: Executa tarefa por tarefa descrita em `docs/TASKS.md`. Código Next.js enxuto, tipado (TypeScript strict), sem conversa fiada ou explicações desnecessárias.
4. **REVIEWER (@reviewer / Skill: Superpowers + Impeccable)**: Executa `npx tsc --noEmit` e valida se o layout bate com o Pencil.dev. Se houver falhas repetidas, grava em `docs/failures/`.

## Code Guidelines

- **Framework**: Next.js 16+ (App Router), React 19, Tailwind CSS v4, TypeScript strict
- **Path alias**: `@/*` maps to `./src/*`
- **Tailwind v4**: Configurado via `@tailwindcss/postcss` em `postcss.config.mjs`. Não existe `tailwind.config.js` — usar CSS-first config no `globals.css`
- Não altere assinaturas de componentes UI existentes sem autorização do Reviewer
- Agents devem seguir o `docs/DESIGN_SYSTEM.md` para layout e estilo

## Estrutura

```
src/app/             # App Router pages (layout.tsx, page.tsx, globals.css)
docs/                # briefing.md, PRD.md, TASKS.md, DESIGN_SYSTEM.md, failures/
.opencode/agents/    # Definições: owner.md, designer.md, coder.md, reviewer.md
.opencode/plugins/   # Plugin Pencil.dev
```

## Gotchas

- Gerenciador de pacotes: **npm** — único lockfile (`package-lock.json`); `package.json` declara `packageManager: "npm@11.16.0"`. Não usar pnpm
- `TASKS.md` e `DESIGN_SYSTEM.md` começam vazios — precisam ser preenchidos pelo Owner/Designer antes do Coder agir
- **Spec Kit**: os comandos `/speckit.*` geram artefatos de planejamento em `specs/` (spec, plan, contracts, quickstart). Esses artefatos são **insumo, não execução**. NÃO use o `tasks.md` gerado pelo Spec Kit — a lista de tarefas é `docs/TASKS.md`, fonte única mantida pelo Owner
