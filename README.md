# Next.js Harness Template

Template Next.js 15+ com harness de agentes AI para squads.

## Fluxo

1. **Preencha** `docs/briefing.md` com o briefing do projeto
2. **Owner** gera `docs/PRD.md` e `docs/TASKS.md`
3. **Designer** gera `docs/DESIGN_SYSTEM.md` via Pencil.dev
4. **Coder** implementa tarefas em `src/`
5. **Reviewer** valida tipografia e layout

## Estrutura

```
.opencode/agents/    # Definições dos agentes (Owner, Designer, Coder, Reviewer)
.opencode/plugins/   # Plugin Pencil.dev
docs/                # Briefing, PRD, Design System, Tasks, Failures
src/                 # Código Next.js
AGENTS.md            # Regras globais do repositório
open-code.config.json
```

## Início rápido

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).
