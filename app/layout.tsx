import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Solana Memecoin Analytics | On-Chain Trading Intelligence',
  description: 'Analyze Solana memecoin trading behavior. Find top buyers, most profitable wallets, and comprehensive on-chain analytics.',
  keywords: 'solana, memecoin, analytics, trading, blockchain, crypto',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
