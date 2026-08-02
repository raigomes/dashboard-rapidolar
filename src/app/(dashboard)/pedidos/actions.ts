"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { STATUS_PEDIDO, type PedidoInput } from "@/types/pedido";
import { createClient } from "@/utils/supabase/server";

const itemSchema = z.object({
  produto_id: z.uuid("Produto inválido."),
  qtd: z.coerce.number().int("Quantidade inválida.").positive("Quantidade deve ser maior que zero."),
  preco_unit: z.coerce.number().positive("Preço deve ser maior que zero."),
});

const pedidoSchema = z.object({
  cliente_id: z.uuid("Cliente inválido."),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
  status: z.enum(STATUS_PEDIDO, "Status inválido."),
  itens: z.array(itemSchema).min(1, "Adicione ao menos um item ao pedido."),
});

export type ActionResult = { ok?: boolean; error?: string };

async function requireUser(
  supabase: ReturnType<typeof createClient>,
): Promise<
  { ok: true; userId: string; isAdmin: boolean } | { ok: false; error: string }
> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("cargo")
    .eq("id", user.id)
    .maybeSingle();
  const isAdmin = profile?.cargo === "admin";

  return { ok: true, userId: user.id, isAdmin };
}

function calcTotal(itens: z.infer<typeof pedidoSchema>["itens"]): number {
  return itens.reduce((acc, item) => acc + item.qtd * item.preco_unit, 0);
}

export async function createPedido(input: PedidoInput): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireUser(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = pedidoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const total = calcTotal(parsed.data.itens);

  const { data: pedido, error: pedidoError } = await supabase
    .from("pedidos")
    .insert({
      cliente_id: parsed.data.cliente_id,
      data: parsed.data.data,
      status: parsed.data.status,
      total,
      created_by: check.userId,
    })
    .select("id")
    .single();

  if (pedidoError || !pedido) {
    return { error: pedidoError?.message ?? "Erro ao criar pedido." };
  }

  const { error: itensError } = await supabase.from("pedido_itens").insert(
    parsed.data.itens.map((item) => ({
      pedido_id: pedido.id,
      produto_id: item.produto_id,
      qtd: item.qtd,
      preco_unit: item.preco_unit,
    })),
  );

  if (itensError) {
    // Rollback: remove pedido recém-criado (policy delete_own_or_admin permite
    // ao dono excluir o próprio pedido; admin sempre). Erro aqui é raro e o
    // pedido órfão sem itens é preferível a retornar sucesso com dados errados.
    await supabase.from("pedidos").delete().eq("id", pedido.id);
    return { error: itensError.message };
  }

  revalidatePath("/pedidos");
  return { ok: true };
}

export async function updatePedido(
  id: string,
  input: PedidoInput,
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireUser(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = pedidoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { data: existente } = await supabase
    .from("pedidos")
    .select("created_by")
    .eq("id", id)
    .maybeSingle();

  if (!existente) return { error: "Pedido não encontrado." };
  if (!check.isAdmin && existente.created_by !== check.userId) {
    return { error: "Você só pode editar os próprios pedidos." };
  }

  const total = calcTotal(parsed.data.itens);

  const { error: updateError } = await supabase
    .from("pedidos")
    .update({
      cliente_id: parsed.data.cliente_id,
      data: parsed.data.data,
      status: parsed.data.status,
      total,
    })
    .eq("id", id);

  if (updateError) return { error: updateError.message };

  const itens = parsed.data.itens.map((item) => ({
    pedido_id: id,
    produto_id: item.produto_id,
    qtd: item.qtd,
    preco_unit: item.preco_unit,
  }));

  // Substituição total: delete + insert. A policy delete_own_via_parent
  // (migration 00002) permite ao dono excluir itens do próprio pedido;
  // admin sempre. Isso evita dessincronização quando itens são removidos.
  const { error: delError } = await supabase
    .from("pedido_itens")
    .delete()
    .eq("pedido_id", id);
  if (delError) return { error: delError.message };

  const { error: insError } = await supabase
    .from("pedido_itens")
    .insert(itens);
  if (insError) return { error: insError.message };

  revalidatePath("/pedidos");
  return { ok: true };
}

export async function deletePedido(id: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireUser(supabase);
  if (!check.ok) return { error: check.error };

  const { data: existente } = await supabase
    .from("pedidos")
    .select("created_by")
    .eq("id", id)
    .maybeSingle();

  if (!existente) return { error: "Pedido não encontrado." };
  if (!check.isAdmin && existente.created_by !== check.userId) {
    return { error: "Você só pode excluir os próprios pedidos." };
  }

  const { error } = await supabase.from("pedidos").delete().eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/pedidos");
  return { ok: true };
}
