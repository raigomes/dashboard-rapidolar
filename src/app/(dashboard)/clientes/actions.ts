"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { mensagemErroDelete } from "@/lib/db-errors";
import { createClient } from "@/utils/supabase/server";

const clienteSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome do cliente.")
    .max(120, "Máximo de 120 caracteres."),
  telefone: z
    .string()
    .trim()
    .regex(/^$|^\(\d{2}\) \d{4,5}-\d{4}$/, "Formato: (11) 91234-5678")
    .optional(),
  endereco: z.string().trim().max(500, "Máximo de 500 caracteres.").optional(),
});

export type ClienteInput = z.infer<typeof clienteSchema>;

export type ActionResult = { ok?: boolean; error?: string };

async function requireAdmin(
  supabase: ReturnType<typeof createClient>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("cargo")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.cargo !== "admin") {
    return { ok: false, error: "Apenas administradores podem realizar esta ação." };
  }
  return { ok: true };
}

function toDbValues(data: z.infer<typeof clienteSchema>) {
  return {
    nome: data.nome,
    telefone: data.telefone || null,
    endereco: data.endereco || null,
  };
}

export async function createCliente(input: ClienteInput): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { error } = await supabase.from("clientes").insert(toDbValues(parsed.data));

  if (error) return { error: error.message };

  revalidatePath("/clientes");
  return { ok: true };
}

export async function updateCliente(
  id: string,
  input: ClienteInput,
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = clienteSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { error } = await supabase
    .from("clientes")
    .update(toDbValues(parsed.data))
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/clientes");
  return { ok: true };
}

export async function deleteCliente(id: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const { error } = await supabase.from("clientes").delete().eq("id", id);

  if (error) return { error: mensagemErroDelete(error) };

  revalidatePath("/clientes");
  return { ok: true };
}
