import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

async function fetchFinnhub(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    const token = FINNHUB_API_KEY || '';

    // DEBUG LOGGING
    console.log(`[API] Fetching ${endpoint}`);
    console.log(`[API] Token First 5 chars: ${token.substring(0, 5)}...`);
    console.log(`[API] Token Length: ${token.length}`);

    url.searchParams.append('token', token);
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });

    if (!res.ok) {
        const errorBody = await res.text();
        console.error(`[API Error] Endpoint: ${endpoint} Status: ${res.status} ${res.statusText}`);
        throw new Error(`Finnhub API error (${endpoint}): ${res.statusText}`);
    }
    return res.json();
}

function formatLargeNumber(num: number) {
    if (!num) return 'N/A';
    if (num >= 1000) return `${(num / 1000).toFixed(2)}B`;
    return `${num.toFixed(2)}M`;
}

// Fallback synthetic analysis
function generateSyntheticAnalysis(symbol: string, changePercent: number) {
    const isBullish = changePercent > 0;
    return {
        symbol: symbol.toUpperCase(),
        summary: `${symbol} is currently trading ${isBullish ? 'up' : 'down'} by ${Math.abs(changePercent).toFixed(2)}%. The technical indicators suggest a ${isBullish ? 'positive' : 'cautious'} outlook in the short term. (Synthetic Analysis - Add Gemini Key for AI)`,
        sentiment: isBullish ? 'bullish' : 'neutral',
        score: isBullish ? 7 : 5,
        insights: [
            `Price trend is ${isBullish ? 'upward' : 'downward'} today.`,
            `Market sentiment appears ${isBullish ? 'optimistic' : 'pessimistic'}.`,
            `Short term volatility is observing normal ranges.`
        ]
    };
}

async function getGeminiAnalysis(symbol: string, price: number, change: number, news: any[]) {
    if (!GEMINI_API_KEY) return null;

    try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash", generationConfig: { responseMimeType: "application/json" } });

        const newsContext = news.slice(0, 3).map((n: any) => `- ${n.headline}: ${n.summary}`).join('\n');

        const prompt = `
      Analyze the stock ${symbol}. 
      Current Price: $${price}
      Daily Change: ${change.toFixed(2)}%
      Recent News:
      ${newsContext}

      Provide a JSON response with:
      - summary: A concise 2-sentence market summary.
      - sentiment: "bullish", "bearish", or "neutral".
      - score: A sentiment score from 1-10 (10 is most bullish).
      - insights: An array of 3-4 short, specific bullet points explaining the analysis.
    `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        return JSON.parse(response.text());
    } catch (error: any) {
        // Suppress "API key leaked" error to prevent log spam
        if (error.message?.includes('403') || error.message?.includes('leaked')) {
            console.warn(`[Gemini] API Key issue detected. Falling back to synthetic analysis. (Error suppressed)`);
        } else {
            console.error("Gemini AI Error:", error);
        }
        return null;
    }
}

export async function GET(request: Request, { params }: { params: { ticker: string } }) {
    const ticker = params.ticker.toUpperCase();

    if (!FINNHUB_API_KEY) {
        return NextResponse.json({ error: 'Finnhub API Key missing' }, { status: 500 });
    }

    try {
        // 1. Fetch Quote (CRITICAL)
        const quote = await fetchFinnhub('/quote', { symbol: ticker });

        if (!quote || quote.c === 0) {
             throw new Error('Stock not found');
        }

        // 2 & 3. Profile and News (Optional - failures ignored)
        let profile: any = {};
        let newsData: any[] = [];
        
        try {
             const [profileRes, newsRes] = await Promise.allSettled([
                fetchFinnhub('/stock/profile2', { symbol: ticker }),
                fetchFinnhub('/company-news', { symbol: ticker, from: new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0], to: new Date().toISOString().split('T')[0] })
             ]);

             if (profileRes.status === 'fulfilled') profile = profileRes.value;
             if (newsRes.status === 'fulfilled') newsData = newsRes.value;
        } catch (e) {
            console.warn('Optional data fetch failed', e);
        }

        // 4. Chart Data Strategy
        let chartData: any[] = [];
        let isSynthetic = false;

        try {
            const toTimestamp = Math.floor(Date.now() / 1000);
            const fromTimestamp = toTimestamp - (30 * 24 * 60 * 60); // 30 days
            
            // Attempt to fetch candles
            const candles = await fetchFinnhub('/stock/candle', { 
                symbol: ticker, 
                resolution: 'D', 
                from: fromTimestamp.toString(), 
                to: toTimestamp.toString() 
            });

            if (candles && candles.s === 'ok' && candles.t && candles.t.length > 0) {
                chartData = candles.t.map((timestamp: number, index: number) => ({
                    time: new Date(timestamp * 1000).toLocaleDateString(),
                    price: candles.c[index]
                }));
            } else {
                 throw new Error('No candle data returned from API');
            }
        } catch (err) {
            console.warn(`Candle fetch failed for ${ticker}:`, err);
            isSynthetic = true;
            
            // --- SYNTHETIC CHART GENERATION ---
            // Create a realistic intraday pattern
            const points = 24; // ~Every 15-20 mins for a trading day simulation
            const open = quote.o || quote.c; 
            const close = quote.c;
            const high = quote.h || Math.max(open, close) * 1.01;
            const low = quote.l || Math.min(open, close) * 0.99;
            const volatility = (high - low) / points || 0.05;

            let currentPrice = open;
            // Market Open 9:30 AM
            const now = new Date();
            const startTime = new Date(now.setHours(9, 30, 0, 0)).getTime(); 
            
            chartData = []; // Ensure empty
            
            for (let i = 0; i < points; i++) {
                // Skew trend towards the actual closing price as day progresses
                const progress = i / points;
                const trend = (close - open) * progress; 
                
                // Add randomness
                const random = (Math.random() - 0.5) * volatility * 2;
                
                // Calculate price
                let price = open + trend + random;
                
                // Clamp within high/low bounds (approximate)
                price = Math.max(low, Math.min(high, price));

                chartData.push({
                    time: new Date(startTime + (i * 20 * 60 * 1000)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    price: Number(price.toFixed(2))
                });
            }
            
            // Force the last point to match current price exactly for data consistency
            if (chartData.length > 0) {
                chartData[chartData.length - 1].price = close;
            }
        }

        // Transform Meta Data
        const stockData = {
            symbol: ticker,
            price: quote.c,
            change: quote.d,
            changePercent: quote.dp,
            high: quote.h,
            low: quote.l,
            volume: 'N/A', 
            marketCap: profile.marketCapitalization ? formatLargeNumber(profile.marketCapitalization) : 'N/A'
        };

        const news = Array.isArray(newsData) ? newsData.slice(0, 5).map((item: any) => ({
            id: item.id || Math.random().toString(),
            title: item.headline,
            summary: item.summary,
            source: item.source,
            time: new Date(item.datetime * 1000).toLocaleDateString(),
            url: item.url
        })) : [];

        // Analysis
        let analysis = await getGeminiAnalysis(ticker, quote.c, quote.dp, news);
        if (!analysis) {
            analysis = generateSyntheticAnalysis(ticker, quote.dp || 0);
        }

        return NextResponse.json({
            stock: stockData,
            chart: chartData,
            isSynthetic,
            news,
            analysis
        });

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
