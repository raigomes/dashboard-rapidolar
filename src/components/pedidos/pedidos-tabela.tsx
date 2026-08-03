"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  Loader2Icon,
  PencilIcon,
  PlusIcon,
  ShoppingCartIcon,
  Trash2Icon,
} from "lucide-react";
import { toast } from "sonner";

import { deletePedido } from "@/app/(dashboard)/pedidos/actions";
import { PedidoForm } from "@/components/pedidos/pedido-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatData, formatStatus, formatUuidCurto } from "@/lib/format";
import { toastError } from "@/lib/toast";
import { cn } from "@/lib/utils";
import type { ClienteOption } from "@/types/cliente";
import type { Pedido } from "@/types/pedido";
import type { ProdutoOption } from "@/types/produto";

const STATUS_CLASSES: Record<string, string> = {
  pendente: "bg-amber-100 text-amber-800",
  confirmado: "bg-blue-100 text-blue-800",
  entregue: "bg-green-100 text-green-800",
  cancelado: "bg-red-100 text-red-800",
};

export function PedidosTabela({
  pedidos,
  total,
  pagina,
  totalPaginas,
  limite,
  isAdmin,
  userId,
  clientes,
  produtos,
}: {
  pedidos: Pedido[];
  total: number;
  pagina: number;
  totalPaginas: number;
  limite: number;
  isAdmin: boolean;
  userId: string;
  clientes: ClienteOption[];
  produtos: ProdutoOption[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formOpen, setFormOpen] = useState(false);
  const [pedidoEdicao, setPedidoEdicao] = useState<Pedido | null>(null);
  const [deletar, setDeletar] = useState<Pedido | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  const inicio = total === 0 ? 0 : (pagina - 1) * limite + 1;
  const fim = Math.min(pagina * limite, total);

  const irPara = (p: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.replace(`/pedidos?${params.toString()}`, { scroll: false });
  };

  const abrirNovo = () => {
    setPedidoEdicao(null);
    setFormOpen(true);
  };

  const abrirEdicao = (pedido: Pedido) => {
    setPedidoEdicao(pedido);
    setFormOpen(true);
  };

  const podeEditar = (pedido: Pedido) =>
    isAdmin || pedido.created_by === userId;

  const confirmarExclusao = async () => {
    if (!deletar) return;
    setExcluindo(true);
    const res = await deletePedido(deletar.id);
    setExcluindo(false);
    if (res?.error) {
      toastError(res.error);
    } else {
      toast.success("Pedido excluído com sucesso!");
      router.refresh();
    }
    setDeletar(null);
  };

  return (
    <div className="space-y-4">
      <Card className="shadow-sm">
        <div className="flex items-center justify-between p-4">
          <p className="text-sm text-muted-foreground">
            {total} {total === 1 ? "pedido" : "pedidos"}
          </p>
          <Button onClick={abrirNovo} className="gap-1.5">
            <PlusIcon className="size-4" />
            Novo Pedido
          </Button>
        </div>

        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Pedido
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Cliente
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Data
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Total
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pedidos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <ShoppingCartIcon className="size-10 text-muted-foreground opacity-40" />
                        <p className="mt-2 text-lg font-semibold">
                          Nenhum pedido encontrado
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Ajuste os filtros ou crie um novo pedido.
                        </p>
                        <Button onClick={abrirNovo} className="mt-3 gap-1.5">
                          <PlusIcon className="size-4" />
                          Novo Pedido
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  pedidos.map((pedido) => (
                    <TableRow key={pedido.id} className="border-b hover:bg-muted/30">
                      <TableCell className="px-4 py-3 text-sm font-mono">
                        {formatUuidCurto(pedido.id)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {pedido.clientes?.nome ?? "—"}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm">
                        {formatData(pedido.data)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge
                          variant="secondary"
                          className={cn(
                            "border-transparent",
                            STATUS_CLASSES[pedido.status] ?? "",
                          )}
                        >
                          {formatStatus(pedido.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatCurrency(pedido.total)}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <div className="flex justify-end gap-1">
                          {podeEditar(pedido) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Editar pedido"
                              onClick={() => abrirEdicao(pedido)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                          )}
                          {podeEditar(pedido) && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label="Excluir pedido"
                              onClick={() => setDeletar(pedido)}
                            >
                              <Trash2Icon className="size-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {total > 0 && (
          <div className="flex flex-col items-center justify-between gap-2 border-t px-4 py-3 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              Mostrando {inicio}–{fim} de {total} registros
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={pagina <= 1}
                onClick={() => irPara(pagina - 1)}
                className="gap-1"
              >
                <ChevronLeftIcon className="size-4" />
                Anterior
              </Button>
              <span className="text-sm text-muted-foreground">
                Página {pagina} de {totalPaginas}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={pagina >= totalPaginas}
                onClick={() => irPara(pagina + 1)}
                className="gap-1"
              >
                Próxima
                <ChevronRightIcon className="size-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {formOpen && (
        <PedidoForm
          key={pedidoEdicao?.id ?? "novo"}
          open={formOpen}
          onOpenChange={setFormOpen}
          pedido={pedidoEdicao}
          clientes={clientes}
          produtos={produtos}
        />
      )}

      <AlertDialog
        open={deletar !== null}
        onOpenChange={(open) => {
          if (!open) setDeletar(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir o pedido{" "}
              <strong>{deletar ? formatUuidCurto(deletar.id) : ""}</strong>? Esta
              ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button variant="outline" onClick={() => setDeletar(null)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmarExclusao}
              disabled={excluindo}
            >
              {excluindo && <Loader2Icon className="animate-spin" />}
              {excluindo ? "Excluindo…" : "Excluir"}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
