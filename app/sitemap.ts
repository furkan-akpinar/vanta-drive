import type { MetadataRoute } from 'next';
import { vehicles } from '@/data/vehicles';
import { locations } from '@/data/content';
import { siteOrigin } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteOrigin;
  if (!base) return [];
  const routes = [
    '',
    '/araclar',
    '/paketler',
    '/kurumsal',
    '/havalimani-teslimati',
    '/soforlu-kiralama',
    '/lokasyonlar',
    '/hakkimizda',
    '/sss',
    '/iletisim',
    '/kiralama-kosullari',
    '/gizlilik',
    '/kvkk',
  ];
  return [
    ...routes.map((route) => ({
      url: base + route,
      changeFrequency: 'weekly' as const,
      priority: route === '' ? 1 : 0.7,
    })),
    ...vehicles.map((v) => ({
      url: `${base}/araclar/${v.slug}`,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })),
    ...locations.map((l) => ({
      url: `${base}/lokasyonlar/${l.slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ];
}
