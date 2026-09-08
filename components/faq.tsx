const faqs = [
  [
    'Kiralama için yaş sınırı nedir?',
    'Araç sınıfına göre minimum yaş 26–30, ehliyet süresi ise 4–7 yıl arasında değişir. Her aracın detay sayfasında geçerli koşullar gösterilir.',
  ],
  [
    'Depozito ne zaman iade edilir?',
    'Araç kontrolü tamamlandıktan sonra depozito provizyonu bankanıza bağlı olarak 2–7 iş günü içinde kaldırılır.',
  ],
  [
    'Havalimanında araç teslimi nasıl çalışır?',
    'Uçuş numaranızı rezervasyona eklediğinizde ekibimiz gecikmeleri takip eder ve terminal çıkışında sizi karşılar.',
  ],
  [
    'Fiyatlara neler dahildir?',
    'Belirtilen kilometre limiti, zorunlu trafik sigortası, standart kasko ve 7/24 yol desteği dahildir.',
  ],
  [
    'Rezervasyonu değiştirebilir miyim?',
    'Teslim saatinden 24 saat öncesine kadar müsaitliğe bağlı olarak tarih, araç sınıfı ve teslimat noktası değiştirilebilir.',
  ],
];
export function FAQ({ limit = faqs.length }: { limit?: number }) {
  return (
    <div className="faq">
      {faqs.slice(0, limit).map(([q, a], i) => (
        <details key={q} open={i === 0}>
          <summary>
            {String(i + 1).padStart(2, '0')} / {q}
          </summary>
          <div className="faq-answer">
            <p>{a}</p>
          </div>
        </details>
      ))}
    </div>
  );
}
