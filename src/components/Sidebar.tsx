import { Compass, Newspaper, Heart } from 'lucide-react';
import type { TabType } from '@/types';

interface SidebarProps {
    activeTab: TabType;
    onTabChange: (tab: TabType) => void;
    favoritesCount: number;
}

export function Sidebar({ activeTab, onTabChange, favoritesCount }: SidebarProps) {
    const navItems = [
        { id: 'foryou', label: 'Para ti', icon: Compass },
        { id: 'headlines', label: 'Titulares', icon: Newspaper },
        { id: 'favorites', label: 'Favoritos', icon: Heart, count: favoritesCount },
    ];

    return (

        <aside className="hidden lg:flex flex-col w-[72px] xl:w-64 h-screen fixed left-0 top-0 lg:mt-[100px] border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 overflow-hidden">
            <div className="flex flex-col gap-2 p-3 mt-4 items-center xl:items-stretch">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => onTabChange(item.id as TabType)}
                            className={`
                group flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 w-full justify-center xl:justify-start
                ${isActive
                                    ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 font-semibold active-tab-glow'
                                    : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800'
                                }
              `}
                            title={item.label}
                        >
                            <div className="relative flex items-center justify-center min-w-[24px]">
                                <Icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                {item.count !== undefined && item.count > 0 && (
                                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900">
                                        {item.count > 99 ? '99+' : item.count}
                                    </span>
                                )}
                            </div>
                            <span className="hidden xl:block text-sm truncate">{item.label}</span>
                        </button>
                    );
                })}
            </div>
        </aside>
    );
}
