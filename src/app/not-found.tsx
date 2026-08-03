import Link from "next/link";
import { SearchXIcon } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <SearchXIcon className="size-8 text-muted-foreground opacity-60" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Erro 404
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Página não encontrada</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          O conteúdo que você procura não existe ou foi movido.
        </p>
      </div>
      <Link href="/dashboard" className={buttonVariants({ size: "lg" })}>
        Voltar ao Dashboard
      </Link>
    </main>
  );
}
