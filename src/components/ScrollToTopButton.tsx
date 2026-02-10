import { memo } from 'react';
import { ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

export const ScrollToTopButton = memo(function ScrollToTopButton({
  isVisible,
  onClick,
}: ScrollToTopButtonProps) {
  return (
    <div 
      className={`
        fixed bottom-24 right-4 z-40 transition-all duration-300
        ${isVisible 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-4 pointer-events-none'
        }
      `}
    >
      <Button
        onClick={onClick}
        size="icon"
        className="w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 backdrop-blur-md transition-all duration-200 active:scale-95"
        aria-label="Volver arriba"
      >
        <ArrowUp className="w-5 h-5" />
      </Button>
    </div>
  );
});
