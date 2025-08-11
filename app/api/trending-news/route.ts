import { NextResponse } from 'next/server';
import { client } from '@/app/lib/sanity';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const query = `
      *[_type == 'news' && category->name == "Trending"] | order(_createdAt desc) [0...5] {
        title,
        smallDescription,
        "currentSlug": slug.current,
        titleImage,
        "categoryName": category->name,
        category,
        publishedAt,
        tags[]->{
          name,
          color
        },
        impacts[]->{
          name,
          color
        }
      }`;

    const data = await client.fetch(query);
    
    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=30, stale-while-revalidate'
      }
    });
  } catch (error) {
    console.error('Error fetching trending news:', error);
    return new NextResponse(
      JSON.stringify({ error: 'Failed to fetch trending news' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}
