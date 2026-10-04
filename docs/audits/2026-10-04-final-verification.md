# 2026-10-04 Site İyileştirme Son Doğrulama

## Uygulanan kod değişiklikleri

- Komite 3B sahnesi ilk karede yalnız ilk imzayı kuruyor; kalan altı imza boş işlem dilimlerinde kademeli oluşturuluyor.
- Aktif veya modal komite gerektiğinde hemen oluşturuluyor; metin/modal akışı sahne yüklenmesini beklemiyor.
- Stage denetleyicisi WebGL bağlam kaybını, bağlam geri dönüşünü ve `destroy()` temizliğini yönetiyor.
- RAF, Lenis, resize, görünürlük, modal ve breakpoint dinleyicileri kaldırılabilir hâle getirildi.
- Masaüstü 3B piksel oranı üst sınırı `1.5` olarak ayarlandı.
- Navbar ve aktif bölüm hesapları tek RAF kuyruğunda çalışıyor.

## Yerel doğrulama

| Kontrol | Sonuç |
|---|---|
| `node --check` main/carousel/stage/visual-bootstrap | geçti |
| SEO sözleşme testleri | 5/5 geçti |
| Plan lifecycle testleri | 3/3 geçti |
| Birleşik Node test çalıştırması | 8/8 geçti |
| `git diff --check` | geçti |
| 3B imzaların senkron tek görev yerine idle kuyruğu | kaynak denetimi geçti |
| WebGL context lost/restored ve destroy kancaları | kaynak denetimi geçti |

## Canlı endpoint doğrulaması

- `https://maltepefencalistay.org/` → 200, canonical doğru.
- Başlık: `Maltepe Fen Lisesi Fen Bilimleri Çalıştayı | MFL FBÇ`.
- FAQPage ve Event JSON-LD canlı HTML içinde mevcut.
- `https://maltepefencalistay.org/sitemap.xml` → 200, `application/xml`.
- Sosyal görsel → 200, `image/png`, 124446 byte.
- `www` hostu apex domaine 308 yönlendiriyor.
- HSTS canlı başlıkta mevcut: `max-age=63072000`.

## Dış bağımlılıklar

- Search Console sitemap raporundaki “okunamadı” durumu canlı XML geçerli olmasına rağmen Google tarafında bekleyen yeniden tarama durumu olarak kaldı.
- SPF için doğrulanmış bir alan adı göndericisi bulunmadığından DNS kaydı uydurulmadı.
- DMARC gözlem kaydı ve backlink yayınları site deposundan tamamlanabilecek işlemler değildir.
- Google sıralaması veya belirli bir sıra garanti edilemez; teknik taranabilirlik ve içerik sinyalleri uygulanmıştır.

## Kalan manuel kontroller

Gerçek cihazda uzun görev izi, üç tekrarlı Lighthouse medianı, ekran okuyucu akışı ve kurumsal backlink yayınları bu oturumun otomatik doğrulama kapsamı dışındadır. Bunlar ana sayfa davranışını değiştirmeden ayrıca ölçülebilir.
