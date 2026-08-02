export const CATEGORIAS_PRODUTO = [
  "limpeza",
  "descartáveis",
  "higiene",
  "alimentos",
  "bebidas",
] as const;

export type CategoriaProduto = (typeof CATEGORIAS_PRODUTO)[number];

export interface Produto {
  id: string;
  nome: string;
  categoria: string;
  preco: number;
  estoque: number;
  created_at: string;
  updated_at: string;
}

export type ProdutoOption = {
  id: string;
  nome: string;
  preco: number;
};
