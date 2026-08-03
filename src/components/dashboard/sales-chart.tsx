"use client";

import { useEffect, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { CHART_COLORS } from "@/lib/chart-theme";
import { toISODate } from "@/lib/format";
import type { PeriodKey, SalesPoint } from "@/types/dashboard";
import { createClient } from "@/utils/supabase/client";

import { PeriodSelector } from "./period-selector";

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const compactCurrencyFormatter = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  style: "currency",
  currency: "BRL",
});

const MONTHS_PT = [
  "jan",
  "fev",
  "mar",
  "abr",
  "mai",
  "jun",
  "jul",
  "ago",
  "set",
  "out",
  "nov",
  "dez",
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function toDayLabel(d: Date): string {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`;
}

function toMonthLabel(key: string): string {
  const [year, month] = key.split("-");
  return `${MONTHS_PT[Number(month) - 1]}/${year.slice(2)}`;
}

async function fetchDaily(period: "7d" | "30d"): Promise<SalesPoint[]> {
  const supabase = createClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const daysBack = period === "7d" ? 6 : 29;
  const start = new Date(today);
  start.setDate(start.getDate() - daysBack);

  const { data } = await supabase
    .from("pedidos")
    .select("data, total")
    .in("status", ["confirmado", "entregue"])
    .gte("data", toISODate(start))
    .limit(10000);

  const byDate = new Map<string, number>();
  for (const row of (data ?? []) as unknown as {
    data: string;
    total: string | number;
  }[]) {
    byDate.set(row.data, (byDate.get(row.data) ?? 0) + Number(row.total));
  }

  const points: SalesPoint[] = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    const iso = toISODate(d);
    points.push({ date: toDayLabel(d), receita: byDate.get(iso) ?? 0 });
  }
  return points;
}

async function fetchMonthly(): Promise<SalesPoint[]> {
  const supabase = createClient();
  const today = new Date();
  const start = new Date(today.getFullYear(), today.getMonth() - 11, 1);

  const { data } = await supabase
    .from("pedidos")
    .select("data, total")
    .in("status", ["confirmado", "entregue"])
    .gte("data", toISODate(start))
    .lte("data", toISODate(today))
    .limit(10000);

  const byMonth = new Map<string, number>();
  for (const row of (data ?? []) as { data: string; total: string | number }[]) {
    const key = row.data.slice(0, 7);
    byMonth.set(key, (byMonth.get(key) ?? 0) + Number(row.total));
  }

  const points: SalesPoint[] = [];
  for (let m = 0; m < 12; m++) {
    const d = new Date(start.getFullYear(), start.getMonth() + m, 1);
    const key = `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
    points.push({ date: toMonthLabel(key), receita: byMonth.get(key) ?? 0 });
  }
  return points;
}

export function SalesChart() {
  const [period, setPeriod] = useState<PeriodKey>("7d");
  const [data, setData] = useState<SalesPoint[]>([]);
  const [loadedPeriod, setLoadedPeriod] = useState<PeriodKey | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loading = loadedPeriod !== period;

  useEffect(() => {
    let cancelled = false;

    const request =
      period === "12m" ? fetchMonthly() : fetchDaily(period);

    request
      .then((points) => {
        if (!cancelled) {
          setData(points);
          setLoadedPeriod(period);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData([]);
          setLoadedPeriod(period);
          setError(
            err instanceof Error ? err.message : "Erro ao carregar vendas.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [period]);

  return (
    <Card className="p-4 shadow-sm md:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-base font-semibold">Vendas</h2>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>
      {loading ? (
        <Skeleton className="h-[200px] w-full rounded-lg md:h-[350px]" />
      ) : error ? (
        <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground md:h-[350px]">
          {error}
        </div>
      ) : (
        <div className="h-[200px] w-full md:h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 4, right: 8, left: 8, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke={CHART_COLORS.grid} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
                tickLine={false}
                axisLine={{ stroke: CHART_COLORS.grid }}
              />
              <YAxis
                tick={{ fontSize: 12, fill: CHART_COLORS.axis }}
                tickLine={false}
                axisLine={false}
                width={80}
                tickFormatter={(value) =>
                  compactCurrencyFormatter.format(Number(value))
                }
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  border: `1px solid ${CHART_COLORS.tooltipBorder}`,
                  background: CHART_COLORS.tooltipBg,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
                }}
                labelStyle={{ fontWeight: 600 }}
                formatter={(value) => [
                  currencyFormatter.format(Number(value)),
                  "Receita",
                ]}
              />
              <Line
                type="monotone"
                dataKey="receita"
                stroke={CHART_COLORS.line}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </Card>
  );
}
