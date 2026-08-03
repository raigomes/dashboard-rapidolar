"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2Icon } from "lucide-react";
import { toast } from "sonner";

import { createCliente, updateCliente } from "@/app/(dashboard)/clientes/actions";
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
import { Textarea } from "@/components/ui/textarea";
import { toastError } from "@/lib/toast";
import type { Cliente } from "@/types/cliente";

const schema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome do cliente.")
    .max(120, "Máximo de 120 caracteres."),
  telefone: z
    .string()
    .trim()
    .regex(/^$|^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato: (11) 91234-5678"),
  endereco: z.string().trim().max(500, "Máximo de 500 caracteres."),
});

type FormValues = z.infer<typeof schema>;

export function ClienteForm({
  open,
  onOpenChange,
  cliente,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: Cliente | null;
}) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      nome: cliente?.nome ?? "",
      telefone: cliente?.telefone ?? "",
      endereco: cliente?.endereco ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      for (const issue of parsed.error.issues) {
        const field = issue.path[0];
        if (field === "nome" || field === "telefone" || field === "endereco") {
          setError(field, { message: issue.message });
        }
      }
      return;
    }

    setSubmitting(true);
    const res = cliente
      ? await updateCliente(cliente.id, parsed.data)
      : await createCliente(parsed.data);
    setSubmitting(false);

    if (res?.error) {
      toastError(res.error);
      return;
    }

    toast.success(
      cliente ? "Cliente atualizado com sucesso!" : "Cliente criado com sucesso!",
    );
    onOpenChange(false);
    router.refresh();
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{cliente ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
          <DialogDescription>
            {cliente
              ? "Atualize as informações do cliente."
              : "Cadastre um novo cliente."}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              placeholder="Ex.: João da Silva"
              aria-invalid={errors.nome ? true : undefined}
              className={errors.nome ? "border-destructive" : undefined}
              {...register("nome")}
            />
            {errors.nome && (
              <p role="alert" className="text-xs text-destructive">{errors.nome.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              placeholder="(11) 91234-5678"
              maxLength={16}
              autoComplete="tel"
              aria-invalid={errors.telefone ? true : undefined}
              className={
                errors.telefone ? "border-destructive font-mono" : "font-mono"
              }
              {...register("telefone")}
            />
            {errors.telefone && (
              <p role="alert" className="text-xs text-destructive">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="endereco">Endereço</Label>
            <Textarea
              id="endereco"
              placeholder="Rua, número, bairro, cidade..."
              maxLength={500}
              aria-invalid={errors.endereco ? true : undefined}
              className={errors.endereco ? "border-destructive" : undefined}
              {...register("endereco")}
            />
            {errors.endereco && (
              <p role="alert" className="text-xs text-destructive">{errors.endereco.message}</p>
            )}
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
