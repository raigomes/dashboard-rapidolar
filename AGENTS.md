# Repository Agent Harness & Squad Rules

## Workflow Sequencial da Squad
1. **OWNER (@owner / Skill: Superpowers)**: Lê o briefing bruto em `docs/briefing.md`, cria o `docs/PRD.md` e desmembra em sub-tarefas atômicas em `docs/TASKS.md`.
2. **DESIGNER (@designer / Skill: Impeccable + Pencil.dev)**: Consome o `PRD.md`, gera o protótipo/layout no Pencil.dev e exporta a especificação visual para `docs/DESIGN_SYSTEM.md`.
3. **CODER (@coder / Skill: Caveman)**: Executa tarefa por tarefa descrita em `docs/TASKS.md`. Código Next.js enxuto, tipado (TypeScript strict), sem conversa fiada ou explicações desnecessárias.
4. **REVIEWER (@reviewer / Skill: Superpowers + Impeccable)**: Executa `npx tsc --noEmit` e valida se o layout bate com o Pencil.dev. Se houver falhas repetidas, grava em `docs/failures/`.

## Diretrizes de Código
- Framework: Next.js 15+ (App Router), React 19, Tailwind CSS, Shadcn UI, Recharts/Tremor.
- Não altere assinaturas de componentes UI existentes sem autorização do Reviewer.
