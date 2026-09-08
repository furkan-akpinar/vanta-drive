# VANTA DRIVE: tutarlı bir kiralama demosu

## Problem

İlk kaynak güçlü bir otomotiv görsel kimliği taşıyordu; ancak seyahat lokasyonu ile katalog filtresi ayrı ilerliyordu. Program seçimleri süreyi taşımıyor, uygun olmayan araç–lokasyon eşleşmeleri ilerleyebiliyor ve bazı formlar yalnızca tarayıcının yüzeysel doğrulamasına dayanıyordu. README uygulamanın gerçek çalışma ortamını yanlış tanımlıyordu.

## Tasarım yaklaşımı

Grafit yüzeyler, yerel Geist tipografisi, ölçülü mavi/turuncu işaretler ve konsept araç dosyaları korundu. Revizyonun ağırlığı karar anlarına verildi: kartta süre toplamı, detayda müsaitlik ve koşullar, rezervasyonda açık fiyat kırılımı, bölüm bölüm düzenlenebilir son kontrol ve kişisel bilgi içermeyen demo sonucu.

Demo niteliği ilk ekranda görünür. Tek araç görseli tek görsel olarak sunulur. Sahte müşteri logoları yerine kullanım senaryoları bulunur. Form etiketleri, hata metinleri ve ikincil bilgiler için ölçülen kontrast sorunları düzeltildi.

## Teknik kararlar

- **Bir seyahat modeli:** tarih/saat, alma/bırakma ve uygun hizmetler sayfalar arasında taşınır. Açık URL yeni seyahati tanımlar; geçerli yerel taslak yalnızca URL yokken geri yüklenir.
- **Türkiye saati:** duvar saati metni UTC+03:00 anına çevrilir. Fiyat hesabı sunucu veya tarayıcının yerel saat dilimine bağlı değildir.
- **İş kuralını koruma:** haftalık ve aylık fiyat eşikleri yeniden tanımlanmadı. 29/30 gün gibi fiyat düşüşleri paket politikası olarak açıklanır.
- **İlk yanıt ve etkileşim:** katalog sunucuda araç kartlarını üretir. Sonraki yerel filtreler Vinext'in History API desteğiyle odağı ve diğer filtreleri korur.
- **Geçiş yarışını çözme:** rezervasyon `window.location` yerine sayfanın doğrulanmış sorgusundan başlar. Mobil testin yakaladığı yanlış araç seçimi bu sınırda düzeltildi.
- **Sınırlı veri ömrü:** iletişim ve teslimat açıklamaları açık formda kalır. Tamamlanmada temizlenir. Kalıcı yerel kayıtlar yalnızca hassas olmayan tercihlerdir.
- **Kaynağı koruma:** framework/paket yükseltmesi veya sıfırdan yazım yapılmadı. Eski medya atıflarıyla public dışına taşındı; yayın paketinden 5,168,212 bayt çıkarıldı.

## Doğrulama yaklaşımı

Birim kontrolleri tarih geçerliliğini, süre eşiklerini, dört saat dilimini, uluslararası telefonları, bozuk taslağı ve lokasyon çelişkilerini sınar. Tarayıcı testleri formu gerçekten doldurur; klavye/gerçek dokunma, odak dönüşü, geri gezinme, bozuk ve kullanılamayan depolamayı dener. Ana akış iki ekran boyutunda tamamlanır. Tüm sayfa türleri beş genişlikte; her araç ve lokasyon detayı mobil ve masaüstünde taranır.

Somut sonuçlar, laboratuvar koşulları ve açık yayın maddeleri [revizyon kaydında](REVISION.md) tutulur. Lighthouse sonucu gerçek kullanıcı performansı veya erişilebilirlik garantisi olarak sunulmaz.
