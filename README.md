# VANTA DRIVE

Premium araç kiralama deneyimi için çok sayfalı bir portföy projesi. Araç kataloğu, karşılaştırma ve dört adımlı rezervasyon akışı içerir.

**Furkan Akpınar**

![VANTA DRIVE](public/images/hero-vanta.webp)

## Kurulum

Node.js 22.13 veya üzeri ve npm gerekir.

```sh
npm ci
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır.

## Özellikler

- 20 araç ve 8 araç sınıfı; marka, yakıt, vites, koltuk, fiyat ve lokasyon filtreleri.
- URL üzerinden paylaşılabilen arama, sıralama ve filtre tercihleri.
- Dokunmatik ve klavye destekli araç vitrini.
- Tarayıcıda saklanan favoriler ve en fazla üç araç karşılaştırması.
- Ortak tarih, lokasyon ve fiyat hesabı kullanan rezervasyon adımları.
- Mobil menü, filtre paneli ve hareket azaltma tercihine uyumlu animasyonlar.

Proje bir arayüz demosudur. Formlar gerçek rezervasyon oluşturmaz, ödeme almaz veya bilgi göndermez. Rezervasyon taslağında yalnızca araç ve seyahat tercihleri tutulur; iletişim bilgileri kalıcı olarak saklanmaz.

## Teknoloji

React 19, TypeScript, Vinext, Vite, Tailwind CSS, Base UI / shadcn, Embla ve Framer Motion. Üretim sunucusu Cloudflare Workers hedefiyle derlenir.

| Dizin            | İçerik                                               |
| ---------------- | ---------------------------------------------------- |
| `app/`           | Sayfalar, metadata ve stiller                        |
| `components/`    | Site bileşenleri ve rezervasyon adımları             |
| `components/ui/` | Kullanılan ortak arayüz bileşenleri                  |
| `data/`          | Araçlar, sınıflar, lokasyonlar ve ek hizmetler       |
| `lib/`           | Fiyat hesabı, taslak doğrulama ve katalog filtreleri |
| `hooks/`         | Ortak React hook'ları                                |
| `scripts/`       | Kontroller ve görsel hazırlama                       |
| `public/`        | Yerel görseller, video ve fontlar                    |

Fiyatların kaynağı `data/vehicles.ts` dosyasıdır. En az 24 saat kiralama yapılır; başlanan ek gün tam güne yuvarlanır. 1–6 gün günlük, 7–29 gün haftalık fiyatın yedide biri, 30 gün ve üzeri aylık fiyatın otuzda biri kullanılır. Ek hizmetler günlük veya tek seferlik ücretlendirilir.

## Kontroller

```sh
npm run check
npm run format:check
npm run build
```

`check`, TypeScript, lint ve rezervasyon/katalog kontrollerini sırasıyla çalıştırır. GitHub Actions aynı kontrolleri, biçim denetimini ve üretim derlemesini her push ve pull request için çalıştırır.

Tarayıcı kontrolleri için Chromium'u kurun ve uygulamayı ayrı bir terminalde başlatın:

```sh
npx playwright install chromium
npm run dev
```

Ardından ikinci terminalde:

```sh
npm run test:ui
npm run test:layout
```

Betikler varsayılan olarak `http://localhost:3000` adresini kullanır. Farklı bir sunucu için `BASE_URL` ortam değişkenini ayarlayın. Ekran görüntüleri ve raporlar Git dışında tutulan `outputs/qa/` dizinine yazılır.

## Üretim çıktısı

```sh
npm run build
npm start
```

Derleme `dist/client` ve `dist/server` dizinlerini oluşturur. `npm start` bu çıktıyı Wrangler ile yerel olarak çalıştırır. Bu depo kaynak kodu paylaşımı için hazırlanmıştır; mevcut sunucu çıktısı GitHub Pages'e doğrudan yüklenemez.

Sitemap için `NEXT_PUBLIC_SITE_URL` ortam değişkenine yayın adresi verilebilir. Örnek değişkenler `.env.example` dosyasındadır.

## Görseller

Görseller ve hero videosu projeyle birlikte gelir. Kaynaklar, düzenleme bilgileri ve atıflar [ASSET-SOURCES.md](ASSET-SOURCES.md) dosyasındadır. Araç bilgileri ve görseller konsept sunum içindir.

Yeni PNG/JPEG kaynaklarından 1600 ve 800 piksel genişliğinde WebP dosyaları hazırlamak için:

```sh
npm run assets:prepare -- ./source-images
```

Dosya adları korunur; küçük sürüme `-800` eki eklenir. Kaynak klasöründeki dosyalar değiştirilmez. Komut aynı adlı hedef dosyaları günceller.
