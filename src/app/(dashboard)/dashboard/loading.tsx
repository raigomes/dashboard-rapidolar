import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-4 w-56" />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="rounded-xl p-4 shadow-sm md:p-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-36" />
              <Skeleton className="h-3 w-16" />
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 shadow-sm md:p-6">
        <div className="mb-4 space-y-1">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-[200px] w-full rounded-lg md:h-[350px]" />
      </Card>

      <div className="grid grid-cols-1 gap-4 md:gap-6 xl:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="shadow-sm">
            <CardHeader>
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="px-0">
              <div className="space-y-3 px-4 pb-4">
                <Skeleton className="h-8 w-full" />
                {Array.from({ length: 6 }).map((__, j) => (
                  <Skeleton key={j} className="h-6 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
