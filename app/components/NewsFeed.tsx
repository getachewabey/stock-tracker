import React from 'react';
import { Newspaper } from 'lucide-react';

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
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 h-full">
            <div className="flex items-center gap-2 mb-6">
                <Newspaper className="w-5 h-5 text-primary" />
                <div>
                    <h3 className="text-lg font-semibold text-gray-900">Latest News</h3>
                    <p className="text-sm text-gray-500">Recent articles about {symbol}</p>
                </div>
            </div>

            <div className="space-y-4">
                {news.map((item) => (
                    <a
                        key={item.id}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-4 rounded-lg border border-gray-100 hover:border-primary/20 hover:bg-gray-50 transition-all group"
                    >
                        <h4 className="font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {item.title}
                        </h4>
                        <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                            {item.summary}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="font-medium text-gray-600">{item.source}</span>
                            <span>•</span>
                            <span>{item.time}</span>
                        </div>
                    </a>
                ))}
            </div>
        </div>
    );
};
