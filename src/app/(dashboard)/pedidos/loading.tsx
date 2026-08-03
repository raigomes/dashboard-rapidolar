import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function PedidosLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />

      <div className="flex flex-wrap items-center gap-2">
        <Skeleton className="h-9 w-[140px]" />
        <Skeleton className="h-9 w-[140px]" />
        <Skeleton className="h-9 w-48" />
        <Skeleton className="h-9 w-36" />
      </div>

      <Card className="shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-40" />
        </div>
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px] space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
