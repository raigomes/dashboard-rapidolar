import type { PostgrestError } from "@supabase/supabase-js";

/**
 * Traduz erros comuns do PostgREST em mensagens amigáveis.
 * Código 23503 = violação de foreign key (registro em uso por outra tabela).
 */
export function mensagemErroDelete(error: PostgrestError | null): string {
  if (!error) return "Erro ao excluir o registro.";
  if (error.code === "23503") {
    return "Não é possível excluir: o registro está em uso por outros dados.";
  }
  return error.message;
}
