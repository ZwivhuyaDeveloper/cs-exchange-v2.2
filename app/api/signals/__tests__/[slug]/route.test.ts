import { NextRequest } from 'next/server';
import { GET } from '../../[slug]/route';
import { Signal } from '@/app/lib/types/signal';
import { expectSuccessfulResponse, validateSignal } from '../test-utils';

describe('GET /api/signals/[slug]', () => {
  // This test requires at least one signal to exist in the database
  it('should return a single signal by slug', async () => {
    // First, get a list of signals to get a valid slug
    const listReq = new NextRequest('http://localhost/api/signals?limit=1');
    const listRes = await import('../../route').then(m => m.GET(listReq));
    const listData = await listRes.json();
    
    if (listData.data.length === 0) {
      console.warn('No signals found in the database. Skipping single signal test.');
      return;
    }
    
    const testSlug = listData.data[0].slug;
    
    // Now test the single signal endpoint
    const req = new NextRequest(`http://localhost/api/signals/${testSlug}`);
    const response = await GET(req, { params: { slug: testSlug } });
    
    expectSuccessfulResponse(response);
    
    const signal: Signal = await response.json();
    validateSignal(signal);
    expect(signal.slug).toBe(testSlug);
  });

  it('should return 404 for non-existent signal', async () => {
    const nonExistentSlug = 'non-existent-slug-123';
    const req = new NextRequest(`http://localhost/api/signals/${nonExistentSlug}`);
    const response = await GET(req, { params: { slug: nonExistentSlug } });
    
    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });
});
