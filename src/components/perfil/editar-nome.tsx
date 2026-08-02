"use client";

import { useActionState, useEffect, useState } from "react";
import { Loader2Icon, PencilIcon } from "lucide-react";
import { toast } from "sonner";

import { updateNome } from "@/app/(dashboard)/perfil/actions";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function EditarNome({ nome }: { nome: string }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(nome);
  const [state, formAction, isPending] = useActionState(updateNome, {});

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    } else if (state?.ok) {
      toast.success("Nome atualizado com sucesso!");
    }
  }, [state]);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setValue(nome);
      }}
    >
      <DialogTrigger render={<Button variant="outline" className="gap-1.5" />}>
        <PencilIcon className="size-4" />
        Editar nome
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar nome</DialogTitle>
          <DialogDescription>
            Atualize seu nome de exibição no painel.
          </DialogDescription>
        </DialogHeader>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome</Label>
            <Input
              id="nome"
              name="nome"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={100}
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2Icon className="animate-spin" />}
              Salvar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
