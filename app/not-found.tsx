import Link from 'next/link';
export default function NotFound() {
  return (
    <main className="not-found">
      <span className="eyebrow">
        <i>ERROR / 404</i> ROTA BULUNAMADI
      </span>
      <h1>
        Bu çıkış
        <br />
        kapalı.
      </h1>
      <p>Aradığınız sayfa taşınmış veya sistemden kaldırılmış olabilir.</p>
      <Link className="button primary" href="/">
        Ana rotaya dön
      </Link>
    </main>
  );
}
