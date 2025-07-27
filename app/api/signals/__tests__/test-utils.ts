import { NextResponse } from 'next/server';
import { Signal, Category } from '@/app/lib/types/signal';
import { mockSuccessfulResponse, mockErrorResponse, resetMocks } from './__mocks__/sanity';

// Reset mocks before each test
afterEach(() => {
  resetMocks();
});

export function expectSuccessfulResponse(response: NextResponse) {
  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toContain('application/json');
}

export function validateSignal(signal: Signal) {
  // Required fields
  expect(signal).toHaveProperty('_id');
  expect(signal).toHaveProperty('name');
  expect(signal).toHaveProperty('slug');
  expect(signal).toHaveProperty('token');
  expect(signal).toHaveProperty('analyst');
  expect(signal).toHaveProperty('direction');
  expect(signal).toHaveProperty('entryPrice');
  expect(signal).toHaveProperty('targetPrices');
  expect(signal).toHaveProperty('status');
  expect(signal).toHaveProperty('publishedAt');

  // Token validation
  expect(signal.token).toHaveProperty('name');
  expect(signal.token).toHaveProperty('symbol');
  expect(signal.token).toHaveProperty('logo');

  // Analyst validation
  expect(signal.analyst).toHaveProperty('name');
  expect(signal.analyst).toHaveProperty('slug');
  expect(signal.analyst).toHaveProperty('image');

  // Validate enum values
  expect(['buy', 'sell', 'long', 'short']).toContain(signal.direction);
  expect([
    'active', 'filled', 'target_hit', 'stop_loss', 'completed', 'canceled', 'expired'
  ]).toContain(signal.status);
}

export function validateCategory(category: Category) {
  expect(category).toHaveProperty('_id');
  expect(category).toHaveProperty('name');
  expect(category).toHaveProperty('slug');
  expect(category).toHaveProperty('color');
  expect(category).toHaveProperty('count');
  expect(typeof category.count).toBe('number');
}

export function validatePagination(pagination: any) {
  expect(pagination).toHaveProperty('page');
  expect(pagination).toHaveProperty('limit');
  expect(pagination).toHaveProperty('total');
  expect(pagination).toHaveProperty('totalPages');
  expect(pagination).toHaveProperty('hasNextPage');
  expect(pagination).toHaveProperty('hasPreviousPage');
  expect(typeof pagination.page).toBe('number');
  expect(typeof pagination.limit).toBe('number');
  expect(typeof pagination.total).toBe('number');
  expect(typeof pagination.totalPages).toBe('number');
  expect(typeof pagination.hasNextPage).toBe('boolean');
  expect(typeof pagination.hasPreviousPage).toBe('boolean');
}
