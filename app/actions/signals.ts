import { client } from '@/sanity/lib/client';
import { groq } from 'next-sanity';

export interface FetchSignalsParams {
  page?: number;
  pageSize?: number;
  status?: string;
  category?: string;
  direction?: string;
  search?: string;
}

export interface FetchSignalsResponse {
  data: any[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export async function fetchSignals({
  page = 1,
  pageSize = 12,
  status,
  category,
  direction,
  search,
}: FetchSignalsParams = {}): Promise<FetchSignalsResponse> {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;

  // Build the filter conditions
  const filterConditions = ['_type == "signal"'];
  
  if (status) {
    filterConditions.push(`status == "${status}"`);
  }
  
  if (direction) {
    filterConditions.push(`direction == "${direction}"`);
  }
  
  if (category) {
    filterConditions.push(`category->slug.current == "${category}"`);
  }
  
  if (search) {
    const searchQuery = search.toLowerCase();
    filterConditions.push(`
      (
        token->name match "${searchQuery}*" ||
        token->symbol match "${searchQuery}*" ||
        analyst->name match "${searchQuery}*" ||
        analysis match "*${searchQuery}*"
      )
    `);
  }

  const filter = filterConditions.join(' && ');

  const query = groq`{
    "data": *[${filter}] | order(publishedAt desc) [${start}...${end}] {
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      status,
      direction,
      entryPrice,
      targetPrices,
      stopLoss,
      riskRewardRatio,
      analysis,
      publishedAt,
      updatedAt,
      validUntil,
      timeframe,
      riskLevel,
      confidence,
      marketConditions {
        trend,
        volatility,
        volume,
        marketSentiment
      },
      volumeLevel,
      "token": token->{
        _id,
        name,
        symbol,
        logo,
        "category": category->{ name, slug },
        "chain": chain->{ name, symbol, logo },
        coingeckoId,
        contractAddress
      },
      "analyst": analyst->{
        _id,
        name,
        title,
        avatar,
        bio
      },
      "category": category->{
        _id,
        name,
        slug,
        color,
        description
      }
    },
    "total": count(*[${filter}])
  }`;

  try {
    const { data, total } = await client.fetch<{ data: any[]; total: number }>(query);
    
    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  } catch (error) {
    console.error('Error fetching signals:', error);
    return {
      data: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0
    };
  }
}

export async function fetchSignalBySlug(slug: string) {
  const query = groq`*[_type == "signal" && slug.current == $slug][0] {
    _id,
    _createdAt,
    _updatedAt,
    title,
    slug,
    status,
    direction,
    entryPrice,
    targetPrices,
    stopLoss,
    riskRewardRatio,
    analysis,
    publishedAt,
    validUntil,
    "token": token->{
      _id,
      name,
      symbol,
      logo,
      "category": category->{ name, slug },
      "chain": chain->{ name, symbol, logo },
      coingeckoId,
      contractAddress
    },
    "analyst": analyst->{
      _id,
      name,
      title,
      avatar,
      bio
    },
    "category": category->{
      _id,
      name,
      slug,
      color,
      description
    }
  }`;

  try {
    const signal = await client.fetch(query, { slug });
    return signal || null;
  } catch (error) {
    console.error('Error fetching signal by slug:', error);
    return null;
  }
}

export async function fetchSignalCategories() {
  const query = groq`*[_type == "signalCategory"] | order(name asc) {
    _id,
    name,
    slug,
    color,
    description
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching signal categories:', error);
    return [];
  }
}
