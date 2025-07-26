import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { client } from '@/app/lib/sanity';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GROQ query for fetching signals with filters
const SIGNALS_QUERY = `
  *[_type == "signal" && !(_id in path("drafts.**"))] | order(publishedAt desc) {
    _id,
    name,
    slug,
    token->{
      _id,
      symbol,
      name,
      logoURL,
      coingeckoId
    },
    analyst->{
      _id,
      displayName,
      avatar,
      isVerified,
      tier
    },
    category->{
      _id,
      name,
      color,
      icon
    },
    direction,
    signalType,
    entryPrice,
    targetPrices,
    stopLoss,
    status,
    accessLevel,
    priority,
    featured,
    confidence,
    riskLevel,
    timeframe,
    publishedAt,
    lastUpdated
  }
`;

// GET /api/signals - Fetch signals with filtering and pagination
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();
    const { searchParams } = new URL(request.url);
    
    // Extract query parameters
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const category = searchParams.get('category');
    const tokenSymbol = searchParams.get('token');
    const direction = searchParams.get('direction');
    const status = searchParams.get('status');
    const analyst = searchParams.get('analyst');
    const accessLevel = searchParams.get('accessLevel');
    const featured = searchParams.get('featured') === 'true';
    
    // Get user's subscription and role for access control
    let userSubscription = null;
    let userRole = 'user';
    
    if (userId) {
      const [subscription, role] = await Promise.all([
        prisma.userSubscription.findFirst({
          where: { userId, status: 'active' },
          include: { tier: true }
        }),
        prisma.userRole.findUnique({
          where: { userId }
        })
      ]);
      
      userSubscription = subscription;
      userRole = role?.role || 'user';
    }
    
    // Build Sanity query with enhanced token data
    let query = `*[_type == "signal"`;
    
    // Add filters
    const filters = [];
    if (tokenSymbol) {
      filters.push(`token->symbol match "${tokenSymbol}*"`);
    }
    if (direction && direction !== 'all') {
      filters.push(`direction == "${direction}"`);
    }
    if (status && status !== 'all') {
      filters.push(`status == "${status}"`);
    }
    if (category) {
      filters.push(`category->slug.current == "${category}"`);
    }
    if (analyst) {
      filters.push(`analyst->slug.current == "${analyst}"`);
    }
    if (featured) {
      filters.push(`featured == true`);
    }
    
    if (filters.length > 0) {
      query += ` && (${filters.join(' && ')})`;
    }
    
    // Apply access control based on user role and subscription
    if (userRole === 'admin') {
      // Admin can see all signals
    } else if (userRole === 'analyst') {
      // Analysts can see public, premium, and their own signals
      query += ` && (accessLevel in ["public", "premium"] || analyst->userId == "${userId}")`;
    } else if (userSubscription?.tier.premiumAccess) {
      // Premium users can see public and premium signals
      query += ` && accessLevel in ["public", "premium"]`;
    } else {
      // Free users can only see public signals
      query += ` && accessLevel == "public"`;
    }
    
    // Add sorting and pagination
    const offset = (page - 1) * limit;
    query += `] | order(_createdAt desc)[${offset}...${offset + limit}]`;
    
    // Enhanced field selection with token data
    query += `{
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      token->{
        _id,
        symbol,
        name,
        logoURL,
        address,
        chainId,
        coingeckoId,
        tradingViewSymbol,
        type,
        decimals
      },
      category->{
        _id,
        name,
        slug,
        color,
        icon
      },
      analyst->{
        _id,
        displayName,
        slug,
        avatar,
        tier,
        isVerified,
        specializations,
        successRate,
        avgReturn,
        totalSignals
      },
      direction,
      signalType,
      entryPrice,
      targetPrices,
      stopLoss,
      riskRewardRatio,
      positionSize,
      timeframe,
      riskLevel,
      confidence,
      accessLevel,
      priority,
      featured,
      status,
      notes,
      technicalAnalysis,
      marketConditions
    }`;

    const signals = await client.fetch(query);
    
    // Fetch performance data from Prisma for each signal
    const signalsWithPerformance = await Promise.all(
      signals.map(async (signal: any) => {
        const performance = await prisma.signalPerformance.findFirst({
          where: { signalId: signal._id }
        });
        
        const analytics = await prisma.signalAnalytics.findFirst({
          where: { signalId: signal._id },
          orderBy: { date: 'desc' }
        });
        
        return {
          ...signal,
          performance: performance ? {
            pnlPercentage: performance.pnlPercentage,
            pnlUsd: performance.pnlUsd,
            daysActive: performance.daysActive,
            hitTargets: performance.hitTargets,
            totalTargets: performance.totalTargets
          } : null,
          analytics: analytics ? {
            views: analytics.views,
            likes: analytics.likes,
            shares: analytics.shares
          } : null
        };
      })
    );
    
    // Get total count for pagination
    const countQuery = query.replace(/\[.*\]$/, '').replace('| order(publishedAt desc)', '');
    const totalSignals = await client.fetch(`count(${countQuery})`);
    
    return NextResponse.json({
      signals: signalsWithPerformance,
      pagination: {
        page,
        limit,
        total: totalSignals,
        pages: Math.ceil(totalSignals / limit)
      },
      userAccess: {
        role: userRole,
        subscription: userSubscription?.tier.name || 'Free',
        premiumAccess: userSubscription?.tier.premiumAccess || false
      }
    });
    
  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}

// POST /api/signals - Create a new signal (admin/analyst only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }
    
    // Check user role
    const userRole = await prisma.userRole.findUnique({
      where: { userId }
    });
    
    if (!userRole || !['admin', 'analyst'].includes(userRole.role)) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }
    
    const body = await request.json();
    
    // Create signal in Sanity (this would typically be done through Sanity Studio)
    // For now, return success response
    return NextResponse.json({
      message: 'Signal creation endpoint ready',
      note: 'Signals are typically created through Sanity Studio'
    });
    
  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json(
      { error: 'Failed to create signal' },
      { status: 500 }
    );
  }
}
