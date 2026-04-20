import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface KPICardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    trend?: 'up' | 'down' | 'neutral';
    trendValue?: string;
    icon: React.ReactNode;
    color?: 'blue' | 'emerald' | 'amber' | 'red' | 'purple' | 'indigo' | 'orange' | 'cyan';
    emoji?: string;
    variant?: 'default' | 'centered';
}

const KPICard = ({ title, value, subtitle, trend, trendValue, icon, color = 'indigo', emoji, variant = 'default' }: KPICardProps) => {
    const colorConfig = {
        blue:    { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        emerald: { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        amber:   { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        red:     { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        purple:  { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        indigo:  { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        orange:  { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
        cyan:    { bg: 'transparent', iconBg: '#f8fafc', glow: 'none', text: '#334155' },
    };

    const c = colorConfig[color];

    const trendConfig = {
        up:      { icon: <TrendingUp className="w-3.5 h-3.5" />, text: 'up', color: '#52525B', bg: '#f1f5f9', label: 'vs last month' },
        down:    { icon: <TrendingDown className="w-3.5 h-3.5" />, text: 'down', color: '#52525B', bg: '#f1f5f9', label: 'vs last month' },
        neutral: { icon: <Minus className="w-3.5 h-3.5" />, text: 'stable', color: '#52525B', bg: '#f1f5f9', label: 'no change' },
    };

    const t = trend ? trendConfig[trend] : null;

    const isCentered = variant === 'centered';

    return (
        <div className={`kpi-card bg-white dark:bg-zinc-900 p-5 cursor-default ${isCentered ? 'flex flex-col items-center text-center' : ''}`}
            style={{ border: '1px solid var(--card-border)' }}>
            {/* Icon Box */}
            <div className={`w-[48px] h-[48px] rounded flex items-center justify-center flex-shrink-0 ${isCentered ? 'mb-2' : 'mb-4'}`}
                style={{
                    background: c.iconBg,
                    border: '1px solid #e2e8f0',
                }}>
                {emoji ? (
                    <span className="text-xl leading-none select-none">{emoji}</span>
                ) : (
                    <span className="text-slate-600 [&>svg]:w-[20px] [&>svg]:h-[20px]">{icon}</span>
                )}
            </div>

            {/* Value */}
            <p className="text-3xl font-extrabold tracking-tight leading-none mb-1.5 mt-2"
                style={{ color: 'var(--foreground)' }}>
                {value}
            </p>

            {/* Title */}
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-0.5">{title}</p>

            {/* Subtitle */}
            {subtitle && !isCentered && (
                <p className="text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>
            )}

            {/* Trend badge */}
            {t && trendValue && (
                <div className={`mt-3 inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${isCentered ? 'hidden' : ''}`}
                    style={{ color: t.color, background: t.bg }}>
                    {t.icon}
                    <span>{trendValue} {t.text}</span>
                    <span className="font-normal opacity-70">{t.label}</span>
                </div>
            )}
        </div>
    );
};

export default KPICard;
