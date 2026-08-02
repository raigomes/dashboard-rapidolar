import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { DashboardShell } from "@/components/layout/dashboard-shell";
import type { ProfileCargo } from "@/types/profile";
import { createClient } from "@/utils/supabase/server";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

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
    <DashboardShell profile={{ nome, email, cargo }}>
      {children}
    </DashboardShell>
  );
}
