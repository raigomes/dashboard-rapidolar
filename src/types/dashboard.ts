export type MetricData = {
  /** Valor formatável da métrica (R$ ou inteiro). */
  valor: number;
  /** Variação percentual vs período anterior. `null` quando não há base (anterior = 0). */
  variacao: number | null;
};

export type SalesPoint = {
  /** Rótulo do eixo X: "dd/mm" (7d/30d) ou "mmm/yy" (12m). */
  date: string;
  /** Faturamento (R$) no ponto. */
  receita: number;
};

export type TopProduct = {
  nome: string;
  qtd_vendida: number;
  receita: number;
};

export type TopClient = {
  nome: string;
  telefone: string | null;
  total_compras: number;
  qtd_pedidos: number;
};

export type PeriodKey = "7d" | "30d" | "12m";
