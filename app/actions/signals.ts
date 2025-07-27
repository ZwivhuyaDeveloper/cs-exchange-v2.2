'use server';

import { Signal } from '@/app/lib/types/signal';

interface FetchSignalsParams {
  page?: number;
  limit?: number;
  status?: string;
  category?: string;
  direction?: string;
}

export async function fetchSignals({
  page = 1,
  limit = 12,
  status,
  category,
  direction,
}: FetchSignalsParams = {}) {
  try {
    // Build query parameters
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(status && { status }),
      ...(category && { category }),
      ...(direction && { direction }),
    });

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/signals?${params.toString()}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch signals');
    }

    const data = await response.json();
    return data as { data: Signal[]; pagination: any };
  } catch (error) {
    console.error('Error fetching signals:', error);
    return { data: [], pagination: null };
  }
}

// Fetch a single signal by slug
export async function fetchSignalBySlug(slug: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/signals/${slug}`,
      {
        next: { revalidate: 60 }, // Revalidate every 60 seconds
      }
    );

    if (!response.ok) {
      throw new Error('Signal not found');
    }

    const data = await response.json();
    return data as Signal;
  } catch (error) {
    console.error(`Error fetching signal with slug ${slug}:`, error);
    return null;
  }
}

// Fetch all signal categories
export async function fetchSignalCategories() {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/signals/categories`,
      {
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch signal categories');
    }

    const data = await response.json();
    return data as { name: string; slug: string; count: number }[];
  } catch (error) {
    console.error('Error fetching signal categories:', error);
    return [];
  }
}
