"use client";

import { Toaster as BaseToaster } from "@/components/ui/sonner";

export function Toaster() {
  return (
    <BaseToaster
      position="bottom-right"
      richColors
      closeButton
      duration={4000}
    />
  );
}
