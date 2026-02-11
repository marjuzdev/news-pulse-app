import { memo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface SkeletonCardProps {
  count?: number;
}

export const SkeletonCard = memo(function SkeletonCard({ count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <div
          key={i}
          className="bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800/60 flex flex-col h-full"
        >
          {/* Image Skeleton - matching 16/9 aspect-ratio */}
          <Skeleton className="aspect-[16/9] w-full shrink-0 rounded-none mb-3" />

          {/* Content Skeleton */}
          <div className="px-3.5 pb-3.5 flex flex-col flex-1 gap-3.5">
            {/* Header: Source (Top) */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-md" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
            </div>

            {/* Meta */}
            <div className="mt-auto flex items-center gap-2">
              <Skeleton className="h-2.5 w-12" />
              <Skeleton className="h-1 w-1 rounded-full" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
