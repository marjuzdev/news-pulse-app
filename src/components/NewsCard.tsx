import { memo, useState, useCallback } from 'react';
import { Heart, ExternalLink, Share2, Clock, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
  isFavorite: boolean;
  onToggleFavorite: (article: NewsArticle) => void;
  onOpen: (url: string) => void;
  index?: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  general: 'bg-slate-500',
  business: 'bg-emerald-500',
  entertainment: 'bg-pink-500',
  health: 'bg-red-500',
  science: 'bg-violet-500',
  sports: 'bg-orange-500',
  technology: 'bg-blue-500',
};

const CATEGORY_LABELS: Record<string, string> = {
  general: 'General',
  business: 'Negocios',
  entertainment: 'Entretenimiento',
  health: 'Salud',
  science: 'Ciencia',
  sports: 'Deportes',
  technology: 'Tecnología',
};

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} h`;
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
}

export const NewsCard = memo(function NewsCard({
  article,
  isFavorite,
  onToggleFavorite,
  onOpen,
  index = 0,
}: NewsCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleFavoriteClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite(article);
  }, [article, onToggleFavorite]);

  const handleShare = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: article.description,
          url: article.url,
        });
      } catch {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(article.url);
      } catch {
        console.error('Failed to copy');
      }
    }
  }, [article]);

  const handleOpen = useCallback(() => {
    onOpen(article.url);
  }, [article.url, onOpen]);

  const categoryColor = CATEGORY_COLORS[article.category] || 'bg-slate-500';
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  // Staggered animation delay based on index
  const animationDelay = Math.min(index * 50, 300);

  return (
    <article
      className="group relative bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/10 transition-all duration-300 cursor-pointer animate-fade-in-up flex flex-col h-full hover:-translate-y-1"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleOpen}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Newspaper className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
        ) : (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className={`
              w-full h-full object-cover transition-transform duration-700 group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Category Badge - Floating with subtle shadow */}
        <div className="absolute top-3 left-3">
          <Badge className={`${categoryColor} text-white text-[10px] font-bold px-2 py-0.5 shadow-md backdrop-blur-sm border-0 tracking-wide uppercase`}>
            {categoryLabel}
          </Badge>
        </div>

        {/* Favorite Button - polished */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          className={`
            absolute top-3 right-3 w-8 h-8 rounded-full backdrop-blur-md border border-white/10
            transition-all duration-200 active:scale-90
            ${isFavorite
              ? 'bg-red-500/90 text-white hover:bg-red-600 shadow-lg shadow-red-500/20'
              : 'bg-black/20 text-white hover:bg-black/40 hover:backdrop-blur-lg'
            }
          `}
        >
          <Heart className={`w-3.5 h-3.5 transition-transform duration-300 ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Source & Time */}
        <div className="flex items-center gap-2 text-[11px] text-slate-400 dark:text-slate-500 mb-1.5 font-medium tracking-tight">
          <span className="text-slate-600 dark:text-slate-300 uppercase">
            {article.source.name}
          </span>
          <span className="w-0.5 h-0.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {article.description}
        </p>

        {/* Actions - minimalistic */}
        <div className="mt-auto flex items-center justify-end pt-2 border-t border-slate-50 dark:border-slate-800/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-7 w-7 rounded-full p-0 text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:text-slate-500 dark:hover:text-slate-300 dark:hover:bg-slate-800"
              title="Compartir"
            >
              <Share2 className="w-3.5 h-3.5" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 text-xs font-medium rounded-full ml-1"
            >
              <span>Leer</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
