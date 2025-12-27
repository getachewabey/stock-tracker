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
        <div className="glass-card p-6 h-full relative overflow-hidden group">
            {/* Subtle Gradient Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/20 transition-all duration-700 pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 relative z-10">
                <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg">
                    <Sparkles className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">AI Analysis</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wider">Insights for {data.symbol}</p>
                </div>
            </div>

            <div className="flex gap-2 mb-6 relative z-10">
                {data.sentiment === 'bullish' && <Badge icon={<TrendingUp className="w-3 h-3" />} label="Bullish" type="success" />}
                {data.sentiment === 'bearish' && <Badge icon={<TrendingUp className="w-3 h-3 rotate-180" />} label="Bearish" type="warning" />}
                <Badge icon={<CheckCircle2 className="w-3 h-3" />} label={`Score: ${data.score}/10`} type="neutral" />
            </div>

            <div className="prose prose-sm text-slate-600 dark:text-slate-300 mb-6 font-light leading-relaxed relative z-10">
                {data.summary}
            </div>

            <div className="space-y-4 relative z-10">
                <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                    <span className="w-1 h-4 bg-primary rounded-full" />
                    Key Insights
                </h4>
                <div className="space-y-3">
                    {data.insights.map((insight, idx) => (
                        <div key={idx} className="flex gap-3 text-sm text-slate-600 dark:text-slate-400 items-start p-3 rounded-lg bg-white/30 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
                            <span className="flex-shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-indigo-400" />
                            {insight}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-8 p-3 bg-amber-50/50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/30 rounded-lg text-[10px] text-amber-700 dark:text-amber-500 leading-relaxed uppercase tracking-wide">
                <strong>Disclaimer:</strong> AI-generated content. Not financial advice.
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
