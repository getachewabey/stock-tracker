"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Ensure this path is correct
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WatchlistItem {
  id: number;
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

interface WatchlistProps {
  onSelect: (symbol: string) => void;
  refreshTrigger: number; // Increment to force refresh
}

export const Watchlist = ({ onSelect, refreshTrigger }: WatchlistProps) => {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from local storage for now to simulate persistence if Supabase isn't fully set up with Auth
  // But standard implementation would be:
  const fetchWatchlist = async () => {
    // Ideally fetch from Supabase. For this demo without Auth, we use LocalStorage 
    // but demonstrating the UI structure.
    
    // Fallback to local storage for "guest" user experience
    // 1. Try Supabase first if available
    const { data: { session } } = await supabase.auth.getSession();
    
    let symbols: string[] = [];

    if (session) {
        const { data, error } = await supabase
            .from('watchlist')
            .select('symbol')
            .eq('user_id', session.user.id);
        
        if (data) {
            symbols = data.map(d => d.symbol);
        } else if (error) {
            console.error('Supabase fetch error:', error);
        }
    } else {
        // Fallback to local storage for guests
        const saved = localStorage.getItem('watchlist');
        symbols = saved ? JSON.parse(saved) : ['AAPL', 'MSFT', 'GOOGL'];
    }

    const newItems: WatchlistItem[] = [];

    // Fetch live data for each
    for (const symbol of symbols) {
        try {
            const res = await fetch(`/api/stock/${symbol}`);
            const data = await res.json();
            if (data.stock) {
                newItems.push({
                    id: Math.random(),
                    symbol: data.stock.symbol,
                    price: data.stock.price,
                    change: data.stock.change,
                    changePercent: data.stock.changePercent
                });
            }
        } catch (e) {
            console.error(`Failed to load ${symbol}`, e);
        }
    }
    setItems(newItems);
    setLoading(false);
  };

  useEffect(() => {
    fetchWatchlist();
  }, [refreshTrigger]);

  const removeFromWatchlist = async (symbol: string) => {
    // Optimistic UI update
    setItems(prev => prev.filter(i => i.symbol !== symbol));

    // Handle Persistence
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
        await supabase.from('watchlist').delete().match({ user_id: session.user.id, symbol });
    } else {
        const saved = localStorage.getItem('watchlist');
        let symbols: string[] = saved ? JSON.parse(saved) : [];
        symbols = symbols.filter(s => s !== symbol);
        localStorage.setItem('watchlist', JSON.stringify(symbols));
    }
  };

  return (
    <div className="glass-card p-6 h-full overflow-hidden flex flex-col">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-primary">★</span> Watchlist
      </h3>
      
      <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
        {loading ? (
             [1,2,3].map(i => (
                <div key={i} className="h-16 bg-gray-100/50 rounded-lg animate-pulse" />
             ))
        ) : items.length === 0 ? (
            <div className="text-gray-400 text-center py-8">
                No stocks saved.
            </div>
        ) : (
            <AnimatePresence>
                {items.map((item) => (
                    <motion.div
                        key={item.symbol}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        className="group relative bg-white/40 dark:bg-slate-800/60 p-3 rounded-xl border border-white/40 hover:bg-white/60 transition-all cursor-pointer"
                        onClick={() => onSelect(item.symbol)}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-gray-800 dark:text-gray-100">{item.symbol}</h4>
                                <p className="text-xs text-gray-500">{item.price ? `$${item.price.toFixed(2)}` : '...'}</p>
                            </div>
                            <div className={`text-right ${item.change >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                <div className="flex items-center justify-end gap-1 font-medium text-sm">
                                    {item.change >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                    {item.changePercent ? `${item.changePercent.toFixed(2)}%` : '0.00%'}
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={(e) => { e.stopPropagation(); removeFromWatchlist(item.symbol); }}
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-all"
                        >
                            <Trash2 size={12} />
                        </button>
                    </motion.div>
                ))}
            </AnimatePresence>
        )}
      </div>
    </div>
  );
};
