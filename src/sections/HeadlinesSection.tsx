import React, { memo, useState, useCallback } from 'react';
import { TrendingUp, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NewsCard } from '@/components/NewsCard';
import { SkeletonCard } from '@/components/SkeletonCard';
import { CategoryTabs } from '@/components/CategoryTabs';
import { EmptyState } from '@/components/EmptyState';
import { useNews, useInfiniteScroll, usePullToRefresh } from '@/hooks';
import { PullToRefresh } from '@/components/PullToRefresh';
import type { NewsArticle, NewsCategory } from '@/types';

type SortOption = 'newest' | 'oldest';

interface HeadlinesSectionProps {
  isFavorite: (id: string) => boolean;
  onToggleFavorite: (article: NewsArticle) => void;
  onOpenArticle: (url: string) => void;
}

export const HeadlinesSection = memo(function HeadlinesSection({
  isFavorite,
  onToggleFavorite,
  onOpenArticle,
}: HeadlinesSectionProps) {
  const [category, setCategory] = useState<NewsCategory | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const {
    articles,
    loading,
    error,
    hasMore,
    refreshing,
    loadMore,
    refresh,
  } = useNews({ category, pageSize: 10 });

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    loading,
  });

  const { containerRef, pullDistance, isRefreshing, progress } = usePullToRefresh({
    onRefresh: refresh,
    threshold: 80,
  });

  // Sort articles
  const sortedArticles = React.useMemo(() => {
    if (sortBy === 'newest') {
      return [...articles].sort((a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
    return [...articles].sort((a, b) =>
      new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    );
  }, [articles, sortBy]);

  const handleCategoryChange = useCallback((newCategory: NewsCategory | 'all') => {
    setCategory(newCategory);
  }, []);

  if (error) {
    return (
      <EmptyState
        type="error"
        onAction={refresh}
        message={error}
      />
    );
  }

  return (
    <PullToRefresh
      containerRef={containerRef}
      pullDistance={pullDistance}
      isRefreshing={isRefreshing || refreshing}
      progress={progress}
    >
      <div className="space-y-6 pb-20">
        {/* Category Tabs */}
        <CategoryTabs
          activeCategory={category}
          onCategoryChange={handleCategoryChange}
        />

        <div className="max-w-6xl mx-auto space-y-6">
          {/* Header with Sort */}
          <div className="flex items-center justify-between px-4 sm:px-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              <h2 className="font-bold text-slate-900 dark:text-white text-lg">
                Encabezados
              </h2>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                {sortedArticles.length} noticias
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200 bg-slate-100/50 dark:bg-slate-800/50 rounded-full"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  <span className="text-xs font-semibold">
                    {sortBy === 'newest' ? 'Más recientes' : 'Más antiguas'}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl">
                <DropdownMenuItem onClick={() => setSortBy('newest')} className="text-slate-700 dark:text-slate-300 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                  Más recientes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy('oldest')} className="text-slate-700 dark:text-slate-300 focus:bg-blue-50 dark:focus:bg-blue-900/20">
                  Más antiguas
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* News Grid */}
          {sortedArticles.length > 0 && (
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              {sortedArticles.map((article, index) => (
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
          {!loading && sortedArticles.length === 0 && (
            <div className="flex flex-col items-center justify-center px-4 py-12">
              <EmptyState
                type="no-results"
                onAction={refresh}
              />
            </div>
          )}

          {/* Initial Loading Skeletons */}
          {loading && sortedArticles.length === 0 && (
            <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
              <SkeletonCard count={6} />
            </div>
          )}

          {/* End of List */}
          {!hasMore && sortedArticles.length > 0 && (
            <div className="text-center py-12 text-sm text-slate-400 dark:text-slate-500 font-medium">
              Has llegado al final
            </div>
          )}
        </div>
      </div>
    </PullToRefresh>
  );
});
