import Link from "next/link";
import { SprayCanIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type LogoProps = {
  size?: "sm" | "md";
  showWordmark?: boolean;
  href?: string;
  className?: string;
};

export function Logo({
  size = "sm",
  showWordmark = true,
  href,
  className,
}: LogoProps) {
  const isMd = size === "md";

  const content = (
    <span
      className={cn("flex items-center gap-2.5")}
      aria-hidden={showWordmark ? undefined : true}
    >
      <span
        className={cn(
          "flex items-center justify-center bg-primary/10 text-primary",
          isMd ? "size-12 rounded-full" : "size-8 rounded-lg",
        )}
      >
        <SprayCanIcon className={isMd ? "size-6" : "size-[18px]"} />
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-bold tracking-tight",
            isMd ? "text-2xl" : "text-lg",
            className,
          )}
        >
          RapidoLar
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="flex items-center">
        {content}
      </Link>
    );
  }

  return content;
}
