# VANTA DRIVE

Türkçe premium araç kiralama portföy demosu. Yirmi konsept araç; URL ile filtreleme, favoriler ve karşılaştırma, dört adımlı rezervasyon ve örnek hizmet formları.

**Canlı demo:** [vanta-drive.furkan-akpinar.workers.dev](https://vanta-drive.furkan-akpinar.workers.dev). Cloudflare Workers üzerinde herkese açık yayın; GitHub deposu Private kalır.

## Gerçek uygulama görüntüleri

Aşağıdaki görüntüler 8 Eylül 2026'da çalışan yerel üretim çıktısından alınmıştır.

![Masaüstü ana sayfa](docs/screenshots/desktop.png)
<img src="docs/screenshots/mobile.png" alt="Mobil ana sayfa" width="390" />

[Rezervasyonun son kontrol ekranı](docs/screenshots/reservation.png)

## Çalıştırma

Node.js **22.13+** ve npm gerekir. Kilit dosyası korunur.

```bash
git clone https://github.com/furkan-akpinar/vanta-drive.git
cd vanta-drive
npm ci
npm run dev
```

Geliştirme: http://localhost:3000

```bash
npm run build
npm run start -- --port 3001
```

Üretim çıktısının yerel Workers önizlemesi: http://127.0.0.1:3001

## Teknoloji

- React 19, TypeScript, **Vinext 1.0.0-beta.9**, Vite 8.
- Cloudflare Vite eklentisi ve Workers çalışma zamanı.
- Base UI / Shadcn etkileşim bileşenleri, Embla, Framer Motion.
- Yerel Geist fontları, WebP araç görselleri ve iki boyutta H.264 hero videosu.
- Oxlint, Oxfmt, TypeScript ve Playwright.

`next/*` importları Vinext uyumluluk katmanını kullanır. Proje standart Next.js veya GitHub Pages export projesi değildir. `vite.config.ts` sunucu çıktısını oluşturur; çelişen `output: 'export'` ayarı kaldırılmıştır.

## Kullanıcı akışı

Ana sayfa / lokasyon / program → katalog → araç detayı → araç ve tarih → teslimat → ek hizmetler → iletişim ve son kontrol → demo özeti.

- Teslim alma lokasyonu seçilmişse katalog yalnızca o noktaya uygun araçları gösterir. Doğrudan katalogda, nokta seçilene kadar tüm filo görünür.
- Eski `lokasyon` bağlantıları desteklenir. Çelişki varsa `pickup` önceliklidir ve açıklama gösterilir.
- Araç değişiminde uyumsuz teslimat sessizce değiştirilmez; uygun noktalar açıklanır.
- Katalog ilk sunucu yanıtında araç kartlarını içerir. Yerel filtre değişiklikleri, Vinext'in izlediği History API ile arama odağını korur.
- Arama 300 ms geciktirilir, boşluklar temizlenir. Filtreler, sıralama ve görünüm URL'de saklanır; geri/ileri gezinme desteklenir.
- Tümünü temizle seyahat lokasyonunu ve tarihlerini korur. Lokasyon etiketi kaldırılarak tüm noktalar yeniden gösterilebilir.
- En fazla üç favori araç karşılaştırılır. Seçimler yenilemede korunur; favoriden kaldırılan veya artık bulunmayan kayıtlar temizlenir.
- Tek görselli araç dosyaları tek konsept görsel gösterir; aynı görsel farklı açı gibi tekrarlanmaz.

## Tarih, taslak ve tarife kuralları

Ortak kaynak: `lib/booking.ts`; araç tarifeleri: `data/vehicles.ts`; hizmet kuralları: `data/content.ts`.

- Tarih/saat girdileri **Türkiye saati (Europe/Istanbul, UTC+03:00)** olarak yorumlanır. Tarayıcı ve sunucu saat dilimleri sonucu değiştirmez.
- Minimum süre 24 saattir. Başlanan ek gün tam gün sayılır.
- 1–6 gün: günlük ücret; 7–29 gün: haftalık ücret / 7; 30+ gün: aylık ücret / 30. İlgili oran tüm süreye uygulanır.
- Porsche 911 Carrera için 29 gün **459.857 TL**, 30 gün **390.000 TL** sonucu bilinçli paket politikasıdır.
- Günlük hizmetler gün sayısıyla, tek seferlik hizmetler bir kez hesaplanır. Ek kilometre günlük **100 km** ekler.
- Kiralama ve ek hizmetler ayrı, depozito toplamın dışında gösterilir. Demo fiyatlarının vergi dahil olduğu varsayılır; gerçek vergi oranı hesaplanmaz.
- Açık seyahat/araç URL'si yeni yolculuk başlatır ve eski taslağa üstün gelir; URL'de olmayan alanlar varsayılanla tamamlanır. URL yoksa geçerli v2 taslak, ardından varsayılanlar kullanılır.
- Bozuk/eski/geçmiş taslak güvenle yenilenir. Geçerli biçimdeki geçmiş veya ters URL tarihleri kullanıcı düzeltmeden ilerleyemez.
- Rezervasyon başlangıcı sayfanın sorgu anlık görüntüsünden alınır; geçiş sırasında henüz değişmemiş `window.location` okunmaz.

## Demo sınırları ve veri

Gerçek ödeme, rezervasyon/talep gönderimi, müşteri veritabanı, üyelik, yönetim paneli, e-posta/SMS, uçuş takibi veya canlı envanter bulunmaz.

Ad, telefon, e-posta, adres, uçuş ve mesaj bilgileri açık formda tutulur; URL, localStorage, log veya analitiğe yazılmaz. Tamamlanmada iletişim alanları ve rezervasyon taslağı temizlenir. Örnek bilgilerle kullanılmalıdır.

Tarayıcıda yalnızca `vanta-favorites`, `vanta-compare` ve hassas olmayan `vanta-booking` tercihleri saklanır. Depolama kullanılamadığında açık oturumda bellek kullanılır. Havalimanı karşılama uçuş numarası, adrese teslim adres gerektirir. Son adımda araca özgü yaş/ehliyet için demo beyanı alınır; belge istenmez.

Talep üzerine araçların sonucu müsaitlik onayı vermez. Hukuki sayfalar gerçek demo davranışını açıklar; hukuki uygunluk garantisi değildir.

## Kontroller

```bash
npm run check
npm run format:check
npm run build
npx playwright install chromium
```

Üretim sunucusu açıkken:

```powershell
$env:BASE_URL='http://127.0.0.1:3001'
npm run test:ui
npm run test:layout
```

POSIX: `BASE_URL=http://127.0.0.1:3001 npm run test:ui` (aynı değişkenle `test:layout`).

- `check`: TypeScript, lint, fiyat/tarih/taslak/filtre/telefon kontrolleri; UTC, İstanbul, Los Angeles ve Tokyo.
- `test:ui`: menü, takvim, klavye, gerçek dokunma, video kontrolü, filtreler, favoriler, karşılaştırma, formlar; 1440 ve 390 px Ankara/teslimat/talep akışları ve veri gizliliği.
- `test:layout`: beş ana genişlik (320/390/768/1024/1440), bütün sayfa türleri; bütün araç/lokasyon detaylarında mobil ve masaüstü; bağlantılar, medya, 404; renk kontrastı, metin büyütme ve yatay görünüm. %200 yakınlaştırma eşdeğeri 720×450 CSS piksel / DPR 2 ile sınanır; yerel tarayıcı zoom komutu otomasyonu değildir.
- Raporlar ve görüntüler `outputs/qa` altında üretilir, Git'e alınmaz. Seçili gerçek görüntüler `docs/screenshots` içindedir.
- CI üretim çıktısını derler, Chromium kurar, Worker hazır olana kadar bekler, tarayıcı kapılarını çalıştırır ve raporları artifact olarak saklar.

Son doğrulama sonuçları ve ortam kısıtları: [revizyon kaydı](docs/REVISION.md). Tasarım ve teknik kararlar: [proje incelemesi](docs/CASE-STUDY.md).

## Yayın

İlk yayın 8 Eylül 2026'da Cloudflare Workers'a yapıldı. Worker: `vanta-drive`; hesap workers.dev alt alanı: `furkan-akpinar`. Kaynak commit: `fe7b5b58d0ab2e5ab70d895754b464ae8b679d8e`; Cloudflare sürüm kimliği: `0ca0d63a-765c-4825-9033-eb9848ecdcb7`. Yayın öncesinde hesapta başka Worker bulunmadığı doğrulandı. Sonraki yayın belgeleri ve canlı test ekleri uygulama kodunu değiştirmez.

`dist/server/index.js` Workers girişidir; `dist/client` statik dosyalardır. Hem yerel üretim önizlemesi hem yayın **derlemenin ürettiği** `dist/server/wrangler.json` ile çalışır. Vinext/Vite–Cloudflare yapılandırması korunur; GitHub Pages veya ayrı bir Sites projesi kullanılmaz.

Tekrar yayınlama (PowerShell; doğrulanmış revizyon dalında, bağımlılıklar kurulu ve çalışma ağacı temizken):

```powershell
git switch codex/vanta-drive-revision
git pull --ff-only origin codex/vanta-drive-revision
git status --short --branch
git rev-parse HEAD
npx.cmd wrangler login
npx.cmd wrangler whoami

$env:CLOUDFLARE_ACCOUNT_ID='ad296caa8366ac41c6b7770429d1ec3b'
$env:NEXT_PUBLIC_SITE_URL='https://vanta-drive.furkan-akpinar.workers.dev'
npm.cmd run check
if ($LASTEXITCODE -ne 0) { throw 'Kaynak kontrolleri başarısız.' }
npm.cmd run format:check
if ($LASTEXITCODE -ne 0) { throw 'Biçim kontrolü başarısız.' }
npm.cmd run build
if ($LASTEXITCODE -ne 0) { throw 'Üretim derlemesi başarısız.' }
$config = Get-Content -Raw dist/server/wrangler.json | ConvertFrom-Json
if ($config.name -ne 'vanta-drive' -or $config.main -ne 'index.js' -or $config.assets.directory -ne '../client') {
  throw 'Beklenmeyen Worker çıktısı.'
}
npx.cmd wrangler deploy --config dist/server/wrangler.json
if ($LASTEXITCODE -ne 0) { throw 'Yayın başarısız.' }
npx.cmd wrangler deployments list --config dist/server/wrangler.json
```

İlk klonda `npm.cmd ci` kullanılır; her yayın için yeniden kurulum gerekmez. `wrangler whoami` hesabı yukarıdaki hesapla eşleşmelidir. Mevcut oturum geçerliyse yeniden `login` gerekmez. Yayından önce Cloudflare panelindeki mevcut Worker/sürümün bu projeye ait olduğunu doğrulayın. Çalışan yerel Worker dosyaları kilitliyorsa kendi yerel önizleme sürecinizi durdurup yeniden derleyin. Üretilen yapılandırmayı elle değiştirmeyin; gerçek origin değişirse yeni origin ile yeniden derleyin. Kimlik bilgilerini kaynak, `.env.example` veya Git'e yazmayın.

Yayın sonrasında:

```powershell
node scripts/check-live.mjs
if ($LASTEXITCODE -ne 0) { throw 'Canlı sayfa kontrolleri başarısız.' }
$env:BASE_URL='https://vanta-drive.furkan-akpinar.workers.dev'
npm.cmd run test:ui
if ($LASTEXITCODE -ne 0) { throw 'Canlı demo yolculukları başarısız.' }
```

`check-live.mjs` gerçek yayın adresinde 39 sitemap rotasını, rezervasyon/favoriler dahil 41 sayfayı, üç 404'ü, canonical ve paylaşım metadata'sını, 20 araç görsel eşlemesini, medyayı ve beş sayfanın 1440/390 px görünümünü denetler. Görüntü ve JSON kayıtları `outputs/live` altında oluşur. Revizyon dalındaki push'larda [Checks iş akışının](https://github.com/furkan-akpinar/vanta-drive/actions/workflows/ci.yml?query=branch%3Acodex%2Fvanta-drive-revision) `live` işi aynı kontrolleri ve mevcut demo yolculuklarını GitHub'ın çalıştırıcısında yürütür; `live-browser-qa` artifact'i kanıtları saklar. CI canlı yayın yapmaz.

İlk yayında bu bilgisayarın Türk Telekom Güvenli İnternet bağlantısı workers.dev isteğini engelleme sayfasına yönlendirdi; yerel HTTPS kontrolleri TLS hatasıyla durdu. Bu denemeler geçerli kabul testi sayılmaz. Ağ ayarları değiştirilmedi; uzaktan erişim ve mobil/masaüstü kabul kontrolünün sonucu Actions'taki ayrı `live` işinden okunmalıdır.

Doğrulanmış mutlak adres derleme ortamında `NEXT_PUBLIC_SITE_URL` değişkenine verilince canonical, metadata tabanı, paylaşım görselleri ve sitemap aynı kaynaktan üretilir. Adres tanımlı değilken sitemap boş kalır; canonical ve mutlak paylaşım görseli etiketi üretilmez. Böylece framework'ün otomatik `localhost` paylaşım adresi engellenir. Rezervasyon ve favoriler `noindex` kullanır; sitemap'te yer almaz. Her istekte değişen sahte içerik tarihi yoktur. Yayın adresi ayarlandığında araç paylaşım kartları ilgili aracın görselini kullanır; 20 araç için eşleme test edilir.

## Görseller ve atıflar

Kaynaklar ve lisans bağlantıları [ASSET-SOURCES.md](ASSET-SOURCES.md) içinde korunur. Önceki kullanılmayan 27 medya dosyası atıflarıyla `docs/legacy-media` altında arşivlendi; yayın çıktısına dahil edilmez.

İlk sekiz araç ve altı hizmet/hero görselinin bağımsız kaynak/lisans belgeleri mevcut değildir; belgede açıkça işaretlidir. On iki araç görseli atıflı AI düzenlemeleridir; tam model/donanım fotoğrafı olarak doğrulanmış değildir. Yeni bir proje lisansı seçilmemiştir.

**Mevcut yazar atfı:** Furkan Akpınar · [@furkan-akpinar](https://github.com/furkan-akpinar). Kaynaktaki sahiplik ve katkı bilgileri korunmuştur.
