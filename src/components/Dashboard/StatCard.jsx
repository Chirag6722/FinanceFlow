import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { cn } from '../../lib/utils';

const StatCard = ({ title, amount, trend, trendValue, icon: Icon, color }) => {
    const isPositive = trend === 'up';

    return (
        <div className="glass p-6 rounded-2xl relative overflow-hidden group hover:bg-surface/80 transition-all duration-300">
            <div className={cn("absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity", color)}>
                <Icon size={120} />
            </div>

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-3 rounded-xl bg-white/5", color)}>
                        <Icon size={24} className="text-white" />
                    </div>
                    {trendValue && (
                        <div className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium",
                            isPositive ? "bg-secondary/20 text-secondary" : "bg-danger/20 text-danger"
                        )}>
                            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            <span>{trendValue}</span>
                        </div>
                    )}
                </div>

                <h3 className="text-text-secondary text-sm font-medium mb-1">{title}</h3>
                <p className="text-2xl font-bold text-white">{amount}</p>
            </div>
        </div>
    );
};

export default StatCard;
