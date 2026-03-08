import { Card } from "@heroui/react";
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: React.ReactNode;
    color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'indigo';
}

const KPICard = ({ title, value, subtitle, trend, trendValue, icon, color = 'blue' }: KPICardProps) => {
    const colorClasses = {
        blue: 'from-blue-500 to-blue-600',
        emerald: 'from-emerald-500 to-emerald-600',
        amber: 'from-amber-500 to-amber-600',
        red: 'from-red-500 to-red-600',
        purple: 'from-purple-500 to-purple-600',
        indigo: 'from-indigo-500 to-indigo-600',
    };

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-4 h-4" />;
        if (trend === 'down') return <TrendingDown className="w-4 h-4" />;
        return <Minus className="w-4 h-4" />;
    };

    const getTrendColor = () => {
        if (trend === 'up') return 'text-emerald-600';
        if (trend === 'down') return 'text-red-600';
        return 'text-slate-600 dark:text-slate-400';
    };

    return (
        <Card className="border-none shadow-md hover:shadow-lg transition-all duration-300">
            <Card.Content className="p-6">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <p className="text-sm font-medium text-default-500 mb-1">{title}</p>
                        <h3 className="text-3xl font-bold text-default-900">{value}</h3>
                        {subtitle && <p className="text-xs text-default-400 mt-1">{subtitle}</p>}
                    </div>
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} shadow-md`}>
                        <span className="text-2xl text-white">{icon}</span>
                    </div>
                </div>

                {trendValue && (
                    <div className={`flex items-center gap-1 text-sm font-medium ${getTrendColor()}`}>
                        {getTrendIcon()}
                        <span>{trendValue}</span>
                        <span className="text-default-400 text-xs ml-1">vs last month</span>
                    </div>
                )}
            </Card.Content>
        </Card>
    );
};

export default KPICard;
