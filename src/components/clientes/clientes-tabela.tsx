"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2Icon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, UsersIcon } from "lucide-react";
import { toast } from "sonner";

import { deleteCliente } from "@/app/(dashboard)/clientes/actions";
import { ClienteForm } from "@/components/clientes/cliente-form";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toastError } from "@/lib/toast";
import type { Cliente } from "@/types/cliente";

export function ClientesTabela({
  clientes,
  isAdmin,
}: {
  clientes: Cliente[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get("q") ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [clienteEdicao, setClienteEdicao] = useState<Cliente | null>(null);
  const [deletar, setDeletar] = useState<Cliente | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (busca) {
        params.set("q", busca);
      } else {
        params.delete("q");
      }
      router.replace(`/clientes?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [busca, searchParams, router]);

  const abrirNovo = () => {
    setClienteEdicao(null);
    setFormOpen(true);
  };

  const abrirEdicao = (cliente: Cliente) => {
    setClienteEdicao(cliente);
    setFormOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!deletar) return;
    setExcluindo(true);
    const res = await deleteCliente(deletar.id);
    setExcluindo(false);
    if (res?.error) {
      toastError(res.error);
    } else {
      toast.success("Cliente excluído com sucesso!");
      router.refresh();
    }
    setDeletar(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por nome..."
            className="pl-8"
            aria-label="Buscar clientes"
          />
        </div>
        {isAdmin && (
          <Button onClick={abrirNovo} className="gap-1.5">
            <PlusIcon className="size-4" />
            Novo Cliente
          </Button>
        )}
      </div>

      <Card className="shadow-sm">
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px]">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nome
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Telefone
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Endereço
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ações
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 4 : 3} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <UsersIcon className="size-10 text-muted-foreground opacity-40" />
                        <p className="mt-2 text-lg font-semibold">Nenhum cliente encontrado</p>
                        <p className="text-sm text-muted-foreground">
                          {busca
                            ? "Ajuste a busca ou tente outro termo."
                            : "Cadastre seu primeiro cliente para começar a vender."}
                        </p>
                        {isAdmin && !busca && (
                          <Button onClick={abrirNovo} className="mt-3 gap-1.5">
                            <PlusIcon className="size-4" />
                            Novo Cliente
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  clientes.map((cliente) => (
                    <TableRow key={cliente.id} className="border-b hover:bg-muted/30">
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {cliente.nome}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-sm font-mono">
                        {cliente.telefone ?? "—"}
                      </TableCell>
                      <TableCell className="max-w-[260px] truncate px-4 py-3 text-sm text-muted-foreground">
                        {cliente.endereco ?? "—"}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Editar ${cliente.nome}`}
                              onClick={() => abrirEdicao(cliente)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Excluir ${cliente.nome}`}
                              onClick={() => setDeletar(cliente)}
                            >
                              <Trash2Icon className="size-4" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>

      {formOpen && (
        <ClienteForm
          key={clienteEdicao?.id ?? "novo"}
          open={formOpen}
          onOpenChange={setFormOpen}
          cliente={clienteEdicao}
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
              Tem certeza que deseja excluir <strong>{deletar?.nome}</strong>? Esta
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
