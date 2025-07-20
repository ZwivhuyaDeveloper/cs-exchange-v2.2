import React, { useEffect, useRef } from 'react';
import { getTradingViewSymbol } from '@/src/constants';
import { useTheme } from '@/context/ThemeContext';

interface TradingViewLiveChartProps {
  tokenSymbol: string;
  theme?: 'light' | 'dark';
  interval?: string;
}

const LiveChart = ({ 
  tokenSymbol,
  interval = "60",
  theme: propTheme
}: TradingViewLiveChartProps) => {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const tradingViewSymbol = getTradingViewSymbol(tokenSymbol);
  
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
        symbol: tradingViewSymbol,
        hide_side_toolbar: false,
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
    // Cleanup function to prevent memory leaks
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [tradingViewSymbol, interval, theme]);
  
  return (
    <div 
      className="tradingview-widget-container" 
      ref={containerRef}
      style={{ height: '100%', width: '100%', border: '0%' }}
    />
  );
};

export default LiveChart;