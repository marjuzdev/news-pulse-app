import { memo } from 'react';
import { Sun, Moon, Settings, Newspaper, Globe, Briefcase, Film, Activity, FlaskConical, Trophy, Cpu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import type { NewsCategory } from '@/types';

const CATEGORIES: { value: NewsCategory; label: string; icon: React.ElementType }[] = [
  { value: 'general', label: 'General', icon: Globe },
  { value: 'business', label: 'Negocios', icon: Briefcase },
  { value: 'entertainment', label: 'Entretenimiento', icon: Film },
  { value: 'health', label: 'Salud', icon: Activity },
  { value: 'science', label: 'Ciencia', icon: FlaskConical },
  { value: 'sports', label: 'Deportes', icon: Trophy },
  { value: 'technology', label: 'Tecnología', icon: Cpu },
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
                className={`absolute inset-0 w-5 h-5 text-amber-500 transition-all duration-300 ${isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
                  }`}
              />
              <Moon
                className={`absolute inset-0 w-5 h-5 text-indigo-400 transition-all duration-300 ${isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
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
            <SheetContent className="w-full sm:max-w-md bg-white/95 dark:bg-slate-900/95 border-l border-slate-200 dark:border-slate-800 backdrop-blur-xl p-0 gap-0 flex flex-col h-full shadow-2xl">
              <SheetHeader className="px-6 py-5 border-b border-slate-100 dark:border-slate-800/50 flex-shrink-0">
                <SheetTitle className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">
                  Configuración
                </SheetTitle>
              </SheetHeader>

              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {/* Theme Section */}
                <div className="space-y-3">
                  <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                    Apariencia
                  </h3>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 transition-colors hover:border-slate-200 dark:hover:border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                        {isDark ? (
                          <Moon className="w-4 h-4 text-indigo-400" />
                        ) : (
                          <Sun className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                      <Label htmlFor="theme-toggle" className="text-slate-700 dark:text-slate-200 cursor-pointer font-medium">
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
                  <div className="space-y-1 pl-1">
                    <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      Tus intereses
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-500">
                      Personaliza tu feed seleccionando las categorías
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {CATEGORIES.map((cat) => {
                      const isSelected = interests.includes(cat.value);
                      const Icon = cat.icon;
                      return (
                        <button
                          key={cat.value}
                          onClick={() => onToggleInterest(cat.value)}
                          className={`
                            inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium border
                            transition-all duration-200 active:scale-95
                            ${isSelected
                              ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/20'
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                            }
                          `}
                        >
                          <Icon className={`w-3.5 h-3.5 ${isSelected ? 'animate-pulse' : ''}`} />
                          <span>{cat.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Stats Section */}
                <div className="space-y-2.5">
                  <h3 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-1">
                    Estadísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {interests.length}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                        Categorías
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-slate-50/80 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50">
                      <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                        {favoritesCount}
                      </div>
                      <div className="text-[10px] font-medium text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                        Favoritos
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
