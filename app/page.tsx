"use client";

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { StockInfo } from './components/StockInfo';
import { PriceChart } from './components/PriceChart';
import { AIAnalysis } from './components/AIAnalysis';
import { NewsFeed } from './components/NewsFeed';
import { Watchlist } from './components/Watchlist';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [ticker, setTicker] = useState('AAPL');
  const [stockData, setStockData] = useState<any>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isSynthetic, setIsSynthetic] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [watchlistTrigger, setWatchlistTrigger] = useState(0);

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
      setIsSynthetic(data.isSynthetic || false);
      setAnalysis(data.analysis);
      setNews(data.news);
    } catch (err: any) {
      console.error("Failed to fetch data", err);
      // More user friendly error
      const msg = err.message.includes("403") ? "API Access Restricted" : err.message;
      setError(msg || 'Failed to load stock data');
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
    console.log(`Range changed to ${range} - keeping default view for free tier limit.`);
  };

  const handleAddToWatchlist = async (symbol: string) => {
      // 1. Try Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
          const { error } = await supabase.from('watchlist').insert({ user_id: session.user.id, symbol });
          if (!error) {
              setWatchlistTrigger(prev => prev + 1);
          } else {
              // Handle unique constraint error simply by ignoring or logging
              console.log('Already in watchlist or error:', error);
          }
      } else {
          // 2. Fallback to LocalStorage
          const saved = localStorage.getItem('watchlist');
          let symbols: string[] = saved ? JSON.parse(saved) : [];
          if (!symbols.includes(symbol)) {
              symbols.push(symbol);
              localStorage.setItem('watchlist', JSON.stringify(symbols));
              setWatchlistTrigger(prev => prev + 1);
          }
      }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-12 transition-colors duration-500">
       
       {/* Background Decoration */}
       <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[100px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-400/10 blur-[100px]" />
       </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Header />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
            
            {/* Main Content Area */}
            <div className="lg:col-span-3 space-y-6">
                <SearchBar onSearch={handleSearch} />

                {error ? (
                <div className="mt-8 p-6 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 rounded-xl border border-red-200 dark:border-red-800 text-center">
                    {error}. Please try a valid US ticker like AAPL or TSLA.
                </div>
                ) : loading ? (
                <div className="flex items-center justify-center h-96">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                        <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-2 border-transparent border-r-2 border-primary/30 animate-pulse"></div>
                    </div>
                </div>
                ) : (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-6"
                >
                    {stockData && (
                        <StockInfo 
                            data={stockData} 
                            onAddToWatchlist={handleAddToWatchlist}
                        />
                    )}

                    {chartData.length > 0 ? (
                    <PriceChart 
                        data={chartData} 
                        onRangeChange={handleRangeChange} 
                        isSynthetic={isSynthetic}
                    />
                    ) : (
                    <div className="p-12 glass-card text-center text-slate-500">
                        No chart data available for this timeframe.
                    </div>
                    )}

                    <div className="grid grid-cols-1 gap-6">
                        {analysis && <AIAnalysis data={analysis} />}
                        {news.length > 0 && <NewsFeed news={news} symbol={ticker} />}
                    </div>
                </motion.div>
                )}
            </div>

            {/* Sidebar (Watchlist) */}
            <div className="lg:col-span-1 hidden lg:block">
                <div className="sticky top-6">
                    <Watchlist onSelect={handleSearch} refreshTrigger={watchlistTrigger} />
                </div>
            </div>

        </div>
      </div>
    </div>
  );
}
