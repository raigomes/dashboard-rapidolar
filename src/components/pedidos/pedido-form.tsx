"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2Icon, PlusIcon, Trash2Icon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

import { createPedido, updatePedido } from "@/app/(dashboard)/pedidos/actions";
import { ClienteCombobox } from "@/components/pedidos/cliente-combobox";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency, formatStatus, toISODate } from "@/lib/format";
import type { ClienteOption } from "@/types/cliente";
import type { Pedido } from "@/types/pedido";
import type { ProdutoOption } from "@/types/produto";
import { createClient } from "@/utils/supabase/client";

const STATUS_OPCOES = ["pendente", "confirmado", "entregue", "cancelado"];

const payloadSchema = z.object({
  cliente_id: z.uuid("Selecione um cliente."),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Informe a data do pedido."),
  status: z.enum(STATUS_OPCOES, "Status inválido."),
  itens: z
    .array(
      z.object({
        produto_id: z.uuid("Selecione o produto do item."),
        qtd: z.coerce.number().int().positive("Quantidade deve ser maior que zero."),
        preco_unit: z.coerce
          .number()
          .positive("Preço deve ser maior que zero."),
      }),
    )
    .min(1, "Adicione ao menos um item com produto, quantidade e preço válidos."),
});

type ItemForm = {
  produto_id: string;
  qtd: string;
  preco_unit: string;
};

export function PedidoForm({
  open,
  onOpenChange,
  pedido,
  clientes,
  produtos,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pedido: Pedido | null;
  clientes: ClienteOption[];
  produtos: ProdutoOption[];
}) {
  const router = useRouter();
  const [clienteId, setClienteId] = useState(pedido?.cliente_id ?? "");
  const [data, setData] = useState(pedido?.data ?? toISODate(new Date()));
  const [status, setStatus] = useState(pedido?.status ?? "pendente");
  const [itens, setItens] = useState<ItemForm[]>(
    pedido
      ? []
      : [{ produto_id: "", qtd: "1", preco_unit: "" }],
  );
  const [carregandoItens, setCarregandoItens] = useState(Boolean(pedido));
  const [erro, setErro] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!pedido) return;

    let cancelled = false;
    const supabase = createClient();
    supabase
      .from("pedido_itens")
      .select("produto_id, qtd, preco_unit")
      .eq("pedido_id", pedido.id)
      .then(({ data: itensData, error }) => {
        if (cancelled) return;
        setCarregandoItens(false);
        if (error) {
          setErro(error.message);
          return;
        }
        const rows = (itensData ?? []) as {
          produto_id: string;
          qtd: number;
          preco_unit: number;
        }[];
        setItens(
          rows.map((r) => ({
            produto_id: r.produto_id,
            qtd: String(r.qtd),
            preco_unit: String(r.preco_unit),
          })),
        );
      });

    return () => {
      cancelled = true;
    };
  }, [pedido]);

  const setItem = (index: number, field: keyof ItemForm, value: string) => {
    setItens((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const onSelectProduto = (index: number, produtoId: string) => {
    const produto = produtos.find((p) => p.id === produtoId);
    setItens((prev) =>
      prev.map((item, i) =>
        i === index
          ? {
              ...item,
              produto_id: produtoId,
              preco_unit: produto ? String(produto.preco) : item.preco_unit,
            }
          : item,
      ),
    );
  };

  const adicionarItem = () => {
    setItens((prev) => [...prev, { produto_id: "", qtd: "1", preco_unit: "" }]);
  };

  const removerItem = (index: number) => {
    setItens((prev) => prev.filter((_, i) => i !== index));
  };

  const subtotal = (item: ItemForm) =>
    (Number(item.qtd) || 0) * (Number(item.preco_unit) || 0);

  const total = itens.reduce((acc, item) => acc + subtotal(item), 0);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro(null);

    const validos = itens
      .filter((item) => item.produto_id.trim() !== "")
      .map((item) => ({
        produto_id: item.produto_id,
        qtd: item.qtd,
        preco_unit: item.preco_unit,
      }));

    const parsed = payloadSchema.safeParse({
      cliente_id: clienteId,
      data,
      status,
      itens: validos,
    });
    if (!parsed.success) {
      const message =
        parsed.error.issues[0]?.message ?? "Verifique os dados do pedido.";
      setErro(message);
      toast.error(message);
      return;
    }

    setSubmitting(true);
    const res = pedido
      ? await updatePedido(pedido.id, parsed.data)
      : await createPedido(parsed.data);
    setSubmitting(false);

    if (res?.error) {
      setErro(res.error);
      toast.error(res.error);
      return;
    }

    toast.success(
      pedido ? "Pedido atualizado com sucesso!" : "Pedido criado com sucesso!",
    );
    onOpenChange(false);
    router.refresh();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>{pedido ? "Editar Pedido" : "Novo Pedido"}</DialogTitle>
          <DialogDescription>
            {pedido
              ? "Atualize os dados e itens do pedido."
              : "Preencha os dados do pedido e adicione os itens."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Cliente</Label>
              <ClienteCombobox
                value={clienteId}
                onChange={setClienteId}
                clientes={clientes}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="data">Data</Label>
                <Input
                  id="data"
                  type="date"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={status}
                  onValueChange={(value) => setStatus(String(value ?? "pendente"))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Status">
                      {(value) =>
                        value
                          ? formatStatus(String(value))
                          : "Status"
                      }
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPCOES.map((s) => (
                      <SelectItem key={s} value={s}>
                        {formatStatus(s)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Itens do Pedido</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={adicionarItem}
                className="gap-1.5"
              >
                <PlusIcon className="size-4" />
                Adicionar Item
              </Button>
            </div>

            <div className="overflow-x-auto rounded-lg border">
              <div className="min-w-[420px]">
                {carregandoItens ? (
                  <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                    <Loader2Icon className="animate-spin" />
                    Carregando itens…
                  </div>
                ) : itens.length === 0 ? (
                  <p className="px-4 py-6 text-center text-sm text-muted-foreground">
                    Nenhum item adicionado.
                  </p>
                ) : (
                  <div className="divide-y">
                    <div className="grid grid-cols-[1fr_64px_100px_100px_36px] items-center gap-2 bg-muted/50 px-3 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                      <span>Produto</span>
                      <span className="text-right">Qtd</span>
                      <span className="text-right">Preço</span>
                      <span className="text-right">Subtotal</span>
                      <span />
                    </div>
                    {itens.map((item, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-[1fr_64px_100px_100px_36px] items-center gap-2 px-3 py-2"
                      >
                        <Select
                          value={item.produto_id}
                          onValueChange={(value) =>
                            onSelectProduto(index, String(value ?? ""))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Produto">
                              {(value) =>
                                value
                                  ? produtos.find(
                                      (p) => p.id === value,
                                    )?.nome ?? "Produto"
                                  : "Produto"
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {produtos.map((produto) => (
                              <SelectItem key={produto.id} value={produto.id}>
                                {produto.nome}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="number"
                          min="1"
                          step="1"
                          value={item.qtd}
                          onChange={(e) => setItem(index, "qtd", e.target.value)}
                          className="text-right"
                          aria-label={`Quantidade do item ${index + 1}`}
                        />
                        <Input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={item.preco_unit}
                          onChange={(e) =>
                            setItem(index, "preco_unit", e.target.value)
                          }
                          className="text-right"
                          aria-label={`Preço do item ${index + 1}`}
                        />
                        <span className="text-right text-sm tabular-nums">
                          {formatCurrency(subtotal(item))}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          aria-label={`Remover item ${index + 1}`}
                          onClick={() => removerItem(index)}
                        >
                          <Trash2Icon className="size-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-3">
            <div className="text-sm text-muted-foreground">Total</div>
            <div className="text-lg font-bold text-right">
              {formatCurrency(total)}
            </div>
          </div>

          {erro && <p className="text-sm text-destructive">{erro}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting || carregandoItens}>
              {submitting && <Loader2Icon className="animate-spin" />}
              {submitting ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
