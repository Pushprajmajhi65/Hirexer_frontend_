import React from 'react'
import { Card,CardContent } from '../ui/card';
import { Separator } from '../ui/separator';
import { Skeleton } from '../ui/skeleton';

const LoadingSkeleton = () => (
  <Card>
    <CardContent className="flex flex-col gap-3">
      <section className="flex items-center justify-between">
        <Skeleton className="h-6 w-[150px]" />
        <Skeleton className="h-6 w-[80px]" />
      </section>
      
      <Skeleton className="h-[44px] w-full" />
      <Separator />
      
      <div className="w-full overflow-x-auto">
        <div className="flex space-x-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="min-w-[200px] h-[100px]" />
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

export default LoadingSkeleton