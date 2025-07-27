// Script to create a test signal in Sanity
const { createClient } = require('next-sanity');
require('dotenv').config();

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  token: process.env.SANITY_API_WRITE_TOKEN, // You'll need a write token with permissions
  useCdn: false, // Don't use CDN for writes
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-24',
});

async function createTestSignal() {
  try {
    // First, check if we have a token and analyst
    const [tokens, analysts] = await Promise.all([
      client.fetch('*[_type == "token"]{_id, name, symbol}'),
      client.fetch('*[_type == "analystProfile"]{_id, displayName}')
    ]);

    if (tokens.length === 0 || analysts.length === 0) {
      console.error('Error: No tokens or analysts found in the database');
      console.log('Available tokens:', tokens);
      console.log('Available analysts:', analysts);
      return;
    }

    // Create a new signal
    const signal = {
      _type: 'signal',
      name: 'Test Signal - ' + new Date().toISOString(),
      token: {
        _type: 'reference',
        _ref: tokens[0]._id
      },
      analyst: {
        _type: 'reference',
        _ref: analysts[0]._id
      },
      direction: 'buy',
      signalType: 'swing_trade',
      entryPrice: 100,
      targetPrices: [110, 120, 130],
      stopLoss: 95,
      status: 'active',
      riskLevel: 'medium',
      confidence: 7,
      timeframe: '1-2 weeks',
      publishedAt: new Date().toISOString(),
      accessLevel: 'public',
      notes: 'This is a test signal created by the script.',
    };

    // Create the signal
    const result = await client.create(signal);
    console.log('Successfully created test signal:', result);
    
    // Publish the signal
    const published = await client.patch(result._id).set({ publishedAt: new Date().toISOString() }).commit();
    console.log('Successfully published test signal:', published);
    
  } catch (error) {
    console.error('Error creating test signal:', error);
  }
}

createTestSignal();
