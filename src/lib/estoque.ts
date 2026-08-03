/**
 * Critério de estoque baixo (briefing: "Visualização em tempo real de ... estoque baixo").
 * Produtos com estoque <= ESTOQUE_BAIXO_LIMITE são destacados na tabela de produtos
 * (badge "Estoque baixo") e contados no card de métrica do dashboard.
 */
export const ESTOQUE_BAIXO_LIMITE = 10;

export function isEstoqueBaixo(estoque: number): boolean {
  return estoque <= ESTOQUE_BAIXO_LIMITE;
}
