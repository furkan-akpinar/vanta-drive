import Link from 'next/link';
import { locations } from '@/data/content';
export function RouteMap() {
  return (
    <nav className="route-network" aria-label="Vanta Drive teslimat ağı">
      <ol>
        {locations.map((l, i) => (
          <li key={l.slug}>
            <Link href={'/lokasyonlar/' + l.slug}>
              <span className="route-number">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span>
                <small>{l.code}</small>
                <b>{l.name}</b>
              </span>
              <span aria-hidden="true">↗</span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
