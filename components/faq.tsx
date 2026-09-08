import { vehicles } from '@/data/vehicles';
import { PRICE_NOTICE, TARIFF_NOTICE } from '@/lib/booking';
const faqs = [
  [
    'Kiralama için yaş sınırı nedir?',
    `Filoda minimum yaş ${Math.min(...vehicles.map((v) => v.minAge))}–${Math.max(...vehicles.map((v) => v.minAge))}, ehliyet süresi ${Math.min(...vehicles.map((v) => v.licenseYears))}–${Math.max(...vehicles.map((v) => v.licenseYears))} yıl arasında değişir. Seçtiğiniz aracın koşullarını son adımda demo beyanıyla onaylarsınız.`,
  ],
  [
    'Depozito ne zaman iade edilir?',
    'Bu demoda depozito veya provizyon alınmaz. Araçtaki örnek depozito, kiralama toplamından ayrı gösterilir.',
  ],
  [
    'Havalimanında araç teslimi nasıl çalışır?',
    'İstanbul Havalimanı veya Sabiha Gökçen ve karşılama hizmetini seçin. Örnek uçuş numarası gerekir. Canlı takip ve gerçek teslimat yapılmaz.',
  ],
  ['Fiyatlara neler dahildir?', PRICE_NOTICE],
  [
    'Rezervasyonu değiştirebilir miyim?',
    'Demo tamamlanmadan son kontroldeki düzenleme bağlantılarıyla adımlara dönün. Gerçek rezervasyon oluşmadığı için iptal işlemi veya ücret yoktur.',
  ],
  [
    'Günlük, haftalık ve aylık fiyat nasıl hesaplanır?',
    'Minimum 24 saat; başlanan ek gün tam gün sayılır. ' + TARIFF_NOTICE,
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
