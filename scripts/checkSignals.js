// Simple script to check for signals in Sanity
export default async function checkSignals(client) {
  const query = `*[_type == "signal"]{
    _id,
    name,
    "token": token->{symbol, name},
    status,
    publishedAt
  }`;
  
  const signals = await client.fetch(query);
  console.log(`Found ${signals.length} signals in the database:`);
  console.log(JSON.stringify(signals, null, 2));
  return signals;
}
