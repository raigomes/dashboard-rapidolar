"use client";

import { TriangleAlertIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="flex size-16 items-center justify-center rounded-full bg-muted">
        <TriangleAlertIcon className="size-8 text-muted-foreground opacity-60" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Erro inesperado
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Algo deu errado</h1>
        <p className="mx-auto max-w-sm text-sm text-muted-foreground">
          Não foi possível carregar esta página. Tente novamente.
        </p>
      </div>
      <Button size="lg" onClick={reset}>
        Tentar novamente
      </Button>
      {error.digest && (
        <p className="text-xs text-muted-foreground">Código: {error.digest}</p>
      )}
    </main>
  );
}
