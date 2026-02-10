import React, { memo, useState, useCallback } from 'react';
import { Heart, ExternalLink, Trash2, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FavoriteItem } from '@/types';

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemove: (id: string) => void;
  onOpen: (url: string) => void;
  index?: number;
}

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

export const FavoriteCard = memo(function FavoriteCard({
  item,
  onRemove,
  onOpen,
  index = 0,
}: FavoriteCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(item.id);
  }, [item.id, onRemove]);

  const handleOpen = useCallback(() => {
    onOpen(item.url);
  }, [item.url, onOpen]);

  // Staggered animation delay
  const animationDelay = Math.min(index * 50, 300);

  return (
    <article 
      className="group relative bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700/50 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer animate-fade-in-up"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleOpen}
    >
      <div className="flex gap-3 p-3">
        {/* Thumbnail */}
        <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Heart className="w-6 h-6 text-slate-300 dark:text-slate-600" />
            </div>
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className={`
                w-full h-full object-cover transition-opacity duration-300
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h3 className="font-medium text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
            {item.description}
          </p>

          {/* Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
              <Clock className="w-3 h-3" />
              <span>Guardado {formatTimeAgo(item.addedAt)}</span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemove}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  handleOpen();
                }}
                className="w-7 h-7 rounded-full text-slate-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
});
