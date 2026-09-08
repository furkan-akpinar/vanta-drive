import type { Metadata } from 'next';

function verifiedOrigin() {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    if (
      !['http:', 'https:'].includes(url.protocol) ||
      url.username ||
      url.password
    )
      return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}
export const siteOrigin = verifiedOrigin();
export function pageMetadata(
  route: string,
  metadata: Metadata,
  image = '/images/hero-vanta.webp',
): Metadata {
  const title =
    typeof metadata.title === 'string' ? metadata.title : 'VANTA DRIVE';
  const description =
    metadata.description ||
    'VANTA DRIVE Türkçe premium araç kiralama portföy demosu.';
  const imageUrl = siteOrigin ? siteOrigin + image : undefined;
  return {
    ...metadata,
    description,
    ...(siteOrigin
      ? {
          metadataBase: new URL(siteOrigin),
          alternates: { canonical: siteOrigin + route },
        }
      : {}),
    openGraph: {
      title,
      description,
      type: 'website',
      locale: 'tr_TR',
      ...(siteOrigin ? { url: siteOrigin + route } : {}),
      images: imageUrl
        ? [{ url: imageUrl, alt: title + ' · konsept görsel' }]
        : [],
    },
    twitter: {
      card: imageUrl ? 'summary_large_image' : 'summary',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}
