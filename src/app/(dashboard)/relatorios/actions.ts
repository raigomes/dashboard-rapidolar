"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import type {
  RelatorioData,
  RelatorioTopCliente,
  RelatorioTopProduto,
} from "@/types/relatorio";
import { createClient } from "@/utils/supabase/server";

const STATUS_FATURAMENTO = ["confirmado", "entregue"];
const LIMITE_AGREGACAO = 10000;

const relatorioSchema = z.object({
  dataInicio: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Data início inválida."),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data fim inválida."),
});

export type RelatorioActionResult = { data?: RelatorioData; error?: string };

async function fetchTopProdutos(
  supabase: ReturnType<typeof createClient>,
  dataInicio: string,
  dataFim: string,
): Promise<RelatorioTopProduto[]> {
  const { data } = await supabase
    .from("pedido_itens")
    .select("qtd, preco_unit, pedidos(data, status), produtos(id, nome)")
    .in("pedidos.status", STATUS_FATURAMENTO)
    .gte("pedidos.data", dataInicio)
    .lte("pedidos.data", dataFim)
    .limit(LIMITE_AGREGACAO);

  const byProduto = new Map<string, RelatorioTopProduto>();
  for (const item of (data ?? []) as unknown as {
    qtd: number;
    preco_unit: string | number;
    produtos: { id: string; nome: string } | null;
  }[]) {
    if (!item.produtos) continue;
    const atual = byProduto.get(item.produtos.id) ?? {
      nome: item.produtos.nome,
      qtdVendida: 0,
      receita: 0,
    };
    atual.qtdVendida += item.qtd;
    atual.receita += item.qtd * Number(item.preco_unit);
    byProduto.set(item.produtos.id, atual);
  }

  return [...byProduto.values()]
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10);
}

async function fetchTopClientes(
  supabase: ReturnType<typeof createClient>,
  dataInicio: string,
  dataFim: string,
): Promise<RelatorioTopCliente[]> {
  const { data } = await supabase
    .from("pedidos")
    .select("total, clientes(id, nome, telefone)")
    .in("status", STATUS_FATURAMENTO)
    .gte("data", dataInicio)
    .lte("data", dataFim)
    .limit(LIMITE_AGREGACAO);

  const byCliente = new Map<string, RelatorioTopCliente>();
  for (const pedido of (data ?? []) as unknown as {
    total: string | number;
    clientes: { id: string; nome: string; telefone: string | null } | null;
  }[]) {
    if (!pedido.clientes) continue;
    const atual = byCliente.get(pedido.clientes.id) ?? {
      nome: pedido.clientes.nome,
      telefone: pedido.clientes.telefone,
      totalCompras: 0,
      qtdPedidos: 0,
    };
    atual.totalCompras += Number(pedido.total);
    atual.qtdPedidos += 1;
    byCliente.set(pedido.clientes.id, atual);
  }

  return [...byCliente.values()]
    .sort((a, b) => b.totalCompras - a.totalCompras)
    .slice(0, 10);
}

export async function gerarRelatorio(input: {
  dataInicio: string;
  dataFim: string;
}): Promise<RelatorioActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("cargo")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.cargo !== "admin") {
    return { error: "Apenas administradores podem gerar relatórios." };
  }

  const parsed = relatorioSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Período inválido." };
  }

  const { dataInicio, dataFim } = parsed.data;
  if (dataFim < dataInicio) {
    return { error: "A data fim deve ser maior ou igual à data início." };
  }

  const [{ data: faturamentoRows }, { count: totalPedidos }] =
    await Promise.all([
      supabase
        .from("pedidos")
        .select("total")
        .in("status", STATUS_FATURAMENTO)
        .gte("data", dataInicio)
        .lte("data", dataFim)
        .limit(LIMITE_AGREGACAO),
      supabase
        .from("pedidos")
        .select("*", { count: "exact", head: true })
        .gte("data", dataInicio)
        .lte("data", dataFim),
    ]);

  // Gotcha do projeto: NUNCA usar sum() do PostgREST (linhas sem aggregate
  // somem em select="*,totals()"). Somar no cliente com reduce.
  const faturamentoTotal = (faturamentoRows ?? []).reduce(
    (acc, row) => acc + Number((row as { total: string | number }).total),
    0,
  );

  const [topProdutos, topClientes] = await Promise.all([
    fetchTopProdutos(supabase, dataInicio, dataFim),
    fetchTopClientes(supabase, dataInicio, dataFim),
  ]);

  return {
    data: {
      dataInicio,
      dataFim,
      faturamentoTotal,
      totalPedidos: totalPedidos ?? 0,
      topProdutos,
      topClientes,
    },
  };
}
