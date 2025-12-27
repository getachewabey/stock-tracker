const fs = require('fs');
const path = require('path');

async function run() {
  let envFile = '';
  try {
    envFile = fs.readFileSync(path.resolve('.env.local'), 'utf8');
  } catch (e) {
    console.log('No .env.local found');
    return;
  }
  
  const keyLine = envFile.split('\n').find(l => l.startsWith('FINNHUB_API_KEY='));
  let key = keyLine ? keyLine.split('=')[1].trim() : null;
  if (!key) return;
  key = key.replace(/^["'](.*)["']$/, '$1');

  const symbol = 'AAPL';
  // Try Quote
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${key}`;

  console.log(`Fetching Quote...`);

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Quote Data:', data);
    if (data.c) { // current price
        console.log('Quote Request Successful!');
    } else {
        console.log('Quote Request Failed (Logic check).');
    }
  } catch (e) {
    console.error(e);
  }
}

run();
