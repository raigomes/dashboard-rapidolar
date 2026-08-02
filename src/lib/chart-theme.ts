// Cores do tema para gráficos (Recharts).
//
// Tema light-only: literais hex espelhando os tokens do globals.css
// (--border #e5e5e5, --muted-foreground #737373, --primary #0f766e,
// --card #ffffff). NÃO usar `hsl(var(--border))` aqui: a paleta do projeto
// é hex, e `hsl(#e5e5e5)` é CSS inválido (quebraria o stroke dos SVGs).
// Fonte única: src/app/globals.css (seção :root).
export const CHART_COLORS = {
  grid: "#e5e5e5",
  axis: "#737373",
  line: "#0f766e",
  tooltipBorder: "#e5e5e5",
  tooltipBg: "#ffffff",
} as const;
