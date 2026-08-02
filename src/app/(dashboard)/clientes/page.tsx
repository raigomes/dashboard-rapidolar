import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ClientesTabela } from "@/components/clientes/clientes-tabela";
import type { Cliente } from "@/types/cliente";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const params = await searchParams;
  const busca = (params.q ?? "").trim();

  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

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

  const base = supabase
    .from("clientes")
    .select("*")
    .order("nome")
    .limit(200);

  const { data } = busca
    ? await base.ilike("nome", `%${busca}%`)
    : await base;

  const clientes = (data ?? []) as unknown as Cliente[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Clientes</h1>
      <ClientesTabela clientes={clientes} isAdmin={isAdmin} />
    </div>
  );
}
