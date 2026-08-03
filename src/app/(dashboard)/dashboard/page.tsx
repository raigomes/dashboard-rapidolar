import { cookies } from "next/headers";

import { MetricCards } from "@/components/dashboard/metric-cards";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopClients } from "@/components/dashboard/top-clients";
import { TopProducts } from "@/components/dashboard/top-products";
import { ESTOQUE_BAIXO_LIMITE } from "@/lib/estoque";
import { formatAtualizacao, toISODate } from "@/lib/format";
import type { MetricData, TopClient, TopProduct } from "@/types/dashboard";
import { createClient } from "@/utils/supabase/server";

export const revalidate = 60;

const STATUS_FATURAMENTO = ["confirmado", "entregue"];

type PeriodFilter = { eq: string } | { gte: string; lte: string };

function calcVariacao(atual: number, anterior: number): number | null {
  if (anterior === 0) {
    // Sem base de comparação: neutro quando ambos zerados, "—" quando atual > 0.
    return atual === 0 ? 0 : null;
  }
  return ((atual - anterior) / anterior) * 100;
}

async function sumTotal(
  supabase: ReturnType<typeof createClient>,
  filter: PeriodFilter,
): Promise<number> {
  const query = supabase
    .from("pedidos")
    .select("total")
    .in("status", STATUS_FATURAMENTO)
    .limit(10000);
  const filtered =
    "eq" in filter
      ? query.eq("data", filter.eq)
      : query.gte("data", filter.gte).lte("data", filter.lte);
  const { data } = await filtered;
  const linhas = (data ?? []) as unknown as { total: string | number }[];
  return linhas.reduce((acc, row) => acc + Number(row.total), 0);
}

async function countPedidos(
  supabase: ReturnType<typeof createClient>,
  filter: PeriodFilter,
): Promise<number> {
  const query = supabase
    .from("pedidos")
    .select("*", { count: "exact", head: true })
    .in("status", STATUS_FATURAMENTO);
  const filtered =
    "eq" in filter
      ? query.eq("data", filter.eq)
      : query.gte("data", filter.gte).lte("data", filter.lte);
  const { count } = await filtered;
  return count ?? 0;
}

async function countEstoqueBaixo(
  supabase: ReturnType<typeof createClient>,
): Promise<number> {
  const { count } = await supabase
    .from("produtos")
    .select("*", { count: "exact", head: true })
    .lte("estoque", ESTOQUE_BAIXO_LIMITE);
  return count ?? 0;
}

async function fetchTopProdutos(
  supabase: ReturnType<typeof createClient>,
): Promise<TopProduct[]> {
  const { data } = await supabase
    .from("pedido_itens")
    .select("qtd, preco_unit, produtos(id, nome), pedidos(status)")
    .in("pedidos.status", STATUS_FATURAMENTO)
    .limit(10000);

  const byProduto = new Map<string, TopProduct>();
  for (const item of (data ?? []) as unknown as {
    qtd: number;
    preco_unit: string | number;
    produtos: { id: string; nome: string } | null;
    pedidos: { status: string } | null;
  }[]) {
    if (!item.produtos) continue;
    const atual = byProduto.get(item.produtos.id) ?? {
      nome: item.produtos.nome,
      qtd_vendida: 0,
      receita: 0,
    };
    atual.qtd_vendida += item.qtd;
    atual.receita += item.qtd * Number(item.preco_unit);
    byProduto.set(item.produtos.id, atual);
  }

  return [...byProduto.values()]
    .sort((a, b) => b.receita - a.receita)
    .slice(0, 10);
}

async function fetchTopClientes(
  supabase: ReturnType<typeof createClient>,
): Promise<TopClient[]> {
  const { data } = await supabase
    .from("pedidos")
    .select("total, clientes(id, nome, telefone)")
    .in("status", STATUS_FATURAMENTO)
    .limit(10000);

  const byCliente = new Map<string, TopClient>();
  for (const pedido of (data ?? []) as unknown as {
    total: string | number;
    clientes: { id: string; nome: string; telefone: string | null } | null;
  }[]) {
    if (!pedido.clientes) continue;
    const atual = byCliente.get(pedido.clientes.id) ?? {
      nome: pedido.clientes.nome,
      telefone: pedido.clientes.telefone,
      total_compras: 0,
      qtd_pedidos: 0,
    };
    atual.total_compras += Number(pedido.total);
    atual.qtd_pedidos += 1;
    byCliente.set(pedido.clientes.id, atual);
  }

  return [...byCliente.values()]
    .sort((a, b) => b.total_compras - a.total_compras)
    .slice(0, 10);
}

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const primeiroDiaMes = new Date(today.getFullYear(), today.getMonth(), 1);
  const primeiroDiaMesAnterior = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1,
  );
  const ultimoDiaMesAnterior = new Date(today.getFullYear(), today.getMonth(), 0);

  const [
    faturamentoHoje,
    faturamentoOntem,
    faturamentoMes,
    faturamentoMesAnterior,
    pedidosHoje,
    pedidosOntem,
    pedidosMes,
    pedidosMesAnterior,
    estoqueBaixo,
    topProdutos,
    topClientes,
  ] = await Promise.all([
    sumTotal(supabase, { eq: toISODate(today) }),
    sumTotal(supabase, { eq: toISODate(yesterday) }),
    sumTotal(supabase, {
      gte: toISODate(primeiroDiaMes),
      lte: toISODate(today),
    }),
    sumTotal(supabase, {
      gte: toISODate(primeiroDiaMesAnterior),
      lte: toISODate(ultimoDiaMesAnterior),
    }),
    countPedidos(supabase, { eq: toISODate(today) }),
    countPedidos(supabase, { eq: toISODate(yesterday) }),
    countPedidos(supabase, {
      gte: toISODate(primeiroDiaMes),
      lte: toISODate(today),
    }),
    countPedidos(supabase, {
      gte: toISODate(primeiroDiaMesAnterior),
      lte: toISODate(ultimoDiaMesAnterior),
    }),
    countEstoqueBaixo(supabase),
    fetchTopProdutos(supabase),
    fetchTopClientes(supabase),
  ]);

  const ticketAtual = pedidosMes > 0 ? faturamentoMes / pedidosMes : 0;
  const ticketAnterior =
    pedidosMesAnterior > 0 ? faturamentoMesAnterior / pedidosMesAnterior : 0;

  const metrics: {
    faturamentoHoje: MetricData;
    faturamentoMes: MetricData;
    pedidosHoje: MetricData;
    ticketMedioMes: MetricData;
    estoqueBaixo: MetricData;
  } = {
    faturamentoHoje: {
      valor: faturamentoHoje,
      variacao: calcVariacao(faturamentoHoje, faturamentoOntem),
    },
    faturamentoMes: {
      valor: faturamentoMes,
      variacao: calcVariacao(faturamentoMes, faturamentoMesAnterior),
    },
    pedidosHoje: {
      valor: pedidosHoje,
      variacao: calcVariacao(pedidosHoje, pedidosOntem),
    },
    ticketMedioMes: {
      valor: ticketAtual,
      variacao: calcVariacao(ticketAtual, ticketAnterior),
    },
    estoqueBaixo: {
      valor: estoqueBaixo,
      variacao: null,
    },
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Atualizado em {formatAtualizacao(new Date())}
        </p>
      </div>

      <MetricCards {...metrics} />

      <SalesChart />

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        <TopProducts produtos={topProdutos} />
        <TopClients clientes={topClientes} />
      </div>
    </div>
  );
}
