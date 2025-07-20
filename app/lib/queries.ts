// lib/queries.ts
import { groq } from 'next-sanity';

export const SIGNAL_QUERY = groq`
  *[_type == "signal"] | order(publishedAt desc) {
    _id,
    name,
    "slug": slug.current,
    direction,
    entryPrice,
    targetPrices,
    stopLoss,
    publishedAt,
    status,
    exitPrice,
    notes,
    timeframe,
    riskLevel,
    "token": token->{
      _id,
      symbol,
      name,
      "slug": slug.current,
      coingeckoId,
      logo,
      contractAddress,
      blockchain
    },
    associatedContent->{
      _id,
      title,
      "slug": slug.current,
      _type
    }
  }
`;

export const SIGNAL_BY_ID_QUERY = groq`
  *[_type == "signal" && _id == $id][0] {
    _id,
    name,
    "slug": slug.current,
    direction,
    entryPrice,
    targetPrices,
    stopLoss,
    publishedAt,
    status,
    exitPrice,
    notes,
    timeframe,
    riskLevel,
    "token": token->{
      _id,
      symbol,
      name,
      "slug": slug.current,
      coingeckoId,
      logo,
      contractAddress,
      blockchain
    },
    associatedContent->{
      _id,
      title,
      "slug": slug.current,
      _type
    }
  }
`;

export const SIGNAL_BY_SLUG_QUERY = groq`
  *[_type == "signal" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    direction,
    entryPrice,
    targetPrices,
    stopLoss,
    publishedAt,
    status,
    exitPrice,
    notes,
    timeframe,
    riskLevel,
    "token": token->{
      _id,
      symbol,
      name,
      "slug": slug.current,
      coingeckoId,
      logo,
      contractAddress,
      blockchain
    },
    associatedContent->{
      _id,
      title,
      "slug": slug.current,
      _type
    }
  }
`;

export const TOKEN_QUERY = groq`
  *[_type == "token"] | order(symbol asc) {
    _id,
    symbol,
    name,
    "slug": slug.current,
    coingeckoId,
    logo,
    contractAddress,
    blockchain
  }
`;