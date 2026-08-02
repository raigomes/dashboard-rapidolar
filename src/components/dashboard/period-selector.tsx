"use client";

import { Button } from "@/components/ui/button";
import type { PeriodKey } from "@/types/dashboard";

const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: "7d", label: "7d" },
  { key: "30d", label: "30d" },
  { key: "12m", label: "12m" },
];

export function PeriodSelector({
  value,
  onChange,
}: {
  value: PeriodKey;
  onChange: (period: PeriodKey) => void;
}) {
  return (
    <div className="flex gap-1" role="group" aria-label="Período do gráfico">
      {PERIODS.map(({ key, label }) => (
        <Button
          key={key}
          type="button"
          variant={value === key ? "default" : "outline"}
          size="sm"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
