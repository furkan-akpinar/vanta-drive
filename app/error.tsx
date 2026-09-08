'use client';
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="not-found">
      <span className="eyebrow">
        <i>ERROR / SYSTEM</i> SAYFA AÇILAMADI
      </span>
      <h1>
        Kontrol merkezi
        <br />
        yanıt vermedi.
      </h1>
      <p>
        Bu sayfa yüklenirken bir sorun oluştu. Yeniden deneyebilirsiniz; gerçek
        işlem yapılmadı.
      </p>
      <button className="button primary" onClick={reset}>
        Tekrar dene
      </button>
    </main>
  );
}
