import { memo } from 'react';
import { Newspaper, Heart, Search, BookmarkX } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-favorites' | 'no-results' | 'error' | 'empty-feed';
  onAction?: () => void;
  message?: string;
}

const CONFIG = {
  'no-favorites': {
    icon: Heart,
    title: 'No tienes favoritos',
    description: 'Guarda las noticias que te interesen para leerlas más tarde',
    actionLabel: 'Explorar noticias',
    iconColor: 'text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-500/10',
  },
  'no-results': {
    icon: Search,
    title: 'No se encontraron resultados',
    description: 'Intenta con otra categoría o vuelve más tarde',
    actionLabel: 'Ver todas',
    iconColor: 'text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-500/10',
  },
  'error': {
    icon: Newspaper,
    title: 'Algo salió mal',
    description: 'No pudimos cargar las noticias. Inténtalo de nuevo.',
    actionLabel: 'Reintentar',
    iconColor: 'text-amber-400',
    bgColor: 'bg-amber-50 dark:bg-amber-500/10',
  },
  'empty-feed': {
    icon: BookmarkX,
    title: 'Tu feed está vacío',
    description: 'Selecciona tus intereses en configuración para personalizar tu feed',
    actionLabel: 'Configurar intereses',
    iconColor: 'text-slate-400',
    bgColor: 'bg-slate-50 dark:bg-slate-500/10',
  },
};

export const EmptyState = memo(function EmptyState({
  type,
  onAction,
  message,
}: EmptyStateProps) {
  const config = CONFIG[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {/* Icon */}
      <div className={`
        w-20 h-20 rounded-2xl ${config.bgColor} 
        flex items-center justify-center mb-6
        animate-fade-in
      `}>
        <Icon className={`w-10 h-10 ${config.iconColor}`} />
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
        {config.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-6">
        {message || config.description}
      </p>

      {/* Action Button */}
      {onAction && (
        <Button
          onClick={onAction}
          variant="outline"
          className="rounded-full px-6 border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
});
