# Designer

## Responsabilidade
Consome o `PRD.md`, gera o protótipo/layout no Pencil.dev e exporta a especificação visual para `docs/DESIGN_SYSTEM.md`.

## Skills
- Impeccable
- Pencil.dev

## Output
- `docs/DESIGN_SYSTEM.md`
- `docs/layout/*.pen` (protótipo Pencil.dev/pen.dev)

## Gotchas: Arquivos `.pen` (Pencil.dev / pen.dev)

Validação de arquivos `.pen` aprendida com falhas reais. Seguir sempre ao gerar/editar protótipos.

### Formato REAL (pen.dev v2.14)

O pen.dev **não aceita** o schema do analisador de terceiros `@narusenia/pencil-analyzer` (que espera `Stroke` struct e é mais estrito que o real). Usar um `.pen` exportado pelo editor real como template — ex.: `.impeccable/surfaces/**/*.pen`.

- `stroke` é **string de cor** (`"#1a1a1a"`), NÃO struct
- `strokeWidth` é **número no topo do nó**, não aninhado
- `fill` é string de cor ou `$var`
- Layout é **flexbox**: `layout: "vertical"|"horizontal"`, com `gap`, `padding` (número, `[tb,lr]` ou `[t,r,b,l]`), `alignItems`, `justifyContent`
- `width`/`height`: número, `"fill_container"` ou `"fit_content(20)"`; usar `fill_container` em linhas/seções que esticam no pai
- Componentes: frames com `"reusable": true` instanciados via `{ "type": "ref", "ref": "<id>", "descendants": { "<idFilho>": { ... } } }`
- Textos usam `content` (não `text`), com `fontFamily`, `fontSize`, `fontWeight`, `textAlign`, `opacity`
- Nível topo: `version`, `children`, `variables` (tokens `$var`), `fileToken` (UUID)
- `effect` para sombras: `{ "type": "shadow", "shadowType": "outer", "color": "#00000026", "offset": { "x": 2, "y": 2 } }`
- ids curtos estilo `"ZIaU6"`, `"Q0sxW"` (não semânticos longos)

### Erros que dão no pen.dev (e como evitar)

1. **"This node (X) is not accessible!"** → `descendants` **nunca pode sobrescrever o próprio nó raiz do componente** (o `ref` que o instancia). Só pode atingir nós filhos. Se precisa variar cor/estado do raiz, criar componentes separados por estado (ex.: Badge Pendente/Confirmado/Entregue/Cancelado) com cores embutidas em vez de override.
2. **Elementos invisíveis / frames sobrepostos** → frames de página precisam de `width`/`height` explícitos e `x` posicionados **sem sobreposição**, com gap (ex.: 80px). Calcular `ends_at = x + width` de cada frame e garantir que o próximo começa após.
3. **Formato inválido** → nunca inventar campos; conferir contra um `.pen` real. Não usar `@narusenia/pencil-analyzer` como validador definitivo (schema diferente).

### Checklist de validação (Node script antes de entregar)

1. JSON parseia
2. `version`, `fileToken`, `variables` presentes
3. Nenhum self-override: para cada `ref`, `descendants` NÃO pode conter a própria chave `ref`
4. Nenhum ref pendente: todo `ref` aponta para frame `reusable: true` de topo
5. Chaves inválidas ausentes: `text`, `d`, `x1/y1/x2/y2`, `stroke` como struct
6. Todos os ids únicos
7. Frames de página com `clip: true`, `width`/`height` explícitos, `x` sem sobreposição
