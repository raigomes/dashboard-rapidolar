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
specs/               # (opcional) Artefatos do Spec Kit — planejamento formal
src/                 # Código Next.js
AGENTS.md            # Regras globais do repositório
open-code.config.json
```

## Spec Kit (opcional)

O fluxo da squad (AGENTS.md) é a **fonte única de execução**. O Spec Kit pode ser usado
**apenas como camada de planejamento formal** (spec, plan, research, data-model, contracts,
quickstart, checklists em `specs/`), preenchendo lacunas de especificação e ambiguidade.

⚠️ **Não gere `specs/<feature>/tasks.md`** (comando `/speckit.tasks`) — as tarefas vivem
exclusivamente em `docs/TASKS.md`, gerenciadas pelo Owner.

## Início rápido

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).
