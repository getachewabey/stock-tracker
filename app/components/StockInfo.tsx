import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

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
}

export const StockInfo = ({ data }: StockInfoProps) => {
    const isPositive = data.change >= 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">{data.symbol}</h2>
                    <p className="text-sm text-gray-500 font-medium">Real-time Quote</p>

                    <div className="flex items-center gap-3 mt-2">
                        <span className="text-4xl font-bold tracking-tight text-gray-900">
                            ${data.price.toFixed(2)}
                        </span>
                        <div className={cn(
                            "flex items-center gap-1 px-2.5 py-1 rounded-md text-sm font-semibold",
                            isPositive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        )}>
                            {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                            <span>{isPositive ? '+' : ''}{data.change.toFixed(2)} ({data.changePercent.toFixed(2)}%)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard label="Day High" value={`$${data.high.toFixed(2)}`} />
                <StatCard label="Day Low" value={`$${data.low.toFixed(2)}`} />
                <StatCard label="Volume" value={data.volume} />
                <StatCard label="Market Cap" value={data.marketCap} />
            </div>
        </div>
    );
};

const StatCard = ({ label, value }: { label: string; value: string }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-500 font-medium mb-1">{label}</p>
        <p className="text-lg font-bold text-gray-900">{value}</p>
    </div>
);
