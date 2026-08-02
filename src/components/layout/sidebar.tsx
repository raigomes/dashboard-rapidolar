"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  PackageIcon,
  ShoppingCartIcon,
  SprayCanIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProfileCargo } from "@/types/profile";
import { createClient } from "@/utils/supabase/client";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  adminOnly?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboardIcon },
  { href: "/produtos", label: "Produtos", icon: PackageIcon },
  { href: "/clientes", label: "Clientes", icon: UsersIcon },
  { href: "/pedidos", label: "Pedidos", icon: ShoppingCartIcon },
  {
    href: "/relatorios",
    label: "Relatórios",
    icon: FileTextIcon,
    adminOnly: true,
  },
];

export function Sidebar({
  cargo,
  onNavigate,
}: {
  cargo: ProfileCargo;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex h-14 shrink-0 items-center gap-2.5 px-4">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10">
          <SprayCanIcon className="size-[18px] text-primary" />
        </div>
        <span className="text-lg font-bold tracking-tight">RapidoLar</span>
      </div>

      <nav className="flex-1 space-y-1 py-2">
        {NAV_ITEMS.filter((item) => !item.adminOnly || cargo === "admin").map(
          (item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "mx-2 flex items-center gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground",
                  active &&
                    "bg-primary/10 font-semibold text-primary hover:bg-primary/10 hover:text-primary",
                )}
              >
                <item.icon className="size-[18px]" />
                {item.label}
              </Link>
            );
          },
        )}
      </nav>

      <div className="mt-auto p-2 pb-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleLogout}
          className="h-auto w-full items-center justify-start gap-3 rounded-md px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOutIcon className="size-[18px]" />
          Sair
        </Button>
      </div>
    </div>
  );
}
