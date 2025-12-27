import React from 'react';
import { ArrowUpRight, ArrowDownRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface StockData {
    symbol: string;
    price: number;
    change: number;
    changePercent: number;
    high: number;
    low: number;
    volume: string;
    marketCap: string;
}

interface StockInfoProps {
    data: StockData;
    onAddToWatchlist?: (symbol: string) => void;
}

export const StockInfo = ({ data, onAddToWatchlist }: StockInfoProps) => {
    const isPositive = data.change >= 0;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card p-6 mb-6 relative overflow-hidden"
        >
             {/* Background Gradient Blob */}
            <div className={cn(
                "absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none",
                isPositive ? "bg-emerald-500" : "bg-red-500"
            )} />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 relative z-10">
                <div>
                    <div className="flex items-center gap-3">
                        <h2 className="text-4xl font-extrabold tracking-tight text-slate-800 dark:text-white">{data.symbol}</h2>
                        {onAddToWatchlist && (
                            <button 
                                onClick={() => onAddToWatchlist(data.symbol)}
                                className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-slate-400 hover:text-yellow-500 active:scale-95"
                                title="Add to Watchlist"
                            >
                                <Star size={24} />
                            </button>
                        )}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time Quote</p>

                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-5xl font-bold tracking-tight text-slate-900 dark:text-white">
                            ${data.price.toFixed(2)}
                        </span>
                        <div className={cn(
                            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold shadow-sm backdrop-blur-md border border-white/20",
                            isPositive ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400" : "bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400"
                        )}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
                <StatCard label="Day High" value={`$${data.high.toFixed(2)}`} />
                <StatCard label="Day Low" value={`$${data.low.toFixed(2)}`} />
                <StatCard label="Volume" value={data.volume} />
                <StatCard label="Market Cap" value={data.marketCap} />
            </div>
        </motion.div>
    );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-white/50 dark:bg-slate-800/50 p-4 rounded-xl border border-white/40 dark:border-slate-700/50 backdrop-blur-sm">
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
);
