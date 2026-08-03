"use client";

import { useState } from "react";
import { FileDownIcon, Loader2Icon, RefreshCwIcon } from "lucide-react";
import { pdf } from "@react-pdf/renderer";

import { gerarRelatorio } from "@/app/(dashboard)/relatorios/actions";
import { RelatorioPDF } from "@/components/relatorios/relatorio-pdf";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatData, formatInteger, toISODate } from "@/lib/format";
import { toastError } from "@/lib/toast";
import type { RelatorioData } from "@/types/relatorio";

export function RelatorioForm() {
  const hoje = new Date();
  const primeiroDiaMes = new Date(hoje.getFullYear(), hoje.getMonth(), 1);

  const [dataInicio, setDataInicio] = useState(toISODate(primeiroDiaMes));
  const [dataFim, setDataFim] = useState(toISODate(hoje));
  const [relatorio, setRelatorio] = useState<RelatorioData | null>(null);
  const [gerando, setGerando] = useState(false);
  const [exportando, setExportando] = useState(false);

  const gerar = async () => {
    if (!dataInicio || !dataFim) {
      toastError("Selecione o período do relatório.");
      return;
    }
    if (dataFim < dataInicio) {
      toastError("A data fim deve ser maior ou igual à data início.");
      return;
    }

    setGerando(true);
    const res = await gerarRelatorio({ dataInicio, dataFim });
    setGerando(false);

    if (res?.error) {
      toastError(res.error);
      setRelatorio(null);
      return;
    }
    if (res.data) {
      setRelatorio(res.data);
    }
  };

  const exportarPdf = async () => {
    if (!relatorio) return;
    setExportando(true);
    try {
      const instance = pdf(<RelatorioPDF data={relatorio} />);
      const blob = await instance.toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `relatorio-rapidolar-${relatorio.dataInicio}-a-${relatorio.dataFim}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      toastError(
        err instanceof Error ? err.message : "Erro ao gerar o PDF.",
      );
    } finally {
      setExportando(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:max-w-md">
              <div className="space-y-2">
                <Label htmlFor="data-inicio">Data início</Label>
                <Input
                  id="data-inicio"
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data-fim">Data fim</Label>
                <Input
                  id="data-fim"
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                onClick={gerar}
                disabled={gerando}
                className="gap-1.5"
              >
                {gerando ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <RefreshCwIcon className="size-4" />
                )}
                {gerando ? "Gerando…" : "Gerar Relatório"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={exportarPdf}
                disabled={!relatorio || exportando}
                className="gap-1.5"
              >
                {exportando ? (
                  <Loader2Icon className="animate-spin" />
                ) : (
                  <FileDownIcon className="size-4" />
                )}
                {exportando ? "Exportando…" : "Exportar PDF"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-4 text-base font-semibold">Preview do Relatório</h2>

        {gerando ? (
          <Card className="shadow-sm">
            <CardContent className="space-y-4 p-4 md:p-6">
              <Skeleton className="h-4 w-40" />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-28 w-full" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-28 w-full" />
            </CardContent>
          </Card>
        ) : relatorio ? (
          <Card className="shadow-sm">
            <CardContent className="space-y-6 p-4 md:p-6">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Período
                </p>
                <p className="text-sm font-medium">
                  {formatData(relatorio.dataInicio)} a{" "}
                  {formatData(relatorio.dataFim)}
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Faturamento Total
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {formatCurrency(relatorio.faturamentoTotal)}
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total de Pedidos
                  </p>
                  <p className="text-2xl font-bold tracking-tight">
                    {formatInteger(relatorio.totalPedidos)}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-2 text-base font-semibold">Top 10 Produtos</p>
                {relatorio.topProdutos.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem dados no período.
                  </p>
                ) : (
                  <ol className="space-y-1">
                    {relatorio.topProdutos.map((produto, index) => (
                      <li
                        key={produto.nome}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="truncate font-medium">
                            {produto.nome}
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {formatCurrency(produto.receita)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              <div>
                <p className="mb-2 text-base font-semibold">Top 10 Clientes</p>
                {relatorio.topClientes.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Sem dados no período.
                  </p>
                ) : (
                  <ol className="space-y-1">
                    {relatorio.topClientes.map((cliente, index) => (
                      <li
                        key={cliente.nome}
                        className="flex items-center justify-between gap-4 text-sm"
                      >
                        <span className="flex min-w-0 items-center gap-2">
                          <span className="text-muted-foreground">
                            {index + 1}.
                          </span>
                          <span className="truncate font-medium">
                            {cliente.nome}
                          </span>
                        </span>
                        <span className="shrink-0 tabular-nums">
                          {formatCurrency(cliente.totalCompras)}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-sm text-muted-foreground">
                Defina o período e clique em &quot;Gerar Relatório&quot; para
                visualizar o preview.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
