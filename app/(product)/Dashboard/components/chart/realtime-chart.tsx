import { useEffect, useRef } from 'react';

interface TradingViewLiveChartProps {
  token: BlockchainToken | null;
  interval?: string;
  theme?: 'dark' | 'light';
}

const TradingViewLiveChart = ({ 
  token,
  interval = "60",
  theme = "dark"
}: TradingViewLiveChartProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && containerRef.current && token) {
      // Clear container to prevent duplicates
      containerRef.current.innerHTML = `
        <div class="tradingview-widget-container__widget" style="height:100%;width:100%"></div>
        <div class="tradingview-widget-copyright">
          <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
            <span class="blue-text">Track all markets on TradingView</span>
          </a>
        </div>
      `;
      
      // Create new script element
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.type = 'text/javascript';
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: token.tradingViewSymbol,
        interval,
        timezone: "Etc/UTC",
        theme,
        style: "1",
        locale: "en",
        withdateranges: true,
        allow_symbol_change: false,
        save_image: false,
        support_host: "https://www.tradingview.com"
      });

      containerRef.current.appendChild(script);
    }
    
    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [token, interval, theme]);

  return (
    <div 
      className="tradingview-widget-container rounded-xl overflow-hidden shadow-lg"
      ref={containerRef}
      style={{ height: '100%', width: '100%' }}
    />
  );
};

export default TradingViewLiveChart;