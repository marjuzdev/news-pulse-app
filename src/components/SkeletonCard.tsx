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
          className="bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50"
        >
          {/* Image Skeleton */}
          <Skeleton className="aspect-video w-full" />
          
          {/* Content Skeleton */}
          <div className="p-4 space-y-3">
            {/* Source & Time */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-3 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>
            
            {/* Title */}
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-3/4" />
            
            {/* Description */}
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
            
            {/* Actions */}
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
});
