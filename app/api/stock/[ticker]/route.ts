import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const FINNHUB_API_KEY = process.env.FINNHUB_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const BASE_URL = 'https://finnhub.io/api/v1';

async function fetchFinnhub(endpoint: string, params: Record<string, string> = {}) {
    const url = new URL(`${BASE_URL}${endpoint}`);
    url.searchParams.append('token', FINNHUB_API_KEY || '');
    Object.entries(params).forEach(([key, value]) => url.searchParams.append(key, value));

    const res = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!res.ok) throw new Error(`Finnhub API error: ${res.statusText}`);
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
    } catch (error) {
        console.error("Gemini AI Error:", error);
        return null;
    }
}

export async function GET(request: Request, { params }: { params: { ticker: string } }) {
    const ticker = params.ticker.toUpperCase();

    if (!FINNHUB_API_KEY) {
        return NextResponse.json({ error: 'Finnhub API Key missing' }, { status: 500 });
    }

    try {
        // 1. Fetch Quote
        const quote = await fetchFinnhub('/quote', { symbol: ticker });

        // 2. Fetch Profile
        const profile = await fetchFinnhub('/stock/profile2', { symbol: ticker });

        // 3. Fetch News 
        const today = new Date().toISOString().split('T')[0];
        const yesterday = new Date(Date.now() - 86400000 * 2).toISOString().split('T')[0];
        const newsData = await fetchFinnhub('/company-news', { symbol: ticker, from: yesterday, to: today });

        // 4. Fetch Candles 
        const toTimestamp = Math.floor(Date.now() / 1000);
        const fromTimestamp = toTimestamp - (30 * 24 * 60 * 60);
        const candles = await fetchFinnhub('/stock/candle', { symbol: ticker, resolution: 'D', from: fromTimestamp.toString(), to: toTimestamp.toString() });

        // Transform Data
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

        let chartData = [];
        if (candles.s === 'ok' && candles.t) {
            chartData = candles.t.map((timestamp: number, index: number) => ({
                time: new Date(timestamp * 1000).toLocaleDateString(),
                price: candles.c[index]
            }));
        }

        const news = Array.isArray(newsData) ? newsData.slice(0, 5).map((item: any) => ({
            id: item.id,
            title: item.headline,
            summary: item.summary,
            source: item.source,
            time: new Date(item.datetime * 1000).toLocaleDateString(),
            url: item.url
        })) : [];

        // Analysis - Try Gemini, fall back to Synthetic
        let analysis = await getGeminiAnalysis(ticker, quote.c, quote.dp, newsData || []);
        if (!analysis) {
            analysis = generateSyntheticAnalysis(ticker, quote.dp || 0);
        }

        return NextResponse.json({
            stock: stockData,
            chart: chartData,
            news,
            analysis
        });

    } catch (error: any) {
        console.error('API Route Error:', error);
        return NextResponse.json({ error: error.message || 'Failed to fetch data' }, { status: 500 });
    }
}
