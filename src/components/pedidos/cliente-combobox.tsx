"use client";

import { useState } from "react";
import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { ClienteOption } from "@/types/cliente";

export function ClienteCombobox({
  value,
  onChange,
  clientes,
}: {
  value: string;
  onChange: (value: string) => void;
  clientes: ClienteOption[];
}) {
  const [open, setOpen] = useState(false);

  const selecionado = clientes.find((c) => c.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        render={
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between font-normal"
          >
            {selecionado?.nome ?? "Selecione o cliente"}
            <ChevronsUpDownIcon className="size-4 shrink-0 opacity-50" />
          </Button>
        }
      />
      <PopoverContent align="start" className="w-(--anchor-width) p-0">
        <Command>
          <CommandInput placeholder="Buscar cliente…" />
          <CommandList>
            <CommandEmpty>Nenhum cliente encontrado.</CommandEmpty>
            <CommandGroup>
              {clientes.map((cliente) => (
                <CommandItem
                  key={cliente.id}
                  value={cliente.nome}
                  data-checked={cliente.id === value}
                  onSelect={() => {
                    onChange(cliente.id);
                    setOpen(false);
                  }}
                >
                  {cliente.nome}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
