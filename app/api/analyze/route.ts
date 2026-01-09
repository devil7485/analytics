import { NextRequest, NextResponse } from 'next/server';
import { HeliusClient } from '@/lib/helius';
import { dexScreenerClient } from '@/lib/dexscreener';
import { birdeyeClient } from '@/lib/birdeye';
import {
  normalizeTransactions,
  buildWalletPositions,
  findTopBuyer,
  findMostProfitable,
  findBiggestLoser,
  getPriceRange,
} from '@/lib/tradeProcessor';
import { cacheManager } from '@/lib/cache';
import { apiRateLimiter, getClientIdentifier } from '@/lib/rateLimiter';
import { AnalyzeTokenRequest, AnalyzeTokenResponse, TokenAnalytics, PricePoint } from '@/types';

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const clientId = getClientIdentifier(request);
    const rateLimitCheck = apiRateLimiter.check(clientId);

    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded. Please try again later.',
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
            'X-RateLimit-Reset': new Date(rateLimitCheck.reset).toISOString(),
          },
        }
      );
    }

    // Parse request body
    const body: AnalyzeTokenRequest = await request.json();
    const { mint, forceRefresh } = body;

    // Validate mint address
    if (!mint || !HeliusClient.isValidSolanaAddress(mint)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid Solana token mint address',
        },
        { status: 400 }
      );
    }

    // Check cache unless force refresh
    if (!forceRefresh) {
      const cached = cacheManager.get(mint);
      if (cached) {
        return NextResponse.json(
          {
            success: true,
            data: cached.analytics,
            cached: true,
          },
          {
            headers: {
              'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
              'X-Cache': 'HIT',
            },
          }
        );
      }
    }

    // Initialize clients
    const helius = new HeliusClient();

    // Fetch data from multiple sources in parallel for maximum speed!
    console.log(`Fetching data from DexScreener, Birdeye, and Helius...`);
    const [metadata, dexPair, birdeyeTraders] = await Promise.all([
      helius.getTokenMetadata(mint),
      dexScreenerClient.getMainPair(mint),
      birdeyeClient.isConfigured() ? birdeyeClient.getTopTraders(mint, 50) : Promise.resolve(null),
    ]);

    if (!metadata) {
      return NextResponse.json(
        {
          success: false,
          error: 'Token not found or invalid',
        },
        { status: 404 }
      );
    }

    // Log what data we got
    if (dexPair) {
      console.log(`✅ DexScreener: $${dexPair.priceUsd}, Vol: $${dexPair.volume.h24.toLocaleString()}`);
    }
    if (birdeyeTraders && birdeyeTraders.length > 0) {
      console.log(`✅ Birdeye: Found ${birdeyeTraders.length} top traders`);
    } else {
      console.log('⚠️ Birdeye data not available (no API key or no data)');
    }

    // Decide whether to use Birdeye or Helius for wallet analysis
    let topBuyer, mostProfitable, biggestLoser, positions, trades, priceHistory;
    let totalTraders = 0;
    let totalTrades = 0;
    let highestPrice = 0;
    let lowestPrice = 0;
    let currentPrice: number | undefined;

    if (birdeyeTraders && birdeyeTraders.length > 0) {
      // USE BIRDEYE DATA - Pre-calculated from ALL transactions!
      console.log('📊 Using Birdeye pre-calculated data (all-time)');
      
      // Find most profitable (highest PnL)
      const sortedByProfit = [...birdeyeTraders].sort((a, b) => b.pnl - a.pnl);
      const mostProfitableTrader = sortedByProfit[0];
      
      // Find biggest loser (lowest PnL)
      const sortedByLoss = [...birdeyeTraders].sort((a, b) => a.pnl - b.pnl);
      const biggestLoserTrader = sortedByLoss[0];
      
      // Convert Birdeye format to our WalletPosition format
      mostProfitable = {
        wallet: mostProfitableTrader.address,
        totalBought: mostProfitableTrader.totalBuy || mostProfitableTrader.buy,
        totalSold: mostProfitableTrader.totalSell || mostProfitableTrader.sell,
        averageBuyPrice: mostProfitableTrader.avgBuyPrice || 0,
        averageSellPrice: mostProfitableTrader.avgSellPrice || 0,
        realizedPnL: mostProfitableTrader.pnl,
        realizedPnLPercent: mostProfitableTrader.pnlPercent || 0,
        trades: [],
      };
      
      biggestLoser = {
        wallet: biggestLoserTrader.address,
        totalBought: biggestLoserTrader.totalBuy || biggestLoserTrader.buy,
        totalSold: biggestLoserTrader.totalSell || biggestLoserTrader.sell,
        averageBuyPrice: biggestLoserTrader.avgBuyPrice || 0,
        averageSellPrice: biggestLoserTrader.avgSellPrice || 0,
        realizedPnL: biggestLoserTrader.pnl,
        realizedPnLPercent: biggestLoserTrader.pnlPercent || 0,
        trades: [],
      };
      
      totalTraders = birdeyeTraders.length;
      totalTrades = birdeyeTraders.reduce((sum, t) => sum + t.txs, 0);
      
      // For top buyer and price history, we still need some transaction data
      // But we only need recent data, not all history
      console.log('Fetching recent transactions for top buyer and price history...');
      const maxTransactions = 5000; // Reduced since we have Birdeye data
      const transactions = await helius.getTransactionHistory(mint, maxTransactions);
      trades = normalizeTransactions(transactions, mint, metadata.decimals);
      
      if (trades.length > 0) {
        const tempPositions = buildWalletPositions(trades);
        topBuyer = findTopBuyer(tempPositions);
        const priceRange = getPriceRange(trades);
        highestPrice = priceRange.highest;
        lowestPrice = priceRange.lowest;
        currentPrice = trades[trades.length - 1].price;
        
        // Build price history
        priceHistory = [];
        const sampleInterval = Math.max(1, Math.floor(trades.length / 100));
        for (let i = 0; i < trades.length; i += sampleInterval) {
          priceHistory.push({
            timestamp: trades[i].timestamp,
            price: trades[i].price,
            volume: trades[i].quantity,
          });
        }
      } else {
        topBuyer = null;
        priceHistory = [];
      }
      
    } else {
      // FALLBACK TO HELIUS - Calculate everything ourselves
      console.log('📊 Using Helius transaction analysis (limited to 10k txns)');
      
      const maxTransactions = parseInt(process.env.NEXT_PUBLIC_MAX_TRANSACTIONS || '10000');
      const transactions = await helius.getTransactionHistory(mint, maxTransactions);

      console.log(`Received ${transactions.length} transactions`);

      if (transactions.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No trading history found for this token',
          },
          { status: 404 }
        );
      }

      // Normalize transactions into trades
      console.log(`Processing ${transactions.length} transactions...`);
      trades = normalizeTransactions(transactions, mint, metadata.decimals);

      console.log(`Extracted ${trades.length} valid trades from ${transactions.length} transactions`);

      if (trades.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No valid swap transactions found',
          },
          { status: 404 }
        );
      }

      // Build wallet positions
      positions = buildWalletPositions(trades);

      // Compute analytics
      topBuyer = findTopBuyer(positions);
      mostProfitable = findMostProfitable(positions);
      biggestLoser = findBiggestLoser(positions);
      const priceRange = getPriceRange(trades);
      highestPrice = priceRange.highest;
      lowestPrice = priceRange.lowest;
      currentPrice = trades[trades.length - 1].price;

      totalTraders = positions.size;
      totalTrades = trades.length;

      // Build price history
      priceHistory = [];
      const sampleInterval = Math.max(1, Math.floor(trades.length / 100));
      for (let i = 0; i < trades.length; i += sampleInterval) {
        priceHistory.push({
          timestamp: trades[i].timestamp,
          price: trades[i].price,
          volume: trades[i].quantity,
        });
      }
    }

    // Build analytics object
    const analytics: TokenAnalytics = {
      metadata,
      topBuyer,
      mostProfitable,
      biggestLoser,
      totalTraders,
      totalTrades,
      highestPrice,
      lowestPrice,
      currentPrice,
      priceHistory: priceHistory || [],
      lastUpdated: Date.now(),
      
      // Add DexScreener aggregated data (instant stats!)
      dexData: dexPair ? {
        volume24h: dexPair.volume.h24,
        volumeChange24h: ((dexPair.volume.h24 - dexPair.volume.h6) / dexPair.volume.h6) * 100,
        priceChange24h: dexPair.priceChange.h24,
        buys24h: dexPair.txns.h24.buys,
        sells24h: dexPair.txns.h24.sells,
        liquidity: dexPair.liquidity.usd || 0,
        marketCap: dexPair.marketCap,
        fdv: dexPair.fdv,
        priceUsd: dexPair.priceUsd ? parseFloat(dexPair.priceUsd) : undefined,
      } : undefined,
    };

    // Cache the result
    const ttl = cacheManager.calculateDynamicTTL(totalTrades);
    cacheManager.set(mint, {
      mint,
      analytics,
      computedAt: Date.now(),
      expiresAt: Date.now() + ttl,
    });

    // Return response
    return NextResponse.json(
      {
        success: true,
        data: analytics,
        cached: false,
      },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimitCheck.remaining.toString(),
          'X-Cache': 'MISS',
        },
      }
    );
  } catch (error: any) {
    console.error('Error in analyze API:', error);

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
