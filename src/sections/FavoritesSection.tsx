import { memo, useCallback, useState } from 'react';
import { Heart, Trash2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { FavoriteCard } from '@/components/FavoriteCard';
import { EmptyState } from '@/components/EmptyState';
import type { FavoriteItem } from '@/types';

interface FavoritesSectionProps {
  favorites: FavoriteItem[];
  onRemove: (id: string) => void;
  onClearAll: () => void;
  onOpenArticle: (url: string) => void;
  onExploreNews: () => void;
}

export const FavoritesSection = memo(function FavoritesSection({
  favorites,
  onRemove,
  onClearAll,
  onOpenArticle,
  onExploreNews,
}: FavoritesSectionProps) {
  const [showClearDialog, setShowClearDialog] = useState(false);

  const handleClearAll = useCallback(() => {
    onClearAll();
    setShowClearDialog(false);
  }, [onClearAll]);

  // Show empty state if no favorites
  if (favorites.length === 0) {
    return (
      <EmptyState
        type="no-favorites"
        onAction={onExploreNews}
      />
    );
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-2">
          <Heart className="w-5 h-5 text-red-500 fill-current" />
          <h2 className="font-semibold text-slate-900 dark:text-white">
            Favoritos
          </h2>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {favorites.length} guardados
          </span>
        </div>

        {/* Clear All Button */}
        <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              <span className="text-xs">Limpiar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2 text-slate-900 dark:text-white">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                ¿Eliminar todos los favoritos?
              </AlertDialogTitle>
              <AlertDialogDescription className="text-slate-500 dark:text-slate-400">
                Esta acción eliminará permanentemente {favorites.length} noticias guardadas.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300">
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleClearAll}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Eliminar todo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Info Banner */}
      <div className="mx-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20">
        <p className="text-xs text-amber-700 dark:text-amber-400">
          Los favoritos se guardan temporalmente en este dispositivo y se eliminan automáticamente después de 30 días.
        </p>
      </div>

      {/* Favorites List */}
      <div className="px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {favorites.map((item, index) => (
          <FavoriteCard
            key={item.id}
            item={item}
            onRemove={onRemove}
            onOpen={onOpenArticle}
            index={index}
          />
        ))}
      </div>

      {/* Bottom Spacing */}
      <div className="h-8" />
    </div>
  );
});
