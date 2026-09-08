import type { MetadataRoute } from 'next';
import { vehicles } from '@/data/vehicles';
import { locations } from '@/data/content';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (!base) return [];
  const routes = [
    '',
    '/araclar',
    '/rezervasyon',
    '/paketler',
    '/kurumsal',
    '/havalimani-teslimati',
    '/soforlu-kiralama',
    '/lokasyonlar',
    '/hakkimizda',
    '/sss',
    '/iletisim',
    '/favoriler',
    '/kiralama-kosullari',
    '/gizlilik',
    '/kvkk',
  ];
  return [
    ...routes.map((route) => ({
      url: base + route,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...vehicles.map((v) => ({
      url: `${base}/araclar/${v.slug}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...locations.map((l) => ({
      url: `${base}/lokasyonlar/${l.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
