// Script to list all signals in the Sanity dataset
const { createClient } = require('next-sanity');
require('dotenv').config();

// Initialize the Sanity client with read-only access
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Use CDN for reads
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-24',
});

async function listSignals() {
  try {
    const query = `*[_type == "signal"]{
      _id,
      _type,
      name,
      status,
      publishedAt,
      "token": token->{name, symbol},
      "analyst": analyst->{displayName},
      direction,
      entryPrice,
      targetPrices,
      stopLoss
    }`;
    
    const signals = await client.fetch(query);
    
    console.log(`\n=== Found ${signals.length} signals in the database ===\n`);
    
    if (signals.length > 0) {
      console.log('Signal List:');
      console.log('----------------------------------------');
      signals.forEach((signal, index) => {
        console.log(`\n#${index + 1} ${signal.name}`);
        console.log(`ID: ${signal._id}`);
        console.log(`Status: ${signal.status}`);
        console.log(`Token: ${signal.token?.symbol} (${signal.token?.name})`);
        console.log(`Analyst: ${signal.analyst?.displayName}`);
        console.log(`Direction: ${signal.direction}`);
        console.log(`Entry: $${signal.entryPrice}`);
        console.log(`Targets: ${signal.targetPrices?.join(', ') || 'N/A'}`);
        console.log(`Stop Loss: $${signal.stopLoss || 'N/A'}`);
        console.log(`Published: ${signal.publishedAt || 'Not published'}`);
        console.log('----------------------------------------');
      });
    } else {
      console.log('No signals found in the database.');
      console.log('To create signals, use the Sanity Studio at http://localhost:3000/studio');
    }
    
    return signals;
  } catch (error) {
    console.error('Error listing signals:', error);
    throw error;
  }
}

listSignals();
