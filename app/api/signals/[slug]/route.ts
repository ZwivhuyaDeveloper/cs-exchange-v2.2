// app/api/signals/[slug]/route.ts
import { NextResponse } from 'next/server';
import { clientFetch } from '../sanity';

type RouteParams = {
  params: {
    slug: string;
  };
};

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  // Access slug directly from params without destructuring
  const slug = params.slug;

  const signalQuery = `*[_type == "signal" && slug.current == $slug][0] {
    _id,
    name,
    "slug": slug.current,
    "token": token->{
      name, 
      symbol, 
      "logo": logo.asset->url,
      price,
      priceChange24h,
      marketCap,
      volume24h
    },
    "analyst": analyst->{
      name,
      "slug": slug.current,
      "image": image.asset->url,
      bio,
      socialLinks
    },
    "category": category->{name, "slug": slug.current, color},
    direction,
    signalType,
    entryPrice,
    targetPrices,
    stopLoss,
    riskRewardRatio,
    status,
    publishedAt,
    exitPrice,
    exitDate,
    notes,
    technicalAnalysis,
    timeframes,
    confidenceLevel,
    tags
  }`;

  try {
    const signal = await clientFetch(signalQuery, { slug });
    
    if (!signal) {
      return NextResponse.json(
        { error: 'Signal not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(signal);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch signal' },
      { status: 500 }
    );
  }
}