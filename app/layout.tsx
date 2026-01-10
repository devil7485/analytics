import type { Metadata } from 'next';
import { Syne, JetBrains_Mono, Space_Mono } from 'next/font/google';
import './globals.css';

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Solana Memecoin Analytics',
  description: 'Analyze Solana memecoins and discover top traders',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${jetbrainsMono.variable} ${spaceMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}