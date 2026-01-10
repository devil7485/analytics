import { PricePoint } from '@/types';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface PriceChartProps {
  data: PricePoint[];
}

export default function PriceChart({ data }: PriceChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="h-80 flex items-center justify-center text-slate-400">
        No price history available
      </div>
    );
  }

  const chartData = data.map((point) => ({
    timestamp: point.timestamp * 1000,
    price: point.price,
    volume: point.volume,
  }));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis
            dataKey="timestamp"
            tickFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              });
            }}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            dataKey="price"
            tickFormatter={(value) => value.toFixed(9)}
            stroke="#64748b"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              border: '1px solid rgba(59, 130, 246, 0.2)',
              borderRadius: '12px',
              padding: '12px',
              backdropFilter: 'blur(12px)',
            }}
            labelStyle={{ color: '#f1f5f9', marginBottom: '8px', fontWeight: '600' }}
            itemStyle={{ color: '#3b82f6' }}
            labelFormatter={(timestamp) => {
              const date = new Date(timestamp);
              return date.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });
            }}
            formatter={(value: any) => [value.toFixed(9) + ' SOL', 'Price']}
          />
          <Area
            type="monotone"
            dataKey="price"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#priceGradient)"
            dot={false}
            activeDot={{ r: 6, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}