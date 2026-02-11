import { useState, useCallback, useEffect, Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import { Header, BottomNav, ScrollToTopButton, Sidebar } from '@/components';
import { useTheme, useFavorites, useUserPreferences, useScrollToTop } from '@/hooks';
import type { TabType, NewsArticle } from '@/types';
import './App.css';

// Lazy load sections for code splitting
const ForYouSection = lazy(() => import('@/sections/ForYouSection').then(m => ({ default: m.ForYouSection })));
const HeadlinesSection = lazy(() => import('@/sections/HeadlinesSection').then(m => ({ default: m.HeadlinesSection })));
const FavoritesSection = lazy(() => import('@/sections/FavoritesSection').then(m => ({ default: m.FavoritesSection })));

// Loading fallback for sections
const SectionLoader = () => (
  <div className="flex items-center justify-center py-20">
    <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('foryou');

  const { isDark, toggleTheme } = useTheme();
  const { favorites, favoritesCount, isFavorite, toggleFavorite, removeFavorite, clearAllFavorites } = useFavorites();
  const { interests, toggleInterest } = useUserPreferences();
  const { isVisible: showScrollToTop, scrollToTop } = useScrollToTop({ threshold: 400 });

  // Handle opening articles
  const handleOpenArticle = useCallback((url: string) => {
    // Check if running as Capacitor app or mobile
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

    if (isMobile && isStandalone) {
      // In PWA standalone mode on mobile, try to open in system browser
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch {
        // Fallback
        window.location.href = url;
      }
    } else {
      // Desktop or browser - open in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  }, []);

  // Handle tab change with scroll to top
  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    scrollToTop();
  }, [scrollToTop]);

  // Handle configure interests
  const handleConfigureInterests = useCallback(() => {
    // Open settings by focusing on the settings button
    const settingsButton = document.querySelector('[data-settings-trigger]') as HTMLButtonElement;
    settingsButton?.click();
  }, []);

  // Handle explore news (for empty favorites)
  const handleExploreNews = useCallback(() => {
    setActiveTab('headlines');
    scrollToTop();
  }, [scrollToTop]);

  // Handle clear all favorites with toast
  const handleClearAllFavorites = useCallback(() => {
    clearAllFavorites();
    toast.success('Todos los favoritos han sido eliminados');
  }, [clearAllFavorites]);

  // Handle toggle favorite with toast
  const handleToggleFavorite = useCallback((article: NewsArticle) => {
    toggleFavorite(article);
    if (!isFavorite(article.id)) {
      toast.success('Agregado a favoritos', {
        description: article.title.slice(0, 60) + '...',
      });
    } else {
      toast.info('Eliminado de favoritos');
    }
  }, [toggleFavorite, isFavorite]);

  // Hide loading screen when app is ready
  useEffect(() => {
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
      loadingScreen.classList.add('hidden');
      setTimeout(() => {
        loadingScreen.style.display = 'none';
      }, 300);
    }
  }, []);

  // Register service worker and handle installation
  useEffect(() => {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
          .then((registration) => {
            console.log('SW registered:', registration);
          })
          .catch((error) => {
            console.error('SW registration failed:', error);
          });
      });
    }

    // PWA Install Prompt handling
    const handleBeforeInstallPrompt = (e: any) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Store the event so it can be triggered later
      (window as any).deferredPrompt = e;

      // Optionally show a custom toast or button to invite the user to install
      console.log('PWA installation candidate.');

      toast('¿Quieres instalar News Pulse?', {
        description: 'Accede más rápido y lee sin conexión.',
        action: {
          label: 'Instalar',
          onClick: () => {
            const promptEvent = (window as any).deferredPrompt;
            if (promptEvent) {
              promptEvent.prompt();
              promptEvent.userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === 'accepted') {
                  console.log('User accepted the install prompt');
                } else {
                  console.log('User dismissed the install prompt');
                }
                (window as any).deferredPrompt = null;
              });
            }
          },
        },
        duration: 10000,
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
      {/* Header */}
      <Header
        isDark={isDark}
        onToggleTheme={toggleTheme}
        interests={interests}
        onToggleInterest={toggleInterest}
        favoritesCount={favoritesCount}
      />

      <div className="flex flex-row">
        {/* Sidebar for Desktop */}
        <div className="hidden lg:block">
          <Sidebar
            activeTab={activeTab}
            onTabChange={handleTabChange}
            favoritesCount={favoritesCount}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 lg:pt-14 pb-20 lg:pb-8 lg:ml-[72px] xl:ml-64">
          <Suspense fallback={<SectionLoader />}>
            {activeTab === 'foryou' && (
              <ForYouSection
                interests={interests}
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onOpenArticle={handleOpenArticle}
                onConfigureInterests={handleConfigureInterests}
              />
            )}

            {activeTab === 'headlines' && (
              <HeadlinesSection
                isFavorite={isFavorite}
                onToggleFavorite={handleToggleFavorite}
                onOpenArticle={handleOpenArticle}
              />
            )}

            {activeTab === 'favorites' && (
              <FavoritesSection
                favorites={favorites}
                onRemove={removeFavorite}
                onClearAll={handleClearAllFavorites}
                onOpenArticle={handleOpenArticle}
                onExploreNews={handleExploreNews}
              />
            )}
          </Suspense>
        </main>
      </div>

      {/* Bottom Navigation for Mobile */}
      <div className="lg:hidden">
        <BottomNav
          activeTab={activeTab}
          onTabChange={handleTabChange}
          favoritesCount={favoritesCount}
        />
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTopButton
        isVisible={showScrollToTop}
        onClick={scrollToTop}
      />

      {/* Toast Notifications */}
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: isDark ? '#1e293b' : '#ffffff',
            color: isDark ? '#ffffff' : '#0f172a',
            border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
          },
        }}
      />
    </div>
  );
}

export default App;
