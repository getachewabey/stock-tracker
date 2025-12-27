const fs = require('fs');
const path = require('path');

// Mock specific environment setup for testing
async function run() {
  // 1. Load Env (Simulated)
  let envFile = '';
  try {
    envFile = fs.readFileSync(path.resolve('.env.local'), 'utf8');
  } catch (e) {
    console.log('No .env.local found');
    return;
  }
  
  const keyLine = envFile.split('\n').find(l => l.startsWith('FINNHUB_API_KEY='));
  const key = keyLine ? keyLine.split('=')[1].trim() : null;

  if (!key) {
    console.error('FINNHUB_API_KEY not found in .env.local');
    return;
  }

  console.log('Found API Key (last 4 chars):', key.slice(-4));

  // 2. Fetch Data
  const to = Math.floor(Date.now() / 1000);
  const from = to - (30 * 24 * 60 * 60); // 30 days
  const symbol = 'AAPL';
  const url = `https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=D&from=${from}&to=${to}&token=${key}`;

  console.log(`Fetching ${url.replace(key, 'HIDDEN')}...`);

  try {
    const res = await fetch(url);
    if (!res.ok) {
        console.error('Fetch failed:', res.status, res.statusText);
        const text = await res.text();
        console.error('Body:', text);
        return;
    }
    const data = await res.json();
    console.log('Response Status (s):', data.s);
    
    if (data.s === 'ok') {
        console.log('Data Points (t):', data.t ? data.t.length : 0);
        console.log('First 2 candles:', data.c ? data.c.slice(0, 2) : 'No prices');
    } else {
        console.error('API Error Response:', data);
    }

  } catch (e) {
    console.error('Script Error:', e);
  }
}

run();
