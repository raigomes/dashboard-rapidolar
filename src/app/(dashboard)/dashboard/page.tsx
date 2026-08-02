import { Card, CardContent } from "@/components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      <Card className="p-6">
        <CardContent className="px-0">
          <p className="text-sm text-muted-foreground">
            O painel de métricas e gráficos será construído na Phase 2.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
