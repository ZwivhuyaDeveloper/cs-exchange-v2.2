import React, { useEffect, useRef } from 'react';
import { useTheme } from '@/context/ThemeContext';

interface TradingViewLiveChartProps {
  tokenSymbol: string;
  tradingViewSymbol?: string;
  theme?: 'light' | 'dark';
  interval?: string;
}

const LiveChart = ({ 
  tokenSymbol,
  tradingViewSymbol,
  interval = "60",
  theme: propTheme
}: TradingViewLiveChartProps) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  // Use tradingViewSymbol prop if provided, else fallback to tokenSymbol
  const symbol = tradingViewSymbol || tokenSymbol;
  // Use propTheme if provided, otherwise use resolvedTheme from context
  const theme = propTheme || resolvedTheme;

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current) {
      // Clear entire container to prevent duplicate widgets
      containerRef.current.innerHTML = `
        <div class="tradingview-widget-container__widget" style="height:calc(100% - 32px);width:100%;outline:0%;border:0%;"></div>
      `;

      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol,
        hide_side_toolbar: true,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "en",
        withdateranges: true,
        allow_symbol_change: false,
        save_image: false,
        support_host: "https://www.tradingview.com",
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
  }, [symbol, interval, theme]);
  
  return (
    <div 
      className="tradingview-widget-container h-full w-full" 
      ref={containerRef}
      style={{ height: '100%', width: '100%', border: '0%' }}
    />
  );
};

export default LiveChart;