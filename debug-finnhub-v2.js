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

  if (!key) { console.error('No key'); return; }

  // CAREFUL STRIP QUOTES
  key = key.replace(/^["'](.*)["']$/, '$1');

  console.log('Cleaned Key (last 4 chars):', key.slice(-4));

  const to = Math.floor(Date.now() / 1000);
  const from = to - (30 * 24 * 60 * 60); 
  const symbol = 'AAPL';
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${key}`;

  console.log(`Fetching...`);

  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log('Status (s):', data.s);
    if (data.s === 'ok') {
        console.log('Success! Data points:', data.t.length);
    } else {
        console.log('Failed:', data);
    }
  } catch (e) {
    console.error(e);
  }
}

run();
