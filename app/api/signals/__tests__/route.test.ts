import { NextRequest } from 'next/server';
import { GET } from '../route';
import { Signal } from '@/app/lib/types/signal';
import { expectSuccessfulResponse, validateSignal, validatePagination } from './test-utils';

describe('GET /api/signals', () => {
  it('should return a list of signals with pagination', async () => {
    const req = new NextRequest('http://localhost/api/signals');
    const response = await GET(req);
    
    expectSuccessfulResponse(response);
    
    const data = await response.json();
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('pagination');
    
    // Validate pagination
    validatePagination(data.pagination);
    
    // Validate each signal
    if (data.data.length > 0) {
      data.data.forEach((signal: Signal) => {
        validateSignal(signal);
      });
    }
  });

  it('should filter signals by status', async () => {
    const req = new NextRequest('http://localhost/api/signals?status=active');
    const response = await GET(req);
    
    expectSuccessfulResponse(response);
    
    const data = await response.json();
    if (data.data.length > 0) {
      data.data.forEach((signal: Signal) => {
        expect(signal.status).toBe('active');
      });
    }
  });

  it('should respect pagination parameters', async () => {
    const limit = 2;
    const req1 = new NextRequest(`http://localhost/api/signals?limit=${limit}&page=1`);
    const response1 = await GET(req1);
    
    expectSuccessfulResponse(response1);
    
    const data1 = await response1.json();
    expect(data1.data.length).toBeLessThanOrEqual(limit);
    
    if (data1.pagination.total > limit) {
      const req2 = new NextRequest(`http://localhost/api/signals?limit=${limit}&page=2`);
      const response2 = await GET(req2);
      expectSuccessfulResponse(response2);
      
      const data2 = await response2.json();
      expect(data2.data[0]._id).not.toBe(data1.data[0]._id);
    }
  });
});
