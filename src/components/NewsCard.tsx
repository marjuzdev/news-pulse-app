import { memo, useState, useCallback } from 'react';
import { Heart, Share2, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { NewsArticle } from '@/types';

interface NewsCardProps {
  article: NewsArticle;
  isFavorite: boolean;
  onToggleFavorite: (article: NewsArticle) => void;
  onOpen: (url: string) => void;
  index?: number;
}

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
  const [ripple, setRipple] = useState<{ x: number; y: number; show: boolean }>({ x: 0, y: 0, show: false });

  const handleRipple = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setRipple({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      show: true,
    });
    setTimeout(() => setRipple(prev => ({ ...prev, show: false })), 600);
  };

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

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  // Staggered animation delay based on index
  const animationDelay = Math.min(index * 50, 300);

  return (
    <article
      className="group relative bg-white dark:bg-slate-900 rounded-[28px] overflow-hidden border border-slate-200/80 dark:border-slate-800/60 transition-all duration-300 cursor-pointer animate-fade-in-up flex flex-col h-full active:scale-[0.98] shadow-sm hover:shadow-md hover:border-blue-200 dark:hover:border-blue-900/40"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={(e) => {
        handleRipple(e);
        handleOpen();
      }}
    >
      {/* Ripple Element */}
      {ripple.show && (
        <span
          className="absolute bg-slate-400/20 dark:bg-slate-300/10 rounded-full animate-ripple pointer-events-none z-10"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '10px',
            height: '10px',
            marginLeft: '-5px',
            marginTop: '-5px',
            transformOrigin: 'center center',
          }}
        />
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="w-full h-full animate-pulse bg-slate-200 dark:bg-slate-700" />
        )}
        {imageError ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Newspaper className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        ) : (
          <img
            src={article.imageUrl}
            alt={article.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="flex flex-col p-3.5 pt-2.5 flex-1">
        {/* Source Section */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-slate-700/50">
              <span className="text-[10px] font-bold text-slate-500 uppercase">{article.source.name.charAt(0)}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[150px]">
              {article.source.name}
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleShare}
              className="w-8 h-8 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 z-20 transition-colors"
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full transition-all duration-200 z-20 ${isFavorite ? 'text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30' : 'text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/10'
                }`}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-[16px] leading-relaxed mb-2.5 line-clamp-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.title}
        </h3>

        {/* Meta Info */}
        <div className="mt-auto flex items-center gap-2 text-[12px] text-slate-500 dark:text-slate-400 font-medium">
          <span className="whitespace-nowrap">{formatTimeAgo(article.publishedAt)}</span>
          <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
          <span className="text-blue-600/90 dark:text-blue-400/90 uppercase tracking-tight text-[11px] font-bold">{categoryLabel}</span>
        </div>
      </div>
    </article>
  );
});
