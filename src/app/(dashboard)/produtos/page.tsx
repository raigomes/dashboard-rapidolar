import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { ProdutosTabela } from "@/components/produtos/produtos-tabela";
import type { Produto } from "@/types/produto";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function ProdutosPage({
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
    .from("produtos")
    .select("*")
    .order("nome")
    .limit(200);

  const { data } = busca
    ? await base.ilike("nome", `%${busca}%`)
    : await base;

  const produtos = (data ?? []) as unknown as Produto[];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Produtos</h1>
      <ProdutosTabela produtos={produtos} isAdmin={isAdmin} />
    </div>
  );
}
