# Design System — RapidoLar Dashboard

> **Gerado pelo Designer (Pencil.dev).** Especificação visual para implementação.
> **Versão:** 1.4
> **Data:** 2026-08-02
> **Changelog v1.4:** identidade visual da marca aprovada pelo usuário (commits `6cc50e8` + `0da49f5`) — logo RapidoLar passa a ser `SprayCanIcon` (Lucide `spray-can`) em caixa `bg-primary/10` com ícone `text-primary`. §2.7 Sidebar (barra branca com **Logo sm**), §2.8 Header (**Logo sm** à esquerda, wordmark `hidden md:inline`), §3.0 Landing (**Logo md**, nav `h-[72px]`), §3.1 Login (**Logo md** centralizado), §3.6 Relatórios/PDF (marca SprayCan em SVG branco sobre caixa teal `#0F766E` 28px r6 — substitui a antiga letra "R"), §1.1 padrão da logo, §6 ícone `SprayCan`, §8 componente `Logo` em `src/components/layout/logo.tsx`. `dashboard.pen` v2.14 atualizado (frames `vajch`/`tPjaL` Login, `Ld101`/`Ld102` Landing, LogoBar dos 5 sidebars `fhwvF`/`7t2cZ`/`frCbF`/`PmPwp`/`hGyUv`, Header `b8y6F`) com novo token `$brand-10` (`#E7F1F0` = teal `#0F766E` a 10% sobre branco). Os antigos marks (quadrado liso `$brand`, barra sólida `$brand` com texto branco) ficam apenas neste changelog como histórico.
> **Changelog v1.3:** correção T4.7 (2ª rodada) no frame `LndPg` do `dashboard.pen` — `Ld131` (CtaCard) com `width: 1152` (antes `fill_container`, que esticava a banda `$brand` por toda a tela; agora equivale a `max-w-6xl mx-auto` da §3.0) e textos `Ld132`/`Ld133` (CtaTitle/CtaSub) com `width: fill_container` (antes sem `width` + `textGrowth: fixed-width`, que quebrava cada caractere em linha própria). §3.0 atualizada com nota.
> **Changelog v1.2:** correção T4.7 no frame `LndPg` (Landing) do `dashboard.pen` — ícones dos Feature Cards deixaram de ser emoji (📊📦👥🛒📄) e passaram a usar rótulos Lucide kebab-case (`layout-dashboard`, `package`, `users`, `shopping-cart`, `file-text`) no componente `FXcRd` e nas 5 instâncias; wireframe §3.0 atualizado com os rótulos; refs/descendants de `LndPg` auditados e validados (nenhum self-override; todos os overrides resolvem para ids existentes — ver validação da T4.7).
> **Changelog v1.1:** nova §3.0 (Página Raiz `/` — Landing) + protótipo `dashboard.pen` atualizado (página Landing + componentes reutilizáveis Feature Card / Button Light + variáveis `secondary`/`secondaryfg`).
> **Framework:** Tailwind CSS v4 · Next.js 16 · shadcn/ui

---

## Índice

1. [Design Tokens](#1-design-tokens)
   - 1.1 [Paleta de Cores](#11-paleta-de-cores)
   - 1.2 [Tipografia](#12-tipografia)
   - 1.3 [Espaçamento](#13-espaçamento)
   - 1.4 [Sombras (Elevação)](#14-sombras-elevação)
   - 1.5 [Border Radius](#15-border-radius)
   - 1.6 [Breakpoints](#16-breakpoints)
2. [Componentes](#2-componentes)
   - 2.1 [Botões](#21-botões)
   - 2.2 [Cards](#22-cards)
   - 2.3 [Tabelas](#23-tabelas)
   - 2.4 [Formulários & Inputs](#24-formulários--inputs)
   - 2.5 [Modais / Dialogs](#25-modais--dialogs)
   - 2.6 [Badges](#26-badges)
   - 2.7 [Sidebar (Navegação)](#27-sidebar-navegação)
   - 2.8 [Header / Top Bar](#28-header--top-bar)
   - 2.9 [Loading Skeletons](#29-loading-skeletons)
   - 2.10 [Empty States](#210-empty-states)
   - 2.11 [Toast / Sonner](#211-toast--sonner)
3. [Page Layouts](#3-page-layouts)
   - 3.0 [`/` — Landing](#30---landing)
   - 3.1 [`/login` — Autenticação](#31-login--autenticação)
   - 3.2 [`/dashboard` — Métricas & Gráficos](#32-dashboard--métricas--gráficos)
   - 3.3 [`/produtos` — CRUD Produtos](#33-produtos--crud-produtos)
   - 3.4 [`/clientes` — CRUD Clientes](#34-clientes--crud-clientes)
   - 3.5 [`/pedidos` — Lista & Formulário de Pedidos](#35-pedidos--lista--formulário-de-pedidos)
   - 3.6 [`/relatorios` — Exportação PDF (Admin)](#36-relatorios--exportação-pdf-admin)
4. [Responsividade](#4-responsividade)
5. [Estados Globais](#5-estados-globais)

---

## 1. Design Tokens

### 1.1 Paleta de Cores

O tema usa **CSS variables** (shadcn/ui pattern) definidas em `globals.css`. Valores para luz; modo escuro segue o mesmo token naming com valores invertidos.

| Token               | CSS Variable              | Hex (Light) | Uso                                           |
| ------------------- | ------------------------- | ----------- | --------------------------------------------- |
| **Background**      | `--background`            | `#FFFFFF`   | Fundo da página / card surface                |
| **Foreground**      | `--foreground`            | `#0C0C0C`   | Texto primário                                |
| **Muted**           | `--muted`                 | `#F5F5F5`   | Fundo de sidebar, seções secundárias          |
| **Muted-foreground**| `--muted-foreground`      | `#737373`   | Texto secundário / placeholder                |
| **Card**            | `--card`                  | `#FFFFFF`   | Fundo de cards                                |
| **Card-foreground** | `--card-foreground`       | `#0C0C0C`   | Texto dentro de cards                         |
| **Border**          | `--border`                | `#E5E5E5`   | Bordas de componentes, separadores            |
| **Primary**         | `--primary`              | `#0F766E`   | Botão primário, links, accent (teal escuro)   |
| **Primary-foreground**| `--primary-foreground`  | `#FFFFFF`   | Texto em botão primário                       |
| **Secondary**       | `--secondary`             | `#F0FDFA`   | Botão secundário, backgrounds sutis           |
| **Secondary-foreground**| `--secondary-foreground`| `#134E4A`   | Texto em botão secundário                     |
| **Accent**          | `--accent`                | `#F5F5F5`   | Hover em itens de lista, active states        |
| **Accent-foreground**| `--accent-foreground`    | `#171717`   | Texto em hover state                          |
| **Destructive**     | `--destructive`           | `#DC2626`   | Ações destrutivas (excluir, cancelar)         |
| **Destructive-foreground**| `--destructive-foreground`| `#FFFFFF` | Texto em botão destrutivo                     |
| **Ring / Focus**    | `--ring`                  | `#0F766E`   | Outline de foco em inputs / botões            |
| **Warning**         | `--warning`               | `#F59E0B`   | Badge "pendente", alertas                     |
| **Warning-foreground**| `--warning-foreground`  | `#78350F`   | Texto em warning badge                        |
| **Success**         | `--success`               | `#22C55E`   | Badge "entregue", toast sucesso               |
| **Success-foreground**| `--success-foreground`  | `#052E16`   | Texto em success badge                        |
| **Info**            | `--info`                  | `#3B82F6`   | Badge "confirmado", info states               |
| **Info-foreground** | `--info-foreground`       | `#1E3A5F`   | Texto em info badge                           |

**Decisão de cor:** Teal como primary por associar-se a limpeza, frescor e confiança — alinhado ao segmento de produtos de limpeza e descartáveis da RapidoLar. Neutros em escala zinc/stone para máxima legibilidade.

**Padrão da logo (marca do produto):** a marca é o ícone `SprayCan` (Lucide `spray-can`) em container `bg-primary/10` com ícone `text-primary`. O `bg-primary/10` (teal `#0F766E` a 10% de opacidade) sobre fundo branco/card equivale ao tint `#E7F1F0` — representado no protótipo pelo token `$brand-10` do `dashboard.pen`. Ver §2.7 (sm), §2.8 (sm), §3.0 (md), §3.1 (md) e §3.6 (PDF, marca branca sobre teal sólido).

**Variante de variação percentual (subida/descida):**
- Variação positiva: `text-emerald-600` + `▲` (seta up)
- Variação negativa: `text-red-600` + `▼` (seta down)
- Neutro (0%): `text-muted-foreground` + `–`

### 1.2 Tipografia

| Propriedade       | Valor                                                       |
| ----------------- | ----------------------------------------------------------- |
| **Font Family**   | `Inter` (via next/font, variable `--font-inter`)            |
| **Fallback**      | `ui-sans-serif, system-ui, sans-serif`                      |
| **Base Size**     | `16px` (`text-base`)                                        |
| **Scale Ratio**   | 1.25 (major third)                                          |

**Type Scale:**

| Nível    | Classe Tailwind | Tamanho | Weight   | Tracking (letter-spacing) | Uso                        |
| -------- | --------------- | ------- | -------- | ------------------------- | -------------------------- |
| **h1**   | `text-3xl`      | 1.875rem | `font-bold` | `tracking-tight`        | Título de página            |
| **h2**   | `text-xl`       | 1.25rem  | `font-semibold` | `tracking-tight`      | Título de seção (cards)     |
| **h3**   | `text-base`     | 1rem     | `font-semibold` | normal                | Subtítulo / label de grupo  |
| **body** | `text-sm`       | 0.875rem | `font-normal` | normal                 | Texto corrido, tabelas      |
| **small**| `text-xs`       | 0.75rem  | `font-medium` | normal                 | Labels, badges, metadados   |
| **data** | `text-2xl`      | 1.5rem   | `font-bold`   | `tracking-tight`        | Valor numérico em metric card |
| **muted**| `text-sm`       | 0.875rem | `font-normal` | normal                 | `text-muted-foreground`     |

**Line-height:** `leading-5` (1.25rem) para body/small, `leading-7` (1.75rem) para h1, `leading-6` (1.5rem) para h2.

**Regras:**
- Nunca usar font display em UI (botões, labels, dados)
- Nunca usar tracking abaixo de `-0.04em` (`tracking-tight` = `-0.025em` é o limite)
- Body text nunca ultrapassar 75ch de largura (apenas para prosa; tabelas e dados podem ser mais largos)

### 1.3 Espaçamento

Grid base de **4px**. Espaçamentos seguem escala Tailwind v4.

| Classe | Valor   | Uso típico                                    |
| ------ | ------- | --------------------------------------------- |
| `gap-1` | 4px    | Ícone + texto inline                          |
| `gap-2` | 8px    | Entre label e input, botão adjacente          |
| `gap-3` | 12px   | Entre itens de formulário                     |
| `gap-4` | 16px   | Padding interno de cards, entre seções        |
| `gap-6` | 24px   | Entre cards no grid                           |
| `gap-8` | 32px   | Entre seções maiores                          |
| `p-4`   | 16px   | Padding de card                               |
| `p-6`   | 24px   | Padding de card maior / modal content         |
| `px-6`  | 24px   | Padding horizontal de página                  |
| `py-8`  | 32px   | Padding vertical de página                    |

### 1.4 Sombras (Elevação)

| Nível | Classe Tailwind | Uso                                     |
| ----- | --------------- | --------------------------------------- |
| 0     | `shadow-none`   | Default surface                         |
| 1     | `shadow-sm`     | Cards, raised elements                  |
| 2     | `shadow-md`     | Dropdowns, modals, tooltips             |
| 3     | `shadow-lg`     | Sidebar overlay, sheet                  |
| 4     | `shadow-xl`     | Toast, critical overlays                |

Todas as sombras seguem Tailwind v4 defaults (offset + blur, sem colored halo — ver craft-floor: depth).

### 1.5 Border Radius

| Classe         | Valor  | Uso                           |
| -------------- | ------ | ----------------------------- |
| `rounded-md`   | 6px    | Inputs, buttons, cards pequenos |
| `rounded-lg`   | 8px    | Cards, modais, tabelas        |
| `rounded-xl`   | 12px   | Cards de métrica (maiores)    |
| `rounded-full` | 9999px | Badges, avatars, pills        |

**Cards com radius 12–16px como recomendado pelo craft-floor.**
`rounded-xl` (12px) para cards de métrica; `rounded-lg` (8px) para cards de conteúdo.

### 1.6 Breakpoints

| Nome     | Tailwind | Largura    | Alvo           |
| -------- | -------- | ---------- | -------------- |
| **sm**   | `sm:`    | ≥640px     | Mobile landscape |
| **md**   | `md:`    | ≥768px     | Tablet portrait |
| **lg**   | `lg:`    | ≥1024px    | Tablet landscape |
| **xl**   | `xl:`    | ≥1280px    | Desktop         |
| **2xl**  | `2xl:`   | ≥1536px    | Desktop wide    |

**Breakpoints operacionais (do PRD):**
- Desktop (≥1440px): Sidebar expanded, grid 2-4 colunas
- Tablet (768–1024px): Sidebar colapsável, grid 2 colunas
- Mobile (<768px): Sidebar overlay, grid 1 coluna, tabelas com scroll horizontal

---

## 2. Componentes

### 2.1 Botões

Usar shadcn/ui `<Button>` com variantes.

| Variante     | Classes (`variant`) | Uso                                                     |
| ------------ | ------------------- | ------------------------------------------------------- |
| **default**  | `default`           | Primary action (salvar, novo, confirmar)                |
| **secondary**| `secondary`         | Ação secundária (cancelar, voltar)                      |
| **outline**  | `outline`           | Ação terciária, filtros, período selector               |
| **ghost**    | `ghost`             | Ícone toolbar, ações em linha de tabela                 |
| **destructive**| `destructive`     | Excluir, cancelar pedido                                |

**Sizes:**

| Size     | Classe     | Altura | Ícone + texto?      |
| -------- | ---------- | ------ | ------------------- |
| **sm**   | `size="sm"`  | h-8  | Sim, `gap-1.5`     |
| **md**   | `size="md"`  | h-9  | Sim, `gap-2`       |
| **lg**   | `size="lg"`  | h-10 | Sim, `gap-2`       |
| **icon** | `size="icon"`| h-9 w-9 | Ícone apenas       |

**Estados:**
- **Default:** Cor sólida (primary) ou outline conforme variante
- **Hover:** Escurece 10% (opacidade ou shade shift — shadcn gerencia via CSS variables)
- **Focus:** Ring 2px `--ring` com offset-2
- **Active:** Scale 0.97 (transição 100ms)
- **Disabled:** `opacity-50 cursor-not-allowed`
- **Loading:** `<Loader2 className="animate-spin" />` + texto "Salvando…" (ou apenas spinner para icon button)

### 2.2 Cards

Usar shadcn/ui `<Card>`.

**Metric Card (dashboard):**

```
┌──────────────────┐
│ Icon (opcional)  │
│ R$ 45.230,00     │  ← text-2xl font-bold tracking-tight
│ Faturamento Hoje │  ← text-sm text-muted-foreground
│ ▲ 12,5%          │  ← text-xs font-medium (verde/vermelho)
└──────────────────┘
```

- Padding: `p-4` (mobile), `p-6` (desktop)
- Radius: `rounded-xl`
- Shadow: `shadow-sm`
- Grid: 4 colunas (desktop) → 2 colunas (tablet) → 1 coluna (mobile)
- Variação percentual no canto inferior esquerdo com seta

**Content Card (tabelas, formulários):**

```
┌──────────────────────────────────┐
│ Título da Seção          [Ação] │  ← flex justify-between items-center
├──────────────────────────────────┤
│ Conteúdo (tabela / form / etc)   │
└──────────────────────────────────┘
```

- Padding: `p-4 md:p-6`
- Radius: `rounded-lg`
- Shadow: `shadow-sm`
- Header: `flex items-center justify-between` com `h2` + botão de ação

### 2.3 Tabelas

Usar shadcn/ui `<Table>` com wrapper responsivo.

```tsx
<div className="overflow-x-auto rounded-lg border">
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Coluna</TableHead>  {/* text-xs font-medium text-muted-foreground */}
      </TableRow>
    </TableHeader>
    <TableBody>
      <TableRow>
        <TableCell>Valor</TableCell>   {/* text-sm */}
      </TableRow>
    </TableBody>
  </Table>
</div>
```

**Especificações:**
- **Header:** `bg-muted/50`, texto `text-xs font-medium uppercase tracking-wider text-muted-foreground`
- **Rows:** `border-b` com `border-border`, hover: `bg-muted/30`
- **Cells:** `py-3 px-4 text-sm`
- **Scroll horizontal:** wrapper `overflow-x-auto` com `min-w-[600px]` para tabelas densas
- **Striped:** Não usar (reduz legibilidade em dados densos)
- **Ações na última coluna:** `flex justify-end gap-1` com botões `ghost` + ícone (`Pencil`, `Trash2`)

**Pagination:** Botões "Anterior" / "Próximo" + indicador "Página X de Y" centralizado.

### 2.4 Formulários & Inputs

Usar shadcn/ui `<Input>`, `<Label>`, `<Select>`, `<Textarea>` com `react-hook-form` + `zod`.

| Componente    | shadcn      | Altura/Padding          | Radius   |
| ------------- | ----------- | ----------------------- | -------- |
| Text Input    | `Input`     | `h-9 px-3 py-1`        | `rounded-md` |
| Select        | `Select`    | `h-9` (trigger)        | `rounded-md` |
| Textarea      | `Textarea`  | `min-h-[80px] px-3 py-2` | `rounded-md` |
| Date Input    | `Input type="date"` | `h-9 px-3 py-1` | `rounded-md` |

**Estados do input:**
- **Default:** `border border-border bg-background`
- **Focus:** `ring-2 ring-ring ring-offset-2` (shadcn gerencia)
- **Placeholder:** `text-muted-foreground`
- **Disabled:** `opacity-50 cursor-not-allowed bg-muted`
- **Error:** `border-destructive`, `ring-destructive` (quando validation falha)
- **Label:** `text-sm font-medium` acima do input, `mb-1.5`

**Form layout:**
- Grid de 1 coluna (mobile), 2 colunas (desktop) para campos emparelháveis
- `gap-4` entre campos
- Botões "Salvar" + "Cancelar" no final, alinhados à direita com `flex justify-end gap-2`
- Erros de validação exibidos abaixo do input com `text-xs text-destructive`

### 2.5 Modais / Dialogs

Usar shadcn/ui `<Dialog>`.

```tsx
<Dialog>
  <DialogTrigger>...</DialogTrigger>
  <DialogContent className="sm:max-w-lg">
    <DialogHeader>
      <DialogTitle>Título</DialogTitle>
      <DialogDescription>Descrição opcional</DialogDescription>
    </DialogHeader>
    {/* Form ou conteúdo */}
    <DialogFooter>
      <Button variant="outline">Cancelar</Button>
      <Button>Salvar</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Especificações:**
- **Width:** `sm:max-w-lg` (512px) para CRUD, `sm:max-w-2xl` (672px) para pedido com itens
- **Padding:** `p-6`
- **Mobile fullscreen:** Em <640px, `max-w-[calc(100%-16px)]` com `rounded-lg` (shadcn já adapta)
- **Overlay:** `bg-black/50` com `backdrop-blur-sm`
- **Fechar:** X no canto superior direito + clique fora + ESC
- **Confirmação de exclusão:** Usar `<AlertDialog>` do shadcn com título "Confirmar exclusão", descrição "Tem certeza?", botões "Cancelar" + "Excluir" (destructive variant)

### 2.6 Badges

Usar shadcn/ui `<Badge>` para status.

**Status de pedidos:**

| Status       | Variante (`variant`) | Classes adicionais       |
| ------------ | -------------------- | ------------------------ |
| Pendente     | `warning`            | `bg-amber-100 text-amber-800` |
| Confirmado   | `info`               | `bg-blue-100 text-blue-800`   |
| Entregue     | `success`            | `bg-green-100 text-green-800` |
| Cancelado    | `destructive`        | `bg-red-100 text-red-800`     |

**Badges de categoria de produto:**
- Usar `variant="outline"` com `text-xs` — cor neutra (não competir com status)

### 2.7 Sidebar (Navegação)

```
┌─────────────────────┐
│ [Logo RapidoLar]    │  ← h-14, flex items-center px-4
├─────────────────────┤
│  ○ Dashboard        │  ← nav item
│  ○ Produtos         │
│  ○ Clientes         │
│  ○ Pedidos          │
│  ○ Relatórios (adm) │  ← visível apenas se cargo === 'admin'
├─────────────────────┤
│  ○ Sair             │  ← no final, antes do footer
└─────────────────────┘
```

**Especificações:**
- **Width:** `w-56` (224px) expandida, `w-0` colapsada
- **Background:** `bg-background` (branco `#FFFFFF`) com `border-r border-border` — conforme protótipo `dashboard.pen` (decisão do Owner 2026-07-31: sidebar branca, padrão admin; desde v1.4 a LogoBar é branca `$card` com **Logo sm**, não mais sólida `$brand`)
- **Divider:** `border-r border-border`
- **Nav item:** `flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-md mx-2`
- **Nav item hover:** `bg-accent text-accent-foreground`
- **Nav item active:** `bg-primary/10 text-primary font-semibold` + ícone cheio (ex: `LayoutDashboard` vs `LayoutDashboardIcon`)
- **Ícones:** Lucide, 18px (`h-[18px] w-[18px]`)
- **Logo:** `<Logo size="sm" />` — **Logo sm**: caixa 32px `size-8 rounded-lg bg-primary/10` + `SprayCanIcon size-[18px] text-primary` + wordmark "RapidoLar" `text-lg font-bold tracking-tight`. Barra de logo branca `h-14 flex items-center px-4` (no protótipo: frame LogoBar `$card` com mark 32px `$brand-10` + label `spray-can` + wordmark 18px)
- **Collapse:** Em <1024px, sidebar vira `Sheet` (overlay) com trigger hamburger no header
- **Logout:** Item "Sair" com `LogOut` icon, no final da sidebar

### 2.8 Header / Top Bar

```
┌────────────────────────────────────────────────────────┐
│ ☰ (<1024px) [Logo sm] [Dashboard]             👤 Adm  │
└────────────────────────────────────────────────────────┘
```

**Especificações:**
- **Height:** `h-14`
- **Background:** `bg-background border-b border-border`
- **Padding:** `px-4 md:px-6`
- **Logo:** `<Logo size="sm" href="/dashboard" className="hidden md:inline" />` à esquerda (após o hamburger) — **Logo sm**: caixa 32px `size-8 rounded-lg bg-primary/10` + `SprayCanIcon size-[18px] text-primary` + wordmark "RapidoLar" `text-lg font-bold tracking-tight`; o wordmark é `hidden md:inline` (some em telas <768px); clica para `/dashboard`
- **Hamburger:** Visível apenas em <1024px, `Button variant="ghost" size="icon"` com `Menu` icon
- **Breadcrumb:** Opcional (pode ser apenas o título da página atual)
- **User dropdown:** `DropdownMenu` com avatar (iniciais), nome, email, link "Perfil", separator, "Sair"
- **Avatar:** `<Avatar><AvatarFallback>AB</AvatarFallback></Avatar>` — iniciais do nome em `text-sm font-medium bg-primary/10 text-primary`

### 2.9 Loading Skeletons

Usar shadcn/ui `<Skeleton>`.

**Metric card skeleton:**
```tsx
<div className="space-y-3">
  <Skeleton className="h-4 w-24" />   {/* label */}
  <Skeleton className="h-8 w-36" />   {/* value */}
  <Skeleton className="h-3 w-16" />   {/* variation */}
</div>
```

**Table skeleton:**
```tsx
<div className="space-y-3">
  <Skeleton className="h-8 w-full" />   {/* header */}
  <Skeleton className="h-6 w-full" />   {/* row */}
  <Skeleton className="h-6 w-full" />   {/* row */}
  <Skeleton className="h-6 w-full" />   {/* row */}
</div>
```

**Chart skeleton:**
```tsx
<Skeleton className="h-[300px] w-full" />
```

**Regra:** Skeletons devem espelhar a forma do conteúdo real — nunca usar spinner no meio do conteúdo.

### 2.10 Empty States

Exibido quando não há dados (primeiro uso, filtro sem resultados).

```
┌──────────────────────────────┐
│      📦 (ícone grande)       │  ← h-16 w-16 text-muted-foreground opacity-40
│  Nenhum produto encontrado   │  ← text-lg font-semibold mt-4
│  Crie seu primeiro produto   │  ← text-sm text-muted-foreground
│  para começar a vender.      │
│        [ Novo Produto ]      │  ← Button primary (CTA)
└──────────────────────────────┘
```

- **Layout:** `flex flex-col items-center justify-center py-16`
- **Ícone:** Lucide (ex: `Package`, `Users`, `ShoppingCart`, `FileText`)
- **Título:** `text-lg font-semibold text-foreground`
- **Descrição:** `text-sm text-muted-foreground text-center max-w-sm`
- **CTA:** Botão primário para criar o primeiro registro

### 2.11 Toast / Sonner

Usar `sonner` `<Toaster>` para feedback de operações.

```tsx
<Toaster
  position="bottom-right"
  richColors
  closeButton
  duration={4000}
/>
```

**Configuração:**
- **Posição:** `bottom-right` (canto inferior direito)
- **Sucesso:** `toast.success("Produto criado com sucesso!")` — fundo verde
- **Erro:** `toast.error("Erro ao salvar produto.")` — fundo vermelho
- **Duração:** 4s para sucesso, 6s para erro
- **Ícones:** Automáticos (checkmark / X) via `richColors`
- **Ação:** `toast("Mensagem", { action: { label: "Desfazer", onClick: () => {} } })` para operações destrutivas

---

## 3. Page Layouts

### 3.0 `/` — Landing (Página Raiz)

**Layout:** Página pública, sem sidebar/header do shell. Exibida apenas para visitantes **não autenticados** (o middleware redireciona sessões ativas para `/dashboard`). Estrutura leve e em scroll vertical, com mini-nav própria no topo. Todos os CTAs ("Entrar" / "Entrar no painel") apontam para `/login`.

```
┌────────────────────────────────────────────────────┐
│ [◯ spray-can RapidoLar]              [ Entrar ]   │  ← Nav (h-[72px], bg-card, border-b)
├────────────────────────────────────────────────────┤
│                                                    │
│        ( Para distribuidoras de limpeza... )       │  ← Badge pill (bg-secondary)
│      Vendas da RapidoLar em um só painel          │  ← Hero title (text-4xl/5xl)
│   Acompanhe faturamento, produtos, clientes e     │
│   pedidos — e exporte relatórios em PDF.          │  ← Hero subtitle
│                                                    │
│    [ Entrar no painel ]  [ Conhecer o painel ]    │  ← CTA row (primary + outline)
│                                                    │
├────────────────────────────────────────────────────┤
│     Tudo o que sua distribuidora precisa          │  ← Section title (text-3xl)
│                                                    │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │
│  │ layout-      │ │ package      │ │ users        │    │
│  │ dashboard    │ │              │ │              │    │
│  │ Dashboard    │ │ Produtos     │ │ Clientes     │    │  ← Grid features (desktop 3+2)
│  │ métricas     │ │ catálogo     │ │ cadastro     │    │    cards rounded-lg shadow-sm
│  └──────────────┘ └──────────────┘ └──────────────┘    │
│  ┌──────────────┐ ┌──────────────┐                      │
│  │ shopping-    │ │ file-text    │                      │
│  │ cart         │ │              │                      │
│  │ Pedidos      │ │ Relatórios   │                      │  ← 2 cards centralizados
│  └──────────────┘ └──────────────┘                      │
│                                                    │
│  ┌────────────────────────────────────────────┐   │
│  │   Pronto para organizar suas vendas?       │   │  ← CTA band (bg-primary)
│  │   Acesse o painel e veja os números...     │   │    rounded-xl
│  │        [ Entrar no painel ]                │   │    botão branco
│  └────────────────────────────────────────────┘   │
│                                                    │
│  © 2026 RapidoLar · Sistema de gestão              │  ← Footer (text-xs muted)
└────────────────────────────────────────────────────┘
```

| Elemento           | Especificação                                                                                                    |
| ------------------ | ---------------------------------------------------------------------------------------------------------------- |
| **Container**      | `min-h-screen bg-background` — página pública, fora do grupo `(dashboard)`                                       |
| **Nav (topo)**     | `h-[72px] flex items-center justify-between px-6 md:px-10 border-b border-border bg-card`. Logo = **Logo md** (`<Logo size="md" href="/" />`): caixa 48px `size-12 rounded-full bg-primary/10` + `SprayCanIcon size-6 text-primary` + wordmark "RapidoLar" `text-2xl font-bold tracking-tight` |
| **Nav CTA**        | `Button` "Entrar" (size `md`) → `Link href="/login"`                                                             |
| **Hero**           | `flex flex-col items-center text-center px-4 py-16 md:py-24`                                                      |
| **Badge hero**     | pill: `inline-flex items-center rounded-full bg-secondary text-secondary-foreground text-xs font-medium px-4 py-1.5` — "Para distribuidoras de limpeza e descartáveis" |
| **Hero título**    | `text-4xl md:text-5xl font-bold tracking-tight text-foreground max-w-3xl` — escala de hero (extensão da §1.2, ver nota) |
| **Hero subtítulo** | `mt-4 text-base md:text-lg text-muted-foreground max-w-xl`                                                        |
| **CTA row**        | `flex flex-col sm:flex-row items-center justify-center gap-3 mt-8`                                                |
| **CTA primário**   | `Button size="lg"` "Entrar no painel" → `Link href="/login"` (primary)                                            |
| **CTA secundário** | `Button variant="outline" size="lg"` "Conhecer o painel" → âncora `#funcionalidades`                             |
| **Seção features** | `py-16 md:py-24 px-4` com `id="funcionalidades"`; título `text-3xl font-bold text-center` + subtítulo `text-sm md:text-base text-muted-foreground text-center mt-2` |
| **Grid features**  | `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto` — 5 cards; última linha com 2 cards centralizados |
| **Feature card**   | `Card rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow` (tokens §2.2; hover 150ms conforme §9)          |
| **Icon box**       | `h-10 w-10 rounded-lg bg-secondary text-secondary-foreground flex items-center justify-center` + ícone Lucide `h-5 w-5` |
| **Card título**    | `mt-4 text-lg font-semibold text-card-foreground`                                                                 |
| **Card descrição** | `mt-2 text-sm text-muted-foreground`                                                                              |
| **CTA final**      | banda `rounded-xl bg-primary py-10 md:py-12 px-6 text-center` dentro de `max-w-6xl mx-auto` — no protótipo `dashboard.pen`: `Ld131` (CtaCard) com `width: 1152` (equivale a `max-w-6xl`), centralizado pelo pai `CtaSection` com `alignItems: center`; textos `Ld132`/`Ld133` com `width: fill_container` (sem isso + `textGrowth: fixed-width`, o motor quebra cada caractere em linha própria) |
| **CTA final título** | `text-2xl md:text-3xl font-bold text-primary-foreground`                                                        |
| **CTA final sub**  | `mt-2 text-primary-foreground/80`                                                                                 |
| **CTA final botão**| `mt-6` botão branco — variante landing: `bg-background text-primary hover:bg-background/90` (usa tokens existentes; não há variante branca na §2.1) |
| **Footer**         | `py-8 text-center text-xs text-muted-foreground` — "© 2026 RapidoLar · Sistema de gestão"                         |

**Ícones (Lucide, reutilizar mapeamento da §6):** Dashboard `LayoutDashboard`, Produtos `Package`, Clientes `Users`, Pedidos `ShoppingCart`, Relatórios `FileText` — `h-5 w-5` dentro do icon box `h-10 w-10` (decorativos, `aria-hidden="true"`). No protótipo `dashboard.pen` o ícone é representado pelo rótulo kebab-case (`layout-dashboard`, `package`, `users`, `shopping-cart`, `file-text`) por limitação do formato Pencil.dev v2.14 (que não suporta referência direta a Lucide) — na implementação usar o componente Lucide PascalCase correspondente.

> **Nota — Escala de hero (extensão da §1.2):** A landing é a única página com tipografia de marketing. O hero usa a **mesma** fonte Inter (variable `--font-inter`) e o mesmo tracking `tracking-tight` da escala existente, apenas com tamanhos maiores: `text-4xl` (2.25rem) em mobile e `text-5xl` (3rem) em desktop. Não introduz nova família, peso ou tracking fora do sistema.

**Responsivo:**

| Viewport              | Comportamento                                                                                     |
| --------------------- | ------------------------------------------------------------------------------------------------- |
| **Desktop (≥1024px)** | Nav `justify-between`; hero centralizado; grid features `lg:grid-cols-3` (3 cards na 1ª linha + 2 centralizados na 2ª); CTA band com botão inline |
| **Tablet (640–1024px)** | Grid features `sm:grid-cols-2` (linhas 2+2+1; último card centralizado)                          |
| **Mobile (<640px)**   | Tudo empilhado: CTA row vira coluna (`flex-col`), grid `grid-cols-1`, hero `py-16`, botões do CTA final `w-full` |

**Motion (alinhado à §9):**
- **Um momento autorado por página:** animação de entrada `fade-up` no título + subtítulo do hero ao carregar (300ms, `cubic-bezier(0.4, 0, 0.2, 1)`). Demais seções sem animação de entrada.
- **Feature cards:** `transition-shadow` 150ms `ease-in-out` — hover eleva `shadow-sm` → `shadow-md` (sem transform, sem `transition-all`).
- **Botões:** `active:scale-[0.97]` 100ms (padrão §2.1); hover `bg-primary/90` (primário) e `bg-background/90` (botão branco da banda).
- **Reduced motion:** respeitar `prefers-reduced-motion: reduce` — remover o fade-up do hero (bloco CSS da §9).

### 3.1 `/login` — Autenticação

**Layout:** Página pública, sem sidebar, sem header.

```
┌────────────────────────────────────────────────────┐
│                                                    │
│                                                    │
│           ┌────────────────────────┐               │
│           │   [Logo RapidoLar]     │               │
│           │                       │               │
│           │   E-mail              │               │
│           │   [................]   │               │
│           │                       │               │
│           │   Senha               │               │
│           │   [................]   │               │
│           │                       │               │
│           │   [ Entrar ]          │               │
│           │                       │               │
│           └────────────────────────┘               │
│                                                    │
└────────────────────────────────────────────────────┘
```

| Elemento       | Especificação                                        |
| -------------- | ---------------------------------------------------- |
| **Container**  | `flex min-h-screen items-center justify-center bg-muted` |
| **Card**       | `w-full max-w-sm mx-4 p-6` (Card do shadcn), `shadow-md` |
| **Logo**       | **Logo md** centralizado (`<Logo size="md" />`): círculo 48px `size-12 rounded-full bg-primary/10` + `SprayCanIcon size-6 text-primary` + wordmark "RapidoLar" `text-2xl font-bold tracking-tight`, `mb-8` |
| **Form**       | `space-y-4`                                           |
| **Input email**| `Input type="email" placeholder="seu@email.com"`      |
| **Input senha**| `Input type="password" placeholder="Sua senha"`       |
| **Botão**      | `Button className="w-full"` — "Entrar"               |
| **Error**      | `text-sm text-destructive text-center` abaixo do form |
| **Loading**    | Spinner no botão + texto "Entrando…"                  |

**Responsivo:** Mesmo layout em todas as viewports (sempre centralizado, card max-w-sm).

### 3.2 `/dashboard` — Métricas & Gráficos

**Layout:** Página protegida, dentro do App Shell (sidebar + header).

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Header: Dashboard                        👤 Adm │
│            ├───────────────────────────────────────────────────┤
│            │                                                   │
│            │  ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐            │
│            │  │R$ 45K │ │R$ 1.2M│ │ 128  │ │R$ 387│            │
│            │  │ Hoje  │ │  Mês  │ │Pedidos│ │T.Méd.│            │
│            │  │ ▲12%  │ │ ▲8%   │ │ ▲5%   │ │ ▼2%  │            │
│            │  └──────┘ └──────┘ └──────┘ └──────┘            │
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │ Vendas                    [7d][30d][12m] │     │
│            │  │                                            │     │
│            │  │   📈 (LineChart Recharts)                  │     │
│            │  │                                            │     │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
│            │  ┌────────────────────┐ ┌────────────────────┐   │
│            │  │ Top 10 Produtos    │ │ Top 10 Clientes    │   │
│            │  │ [tabela]           │ │ [tabela]           │   │
│            │  └────────────────────┘ └────────────────────┘   │
│            │                                                   │
└───────────────────────────────────────────────────────────────┘
```

| Área                | Especificação                                               |
| ------------------- | ----------------------------------------------------------- |
| **Metric Cards**    | Grid `grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6` |
| **Sales Chart**     | Card com `p-4 md:p-6`, `h-[300px]` (mobile: `h-[200px]`), `mt-6` |
| **Period Selector** | `flex gap-1` com `Button variant={isActive ? 'default' : 'outline'} size="sm"` |
| **Top Tables**      | Grid `grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6 mt-6`      |
| **Page Title**      | `text-3xl font-bold` + data de atualização em `text-sm text-muted-foreground` |

**Sales Chart (Recharts):**
```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={data}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
    <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
    <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid hsl(var(--border))' }} />
    <Line type="monotone" dataKey="receita" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
  </LineChart>
</ResponsiveContainer>
```

### 3.3 `/produtos` — CRUD Produtos

**Layout:** Tabela + Modal CRUD.

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Header: Produtos                          👤 Adm │
│            ├───────────────────────────────────────────────────┤
│            │                                                   │
│            │  Produtos                    [Busca...] [ + Novo ]│
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │ Nome   │ Cat.    │ Preço   │ Estoque │    │     │
│            │  │──────────────────────────────────────────│     │
│            │  │ Prod A │ Limpeza │ R$ 12,90│ 45      │ ✏️🗑️ │
│            │  │ Prod B │ Higiene │ R$ 8,50 │ 120     │ ✏️🗑️ │
│            │  │ ...    │ ...     │ ...     │ ...     │    │     │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
│            │  < 1 2 3 ... 10 >                                 │
│            │                                                   │
└───────────────────────────────────────────────────────────────┘
```

| Elemento            | Especificação                                          |
| ------------------- | ------------------------------------------------------ |
| **Page header**     | `flex items-center justify-between`, título + search + button |
| **Search input**    | `Input placeholder="Buscar por nome..." className="max-w-xs"` |
| **New button**      | `Button`" + `Plus` icon — "Novo Produto"              |
| **Table columns**   | Nome, Categoria (badge), Preço (R$), Estoque, Ações    |
| **Ações**           | `Button variant="ghost" size="icon"` + `Pencil` / `Trash2` |
| **Edit/New modal**  | `DialogContent sm:max-w-lg` com form: nome, categoria (Select), preço (Input number), estoque (Input number) |
| **Delete confirm**  | `AlertDialog` — "Tem certeza que deseja excluir [nome]?" — "Cancelar" / "Excluir" (destructive) |
| **Admin only**      | Ações de editar/excluir e botão "Novo" visíveis apenas para admin |
| **Empty state**     | Ícone `Package`, "Nenhum produto encontrado" + CTA     |

### 3.4 `/clientes` — CRUD Clientes

**Layout:** Idêntico a `/produtos` (padrão consistente).

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Header: Clientes                          👤 Adm │
│            ├───────────────────────────────────────────────────┤
│            │                                                   │
│            │  Clientes                     [Busca...] [ + Novo ]│
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │ Nome   │ Telefone  │ Endereço        │    │     │
│            │  │──────────────────────────────────────────│     │
│            │  │ João   │ (11) 9999 │ R. das Flores...│ ✏️🗑️ │
│            │  │ Maria  │ (21) 8888 │ Av. Central...  │ ✏️🗑️ │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
└───────────────────────────────────────────────────────────────┘
```

| Elemento            | Especificação                                          |
| ------------------- | ------------------------------------------------------ |
| **Table columns**   | Nome, Telefone (`text-sm font-mono`), Endereço (truncado), Ações |
| **Edit/New modal**  | `DialogContent sm:max-w-lg` com form: nome (required), telefone (pattern regex `^\(\d{2}\) \d{4,5}-\d{4}$`), endereço (Textarea) |
| **Phone format**    | Máscara `(XX) XXXXX-XXXX` — input pattern ou mask lib  |
| **Ações**           | Ícones `Pencil` / `Trash2` — visíveis apenas admin      |
| **Empty state**     | Ícone `Users`, "Nenhum cliente encontrado" + CTA        |

### 3.5 `/pedidos` — Lista & Formulário de Pedidos

**Layout:** Tabela + Filtros + Modal de criação/edição com itens dinâmicos.

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Header: Pedidos                          👤 Adm │
│            ├───────────────────────────────────────────────────┤
│            │                                                   │
│            │  Pedidos                         [ + Novo Pedido ]│
│            │                                                   │
│            │  [Data início] [Data fim] [Cliente ▼] [Status ▼] │
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │ Pedido │ Cliente │ Data   │ Status │ R$  │     │
│            │  │──────────────────────────────────────────│     │
│            │  │ #ABC123│ João    │ 15/07  │ ✅ Ent │ 450 │     │
│            │  │ #DEF456│ Maria   │ 14/07  │ ⏳ Pend│ 230 │     │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
│            │  < 1 2 3 ... 8 >                                  │
│            │                                                   │
└───────────────────────────────────────────────────────────────┘
```

**Filtros (linha única acima da tabela):**

| Filter      | Componente             | Props                                        |
| ----------- | ---------------------- | -------------------------------------------- |
| Data início | `Input type="date"`    | `className="w-[140px]"`                      |
| Data fim    | `Input type="date"`    | `className="w-[140px]"`                      |
| Cliente     | `Select`               | "Todos os clientes" + lista de clientes     |
| Status      | `Select`               | "Todos", Pendente, Confirmado, Entregue, Cancelado |

- Filtros em `flex flex-wrap gap-2 items-center`
- Filtros persistem via URL search params (`useSearchParams` / `searchParams`)

**Order Form Modal (criação/edição):**

```
┌───────────────────────────────────────────────┐
│  ✕  {Novo/Editar} Pedido                     │
├───────────────────────────────────────────────┤
│                                               │
│  Cliente: [Select com busca ▼]               │
│  Data:    [15/07/2026]                        │
│  Status:  [Pendente ▼]                        │
│                                               │
│  ─── Itens do Pedido ──────────────────────  │
│                                               │
│  Produto         │ Qtd │ Preço │ Subtotal    │
│  ─────────────────────────────────────────────│
│  [Detergente X]  │ [5] │ 12,90 │ R$ 64,50  ✕│
│  [Sabão Y]       │ [3] │ 8,50  │ R$ 25,50  ✕│
│  ─────────────────────────────────────────────│
│  [ + Adicionar Item ]                        │
│                                               │
│  Total: R$ 90,00                              │
│                                               │
│  [Cancelar]                    [Salvar]       │
└───────────────────────────────────────────────┘
```

| Elemento              | Especificação                                           |
| --------------------- | ------------------------------------------------------- |
| **Modal width**       | `sm:max-w-2xl` (672px) para comportar tabela de itens  |
| **Cliente select**    | Select searchable (combobox) — necessário para muitos clientes |
| **Data picker**       | `Input type="date"`                                     |
| **Itens table**       | `overflow-x-auto` dentro do modal, `min-w-[400px]`      |
| **Item row**          | Produto (Select), Qtd (Input number), Preço (Input), Subtotal (auto), Remover (button) |
| **Add item**          | `Button variant="outline" size="sm"` + `Plus` icon      |
| **Total**             | `text-lg font-bold text-right` no final                 |
| **Salvar**            | Valida ao menos 1 item; insere pedido + itens em transação |

### 3.6 `/relatorios` — Exportação PDF (Admin)

**Layout:** Apenas admin vê o conteúdo; vendedor vê mensagem de acesso negado.

```
┌───────────────────────────────────────────────────────────────┐
│ [Sidebar]  │  Header: Relatórios                        👤 Adm │
│            ├───────────────────────────────────────────────────┤
│            │                                                   │
│            │  Relatórios                                      │
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │ Período: [01/06/2026] até [30/06/2026]  │     │
│            │  │                                          │     │
│            │  │  [ Gerar Relatório ]  [ Exportar PDF ]   │     │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
│            │  ┌──────────────────────────────────────────┐     │
│            │  │         Preview do Relatório             │     │
│            │  │                                          │     │
│            │  │  Período: 01/06/2026 a 30/06/2026       │     │
│            │  │  Faturamento Total: R$ 450.230,00       │     │
│            │  │  Total de Pedidos: 128                  │     │
│            │  │                                          │     │
│            │  │  Top 10 Produtos:                        │     │
│            │  │  1. Detergente X — R$ 45.200,00         │     │
│            │  │  2. Sabão Y — R$ 38.100,00              │     │
│            │  │                                          │     │
│            │  │  Top 10 Clientes:                        │     │
│            │  │  1. João — R$ 22.400,00                 │     │
│            │  │  2. Maria — R$ 19.800,00                │     │
│            │  └──────────────────────────────────────────┘     │
│            │                                                   │
└───────────────────────────────────────────────────────────────┘
```

| Elemento               | Especificação                                        |
| ---------------------- | ---------------------------------------------------- |
| **Status check**       | Server Component verifica `cargo === 'admin'`; se não, renderiza "Acesso negado" |
| **Acesso negado**      | Ícone `ShieldAlert`, "Esta página é restrita a administradores", botão "Voltar ao Dashboard" |
| **Period selectors**   | 2x `Input type="date"` em linha                     |
| **Buttons**            | "Gerar Relatório" (primary) + "Exportar PDF" (outline, com `FileDown` icon) |
| **Preview card**       | Card com `p-6`, exibe dados após "Gerar Relatório"  |
| **PDF content**        | Logo RapidoLar, período, faturamento total, total pedidos, top 10 produtos, top 10 clientes. **Logo do PDF (marca):** `Svg`/`Path`/`Rect` do `@react-pdf/renderer` — caixa teal `#0F766E` 28×28px `cornerRadius` 6 (equivale a `borderRadius: 6`) com a marca **SprayCan em SVG branco** (`stroke="#FFFFFF"` strokeWidth 1.8, viewBox `0 0 24 24`; paths do Lucide `spray-can`: dots `M3 3h.01`/`M7 5h.01`/`M11 7h.01`/`M3 7h.01`/`M7 9h.01`/`M3 11h.01`, `Rect x=15 y=5 w=4 h=4 rx=1`, canister `m19 9 2 2v10...`, spout/handle `m13 14 8-2`/`m13 19 8-2`); título "RapidoLar" `Helvetica-Bold 16` teal — substitui a antiga letra "R" |
| **Loading**            | Skeleton no preview + botão "Gerando…" com spinner   |

---

## 4. Responsividade

### Desktop (≥1440px)

| Característica         | Especificação                                         |
| ---------------------- | ----------------------------------------------------- |
| Sidebar                | Expandida (w-56), sempre visível                      |
| Metric cards grid      | `grid-cols-4`                                        |
| Top tables layout      | `grid-cols-2` lado a lado                            |
| Chart height           | `h-[350px]`                                          |
| Tables                 | Sem scroll horizontal (conteúdo cabe)                |
| Modals                 | Centralizados, width fixo (max-w-lg / max-w-2xl)     |

### Tablet (768–1024px)

| Característica         | Especificação                                         |
| ---------------------- | ----------------------------------------------------- |
| Sidebar                | Colapsada (Sheet overlay), trigger hamburger no header |
| Metric cards grid      | `grid-cols-2` (2x2)                                  |
| Top tables layout      | `grid-cols-1` empilhadas                             |
| Chart height           | `h-[250px]`                                          |
| Tables                 | `overflow-x-auto` com `min-w-[600px]` se necessário  |
| Modals                 | `sm:max-w-lg` (chega perto das bordas laterais)      |
| Filters row            | Wrap em múltiplas linhas se necessário                |

### Mobile (<768px)

| Característica         | Especificação                                         |
| ---------------------- | ----------------------------------------------------- |
| Sidebar                | Sheet overlay (0 → 100% width transition)             |
| Metric cards grid      | `grid-cols-1` (stacked vertical)                      |
| Top tables layout      | `grid-cols-1` empilhadas                             |
| Chart height           | `h-[200px]`                                           |
| Tables                 | `overflow-x-auto` obrigatório, `min-w-[500px]`        |
| Modals                 | Full-width com margem pequena (`max-w-[calc(100%-16px)]`) |
| Page padding           | `px-4` em vez de `px-6`                               |
| Header buttons         | Apenas ícones (sem texto)                             |
| Form fields            | Single column (`grid-cols-1`)                         |

---

## 5. Estados Globais

### Loading

- **Skeleton** para cada seção da página (metric cards, chart, tables)
- **Botões** com spinner + texto durante operações
- **Chart** mostra skeleton retangular do mesmo tamanho
- **Página inteira:** `loading.tsx` com skeleton do layout

### Empty (Sem dados)

- Ícone grande + título + descrição + CTA para criar
- Exibido quando a consulta retorna 0 resultados
- Nunca mostrar tabela vazia sem tratamento

### Error

- **Global error:** `error.tsx` com mensagem + botão "Tentar novamente" (`reset()`)
- **404:** `not-found.tsx` com mensagem + link para `/dashboard`
- **CRUD error:** Toast no canto inferior direito com mensagem descritiva
- **Supabase offline:** Card de erro no lugar do conteúdo com "Falha ao conectar ao servidor" + botão retry
- **Acesso negado (relatórios):** Shield icon + "Acesso restrito a administradores"
- **Time out:** Timeout de 10s em queries com retry 1x antes de mostrar erro

### Validation (Formulários)

- Erro exibido abaixo do input em `text-xs text-destructive`
- Input border muda para `border-destructive`
- Botão "Salvar" desabilitado enquanto formulário inválido
- Zod schema valida no client + Server Action valida no servidor

### Permissions (Role-based)

| Ação                | Admin | Vendedor |
| ------------------- | ----- | -------- |
| Ver dashboard       | ✅    | ✅       |
| Ver produtos        | ✅    | ✅       |
| Criar/editar/excluir produtos | ✅ | ❌ (hide actions) |
| Ver clientes        | ✅    | ✅       |
| Criar/editar/excluir clientes | ✅ | ❌ (hide actions) |
| Ver pedidos         | ✅ (todos) | ✅ (apenas seus) |
| Criar/editar/excluir pedidos | ✅ (todos) | ✅ (apenas seus) |
| Ver relatórios      | ✅    | ❌ (acesso negado) |
| Exportar PDF        | ✅    | ❌       |

---

## Apêndice: Configuração de Tema (globals.css)

O arquivo `globals.css` deve seguir o padrão shadcn/ui com CSS variables. Este é o template base:

```css
@import "tailwindcss";

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-border: var(--border);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-ring: var(--ring);
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --font-sans: var(--font-inter), ui-sans-serif, system-ui, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, monospace;
  --radius: 0.5rem;
}

:root {
  --background: #ffffff;
  --foreground: #0c0c0c;
  --muted: #f5f5f5;
  --muted-foreground: #737373;
  --card: #ffffff;
  --card-foreground: #0c0c0c;
  --border: #e5e5e5;
  --primary: #0f766e;
  --primary-foreground: #ffffff;
  --secondary: #f0fdfa;
  --secondary-foreground: #134e4a;
  --accent: #f5f5f5;
  --accent-foreground: #171717;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --ring: #0f766e;
  --warning: #f59e0b;
  --warning-foreground: #78350f;
  --success: #22c55e;
  --success-foreground: #052e16;
  --info: #3b82f6;
  --info-foreground: #1e3a5f;
}
```

> **Nota:** O modo escuro não é requisito para MVP. Se implementado futuramente, usar mesma estrutura de variáveis com valores invertidos no seletor `.dark`.

---

## 6. Icon Mapping (Lucide React)

Todos os ícones usam `lucide-react`. Tamanho padrão: `18px` (`h-[18px] w-[18px]`) em navegação e ações inline; `16px` em badges e tabelas; `20px` em botões com texto.

| Localização                  | Ícone Lucide          | Uso                                              |
| ---------------------------- | --------------------- | ------------------------------------------------ |
| **Sidebar — Dashboard**      | `LayoutDashboard`     | Navegação principal                              |
| **Sidebar — Produtos**       | `Package`             | Gestão de produtos                               |
| **Sidebar — Clientes**       | `Users`               | Gestão de clientes                               |
| **Sidebar — Pedidos**        | `ShoppingCart`        | Gestão de pedidos                                |
| **Sidebar — Relatórios**     | `FileText`            | Relatórios (admin)                               |
| **Sidebar — Sair**           | `LogOut`              | Logout do sistema                                |
| **Logo (marca)**         | `SprayCan`             | Marca/logo do produto — `SprayCanIcon` em caixa `bg-primary/10 text-primary` (sm: 32px `rounded-lg`, md: 48px `rounded-full`); no PDF, branco sobre teal `#0F766E` |
| **Header — Menu (mobile)**   | `Menu`                | Hamburger para sidebar overlay                   |
| **Header — Usuário**         | `UserCircle`          | Avatar/fallback no dropdown                      |
| **Header — Dropdown Perfil** | `User`                | Link para perfil                                 |
| **Header — Dropdown Sair**   | `LogOut`              | Logout                                           |
| **Botão — Novo**             | `Plus`                | Criar novo registro                              |
| **Tabela — Editar**          | `Pencil`              | Ação de editar                                   |
| **Tabela — Excluir**         | `Trash2`              | Ação de excluir                                  |
| **Tabela — Ver**             | `Eye`                 | Visualizar detalhes                              |
| **Filtro — Busca**           | `Search`              | Input de busca                                  |
| **Filtro — Limpar**          | `X`                   | Limpar filtros                                   |
| **Filtro — Calendário**      | `Calendar`            | Date picker                                      |
| **Card — Faturamento**       | `DollarSign`          | Ícone de métrica financeira                      |
| **Card — Pedidos**           | `ShoppingCart`        | Ícone de métrica de pedidos                      |
| **Card — Clientes**          | `Users`               | Ícone de métrica de clientes                     |
| **Card — Ticket Médio**      | `TrendingUp`          | Ícone de métrica de ticket                       |
| **Chart — Período**          | `CalendarRange`       | Seletor de período no gráfico                    |
| **Relatório — Exportar**     | `FileDown`            | Exportar PDF                                     |
| **Relatório — Gerar**        | `RefreshCw`           | Gerar preview                                    |
| **Toast — Sucesso**          | `CheckCircle2`        | Operação bem-sucedida (automático via sonner)    |
| **Toast — Erro**             | `AlertCircle`         | Operação falhou (automático via sonner)           |
| **Toast — Alerta**           | `AlertTriangle`       | Aviso (automático via sonner)                     |
| **Botão — Fechar**           | `X`                   | Fechar modal/dialog                              |
| **Paginação — Anterior**     | `ChevronLeft`         | Navegação anterior                               |
| **Paginação — Próximo**      | `ChevronRight`        | Navegação próxima                                |
| **Empty State**              | `Package` / `Users` / `ShoppingCart` | Contextual conforme a entidade     |
| **Acesso Negado**            | `ShieldAlert`         | Página restrita                                  |
| **Loading/Spinner**          | `Loader2`             | Spinner em botões e loading states               |
| **Variação Positiva**        | `TrendingUp`          | Setas verdes em variações de métrica             |
| **Variação Negativa**        | `TrendingDown`        | Setas vermelhas em variações de métrica          |

**Regras de ícones:**
- Nunca misturar ícones `filled` com `outlined` no mesmo contexto — usar apenas `outlined` (padrão Lucide).
- Em botões com texto, ícone fica à esquerda com `gap-2` (desktop) ou `gap-1.5` (sm).
- Em botões `size="icon"`, tooltip com `title` ou `aria-label` descritivo.
- Ícones decorativos em metric cards têm `className="h-5 w-5 text-muted-foreground"`.

## 7. Paginação

Usar shadcn/ui `<Pagination>` (composto de `PaginationContent`, `PaginationItem`, `PaginationLink`, `PaginationPrevious`, `PaginationNext`, `PaginationEllipsis`).

```tsx
<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
```

**Especificações:**
- **Posição:** Centralizado abaixo da tabela, separado por `border-t`
- **Info texto:** `text-sm text-muted-foreground` — "Página X de Y | Mostrando A-Z de N registros"
- **Botões:** `variant="outline"` para páginas, `ghost` para navegação
- **Active:** `bg-primary text-primary-foreground` na página atual
- **Disabled:** Botões "Anterior"/"Próximo" com `opacity-50` quando no limite
- **Mobile:** Esconder páginas intermediárias, mostrar apenas "Anterior / X de Y / Próximo"
- **Limit:** 10 registros por página (configurável via query param `per_page`)
- **Total:** Calculado via `count()` no Supabase, retornado junto com os dados

## 8. File Structure & Component Hierarchy

```
src/
├── app/
│   ├── login/
│   │   ├── page.tsx              # LoginPage (pública)
│   │   └── layout.tsx            # Layout minimalista (sem sidebar)
│   ├── (dashboard)/
│   │   ├── layout.tsx            # App Shell (sidebar + header)
│   │   ├── dashboard/
│   │   │   └── page.tsx          # DashboardPage (server component)
│   │   ├── produtos/
│   │   │   ├── page.tsx          # ProdutosListPage
│   │   │   └── actions.ts        # Server Actions (CRUD produtos)
│   │   ├── clientes/
│   │   │   ├── page.tsx          # ClientesListPage
│   │   │   └── actions.ts        # Server Actions (CRUD clientes)
│   │   ├── pedidos/
│   │   │   ├── page.tsx          # PedidosListPage
│   │   │   └── actions.ts        # Server Actions (CRUD pedidos)
│   │   ├── relatorios/
│   │   │   └── page.tsx          # RelatoriosPage (admin-only)
│   │   └── perfil/
│   │       └── page.tsx          # ProfilePage (auto-serviço)
│   ├── auth/
│   │   └── confirm/
│   │       └── route.ts          # Auth callback route
│   ├── not-found.tsx             # Página 404 global
│   ├── error.tsx                 # Página 500 global
│   ├── globals.css               # Tema CSS variables + Tailwind
│   └── layout.tsx                # Root layout (font, toaster)
├── components/
│   ├── ui/                       # shadcn/ui components (gerado)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── table.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   ├── badge.tsx
│   │   ├── skeleton.tsx
│   │   ├── sonner.tsx
│   │   ├── form.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── sheet.tsx
│   │   ├── avatar.tsx
│   │   └── pagination.tsx
│   ├── layout/
│   │   ├── logo.tsx              # Logo RapidoLar (SprayCanIcon + wordmark) — props: size, showWordmark, href, className
│   │   ├── sidebar.tsx           # Sidebar navigation
│   │   ├── header.tsx            # Top bar
│   │   └── user-nav.tsx          # User dropdown (avatar + menu)
│   ├── dashboard/
│   │   ├── metric-cards.tsx      # 4 metric cards grid
│   │   ├── sales-chart.tsx       # Line chart (Recharts)
│   │   ├── period-selector.tsx   # 7d/30d/12m toggle
│   │   ├── top-products.tsx      # Top 10 products table
│   │   └── top-clients.tsx       # Top 10 clients table
│   ├── produtos/
│   │   ├── produtos-tabela.tsx   # Products table
│   │   ├── produto-form.tsx      # Create/edit modal form
│   │   └── produtos-search.tsx   # Search input with debounce
│   ├── clientes/
│   │   ├── clientes-tabela.tsx   # Clients table
│   │   ├── cliente-form.tsx      # Create/edit modal form
│   │   └── clientes-search.tsx   # Search input with debounce
│   ├── pedidos/
│   │   ├── pedidos-tabela.tsx    # Orders table
│   │   ├── pedidos-filtros.tsx   # Filter bar (date, client, status)
│   │   ├── pedido-form.tsx       # Create/edit modal form
│   │   ├── pedido-item-row.tsx   # Single item row in order form
│   │   └── selecionar-produto.tsx # Product select (searchable)
│   └── relatorios/
│       ├── relatorio-form.tsx    # Period + buttons
│       └── relatorio-pdf.tsx     # PDF document component
├── lib/
│   ├── supabase/
│   │   ├── client.ts            # Browser client (createBrowserClient)
│   │   ├── server.ts            # Server client (createServerClient)
│   │   └── middleware.ts        # Middleware client (createMiddlewareClient)
│   ├── utils.ts                  # shadcn cn() utility
│   └── types.ts                  # Database types (supabase gen)
├── middleware.ts                  # Next.js middleware (auth check)
└── hooks/
    └── use-debounce.ts           # Debounce hook for search inputs
```

**Hierarquia de Componentes (pai → filho):**

```
RootLayout
├── globals.css
└── <Toaster /> (sonner)

LoginLayout
└── LoginPage
    └── Card > Form (email + password + submit)

DashboardLayout (agrupado em (dashboard))
├── Sidebar (Desktop: fixed, Mobile: Sheet)
│   ├── Logo                    # <Logo size="sm" /> — src/components/layout/logo.tsx
│   ├── NavItem[] (ícone + label + active state)
│   └── NavItem("Sair", LogOut)
├── Header
│   ├── MenuButton (mobile only)
│   ├── PageTitle / Breadcrumb
│   └── UserNav (Avatar + DropdownMenu)
└── <main> (content area)
    └── [Page Content]

DashboardPage
├── MetricCards (grid 4 → 2 → 1)
├── SalesChart (LineChart Recharts)
│   └── PeriodSelector (7d, 30d, 12m)
├── TopProducts (Table)
└── TopClients (Table)

ProdutosPage
├── PageHeader (title + search + "Novo" button)
├── ProdutosTabela (Table)
│   └── Row actions (edit Pencil, delete Trash2)
├── ProdutoForm (Dialog)
│   └── Form (nome, categoria select, preço, estoque)
└── DeleteConfirmDialog (AlertDialog)

ClientesPage
├── PageHeader (title + search + "Novo" button)
├── ClientesTabela (Table)
├── ClienteForm (Dialog)
└── DeleteConfirmDialog

PedidosPage
├── PageHeader (title + "Novo" button)
├── PedidosFiltros (date range, client select, status select)
├── PedidosTabela (Table + Pagination)
├── PedidoForm (Dialog, sm:max-w-2xl)
│   ├── Order header (cliente, data, status)
│   ├── Itens table (produto, qtd, preço, subtotal)
│   │   └── PedidoItemRow[] (dynamic list)
│   ├── AddItemButton
│   └── Total display
└── DeleteConfirmDialog

RelatoriosPage
├── AdminGate (verifica cargo)
│   ├── AcessoNegado (ShieldAlert + mensagem)
│   └── [Conteúdo:]
│       ├── RelatorioForm (period selectors + buttons)
│       └── PreviewCard (faturamento, pedidos, tops)
│           └── RelatorioPDF (Document @react-pdf/renderer)
```

## 9. Motion Guidelines

### Transições de Página

| Transição         | Propriedade         | Duração | Easing                     |
| ----------------- | ------------------- | ------- | -------------------------- |
| Sidebar expand    | `width` transform   | 300ms   | `cubic-bezier(0.4, 0, 0.2, 1)` |
| Sidebar mobile    | `translateX`        | 300ms   | `ease-out`                 |
| Modal open        | `opacity` + `scale` | 200ms   | `ease-out`                 |
| Modal close       | `opacity` + `scale` | 150ms   | `ease-in`                  |
| Table row hover   | `background-color`  | 150ms   | `ease-in-out`              |
| Button active     | `transform: scale`  | 100ms   | `ease-out`                 |
| Toast enter       | `translateY` + `opacity` | 300ms | `ease-out`               |
| Chart animation   | Recharts default    | 500ms   | `ease-out`                 |
| Skeleton pulse    | `opacity` (pulse)   | 2s      | `ease-in-out` (loop)       |

### Regras de Motion

- **Um momento autorado por página:** Não espalhar efeitos idênticos em todas as seções. O gráfico do dashboard é o ponto focal — ele pode ter animação de entrada; os cards de métrica aparecem sem animação.
- **Exponential ease-out** a partir do estado visível default — preferir `cubic-bezier(0.4, 0, 0.2, 1)` sobre `ease`.
- **Avoid `transition-all`**: Especificar propriedades individuais para evitar reflows desnecessários.
- **Modais:** Devem usar `animate-in` e `slide-in-from-bottom` do shadcn (pré-configurado via `Dialog`).
- **Sidebar:** Transição suave entre expandido e colapsado (nunca instantânea).
- **Spinner:** Usar `animate-spin` do Tailwind no `Loader2` — não criar spinners customizados.
- **Pulse em skeletons:** Usar `animate-pulse` do Tailwind (opacidade oscila entre 1 e 0.5).
- **Reduced motion:** Respeitar `prefers-reduced-motion: reduce` — desabilitar animações de entrada, manter apenas transições funcionais (sidebar, modal abrir/fechar).

```css
/* No globals.css */
@media (prefers-reduced-motion: reduce) {
  *, ::before, ::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 10. Accessibility Guidelines

### Níveis WCAG

- **Contraste Mínimo:** WCAG AA (4.5:1 para texto normal, 3:1 para texto grande ≥24px)
- **Foco Visível:** `outline: 2px solid hsl(var(--ring))` com `outline-offset: 2px` em todos os elementos interativos
- **Navegação por Teclado:** Todos os formulários, modais, tabelas e filtros devem ser operáveis via Tab/Shift+Tab/Enter/Escape

### Implementações Obrigatórias

| Requisito                     | Implementação                                                                 |
| ----------------------------- | ----------------------------------------------------------------------------- |
| **Labels em inputs**          | `<Label htmlFor="email">E-mail</Label>` + `<Input id="email" />`              |
| **aria-label em icon buttons**| `aria-label="Editar produto"` em botões sem texto                             |
| **aria-describedby**          | Em inputs com erro, vincular mensagem de erro via `aria-describedby`          |
| **Role em modais**            | shadcn `Dialog` já gerencia `role="dialog"`, `aria-modal="true"`              |
| **aria-current**              | Nav item ativo: `aria-current="page"`                                         |
| **aria-expanded**             | Dropdowns e sheets: `aria-expanded` controlado                               |
| **aria-hidden**               | Ícones decorativos: `<Icon aria-hidden="true" />`                             |
| **Focus trap em modais**      | shadcn `Dialog` já implementa focus trap                                     |
| **Skip to content**           | Link oculto no início: `<a href="#main-content" className="sr-only">Pular para conteudo</a>` |
| **Alt text**                  | Quaisquer imagens devem ter `alt` descritivo                                  |
| **Tabelas acessíveis**        | `<caption>` ou `aria-label` descrevendo a tabela; `<th scope="col">`          |
| **Form validation**           | Mensagens de erro vinculadas via `aria-describedby`                           |
| **Toast acessível**           | `role="status"` + `aria-live="polite"` (sonner gerencia)                      |

### Atalhos de Teclado

| Atalho          | Ação                                    |
| --------------- | --------------------------------------- |
| `Tab` / `Tab+Shift` | Navegar entre campos                   |
| `Enter`         | Submeter formulário / Confirmar ação    |
| `Escape`        | Fechar modal / dropdown / sheet         |
| `Ctrl+K`        | Focar campo de busca (futuro)           |

### Alvos de Toque (Mobile)

- **Botões e links:** Mínimo 44x44px (Apple HIG / Material Design)
- **Inputs:** Altura mínima 40px (classe `h-9` = 36px, usar `h-10` em mobile)
- **Espaçamento entre alvos:** `gap-2` (8px) mínimo entre botões adjacentes
- **Ações em tabela:** Botões icon isolados com `size="icon"` (36x36px) com `aria-label`

### Testes de Acessibilidade Recomendados

1. Lighthouse Accessibility audit (alvo: 90+)
2. Navegação completa com Tab + Enter (sem mouse)
3. Leitor de tela (VoiceOver/NVDA) navegando pelas páginas
4. Zoom de 200% sem perda de layout
5. Teste de contraste com ferramenta (WebAIM Contrast Checker)

---

## 11. Chart Component Tokens (Recharts)

### SalesChart (Dashboard)

```tsx
<ResponsiveContainer width="100%" height="100%">
  <LineChart data={salesData}>
    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
    <XAxis
      dataKey="date"
      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
      tickLine={false}
      axisLine={{ stroke: 'hsl(var(--border))' }}
    />
    <YAxis
      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
      tickLine={false}
      axisLine={false}
      tickFormatter={(value) => `R$${(value / 1000).toFixed(0)}k`}
    />
    <Tooltip
      contentStyle={{
        borderRadius: 8,
        border: '1px solid hsl(var(--border))',
        background: 'hsl(var(--card))',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
      labelStyle={{ fontWeight: 600 }}
      formatter={(value: number) => [new Intl.NumberFormat('pt-BR', {
        style: 'currency', currency: 'BRL'
      }).format(value), 'Receita']}
    />
    <Line
      type="monotone"
      dataKey="receita"
      stroke="hsl(var(--primary))"
      strokeWidth={2}
      dot={false}
      activeDot={{ r: 4, strokeWidth: 2 }}
    />
  </LineChart>
</ResponsiveContainer>
```

**Tokens do Chart:**
| Propriedade        | Valor                                        |
| ------------------ | -------------------------------------------- |
| Grid color         | `hsl(var(--border))`                         |
| Axis label color   | `hsl(var(--muted-foreground))`               |
| Line color         | `hsl(var(--primary))`                        |
| Line width         | 2px                                          |
| Tooltip bg         | `hsl(var(--card))`                           |
| Tooltip border     | `1px solid hsl(var(--border))`               |
| Tooltip radius     | 8px                                          |
| Active dot radius  | 4px                                          |
| Animation duration | 500ms (Recharts default)                     |

**Dados:** Agrupados por data (7d/30d → diário) ou mês (12m → mensal). Estrutura: `{ date: string, receita: number }[]`.

## 12. Skeleton & Loading States

### Metric Cards Skeleton

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
  {Array.from({ length: 4 }).map((_, i) => (
    <Card key={i} className="p-6 rounded-xl">
      <div className="space-y-3">
        <Skeleton className="h-4 w-24" />   {/* label */}
        <Skeleton className="h-8 w-36" />   {/* value */}
        <Skeleton className="h-3 w-16" />   {/* variation */}
      </div>
    </Card>
  ))}
</div>
```

### Chart Skeleton

```tsx
<Card className="p-6">
  <Skeleton className="h-[300px] w-full rounded-lg" />
</Card>
```

### Table Skeleton

```tsx
<div className="space-y-2">
  <Skeleton className="h-10 w-full" />    {/* header */}
  {Array.from({ length: 5 }).map((_, i) => (
    <Skeleton key={i} className="h-8 w-full" />  {/* rows */}
  ))}
</div>
```

### Full Page Skeleton

Usar `loading.tsx` em cada rota. O skeleton deve espelhar o layout real da página: sidebar + header + content area com o formato correto dos componentes.

---

> **Nota Final:** Este Design System é a fonte única de verdade visual para implementação. O Coder deve seguir estas especificações rigorosamente. Desvios devem ser aprovados pelo Designer e registrados no REVIEW.md.

*Fim da especificação.*
