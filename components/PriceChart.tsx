'use client';

import { PricePoint } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { format } from 'date-fns';

interface PriceChartProps {
  priceHistory: PricePoint[];
}

export default function PriceChart({ priceHistory }: PriceChartProps) {
  // Format data for chart
  const chartData = priceHistory.map((point) => ({
    timestamp: point.timestamp * 1000, // Convert to milliseconds
    price: point.price,
    volume: point.volume,
  }));

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="glass rounded-lg p-3 border border-white/20">
          <p className="text-xs text-slate-400 mb-1">
            {format(new Date(payload[0].payload.timestamp), 'MMM d, yyyy HH:mm')}
          </p>
          <p className="text-sm font-bold text-white font-mono">
            {payload[0].value.toFixed(9)} SOL
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Volume: {payload[0].payload.volume.toFixed(2)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 fade-in">
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
        <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
        Price History
      </h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#a78bfa" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="timestamp"
              tickFormatter={(timestamp) => format(new Date(timestamp), 'MMM d')}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <YAxis
              tickFormatter={(value) => value.toFixed(9)}
              stroke="#64748b"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#60a5fa"
              strokeWidth={2}
              fill="url(#colorPrice)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span>Price (SOL)</span>
        </div>
        <div>
          <span>{priceHistory.length} data points</span>
        </div>
      </div>
    </div>
  );
}
