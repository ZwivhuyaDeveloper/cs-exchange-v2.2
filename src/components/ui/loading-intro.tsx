import React, { useEffect, useState } from 'react';

interface LoadingIntroProps {
  onComplete: () => void;
}

const LoadingIntro = ({ onComplete }: LoadingIntroProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setShowTitle(true), 500);
    const timer2 = setTimeout(() => setShowSubtitle(true), 1200);
    const timer3 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        {/* Logo/Icon */}
        <div className="mb-8 animate-logo-bounce">
          <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-2xl">
            <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center">
              <div className="w-6 h-6 bg-gradient-to-br from-primary to-accent rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          {showTitle && (
            <h1 className="font-tourney text-6xl md:text-8xl font-bold text-foreground animate-text-reveal animate-glow-pulse">
              CYCLE
              <span className="text-primary">SPACE</span>
            </h1>
          )}
          
          {showSubtitle && (
            <p className="font-tourney text-lg md:text-xl text-muted-foreground animate-text-reveal tracking-wider font-medium">
              CRYPTO DASHBOARD
            </p>
          )}
        </div>

        {/* Loading indicator */}
        <div className="mt-12">
          <div className="w-48 h-1 bg-secondary rounded-full mx-auto overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIntro;