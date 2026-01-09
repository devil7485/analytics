import { Trade, HeliusTransaction, WalletPosition } from '@/types';

/**
 * Normalize raw Helius transactions into standardized Trade objects
 */
export function normalizeTransactions(
  transactions: HeliusTransaction[],
  targetMint: string,
  decimals: number
): Trade[] {
  const trades: Trade[] = [];

  for (const tx of transactions) {
    try {
      const trade = extractTradeFromTransaction(tx, targetMint, decimals);
      if (trade) {
        trades.push(trade);
      }
    } catch (error) {
      console.error('Error normalizing transaction:', tx.signature, error);
    }
  }

  // Sort by timestamp (oldest first)
  return trades.sort((a, b) => a.timestamp - b.timestamp);
}

/**
 * Extract trade information from a Helius transaction
 */
function extractTradeFromTransaction(
  tx: HeliusTransaction,
  targetMint: string,
  decimals: number
): Trade | null {
  const swapEvent = tx.events?.swap;
  if (!swapEvent) return null;

  // Find token changes for the target mint
  const tokenInputs = swapEvent.tokenInputs?.filter((t) => t.mint === targetMint) || [];
  const tokenOutputs = swapEvent.tokenOutputs?.filter((t) => t.mint === targetMint) || [];

  let wallet: string | null = null;
  let side: 'buy' | 'sell' | null = null;
  let quantity = 0;
  let priceInSol = 0;

  // Determine if this is a buy or sell
  if (tokenOutputs.length > 0) {
    // User received tokens = BUY
    side = 'buy';
    wallet = tokenOutputs[0].userAccount;
    quantity = parseFloat(tokenOutputs[0].rawTokenAmount.tokenAmount) / Math.pow(10, decimals);
    
    // Calculate price from SOL input
    const solInput = swapEvent.nativeInput;
    if (solInput) {
      const solAmount = parseFloat(solInput.amount) / 1e9; // Convert lamports to SOL
      priceInSol = solAmount / quantity;
    }
  } else if (tokenInputs.length > 0) {
    // User sent tokens = SELL
    side = 'sell';
    wallet = tokenInputs[0].userAccount;
    quantity = parseFloat(tokenInputs[0].rawTokenAmount.tokenAmount) / Math.pow(10, decimals);
    
    // Calculate price from SOL output
    const solOutput = swapEvent.nativeOutput;
    if (solOutput) {
      const solAmount = parseFloat(solOutput.amount) / 1e9;
      priceInSol = solAmount / quantity;
    }
  }

  if (!wallet || !side || quantity === 0 || priceInSol === 0) {
    return null;
  }

  return {
    wallet,
    side,
    price: priceInSol,
    quantity,
    timestamp: tx.timestamp,
    signature: tx.signature,
  };
}

/**
 * Build wallet positions from trades and calculate PnL
 */
export function buildWalletPositions(trades: Trade[]): Map<string, WalletPosition> {
  const positions = new Map<string, WalletPosition>();

  for (const trade of trades) {
    let position = positions.get(trade.wallet);

    if (!position) {
      position = {
        wallet: trade.wallet,
        totalBought: 0,
        totalSold: 0,
        averageBuyPrice: 0,
        averageSellPrice: 0,
        realizedPnL: 0,
        realizedPnLPercent: 0,
        trades: [],
      };
      positions.set(trade.wallet, position);
    }

    position.trades.push(trade);

    if (trade.side === 'buy') {
      const prevTotal = position.totalBought * position.averageBuyPrice;
      const newTotal = prevTotal + trade.quantity * trade.price;
      position.totalBought += trade.quantity;
      position.averageBuyPrice = position.totalBought > 0 ? newTotal / position.totalBought : 0;
    } else {
      const prevTotal = position.totalSold * position.averageSellPrice;
      const newTotal = prevTotal + trade.quantity * trade.price;
      position.totalSold += trade.quantity;
      position.averageSellPrice = position.totalSold > 0 ? newTotal / position.totalSold : 0;

      // Calculate realized PnL for this sell
      const costBasis = trade.quantity * position.averageBuyPrice;
      const saleProceeds = trade.quantity * trade.price;
      position.realizedPnL += saleProceeds - costBasis;
    }
  }

  // Calculate PnL percentage for each position
  positions.forEach((position) => {
    const totalCost = position.totalBought * position.averageBuyPrice;
    if (totalCost > 0) {
      position.realizedPnLPercent = (position.realizedPnL / totalCost) * 100;
    }
  });

  return positions;
}

/**
 * Find the wallet that bought at the exact highest price
 */
export function findTopBuyer(positions: Map<string, WalletPosition>): WalletPosition | null {
  let topBuyer: WalletPosition | null = null;
  let highestBuyPrice = 0;

  positions.forEach((position) => {
    const buyTrades = position.trades.filter((t) => t.side === 'buy');
    for (const trade of buyTrades) {
      if (trade.price > highestBuyPrice) {
        highestBuyPrice = trade.price;
        topBuyer = position;
      }
    }
  });

  return topBuyer;
}

/**
 * Find the wallet with the highest realized profit
 */
export function findMostProfitable(positions: Map<string, WalletPosition>): WalletPosition | null {
  let mostProfitable: WalletPosition | null = null;
  let highestProfit = 0;

  positions.forEach((position) => {
    if (position.realizedPnL > highestProfit) {
      highestProfit = position.realizedPnL;
      mostProfitable = position;
    }
  });

  return mostProfitable;
}

/**
 * Find the wallet with the largest realized loss
 */
export function findBiggestLoser(positions: Map<string, WalletPosition>): WalletPosition | null {
  let biggestLoser: WalletPosition | null = null;
  let largestLoss = 0;

  positions.forEach((position) => {
    if (position.realizedPnL < largestLoss) {
      largestLoss = position.realizedPnL;
      biggestLoser = position;
    }
  });

  return biggestLoser;
}

/**
 * Get price range from trades
 */
export function getPriceRange(trades: Trade[]): { highest: number; lowest: number } {
  let highest = 0;
  let lowest = Number.MAX_VALUE;

  trades.forEach((trade) => {
    if (trade.price > highest) highest = trade.price;
    if (trade.price < lowest) lowest = trade.price;
  });

  return { highest, lowest: lowest === Number.MAX_VALUE ? 0 : lowest };
}
