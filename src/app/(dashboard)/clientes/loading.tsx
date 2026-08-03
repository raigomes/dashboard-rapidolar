import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function ClientesLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-40" />

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Skeleton className="h-9 w-full max-w-xs" />
        <Skeleton className="h-9 w-36" />
      </div>

      <Card className="shadow-sm">
        <div className="overflow-x-auto rounded-lg border">
          <div className="min-w-[600px] space-y-3 p-4">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-7 w-full" />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
