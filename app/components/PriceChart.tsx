"use client";

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface PricePoint {
    time: string;
    price: number;
}

interface PriceChartProps {
  data: PricePoint[];
  onRangeChange: (range: string) => void;
  isSynthetic?: boolean;
}

const TIME_RANGES = ['1D', '1W', '1M', '1Y'];

export const PriceChart = ({ data, onRangeChange, isSynthetic }: PriceChartProps) => {
  const [activeRange, setActiveRange] = useState('1D');

  const handleRangeClick = (range: string) => {
    setActiveRange(range);
    onRangeChange(range);
  };

  const isPositive = data.length > 1 && data[data.length - 1].price >= data[0].price;
  const strokeColor = isPositive ? '#10b981' : '#ef4444'; // Emerald-500 or Red-500
  const gradientColor = isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 mb-6 relative"
    >
      <div className="flex justify-between items-start mb-6">
        <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Price Chart</h3>
            {isSynthetic && (
                <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full mt-1 w-fit border border-amber-200">
                    <AlertCircle size={12} />
                    <span>Synthetic Intraday View (Historical Data Unavailable)</span>
                </div>
            )}
        </div>
        <div className="flex bg-gray-100 dark:bg-slate-700/50 rounded-lg p-1 gap-1">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              onClick={() => handleRangeClick(range)}
              className={`px-3 py-1 text-sm font-medium rounded-md transition-all ${
                activeRange === range
                                    ? 'bg-white dark:bg-slate-600 shadow-sm text-gray-900 dark:text-white'
                                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                }`}
                        >
                            {range}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-[350px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={strokeColor} stopOpacity={0.3} />
                                <stop offset="95%" stopColor={strokeColor} stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(200,200,200, 0.2)" />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            dy={10}
                            minTickGap={30}
                        />
                        <YAxis
                            domain={['auto', 'auto']}
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12, fill: '#94a3b8' }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                padding: '12px'
                            }}
                            itemStyle={{ color: '#1f2937', fontWeight: 600 }}
                            formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
                        />
                        <Area
                            type="monotone"
                            dataKey="price"
                            stroke={strokeColor}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorPrice)"
                            animationDuration={1500}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
};
