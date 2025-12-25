export const getStockData = async (symbol: string) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    const basePrice = Math.random() * 1000 + 50;
    const change = (Math.random() * 10) - 4;

    return {
        symbol: symbol.toUpperCase(),
        price: basePrice,
        change: change,
        changePercent: (change / basePrice) * 100,
        high: basePrice + Math.random() * 10,
        low: basePrice - Math.random() * 10,
        volume: `${(Math.random() * 50 + 10).toFixed(1)}M`,
        marketCap: `${(Math.random() * 2 + 0.5).toFixed(1)}T`
    };
};

export const getChartData = async (symbol: string, range: string = '1D') => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const points = range === '1D' ? 24 : range === '1W' ? 7 : 30;
    const data = [];
    let currentPrice = Math.random() * 1000 + 50;

    for (let i = 0; i < points; i++) {
        currentPrice = currentPrice + (Math.random() * 20 - 10);
        // Ensure positive price
        currentPrice = Math.max(currentPrice, 1);

        let timeLabel = '';
        if (range === '1D') timeLabel = `${i}:00`;
        else if (range === '1W') timeLabel = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i];
        else timeLabel = `Day ${i + 1}`;

        data.push({
            time: timeLabel,
            price: currentPrice
        });
    }
    return data;
};

export const getAnalysis = async (symbol: string) => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const isBullish = Math.random() > 0.4;

    return {
        symbol: symbol.toUpperCase(),
        summary: `Based on recent market performance, ${symbol} shows ${isBullish ? 'strong momentum with solid fundamentals' : 'signs of consolidation with mixed signals'}. The company has demonstrated ${isBullish ? 'consistent revenue growth' : 'volatile trading patterns'} and maintains a ${isBullish ? 'competitive' : 'challenging'} position in its sector.`,
        sentiment: isBullish ? 'bullish' : 'neutral',
        score: isBullish ? 8.5 : 5.8,
        insights: [
            `Trading ${isBullish ? 'above' : 'below'} key moving averages indicating ${isBullish ? 'bullish' : 'cautionary'} sentiment`,
            `Strong Institutional buying pressure observed in the last quarter`,
            `Recent earnings ${isBullish ? 'beat' : 'met'} analyst expectations`,
            `Sector outlook remains positive with growth catalysts ahead`
        ]
    };
};

export const getNews = async (symbol: string) => {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
        {
            id: '1',
            title: `${symbol} Reports Strong Quarterly Earnings`,
            summary: 'Company exceeds analyst expectations with robust revenue growth and improved margins...',
            source: 'Financial Times',
            time: '2 hours ago',
            url: '#'
        },
        {
            id: '2',
            title: 'Analysts Upgrade Price Target',
            summary: 'Major investment banks raise price targets following positive sector trends and strong fundamentals...',
            source: 'Bloomberg',
            time: '5 hours ago',
            url: '#'
        },
        {
            id: '3',
            title: `${symbol} Announces New Product Launch`,
            summary: 'Strategic expansion into new market segments positions company for continued growth...',
            source: 'Reuters',
            time: '1 day ago',
            url: '#'
        }
    ];
};
