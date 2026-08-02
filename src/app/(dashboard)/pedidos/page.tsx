import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { PedidosFiltros } from "@/components/pedidos/pedidos-filtros";
import { PedidosTabela } from "@/components/pedidos/pedidos-tabela";
import type { ClienteOption } from "@/types/cliente";
import type { Pedido } from "@/types/pedido";
import type { ProdutoOption } from "@/types/produto";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

const LIMITE = 20;

export default async function PedidosPage({
  searchParams,
}: {
  searchParams: Promise<{
    data_inicio?: string;
    data_fim?: string;
    cliente_id?: string;
    status?: string;
    page?: string;
  }>;
}) {
  const params = await searchParams;

  const dataInicio = (params.data_inicio ?? "").trim();
  const dataFim = (params.data_fim ?? "").trim();
  const clienteId = (params.cliente_id ?? "").trim();
  const status = (params.status ?? "").trim();
  const pagina = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const offset = (pagina - 1) * LIMITE;

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [{ data: profile }, { data: clientesData }, { data: produtosData }] =
    await Promise.all([
      supabase.from("profiles").select("cargo").eq("id", user.id).maybeSingle(),
      supabase.from("clientes").select("id, nome").order("nome").limit(200),
      supabase
        .from("produtos")
        .select("id, nome, preco")
        .order("nome")
        .limit(200),
    ]);

  const isAdmin = profile?.cargo === "admin";
  const clientes = (clientesData ?? []) as unknown as ClienteOption[];
  const produtos = (produtosData ?? []) as unknown as ProdutoOption[];

  const aplicarFiltros = <T,>(query: T): T => {
    // TypeScript infere T como o builder concreto do Supabase. O cast preserva
    // T e expõe apenas os métodos de filtro, evitando os 8 genéricos de
    // PostgrestFilterBuilder (o client não tem Database type gerado).
    const q = query as T & {
      gte(c: string, v: string): T;
      lte(c: string, v: string): T;
      eq(c: string, v: string): T;
    };
    let atual: T = query;
    if (dataInicio) atual = q.gte("data", dataInicio);
    if (dataFim) atual = q.lte("data", dataFim);
    if (clienteId) atual = q.eq("cliente_id", clienteId);
    if (status) atual = q.eq("status", status);
    return atual;
  };

  const baseQuery = supabase
    .from("pedidos")
    .select("id, data, status, total, created_by, cliente_id, clientes(nome)");

  const { data, error } = await aplicarFiltros(
    baseQuery.order("data", { ascending: false }).range(offset, offset + LIMITE - 1),
  );

  if (error) {
    throw new Error(error.message);
  }

  const { count } = await aplicarFiltros(
    supabase
      .from("pedidos")
      .select("*", { count: "exact", head: true }),
  );

  const pedidos = (data ?? []) as unknown as Pedido[];
  const total = count ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / LIMITE));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
      <PedidosFiltros clientes={clientes} />
      <PedidosTabela
        pedidos={pedidos}
        total={total}
        pagina={pagina}
        totalPaginas={totalPaginas}
        limite={LIMITE}
        isAdmin={isAdmin}
        userId={user.id}
        clientes={clientes}
        produtos={produtos}
      />
    </div>
  );
}
