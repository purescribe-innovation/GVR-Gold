import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'GVR Gold & Silver | Premium Jewelry Showcase',
  description:
    'Discover exquisite handcrafted gold and silver jewelry at GVR Gold & Silver. Browse our curated collection of rings, necklaces, bangles, and bridal sets featuring traditional artistry and contemporary design.',
  keywords: [
    'gold jewelry',
    'silver jewelry',
    'handcrafted jewelry',
    'bridal sets',
    'gold necklaces',
    'silver rings',
    'premium jewelry',
    'Indian jewelry',
  ],
  openGraph: {
    title: 'GVR Gold & Silver | Premium Jewelry Showcase',
    description:
      'Discover exquisite handcrafted gold and silver jewelry. Traditional artistry meets contemporary design.',
    type: 'website',
    locale: 'en_IN',
    siteName: 'GVR Gold & Silver',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>
        <Navigation />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
