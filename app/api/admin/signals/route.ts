import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { createClient } from '@sanity/client';

const prisma = new PrismaClient();

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2023-05-03',
  useCdn: false,
});

async function checkUserPermissions(userId: string) {
  const userRole = await prisma.userRole.findUnique({
    where: { userId }
  });

  return userRole?.role === 'admin' || userRole?.role === 'analyst';
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin or analyst permissions
    const hasPermission = await checkUserPermissions(userId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      name,
      tokenId,
      categoryId,
      direction,
      signalType,
      entryPrice,
      targetPrices,
      stopLoss,
      timeframe,
      riskLevel,
      confidence,
      accessLevel,
      priority,
      featured,
      notes,
      isDraft = false,
      analystId
    } = body;

    // Validate required fields
    if (!name || !tokenId || !direction || !entryPrice) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get analyst profile
    let analystProfile = await prisma.analystProfile.findUnique({
      where: { userId: analystId }
    });

    // Create analyst profile if it doesn't exist
    if (!analystProfile) {
      analystProfile = await prisma.analystProfile.create({
        data: {
          userId: analystId,
          displayName: `Analyst ${analystId.slice(-6)}`, // Temporary name
          slug: `analyst-${analystId.slice(-6)}`,
          tier: 'basic',
          isActive: true,
          isVerified: false,
        }
      });
    }

    // Create signal document in Sanity
    const signalDoc = {
      _type: 'signal',
      name,
      slug: {
        _type: 'slug',
        current: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      },
      token: {
        _type: 'reference',
        _ref: tokenId
      },
      category: categoryId ? {
        _type: 'reference',
        _ref: categoryId
      } : undefined,
      analyst: {
        _type: 'reference',
        _ref: analystProfile.id
      },
      direction,
      signalType: signalType || 'other',
      entryPrice: parseFloat(entryPrice),
      targetPrices: targetPrices.filter((price: string) => price.trim()).map((price: string) => parseFloat(price)),
      stopLoss: stopLoss ? parseFloat(stopLoss) : undefined,
      timeframe,
      riskLevel,
      confidence: confidence ? parseFloat(confidence) : undefined,
      accessLevel,
      priority,
      featured: featured || false,
      status: isDraft ? 'draft' : 'active',
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Remove undefined fields
    Object.keys(signalDoc).forEach(key => {
      if (signalDoc[key as keyof typeof signalDoc] === undefined) {
        delete signalDoc[key as keyof typeof signalDoc];
      }
    });

    const createdSignal = await sanityClient.create(signalDoc);

    // Create signal performance record in Prisma
    await prisma.signalPerformance.create({
      data: {
        signalId: createdSignal._id,
        analystId: analystProfile.id,
        entryPrice: parseFloat(entryPrice),
        currentPrice: parseFloat(entryPrice), // Initialize with entry price
        unrealizedPnl: 0,
        realizedPnl: 0,
        status: isDraft ? 'draft' : 'active',
      }
    });

    // Create signal analytics record
    await prisma.signalAnalytics.create({
      data: {
        signalId: createdSignal._id,
        views: 0,
        likes: 0,
        shares: 0,
        comments: 0,
        followers: 0,
      }
    });

    return NextResponse.json({
      success: true,
      signal: createdSignal,
      message: `Signal ${isDraft ? 'saved as draft' : 'created'} successfully`
    });

  } catch (error) {
    console.error('Error creating signal:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user has admin or analyst permissions
    const hasPermission = await checkUserPermissions(userId);
    
    if (!hasPermission) {
      return NextResponse.json(
        { error: 'Insufficient permissions' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || '';

    // Build Sanity query
    let query = '*[_type == "signal"';
    
    if (search) {
      query += ` && (name match "${search}*" || notes match "${search}*")`;
    }
    
    if (status) {
      query += ` && status == "${status}"`;
    }
    
    query += '] | order(_createdAt desc)';
    
    // Add pagination
    const offset = (page - 1) * limit;
    query += `[${offset}...${offset + limit}]`;
    
    // Add field selection
    query += `{
      _id,
      _createdAt,
      _updatedAt,
      name,
      slug,
      token->{_id, symbol, name, logoURL},
      category->{_id, name, color},
      analyst->{_id, displayName, tier},
      direction,
      signalType,
      entryPrice,
      targetPrices,
      stopLoss,
      timeframe,
      riskLevel,
      confidence,
      accessLevel,
      priority,
      featured,
      status,
      notes
    }`;

    const signals = await sanityClient.fetch(query);

    // Get performance data from Prisma
    const signalIds = signals.map((signal: any) => signal._id);
    const performanceData = await prisma.signalPerformance.findMany({
      where: {
        signalId: { in: signalIds }
      },
      include: {
        analyst: true
      }
    });

    // Get analytics data
    const analyticsData = await prisma.signalAnalytics.findMany({
      where: {
        signalId: { in: signalIds }
      }
    });

    // Merge data
    const enrichedSignals = signals.map((signal: any) => {
      const performance = performanceData.find(p => p.signalId === signal._id);
      const analytics = analyticsData.find(a => a.signalId === signal._id);
      
      return {
        ...signal,
        performance,
        analytics
      };
    });

    // Get total count for pagination
    const totalQuery = `count(*[_type == "signal"${search ? ` && (name match "${search}*" || notes match "${search}*")` : ''}${status ? ` && status == "${status}"` : ''}])`;
    const total = await sanityClient.fetch(totalQuery);

    return NextResponse.json({
      signals: enrichedSignals,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error fetching signals:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
