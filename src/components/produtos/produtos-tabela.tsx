"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PackageIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { deleteProduto } from "@/app/(dashboard)/produtos/actions";
import { ProdutoForm } from "@/components/produtos/produto-form";
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
import { Badge } from "@/components/ui/badge";
import { formatCategoria, formatCurrency, formatInteger } from "@/lib/format";
import type { Produto } from "@/types/produto";

export function ProdutosTabela({
  produtos,
  isAdmin,
}: {
  produtos: Produto[];
  isAdmin: boolean;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [busca, setBusca] = useState(searchParams.get("q") ?? "");
  const [formOpen, setFormOpen] = useState(false);
  const [produtoEdicao, setProdutoEdicao] = useState<Produto | null>(null);
  const [deletar, setDeletar] = useState<Produto | null>(null);
  const [excluindo, setExcluindo] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (busca) {
        params.set("q", busca);
      } else {
        params.delete("q");
      }
      router.replace(`/produtos?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
  }, [busca, searchParams, router]);

  const abrirNovo = () => {
    setProdutoEdicao(null);
    setFormOpen(true);
  };

  const abrirEdicao = (produto: Produto) => {
    setProdutoEdicao(produto);
    setFormOpen(true);
  };

  const confirmarExclusao = async () => {
    if (!deletar) return;
    setExcluindo(true);
    const res = await deleteProduto(deletar.id);
    setExcluindo(false);
    if (res?.error) {
      toast.error(res.error);
    } else {
      toast.success("Produto excluído com sucesso!");
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
            aria-label="Buscar produtos"
          />
        </div>
        {isAdmin && (
          <Button onClick={abrirNovo} className="gap-1.5">
            <PlusIcon className="size-4" />
            Novo Produto
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
                    Categoria
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Preço
                  </TableHead>
                  <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Estoque
                  </TableHead>
                  {isAdmin && (
                    <TableHead className="bg-muted/50 px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      Ações
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {produtos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={isAdmin ? 5 : 4} className="px-4 py-16 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <PackageIcon className="size-10 text-muted-foreground opacity-40" />
                        <p className="mt-2 text-lg font-semibold">Nenhum produto encontrado</p>
                        <p className="text-sm text-muted-foreground">
                          {busca
                            ? "Ajuste a busca ou tente outro termo."
                            : "Cadastre seu primeiro produto para começar a vender."}
                        </p>
                        {isAdmin && !busca && (
                          <Button onClick={abrirNovo} className="mt-3 gap-1.5">
                            <PlusIcon className="size-4" />
                            Novo Produto
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  produtos.map((produto) => (
                    <TableRow key={produto.id} className="border-b hover:bg-muted/30">
                      <TableCell className="px-4 py-3 text-sm font-medium">
                        {produto.nome}
                      </TableCell>
                      <TableCell className="px-4 py-3">
                        <Badge variant="outline" className="text-xs">
                          {formatCategoria(produto.categoria)}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatCurrency(produto.preco)}
                      </TableCell>
                      <TableCell className="px-4 py-3 text-right text-sm">
                        {formatInteger(produto.estoque)}
                      </TableCell>
                      {isAdmin && (
                        <TableCell className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Editar ${produto.nome}`}
                              onClick={() => abrirEdicao(produto)}
                            >
                              <PencilIcon className="size-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Excluir ${produto.nome}`}
                              onClick={() => setDeletar(produto)}
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
        <ProdutoForm
          key={produtoEdicao?.id ?? "novo"}
          open={formOpen}
          onOpenChange={setFormOpen}
          produto={produtoEdicao}
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
