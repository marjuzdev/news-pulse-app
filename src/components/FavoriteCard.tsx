import React, { memo, useState, useCallback } from 'react';
import { Heart, ExternalLink, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { FavoriteItem } from '@/types';

interface FavoriteCardProps {
  item: FavoriteItem;
  onRemove: (id: string) => void;
  onOpen: (url: string) => void;
  index?: number;
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
      className="group relative bg-white dark:bg-slate-800/50 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:shadow-indigo-900/10 transition-all duration-300 cursor-pointer animate-fade-in-up h-full hover:-translate-y-1"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={handleOpen}
    >
      <div className="flex gap-3 p-3 h-full">
        {/* Thumbnail */}
        <div className="relative w-28 flex-shrink-0 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800 h-28 self-center">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600" />
            </div>
          ) : (
            <img
              src={item.imageUrl}
              alt={item.title}
              loading="lazy"
              decoding="async"
              className={`
                w-full h-full object-cover transition-transform duration-500 group-hover:scale-110
                ${imageLoaded ? 'opacity-100' : 'opacity-0'}
              `}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col">
          {/* Title */}
          <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug line-clamp-2 mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2 leading-relaxed">
            {item.description}
          </p>

          <div className="mt-auto flex items-center justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleRemove}
              className="h-8 w-8 rounded-full text-red-500 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40"
              title="Eliminar de favoritos"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.stopPropagation();
                handleOpen();
              }}
              className="h-8 w-8 rounded-full text-blue-500 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              title="Leer original"
            >
              <ExternalLink className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
});
