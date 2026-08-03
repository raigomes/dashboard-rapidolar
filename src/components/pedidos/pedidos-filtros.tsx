"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { XIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ClienteOption } from "@/types/cliente";
import { formatStatus } from "@/lib/format";

const STATUS_FILTRO = ["pendente", "confirmado", "entregue", "cancelado"];

export function PedidosFiltros({ clientes }: { clientes: ClienteOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [dataInicio, setDataInicio] = useState(searchParams.get("data_inicio") ?? "");
  const [dataFim, setDataFim] = useState(searchParams.get("data_fim") ?? "");
  const clienteId = searchParams.get("cliente_id") ?? "";
  const status = searchParams.get("status") ?? "";

  const atualizar = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page");
    router.replace(`/pedidos?${params.toString()}`, { scroll: false });
  };

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (dataInicio) params.set("data_inicio", dataInicio);
    else params.delete("data_inicio");
    if (dataFim) params.set("data_fim", dataFim);
    else params.delete("data_fim");
    params.delete("page");

    const timer = setTimeout(() => {
      router.replace(`/pedidos?${params.toString()}`, { scroll: false });
    }, 300);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataInicio, dataFim]);

  const temFiltros =
    Boolean(dataInicio) ||
    Boolean(dataFim) ||
    Boolean(clienteId) ||
    Boolean(status);

  const limpar = () => {
    setDataInicio("");
    setDataFim("");
    router.replace("/pedidos", { scroll: false });
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        type="date"
        value={dataInicio}
        onChange={(e) => setDataInicio(e.target.value)}
        className="w-[140px]"
        aria-label="Data início"
      />
      <Input
        type="date"
        value={dataFim}
        onChange={(e) => setDataFim(e.target.value)}
        className="w-[140px]"
        aria-label="Data fim"
      />
      <Select
        value={clienteId}
        onValueChange={(value) => atualizar("cliente_id", String(value ?? ""))}
      >
        <SelectTrigger className="w-[180px]" aria-label="Filtrar por cliente">
          <SelectValue placeholder="Todos os clientes">
            {(value) =>
              value
                ? clientes.find((c) => c.id === value)?.nome ??
                  "Todos os clientes"
                : "Todos os clientes"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os clientes</SelectItem>
          {clientes.map((cliente) => (
            <SelectItem key={cliente.id} value={cliente.id}>
              {cliente.nome}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        value={status}
        onValueChange={(value) => atualizar("status", String(value ?? ""))}
      >
        <SelectTrigger className="w-[150px]" aria-label="Filtrar por status">
          <SelectValue placeholder="Todos os status">
            {(value) =>
              value
                ? formatStatus(String(value))
                : "Todos os status"
            }
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Todos os status</SelectItem>
          {STATUS_FILTRO.map((s) => (
            <SelectItem key={s} value={s}>
              {formatStatus(s)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {temFiltros && (
        <Button variant="ghost" size="sm" onClick={limpar} className="gap-1.5">
          <XIcon className="size-4" />
          Limpar
        </Button>
      )}
    </div>
  );
}
