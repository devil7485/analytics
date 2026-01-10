import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';

interface SearchBarProps {
  onSearch: (mint: string) => void;
  loading: boolean;
}

const EXAMPLE_TOKENS = [
  { name: 'BONK', address: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263' },
  { name: 'WIF', address: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm' },
];

export default function SearchBar({ onSearch, loading }: SearchBarProps) {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !loading) {
      onSearch(inputValue.trim());
    }
  };

  const handleExampleClick = (address: string) => {
    setInputValue(address);
    onSearch(address);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition duration-300"></div>
          <div className="relative">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter Solana token mint address..."
              disabled={loading}
              className="
                w-full h-16 px-6 pr-40
                glass rounded-2xl
                text-slate-100 placeholder-slate-500
                focus:outline-none focus:ring-2 focus:ring-blue-500/50
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                font-jetbrains text-sm
              "
            />
            <button
              type="submit"
              disabled={loading || !inputValue.trim()}
              className="
                absolute right-2 top-1/2 -translate-y-1/2
                px-6 py-3
                bg-gradient-to-r from-blue-500 to-purple-500
                hover:from-blue-600 hover:to-purple-600
                text-white font-semibold rounded-xl
                transition-all duration-300
                disabled:opacity-50 disabled:cursor-not-allowed
                flex items-center gap-2
                shadow-lg shadow-blue-500/20
              "
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Search size={18} />
                  <span>Analyze</span>
                  <Sparkles size={18} />
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Example Tokens */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <span className="text-slate-500 text-sm">Try examples:</span>
        {EXAMPLE_TOKENS.map((token) => (
          <button
            key={token.address}
            onClick={() => handleExampleClick(token.address)}
            disabled={loading}
            className="
              px-4 py-2 
              glass glass-hover
              rounded-xl text-sm font-medium
              transition-all duration-300
              disabled:opacity-50 disabled:cursor-not-allowed
              hover:scale-105
            "
          >
            {token.name}
          </button>
        ))}
      </div>
    </div>
  );
}