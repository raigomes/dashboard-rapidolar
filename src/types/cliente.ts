export interface Cliente {
  id: string;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  created_at: string;
  updated_at: string;
}

export type ClienteOption = {
  id: string;
  nome: string;
};
