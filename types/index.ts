// Core types for the Solana Memecoin Analytics platform

export interface TokenMetadata {
  mint: string;
  name: string;
  symbol: string;
  decimals: number;
  supply?: string;
  logoURI?: string;
  description?: string;
  creator?: string;
}

export interface Trade {
  wallet: string;
  side: 'buy' | 'sell';
  price: number;
  quantity: number;
  timestamp: number;
  signature: string;
  amountUSD?: number;
}

export interface WalletPosition {
  wallet: string;
  totalBought: number;
  totalSold: number;
  averageBuyPrice: number;
  averageSellPrice: number;
  realizedPnL: number;
  realizedPnLPercent: number;
  trades: Trade[];
}

export interface TokenAnalytics {
  metadata: TokenMetadata;
  topBuyer: WalletPosition | null;
  mostProfitable: WalletPosition | null;
  biggestLoser: WalletPosition | null;
  totalTraders: number;
  totalTrades: number;
  highestPrice: number;
  lowestPrice: number;
  currentPrice?: number;
  priceHistory: PricePoint[];
  lastUpdated: number;
  
  // DexScreener aggregated data (instant, no processing needed!)
  dexData?: {
    volume24h: number;
    volumeChange24h: number;
    priceChange24h: number;
    buys24h: number;
    sells24h: number;
    liquidity: number;
    marketCap?: number;
    fdv?: number;
    priceUsd?: number;
  };
}

export interface PricePoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface AnalysisSnapshot {
  mint: string;
  analytics: TokenAnalytics;
  computedAt: number;
  expiresAt: number;
}

export interface HeliusTransaction {
  signature: string;
  timestamp: number;
  type: string;
  accountData: Array<{
    account: string;
    nativeBalanceChange: number;
    tokenBalanceChanges?: Array<{
      mint: string;
      rawTokenAmount: {
        tokenAmount: string;
        decimals: number;
      };
      userAccount: string;
    }>;
  }>;
  events?: {
    swap?: {
      nativeInput?: {
        account: string;
        amount: string;
      };
      nativeOutput?: {
        account: string;
        amount: string;
      };
      tokenInputs?: Array<{
        mint: string;
        rawTokenAmount: {
          tokenAmount: string;
          decimals: number;
        };
        userAccount: string;
      }>;
      tokenOutputs?: Array<{
        mint: string;
        rawTokenAmount: {
          tokenAmount: string;
          decimals: number;
        };
        userAccount: string;
      }>;
    };
  };
}

export interface AnalyzeTokenRequest {
  mint: string;
  forceRefresh?: boolean;
}

export interface AnalyzeTokenResponse {
  success: boolean;
  data?: TokenAnalytics;
  error?: string;
  cached?: boolean;
}

export interface RateLimitInfo {
  remaining: number;
  reset: number;
}
