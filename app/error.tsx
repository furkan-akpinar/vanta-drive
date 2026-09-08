'use client';
export default function Error({ reset }: { reset: () => void }) {
  return (
    <main className="not-found">
      <span className="eyebrow">
        <i>ERROR / SYSTEM</i> BAĞLANTI KESİLDİ
      </span>
      <h1>
        Kontrol merkezi
        <br />
        yanıt vermedi.
      </h1>
      <button className="button primary" onClick={reset}>
        Tekrar dene
      </button>
    </main>
  );
}
