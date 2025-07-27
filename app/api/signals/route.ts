// app/api/signals/route.ts
import { NextResponse } from 'next/server';
import { clientFetch } from './sanity';

// Types
type PaginationParams = {
  page?: string;
  limit?: string;
  status?: string;
  category?: string;
  direction?: string;
};

// Constants
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

// Main GET handler
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params = parseSearchParams(searchParams);
    
    const { data, pagination } = await fetchSignalsWithPagination(params);
    
    return NextResponse.json({
      data,
      pagination,
    });
  } catch (error) {
    console.error('Signals API Error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch signals',
        details: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}

// Helper functions
function parseSearchParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || String(DEFAULT_PAGE)) || DEFAULT_PAGE);
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get('limit') || String(DEFAULT_LIMIT)) || DEFAULT_LIMIT)
  );
  const status = searchParams.get('status') || undefined;
  const category = searchParams.get('category') || undefined;
  const direction = searchParams.get('direction') || undefined;

  return {
    page,
    limit,
    ...(status && { status }),
    ...(category && { category }),
    ...(direction && { direction }),
  };
}

type FetchSignalsParams = ReturnType<typeof parseSearchParams>;

async function fetchSignalsWithPagination(params: FetchSignalsParams) {
  const { page, limit, status, category, direction } = params;
  const offset = (page - 1) * limit;

  // Build the GROQ query with filters
  const filters = [
    '_type == "signal"',
    status ? 'status == $status' : null,
    category ? 'category->slug.current == $category' : null,
    direction ? 'direction == $direction' : null,
  ].filter(Boolean).join(' && ');

  const countQuery = `count(*[${filters}])`;
  const signalsQuery = `*[${filters}] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    name,
    "slug": slug.current,
    "token": token->{name, symbol, "logo": logo.asset->url},
    "analyst": analyst->{name, "slug": slug.current, "image": image.asset->url},
    "category": category->{name, "slug": slug.current, color},
    direction,
    signalType,
    entryPrice,
    targetPrices,
    stopLoss,
    riskRewardRatio,
    status,
    publishedAt,
    notes,
    _createdAt,
    _updatedAt
  }`;

  // Execute queries in parallel
  const [total, signals] = await Promise.all([
    clientFetch<number>(countQuery, { status, category, direction }),
    clientFetch(signalsQuery, { status, category, direction })
  ]);

  return {
    data: signals,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: (offset + limit) < total,
      hasPreviousPage: offset > 0,
    },
  };
}