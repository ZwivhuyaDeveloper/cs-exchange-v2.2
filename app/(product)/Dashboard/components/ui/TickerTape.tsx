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
          { proName: "COINBASE:LINKUSD", title: "Chainlink" },
          { proName: "COINBASE:APEUSD", title: "Apecoin" },
          { proName: "CRYPTO:BUSDUSD", title: "Binance USD" },
          { proName: "BITSTAMP:BTCUSD", title: "Bitcoin" },
          { proName: "BITSTAMP:ETHUSD", title: "Ethereum" },
          { proName: "COINBASE:COMPUSD", title: "Compound Governance Token" },
          { proName: "COINBASE:CRVUSD", title: "Curve Dao Token" },
          { proName: "COINBASE:DAIUSD", title: "Dai" },
          { proName: "COINBASE:SNXUSD", title: "Havven" },
          { proName: "TRADENATION:TRONUSD", title: "Tron" },
        ],
        showSymbolLogo: true,
        isTransparent: true,
        displayMode: "regular",
        colorTheme: resolvedTheme === 'dark' ? 'dark' : 'light',
        locale: "en"
      });

      containerRef.current.appendChild(script);
    }
    
    // Capture the current ref value in the effect's closure
    const currentContainer = containerRef.current;
    
    // Cleanup function to prevent memory leaks
    return () => {
      if (currentContainer) {
        currentContainer.innerHTML = '';
      }
    };
  }, [resolvedTheme]);  // Re-run when theme changes

  return (
    <div 
      className="tradingview-widget-container" 
      ref={containerRef}
      style={{ 
        width: '100%',
        height: '40px',
        backgroundColor: resolvedTheme === 'dark' ? '#0F0F0F' : '#FFFFFF'
      }}
    />
  );
};

export default TickerTape;