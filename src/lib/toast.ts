import { toast } from "sonner";

// DESIGN_SYSTEM §2.11: sucesso 4s (default do Toaster), erro 6s.
export function toastError(message: string) {
  toast.error(message, { duration: 6000 });
}
