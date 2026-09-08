import Link from 'next/link';
const points = [
  ['IST', 'İstanbul', 'istanbul-merkez'],
  ['ANK', 'Ankara', 'ankara'],
  ['IZM', 'İzmir', 'izmir'],
  ['AYT', 'Antalya', 'antalya'],
];
export function Footer() {
  return (
    <footer className="terminal-footer">
      <div className="route-line">
        {points.map(([code, city, slug]) => (
          <Link className="route-stop" href={'/lokasyonlar/' + slug} key={code}>
            <span>{code}</span>
            <b>{city}</b>
          </Link>
        ))}
      </div>
      <div className="footer-grid">
        <div className="footer-brand">
          <b className="wordmark">VANTA DRIVE</b>
          <p>Konsept araç kiralama sitesi · Portföy demosu</p>
          <span>
            Özenle seçilmiş rotalar.
            <br />
            İyi tasarlanmış deneyimler.
          </span>
        </div>
        <div>
          <b>KEŞFET</b>
          <Link href="/araclar">Araçlar</Link>
          <Link href="/favoriler">Favoriler</Link>
          <Link href="/lokasyonlar">Lokasyonlar</Link>
          <Link href="/paketler">Paketler</Link>
        </div>
        <div>
          <b>HİZMETLER</b>
          <Link href="/havalimani-teslimati">Havalimanı teslimatı</Link>
          <Link href="/soforlu-kiralama">Şoförlü kiralama</Link>
          <Link href="/kurumsal">Kurumsal filo</Link>
        </div>
        <div>
          <b>BİLGİ</b>
          <Link href="/hakkimizda">Hakkımızda</Link>
          <Link href="/sss">Sık sorulanlar</Link>
          <Link href="/iletisim">İletişim</Link>
        </div>
        <div>
          <b>KOŞULLAR</b>
          <Link href="/kiralama-kosullari">Kiralama koşulları</Link>
          <Link href="/gizlilik">Gizlilik</Link>
          <Link href="/kvkk">KVKK</Link>
        </div>
      </div>
      <div className="footer-base">
        <span>© 2026 VANTA DRIVE · TR</span>
        <span>
          Designed &amp; Developed by <b>Furkan Akpınar</b>
        </span>
      </div>
    </footer>
  );
}
