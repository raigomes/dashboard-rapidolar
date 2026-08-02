"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const nomeSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(1, "Informe o nome.")
    .max(100, "Máximo de 100 caracteres."),
});

export type UpdateNomeState = { ok?: boolean; error?: string };

export async function updateNome(
  _prevState: UpdateNomeState,
  formData: FormData,
): Promise<UpdateNomeState> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const parsed = nomeSchema.safeParse({ nome: formData.get("nome") });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Nome inválido." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("cargo")
    .eq("id", user.id)
    .maybeSingle();

  if (profile?.cargo !== "admin") {
    return { error: "Apenas administradores podem editar o perfil." };
  }

  const { error } = await supabase
    .from("profiles")
    .update({ nome: parsed.data.nome })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/perfil");
  return { ok: true };
}
