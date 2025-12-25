"use client";

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StockInfo } from './components/StockInfo';
import { PriceChart } from './components/PriceChart';
import { AIAnalysis } from './components/AIAnalysis';
import { NewsFeed } from './components/NewsFeed';
import { getStockData, getChartData, getAnalysis, getNews } from '@/lib/mockData';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [stockData, setStockData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [analysis, setAnalysis] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (symbol: string) => {
    setLoading(true);
    try {
      const [stock, chart, analysisData, newsData] = await Promise.all([
        getStockData(symbol),
        getChartData(symbol),
        getAnalysis(symbol),
        getNews(symbol)
      ]);

      setStockData(stock);
      setChartData(chart);
      setAnalysis(analysisData);
      setNews(newsData);
    } catch (error) {
      console.error("Failed to fetch data", error);
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
    const newChartData = await getChartData(ticker, range);
    setChartData(newChartData);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Header />

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500">
            {stockData && <StockInfo data={stockData} />}

            <PriceChart data={chartData} onRangeChange={handleRangeChange} />

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
