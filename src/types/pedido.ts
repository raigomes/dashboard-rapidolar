export const STATUS_PEDIDO = [
  "pendente",
  "confirmado",
  "entregue",
  "cancelado",
] as const;

export type StatusPedido = (typeof STATUS_PEDIDO)[number];

export interface Pedido {
  id: string;
  cliente_id: string;
  created_by: string;
  data: string;
  status: string;
  total: number;
  created_at: string;
  updated_at: string;
  clientes: { nome: string } | null;
}

export interface PedidoItem {
  id: string;
  pedido_id: string;
  produto_id: string;
  qtd: number;
  preco_unit: number;
  produtos: { nome: string } | null;
}

export interface PedidoItemInput {
  produto_id: string;
  qtd: number;
  preco_unit: number;
}

export interface PedidoInput {
  cliente_id: string;
  data: string;
  status: string;
  itens: PedidoItemInput[];
}
