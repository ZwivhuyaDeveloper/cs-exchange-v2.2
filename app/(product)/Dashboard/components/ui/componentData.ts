interface DataSource {
  name: string;
  description: string;
}

export interface InfoCardProps {
  title: string;
  description: string;
  dataSources: DataSource[];
  note?: string;
  lastUpdated: string;
}

export const getMarketStatsInfo = (): InfoCardProps => ({
  title: "Market Stats",
  description: "Real-time market statistics and analytics",
  dataSources: [
    { name: "CoinGecko", description: "Market data and price information" },
    { name: "Binance", description: "Trading volume and liquidity data" },
    { name: "Chainlink", description: "Price feeds and market aggregation" }
  ],
  note: "This is a beta version. Full release with additional metrics and real-time updates coming soon.",
  lastUpdated: new Date().toISOString()
});

export const getOrderDataInfo = (): InfoCardProps => ({
  title: "Order Data",
  description: "Real-time order book and trade information",
  dataSources: [
    { name: "Binance", description: "Order book and trade execution data" },
    { name: "0x Protocol", description: "DEX order flow and aggregation" }
  ],
  note: "Order data is aggregated from multiple sources. Some features may be in beta.",
  lastUpdated: new Date().toISOString()
});

export const getLiquidityDistributionInfo = (): InfoCardProps => ({
  title: "Liquidity Distribution",
  description: "Visualization of liquidity across different price levels",
  dataSources: [
    { name: "Uniswap V3", description: "Concentrated liquidity positions" },
    { name: "PancakeSwap", description: "DEX liquidity pools" },
    { name: "1inch", description: "Aggregated liquidity sources" }
  ],
  note: "Liquidity data is aggregated from multiple DEXs. Some pools may not be included.",
  lastUpdated: new Date().toISOString()
});

export const getRadarChartInfo = (): InfoCardProps => ({
  title: "Token Metrics",
  description: "Comprehensive analysis of token performance",
  dataSources: [
    { name: "CoinGecko", description: "Market data and metrics" },
    { name: "CoinMarketCap", description: "Market cap and volume data" },
    { name: "DefiLlama", description: "DeFi protocol metrics" }
  ],
  note: "Metrics are updated hourly. Some data points may have a slight delay.",
  lastUpdated: new Date().toISOString()
});

export const getTechnicalSpecsInfo = (): InfoCardProps => ({
  title: "Technical Specifications",
  description: "Detailed technical information about the token",
  dataSources: [
    { name: "Etherscan", description: "Contract and on-chain data" },
    { name: "Blockchain RPCs", description: "Real-time network data" },
    { name: "Token Projects", description: "Official project documentation" }
  ],
  note: "Technical specifications are sourced from verified public sources.",
  lastUpdated: new Date().toISOString()
});
