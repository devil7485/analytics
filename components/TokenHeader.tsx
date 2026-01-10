import { TokenAnalytics } from '@/types';
import { Copy, ExternalLink, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface TokenHeaderProps {
  analytics: TokenAnalytics;
}

export default function TokenHeader({ analytics }: TokenHeaderProps) {
  const [copied, setCopied] = useState(false);
  const { metadata } = analytics;

  const copyAddress = async () => {
    await navigator.clipboard.writeText(metadata.mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openSolscan = () => {
    window.open(`https://solscan.io/token/${metadata.mint}`, '_blank');
  };

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
      {/* Token Logo */}
      {metadata.logoURI && (
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-50 group-hover:opacity-75 blur transition duration-300"></div>
          <img
            src={metadata.logoURI}
            alt={metadata.name}
            className="relative w-20 h-20 rounded-full border-2 border-slate-700"
          />
        </div>
      )}

      {/* Token Info */}
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-3 mb-3">
          <h1 className="font-syne text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            {metadata.name}
          </h1>
          <span className="px-3 py-1 glass rounded-full text-sm font-medium">
            {metadata.symbol}
          </span>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <code className="font-jetbrains text-sm text-slate-400 bg-slate-900/50 px-3 py-1 rounded-lg">
            {metadata.mint.slice(0, 8)}...{metadata.mint.slice(-8)}
          </code>
          
          <button
            onClick={copyAddress}
            className="p-2 glass glass-hover rounded-lg transition-all"
            title="Copy address"
          >
            {copied ? (
              <CheckCircle size={16} className="text-green-400" />
            ) : (
              <Copy size={16} className="text-slate-400" />
            )}
          </button>
          
          <button
            onClick={openSolscan}
            className="p-2 glass glass-hover rounded-lg transition-all"
            title="View on Solscan"
          >
            <ExternalLink size={16} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Price Info */}
      {analytics.dexData?.priceUsd && (
        <div className="text-left md:text-right">
          <div className="text-3xl font-bold mb-1">
            ${analytics.dexData.priceUsd.toFixed(8)}
          </div>
          <div className={`text-sm font-medium flex items-center gap-1 ${
            analytics.dexData.priceChange24h >= 0 
              ? 'text-green-400' 
              : 'text-red-400'
          }`}>
            <span>{analytics.dexData.priceChange24h >= 0 ? '↗' : '↘'}</span>
            <span>
              {analytics.dexData.priceChange24h >= 0 ? '+' : ''}
              {analytics.dexData.priceChange24h.toFixed(2)}%
            </span>
            <span className="text-slate-500">24h</span>
          </div>
        </div>
      )}
    </div>
  );
}