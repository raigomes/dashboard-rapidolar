export type RelatorioTopProduto = {
  nome: string;
  qtdVendida: number;
  receita: number;
};

export type RelatorioTopCliente = {
  nome: string;
  telefone: string | null;
  totalCompras: number;
  qtdPedidos: number;
};

export type RelatorioData = {
  dataInicio: string;
  dataFim: string;
  faturamentoTotal: number;
  totalPedidos: number;
  topProdutos: RelatorioTopProduto[];
  topClientes: RelatorioTopCliente[];
};
