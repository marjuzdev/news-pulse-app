import { memo } from 'react';
import { Compass, Newspaper, Heart } from 'lucide-react';
import type { TabType } from '@/types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
}

const TABS: { id: TabType; label: string; icon: typeof Compass }[] = [
  { id: 'foryou', label: 'Para ti', icon: Compass },
  { id: 'headlines', label: 'Noticias', icon: Newspaper },
  { id: 'favorites', label: 'Favoritos', icon: Heart },
];

export const BottomNav = memo(function BottomNav({
  activeTab,
  onTabChange,
  favoritesCount,
}: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 safe-area-pb">
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-4">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex flex-col items-center justify-center gap-1 flex-1 h-full
                transition-all duration-200 active:scale-95
                ${isActive
                  ? 'text-blue-500 active-tab-glow'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }
              `}
            >
              {/* Icon */}
              <div className="relative">
                <Icon
                  className={`
                    w-6 h-6 transition-all duration-200
                    ${isActive ? 'scale-110' : 'scale-100'}
                  `}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {/* Favorites Badge */}
                {tab.id === 'favorites' && favoritesCount > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[10px] font-bold rounded-full">
                    {favoritesCount > 99 ? '99+' : favoritesCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className={`text-xs font-medium ${isActive ? 'opacity-100' : 'opacity-70'}`}>
                {tab.label}
              </span>

              {/* Active Indicator */}
              {isActive && (
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-blue-500 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
});
