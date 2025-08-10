import { Address } from "viem";
import { polygon, arbitrum, avalanche, base, berachain, blast, bsc, linea, mantle, mode, monadTestnet, optimism, scroll, unichain, worldchain, etherlink  } from "viem/chains";
import { getChainId } from "viem/actions";


export const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";
export const MAGIC_CALLDATA_STRING = "f".repeat(130); // used when signing the eip712 message
export const AFFILIATE_FEE = 100; // 1% affiliate fee. Denoted in Bps.
export const FEE_RECIPIENT = "0xc591aDD1A42A2D746D145E157f37F99728231F4e"; // The ETH address that should receive affiliate fees
export const MAX_ALLOWANCE =Number(115792089237316195423570985008687907853269984665640564039457584007913129639935);
export const DEFAULT_SLIPPAGE_BPS = 50; // 0.5% default slippage

//Proxies
export const MAINNET_EXCHANGE_PROXY ="0xdef1c0ded9bec7f1a1670819833240f027b25eff";
export const POLYGON_EXCHANGE_PROXY = "0xDef1C0ded9bec7F1a1670819833240f027b25EfF";

// In src/constants.ts
export const EXCHANGE_PROXY_ADDRESS: Record<number, string> = {
  1: '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // Mainnet
  137: '0xdef1c0ded9bec7f1a1670819833240f027b25eff', // Polygon
  // Add new chain here
};

export const RPC_URLS: Record<number, string> = {
  1: `https://mainnet.infura.io/v3/${process.env.NEXT_PUBLIC_INFURA_ID}`,
  137: `https://polygon-rpc.com`,
  // Add new chain RPC URL
};

export interface Token {
  symbol: string;
  name: string;
  type?: 'crypto' | 'memecoin' | 'ethereum' | 'polygon' ;
  exchange?: 'BITSTAMP' | 'CRYPTO' | 'COINBASE' | 'BINANCE' | 'GEMINI';
  icon?: string;
  address?: Address;
  chainId?: number;
  decimals?: number;
  logoURL?: string;
  
}

// Token list interface
export interface TokenList {
  id: string;
  name: string;
  description: string;
  tokens: Token[];
  isDefault?: boolean;
}



export const POLYGON_TOKENS: Token[] = [
  {
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
  },
  {
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  {
    chainId: 137,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
];

export const POLYGON_TOKENS_BY_SYMBOL: Record<string, Token> = {
  wmatic: {
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
  },
  usdc: {
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  dai: {
    chainId: 137,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
};

export const POLYGON_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270": {
    chainId: 137,
    name: "Wrapped Matic",
    symbol: "WMATIC",
    decimals: 18,
    address: "0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/matic.svg",
  },
  "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359": {
    chainId: 137,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063": {
    chainId: 137,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x8f3cf7ad23cd3cadbd9735aff958023239c6a063",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
}

export const TRADINGVIEW_TOKEN_LISTS: TokenList[] = [
  {
    id: 'crypto',
    name: 'Cryptocurrencies',
    description: 'Top digital assets by market cap',
    tokens: [
      { symbol: 'COINBASE:BTCUSD', name: 'Bitcoin', icon: '₿' },
      { symbol: 'COINBASE:ETHUSD', name: 'Ethereum', icon: '⧫' },
      // ... other crypto tokens ...
    ],
    isDefault: true
  },
  {
    id: 'stocks',
    name: 'Tech Stocks',
    description: 'Leading technology companies',
    tokens: [
      { symbol: 'NASDAQ:AAPL', name: 'Apple', icon: '🍎' },
      // ... other stocks ...
    ]
  },
  // ... other lists ...
];


export const MAINNET_TOKENS: Token[] = [
  {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  {
    chainId: 1,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  {
    chainId: 1,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  {
    chainId: 1,
    name: "FLOKI",
    symbol: "FLOKI",
    decimals: 9,
    address: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
    logoURL:
      "https://raw.githubusercontent.com/trustwallet/assets/c37119334a24f9933f373c6cc028a5bdbad2ecb4/blockchains/ethereum/assets/0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E/logo.png",
  },
  {
    chainId: 1,
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  {
    chainId: 1,
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
  },
  {
    chainId: 1,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  {
    chainId: 1,
    name: "Aave",
    symbol: "AAVE",
    decimals: 18,
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
  },
  {
    chainId: 1,
    name: "Shiba Inu",
    symbol: "SHIB",
    decimals: 18,
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png",
  },
  {
    chainId: 1,
    name: "Binance USD",
    symbol: "BUSD",
    decimals: 18,
    address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png",
  },
  {
    chainId: 1,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png",
  },
  {
    chainId: 1,
    name: "TrueUSD",
    symbol: "TUSD",
    decimals: 18,
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png",
  },
  {
    chainId: 1,
    name: "Compound",
    symbol: "COMP",
    decimals: 18,
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
  },
  {
    chainId: 1,
    name: "Curve DAO Token",
    symbol: "CRV",
    decimals: 18,
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
  },
  {
    chainId: 1,
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    logoURL: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725",
  },
  {
    chainId: 1,
    name: "Lido DAO",
    symbol: "LDO",
    decimals: 18,
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
  },
  {
    chainId: 1,
    name: "Synthetix Network",
    symbol: "SNX",
    decimals: 18,
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
  },
  {
    chainId: 1,
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png",
  },
  {
    chainId: 1,
    name: "Maker",
    symbol: "MKR",
    decimals: 18,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589CC3A579A2/logo.png",
  },
  {
    chainId:1,
    name: "Tron",
    symbol: "TRX",
    decimals: 6,
    address: "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5/logo.png",
  },
  
];

export const MAINNET_TOKENS_BY_SYMBOL: Record<string, Token> = {
  weth: {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  usdc: {
    chainId: 1,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  dai: {
    chainId: 1,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  floki: {
    chainId: 1,
    name: "FLOKI",
    symbol: "FLOKI",
    decimals: 9,
    address: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
    logoURL:
      "https://raw.githubusercontent.com/trustwallet/assets/c37119334a24f9933f373c6cc028a5bdbad2ecb4/blockchains/ethereum/assets/0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E/logo.png",
  },
  usdt: {
    chainId: 1,
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  link: {
    chainId: 1,
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
  },
  uni: {
    chainId: 1,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  aave: {
    chainId: 1,
    name: "Aave",
    symbol: "AAVE",
    decimals: 18,
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
  },
  shib: {
    chainId: 1,
    name: "Shiba Inu",
    symbol: "SHIB",
    decimals: 18,
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png",
  },
  busd: {
    chainId: 1,
    name: "Binance USD",
    symbol: "BUSD",
    decimals: 18,
    address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png",
  },
  matic: {
    chainId: 1,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png",
  },
  tusd: {
    chainId: 1,
    name: "TrueUSD",
    symbol: "TUSD",
    decimals: 18,
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png",
  },
  comp: {
    chainId: 1,
    name: "Compound",
    symbol: "COMP",
    decimals: 18,
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
  },
  crv: {
    chainId: 1,
    name: "Curve DAO Token",
    symbol: "CRV",
    decimals: 18,
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
  },
  pepe: {
    chainId: 1,
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    logoURL: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725",
  },
  ldo: {
    chainId: 1,
    name: "Lido DAO",
    symbol: "LDO",
    decimals: 18,
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
  },
  snx: {
    chainId: 1,
    name: "Synthetix Network",
    symbol: "SNX",
    decimals: 18,
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
  },
  ape: {
    chainId: 1,
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png",
  },
  mkr: {
    chainId: 1,
    name: "Maker",
    symbol: "MKR",
    decimals: 18,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8F72aA9304c8B593d555F12eF6589CC3A579A2/logo.png",
  },
  trx: {
    chainId:1,
    name: "Tron",
    symbol: "TRX",
    decimals: 6,
    address: "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5/logo.png",
  },
};

export const MAINNET_TOKENS_BY_ADDRESS: Record<string, Token> = {
  "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2": {
    chainId: 1,
    name: "Wrapped Ether",
    symbol: "WETH",
    decimals: 18,
    address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/weth.svg",
  },
  "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48": {
    chainId: 1,
    name: "USD Coin",
    symbol: "USDC",
    decimals: 6,
    address: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/usdc.svg",
  },
  "0x6b175474e89094c44da98b954eedeac495271d0f": {
    chainId: 1,
    name: "Dai - PoS",
    symbol: "DAI",
    decimals: 18,
    address: "0x6b175474e89094c44da98b954eedeac495271d0f",
    logoURL:
      "https://raw.githubusercontent.com/maticnetwork/polygon-token-assets/main/assets/tokenAssets/dai.svg",
  },
  "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e": {
    chainId: 1,
    name: "FLOKI",
    symbol: "FLOKI",
    decimals: 9,
    address: "0xcf0c122c6b73ff809c693db761e7baebe62b6a2e",
    logoURL:
      "https://raw.githubusercontent.com/trustwallet/assets/c37119334a24f9933f373c6cc028a5bdbad2ecb4/blockchains/ethereum/assets/0xcf0C122c6b73ff809C693DB761e7BaeBe62b6a2E/logo.png",
  },
  "0xdac17f958d2ee523a2206206994597c13d831ec7": {
    chainId: 1,
    name: "Tether USD",
    symbol: "USDT",
    decimals: 6,
    address: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xdAC17F958D2ee523a2206206994597C13D831ec7/logo.png",
  },
  "0x514910771af9ca656af840dff83e8264ecf986ca": {
    chainId: 1,
    name: "Chainlink",
    symbol: "LINK",
    decimals: 18,
    address: "0x514910771af9ca656af840dff83e8264ecf986ca",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x514910771AF9Ca656af840dff83E8264EcF986CA/logo.png",
  },
  "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984": {
    chainId: 1,
    name: "Uniswap",
    symbol: "UNI",
    decimals: 18,
    address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984/logo.png",
  },
  "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9": {
    chainId: 1,
    name: "Aave",
    symbol: "AAVE",
    decimals: 18,
    address: "0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9/logo.png",
  },
  "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce": {
    chainId: 1,
    name: "Shiba Inu",
    symbol: "SHIB",
    decimals: 18,
    address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE/logo.png",
  },

  "0x4fabb145d64652a948d72533023f6e7a623c7c53": {
    chainId: 1,
    name: "Binance USD",
    symbol: "BUSD",
    decimals: 18,
    address: "0x4fabb145d64652a948d72533023f6e7a623c7c53",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4Fabb145d64652a948d72533023f6E7A623C7C53/logo.png",
  },
  "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0": {
    chainId: 1,
    name: "Polygon",
    symbol: "MATIC",
    decimals: 18,
    address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0/logo.png",
  },
  "0x0000000000085d4780b73119b644ae5ecd22b376": {
    chainId: 1,
    name: "TrueUSD",
    symbol: "TUSD",
    decimals: 18,
    address: "0x0000000000085d4780B73119b644AE5ecd22b376",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x0000000000085d4780B73119b644AE5ecd22b376/logo.png",
  },
  "0xc00e94cb662c3520282e6f5717214004a7f26888": {
    chainId: 1,
    name: "Compound",
    symbol: "COMP",
    decimals: 18,
    address: "0xc00e94cb662c3520282e6f5717214004a7f26888",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xc00e94Cb662C3520282E6f5717214004A7f26888/logo.png",
  },
  "0xd533a949740bb3306d119cc777fa900ba034cd52": {
    chainId: 1,
    name: "Curve DAO Token",
    symbol: "CRV",
    decimals: 18,
    address: "0xD533a949740bb3306d119CC777fa900bA034cd52",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xD533a949740bb3306d119CC777fa900bA034cd52/logo.png",
  },
  "0x6982508145454ce325ddbe47a25d4ec3d2311933": {
    chainId: 1,
    name: "Pepe",
    symbol: "PEPE",
    decimals: 18,
    address: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
    logoURL: "https://assets.coingecko.com/coins/images/29850/large/pepe-token.jpeg?1682922725",
  },
  "0x5a98fcbea516cf06857215779fd812ca3bef1b32": {
    chainId: 1,
    name: "Lido DAO",
    symbol: "LDO",
    decimals: 18,
    address: "0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x5A98FcBEA516Cf06857215779Fd812CA3beF1B32/logo.png",
  },
  "0xc011a73ee8576fb46f5e1c5751ca3b9fe0af2a6f": {
    chainId: 1,
    name: "Synthetix Network",
    symbol: "SNX",
    decimals: 18,
    address: "0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0xC011a73ee8576Fb46F5E1c5751cA3B9Fe0af2a6F/logo.png",
  },
  "0x4d224452801aced8b2f0aebe155379bb5d594381": {
    chainId: 1,
    name: "ApeCoin",
    symbol: "APE",
    decimals: 18,
    address: "0x4d224452801ACEd8B2F0aebE155379bb5D594381",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x4d224452801ACEd8B2F0aebE155379bb5D594381/logo.png",
  },
  "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2": {
    chainId: 1,
    name: "Maker",
    symbol: "MKR",
    decimals: 18,
    address: "0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2/logo.png",
  },
  "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5":   {
    chainId:1,
    name: "Tron",
    symbol: "TRX",
    decimals: 6,
    address: "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5",
    logoURL: "https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5/logo.png",
  },

  
};

export const COINGECKO_IDS: Record<string, string> = {
  weth: "ethereum",
  usdc: "usd-coin",
  dai: "dai",
  floki: "floki",
  usdt: "tether",
  link: "chainlink",
  uni: "uniswap",
  aave: "aave",
  shib: "shiba-inu",
  busd: "binance-usd",
  matic: "matic-network",
  tusd: "true-usd",
  comp: "compound-governance-token",
  crv: "curve-dao-token",
  pepe: "pepe",
  ldo: "lido-dao",
  snx: "havven",
  ape: "apecoin",
  mkr: "maker",
  trx: "tron",
  // Add more tokens as needed
};

export const ERC20_TO_TRADINGVIEW: Record<string, string> = {
  'WETH': 'COINBASE:ETHUSD',
  'USDC': 'COINBASE:USDCUSD',
  'DAI': 'COINBASE:DAIUSD',
  'USDT': 'COINBASE:USDTUSD',

  // ... other mappings ...
};

export const TOKEN_TO_TRADINGVIEW: Record<string, string> = {
  ...ERC20_TO_TRADINGVIEW,
  // Add TradingView symbols for other tokens
  'link': 'COINBASE:LINKUSD',
  'busd': 'CRYPTO:BUSDUSD',
  'weth': 'COINBASE:ETHUSD',
  'usdc': 'COINBASE:USDCUSD',
  'dai': 'COINBASE:DAIUSD',
  'floki': 'BINANCE:FLOKIUSD',
  'usdt': 'COINBASE:USDTUSD',
  'uni': 'COINBASE:UNIUSD',
  'aave': 'COINBASE:AAVEUSD',
  'shib': 'BINANCE:SHIBUSD',
  'matic': 'COINBASE:MATICUSD',
  'comp': 'COINBASE:COMPUSD',
  'crv': 'COINBASE:CRVUSD',
  'pepe': 'BINANCE:PEPEUSD',
  'ldo': 'COINBASE:LDOUSD',
  'snx': 'COINBASE:SNXUSD',
  'ape': 'COINBASE:APEUSD',
  'mkr': 'COINBASE:MKRUSD',
  'trx': 'TRADENATION:TRONUSD',
};

// Add this function to get TradingView symbol
export const getTradingViewSymbol = (tokenSymbol: string): string => {
  const symbol = tokenSymbol.toLowerCase();
  return TOKEN_TO_TRADINGVIEW[symbol] || symbol;
};

// Get token by symbol
export const getTokenBySymbol = (symbol: string): Token | undefined => {
  // Search in all token lists
  for (const list of TRADINGVIEW_TOKEN_LISTS) {
    const token = list.tokens.find(t => t.symbol === symbol);
    if (token) return token;
  }
  
  // Search in ERC20 tokens
  return MAINNET_TOKENS.find(t => t.symbol === symbol);
};