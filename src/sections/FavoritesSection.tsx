import { memo, useCallback, useState } from 'react';
import { Heart, Trash2, AlertTriangle, Globe } from 'lucide-react';
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
    <div className="space-y-6 pb-24">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 pt-2">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-red-500 fill-current" />
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">
              Favoritos
            </h2>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {favorites.length} guardados
            </span>
          </div>

          {/* Clear All Button */}
          <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-9 px-3 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full bg-red-50/30 dark:bg-red-500/5 transition-all"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                <span className="text-xs font-semibold">Limpiar</span>
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 rounded-2xl">
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
                <AlertDialogCancel className="border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-full">
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearAll}
                  className="bg-red-500 hover:bg-red-600 text-white rounded-full px-6"
                >
                  Eliminar todo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Info Banner */}
        <div className="mx-4 sm:mx-6 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-500/10 flex items-start gap-3">
          <div className="p-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 shrink-0">
            <Globe className="w-4 h-4" />
          </div>
          <p className="text-xs text-blue-700 dark:text-blue-300/80 leading-relaxed font-medium">
            Los favoritos se guardan localmente en este dispositivo para acceso rápido.
            Se eliminan automáticamente después de 30 días de inactividad para optimizar el espacio.
          </p>
        </div>

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
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
        )}
      </div>

      {/* Bottom Spacing */}
      <div className="h-4" />
    </div>
  );
});
