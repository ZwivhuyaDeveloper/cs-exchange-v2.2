// Script to test the API response
const fetch = require('node-fetch');
require('dotenv').config();

async function testApi() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const url = `${baseUrl}/api/signals`;
    
    console.log(`Testing API endpoint: ${url}`);
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (data.signals && data.signals.length > 0) {
      console.log(`\nFound ${data.signals.length} signals in the API response`);
      console.log('First signal sample:', {
        name: data.signals[0].name,
        token: data.signals[0].token?.symbol,
        status: data.signals[0].status,
        accessLevel: data.signals[0].accessLevel
      });
    } else {
      console.log('No signals found in the API response');
      console.log('Pagination info:', data.pagination);
    }
    
    return data;
  } catch (error) {
    console.error('Error testing API:', error);
    throw error;
  }
}

testApi();
