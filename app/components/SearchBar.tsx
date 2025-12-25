"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';

const POPULAR_TICKERS = ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'NVDA', 'META', 'NFLX'];

interface SearchBarProps {
    onSearch: (ticker: string) => void;
}

export const SearchBar = ({ onSearch }: SearchBarProps) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.toUpperCase());
        }
    };

    return (
        <div className="w-full max-w-6xl mx-auto mb-8">
            <form onSubmit={handleSubmit} className="relative flex gap-2 mb-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        className="w-full pl-12 pr-4 py-3 rounded-lg border bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all shadow-sm"
                        placeholder="Enter stock ticker (e.g., AAPL, GOOGL, TSLA)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <button
                    type="submit"
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-sm"
                >
                    Search
                </button>
            </form>

            <div className="flex items-center gap-2 text-sm">
                <span className="text-gray-500">Popular:</span>
                <div className="flex gap-2 flex-wrap">
                    {POPULAR_TICKERS.map((ticker) => (
                        <button
                            key={ticker}
                            onClick={() => onSearch(ticker)}
                            className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors text-xs font-medium"
                        >
                            {ticker}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};
