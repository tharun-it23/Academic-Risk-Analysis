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
    const colorConfig = {
        blue:    { gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)', glow: 'rgba(59,130,246,0.25)', light: 'rgba(59,130,246,0.08)', border: 'rgba(59,130,246,0.15)' },
        emerald: { gradient: 'linear-gradient(135deg, #10b981, #059669)', glow: 'rgba(16,185,129,0.25)', light: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.15)' },
        amber:   { gradient: 'linear-gradient(135deg, #f59e0b, #d97706)', glow: 'rgba(245,158,11,0.25)', light: 'rgba(245,158,11,0.08)', border: 'rgba(245,158,11,0.15)' },
        red:     { gradient: 'linear-gradient(135deg, #ef4444, #dc2626)', glow: 'rgba(239,68,68,0.25)', light: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.15)' },
        purple:  { gradient: 'linear-gradient(135deg, #a855f7, #9333ea)', glow: 'rgba(168,85,247,0.25)', light: 'rgba(168,85,247,0.08)', border: 'rgba(168,85,247,0.15)' },
        indigo:  { gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)', glow: 'rgba(99,102,241,0.25)', light: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.15)' },
    };

    const c = colorConfig[color];

    const getTrendIcon = () => {
        if (trend === 'up') return <TrendingUp className="w-3 h-3" />;
        if (trend === 'down') return <TrendingDown className="w-3 h-3" />;
        return <Minus className="w-3 h-3" />;
    };

    const getTrendStyle = (): React.CSSProperties => {
        if (trend === 'up') return { color: '#10b981', background: 'rgba(16,185,129,0.1)' };
        if (trend === 'down') return { color: '#ef4444', background: 'rgba(239,68,68,0.1)' };
        return { color: '#94a3b8', background: 'rgba(148,163,184,0.1)' };
    };

    return (
        <div className="dashboard-card rounded-2xl p-5 group cursor-default"
            style={{
                background: 'var(--card-bg)',
                border: '1px solid var(--card-border)',
            }}>
            <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0 pr-3">
                    <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                        {title}
                    </p>
                    <p className="text-3xl font-bold tracking-tight" style={{ color: 'var(--foreground)' }}>
                        {value}
                    </p>
                    {subtitle && (
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-110"
                    style={{
                        background: c.gradient,
                        boxShadow: `0 6px 20px ${c.glow}`,
                    }}>
                    <span className="text-white [&>svg]:w-[18px] [&>svg]:h-[18px]">{icon}</span>
                </div>
            </div>

            {/* Trend badge */}
            {trendValue && (
                <div className="flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full w-fit"
                    style={getTrendStyle()}>
                    {getTrendIcon()}
                    <span>{trendValue}</span>
                    <span className="font-normal opacity-70">vs last month</span>
                </div>
            )}

            {/* Bottom accent bar */}
            <div className="mt-4 h-[2px] rounded-full opacity-30"
                style={{ background: c.gradient }} />
        </div>
    );
};

export default KPICard;
