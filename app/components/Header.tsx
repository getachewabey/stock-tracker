import React from 'react';
import { TrendingUp, BarChart3 } from 'lucide-react';

export const Header = () => {
    return (
        <header className="flex items-center justify-between p-6 bg-transparent">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-primary rounded-lg text-primary-foreground">
                    <TrendingUp className="w-6 h-6" />
                </div>
                <div>
                    <h1 className="text-xl font-bold leading-none">StockTracker</h1>
                    <p className="text-sm text-muted-foreground mt-0.5">Real-time Market Intelligence</p>
                </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
                <BarChart3 className="w-4 h-4" />
                <span>Market Analysis Platform</span>
            </div>
        </header>
    );
};
