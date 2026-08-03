"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { createProduto, updateProduto } from "@/app/(dashboard)/produtos/actions";
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
import { toastError } from "@/lib/toast";
import { CATEGORIAS_PRODUTO, type Produto } from "@/types/produto";

const schema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome do produto.")
    .max(120, "Máximo de 120 caracteres."),
  categoria: z.enum(CATEGORIAS_PRODUTO, "Categoria inválida."),
  preco: z.coerce.number().positive("O preço deve ser maior que zero."),
  estoque: z.coerce
    .number()
    .int("O estoque deve ser um número inteiro.")
    .min(0, "O estoque não pode ser negativo."),
});

type FormValues = {
  nome: string;
  preco: string;
  estoque: string;
};

const CATEGORIA_OPTIONS: Record<string, string> = {
  limpeza: "Limpeza",
  "descartáveis": "Descartáveis",
  higiene: "Higiene",
  alimentos: "Alimentos",
  bebidas: "Bebidas",
};

export function ProdutoForm({
  open,
  onOpenChange,
  produto,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  produto: Produto | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [categoria, setCategoria] = useState(produto?.categoria ?? "limpeza");
  const [categoriaErro, setCategoriaErro] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nome: produto?.nome ?? "",
      preco: produto ? String(produto.preco) : "",
      estoque: produto ? String(produto.estoque) : "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setCategoriaErro(null);
    const parsed = schema.safeParse({
      ...values,
      categoria,
    });
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "nome" || field === "preco" || field === "estoque") {
          setError(field, { message: issue.message });
        } else if (field === "categoria") {
          setCategoriaErro(issue.message);
        }
      }
      return;
    }

    setSubmitting(true);
    const res = produto
      ? await updateProduto(produto.id, parsed.data)
      : await createProduto(parsed.data);
    setSubmitting(false);

    if (res?.error) {
      toastError(res.error);
      return;
    }

    toast.success(
      produto ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
    );
    onOpenChange(false);
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{produto ? "Editar Produto" : "Novo Produto"}</DialogTitle>
          <DialogDescription>
            {produto
              ? "Atualize as informações do produto."
              : "Cadastre um novo produto no catálogo."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex.: Detergente Neutro 500ml"
              aria-invalid={errors.nome ? true : undefined}
              className={errors.nome ? "border-destructive" : undefined}
              {...register("nome")}
            />
            {errors.nome && (
              <p role="alert" className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={categoria}
              onValueChange={(value) => {
                setCategoria(String(value ?? "limpeza"));
                setCategoriaErro(null);
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecione a categoria">
                  {(value) =>
                    value
                      ? CATEGORIA_OPTIONS[String(value) as keyof typeof CATEGORIA_OPTIONS] ??
                        "Selecione a categoria"
                      : "Selecione a categoria"
                  }
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {CATEGORIAS_PRODUTO.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORIA_OPTIONS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoriaErro && (
              <p role="alert" className="text-xs text-destructive">{categoriaErro}</p>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="preco">Preço (R$)</Label>
              <Input
                id="preco"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0,00"
                aria-invalid={errors.preco ? true : undefined}
                className={errors.preco ? "border-destructive" : undefined}
                {...register("preco")}
              />
              {errors.preco && (
                <p role="alert" className="text-xs text-destructive">{errors.preco.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="estoque">Estoque</Label>
              <Input
                id="estoque"
                type="number"
                step="1"
                min="0"
                placeholder="0"
                aria-invalid={errors.estoque ? true : undefined}
                className={errors.estoque ? "border-destructive" : undefined}
                {...register("estoque")}
              />
              {errors.estoque && (
                <p role="alert" className="text-xs text-destructive">{errors.estoque.message}</p>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting && <Loader2Icon className="animate-spin" />}
              {submitting ? "Salvando…" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
