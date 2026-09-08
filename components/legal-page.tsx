import { Footer } from './footer';
export function LegalPage({
  code,
  title,
  intro,
  sections,
}: {
  code: string;
  title: string;
  intro: string;
  sections: { title: string; text: string }[];
}) {
  return (
    <main className="inner-page">
      <header className="page-header">
        <span className="eyebrow">
          <i>{code}</i> YASAL BİLGİ
        </span>
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>
      <article className="legal-copy">
        {sections.map((s, i) => (
          <section key={s.title}>
            <span>0{i + 1}</span>
            <div>
              <h2>{s.title}</h2>
              <p>{s.text}</p>
            </div>
          </section>
        ))}
      </article>
      <Footer />
    </main>
  );
}
