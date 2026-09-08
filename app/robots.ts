import type { MetadataRoute } from 'next';
import { siteOrigin } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  const base = siteOrigin;
  return {
    rules: { userAgent: '*', allow: '/' },
    ...(base ? { sitemap: base.replace(/\/$/, '') + '/sitemap.xml' } : {}),
  };
}
