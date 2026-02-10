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
          className="bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 flex flex-col h-full"
        >
          {/* Image Skeleton - Fixed height matching NewsCard */}
          <Skeleton className="h-48 w-full shrink-0" />

          {/* Content Skeleton */}
          <div className="p-4 flex flex-col flex-1 gap-3">
            {/* Header: Source & Time (Top) */}
            <div className="flex items-center gap-2.5">
              <Skeleton className="h-5 w-5 rounded-full" />
              <div className="space-y-1">
                <Skeleton className="h-2.5 w-20" />
              </div>
            </div>

            {/* Title - Larger */}
            <div className="space-y-2">
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-full" />
              <Skeleton className="h-5 w-2/3" />
            </div>

            {/* NO Description in this design to match clean look */}

            {/* Actions - Bottom Right */}
            <div className="mt-auto flex items-center justify-end pt-2 gap-1">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
