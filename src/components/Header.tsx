import { memo } from 'react';
import { Sun, Moon, Settings, Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { NewsCategory } from '@/types';

const CATEGORIES: { value: NewsCategory; label: string; icon: string }[] = [
  { value: 'general', label: 'General', icon: '📰' },
  { value: 'business', label: 'Negocios', icon: '💼' },
  { value: 'entertainment', label: 'Entretenimiento', icon: '🎬' },
  { value: 'health', label: 'Salud', icon: '🏥' },
  { value: 'science', label: 'Ciencia', icon: '🔬' },
  { value: 'sports', label: 'Deportes', icon: '⚽' },
  { value: 'technology', label: 'Tecnología', icon: '💻' },
];

interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
  interests: NewsCategory[];
  onToggleInterest: (category: NewsCategory) => void;
  favoritesCount: number;
}

export const Header = memo(function Header({
  isDark,
  onToggleTheme,
  interests,
  onToggleInterest,
  favoritesCount,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="flex items-center justify-between h-14 px-4 max-w-7xl mx-auto">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <Newspaper className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 bg-clip-text text-transparent">
            News Pulse
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleTheme}
            className="relative w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            aria-label={isDark ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            <div className="relative w-5 h-5">
              <Sun 
                className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${
                  isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                }`} 
              />
              <Moon 
                className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-300 ${
                  isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
                }`} 
              />
            </div>
          </Button>

          {/* Settings */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                data-settings-trigger
                className="relative w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-full sm:max-w-md bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
              <SheetHeader>
                <SheetTitle className="text-slate-900 dark:text-white">
                  Configuración
                </SheetTitle>
              </SheetHeader>
              
              <div className="mt-6 space-y-6">
                {/* Theme Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Apariencia
                  </h3>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      {isDark ? (
                        <Moon className="w-5 h-5 text-indigo-400" />
                      ) : (
                        <Sun className="w-5 h-5 text-amber-500" />
                      )}
                      <Label htmlFor="theme-toggle" className="text-slate-700 dark:text-slate-300 cursor-pointer">
                        Modo oscuro
                      </Label>
                    </div>
                    <Switch
                      id="theme-toggle"
                      checked={isDark}
                      onCheckedChange={onToggleTheme}
                    />
                  </div>
                </div>

                {/* Interests Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Tus intereses
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-500">
                    Selecciona las categorías que te interesan para personalizar tu feed
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => {
                      const isSelected = interests.includes(cat.value);
                      return (
                        <button
                          key={cat.value}
                          onClick={() => onToggleInterest(cat.value)}
                          className={`
                            inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium
                            transition-all duration-200 active:scale-95
                            ${isSelected 
                              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/25' 
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                            }
                          `}
                        >
                          <span>{cat.icon}</span>
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    Estadísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {interests.length}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        Categorías seguidas
                      </div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white">
                        {favoritesCount}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-500">
                        Favoritos guardados
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
});
