// Script to check signal access levels
const { createClient } = require('next-sanity');
require('dotenv').config();

// Initialize the Sanity client
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-07-24',
});

async function checkSignalAccess() {
  try {
    // Get all signals with their access levels
    const query = `*[_type == "signal"]{
      _id,
      name,
      accessLevel,
      status,
      publishedAt,
      "token": token->{symbol, name}
    }`;
    
    const signals = await client.fetch(query);
    
    console.log(`\n=== Checking Access Levels for ${signals.length} Signals ===\n`);
    
    if (signals.length > 0) {
      signals.forEach((signal, index) => {
        console.log(`#${index + 1} ${signal.name}`);
        console.log(`ID: ${signal._id}`);
        console.log(`Token: ${signal.token?.symbol} (${signal.token?.name})`);
        console.log(`Access Level: ${signal.accessLevel || 'Not set (defaulting to private)'}`);
        console.log(`Status: ${signal.status}`);
        console.log(`Published: ${signal.publishedAt || 'Not published'}`);
        console.log('----------------------------------------');
      });
      
      // Count signals by access level
      const accessLevels = signals.reduce((acc, signal) => {
        const level = signal.accessLevel || 'not_set';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});
      
      console.log('\n=== Access Level Summary ===');
      console.log(accessLevels);
      
    } else {
      console.log('No signals found in the database.');
    }
    
    return signals;
  } catch (error) {
    console.error('Error checking signal access levels:', error);
    throw error;
  }
}

checkSignalAccess();
