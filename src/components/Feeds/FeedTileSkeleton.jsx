import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const FeedTileSkeleton = () => (
  <Card>
  <CardContent>
    <section className="flex items-center justify-between">
      <section className="flex gap-2 items-center">
        <Skeleton className="h-[56px] w-[56px] rounded-full" />
        <div className="flex flex-col gap-1">
          <Skeleton className="h-[16px] w-[120px]" />
          <Skeleton className="h-[14px] w-[80px]" />
          <Skeleton className="h-[12px] w-[60px]" />
        </div>
      </section>
      <Skeleton className="h-5 w-5" />
    </section>
    <Skeleton className="h-[20px] w-[200px] mt-3" />
    <Skeleton className="h-[16px] w-full mt-2" />
    <Skeleton className="h-[16px] w-4/5 mt-1" />
    <Skeleton className="h-[400px] w-full mt-3 rounded-md" />
  </CardContent>
</Card>
);

export default FeedTileSkeleton;
