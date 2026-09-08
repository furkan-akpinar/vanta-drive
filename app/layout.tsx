import type { Metadata } from 'next';
import { SiteShell } from '@/components/site-shell';
import './globals.css';
import './fonts.css';

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: {
    default: 'VANTA DRIVE | Premium Araç Kiralama',
    template: '%s | VANTA DRIVE',
  },
  description:
    'Premium araç kiralama portföy demosu; havalimanı teslimatı, şoförlü transfer ve kurumsal filo çözümleri.',
  openGraph: {
    title: 'VANTA DRIVE',
    description: 'Yolu değil, standardı değiştirin.',
    type: 'website',
    locale: 'tr_TR',
    images: [
      {
        url: '/images/hero-vanta.webp',
        width: 1920,
        height: 1080,
        alt: 'VANTA DRIVE premium araç kiralama',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VANTA DRIVE',
    description: 'Yolu değil, standardı değiştirin.',
    images: ['/images/hero-vanta.webp'],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
