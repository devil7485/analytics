'use client';

import { TokenMetadata } from '@/types';
import { ExternalLink, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import Image from 'next/image';

interface TokenHeaderProps {
  metadata: TokenMetadata;
}

export default function TokenHeader({ metadata }: TokenHeaderProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(metadata.mint);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const openInSolscan = () => {
    window.open(`https://solscan.io/token/${metadata.mint}`, '_blank');
  };

  return (
    <div className="glass rounded-2xl p-6 border border-white/10 slide-in-left">
      <div className="flex items-start gap-4">
        {/* Token logo */}
        <div className="relative w-20 h-20 flex-shrink-0 rounded-xl overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
          {metadata.logoURI ? (
            <Image
              src={metadata.logoURI}
              alt={metadata.name}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl font-bold gradient-text">
              {metadata.symbol.charAt(0)}
            </div>
          )}
        </div>

        {/* Token info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">{metadata.name}</h2>
              <p className="text-lg text-purple-400 font-mono">${metadata.symbol}</p>
            </div>
          </div>

          {/* Mint address */}
          <div className="flex items-center gap-2 mt-3 flex-wrap">
            <code className="text-xs font-mono text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700">
              {metadata.mint}
            </code>
            <button
              onClick={copyToClipboard}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              title="Copy address"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4 text-slate-400 hover:text-white" />
              )}
            </button>
            <button
              onClick={openInSolscan}
              className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
              title="View on Solscan"
            >
              <ExternalLink className="w-4 h-4 text-slate-400 hover:text-white" />
            </button>
          </div>

          {/* Additional info */}
          <div className="flex gap-4 mt-3 text-sm">
            <div>
              <span className="text-slate-500">Decimals:</span>
              <span className="text-white ml-2 font-mono">{metadata.decimals}</span>
            </div>
            {metadata.supply && (
              <div>
                <span className="text-slate-500">Supply:</span>
                <span className="text-white ml-2 font-mono">
                  {parseFloat(metadata.supply).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          {metadata.description && (
            <p className="mt-3 text-sm text-slate-400 line-clamp-2">{metadata.description}</p>
          )}
        </div>
      </div>
    </div>
  );
}
