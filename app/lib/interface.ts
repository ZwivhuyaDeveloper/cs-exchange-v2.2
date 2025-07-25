export interface Tag {
  name: string;
  color: string;
}

export interface Impact {
  name: string;
  color: string;
}

export interface simpleNewsCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];

}

export interface fullNews {
  currentSlug: string;
  title: string;
  content: any;
  titleImage: any;
  headImage: any;
  contentImage: any;
  research: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];
}

export interface simpleResearchCard {
  title: string;
  smallDescription: string;
  currentSlug: string;
  titleImage: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];
}

export interface fullResearch {
  currentSlug: string;
  title: string;
  content: any;
  titleImage: any;
  headImage: any;
  contentImage: any;
  research: any;
  publishedAt: string;
  categoryName: any;
  category: any;
  impacts: Impact[];
  tags: Tag[];

}

export type DateFormatOptions = {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
};

/**
 * Token interface: minimal, robust, URL-safe
 */
export interface Token {
  _id: string;
  _type: 'token';
  symbol: string;
  name: string;
  slug: string;
  coingeckoId: string;
  logo: string;
  contractAddress?: string;
  blockchain?: string;
}

/**
 * Represents a crypto trading signal document.
 */
export interface CryptoSignal {
  _id: string;
  _type: 'signal';
  name: string;
  slug: string;
  token: Token;
  direction: 'buy' | 'sell';
  entryPrice: number;
  targetPrices: number[];
  stopLoss?: number;
  publishedAt: string;
  status: 'active' | 'completed' | 'canceled';
  exitPrice?: number;
  notes?: string;
  timeframe?: 'short' | 'medium' | 'long';
  riskLevel?: 'low' | 'medium' | 'high';
  associatedContent?: {
    _id: string;
    title: string;
    slug: string;
    _type: string;
  };
}