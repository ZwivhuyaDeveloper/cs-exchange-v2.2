// app/api/signals/categories/route.ts
import { NextResponse } from 'next/server';
import { clientFetch } from '../sanity';

const categoriesQuery = `*[_type == "signalCategory"] | order(name asc) {
  _id,
  name,
  "slug": slug.current,
  description,
  color,
  "count": count(*[_type == "signal" && references(^._id)])
}`;

export async function GET() {
  try {
    const categories = await clientFetch(categoriesQuery);
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}