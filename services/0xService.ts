import { PriceResponse, QuoteResponse } from '@/src/utils/types';
import qs from 'qs';

const BASE_URL = 'https://api.0x.org';
const API_KEY = process.env.ZEROX_API_KEY || 'your-api-key';

export const fetchPrice = async (params: any): Promise<PriceResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/swap/v1/price?${qs.stringify(params)}`, {
      headers: { '0x-api-key': API_KEY }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reason || 'Failed to fetch price');
    }
    
    return response.json();
  } catch (error) {
    console.error('0x API price error:', error);
    throw error;
  }
};

export const fetchQuote = async (params: any): Promise<QuoteResponse> => {
  try {
    const response = await fetch(`${BASE_URL}/swap/v1/quote?${qs.stringify(params)}`, {
      headers: { '0x-api-key': API_KEY }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.reason || 'Failed to fetch quote');
    }
    
    return response.json();
  } catch (error) {
    console.error('0x API quote error:', error);
    throw error;
  }
};