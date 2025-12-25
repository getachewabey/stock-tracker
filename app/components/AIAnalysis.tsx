import React from 'react';
import { Sparkles, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AnalysisData {
    symbol: string;
    summary: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    score: number;
    insights: string[];
}

export const AIAnalysis = ({ data }: { data: AnalysisData }) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-5 h-5 text-primary" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">AI-Powered Analysis</h3>
                    <p className="text-sm text-gray-500">Generated Insights for {data.symbol}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6">
                <Badge icon={<TrendingUp className="w-3 h-3" />} label="Bullish Momentum" type="success" />
                <Badge icon={<CheckCircle2 className="w-3 h-3" />} label="Strong Buy" type="success" />
                <Badge icon={<AlertTriangle className="w-3 h-3" />} label="High Volatility" type="warning" />
            </div>

            <div className="prose prose-sm text-gray-600 mb-6 font-light leading-relaxed">
                {data.summary}
            </div>

            <div className="space-y-4">
                <h4 className="font-semibold text-sm text-gray-900">Key Insights:</h4>
                <ul className="space-y-2">
                    {data.insights.map((insight, idx) => (
                        <li key={idx} className="flex gap-2 text-sm text-gray-600 items-start">
                            <span className="block w-1.5 h-1.5 mt-1.5 rounded-full bg-primary flex-shrink-0" />
                            {insight}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="mt-8 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-700 leading-relaxed">
                <strong>Disclaimer:</strong> This AI-generated analysis is for informational purposes only and should not be considered as financial advice. Always conduct your own research.
            </div>
        </div>
    );
};

const Badge = ({ icon, label, type }: { icon: React.ReactNode, label: string, type: 'success' | 'warning' | 'neutral' }) => {
    const styles = {
        success: 'bg-green-50 text-green-700 border-green-100',
        warning: 'bg-red-50 text-red-700 border-red-100', // Using red for warning/volatility as per screenshot design cues often having red for alerts
        neutral: 'bg-gray-50 text-gray-700 border-gray-100'
    };

    return (
        <div className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border", styles[type])}>
            {icon}
            <span>{label}</span>
        </div>
    );
};
