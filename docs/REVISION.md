# VANTA DRIVE revizyon kaydı

## Hedef ve sıra

Mevcut grafit, mavi ve turuncu otomotiv kimliği korunarak çalışan Türkçe portföy demosu: ortak seyahat ve fiyat kuralları → katalog/detay/rezervasyon → hizmetler ve erişilebilirlik → üretim, tarayıcı ve yayın doğrulaması.

## İlk inceleme — 8 Eylül 2026

- Temiz `main` üzerinden `codex/vanta-drive-revision` dalı açıldı. Kaynak: GitHub `furkan-akpinar/vanta-drive`.
- React 19, TypeScript, Vinext beta.9, Vite 8, Cloudflare Workers. Standart Next.js değildir.
- `.openai/hosting.json` yok; erişilebilir Sites listesi boş. Mevcut canlı hedef doğrulanamadı. Yeni hedef oluşturulmadan bağımsız çalışma sürüyor.
- Doğrulanan açıklar: telefon regex'i, tarayıcı saat dilimine bağlı fiyat/tarih, lokasyon bağlamı, istemci sonrasına bırakılan katalog, program bağlantıları, eksik koşullu hizmet alanları, geçici karşılaştırma, video kontrolü ve yanlış README.
- Korunacaklar: 20 farklı ana araç görseli, yerel fontlar, URL filtreleri, 7/30 gün tarifeleri, favoriler, hareket azaltma ve özel 404.
- İlk `git switch -c codex/vanta-drive-revision` .git yazma kısıtına; `npm ci --no-audit --no-fund` npm önbelleği EPERM engeline takıldı. İzinli tekrar ile dal açıldı ve kilitli bağımlılıklar kuruldu.

## Kabul kapıları

- Tamamlandı: ortak tarih/tarife ve doğrulama kuralları; lokasyon/program bağlamı; katalog SSR ve odak koruyan URL filtreleri; dört adımlı rezervasyon, koşullu hizmetler, son kontrol ve demo özeti.
- Tamamlandı: kalıcı üçlü karşılaştırma ve bozuk/kullanılamayan depolama; video kontrolü; hizmet/SSS/hukuki demo metinleri; sahte logoların kaldırılması; araç metadata bilgileri, noindex ve sitemap kuralları.
- Tamamlandı: `check`, `format:check`, `build`, `test:ui`, `test:layout`. 50 etkileşim + 46 yolculuk kontrolü (1440/390 px, Tokyo/Los Angeles saat dilimleri), gerçek dokunma ve klavye akışları. Üretim testinde beklenmeyen konsol/çalışma zamanı hatası yok. Tarih/fiyat kontrolleri ayrıca UTC ve İstanbul dahil dört saat diliminde geçti.
- Tamamlandı: 136 ekran/yanıt kontrolü; 41 geçerli rota ve beklenen üç 404; bütün 20 araç ve altı lokasyon mobil/masaüstünde. Beş genişlikte 17 sayfa türü (320/390/768/1024/1440 px); 41 iç bağlantı HTTP 200. Taşma, bozuk görsel, beklenmeyen HTTP ve tarayıcı hatası yok. İlk turda bulunan 320 px rezervasyon/KVKK başlık taşmaları ve detay fiyat notunun mobil sütunu düzeltildi.
- 1.184 düz arka plan metin örneğinde kontrast ölçümü: ilk tur 43 düşük örnek, düzeltme sonrası sıfır. Görsel/gradyan üzerindeki metinler bu ölçümün dışında; tam erişilebilirlik sertifikası değildir.
- Altı sayfa türünde %200 kök yazı büyütme, 844×390 yatay görünüm ve %200 zoom eşdeğeri (720×450 CSS piksel, DPR 2): 18 kontrol, taşma yok. Native tarayıcı zoom komutu otomasyonu değildir. Depolama erişimi hatası enjekte edilen tarayıcıda favori bellek desteği geçti.
- README gerçek teknoloji, kurulum, veri/tarife kuralları, testler, demo sınırları ve mevcut yazar atfıyla yenilendi. Gerçek üretim ekranları `docs/screenshots` içinde; kısa proje incelemesi `docs/CASE-STUDY.md` içinde.
- Lighthouse ilk mobil ölçümü: 72 performans / 95 erişilebilirlik / 100 iyi uygulamalar / 100 SEO. Bulduğu takvim adları ve sekme paneli bağlantıları düzeltildi; hero posterine yüksek öncelik verildi ve ikinci gereksiz arka plan indirmesi kaldırıldı. Masaüstündeki Keşfet bağlantısının erişilebilir adı da görünür etiketle eşitlendi. Son sonuçlar aşağıdadır.
- Kaynak revizyonu `1b38d24`, test/CI değişiklikleri `78c4652` commit'lerinde, `codex/vanta-drive-revision` dalındadır. GitHub'a push ve canlı yayın yapılmadı.

## Tarayıcı testinin yakaladığı önemli hata

Mobil istemci geçişinde `window.location.search`, yeni sayfanın React render'ından sonra değişebiliyordu. Bu yüzden Ankara için seçilen Volvo yerine varsayılan Porsche ile rezervasyon başlayabiliyordu. Rezervasyon artık sunucu sayfasının sorgu anlık görüntüsünü alır ve sorgu değişiminde anahtarlı form oluşturur. Düzeltme 1440 ve 390 px'de Tokyo/Los Angeles saat dilimleriyle doğrulandı.

## Ortam notları

- `npx playwright install chromium`: ilk denemede `%LOCALAPPDATA%/ms-playwright` yazma EPERM; izinli kurulum tamamlandı.
- `npm run start -- --port 3001`: ilk denemede Wrangler log/dosya erişim EPERM; izinli çalıştırmada üretim Worker'ı HTTP 200 verdi.
- Tam Chrome kanalı `browserType.launch: spawn UNKNOWN` verdi. Kurulum tamamlandıktan sonra paketin standart headless Chromium çalıştırıcısıyla testler geçti; koruma ayarı değiştirilmedi.
- `npm run build` tekrarında önceki çıktı EPERM; yerel üretim sunucusu durdurulup izinli yeniden derleme başarılı oldu.
- İlk tarayıcı testleri açılır menü kapanışını ve URL sonrası render'ı beklemiyordu. Kontroller silinmedi; ilgili popup kimliği, görünürlük ve odak koşulları bekleniyor.
- Katalog ilk sunucu yanıtına alınırken Base UI'nin otomatik kök kimliklerinde hydration farkı görüldü. Katalog kontrol kimlikleri sabitlendi; hata bastırma eklenmedi.
- `npx --yes lighthouse --version`: ilk denemede npm-cache EPERM; izinli çalıştırmada Lighthouse 13.4.1 hazırlandı.
- `CHROME_PATH` kurulu Playwright headless Chromium yoluna ayarlanarak çalıştırılan `npx --yes lighthouse http://127.0.0.1:3001/ --chrome-flags="--headless" --output=json --output=html --output-path=outputs/qa/lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo`: ilk sandbox denemesi npm-cache EPERM; izinli denemede rapor üretildi, fakat geçici `lighthouse.*` klasörü temizlenirken EPERM ile exit 1 verdi. Bu ilk komut başarılı sayılmadı.
- `npx --yes lighthouse http://127.0.0.1:3001/ --port=9229 --output=json --output=html --output-path=outputs/qa/lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo --quiet`: 9229 Wrangler denetim portu olduğu için `Invalid URL: undefined` ile başarısız oldu. Endpoint okunarak sebep doğrulandı. Boş 9335 portunda ayrı Chromium açılıp `HeadlessChrome/145.0.7632.6` ve WebSocket bilgisi doğrulandı; aşağıdaki son iki komut exit 0 ile tamamlandı. Erişim ayarları gevşetilmedi, başkasının tarayıcısına bağlanılmadı.

## Son Lighthouse laboratuvar ölçümü

8 Eylül 2026, yerel üretim Worker'ı, Lighthouse 13.4.1 / Headless Chromium 145. Diğer tarayıcı testleri bitirildikten sonra mobil ve masaüstü sırayla ölçüldü. Her profil için tek son ölçüm; gerçek kullanıcı verisi değildir.

| Profil   | Performans | Erişilebilirlik | İyi uygulamalar | SEO |    LCP |   TBT | CLS |
| -------- | ---------: | --------------: | --------------: | --: | -----: | ----: | --: |
| Mobil    |         83 |             100 |             100 | 100 | 3,8 sn | 30 ms |   0 |
| Masaüstü |         98 |             100 |             100 | 100 | 1,0 sn |  0 ms |   0 |

Mobil: 412×823, DPR 1,75, simüle 150 ms RTT / 1.638,4 Kbit/sn / 4× CPU yavaşlatma. Masaüstü: 1350×940, DPR 1, simüle 40 ms RTT / 10.240 Kbit/sn / 1× CPU. Mobil son ölçüm 16:59:58 TR, masaüstü 17:03:13 TR. Son raporlarda runtime hatası, çalışma uyarısı ve başarısız otomatik erişilebilirlik denetimi yok.

Komutlar (bu görev için açılan ayrı Chromium, loopback 9335 portundayken):

```powershell
npx --yes lighthouse http://127.0.0.1:3001/ --port=9335 --output=json --output=html --output-path=outputs/qa/lighthouse-mobile --only-categories=performance,accessibility,best-practices,seo --quiet
npx --yes lighthouse http://127.0.0.1:3001/ --port=9335 --preset=desktop --output=json --output=html --output-path=outputs/qa/lighthouse-desktop --only-categories=performance,accessibility,best-practices,seo --quiet
```

HTML/JSON raporları `outputs/qa/lighthouse-{mobile,desktop}.report.*` içindedir; büyük laboratuvar çıktıları Git'e alınmaz. Mobil LCP hâlâ geliştirmeye açıktır; kalan başlıca maliyetler video aktarımı, framework/arayüz JavaScript'i ve render engelleyen CSS'tir. Canlı CDN/önbellek koşulları ayrıca ölçülmelidir.

Tam görsel matris, son görsel düzeltmelerden sonra tekrarlandı. Sonraki arama geçmişi düzeltmesi 96 etkileşim/yolculuk kontrolüyle; yalnızca masaüstünü etkileyen son bağlantı adı değişikliği yeni üretim derlemesi ve masaüstü Lighthouse ile doğrulandı.

## Doğrulama kapsamının sınırları

- Chromium/Playwright 1.58.2, Windows, Node 24.19.0; testler yerel üretim Worker'ında `http://127.0.0.1:3001` çalıştırıldı. Gerçek iOS/Safari/Firefox cihaz testi yapılmadı.
- Otomatik kontrast kontrolü düz arka planları ölçer. Lighthouse ayrı otomatik erişilebilirlik kontrolüdür; ekran okuyucu sertifikası veya tam WCAG uygunluğu iddiası yoktur.
- Hata ve yükleme bileşenleri gözden geçirildi; video hatası, bozuk depolama, form hataları ve üç 404 tarayıcıda sınandı. Framework hata sınırına kasıtlı uygulama çökmesi enjekte edilmedi.
- CI tanımı güncellendi; GitHub'a push yapılmadığı için uzak CI çalışması doğrulanmadı.

## Yayın için zorunlu açık maddeler

- Kaynakta Cloudflare Worker adı `vanta-drive` bulunur; bu ad tek başına hesap, yayın URL'si veya var olan proje kanıtı değildir. `.openai/hosting.json` yoktur, erişilebilir Sites listesi boştur. Kullanıcının mevcut hedefi veya yeni hedef tercihi gereklidir. Canlı yayın ve canlı kabul kontrolü yapılmadı.
- Hedefin gerçek origin'i `NEXT_PUBLIC_SITE_URL` olarak derleme ortamına verilmelidir. Mevcut yerel çıktı canonical veya mutlak paylaşım görseli yayımlamaz. Testte kullanılan `preview.example.invalid` ayrılmış test verisidir, yayın adresi değildir.
- İlk sekiz araç ve altı hizmet/hero görselinin bağımsız kaynak/lisans belgeleri eksiktir; önceki atıflar korunur, yeni sahiplik/lisans iddiası eklenmez. Kamusal portföy sunumu için bu varlıkların kullanım kaynağı doğrulanmalıdır.
