// Token types for better type safety
export type TokenType = 'crypto' | 'stock' | 'forex' | 'index' | 'commodity';
export type Exchange = 'NASDAQ' | 'NYSE' | 'COINBASE' | 'BINANCE' | 'FOREXCOM';

// Token interface
export interface Token {
  symbol: string;
  name: string;
  type: TokenType;
  exchange?: Exchange;
  icon?: string; // Optional emoji or image URL
}

// Token list interface
export interface TokenList {
  id: string;
  name: string;
  description: string;
  tokens: Token[];
  isDefault?: boolean;
}

// Popular cryptocurrencies
const cryptoList: TokenList = {
  id: 'crypto',
  name: 'Cryptocurrencies',
  description: 'Top digital assets by market cap',
  tokens: [
    { symbol: 'COINBASE:BTCUSD', name: 'Bitcoin', type: 'crypto', exchange: 'COINBASE', icon: '₿' },
    { symbol: 'COINBASE:ETHUSD', name: 'Ethereum', type: 'crypto', exchange: 'COINBASE', icon: '⧫' },
    { symbol: 'BINANCE:SOLUSDT', name: 'Solana', type: 'crypto', exchange: 'BINANCE', icon: '◎' },
    { symbol: 'BINANCE:BNBUSD', name: 'Binance Coin', type: 'crypto', exchange: 'BINANCE', icon: '🅱️' },
    { symbol: 'COINBASE:ADAUSD', name: 'Cardano', type: 'crypto', exchange: 'COINBASE', icon: '𝔸' },
    { symbol: 'COINBASE:XRPUSD', name: 'Ripple', type: 'crypto', exchange: 'COINBASE', icon: '✕' },
  ],
  isDefault: true
};

// Major stocks
const stockList: TokenList = {
  id: 'stocks',
  name: 'Tech Stocks',
  description: 'Leading technology companies',
  tokens: [
    { symbol: 'NASDAQ:AAPL', name: 'Apple', type: 'stock', exchange: 'NASDAQ', icon: '🍎' },
    { symbol: 'NASDAQ:MSFT', name: 'Microsoft', type: 'stock', exchange: 'NASDAQ', icon: '💻' },
    { symbol: 'NASDAQ:GOOGL', name: 'Alphabet (Google)', type: 'stock', exchange: 'NASDAQ', icon: '🔍' },
    { symbol: 'NASDAQ:AMZN', name: 'Amazon', type: 'stock', exchange: 'NASDAQ', icon: '📦' },
    { symbol: 'NASDAQ:META', name: 'Meta (Facebook)', type: 'stock', exchange: 'NASDAQ', icon: '👥' },
    { symbol: 'NASDAQ:NVDA', name: 'NVIDIA', type: 'stock', exchange: 'NASDAQ', icon: '🎮' },
  ]
};

// Forex pairs
const forexList: TokenList = {
  id: 'forex',
  name: 'Forex Pairs',
  description: 'Major currency pairs',
  tokens: [
    { symbol: 'FX_IDC:EURUSD', name: 'EUR/USD', type: 'forex', icon: '💶' },
    { symbol: 'FX_IDC:GBPUSD', name: 'GBP/USD', type: 'forex', icon: '💷' },
    { symbol: 'FX_IDC:USDJPY', name: 'USD/JPY', type: 'forex', icon: '💴' },
    { symbol: 'FX_IDC:USDCAD', name: 'USD/CAD', type: 'forex', icon: '🇨🇦' },
    { symbol: 'FX_IDC:AUDUSD', name: 'AUD/USD', type: 'forex', icon: '🇦🇺' },
  ]
};

// Commodities and indices
const indicesList: TokenList = {
  id: 'indices',
  name: 'Indices & Commodities',
  description: 'Market benchmarks and raw materials',
  tokens: [
    { symbol: 'FOREXCOM:SPXUSD', name: 'S&P 500', type: 'index', icon: '📊' },
    { symbol: 'FOREXCOM:DJI', name: 'Dow Jones', type: 'index', icon: '📈' },
    { symbol: 'FOREXCOM:NSXUSD', name: 'Nasdaq 100', type: 'index', icon: '💹' },
    { symbol: 'TVC:GOLD', name: 'Gold', type: 'commodity', icon: '🥇' },
    { symbol: 'TVC:SILVER', name: 'Silver', type: 'commodity', icon: '🥈' },
    { symbol: 'TVC:USOIL', name: 'Crude Oil', type: 'commodity', icon: '🛢️' },
  ]
};

// All token lists
export const tokenLists: TokenList[] = [
  cryptoList,
  stockList,
  forexList,
  indicesList
];

// Get default token list
export const getDefaultTokenList = (): TokenList => {
  return tokenLists.find(list => list.isDefault) || tokenLists[0];
};

// Get token by symbol
export const getTokenBySymbol = (symbol: string): Token | undefined => {
  for (const list of tokenLists) {
    const token = list.tokens.find(t => t.symbol === symbol);
    if (token) return token;
  }
  return undefined;
};