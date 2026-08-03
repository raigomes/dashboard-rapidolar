import { cookies } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldAlertIcon } from "lucide-react";

import { RelatorioForm } from "@/components/relatorios/relatorio-form";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function RelatoriosPage() {
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

  if (profile?.cargo !== "admin") {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
        <Card className="shadow-sm">
          <CardContent className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <ShieldAlertIcon className="size-12 text-muted-foreground opacity-40" />
            <div className="space-y-1">
              <p className="text-lg font-semibold">Acesso restrito</p>
              <p className="text-sm text-muted-foreground">
                Esta página é restrita a administradores.
              </p>
            </div>
            <Link
              href="/dashboard"
              className={buttonVariants({ variant: "outline" })}
            >
              Voltar ao Dashboard
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
      <RelatorioForm />
    </div>
  );
}
