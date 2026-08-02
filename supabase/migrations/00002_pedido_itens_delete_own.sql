-- =============================================================================
-- 00002 — Corrigir remoção de itens pelo dono do pedido (fast-follow Phase 3)
-- =============================================================================
-- Motivo (docs/failures/phase-3.md — LEVE 1):
--   O vendedor pode criar/editar pedidos próprios, mas as policies de DELETE
--   em `pedidos` e `pedido_itens` eram exclusivas de admin. Resultado: ao
--   editar um pedido e remover itens, a remoção era silenciosamente ignorada
--   (itens voltavam ao reabrir) e `pedido_itens` ficava dessincronizado do
--   `total`. O rollback do `createPedido` também falhava silenciosamente.
--
-- Alinhamento: DESIGN_SYSTEM.md §5 (tabela de permissões) — "excluir pedidos:
--   ✅ (todos) / ✅ (apenas seus)".
-- =============================================================================

-- 1) Vendedor pode excluir pedidos que criou (admin continua com tudo).
DROP POLICY IF EXISTS "pedidos_delete_admin" ON public.pedidos;

CREATE POLICY "pedidos_delete_own_or_admin" ON public.pedidos
    FOR DELETE TO authenticated
    USING (created_by = (SELECT auth.uid()) OR public.is_admin());

-- 2) Vendedor pode excluir itens de pedidos que criou (herda visibilidade do pai).
DROP POLICY IF EXISTS "pedido_itens_delete_admin" ON public.pedido_itens;

CREATE POLICY "pedido_itens_delete_own_via_parent" ON public.pedido_itens
    FOR DELETE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.pedidos p
        WHERE p.id = pedido_id
          AND (p.created_by = (SELECT auth.uid()) OR public.is_admin())
    ));
