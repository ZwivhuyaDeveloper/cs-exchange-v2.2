import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useTheme } from 'next-themes';

// Import logos
import DarkLogo from '@/public/Cyclespace-logo/CSblue.png';
import LightLogo from '@/public/Cyclespace-logo/CS logo color.png';
import { Tourney } from 'next/font/google';


const _tourney = Tourney({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
  variable: '--font-tourney'
});

interface LoadingIntroProps {
  onComplete: () => void;
}

const LoadingIntro = ({ onComplete }: LoadingIntroProps) => {
  const [showTitle, setShowTitle] = useState(false);
  const [showSubtitle, setShowSubtitle] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    // Reduced timing by half
    const timer1 = setTimeout(() => setShowTitle(true), 250);
    const timer2 = setTimeout(() => setShowSubtitle(true), 600);
    const timer3 = setTimeout(() => onComplete(), 1750);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="text-center">
        {/* Theme-based Logo */}
        <div className="mb-8 transition-opacity duration-500">
          <div className="w-32 h-32 mx-auto relative">
            <div className={`absolute inset-0 transition-opacity duration-500 ${isDark ? 'opacity-100' : 'opacity-0'}`}>
              <Image 
                src={DarkLogo} 
                alt="Cyclespace Logo" 
                width={128}
                height={128}
                className="animate-float"
                priority
              />
            </div>
            <div className={`absolute inset-0 transition-opacity duration-500 ${!isDark ? 'opacity-100' : 'opacity-0'}`}>
              <Image 
                src={LightLogo} 
                alt="Cyclespace Logo" 
                width={128}
                height={128}
                className="animate-float"
                priority
              />
            </div>
          </div>
        </div>

        {/* Main Title */}
        <div className="space-y-4">
          {showTitle && (
            <h1 className={`${_tourney.className} antialiased text-6xl lg:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 animate-text-reveal`}>
              CYCLE
              <span className="text-primary">SPACE</span>
            </h1>
          )}
          
          {showSubtitle && (
            <p className={`${_tourney.className} antialiased text-3xl md:text-3xl text-black  dark:text-white/70 animate-fade-in tracking-wider font-semibold`}>
              EXCHANGE
            </p>
          )}
        </div>

        {/* Loading indicator */}
        {showSubtitle && (
          <div className="mt-12 max-w-xs mx-auto overflow-hidden">
            <div className="h-1 bg-secondary/20 rounded-full">
              <div 
                className="h-full bg-gradient-to-r from-[#00ffc6] to-[#6c47ff] rounded-full transition-all duration-1000 ease-out"
                style={{ width: '0%', animation: 'progress 1.5s ease-out forwards' }}
              />
            </div>
          </div>
        )}

        <style jsx global>{`
          @keyframes progress {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-text-reveal {
            animation: textReveal 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .animate-fade-in {
            animation: fadeIn 0.6s ease-out forwards;
          }
          @keyframes textReveal {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default LoadingIntro;