"use client";

import {
  DollarSign,
  Minus,
  ShoppingCart,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { formatCurrency, formatInteger, formatVariacao } from "@/lib/format";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { MetricData } from "@/types/dashboard";

type MetricCardProps = {
  icon: LucideIcon;
  label: string;
  valor: number;
  format: (value: number) => string;
  variacao: number | null;
};

function Variacao({ variacao }: { variacao: number | null }) {
  if (variacao === null) {
    return (
      <p className="text-xs font-medium text-muted-foreground">—</p>
    );
  }
  if (variacao > 0) {
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-emerald-700">
        <TrendingUp className="size-3.5" />
        {formatVariacao(variacao)}
      </p>
    );
  }
  if (variacao < 0) {
    return (
      <p className="flex items-center gap-1 text-xs font-medium text-red-600">
        <TrendingDown className="size-3.5" />
        {formatVariacao(variacao)}
      </p>
    );
  }
  return (
    <p className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
      <Minus className="size-3.5" />
      {formatVariacao(variacao)}
    </p>
  );
}

function MetricCard({ icon: Icon, label, valor, format, variacao }: MetricCardProps) {
  return (
    <Card className="rounded-xl p-4 shadow-sm md:p-6">
      <div className="flex flex-col gap-3">
        <Icon className="size-5 text-muted-foreground" />
        <div className="space-y-0.5">
          <p className="text-2xl font-bold tracking-tight">{format(valor)}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
        <Variacao variacao={variacao} />
      </div>
    </Card>
  );
}

export type MetricCardsProps = {
  loading?: boolean;
  faturamentoHoje: MetricData;
  faturamentoMes: MetricData;
  pedidosHoje: MetricData;
  ticketMedioMes: MetricData;
};

export function MetricCards({
  loading = false,
  faturamentoHoje,
  faturamentoMes,
  pedidosHoje,
  ticketMedioMes,
}: MetricCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-xl p-4 shadow-sm md:p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
      <MetricCard
        icon={DollarSign}
        label="Faturamento Hoje"
        valor={faturamentoHoje.valor}
        format={formatCurrency}
        variacao={faturamentoHoje.variacao}
      />
      <MetricCard
        icon={DollarSign}
        label="Faturamento Mês"
        valor={faturamentoMes.valor}
        format={formatCurrency}
        variacao={faturamentoMes.variacao}
      />
      <MetricCard
        icon={ShoppingCart}
        label="Pedidos Hoje"
        valor={pedidosHoje.valor}
        format={formatInteger}
        variacao={pedidosHoje.variacao}
      />
      <MetricCard
        icon={TrendingUp}
        label="Ticket Médio Mês"
        valor={ticketMedioMes.valor}
        format={formatCurrency}
        variacao={ticketMedioMes.variacao}
      />
    </div>
  );
}
