import React, { memo } from 'react';
import { Loader2, ArrowDown } from 'lucide-react';

interface PullToRefreshProps {
  pullDistance: number;
  isRefreshing: boolean;
  progress: number;
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const PullToRefresh = memo(function PullToRefresh({
  pullDistance,
  isRefreshing,
  progress,
  children,
  containerRef,
}: PullToRefreshProps) {
  const shouldShow = pullDistance > 10 || isRefreshing;

  return (
    <div ref={containerRef} className="relative min-h-screen">
      {/* Pull Indicator */}
      <div 
        className={`
          fixed top-0 left-0 right-0 z-30 flex items-center justify-center
          transition-all duration-200 pointer-events-none
          ${shouldShow ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          height: Math.max(pullDistance, isRefreshing ? 60 : 0),
          transform: `translateY(${isRefreshing ? 0 : 0}px)`,
        }}
      >
        <div className="flex flex-col items-center gap-2">
          {isRefreshing ? (
            <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
          ) : (
            <ArrowDown 
              className="w-6 h-6 text-slate-400 transition-transform duration-200"
              style={{ 
                transform: `rotate(${Math.min(progress * 180, 180)}deg)`,
                opacity: 0.5 + progress * 0.5 
              }}
            />
          )}
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {isRefreshing 
              ? 'Actualizando...' 
              : progress >= 1 
                ? 'Suelta para actualizar' 
                : 'Desliza para actualizar'
            }
          </span>
        </div>
      </div>

      {/* Content */}
      <div 
        className="transition-transform duration-200"
        style={{
          transform: isRefreshing ? 'translateY(60px)' : `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  );
});
