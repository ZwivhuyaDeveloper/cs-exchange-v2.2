import { NextRequest } from 'next/server';
import { GET } from '../../categories/route';
import { Category } from '@/app/lib/types/signal';
import { expectSuccessfulResponse, validateCategory } from '../test-utils';

describe('GET /api/signals/categories', () => {
  it('should return a list of categories with signal counts', async () => {
    const req = new NextRequest('http://localhost/api/signals/categories');
    const response = await GET(req);
    
    expectSuccessfulResponse(response);
    
    const categories: Category[] = await response.json();
    
    // Validate each category
    categories.forEach(category => {
      validateCategory(category);
      
      // Count should be a non-negative number
      expect(category.count).toBeGreaterThanOrEqual(0);
    });
    
    // Categories should be sorted by name
    const sortedCategories = [...categories].sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    expect(categories).toEqual(sortedCategories);
  });
});
