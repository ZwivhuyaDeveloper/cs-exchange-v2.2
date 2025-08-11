// Script to test the API with detailed logging
const https = require('https');
const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/signals',
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'User-Agent': 'CS-Exchange-Test-Script'
  }
};

console.log('Making request to:', `http://${options.hostname}:${options.port}${options.path}`);

const req = http.request(options, (res) => {
  console.log(`Status Code: ${res.statusCode}`);
  console.log('Response Headers:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      console.log('Response Body:');
      if (data) {
        const json = JSON.parse(data);
        console.log(JSON.stringify(json, null, 2));
      } else {
        console.log('(Empty response)');
      }
    } catch (e) {
      console.log('Error parsing JSON:', e);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request error:', error);
});

req.end();
