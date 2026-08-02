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
import type { TopProduct } from "@/types/dashboard";

export function TopProducts({ produtos }: { produtos: TopProduct[] }) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Top 10 Produtos</CardTitle>
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
                    Produto
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Qtd Vendida
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Receita Total
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="px-4 py-6 text-center text-sm text-muted-foreground"
                    >
                      Sem dados no período.
                    </TableCell>
                  </TableRow>
                ) : (
                  produtos.map((produto, index) => (
                    <TableRow
                      key={produto.nome}
                      className="border-b hover:bg-muted/30"
                    >
                      <TableCell className="px-4 py-3 text-sm text-muted-foreground">
                        {index + 1}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {produto.nome}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatInteger(produto.qtd_vendida)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatCurrency(produto.receita)}
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
