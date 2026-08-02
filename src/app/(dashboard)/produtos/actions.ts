"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { mensagemErroDelete } from "@/lib/db-errors";
import { CATEGORIAS_PRODUTO } from "@/types/produto";
import { createClient } from "@/utils/supabase/server";

const produtoSchema = z.object({
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

export type ProdutoInput = z.infer<typeof produtoSchema>;

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

export async function createProduto(input: ProdutoInput): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = produtoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { error } = await supabase.from("produtos").insert({
    nome: parsed.data.nome,
    categoria: parsed.data.categoria,
    preco: parsed.data.preco,
    estoque: parsed.data.estoque,
  });

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { ok: true };
}

export async function updateProduto(
  id: string,
  input: ProdutoInput,
): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const parsed = produtoSchema.safeParse(input);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Dados inválidos." };
  }

  const { error } = await supabase
    .from("produtos")
    .update({
      nome: parsed.data.nome,
      categoria: parsed.data.categoria,
      preco: parsed.data.preco,
      estoque: parsed.data.estoque,
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/produtos");
  return { ok: true };
}

export async function deleteProduto(id: string): Promise<ActionResult> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const check = await requireAdmin(supabase);
  if (!check.ok) return { error: check.error };

  const { error } = await supabase.from("produtos").delete().eq("id", id);

  if (error) return { error: mensagemErroDelete(error) };

  revalidatePath("/produtos");
  return { ok: true };
}
