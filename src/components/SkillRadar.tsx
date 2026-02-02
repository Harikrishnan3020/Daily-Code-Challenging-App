
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip, TooltipProps } from 'recharts';
import { TopicStat } from '@/lib/analytics';

interface SkillRadarProps {
    data: TopicStat[];
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-900 border border-white/10 p-3 rounded-lg shadow-xl">
                <p className="font-bold text-white mb-1">{label}</p>
                <p className="text-emerald-400 text-sm">Win Rate: {payload[0].value}%</p>
                <p className="text-muted-foreground text-xs mt-1">Total Attempted: {payload[0].payload.total}</p>
            </div>
        );
    }
    return null;
};

const SkillRadar = ({ data }: SkillRadarProps) => {
    // Filter to top 6 relevant categories if too many, or just pass all
    // Radar charts look bad with too many axes.
    const chartData = data ? data.slice(0, 8) : [];

    if (chartData.length < 3) {
        return (
            <div className="w-full h-[300px] flex items-center justify-center text-muted-foreground text-sm border border-dashed border-white/10 rounded-xl">
                Solve problems in at least 3 categories to unlock the Radar Chart!
            </div>
        );
    }

    return (
        <div className="w-full h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#334155" />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Win Rate"
                        dataKey="winRate"
                        stroke="#10b981"
                        strokeWidth={2}
                        fill="#10b981"
                        fillOpacity={0.3}
                    />
                    <Tooltip content={<CustomTooltip />} />
                </RadarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default SkillRadar;
