-- =============================================================================
-- 00003_normaliza_categoria_produto.sql — RapidoLar
-- Normaliza valores de categoria de produtos para o formato canônico minúsculo
-- (o seed antigo gravava "Limpeza"/"Descartáveis"/"Higiene" capitalizados, mas
-- o app valida via z.enum(["limpeza","descartáveis","higiene","alimentos","bebidas"])).
-- =============================================================================

UPDATE public.produtos
SET categoria = lower(categoria)
WHERE categoria IN ('Limpeza', 'Descartáveis', 'Higiene', 'Alimentos', 'Bebidas');
