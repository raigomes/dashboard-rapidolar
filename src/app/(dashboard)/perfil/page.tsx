import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { EditarNome } from "@/components/perfil/editar-nome";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ProfileCargo } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";

export default async function PerfilPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("nome, email, cargo")
    .eq("id", user.id)
    .maybeSingle();

  const nome = (profile?.nome as string | undefined) || user.email || "Usuário";
  const email = (profile?.email as string | undefined) || user.email || "";
  const cargo: ProfileCargo =
    (profile?.cargo as ProfileCargo | undefined) ?? "vendedor";

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Perfil</h1>
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Meus dados</CardTitle>
          <CardDescription>
            Informações da sua conta RapidoLar.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-xs font-medium text-muted-foreground">
                Nome
              </p>
              <p className="text-sm font-medium">{nome}</p>
            </div>
            {cargo === "admin" && <EditarNome nome={nome} />}
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">
              E-mail
            </p>
            <p className="text-sm font-medium">{email}</p>
          </div>
          <div className="space-y-0.5">
            <p className="text-xs font-medium text-muted-foreground">Cargo</p>
            <Badge variant={cargo === "admin" ? "default" : "secondary"}>
              {cargo === "admin" ? "Administrador" : "Vendedor"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
