import axios from 'axios';

const BIRDEYE_API_KEY = process.env.NEXT_PUBLIC_BIRDEYE_API_KEY || '';
const BIRDEYE_BASE_URL = 'https://public-api.birdeye.so';

export interface BirdeyeTokenOverview {
  address: string;
  decimals: number;
  symbol: string;
  name: string;
  logoURI?: string;
  liquidity: number;
  price: number;
  priceChange24h: number;
  volume24h: number;
  volume24hChangePercent: number;
  trade24h: number;
  uniqueWallet24h: number;
  holder: number;
  mc?: number;
  v24hChangePercent?: number;
  v24hUSD?: number;
}

export interface BirdeyeTopTrader {
  address: string;
  pnl: number;
  pnlPercent?: number;
  volume: number;
  txs: number;
  buy: number;
  sell: number;
  avgBuyPrice?: number;
  avgSellPrice?: number;
  totalBuy?: number;
  totalSell?: number;
}

export interface BirdeyeTopTradersResponse {
  data: {
    items: BirdeyeTopTrader[];
  };
  success: boolean;
}

export class BirdeyeClient {
  private apiKey: string;
  private headers: Record<string, string>;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || BIRDEYE_API_KEY;
    this.headers = {
      'X-API-KEY': this.apiKey,
      'x-chain': 'solana',
    };
  }

  /**
   * Get token overview with aggregated stats
   */
  async getTokenOverview(address: string): Promise<BirdeyeTokenOverview | null> {
    if (!this.apiKey) {
      console.log('No Birdeye API key - skipping token overview');
      return null;
    }

    try {
      const response = await axios.get(
        `${BIRDEYE_BASE_URL}/defi/token_overview`,
        {
          params: { address },
          headers: this.headers,
          timeout: 10000,
        }
      );

      return response.data?.data || null;
    } catch (error: any) {
      console.error('Error fetching Birdeye token overview:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get top traders by PnL - THIS IS THE GOLD!
   * Returns wallets with highest/lowest realized profits
   */
  async getTopTraders(
    address: string,
    limit: number = 10
  ): Promise<BirdeyeTopTrader[] | null> {
    if (!this.apiKey) {
      console.log('No Birdeye API key - skipping top traders');
      return null;
    }

    try {
      // Birdeye only allows limit 1-10
      const validLimit = Math.min(Math.max(limit, 1), 10);
      
      const response = await axios.get(
        `${BIRDEYE_BASE_URL}/trader/gainers-losers`,
        {
          params: {
            address,
            sort_by: 'pnl',
            sort_type: 'desc',
            offset: 0,
            limit: validLimit,
          },
          headers: this.headers,
          timeout: 15000,
        }
      );

      const items = response.data?.data?.items || [];
      
      // Birdeye returns all traders, we'll sort them ourselves
      return items.sort((a: BirdeyeTopTrader, b: BirdeyeTopTrader) => b.pnl - a.pnl);
    } catch (error: any) {
      console.error('Error fetching Birdeye top traders:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get historical trades (for finding top buyer price)
   */
  async getRecentTrades(
    address: string,
    limit: number = 100
  ): Promise<any[] | null> {
    if (!this.apiKey) {
      console.log('No Birdeye API key - skipping trades');
      return null;
    }

    try {
      const response = await axios.get(
        `${BIRDEYE_BASE_URL}/defi/txs/token`,
        {
          params: {
            address,
            tx_type: 'swap',
            sort_type: 'desc',
            offset: 0,
            limit,
          },
          headers: this.headers,
          timeout: 15000,
        }
      );

      return response.data?.data?.items || null;
    } catch (error: any) {
      console.error('Error fetching Birdeye trades:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Get price history
   */
  async getPriceHistory(
    address: string,
    timeframe: '1m' | '5m' | '15m' | '1H' | '4H' | '1D' = '1H',
    timeFrom?: number,
    timeTo?: number
  ): Promise<Array<{ unixTime: number; value: number }> | null> {
    if (!this.apiKey) {
      console.log('No Birdeye API key - skipping price history');
      return null;
    }

    try {
      const params: any = {
        address,
        address_type: 'token',
        type: timeframe,
      };

      if (timeFrom) params.time_from = timeFrom;
      if (timeTo) params.time_to = timeTo;

      const response = await axios.get(
        `${BIRDEYE_BASE_URL}/defi/history_price`,
        {
          params,
          headers: this.headers,
          timeout: 15000,
        }
      );

      return response.data?.data?.items || null;
    } catch (error: any) {
      console.error('Error fetching Birdeye price history:', error.response?.data || error.message);
      return null;
    }
  }

  /**
   * Check if API key is configured
   */
  isConfigured(): boolean {
    return !!this.apiKey && this.apiKey !== '';
  }
}

export const birdeyeClient = new BirdeyeClient();