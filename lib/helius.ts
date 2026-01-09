import axios from 'axios';
import { HeliusTransaction, TokenMetadata } from '@/types';

const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || '';
const HELIUS_API_URL = 'https://api-mainnet.helius-rpc.com';

export class HeliusClient {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || HELIUS_API_KEY;
  }

  /**
   * Fetch all transactions for a given token mint using Helius Parse Transaction History API
   * Uses pagination to get transactions up to maxTransactions limit
   */
  async getTransactionHistory(
    mint: string,
    maxTransactions: number = 10000 // Default: 10k transactions (100 pages)
  ): Promise<HeliusTransaction[]> {
    try {
      const allTransactions: HeliusTransaction[] = [];
      let beforeSignature: string | undefined = undefined;
      let hasMore = true;
      let pageCount = 0;

      console.log(`Starting to fetch transaction history (max: ${maxTransactions})...`);

      while (hasMore && allTransactions.length < maxTransactions) {
        const url = beforeSignature
          ? `${HELIUS_API_URL}/v0/addresses/${mint}/transactions?api-key=${this.apiKey}&before=${beforeSignature}`
          : `${HELIUS_API_URL}/v0/addresses/${mint}/transactions?api-key=${this.apiKey}`;

        const response = await axios.get(url);
        const transactions = response.data || [];

        if (transactions.length === 0) {
          hasMore = false;
          break;
        }

        allTransactions.push(...transactions);
        pageCount++;

        // Check if we got less than 100, meaning we're at the end
        if (transactions.length < 100) {
          hasMore = false;
        } else {
          // Get the last transaction signature for pagination
          beforeSignature = transactions[transactions.length - 1].signature;
        }

        // Log progress every 10 pages
        if (pageCount % 10 === 0) {
          console.log(`Progress: Fetched ${pageCount} pages, ${allTransactions.length} transactions...`);
        }

        // Stop if we've reached the limit
        if (allTransactions.length >= maxTransactions) {
          console.log(`⚠️ Reached transaction limit (${maxTransactions}), stopping...`);
          hasMore = false;
        }
      }

      // Trim to max if we went over
      const finalTransactions = allTransactions.slice(0, maxTransactions);

      console.log(`✅ Complete! Fetched ${finalTransactions.length} transactions (${pageCount} pages)`);
      return finalTransactions;
    } catch (error: any) {
      console.error('Error fetching transaction history:', error.response?.data || error.message);
      throw new Error('Failed to fetch transaction history from Helius');
    }
  }

  /**
   * Fetch token metadata using Helius DAS API
   */
  async getTokenMetadata(mint: string): Promise<TokenMetadata | null> {
    try {
      const response = await axios.post(
        `${HELIUS_API_URL}/v0/token-metadata?api-key=${this.apiKey}`,
        {
          mintAccounts: [mint],
        }
      );

      const metadata = response.data?.[0];
      if (!metadata) {
        return null;
      }

      return {
        mint,
        name: metadata.onChainMetadata?.metadata?.data?.name || this.getShortAddress(mint),
        symbol: metadata.onChainMetadata?.metadata?.data?.symbol || 'UNKNOWN',
        decimals: metadata.account?.data?.parsed?.info?.decimals || 9,
        supply: metadata.account?.data?.parsed?.info?.supply,
        logoURI: metadata.offChainMetadata?.metadata?.image,
        description: metadata.offChainMetadata?.metadata?.description,
        creator: metadata.onChainMetadata?.metadata?.updateAuthority,
      };
    } catch (error) {
      console.error('Error fetching token metadata:', error);
      return this.getFallbackMetadata(mint);
    }
  }

  /**
   * Fallback metadata when Helius fails
   */
  private getFallbackMetadata(mint: string): TokenMetadata {
    return {
      mint,
      name: this.getShortAddress(mint),
      symbol: 'UNKNOWN',
      decimals: 9,
    };
  }

  /**
   * Shorten address for display
   */
  private getShortAddress(address: string): string {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  }

  /**
   * Validate Solana address format
   */
  static isValidSolanaAddress(address: string): boolean {
    return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
  }
}

export const heliusClient = new HeliusClient();
