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
      className="group relative bg-white dark:bg-slate-800/50 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-lg hover:shadow-slate-200/50 dark:hover:shadow-slate-900/50 transition-all duration-300 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleOpen}
    >
      {/* Image Container */}
      <div className="relative aspect-video overflow-hidden bg-slate-100 dark:bg-slate-800">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        ) : (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            decoding="async"
            className={`
              w-full h-full object-cover transition-transform duration-500 group-hover:scale-105
              ${imageLoaded ? 'opacity-100' : 'opacity-0'}
            `}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={`${categoryColor} text-white text-xs font-medium px-2.5 py-1 shadow-lg`}>
            {categoryLabel}
          </Badge>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleFavoriteClick}
          className={`
            absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md
            transition-all duration-200 active:scale-90
            ${isFavorite 
              ? 'bg-red-500/90 text-white hover:bg-red-600/90 shadow-lg shadow-red-500/30' 
              : 'bg-black/30 text-white hover:bg-black/50'
            }
          `}
        >
          <Heart className={`w-4 h-4 transition-transform ${isFavorite ? 'fill-current scale-110' : ''}`} />
        </Button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Source & Time */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2">
          <span className="font-medium text-slate-700 dark:text-slate-300">
            {article.source.name}
          </span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{formatTimeAgo(article.publishedAt)}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-3">
          {article.description}
        </p>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/50">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleShare}
              className="h-8 px-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
            >
              <Share2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Compartir</span>
            </Button>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleOpen();
            }}
            className="h-8 px-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span className="text-xs">Leer más</span>
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </article>
  );
});
