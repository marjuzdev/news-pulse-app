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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-500" />
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Para ti
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Basado en {interests.length} intereses
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
          className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-xs">Actualizar</span>
        </Button>
      </div>

      {/* News Grid */}
      <div className="px-4 space-y-4">
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
          <div className="space-y-4">
            <SkeletonCard count={2} />
          </div>
        )}

        {/* Load More Sentinel */}
        {hasMore && !loading && (
          <div ref={sentinelRef} className="h-4" />
        )}

        {/* End of List */}
        {!hasMore && articles.length > 0 && (
          <div className="text-center py-8 text-sm text-slate-500 dark:text-slate-400">
            No hay más noticias
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <EmptyState 
            type="no-results" 
            onAction={handleRefresh}
          />
        )}
      </div>
    </div>
  );
});
