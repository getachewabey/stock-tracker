"use client";

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StockInfo } from './components/StockInfo';
import { PriceChart } from './components/PriceChart';
import { AIAnalysis } from './components/AIAnalysis';
import { NewsFeed } from './components/NewsFeed';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [stockData, setStockData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (symbol: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stock/${symbol}`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setStockData(data.stock);
      setChartData(data.chart);
      setAnalysis(data.analysis);
      setNews(data.news);
    } catch (err: any) {
      console.error("Failed to fetch data", err);
      setError(err.message || 'Failed to load stock data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(ticker);
  }, [ticker]);

  const handleSearch = (symbol: string) => {
    setTicker(symbol);
  };

  const handleRangeChange = async (range: string) => {
    // For now, we only support daily data on the free tier integration.
    // In a production app, we would fetch different resolutions here.
    console.log(`Range changed to ${range} - keeping default view for free tier limit.`);
    // Optionally re-fetch to ensure freshness
    // fetchData(ticker); 
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        <SearchBar onSearch={handleSearch} />

        {error ? (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg text-center">
            {error}. Please try a valid US ticker like AAPL or TSLA.
          </div>
        ) : loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {stockData && <StockInfo data={stockData} />}

            {chartData.length > 0 ? (
              <PriceChart data={chartData} onRangeChange={handleRangeChange} />
            ) : (
              <div className="p-6 bg-white rounded-xl shadow-sm text-center text-gray-500">
                No chart data available for this timeframe.
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {analysis && <AIAnalysis data={analysis} />}
              {news.length > 0 && <NewsFeed news={news} symbol={ticker} />}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
