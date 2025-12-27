import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const Header = () => {
    return (
        <header className="flex items-center justify-between py-6 bg-transparent">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold leading-none tracking-tight text-slate-800 dark:text-white">StockTracker</h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Real-time Market Intelligence</p>
                </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-400 bg-white/50 dark:bg-slate-800/50 px-4 py-2 rounded-full border border-white/20 backdrop-blur-sm">
                <BarChart3 className="w-4 h-4" />
                <span>Market Analysis Platform</span>
            </div>
        </header>
    );
};
