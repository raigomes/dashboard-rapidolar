const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const integerFormatter = new Intl.NumberFormat("pt-BR");

const variacaoFormatter = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

export function formatInteger(value: number): string {
  return integerFormatter.format(value);
}

export function formatVariacao(variacao: number | null): string {
  if (variacao === null) return "—";
  const signal = variacao > 0 ? "+" : "";
  return `${signal}${variacaoFormatter.format(variacao)}%`;
}

export function toISODate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatAtualizacao(date: Date): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatData(iso: string): string {
  const [year, month, day] = iso.split("-");
  if (!year || !month || !day) return iso;
  return `${day}/${month}/${year}`;
}

const CATEGORIA_LABELS: Record<string, string> = {
  limpeza: "Limpeza",
  "descartáveis": "Descartáveis",
  higiene: "Higiene",
  alimentos: "Alimentos",
  bebidas: "Bebidas",
};

export function formatCategoria(categoria: string): string {
  const lower = categoria.toLowerCase();
  return CATEGORIA_LABELS[lower] ?? categoria;
}

const STATUS_LABELS: Record<string, string> = {
  pendente: "Pendente",
  confirmado: "Confirmado",
  entregue: "Entregue",
  cancelado: "Cancelado",
};

export function formatStatus(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

export function formatUuidCurto(id: string): string {
  return `#${id.slice(0, 6).toUpperCase()}`;
}
