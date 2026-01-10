import { TokenAnalytics } from '@/types';
import { TrendingUp, TrendingDown, Target, Copy } from 'lucide-react';

interface WalletInsightsProps {
  analytics: TokenAnalytics;
}

export default function WalletInsights({ analytics }: WalletInsightsProps) {
  const insights = [
    analytics.topBuyer && {
      title: 'Top Buyer at ATH',
      subtitle: `Bought at ${analytics.highestPrice.toFixed(9)} SOL`,
      wallet: analytics.topBuyer.wallet,
      value: `${analytics.topBuyer.totalBought.toFixed(2)} tokens`,
      icon: Target,
      gradient: 'from-blue-500 to-cyan-500',
    },
    analytics.mostProfitable && {
      title: 'Most Profitable Trader',
      subtitle: 'Highest realized gains',
      wallet: analytics.mostProfitable.wallet,
      value: analytics.mostProfitable.realizedPnLPercent 
        ? `+${analytics.mostProfitable.realizedPnLPercent.toFixed(2)}%`
        : `+${analytics.mostProfitable.realizedPnL.toFixed(4)} SOL`,
      icon: TrendingUp,
      gradient: 'from-green-500 to-emerald-500',
    },
    analytics.biggestLoser && {
      title: 'Biggest Loser',
      subtitle: 'Largest realized loss',
      wallet: analytics.biggestLoser.wallet,
      value: analytics.biggestLoser.realizedPnLPercent
        ? `${analytics.biggestLoser.realizedPnLPercent.toFixed(2)}%`
        : `${analytics.biggestLoser.realizedPnL.toFixed(4)} SOL`,
      icon: TrendingDown,
      gradient: 'from-red-500 to-orange-500',
    },
  ].filter(Boolean);

  const copyWallet = (wallet: string) => {
    navigator.clipboard.writeText(wallet);
  };

  if (insights.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {insights.map((insight: any, index) => {
        const Icon = insight.icon;
        return (
          <div
            key={index}
            className="glass glass-hover rounded-2xl p-6 group"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-syne text-lg font-bold mb-1">
                  {insight.title}
                </h3>
                <p className="text-slate-400 text-sm">
                  {insight.subtitle}
                </p>
              </div>
              <div className={`p-3 rounded-xl bg-gradient-to-br ${insight.gradient} shadow-lg`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
            </div>

            <div className="mb-4">
              <div className="text-2xl font-bold font-syne mb-2">
                {insight.value}
              </div>
              <div className="flex items-center gap-2">
                <code className="font-jetbrains text-xs text-slate-400 bg-slate-900/50 px-2 py-1 rounded flex-1 truncate">
                  {insight.wallet.slice(0, 6)}...{insight.wallet.slice(-6)}
                </code>
                <button
                  onClick={() => copyWallet(insight.wallet)}
                  className="p-2 glass glass-hover rounded-lg transition-all"
                  title="Copy wallet"
                >
                  <Copy size={14} className="text-slate-400" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}