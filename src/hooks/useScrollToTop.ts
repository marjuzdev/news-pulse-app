import { useState, useEffect, useCallback } from 'react';

interface UseScrollToTopOptions {
  threshold?: number;
  smooth?: boolean;
}

export function useScrollToTop(options: UseScrollToTopOptions = {}) {
  const { threshold = 300, smooth = true } = options;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollTop = window.scrollY || document.documentElement.scrollTop;
          setIsVisible(scrollTop > threshold);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Check initial position
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto'
    });
  }, [smooth]);

  return { isVisible, scrollToTop };
}
