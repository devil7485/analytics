import axios from 'axios';

const DEXSCREENER_BASE_URL = 'https://api.dexscreener.com/latest';

export interface DexScreenerPair {
  chainId: string;
  dexId: string;
  url: string;
  pairAddress: string;
  baseToken: {
    address: string;
    name: string;
    symbol: string;
  };
  quoteToken: {
    address: string;
    name: string;
    symbol: string;
  };
  priceNative: string;
  priceUsd?: string;
  txns: {
    m5: { buys: number; sells: number };
    h1: { buys: number; sells: number };
    h6: { buys: number; sells: number };
    h24: { buys: number; sells: number };
  };
  volume: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  priceChange: {
    m5: number;
    h1: number;
    h6: number;
    h24: number;
  };
  liquidity: {
    usd?: number;
    base: number;
    quote: number;
  };
  fdv?: number;
  marketCap?: number;
  pairCreatedAt?: number;
}

export class DexScreenerClient {
  /**
   * Get token pairs from DexScreener (FREE - NO API KEY!)
   */
  async getTokenPairs(address: string): Promise<DexScreenerPair[]> {
    try {
      const response = await axios.get(
        `${DEXSCREENER_BASE_URL}/dex/tokens/${address}`,
        {
          timeout: 10000,
        }
      );

      const pairs = response.data?.pairs || [];
      
      // Filter for Solana pairs and sort by liquidity
      const solanaPairs = pairs.filter((p: any) => p.chainId === 'solana');
      return solanaPairs.sort((a: any, b: any) => 
        (b.liquidity?.usd || 0) - (a.liquidity?.usd || 0)
      );
    } catch (error: any) {
      console.error('Error fetching from DexScreener:', error.message);
      return [];
    }
  }

  /**
   * Get the most liquid pair for a token
   */
  async getMainPair(address: string): Promise<DexScreenerPair | null> {
    const pairs = await this.getTokenPairs(address);
    return pairs.length > 0 ? pairs[0] : null;
  }

  /**
   * Search for tokens by name or symbol
   */
  async searchTokens(query: string): Promise<DexScreenerPair[]> {
    try {
      const response = await axios.get(
        `${DEXSCREENER_BASE_URL}/dex/search`,
        {
          params: { q: query },
          timeout: 10000,
        }
      );

      const pairs = response.data?.pairs || [];
      return pairs.filter((p: any) => p.chainId === 'solana');
    } catch (error: any) {
      console.error('Error searching tokens:', error.message);
      return [];
    }
  }
}

export const dexScreenerClient = new DexScreenerClient();
