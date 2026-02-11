import { memo } from 'react';
import { Layers, Globe, Briefcase, Film, Activity, FlaskConical, Trophy, Cpu } from 'lucide-react';
import type { NewsCategory } from '@/types';

interface CategoryTabsProps {
  activeCategory: NewsCategory | 'all';
  onCategoryChange: (category: NewsCategory | 'all') => void;
}

const CATEGORIES: { value: NewsCategory | 'all'; label: string; icon: React.ElementType }[] = [
  { value: 'all', label: 'Todas', icon: Layers },
  { value: 'general', label: 'General', icon: Globe },
  { value: 'business', label: 'Negocios', icon: Briefcase },
  { value: 'entertainment', label: 'Entretenimiento', icon: Film },
  { value: 'health', label: 'Salud', icon: Activity },
  { value: 'science', label: 'Ciencia', icon: FlaskConical },
  { value: 'sports', label: 'Deportes', icon: Trophy },
  { value: 'technology', label: 'Tecnología', icon: Cpu },
];

export const CategoryTabs = memo(function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-14 z-40 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm shadow-slate-200/20 dark:shadow-slate-900/20 transition-all duration-300 supports-[backdrop-filter]:bg-white/60">
      <div className="overflow-x-auto scrollbar-hide md:overflow-visible py-2">
        <div className="flex items-center gap-2 px-4 min-w-max md:min-w-0 md:w-full md:max-w-6xl md:mx-auto md:justify-center md:flex-wrap">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            const Icon = cat.icon;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium
                  transition-all duration-300 whitespace-nowrap active:scale-95 ring-offset-2 ring-offset-white dark:ring-offset-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  ${isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25 ring-0'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200'
                  }
                `}
              >
                <Icon className={`w-4 h-4 transition-transform duration-300 ${isActive ? 'scale-110' : ''}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
