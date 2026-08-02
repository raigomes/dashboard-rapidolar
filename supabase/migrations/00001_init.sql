-- =============================================================================
-- 00001_init.sql — Admin Dashboard RapidoLar
-- Schema canônico (fonte: specs/001-admin-dashboard-mvp/data-model.md e
-- contracts/rls-policies.md). Recria o ambiente do zero.
-- =============================================================================

-- 1. LIMPEZA PREVENTIVA (zera o ambiente para evitar conflitos)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS trg_produtos_updated_at ON public.produtos;
DROP TRIGGER IF EXISTS trg_clientes_updated_at ON public.clientes;
DROP TRIGGER IF EXISTS trg_pedidos_updated_at ON public.pedidos;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.set_updated_at();
DROP FUNCTION IF EXISTS public.is_admin();
DROP TABLE IF EXISTS public.pedido_itens CASCADE;
DROP TABLE IF EXISTS public.pedidos CASCADE;
DROP TABLE IF EXISTS public.clientes CASCADE;
DROP TABLE IF EXISTS public.produtos CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. CRIAÇÃO DAS TABELAS
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    cargo TEXT NOT NULL CHECK (cargo IN ('admin', 'vendedor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.produtos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    preco NUMERIC(10,2) NOT NULL CHECK (preco > 0),
    estoque INT NOT NULL DEFAULT 0 CHECK (estoque >= 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    telefone TEXT,
    endereco TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pedidos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE RESTRICT,
    created_by UUID NOT NULL REFERENCES public.profiles(id),
    data DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'pendente'
        CHECK (status IN ('pendente', 'confirmado', 'entregue', 'cancelado')),
    total NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.pedido_itens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pedido_id UUID NOT NULL REFERENCES public.pedidos(id) ON DELETE CASCADE,
    produto_id UUID NOT NULL REFERENCES public.produtos(id) ON DELETE RESTRICT,
    qtd INT NOT NULL CHECK (qtd > 0),
    preco_unit NUMERIC(10,2) NOT NULL CHECK (preco_unit > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. ÍNDICES (colunas usadas em policies/filtros)
CREATE INDEX idx_pedidos_cliente ON public.pedidos (cliente_id);
CREATE INDEX idx_pedidos_data ON public.pedidos (data);
CREATE INDEX idx_pedidos_status ON public.pedidos (status);
CREATE INDEX idx_pedidos_created_by ON public.pedidos (created_by);
CREATE INDEX idx_pedido_itens_pedido ON public.pedido_itens (pedido_id);
CREATE INDEX idx_pedido_itens_produto ON public.pedido_itens (produto_id);
CREATE INDEX idx_produtos_categoria ON public.produtos (categoria);

-- 4. TRIGGER DE updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_produtos_updated_at
    BEFORE UPDATE ON public.produtos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_clientes_updated_at
    BEFORE UPDATE ON public.clientes
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER trg_pedidos_updated_at
    BEFORE UPDATE ON public.pedidos
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. TRIGGER AUTOMÁTICO DE PERFIS (AUTH -> PUBLIC)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, nome, email, cargo)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'nome', 'Novo Usuário'),
        new.email,
        COALESCE(new.raw_user_meta_data->>'cargo', 'vendedor')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. ATIVAÇÃO DO ROW LEVEL SECURITY (RLS) EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.produtos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pedido_itens ENABLE ROW LEVEL SECURITY;

-- 7. FUNÇÃO AUXILIAR DE CARGO (SECURITY DEFINER evita recursão de RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = (SELECT auth.uid()) AND cargo = 'admin'
    );
$$;

-- 8. POLÍTICAS — menor privilégio (vendedor SEM DELETE; vê só o próprio)
-- 8.1 profiles
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles
    FOR SELECT TO authenticated
    USING (id = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY "profiles_insert_admin" ON public.profiles
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());
CREATE POLICY "profiles_update_admin" ON public.profiles
    FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "profiles_delete_admin" ON public.profiles
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 8.2 produtos (vendedor: SELECT; admin: tudo)
CREATE POLICY "produtos_select_all" ON public.produtos
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "produtos_insert_admin" ON public.produtos
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());
CREATE POLICY "produtos_update_admin" ON public.produtos
    FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "produtos_delete_admin" ON public.produtos
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 8.3 clientes (vendedor: SELECT; admin: tudo)
CREATE POLICY "clientes_select_all" ON public.clientes
    FOR SELECT TO authenticated
    USING ((SELECT auth.uid()) IS NOT NULL);
CREATE POLICY "clientes_insert_admin" ON public.clientes
    FOR INSERT TO authenticated
    WITH CHECK (public.is_admin());
CREATE POLICY "clientes_update_admin" ON public.clientes
    FOR UPDATE TO authenticated
    USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "clientes_delete_admin" ON public.clientes
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 8.4 pedidos (vendedor: SÓ os próprios, sem DELETE; admin: tudo)
CREATE POLICY "pedidos_select_own_or_admin" ON public.pedidos
    FOR SELECT TO authenticated
    USING (created_by = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY "pedidos_insert_own_or_admin" ON public.pedidos
    FOR INSERT TO authenticated
    WITH CHECK (created_by = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY "pedidos_update_own_or_admin" ON public.pedidos
    FOR UPDATE TO authenticated
    USING (created_by = (SELECT auth.uid()) OR public.is_admin())
    WITH CHECK (created_by = (SELECT auth.uid()) OR public.is_admin());
CREATE POLICY "pedidos_delete_admin" ON public.pedidos
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- 8.5 pedido_itens (herda visibilidade do pedido pai; DELETE só admin)
CREATE POLICY "pedido_itens_select_via_parent" ON public.pedido_itens
    FOR SELECT TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.pedidos p
        WHERE p.id = pedido_id
          AND (p.created_by = (SELECT auth.uid()) OR public.is_admin())
    ));
CREATE POLICY "pedido_itens_insert_via_parent" ON public.pedido_itens
    FOR INSERT TO authenticated
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pedidos p
        WHERE p.id = pedido_id
          AND (p.created_by = (SELECT auth.uid()) OR public.is_admin())
    ));
CREATE POLICY "pedido_itens_update_via_parent" ON public.pedido_itens
    FOR UPDATE TO authenticated
    USING (EXISTS (
        SELECT 1 FROM public.pedidos p
        WHERE p.id = pedido_id
          AND (p.created_by = (SELECT auth.uid()) OR public.is_admin())
    ))
    WITH CHECK (EXISTS (
        SELECT 1 FROM public.pedidos p
        WHERE p.id = pedido_id
          AND (p.created_by = (SELECT auth.uid()) OR public.is_admin())
    ));
CREATE POLICY "pedido_itens_delete_admin" ON public.pedido_itens
    FOR DELETE TO authenticated
    USING (public.is_admin());

-- =============================================================================
-- NOTA PARA O JOB DE SIMULAÇÃO / SEED:
-- pedidos.created_by é NOT NULL — o job deve informar o id do usuário dono
-- (ex.: admin@rapidolar.com) ao inserir pedidos, ou usar um default na tabela
-- caso os pedidos simulados pertençam ao admin.
-- =============================================================================
