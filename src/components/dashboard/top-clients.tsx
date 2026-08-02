import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatInteger } from "@/lib/format";
import type { TopClient } from "@/types/dashboard";

export function TopClients({ clientes }: { clientes: TopClient[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Top 10 Clientes</CardTitle>
      </CardHeader>
      <CardContent className="px-0">
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-10 bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cliente
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Telefone
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total Compras
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Qtd Pedidos
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      Sem dados no período.
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente, index) => (
                    <TableRow
                      key={cliente.nome}
                      className="border-b hover:bg-muted/30"
                    >
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {cliente.nome}
                      </TableCell>
                      <TableCell className="px-4 py-3 font-mono text-sm text-muted-foreground">
                        {cliente.telefone ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatCurrency(cliente.total_compras)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatInteger(cliente.qtd_pedidos)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
