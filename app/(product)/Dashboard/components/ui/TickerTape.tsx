"use client"

import { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

const TickerTape = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    // Ensure this runs only on the client-side
    if (typeof window !== 'undefined' && containerRef.current) {
      // Clear the container to prevent duplicate widgets
      containerRef.current.innerHTML = '<div class="tradingview-widget-container__widget"></div>';
      
      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        symbols: [
          { proName: "FOREXCOM:SPXUSD", title: "S&P 500 Index" },
          { proName: "FOREXCOM:NSXUSD", title: "US 100 Cash CFD" },
          { proName: "FX_IDC:EURUSD", title: "EUR to USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" }
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "adaptive",
        colorTheme: resolvedTheme === 'dark' ? 'dark' : 'light',
        locale: "en"
      });

      containerRef.current.appendChild(script);
    }
    
    // Cleanup function to remove the script when component unmounts or theme changes
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [resolvedTheme]);  // Re-run when theme changes

  return (
    <div 
      className="tradingview-widget-container" 
      ref={containerRef}
      style={{ 
        width: '100%',
        height: '46px',
        backgroundColor: resolvedTheme === 'dark' ? '#0F0F0F' : '#FFFFFF'
      }}
    />
  );
};

export default TickerTape;