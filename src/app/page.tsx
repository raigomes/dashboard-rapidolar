import Link from "next/link";
import {
  FileTextIcon,
  LayoutDashboardIcon,
  PackageIcon,
  ShoppingCartIcon,
  UsersIcon,
  type LucideIcon,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

const FEATURES: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: LayoutDashboardIcon,
    title: "Dashboard",
    description: "Métricas, gráficos e rankings de vendas em um só lugar.",
  },
  {
    icon: PackageIcon,
    title: "Produtos",
    description: "Catálogo completo com preços e controle de estoque.",
  },
  {
    icon: UsersIcon,
    title: "Clientes",
    description: "Cadastro de clientes com histórico de compras.",
  },
  {
    icon: ShoppingCartIcon,
    title: "Pedidos",
    description: "Registre pedidos com múltiplos itens e status.",
  },
  {
    icon: FileTextIcon,
    title: "Relatórios",
    description: "Exporte relatórios em PDF com os principais indicadores.",
  },
];

export default function Page() {
  return (
    <main className="flex min-h-screen flex-col bg-background">
      <nav className="flex h-[72px] items-center justify-between border-b border-border bg-card px-6 md:px-10">
        <Logo size="md" href="/" />
        <Link href="/login" className={buttonVariants({ size: "lg" })}>
          Entrar
        </Link>
      </nav>

      <section className="flex flex-col items-center px-4 py-16 text-center md:py-24">
        <span className="inline-flex items-center rounded-full bg-secondary px-4 py-1.5 text-xs font-medium text-secondary-foreground">
          Para distribuidoras de limpeza e descartáveis
        </span>
        <h1 className="animate-fade-up mt-6 max-w-3xl text-4xl font-bold tracking-tight text-foreground md:text-5xl">
          Vendas da RapidoLar em um só painel
        </h1>
        <p className="animate-fade-up mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
          Acompanhe faturamento, produtos, clientes e pedidos — e exporte
          relatórios em PDF.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
          >
            Entrar no painel
          </Link>
          <a
            href="#funcionalidades"
            className={cn(
              buttonVariants({ variant: "outline", size: "lg" }),
              "w-full sm:w-auto",
            )}
          >
            Conhecer o painel
          </a>
        </div>
      </section>

      <section id="funcionalidades" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center text-3xl font-bold tracking-tight">
            Tudo o que sua distribuidora precisa
          </h2>
          <p className="mt-2 text-center text-sm text-muted-foreground md:text-base">
            Uma visão completa do seu negócio, do estoque ao faturamento.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-6">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="w-full rounded-lg gap-0 p-0 shadow-sm transition-shadow hover:shadow-md sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="flex h-full flex-col p-6">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground"
                      aria-hidden="true"
                    >
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 pb-16 md:pb-24">
        <div className="mx-auto max-w-6xl">
          <div className="rounded-xl bg-primary px-6 py-10 text-center md:py-12">
            <h2 className="text-2xl font-bold text-primary-foreground md:text-3xl">
              Pronto para organizar suas vendas?
            </h2>
            <p className="mt-2 text-primary-foreground/80">
              Acesse o painel e veja os números da sua distribuidora.
            </p>
            <Link
              href="/login"
              className={cn(
                buttonVariants({ size: "lg" }),
                "mt-6 bg-background text-primary hover:bg-background/90",
              )}
            >
              Entrar no painel
            </Link>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-xs text-muted-foreground">
        © 2026 RapidoLar · Sistema de gestão
      </footer>
    </main>
  );
}
