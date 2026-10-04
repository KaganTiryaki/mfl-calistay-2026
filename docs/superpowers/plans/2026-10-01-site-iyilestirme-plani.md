# MFL FBÇ '26 Site İyileştirme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Kullanıcı ayrıca istemedikçe alt ajan kullanmayın.

**Goal:** Mevcut tasarımı ve arşiv içeriğini koruyarak mobil yüklemeyi, masaüstü etkileşim performansını, erişilebilirliği ve teknik SEO'yu iyileştirmek.

**Architecture:** Vanilla HTML/CSS/JS ve Vercel üzerinde no-build yapı korunacak. İçerik ilk HTML ile erişilebilir olacak; görseller duyarlı boyutlarda, dekoratif 3B sahneler ise kritik yükleme yolundan ayrı ve ihtiyaç anında yüklenecek. Ölçüm, düzeltme ve regresyon kontrolü her aşamada ayrı yapılacak.

**Tech Stack:** HTML, CSS, JavaScript ES modules, Three.js 0.166.0, GSAP 3.13.0, Lenis 1.1.20, Vercel Analytics / Speed Insights.

**Spec:** Kullanıcının 1 Ekim 2026 tarihli üç yapıştırılmış raporu; mevcut `index.html`, `css/style.css`, `js/`, `robots.txt`, `vercel.json` ve `CLAUDE.md`. Rapor dosyaları bu belgenin 1. bölümünde tanımlıdır. Bu belge hem kapsam hem uygulama planıdır.

## Global Constraints

- Bu oturum yalnızca plan üretir; uygulama, commit, push, dağıtım, DNS değişikliği ve gerçek e-posta gönderimi yapılmaz.
- Root `package.json`, `node_modules`, Vite/Webpack veya zorunlu build hattı eklenmez. Yardımcı araçlar gerekiyorsa uygulama aşamasında ayrı/geçici ortamda çalıştırılır.
- Türkçe içerik, 9–10 Mayıs 2026 tarihleri, kapalı başvurular, komite/öğretmen/ekip sırası korunur. Bugünün tarihi 1 Ekim 2026'dır; `CLAUDE.md` içindeki "bugün 2026-05-13" eski bilgidir.
- Marka/sponsor orijinalleri silinmez veya yeniden tasarlanmaz. Sıkıştırılmış türevler üretilebilir; şeffaflık ve logo oranları korunur.
- Mevcut bağımlılık sürümleri değişmez. Dosya yolları ASCII, içerik UTF-8 olur.
- `adminpanel`, `tara`, `yemekqrkodlari`, `ekle.html`, Supabase migrations/functions/config ve katılımcı verileri performans çalışması sırasında değiştirilmez. Teknik indeksleme politikası için bunlara gerekirse ayrı, dar kapsamlı görev açılır.
- `CLAUDE.md` kalıcı plan yazılmamasını söyler; kullanıcının açık plan dosyası isteği bu görevde üstündür. Şema ve Vercel ayarlarını koruma kuralları nedeniyle ilgili değişiklikler aşağıda koşullu ayrı aşamalar olarak yazılmıştır.
- Mevcut ID/class, `preloader:done`, `committee-modal:opened`, `committee-modal:closed` ve diğer sahne olay sözleşmeleri korunur veya tüm tüketiciler birlikte uyarlanır.

## Review Focus

1. JavaScript/CDN/WebGL başarısız olduğunda hero, metinler ve gezinme erişilebilir kalmalı → Görev 2 ve 4.
2. İlk yüklemeden hemen sonra komiteye doğrudan hash ile gidildiğinde veya modal açıldığında gecikmeli sahne çalışması metin/klavye akışını bozmamalı → Görev 4.
3. Mobil–masaüstü breakpoint geçişi ve sekme gizleme/gösterme birden fazla renderer veya RAF döngüsü oluşturmamalı → Görev 4.
4. Responsive görsellerin lightbox açılımında program yazıları ve fotoğraf detayları okunabilir kalmalı → Görev 3.
5. Klavye, %200 yakınlaştırma ve reduced-motion kullanıcıları menü/modal/program içeriğine erişebilmeli → Görev 6.

## 1. Raporlar ve başlangıç durumu

| Kaynak | Dosya / kapsam |
|---|---|
| SEOptimer | `C:/Users/kağan/.codex/attachments/c9449d69-8dc8-458c-b60f-9bd17276bca2/Yapıştırılan metin.txt` |
| PSI mobil | `C:/Users/kağan/.codex/attachments/6d9b76d0-aa1c-4623-ab98-09a108109a77/Yapıştırılan metin.txt` |
| PSI masaüstü | `C:/Users/kağan/.codex/attachments/c5c57560-4092-4f01-8e3d-4f97f13c1708/Yapıştırılan metin.txt` |

PSI ölçümü: 1 Ekim 2026 22:54 GMT+3, Lighthouse 13.5.0. Her iki dosyada iki cihaz sekmesi görünse de cihaz ayrımı ölçüm açıklamasından yapılmıştır. CrUX gerçek kullanıcı verisi yoktur; aşağıdaki sayılar laboratuvar sonuçlarıdır. SEOptimer raporunda 19:54 UTC yazmaktadır; aynı saate denk gelir.

| Metrik | Mobil | Masaüstü |
|---|---:|---:|
| Performans | 64 | 50 |
| Erişilebilirlik | 92 | 92 |
| En iyi uygulamalar / SEO | 100 / 100 | 100 / 100 |
| FCP | 3,2 sn | 0,8 sn |
| LCP | 12,1 sn | 2,1 sn |
| TBT | 110 ms | 9.540 ms |
| CLS | 0,051 | 0,015 |
| Speed Index | 5,1 sn | 9,0 sn |
| Ana iş parçacığı süresi | 4,1 sn | 34,5 sn |
| Uzun görev | 9 | 20 |
| Aktarılan toplam | 13.139 KiB | 13.139 KiB |

SEOptimer: toplam 12,82 MB, görseller 12,28 MB, 58 kaynak. MB/KiB farkı ve ölçüm yöntemi nedeniyle PSI ile birebir aynı sayı beklenmez. Mobil render-blocking tahmini 2.080 ms, masaüstü 540 ms. Görsel tasarrufu önerisi yalnızca yaklaşık 159–160 KiB; bu, 12 MB görsel yükünün önemsiz olduğunu göstermez. Lazy loading, ekran boyutuna uygun türevler ve yükleme sırası ayrı değerlendirilmelidir.

SEOptimer'ın masaüstü 80 ms TBT bilgisi ile son PSI 9.540 ms sonucu çelişir. Birini seçip diğerini yok saymak yerine aynı profil ile tekrar ölçüm ve trace gereklidir. Rapor metinlerinde LCP öğesi, kaynak waterfall, hatalı kontrast selector'ları ve ARIA düğümleri bulunmadığından kesin kök nedenler ölçüm aşamasında tamamlanacaktır.

## 2. Kodla eşleşen bulgular ve öncelikler

| Öncelik | Bulgu / kanıt | Etki / karar |
|---|---|---|
| P0 | `js/main.js:2–44`: açılış ekranı `window.load` bekliyor; 6 sn fallback ve 350 ms kapanış gecikmesi. `css/style.css:2698` yükleme sırasında scroll kilitli. | Ağır alt bölüm görselleri ilk görünümü etkileyebilir. LCP öğesi henüz bilinmiyor; yükleme ekranı güçlü adaydır, 12,1 sn'nin tamamının nedeni olduğu iddia edilmez. |
| P0 | `js/carousel.js:1` statik stage import; stage bütün imzaları/Three addons'u import ediyor. Mobil kontrol daha sonra. | Mobilde stage başlatılmasa da bağımlılık grafiği indirilir/ayrıştırılır. Import kapısı mobil kontrolün önüne alınmalı. |
| P0 | `js/scene/stage.js:55` yedi imza ve ayna materyalleri başta üretiliyor; bloom composer var. | Masaüstü CPU/GC/render maliyeti adayı. 9,54 sn TBT'yi tek başına açıklamak için trace gerekir. |
| P0 | Beş büyük ekip PNG'si toplam yaklaşık 8,58 MB. | Görsel yükünün büyük kısmı birkaç dosyada; ilk turda bunlar küçültülmeli. |
| P1 | `index.html` görsellerinde doğal width/height ve çoğunda lazy loading yok. | CLS zaten iyi olsa da yer ayırma ve alt bölüm yükleme iyileştirilir. |
| P1 | `js/three-scene.js:9` reduced-motion sabit false; gizli sekmede RAF yeniden planlanıyor. | Kullanıcı tercihi ve kaynak kullanımı düzeltilmeli. CSS ile canvas gizlemek render döngüsünü durdurmaz. |
| P1 | İki Maps iframe başlıksız; H2 altında H4 öğretmen ve iletişim başlıkları var. | Erişilebilirlik raporuyla doğrudan eşleşir. |
| P1 | Mobilde slide'a `role=button` JS ile ekleniyor. | Raporun ARIA uyarısının kesin öğesi bilinmiyor. İç içe interaktif öğe/semantik kontrol edilmeli; otomatik rol silme yapılmamalı. |
| P1 | canonical ve sitemap yok; description 98 karakter; OG URL/image ve X kartları yok. | Temel SEO puanı 100 olsa da paylaşım/kanonikleşme iyileştirilebilir. |
| P2 | Google Fonts CSS ve çok sayıda CDN modülü; root build/minification hattı yok. | Kritik yükleme ve gereksiz bağımlılıklar ölçülmeli. SEOptimer "tümü küçültülmüş" derken PSI CSS 4 KiB/JS 71 KiB öneriyor; PSI detayları esas alınmalı. |
| P2 | Event JSON-LD mevcut fakat location/image/url yok. | LocalBusiness eklemek yerine mevcut Event doğrulanmalı; görünür etkinlik yeri ve okul konumu farklı, tahminle birleştirilmemeli. |
| P2 | `robots.txt`: /tara, /yemekqrkodlari, /panel; gerçek /adminpanel ve /ekle politikası eksik. | Sitemap dışında bırakılmalı. Robots bir erişim kontrolü değildir; noindex/crawl ilişkisinin ayrı değerlendirmesi gerekir. |

### Görsel öncelik listesi (yerel orijinaller)

| Dosya (`assets/images/` altında) | Bayt |
|---|---:|
| team/yardimci-koordinator.png | 1.820.581 |
| team/akademi-baskan.png | 1.775.088 |
| team/lojistik-baskanlari.png | 1.762.774 |
| team/genel-koordinator.png | 1.664.854 |
| team/saha-baskanlari.png | 1.552.199 |
| past-2025/3.png | 1.118.546 |
| program/genel.png | 813.407 |
| past-2025/1.png, 2.png, 4.png | 628.235 / 614.377 / 504.785 |

Bu boyutlar disk ölçümüdür; ağda sıkıştırılmış transfer boyutu ile karıştırılmaz.

## 3. Dosya haritası

| Dosya / alan | Planlanan sorumluluk |
|---|---|
| `index.html` | metadata, image markup, iframe title, heading/landmark ve yükleme girişleri |
| `css/style.css` | açılış fallback, görsel yer ayırma, kontrast, hareket/odak state'leri |
| `js/main.js` | açılışın kritik kaynaklardan ayrılması, lightbox orijinal kaynağı, klavye/scroll akışı |
| `js/carousel.js` | mobilde hafif yol, stage dynamic import ve lifecycle |
| `js/three-scene.js` | background sahnenin açılış/visibility/reduced-motion lifecycle'ı |
| `js/scene/stage.js`, `js/scene/signatures/*.js`, `js/scene/dispose.js` | ölçümle kanıtlanan ağır başlangıç/render/disposal düzeltmeleri |
| Yeni `js/visual-bootstrap.js` | yalnız dekoratif sahnelerin kontrollü, tekil yükleme giriş noktası |
| Yeni `assets/images/optimized/` | WebP/AVIF ve farklı genişliklerde türevler; orijinaller korunur |
| Yeni `sitemap.xml`, mevcut `robots.txt` | public canonical URL keşfi |
| Yeni `docs/audits/2026-10-01-baseline.md` ve sonraki sonuç belgesi | ölçüm ortamı, trace bulguları, önce/sonra tablo ve ekran görüntüsü yolları |
| Koşullu `vercel.json` | yalnız doğrulanan redirect/header ihtiyacı; mevcut rewrite/redirect'ler korunur |

## 4. Uygulama görevleri

### Görev 1 — Tekrarlanabilir başlangıç ölçümü (P0)

**Dosyalar:** Yeni `docs/audits/2026-10-01-baseline.md`; uygulama dosyalarında değişiklik yok.
**Girdi:** Üç rapor, mevcut checkout ve canlı ana sayfa. **Çıktı:** Cihaz bazında karşılaştırılabilir başlangıç tablosu ve kesin öğe/stack listesi.

- [x] `git status --short` ve commit kimliğini kaydet; canlı HTML ile yerel kaynak sürümünü karşılaştır. Çalışan branch veya canlı site başka sürümse bunu belgeye yaz.
- [x] Mevcut geçici HTTP sunucusu/araçla siteyi servis et; yeni kalıcı bağımlılık ekleme. Yerel Vercel analytics 404'lerini canlı site başarısızlığı olarak raporlama.
- [ ] Soğuk cache ile mobil ve masaüstü Lighthouse'u aynı sürüm/profilde üçer kez çalıştır. JSON/HTML raporları ve median değerleri kaydet; ayrıca sıcak cache yüklemesini ayrı ölç.
- [ ] DevTools Performance kaydı al: ilk açılış, komiteye scroll, komite modalı, sekme değişimi. LCP DOM öğesini ve TTFB/resource delay/download/render delay dağılımını kaydet.
- [ ] Long task stack'lerini Three sahne oluşturma, shader compile, signature update, style/layout, GSAP, third-party olarak ayır. Görsel preload ekranının görünür kaldığı süreyi ölç.
- [x] Lighthouse kontrast/ARIA/heading hatalarının exact DOM selector'larını çıkar. CSP/HSTS/COOP önerilerini başarısız puanlı denetim gibi yazma.
- [x] HAR'ı üçüncü taraf/first-party, başlangıç/scroll sonrası ve kaynak türü bazında değerlendir. Ekran altı görsellerin ilk ekranda istenip istenmediğini kaydet.

**Kabul:** LCP öğesi, masaüstündeki en pahalı üç stack ve erişilebilirlikte hatalı selector'lar belirlenmiş. Rapor/yerel/canlı sürüm farkları açık. Bunlar olmadan rastgele bloom veya bütün CSS silme işlemi başlamaz.

### Görev 2 — Açılış ekranını yükleme engeli olmaktan çıkarma (P0)

**Dosyalar:** `index.html`, `css/style.css`, `js/main.js` preloader bloğu. **Çıktı:** İçerik DOM/CSS hazırken erişilebilir; `preloader:done` en fazla bir kez yayımlanır.

- [ ] Önce mevcut davranışı yavaş ekip görseli, bloke CDN ve kapalı JavaScript ile yeniden üret; hero görünürlük/scroll sonuçlarını kaydet.
- [x] İlk HTML'de `body.is-loading` ile zorunlu kilitleme yerine progressive enhancement kur. JS çalışmıyorsa overlay gösterilmesin; ana içerik açık kalsın.
- [x] Tam sayfa `window.load` beklemesini kaldır. Navbar/hero dışı görselleri, Maps iframe'lerini, analytics ve Three modüllerini açılış koşuluna alma.
- [x] Preloader korunacaksa DOM hazır olduğunda kapanan kısa dekoratif state olsun; timeout/listeleyici temizliği ve idempotent finish kontrolü ekle. Hero metnini veya LCP öğesini opacity/reveal animasyonuyla bekletme.
- [ ] İlerleme yüzdesi gerçek indirme yüzdesi değilse yüzde kaldır; mevcut dekoratif barın ilk görünümü engellememesini sağla. CSS kapanış transition'ını LCP ölçümünde kontrol et.
- [ ] Yeniden test: yavaş PNG, img error, bloke unpkg, kapalı JS, boş lightbox image ve hızlı cache. Sayfa her durumda okunur/scroll yapılabilir olmalı.

**Kabul:** Alt bölüm isteği bitmeden hero kullanılabilir. Normal açılışta overlay en geç DOM hazır olduktan 500 ms sonra etkileşimi bırakır; bunun mutlak navigasyon süresi olmadığı belgelenir. `preloader:done` tüketicileri bozulmaz.

### Görev 3 — Görselleri doğru boyutta ve doğru zamanda sunma (P0/P1)

**Dosyalar:** `assets/images/optimized/`, `index.html`, `css/style.css`, `js/main.js` lightbox. **Çıktı:** Orijinal/türev eşleme listesi; layout oranları ve zoom kaynağı korunur.

- [x] Her görselin doğal piksel boyutunu, gerçek CSS görüntü genişliğini, transparan olup olmadığını ve zoom ihtiyacını kaydet.
- [x] İlk olarak beş büyük ekip görselini 320/640/960 px genişlik türevlerine dönüştür. Fotoğraflarda WebP kalite 75–85 aralığını görsel karşılaştırmayla seç; transparan dosyalarda alpha korunur. AVIF yalnız ölçümle ek kazanç varsa eklenir.
- [x] Galeri için 480/960/1440 px; program için okunabilir 640/1280 px türevleri üret. Program metnini %100 zoomda ve lightbox'ta kontrol et; boyut hedefi uğruna yazı okunurluğunu bozma.
- [x] `<picture>` veya `srcset/sizes` kullan. `sizes` değerlerini gerçek grid/breakpoint ölçüsünden çıkar; bütün fotoğraflara 100vw verme. `width/height` için her dosyanın gerçek oranını yaz; CSS `height:auto` veya mevcut sabit kutu/object-fit davranışını korusun.
- [x] Ekran altındaki team, sponsors, eventinfo ve past görsellerine `loading="lazy" decoding="async"` ekle. Navbar ve hero görsellerini lazy yapma. Gerçek LCP görselse yalnız ona `fetchpriority="high"` ver; LCP metinse gereksiz görsel preload ekleme.
- [x] Lightbox görseline `data-full-src` tanımla; `main.js` içindeki `open(z.currentSrc || z.src, z.alt)` çağrısını tam boy zoom kaynağını tercih edecek şekilde uyarlat. Tam boy yalnız tıklamada istenir.
- [x] Boş dekoratif alt geçerli kalır. Rapordaki eksik alt önerisi nedeniyle dekoratif preloader logosuna anlamsız alt yazma; tekrarlı galeri altlarını görünür fotoğraf içeriğine göre tanımla.
- [ ] HAR üzerinden ilk yüklemede aşağıdaki orijinallerin istenmediğini doğrula: beş team PNG'si ve dört past PNG'si. Scroll ve zoomda gerekli dosya yüklenmeli, 404 olmamalı.

**Kabul:** İlk ekran first-party toplam transferi için hedef ≤1 MB, bütün bölüm önizlemeleri gezildikten sonra hedef ≤4 MB (Maps ve tıklamayla açılan orijinaller ayrıca raporlanır). Ekip türevleri toplamında en az %70 azalma; hedef tutmazsa okunurluk korunup neden kaydedilir. 360/390/768/1440 px ekranlarda crop ve oran regresyonu yok.

### Görev 4 — 3B ve animasyon iş yükünü ayırma (P0/P1)

**Dosyalar:** Yeni `js/visual-bootstrap.js`; `index.html` module girişleri; `js/carousel.js`, `js/three-scene.js`, `js/scene/stage.js`, gerektiğinde signatures/dispose.
**Arayüz:** `initStage(canvas, { palette, dpr })` ve döndürdüğü `tick`, `resize`, `setActive`, `zoomTo`, `zoomOut`, `isolate`, `destroy` korunur. Bootstrap yalnız bir kez initialize eder, hata halinde metinleri gizlemez.

- [x] Network'te mobil açılışta Three/addons/signatures indirildiğini baseline ile kanıtla. Sahne CPU maliyetini dekorasyonları tek tek devre dışı bırakarak karşılaştır; test sırasında yapılan kapatmalar final tasarım kararı değildir.
- [x] `carousel.js` içindeki statik stage import'u kaldırıp mobil/reduced-motion kontrolünden sonra dynamic import kullan. Mobil kart/modal etkileşimi stage'den bağımsız kalmalı.
- [x] `visual-bootstrap.js` dekoratif background girişini kritik içerik çıktıktan sonra yüklesin; komite renderer'ını IntersectionObserver ile bölüm yaklaşınca başlatsın. `requestIdleCallback` varsa timeout ile kullan; yoksa içerik sonrası kısa task fallback sağla. Import başarısızlığı yakalanır.
- [x] Hash ile `#komiteler` açılışında immediate ihtiyaç kontrolü yap. Sahne hazır değilken modal metni hemen açılsın; sonradan sahne hazır olunca güncel active/modal state uygulanır.
- [x] Stage'in yedi signature + mirror oluşturmasını trace'e göre parçalara ayır veya ihtiyaçla oluştur. Kesin koşul: tek uzun synchronous tüm-imza oluşturma görevi kaldırılacak; overview'ın yedi imzayı göstermesi korunacak. Geometry paylaşımı/material clone azaltımı yalnız mevcut split/opacity davranışı korunabiliyorsa yapılır.
- [x] Görünmeyen signature update'lerini durdur; background committees-visible sırasında render yapmasın. Gizli sekmede RAF iptal olsun; görünürlük geri geldiğinde tek loop ve sıfırlanmış dt ile başlasın.
- [x] `prefersReducedMotion=false` sabitini gerçek media query ile değiştir. Reduced-motion'da statik/az hareketli görünüm ve native scroll; tercih değişimini runtime'da dinle. 3B içerik dekoratif olduğu için metinsel açıklama her durumda kalır.
- [x] Mobil breakpoint'i CSS/carousel/background arasında aynı 768 px politikasıyla uyumlu hale getir. 767/768/769 px ve yön değiştirme testinde tekrar init/boş sahne kalmamalı.
- [x] GSAP/Lenis başlatma sırasını kontrol et: main classic script defer CDN'den önce çalışabilir. Bağımlılığın hazır olmasını açık olarak yönet; iki smooth-scroll sistemi oluşturma. Kullanılmayan plugin'i ancak tüm referansları arandıktan sonra çıkar.
- [x] WebGL unsupported/context lost, bloke CDN, sekme görünürlüğü, breakpoint, hızlı scroll, art arda modal aç/kapat ve reduced-motion testlerini yap. `destroy` sonrası RAF/event/material/geometry kaynaklarının temizlendiğini doğrula.

**Kabul:** Mobil hafif yol komite Three/addons bağımlılıklarını indirmez. Gizli/görünmez sahne CPU üretmez; aynı canvas'a çift renderer kurulmaz. Masaüstü TBT üç ölçüm medianında ≤200 ms hedeflenir; ilk ara kapı başlangıca göre ≥%80 azalma. Etkileşim anında ≥30 FPS, hedef 60 FPS; geçişte donma yok.

### Görev 5 — Font, CSS ve JavaScript kritik yolunu sadeleştirme (P1/P2)

**Dosyalar:** `index.html`, `css/style.css`, `js/main.js`, `js/carousel.js`; koşullu `assets/fonts/` ve sürümü sabit local vendor dizini.

- [ ] Coverage ile gerçekten kullanılan CSS/font ağırlığı ve GSAP plugin'lerini belirle. Bir bölüm görünmedi diye CSS'yi dead sayma; modal, mobile, hover/focus ve programın ikinci gününü ayrıca aç.
- [ ] Google Fonts `display=swap` zaten var; önce fallback metrikleri/CLS ve font CSS gecikmesini ölç. Kullanılmayan ağırlıkları kaldır; self-host gerekiyorsa aynı aile/sürüm, Türkçe glifler ve lisans korunur. Yalnız ilk ekranda gerekli WOFF2 preload edilir.
- [ ] CSS kritik yolundan kaynaklanan gecikme Görev 2–4 sonrası sürerse küçük kritik CSS seçeneğini ölç. Bütün CSS'yi async yapmak ve stylesız ilk görüntü oluşturmak kabul edilmez; mevcut tek stil dosyası mimarisi korunur.
- [ ] Scroll olaylarındaki `offsetTop/offsetHeight/getBoundingClientRect` okumalarını tek RAF'ta batch et; mümkün olan görünürlük/aktif section işini observer ile yap. Read/write sıralamasını trace'te layout sayısı ve süresiyle doğrula.
- [ ] `.preloader__bar-fill` width, mobile menu right ve diğer layout animasyonlarını bul. Gerekenleri scaleX/translateX/opacity'ye taşı; FAQ'nin doğal yüksekliğini kırmadan onun maliyetini ayrıca ölç. `transition:all` kalmasın.
- [ ] CSS/JS minification kazancını en son değerlendir: 4 KiB/71 KiB için no-build yapıya zorunlu toolchain ekleme. Local vendor/minified asset gerekiyorsa kaynak/sürüm/lisans ve yeniden üretim yöntemi belgeye yaz; first-party okunabilir kaynakları koru.
- [ ] Analytics ve Speed Insights tekrar eklenmez. Konsol ve Network'te tekil, defer yükleme doğrulanır; harita yüklemesi aşağıda/etkileşimle kalır.

**Kabul:** Hero metni font/dekorasyon beklemez; gerekli fontlar Türkçe karakterleri doğru gösterir; konsol hatası ve yeni layout thrashing yok. Yükleme sonrası tüm etkileşim state'lerinde CSS kaybı yok.

### Görev 6 — Erişilebilirlik ve semantik düzeltmeler (P1)

**Dosyalar:** `index.html`, `css/style.css`, `js/main.js`, `js/carousel.js`.

- [x] Kontrast hatalı selector'larda gerçek foreground/background/opacity bileşimini ölç. Normal metin ≥4,5:1, büyük metin ≥3:1; kontrol/odak sınırı ≥3:1. Mevcut marka token'larından uygun ton seç; bütün paleti değiştirme.
- [x] `index.html:878` iframe için görünür etkinlik yeri doğrulanarak açıklayıcı Türkçe title; `:949` için `title="Maltepe Fen Lisesi konum haritası"` ekle. iframe'leri rapor puanı için kaldırma; text adres ve ayrı harita bağlantısı sun.
- [x] H2 altındaki doğrudan öğretmen başlıklarını H3 yap; ekiplerimiz H3 altında ekip H4 kalabilir. İletişim ve footer'da sıralama atlamalarını düzelt veya başlık olmayan etiketleri styled paragraf yap. Görsel stil class ile korunur.
- [x] Mobil slide'da role=button nedeniyle heading semantics veya iç içe link/button kaybını incele. Tek açık native button ile modal tetikleme seçeneğini uygula; kart başlığı ve içerik normal semantiğini korusun.
- [x] Lightbox/menu/modal: Tab/Shift+Tab döngüsü, Escape, açan elemana focus geri dönüşü, arka içeriğin inert olması ve scroll kilidinin temizlenmesi. Zoomable görseller native button içinde veya eşdeğer klavye erişimli tetikleyici olmalı.
- [x] Program tabları Left/Right, Home/End ve selected/tabindex eşleşmesini desteklesin; gizli panel içeriği Tab sırasına girmez. FAQ button/aria-expanded/content ilişkisini kontrol et.
- [x] `main` landmark ve görünür-on-focus atlama bağlantısı ekle; fixed navbar anchor/focus hedefini örtmesin. %200 zoom ve 320 px genişlikte iki boyutlu scroll oluşmasın.
- [x] Lighthouse/axe sonuçları ve ekran okuyucu smoke kontrolüyle erişilebilirlik ağacını yeniden incele; deneysel ajan kategorisini düzeltmenin ölçütü olarak kullan, WebMCP eklemeyi zorunlu sayma.

**Kabul:** Belirtilen kontrast/iframe/heading/ARIA uyarıları giderilmiş; kritik/ciddi otomatik erişilebilirlik hatası yok. Klavye ile tüm ana akışlar çalışır. Lighthouse accessibility hedef 100; puan manuel kontrolün yerine geçmez.

### Görev 7 — Teknik SEO ve paylaşım metadata'sı (P1)

**Dosyalar:** `index.html`, yeni `sitemap.xml`, `robots.txt`; koşullu `assets/images/optimized/social-share.*`.

- [x] Root canonical: `https://maltepefencalistay.org/`. HTTP/HTTPS ve www/apex redirect zincirlerini ölç; tek canonical host seçimi canlı Vercel/domain ayarlarıyla uyumlu olsun.
- [x] Description için önerilen taslak: "Maltepe Fen Lisesi Fen Bilimleri Çalıştayı '26: 9–10 Mayıs 2026 etkinliğinin komiteleri, iki günlük programı, ekibi ve geçmiş çalıştay arşivi." Türkçe ve gerçek arşiv durumuyla tutarlı. Uzunluğu araçla say; 120–160 karakter hedefi editoryal rehberdir, sıralama garantisi değildir.
- [x] Mevcut doğru H1/title korunur; "düşünce çalıştayı" metadata metni gerçek fen bilimleri içeriğiyle uyumlu hale getirilir. Meta keywords doldurarak sonuç beklenmez; başlıklara doğal olmayan anahtar kelime tekrarı eklenmez.
- [x] `og:url`, mutlak `og:image`, `og:image:alt`, boyutlar ve `twitter:card=summary_large_image`, title/description/image ekle. Var olmayan X hesabı uydurma. Sosyal önizleme için 1200×630 türev kullan; logo kesilmesin, PNG logosunu esnetme.
- [x] `sitemap.xml` yalnız public canonical ana sayfayı içerir. `#komiteler`, `#program` gibi fragment'ler ayrı URL değildir. `lastmod` ancak gerçek içerik değişim tarihini yansıtıyorsa eklenir.
- [x] `robots.txt` içine `Sitemap: https://maltepefencalistay.org/sitemap.xml` ekle; mevcut disallow'ları koru. Operasyonel sayfalar sitemap'e girmez.
- [x] `adminpanel`, `ekle` ve alias'lar için indexlenme ihtiyacını ayrı denetle. `noindex` gerekiyorsa HTML/header üzerinden ver; robots ile bloke URL'nin noindex'inin okunamayabileceğini hesaba kat. Hassas veri korumasını robots'a bırakma.
- [x] Sitemap 200 + XML content type, canonical tekilliği, paylaşımdaki mutlak resmin 200 ve doğru boyutlarla sunulmasını doğrula. Gerçek Google Search Console erişimi varsa sitemap submission ve URL inspection ayrı dış işlem olarak yapılır.

**Kabul:** Canonical/OG/X/meta tutarlı, public sitemap geçerli, operasyonel URL eklenmemiş, başvuru yeniden açılmış gibi görünmüyor. Hreflang tek Türkçe site için eklenmez; section hash bağlantıları "0 dahili bağlantı" raporu yüzünden silinmez.

### Görev 8 — Koşullu şema, DNS, dış SEO ve güvenlik işleri (P2/P3)

**Dosyalar:** Koşullu `index.html` JSON-LD / `vercel.json`; dış ayarlar yalnız uygulama yetkisi ayrıca mevcutsa.

- [x] Mevcut Event JSON-LD'yi Rich Results Test ile doğrula; report SEO 100 değerini rich-result geçerliliği sayma. Görünür program ve iki haritadan gerçek etkinlik venue'sunu belirle; doğrulanmadan okul adresini etkinlik konumu olarak yazma.
- [x] Gerekliyse Event'e gerçek location/PostalAddress, image, url ve organizer url ekle; arşiv için tarihleri geleceğe taşıma, açık offer/başvuru üretme. Tarih geçmiş olması cancellation değildir. LocalBusiness yerine Event/Organization semantiğini koru. Şemaya dokunmama yerel kuralı nedeniyle bu ayrı görev uygulama kapsamı netleştirilerek yürütülür.
- [x] SPF önerisinde önce domain'in gerçekten mail gönderip göndermediğini, kullanılan provider ve Return-Path domain'ini belirle. Sitede iletişim Gmail adresidir; root domain'e rastgele Gmail/Brevo SPF ekleme. Gerçek gönderici domain'i için provider'ın doğrulanmış kaydını ve mevcut TXT'leri kontrol et; tek SPF kaydı ve DKIM/DMARC hizalaması ayrı kabul ölçütüdür.
- [x] DMARC `p=none` gözlem politikası raporda görülüyor; kayıtların canlı durumu ayrıca doğrulanır. DNS değişikliği ve gerçek teslim testi bu plan yazımına dahil değildir.
- [ ] Backlink için okulun resmi etkinlik duyurusu, gerçek sponsor/konuşmacı sayfaları ve mevcut kurumsal hesaplardan doğal bağlantı adayları çıkar. "Araç 0 buldu" ifadesi dünya çapında hiç backlink olmadığı kanıtı değildir. Ücretli/spam link veya puan için yeni sosyal hesap açma önerilmez; mesaj gönderimi ayrıca yetki gerektirir.
- [x] Analytics zaten var. Facebook Pixel ve ek izleme yalnız gerçek kampanya/ölçüm ihtiyacı ve uygun veri politikası varsa değerlendirilir; performans planında otomatik eklenmez.
- [x] `llms.txt` isteğe bağlı kısa public arşiv özeti olabilir; sıralama/ajan puanı garantisi yoktur. Personel paneli/QR/veri bağlantıları eklenmez. Önceliği P3.
- [x] Güvenlik header ihtiyacı için önce canlı header envanteri çıkar. CSP report-only ile Google Fonts, unpkg, Maps frame-src ve Vercel analytics kaynakları doğrulanır; `strict` policy veya COOP doğrudan uygulanmaz. Operasyonel uygulamaların CDN/Supabase akışını bozacak global header değişikliği yapılmaz. HSTS includeSubDomains/preload ancak tüm subdomain envanteri doğrulanırsa değerlendirilir.

**Kabul:** Yanlış Event venue/işletme şeması yok. DNS provider'a göre doğrulanmış, sosyal işler gerçek ihtiyaçla sınırlı. Bu aşamanın koşullu işleri yapılmadığında performans/erişilebilirlik düzeltmelerinin tamamlanması engellenmez.

## 5. Doğrulama ve teslim kapıları

### Hedefler (garanti değil, kabul için ölçülecek bütçeler)

| Ölçüt | İlk ara kapı | Nihai hedef |
|---|---|---|
| Mobil LCP | ≤4 sn | ≤2,5 sn |
| Mobil FCP | ≤2,5 sn | ≤1,8 sn |
| Masaüstü TBT | Başlangıca göre ≥%80 azalma | ≤200 ms |
| Mobil TBT | ≤200 ms korunur | ≤200 ms |
| CLS | ≤0,1, regresyon yok | ≤0,1 |
| Performance median | Her iki cihazda ≥80 | Her iki cihazda ≥90 |
| Accessibility | Raporlanan hatalar giderilmiş | 100 + manuel akışlar başarılı |
| SEO / Best practices | 100 korunur | 100 korunur |

TBT, INP'nin yerine geçmez. Gerçek kullanıcı verisi oluşursa LCP ≤2,5 sn, INP ≤200 ms ve CLS ≤0,1 hedefleri p75 için ayrıca değerlendirilir; mevcut "Veri Yok" durumu başarısız saha sonucu değildir.

- [ ] Her görev sonrası ilgili yerel smoke kontrolü; Görev 2–5 sonrası aynı Lighthouse profilinde üç ölçüm medianı. Test ortamı/CDN varyasyonu kayıt altında tutulur.
- [ ] 360×800, 390×844, 768 px ve 1440×900 viewport; 767/768/769 breakpoint; %200 zoom; Android/iOS veya uygun gerçek cihaz smoke.
- [ ] Navbar/hamburger, bütün anchor'lar, yedi komite modalı, gün 1/gün 2 sekmeleri, FAQ, sponsor linkleri, program/galeri lightbox, mailto/Instagram/Maps bağlantıları çalışır.
- [ ] JavaScript kapalı, WebGL yok, unpkg bloke, yavaş/kırık görsel, reduced-motion açık, sekme gizli ve hızlı modal aç/kapat durumları test edilir.
- [ ] Console: yeni exception/unhandled rejection yok. Network: yeni asset 404 yok; istenmeyen font/vendor tekrarı yok. DOM: tek canonical, geçerli JSON-LD, doğru başlık/ARIA ağaçları.
- [ ] Preview dağıtımı yapılması yetkilendirilmişse yerel sonuçtan sonra aynı testler preview'da tekrarlanır. Production'a çıkış ayrı son adımdır; yalnız yerel skorla "canlı düzeldi" denmez.
- [x] Son `git status --short` ve diff ile yalnız planlanan dosyalar değişmiş mi kontrol edilir; QR/katılımcı/Supabase dosyalarına collateral değişiklik yok.

## 6. Sıralama, efor ve geri dönüş

Önerilen sıra: **1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → son doğrulama**. Metadata ve erişilebilirlik performans işlerinden bağımsız test edilebilir; aynı dosyada edit çakışması yaratmadan ayrı değişiklik kümeleri tutulur.

| Aşama | Tahmini net efor | Bağımlılık |
|---|---|---|
| Baseline/trace | 2–4 saat | Yerel ve canlı erişim |
| Açılış + görseller | 4–8 saat | Baseline, dönüştürme aracı |
| 3B lifecycle/CPU | 6–12 saat | Trace, sahne regresyon kontrolleri |
| Kritik yol/CSS/font | 2–5 saat | Önceki performans sonuçları |
| Erişilebilirlik | 3–6 saat | Exact selector listesi |
| SEO/paylaşım | 2–4 saat | Canonical domain doğrulaması |
| Son doğrulama | 3–5 saat | Bütün yerel görevler |

Toplam yaklaşık 22–44 saat; dış hesap/DNS/kurumsal içerik bekleme süreleri hariç. Trace beklenenden farklı kök neden gösterirse efor revize edilir.

Orijinal görseller korunur; responsive markup eski kaynağa geri dönebilir. Sahne bootstrap ve performans değişiklikleri bağımsız geri alınabilir kümelerde tutulur. Header/DNS işleri görsel ve JS optimizasyonundan ayrı tutulur. Commit/push kullanıcı istemedikçe yapılmaz; kullanıcı istediğinde her kümede yalnız ilgili dosyalar stage edilir. Canlı yayında regresyon çıkarsa ilgili dağıtım geri alınır; bunun için ayrıca dağıtım yetkisi gerekir.

## 7. Rapor önerilerinin kapsam eşlemesi

| Rapor önerisi | Plan kararı |
|---|---|
| Toplam boyut / image optimization / boyut nitelikleri | Görev 3, P0/P1 |
| Mobil LCP / render-blocking / LCP discovery | Görev 1, 2, 3, 5 |
| Masaüstü TBT / long task / unused JS / third-party | Görev 1, 4, 5 |
| Layout thrashing / DOM boyutu / compositor animasyon | Görev 1, 5; DOM azaltımı yalnız gerçek trace ihtiyacı varsa, metin silmeden |
| Kontrast / iframe title / heading / ARIA / ajan ağacı | Görev 6 |
| Sitemap / canonical / description / keyword kullanımı | Görev 7; keyword stuffing yok |
| X kartları / sosyal paylaşım | Görev 7 |
| Yerel adres / telefon / LocalBusiness | Görev 6 ve koşullu 8; yalnız doğrulanmış kurum bilgisi, uygun Event semantiği |
| Backlink stratejisi | Koşullu Görev 8; dış iletişim yetkisi ayrı |
| SPF / DMARC | Koşullu Görev 8; gönderici domain analizi olmadan kayıt yok |
| Analytics / Facebook Pixel | Analytics zaten mevcut; Pixel gerekçesiz eklenmez |
| Yeni Facebook/X/LinkedIn/YouTube hesabı | Zorunlu değil; mevcut resmi kanallar varsa bağlantı |
| llms.txt | P3, isteğe bağlı |
| Inline styles kaldırma | Bakım ihtiyacı varsa sınırlı temizlik; tek başına performans kabul kriteri değil |
| iframe kaldırma / e-postayı resme çevirme | Uygulanmaz; map faydası, lazy loading, title ve erişilebilir mailto korunur |
| Hreflang | Tek dil için gerekmez |
| CSP/HSTS/COOP/XFO/Trusted Types | Puanlı hata varsayılmaz; koşullu ayrı header/uyumluluk incelemesi |

## 8. Resmî teknik kaynaklar

Bu kaynaklar 1 Ekim 2026'da plan hazırlanırken kontrol edildi; uygulama sırasında güncelliği ve sürüm uyumluluğu yeniden kontrol edilir.

- [Google web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp): LCP'nin kaynak keşfi ve render gecikmesini ayrı ölçme; gizli içeriğin gecikmesini yalnız görsel sıkıştırmayla çözememe.
- [Google web.dev — Optimize long tasks](https://web.dev/articles/optimize-long-tasks): Uzun görevleri bölme ve ana iş parçacığını serbest bırakma yaklaşımı.
- [Google Search Central — Sitemap oluşturma](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap): canonical public URL'ler ve sitemap keşfi.
- [Google Search Central — Event structured data](https://developers.google.com/search/docs/appearance/structured-data/event): etkinlik tarih/konum bilgilerinin görünür içerikle uyumu ve doğrulama.

## 9. Plan tesliminin sınırı

Bu belge hazırlanırken üç rapor, yerel kaynaklar, görsel dosya boyutları ve proje kuralları incelendi. Yeni canlı Lighthouse/Performance kaydı, tam erişilebilirlik taraması, DNS denetimi veya Supabase testi yapılmadı. Bu nedenle kök neden adayları kesin runtime teşhisi olarak sunulmuyor. Önceki panel/servis incelemeleri ana sayfa performansının açıklaması sayılmıyor; operasyonel backend ayrı kapsamdır. Bu oturumdaki tek eklenen dosya bu plandır.
