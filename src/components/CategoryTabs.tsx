import { memo } from 'react';
import type { NewsCategory } from '@/types';

interface CategoryTabsProps {
  activeCategory: NewsCategory | 'all';
  onCategoryChange: (category: NewsCategory | 'all') => void;
}

const CATEGORIES: { value: NewsCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'Todas', icon: '📰' },
  { value: 'general', label: 'General', icon: '🌍' },
  { value: 'business', label: 'Negocios', icon: '💼' },
  { value: 'entertainment', label: 'Entretenimiento', icon: '🎬' },
  { value: 'health', label: 'Salud', icon: '🏥' },
  { value: 'science', label: 'Ciencia', icon: '🔬' },
  { value: 'sports', label: 'Deportes', icon: '⚽' },
  { value: 'technology', label: 'Tecnología', icon: '💻' },
];

export const CategoryTabs = memo(function CategoryTabs({
  activeCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="sticky top-14 z-40 w-full backdrop-blur-xl bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1 px-4 py-3 min-w-max">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => onCategoryChange(cat.value)}
                className={`
                  relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium
                  transition-all duration-200 whitespace-nowrap active:scale-95
                  ${isActive 
                    ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }
                `}
              >
                <span className="text-base">{cat.icon}</span>
                <span>{cat.label}</span>
                
                {/* Active indicator animation */}
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-white/20 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});
