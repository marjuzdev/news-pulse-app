import { memo, useCallback } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { NewsCard } from '@/components/NewsCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { EmptyState } from '@/components/EmptyState';
import { usePersonalizedNews, useInfiniteScroll } from '@/hooks';
import type { NewsArticle, NewsCategory } from '@/types';

interface ForYouSectionProps {
  interests: NewsCategory[];
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (article: NewsArticle) => void;
  onOpenArticle: (url: string) => void;
  onConfigureInterests: () => void;
}

export const ForYouSection = memo(function ForYouSection({
  interests,
  isFavorite,
  onToggleFavorite,
  onOpenArticle,
  onConfigureInterests,
}: ForYouSectionProps) {
  const {
    articles,
    loading,
    hasMore,
    loadMore,
    refresh,
  } = usePersonalizedNews(interests, 10);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  });

  const handleRefresh = useCallback(async () => {
    await refresh();
  }, [refresh]);

  // Show empty state if no interests selected
  if (interests.length === 0) {
    return (
      <EmptyState
        type="empty-feed"
        onAction={onConfigureInterests}
      />
    );
  }

  return (
    <div className="space-y-6 pb-20">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" />
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">
              Para ti
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Basado en {interests.length} intereses
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={loading}
            className="h-9 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 rounded-full transition-all"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-xs font-semibold">Actualizar</span>
          </Button>
        </div>

        {/* News Grid */}
        {articles.length > 0 && (
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {articles.map((article, index) => (
              <NewsCard
                key={article.id}
                article={article}
                isFavorite={isFavorite(article.id)}
                onToggleFavorite={onToggleFavorite}
                onOpen={onOpenArticle}
                index={index}
              />
            ))}

            {/* Loading Skeletons */}
            {loading && (
              <SkeletonCard count={3} />
            )}

            {/* Load More Sentinel */}
            {hasMore && !loading && (
              <div ref={sentinelRef} className="h-4" />
            )}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && interests.length > 0 && (
          <div className="flex flex-col items-center justify-center px-4 py-12">
            <EmptyState
              type="no-results"
              onAction={handleRefresh}
            />
          </div>
        )}

        {/* Initial Loading Skeletons */}
        {loading && articles.length === 0 && (
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            <SkeletonCard count={6} />
          </div>
        )}

        {/* End of List */}
        {!hasMore && articles.length > 0 && (
          <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500 font-medium">
            Es todo por ahora
          </div>
        )}
      </div>
    </div>
  );
});
