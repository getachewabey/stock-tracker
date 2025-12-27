import React from 'react';
import { Newspaper, ExternalLink } from 'lucide-react';

interface NewsItem {
    id: string;
    title: string;
    summary: string;
    source: string;
    time: string;
    url: string;
}

export const NewsFeed = ({ news, symbol }: { news: NewsItem[], symbol: string }) => {
    return (
        <div className="glass-card p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg">
                    <Newspaper className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-gray-100">Latest News</h3>
                    <p className="text-xs text-slate-500 dark:text-gray-400 font-medium uppercase tracking-wider">Recent articles about {symbol}</p>
                </div>
            </div>

            <div className="space-y-4">
                {news.map((item) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-xl border border-white/40 dark:border-slate-700/50 bg-white/40 dark:bg-slate-800/40 hover:bg-white/70 dark:hover:bg-slate-800/70 transition-all group relative overflow-hidden"
                    >
                         <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                            <ExternalLink size={14} />
                        </div>
                        <h4 className="font-semibold text-slate-800 dark:text-slate-100 mb-2 group-hover:text-primary transition-colors line-clamp-2 pr-4">
                            {item.title}
                        </h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2 leading-relaxed">
                            {item.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-bold text-slate-600 dark:text-slate-300">{item.source}</span>
                            <span className="text-slate-300 dark:text-slate-600">•</span>
                            <span>{item.time}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
