"use client";

import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SheetTrigger } from "@/components/ui/sheet";

import { UserNav } from "@/components/layout/user-nav";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/produtos": "Produtos",
  "/clientes": "Clientes",
  "/pedidos": "Pedidos",
  "/relatorios": "Relatórios",
  "/perfil": "Perfil",
};

export function Header({ nome, email }: { nome: string; email: string }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "RapidoLar";

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b border-border bg-background px-4 md:px-6">
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-label="Abrir menu"
          />
        }
      >
        <MenuIcon className="size-5" />
      </SheetTrigger>
      <p className="text-base font-semibold">{title}</p>
      <div className="ml-auto">
        <UserNav nome={nome} email={email} />
      </div>
    </header>
  );
}
