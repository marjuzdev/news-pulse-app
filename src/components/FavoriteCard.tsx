import React, { memo, useState, useCallback } from 'react';
import { Heart, Trash2 } from 'lucide-react';
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
      className="group relative bg-white dark:bg-slate-900 rounded-[32px] overflow-hidden border border-slate-200 dark:border-slate-800/60 transition-all duration-300 cursor-pointer animate-fade-in-up flex flex-col h-full active:scale-[0.98] shadow-sm hover:shadow-md"
      style={{ animationDelay: `${animationDelay}ms` }}
      onClick={(e) => {
        handleRipple(e);
        handleOpen();
      }}
    >
      {/* Ripple Element */}
      {ripple.show && (
        <span
          className="absolute bg-slate-200/40 dark:bg-slate-700/40 rounded-full animate-ripple pointer-events-none z-10"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: '20px',
            height: '20px',
            marginLeft: '-10px',
            marginTop: '-10px',
            transformOrigin: 'center center',
          }}
        />
      )}

      {/* Image Container */}
      <div className="relative w-full aspect-[16/9] overflow-hidden bg-slate-100 dark:bg-slate-800 flex-shrink-0">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 animate-pulse bg-slate-200 dark:bg-slate-700" />
        )}
        {imageError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-600" />
          </div>
        ) : (
          <img
            src={item.imageUrl}
            alt={item.title}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="flex flex-col p-4 pt-3 flex-1">
        {/* Title */}
        <h3 className="font-bold text-slate-900 dark:text-white text-[17px] leading-[1.3] mb-2 line-clamp-3 group-hover:underline decoration-1 underline-offset-4">
          {item.title}
        </h3>

        {/* Description */}
        {item.description && (
          <p className="text-[12px] text-slate-600 dark:text-slate-300 line-clamp-2 mb-3 leading-relaxed">
            {item.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-end pt-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleRemove}
            className="h-8 w-8 rounded-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 z-20"
            title="Eliminar de favoritos"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </article>
  );
});
