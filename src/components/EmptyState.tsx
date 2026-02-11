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
    <div className="flex-1 flex flex-col items-center justify-center py-8 px-6 text-center animate-fade-in-up w-full max-w-lg mx-auto min-h-[300px] sm:min-h-[400px]">
      {/* Icon */}
      <div className={`
        w-20 h-20 sm:w-24 sm:h-24 rounded-3xl ${config.bgColor} 
        flex items-center justify-center mb-6 sm:mb-8
        shadow-sm ring-1 ring-slate-200/20
      `}>
        <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${config.iconColor}`} />
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
        {config.title}
      </h3>

      {/* Description */}
      <p className="text-[14px] text-slate-500 dark:text-slate-400 max-w-[280px] mb-8 leading-relaxed">
        {message || config.description}
      </p>

      {/* Action Button */}
      {onAction && (
        <Button
          onClick={onAction}
          variant="default"
          className="rounded-full px-8 h-12 font-semibold shadow-md shadow-blue-500/10 hover:shadow-lg hover:shadow-blue-500/20 transition-all active:scale-95"
        >
          {config.actionLabel}
        </Button>
      )}
    </div>
  );
});
