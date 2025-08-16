import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tokenLists = await prisma.tokenList.findMany({
      include: {
        tokens: {
          select: {
            id: true,
            symbol: true,
            name: true,
          },
        },
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    return NextResponse.json(tokenLists);
  } catch (error) {
    console.error('Error fetching token lists:', error);
    return NextResponse.json(
      { error: 'Failed to fetch token lists' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
