# PROJECT_SUMMARY.md — MFL FBÇ '26

Bu doküman projeyi sıfırdan açan bir geliştiricinin (veya yeni bir Claude oturumunun) tek okumayla tüm sistemi kavrayabilmesi için yazıldı. Mimari, dosya sorumlulukları, etkileşim akışları, Three.js sahnesi, design token sistemi ve tasarım kararlarının ardındaki "neden"ler burada. Her satır referans değeridir, padding yoktur.

> **Tarih notu:** Etkinlik 9-10 Mayıs 2026 tarihinde gerçekleşti, bugün 2026-05-13. Site canlıda anma/arşiv durumunda yayında; başvurular kapalı, yemek QR sistemi kaldırıldı (önceki commit'lere bak).

---

## İçindekiler

0. Bu Dokümanı Nasıl Okumalı
1. Bakış Açısı / Proje Kimliği
2. Dizin Yapısı ve Sorumluluklar
3. index.html — Section'lar (Bölüm Bölüm Anatomi)
4. css/style.css Mimarisi
5. js/main.js Anatomisi
6. Three.js Mimarisi
7. Harici Bağımlılıklar
8. Görsel Envanteri
9. Class İsimleri Sözlüğü
10. Etkileşim Akışları
11. Tarayıcı Desteği ve Erişilebilirlik
12. Deploy ve Hosting
13. Tasarım Kararları ve Quirks
14. Sık Sorulan Sorular

---

## 0. Bu Dokümanı Nasıl Okumalı

- **Yeni başlıyorsan:** Bölüm 1 → 2 → 3 sırasıyla oku; site mimarisi netleşir.
- **Three.js tarafına dokunacaksan:** Bölüm 6 zorunlu. `js/scene/` BEM-stili karmaşık bir sahne sistemidir; üst başlığı atlama.
- **CSS değiştireceksen:** Bölüm 4 + Bölüm 9 (class sözlüğü) referans olmadan dokunma — `:root` token'ları ve consolidated card-hover bloku bu projenin omurgasıdır.
- **Bug fix yapıyorsan:** Önce Bölüm 10 (Etkileşim Akışları) ile ilgili akışı izle, sonra Bölüm 3 veya 5'te ilgili kodu bul.
- **Tasarım nedenleri merak ediyorsan:** Bölüm 13'e bak — neden GSAP + Lenis + iki ayrı Three.js sahnesi var, neden başvurular kapalı CTA hâlâ duruyor, vb.

Doküman satır numarası referansları gerçek dosya satırlarını işaret eder; dosya değiştiğinde satır numarası da değişir. Aşağıdaki referanslara güvenmek için önce ilgili dosyayı `grep` veya `Read` ile teyit et.

---

## 1. Bakış Açısı / Proje Kimliği

### Ne yapıyor

Maltepe Fen Lisesi Fen Bilimleri Çalıştayı 2026 (kısaca **MFL FBÇ '26**) için tek sayfalık tanıtım sitesi. Etkinlik 9-10 Mayıs 2026'da Üsküdar Sağlık Bilimleri Üniversitesi'nde gerçekleşti; bu site etkinlik öncesinde başvuru çağrısı, organizasyon ekibi/sponsor/program duyurusu için kullanıldı, etkinlikten sonra arşiv olarak yayında.

### Hedef kitle

- Lise öğrencileri (başvuru sahibi adaylar)
- Eğitimciler ve veliler
- Sponsorlar / akademisyenler / basın

### Teknik kimlik

- **Vanilla HTML/CSS/JS.** Build adımı yok. Framework yok.
- **Three.js** (CDN üzerinden importmap ile) — iki ayrı sahne (arka plan beyni + komite carousel'i).
- **GSAP** + **ScrollTrigger** + **ScrollToPlugin** (CDN, defer).
- **Lenis** smooth scroll (CDN, defer) — sadece komite section'ında etkin.
- **Google Fonts** (Inter + Playfair Display).
- **Vercel** üzerinde host. Vercel Analytics + Speed Insights kullanılıyor.
- **Türkçe içerik.** HTML `lang="tr"`, tarih formatı gün-ay-yıl.

### Non-goals

- SSR yok, statik HTML.
- Build pipeline yok (no Webpack/Vite/Parcel).
- npm/package.json yok (sadece CDN bağımlılıkları).
- Test framework yok (kullanıcı manuel test ediyor).
- Backend yok (her şey static asset).
- Form yok (başvuru süreci hârici bir sistemde yürütüldü; site sadece tanıtım).

### Önemli boyutlar

- `index.html`: ~64 KB, ~1040 satır.
- `css/style.css`: ~2900 satır.
- `js/main.js`: ~570 satır.
- `js/three-scene.js`: ~870 satır.
- `js/carousel.js`: ~200 satır.
- `js/scene/stage.js` + yardımcılar + 7 signature: toplam ~700-800 satır.
- Görsel asset'leri: ~12 MB (17 görsel, brand/sponsors/team/past-2025/program).

### Deploy hedefi ve domain

- Production domain: `maltepefencalistay.org` (Vercel ile bağlı).
- Local dev: statik server (Python http.server veya basit Node http server).
- Vercel auto-deploy: main branch'e push → otomatik build/deploy. Build komutu yok, sadece static asset transfer.

---

## 2. Dizin Yapısı ve Sorumluluklar

```
mfl-calistay-2026/
├── index.html                  ← Tek HTML sayfası, tüm section'lar burada
├── CLAUDE.md                   ← Claude'a görev kuralları (bu projenin tüzüğü)
├── PROJECT_SUMMARY.md          ← Bu doküman (proje sözlüğü)
├── vercel.json                 ← Vercel config (sadece trailingSlash:false)
├── robots.txt                  ← SEO direktifi
├── .gitignore                  ← OS/editor + .vercel/
│
├── css/
│   └── style.css               ← Tüm stiller — design token'lı, tek dosya
│
├── js/
│   ├── main.js                 ← Sayfa script'i (DOM event'leri, modal, lightbox, ...)
│   ├── three-scene.js          ← Arka plan Three.js sahnesi (7 mode, mouse parallax)
│   ├── carousel.js             ← Komite slide picker + stage entegrasyonu
│   └── scene/                  ← Komite Three.js sahne sistemi
│       ├── stage.js            ← Sahne kurucu (renderer, bloom, camera tween)
│       ├── camera.js           ← Kamera hedefleri (HOME, per-sig position)
│       ├── anchors.js          ← Her komitenin uzaysal anchor noktası
│       ├── dispose.js          ← Geometry+material+texture temizleyici
│       └── signatures/
│           ├── index.js        ← 7 signature export'unun aggregate'i
│           ├── quantum.js      ← Kuantum Fiziği imza sahnesi (kabuklu parçacık)
│           ├── neuro.js        ← Nöropsikoloji imza sahnesi
│           ├── ai-nlp.js       ← AI/NLP imza sahnesi
│           ├── aero.js         ← Havacılık imza sahnesi
│           ├── molbio.js       ← Moleküler Biyoloji imza sahnesi
│           ├── forensic.js     ← Adli Bilimler imza sahnesi
│           └── smart.js        ← Akıllı Sistemler imza sahnesi
│
└── assets/
    └── images/
        ├── brand/              ← Marka logoları (her yerde tekrar kullanılan)
        │   ├── mfl.png         ← Maltepe Fen Lisesi okul logosu
        │   └── fbc.png         ← FBÇ etkinlik logosu (favicon + nav + hero + preloader)
        ├── sponsors/           ← Sponsor logoları
        │   ├── eker.png        ← Eker (gıda)
        │   ├── porty.png       ← Porty (sponsor — koyu zemin gerekli)
        │   └── uludag.png      ← Uludağ (içecek)
        ├── team/               ← Ekip portreleri (alt başkanlar / koordinatörler)
        │   ├── akademi-baskan.png
        │   ├── genel-koordinator.png
        │   ├── yardimci-koordinator.png
        │   ├── pr-baskan.jpeg
        │   ├── press-baskan.jpeg
        │   ├── lojistik-baskanlari.png
        │   └── saha-baskanlari.png
        ├── past-2025/          ← Geçmiş etkinlik galeri (FBÇ '25 anıları)
        │   ├── 1.png
        │   ├── 2.png
        │   ├── 3.png
        │   └── 4.png
        └── program/
            └── genel.png       ← Matbu program görseli (lightbox'ta açılır)
```

### Sorumluluk paylaşımı

- **`index.html`** içerik kaynağıdır: tüm metin, başlık, davetli akademisyen listesi, program zaman çizelgesi, SSS soruları HTML içinde inline.
- **`css/style.css`** tek tipografi/renk/spacing kaynağıdır; `:root` blokunda tanımlı CSS custom properties ("design tokens") tüm stillerin temelidir.
- **`js/main.js`** sayfanın non-Three.js etkileşimleri: navbar scroll, mobile menu, smooth scroll, FAQ accordion, reveal animations, lightbox, modal — hepsi burada.
- **`js/three-scene.js`** body arka planında render edilen `#bg-canvas` üzerindeki dekoratif sahne. Komiteler dışındaki tüm section'larda görünür; section'a göre `mode` değiştirir.
- **`js/carousel.js` + `js/scene/`** komiteler section'ı için ayrı bir Three.js sahnesi. `#committees-stage` canvas'ında render edilir; komite slide'ları scroll'a göre aktif olur, kamera o komitenin imza sahnesine geçiş yapar.

### Dokunma sırası önerisi (yeni bir geliştirici için)

1. `index.html`'i baştan sona oku (1040 satır, 30 dakika).
2. `css/style.css` `:root` blokunu (ilk ~55 satır) oku ve token'ları öğren.
3. `js/main.js`'yi okuyup hangi etkileşimin nerede olduğunu öğren.
4. Tarayıcıda aç, her section'ı hover/scroll/click ederek görsel davranışı doğrula.
5. `js/three-scene.js` sadece mod sistemini anla (SECTION_MODES + animate döngüsü); detayına geç sonra.
6. `js/scene/stage.js`'ye en son bak — projenin en karmaşık parçası.

---

## 3. index.html — Section'lar (Bölüm Bölüm Anatomi)

Sayfa **tek HTML dosyası** içinde 16+ semantik section barındırır. Her section'ın amacı, DOM yapısı, JS bağı, edge case'leri aşağıda.

Sıra (HTML'deki kaynak sıra):

1. `<head>` — meta + preconnect + font + Vercel scripts
2. `#preloader` — asset gating yükleyici
3. `#scrollProgress` — sayfa kayma çubuğu
4. `#bg-canvas` — Three.js arka plan canvas'ı
5. Navbar + Mobile menu
6. `#hero` — açılış section'ı (countdown burada)
7. `#theme` — 2026 teması ("Yarını Şekillendiren Fikirler")
8. `#vision` — vizyon + misyon kartları
9. `#about` — hakkımızda + istatistik counter'ları
10. `#workshop` — workshop ve etkinlik tanıtımı
11. `#komiteler` (Three.js stage) — 7 komite slide stack + modal
12. `#program` — iki günlük tab'lı timeline
13. `#team` — sorumlu öğretmenler + alt ekip kartları
14. `#faq` — accordion SSS
15. `#sponsors` — sponsor logoları
16. `#eventinfo` — etkinlik program görseli + harita embed
17. `#past` — '25 yılı galeri
18. `#contact` — iletişim + ikinci harita embed
19. `<footer>` — marka + sayfalar + iletişim + sosyal
20. `#committeeModal` — komite detay modal'ı (overlay)
21. `#lightbox` — görsel zoom overlay

Bunlar tek `<body>` içinde ardışık yerleşir; section'lar arası geçişi scroll yapar.

---

### 3.1 `<head>`

```
satır ~3-45
```

#### Meta etiketleri

- `charset=UTF-8` — Türkçe karakter desteği için zorunlu.
- `viewport=width=device-width, initial-scale=1.0` — mobil responsive.
- `description`, `keywords`, `author` — temel SEO metaları.
- Open Graph meta'ları (`og:title`, `og:description`, `og:type`, `og:locale`) — sosyal paylaşımda kart görünümü.

#### Favicon ve apple-touch-icon

- `assets/images/brand/fbc.png` (event logosu) hem favicon hem apple-touch-icon olarak verilir. PNG formatında, browser'a göre fallback yok.

#### Font preconnect ve yüklemesi

- `https://fonts.googleapis.com` ve `https://fonts.gstatic.com` için `preconnect` — DNS lookup'ı erken yap, paint'i hızlandır.
- Inter (400, 500, 600, 700, 800) + Playfair Display (700) tek `<link>` satırında yüklenir.

#### JSON-LD schema.org event verisi

- `@context: schema.org`, `@type: Event`, `startDate: 2026-05-09`, `endDate: 2026-05-10`, `eventAttendanceMode: OfflineEventAttendanceMode`. Google'ın rich snippet için.

#### Vercel scripts

```html
<script defer src="/_vercel/insights/script.js"></script>
<script defer src="/_vercel/speed-insights/script.js"></script>
```

- Vercel Analytics ve Speed Insights script'leri. Vercel'in routing'i bu URL'leri runtime'da enjekte eder; **local dev'de 404 vermesi normal**. Bu site Vercel'e bağlı olduğunda otomatik çalışır.

---

### 3.2 `#preloader`

```
satır ~48-55
```

#### Görsel yapı

`role="status" aria-live="polite"` ile erişilebilir bir yükleme ekranı. İçinde:

- `.preloader__scene` (dekoratif): iki orbital ring (`--outer`, `--inner`) + ortada FBÇ logosu.
- `.preloader__bar`: progress bar, `#preloaderFill` ile genişler.

#### JS davranışı (main.js — preloader IIFE)

- Sayfadaki tüm `<img>` element'lerini sayar (`document.images`).
- Her image için `load` / `error` event'inde counter artırır, progress bar'ı `width: %X` ile günceller.
- `load` (window) event'i veya 6 saniye hard fallback ile finish edilir:
  - `body` üzerinden `is-loading` class'ı kaldırılır.
  - `#preloader` element'ine `is-hidden` class'ı eklenir (CSS opacity fade).
  - `preloader:done` custom event dispatch edilir (şu an kimse dinlemiyor ama hook bırakılmış).

#### Edge case

- Görsel sayısı 0 olursa Math.max(imgs.length, 1) ile bölünme hatası önlenir.
- 6 saniye hard fallback bir asset hang olduğunda kullanıcıyı sonsuza kadar kilitlemez.

#### Erişilebilirlik

- `aria-label="Site yükleniyor"` — ekran okuyucu için durumu anons eder.
- Logo `<img alt="">` (dekoratif), scene `aria-hidden="true"`.

---

### 3.3 `#scrollProgress`

```
satır ~57-58
```

Üst bar progress göstergesi. `position: fixed; top: 0`, `#scrollProgressFill` element'inin `width` değeri scroll oranıyla orantılı olarak güncellenir.

JS: `main.js` sonunda `scrollProgress` IIFE. `requestAnimationFrame` throttle ile scroll event'inde `(window.scrollY / scrollableHeight) * 100` hesaplanır.

---

### 3.4 `#bg-canvas`

```
satır ~60
```

Three.js arka plan sahnesinin render hedefi. `position: fixed; inset: 0; z-index: -1; pointer-events: none`. `aria-hidden="true"` ile ekran okuyuculardan gizlenir.

İçeriği için Bölüm 6'ya bak. Burada sadece şunu bilmen yeter: section'lar bu canvas'ın üstünde RGBa background ile yarı saydam katmanlar olarak yerleşir; sahne section'lara göre mode değiştirir.

---

### 3.5 Navbar + Mobile Menu

```
satır ~62-106
```

#### Desktop navbar (`<nav class="navbar" id="navbar">`)

- **Logo grubu**: MFL okul logosu + FBÇ etkinlik logosu + text "MFL FBÇ '26". `<a href="#hero">` ile hero'ya götürür.
- **Nav links** (`<ul class="nav-links">`): Anasayfa, Hakkımızda, Ekibimiz, Sponsorlar, Komiteler, Program, İletişim — her biri anchor link.
- **CTA** (`<span class="nav-cta is-closed">`): "Başvurular bitti" görsel CTA. Etkinlik öncesinde aktif başvuru butonuyken, başvurular kapandığında `is-closed` state'iyle disable görünüm aldı. `<span>` çünkü tıklanabilir değil (`aria-disabled="true"`).
- **Hamburger** (`<button class="hamburger">`): Mobilde görünür (`@media max-width: 768px`), 3 spans bar olarak görünür, active'de X'e dönüşür.

#### Mobile menu (`<div class="mobile-menu" id="mobileMenu" data-lenis-prevent>`)

- `data-lenis-prevent` attribute Lenis smooth scroll'un bu element içinde devreye girmemesi için (komite section'ında Lenis varsa).
- Hamburger'a tıklayınca `body.menu-open` class'ı eklenir, `.mobile-menu.active` görünür hale gelir.
- Mobile link'lere tıklayınca otomatik kapanır (`main.js` listener'ı).
- Outside-tap (`.mobile-menu` element'inin kendisine click) ile de kapanır.
- Escape tuşu kapatır.

#### JS davranışı (`main.js`)

- `window.scroll` listener: `scrollY > 50` ise `navbar.classList.add('scrolled')`. `.navbar.scrolled` CSS'inde navy-dark background + box-shadow gelir.
- Active link: `IntersectionObserver` benzeri scroll-based; sayfanın hangi section'ında olduğun bulunur, ilgili `.nav-link` `.active` class'ı alır.

#### Erişilebilirlik

- Hamburger `aria-label="Menüyü aç"`, `aria-expanded` durumla güncellenir.
- Mobile menü `aria-hidden` toggle edilmez (`hidden` attribute kullanılmaz), bunun yerine display kontrolü CSS class ile.

---

### 3.6 `#hero`

```
satır ~108-149
```

#### İçerik

- **Hero logosu**: `assets/images/brand/fbc.png`, `.hero-logo.zoomable` class'ları. `.zoomable` lightbox'a girmesini sağlar; tıklayınca büyük açılır.
- **Başlık**: `<h1 class="hero-title">` iki satırda — birinci satır "Maltepe Fen Lisesi", ikinci satır `<span class="hero-highlight">` ile vurgulanmış "Fen Bilimleri Çalıştayı '26".
- **Alt başlık**: `<p class="hero-subtitle">` — tema cümlesi.
- **Countdown** (`#countdown` → `#days`, `#hours`, `#minutes`, `#seconds`): geri sayım sayıları. Target tarihi `js/main.js`:134'te `new Date('2026-05-09T09:00:00')`. Etkinlik geçtikten sonra `Etkinlik başladı!` yazısı gösterir.
- **Hero butonları**: "Başvurular bitti" (`<span class="btn btn-primary is-closed">`) + "Keşfet" (`<a class="btn btn-secondary" href="#theme">`).
- **Hero tarih chip'i**: SVG takvim ikon + "9 - 10 Mayıs 2026" metni.

#### Scroll-indicator

`<a class="scroll-indicator" href="#theme">` — hero'nun alt-orta'sında çift chevron SVG. Kullanıcıyı theme section'ına yönlendirir, ayrıca CSS animasyonu ile yukarı-aşağı float yapar.

#### Three.js etkileşimi

- `#hero` section ID'si `SECTION_MODES['hero'] = 'atom'` (three-scene.js). Hero görünür olduğunda arka planda atom modu (5 orbital ring + nucleus) animasyon yapar.

#### JS countdown

```js
const targetDate = new Date('2026-05-09T09:00:00').getTime();
function updateCountdown() {
    const distance = targetDate - Date.now();
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p class="countdown-ended">Etkinlik başladı!</p>';
        return;
    }
    // calc days/hours/minutes/seconds, padStart(2, '0'), inject textContent
}
setInterval(updateCountdown, 1000);
```

#### Edge case

- Sayfada `#hero` section yoksa nav-logo `<a href="#hero">` 404 verir.
- Countdown elemanlarından biri DOM'dan silinirse `.textContent` null pointer atar — main.js bunu kontrol etmiyor (tasarım kararı: bu elementler zorunlu).

---

### 3.7 `#theme`

```
satır ~152-158
```

#### Yapı

Minimal section: `.section-badge` "2026 Teması" + `<h2 class="theme-title">` `"Yarını Şekillendiren Fikirler"` + `<p class="theme-desc">` tema cümlesi.

#### Three.js etkileşimi

`SECTION_MODES['theme'] = 'dna'` — DNA double-helix modu görünür.

---

### 3.8 `#vision`

```
satır ~161-180
```

#### Yapı

`.vm-grid` iki sütunlu grid:

1. **Vizyon kartı**: Globe SVG icon + "Vizyonumuz" başlık + açıklama.
2. **Misyon kartı**: Check-circle SVG icon + "Etkinlik Misyonumuz" başlık + uzun açıklama.

Her kart `<div class="vm-card reveal">`. `.reveal` class'ı IntersectionObserver hedefi (`main.js`'de reveal animations bölümü).

#### Three.js etkileşimi

`SECTION_MODES['vision'] = 'flow'` — wireframe Icosahedron flow modu.

#### Card hover/tilt

`.vm-card` 3D tilt selector'da (`js/main.js`:447). Mouse hareketiyle X/Y rotation, glow halo, card-hover event'i.

---

### 3.9 `#about`

```
satır ~183-208
```

#### Yapı

- Section badge "Bizi Tanıyın" + başlık "Hakkımızda" + açıklama paragrafı.
- **Stats grid** (4 kart): 150+ Katılımcı, 7 Komite, 20+ Konuşmacı, 2 Gün. Her birinde:
  - `<span class="stat-number" data-target="150">0</span>`
  - `<span class="stat-plus">+</span>` (opsiyonel, bazılarında var)
  - `<span class="stat-label">Katılımcı</span>`

#### Stat counter animasyonu (main.js)

`IntersectionObserver` threshold 0.5'te tetiklenir, `data-target` değerine kadar 16ms tick'le artar, hedefe ulaşınca durur. Her stat sadece bir kez animate olur (`unobserve(el)`).

#### Three.js etkileşimi

`SECTION_MODES['about'] = 'neural'` — 4-6-6-3 layer'lı neural network modu, dolaşan sinyaller.

---

### 3.10 `#workshop`

```
satır ~211-241
```

#### Yapı

Section badge "Deneyim" + başlık "Workshop ve Etkinlikler".

İçinde `<div class="workshop-box reveal">`:

- **Workshop content**: İki uzun paragraf, çalıştay'ın disiplinlerarası kapsamını anlatır. Komite isimleri burada metin olarak geçer (kuantum, nöro, AI/NLP, vb.).
- **Workshop highlights**: 4 check-circle SVG ile özellik listesi (geniş bilimsel yelpaze, üniversite akademisyenleri, disiplinler arası, etik+toplumsal analiz).

#### Three.js etkileşimi

`SECTION_MODES['workshop'] = 'wave'` — yatay wireframe plane, sinüs dalgaları.

---

### 3.11 `#komiteler` — KOMİTE STAGE (BÜYÜK SECTION)

```
satır ~243-490 + modal: 492-524
```

Bu, projenin **en karmaşık section'ı**. Kendi Three.js sahnesi var, scroll-based active state, modal animasyonu, 7 farklı imza sahnesi.

#### Üst yapı

```html
<canvas id="committees-stage" aria-hidden="true"></canvas>
<section class="section section--committees" id="komiteler">
  <header class="section__head section__head--split reveal">
    <div>
      <h2 class="section__title">Yedi disiplin, <em>yedi masa,</em><br/>yedi akademik ev sahibi.</h2>
    </div>
    <p class="section__note">Her komite kendi oturum salonunda bağımsız ilerler...</p>
  </header>
  <div class="committees-stack">
    [7 .committee-slide article]
  </div>
  <div class="committees-cta is-closed reveal" aria-disabled="true">
    [Bilgi: Başvurular bitti]
  </div>
</section>
```

`#committees-stage` canvas'ı `position: fixed; top: 0; width: 100vw; height: 100vh; z-index: 1` olarak yerleşir. Normalde `opacity: 0`, komiteler görünür olunca `body.committees-visible` class'ı eklenir ve canvas'ın opacity'si 1 olur, `#bg-canvas` (ana arka plan) opacity'si 0'a iner (CSS'te `body.committees-visible #bg-canvas { opacity: 0 }`).

#### Her `.committee-slide` article'ı

```html
<article class="committee-slide" data-signature="quantum">
  <div class="committee-slide__head">
    <span class="committee__num">C/01</span>
    <span class="committee-slide__page">p. 04</span>
    <div class="committee__icon" aria-hidden="true">
      <svg>...</svg>  ← komite-spesifik SVG ikon
    </div>
  </div>
  <h3 class="committee-slide__title">Kuantum Fiziği</h3>
  <p class="committee-slide__lede">[komite tagline]</p>
  <ul class="committee-slide__topics">
    <li>Konu 1</li> ... <li>Konu 4</li>
  </ul>
  <footer class="committee-slide__speakers">
    <span class="committee-slide__speakers-lbl">Davetli Konuşmacılar</span>
    <ul>
      <li><span class="speaker-name">İsim</span><span class="speaker-inst">Kurum</span></li>
    </ul>
  </footer>
</article>
```

`data-signature` attribute'u Three.js sahnesinin hangi imzaya geçeceğini belirler.

7 komite (sıra önemli — HTML kaynak sırası, görsel sıra, üniversite/davetli düzeni):

1. **quantum** (C/01) — Kuantum Fiziği. 3 davetli.
2. **neuro** (C/02) — Nöropsikoloji. 1 davetli.
3. **ai-nlp** (C/03) — Yapay Zekâ, Veri & Doğal Dil İşleme. 3 davetli.
4. **aero** (C/04) — Uçak ve Havacılık. 2 davetli.
5. **molbio** (C/05) — Moleküler Biyoloji & Genetik. 5 davetli (en kalabalık).
6. **forensic** (C/06) — Adli Bilimler, Kriminalistik & Toksikoloji. 2 davetli.
7. **smart** (C/07) — Akıllı Sistemler & Mühendislik. 2 davetli.

#### Komiteler-cta (alt CTA bloğu)

```html
<div class="committees-cta is-closed reveal" aria-disabled="true">
  <span class="committees-cta__kicker">Bilgi</span>
  <span class="committees-cta__title">Başvurular bitti</span>
</div>
```

Section sonundaki "Başvurular bitti" mesajı. `is-closed` state'iyle disable görünüm.

#### Carousel.js entegrasyonu (Bölüm 6'da detaylı)

`js/carousel.js` DOMContentLoaded'da:

1. Slide'ları toplar.
2. Mobile detection (`max-width: 768px`): mobilde Three.js sahnesi tamamen atlanır, slide'lar normal kart listesi olarak görünür, tap → modal.
3. Desktop: `initStage()` çağrılır (stage.js), Lenis smooth scroll başlatılır (eğer prefers-reduced-motion değilse).
4. Scroll listener: viewport center'a en yakın slide aktif olur, `setActiveSlide(slide)` çağrılır, Three.js sahnesi o imzaya kamera yapar.
5. Slide click/keyboard activate: `zoomTo(sig)` + 720ms sonra `openCommitteeModal(num, slide)`.

#### Committee Modal (`#committeeModal`)

```
satır ~492-524
```

Modal yapısı:

```html
<div class="committee-modal" id="committeeModal" role="dialog" aria-modal="true" hidden data-lenis-prevent>
  <div class="committee-modal__backdrop" data-close></div>
  <div class="committee-modal__panel">
    <button class="committee-modal__close" data-close aria-label="Kapat"><svg>X</svg></button>
    <div class="committee-modal__symbol" aria-hidden="true"></div>  ← Komite icon'u burada animate olur
    <div class="committee-modal__inner">
      <div class="committee-modal__head">
        <span class="committee-modal__num"></span>
        <h3 class="committee-modal__title"></h3>
        <p class="committee-modal__tagline"></p>
      </div>
      <div class="committee-modal__grid">
        <div class="committee-modal__block">
          <span class="committee-modal__lbl">Alt Başlıklar</span>
          <ul class="committee-modal__topics"></ul>
        </div>
        <div class="committee-modal__block">
          <span class="committee-modal__lbl">Ne Öğreneceksiniz</span>
          <ul class="committee-modal__learn"></ul>
        </div>
        <div class="committee-modal__block committee-modal__block--full">
          <span class="committee-modal__lbl">Davetli Akademisyenler</span>
          <div class="committee-modal__speakers"></div>
        </div>
      </div>
    </div>
  </div>
</div>
```

#### Modal data ve davranışı (main.js)

`COMMITTEE_DATA` objesi (`main.js`:217-292): 7 komitenin tam detayı:

- `title`: Modal başlığı (HTML'deki slide başlığıyla aynı)
- `tagline`: Modal tagline'ı (slide'daki lede'den farklı, daha kısa pitch)
- `topics`: 4 string array (alt başlıklar)
- `learn`: 4 string array ("Ne Öğreneceksiniz")
- `speakers`: Array of `{name, inst, focus}` (focus, slide'da olmayan ek bilgi — modal'da görünür)

`openCommittee(key, sourceCard)` fonksiyonu (`main.js`:304):

1. `COMMITTEE_DATA[key]` (örn `'C/01'`) data'sını alır, yoksa erken çıkar.
2. Slide'ın SVG icon'unu modal'ın `.committee-modal__symbol` element'ine clone'lar.
3. SVG'nin her path/circle/rect/ellipse/line/polyline/polygon element'i için `getTotalLength()` hesaplar, `stroke-dasharray` ve `stroke-dashoffset` ayarlar — sonra CSS animasyonu (`@keyframes symbolDraw`) bunları sırayla çizdirir (cinematic draw-in effect).
4. Active source card'a `.is-active` class'ı ekler.
5. Modal field'larını doldurur (title, tagline, topics li'leri, learn li'leri, speakers grid).
6. Modal'ı `hidden=false`, sonra reflow için `offsetHeight` oku, sonra `.is-open` class'ı ekle (CSS transition).
7. `committee-modal:opened` custom event dispatch et (`detail: {key, sig}`) — carousel.js bunu dinler, `stage.zoomTo(sig)` ve `stage.isolate(true)` çağırır, Lenis durur.

`closeCommittee()`:

1. `.is-open` class'ını kaldır (CSS reverse transition).
2. 400ms sonra `hidden=true`, `symbolEl.innerHTML = ''`.
3. `committee-modal:closed` dispatch — carousel `stage.zoomOut()` + `isolate(false)`, Lenis start.

#### Modal'daki ekstra mobil özellik: swipe-down to close

`main.js`:392-425 `.committee-modal__panel` element'ine touch listener'lar. Aşağı çekme algılanırsa `translateY` ile takip eder; eşik (delta > 80px veya velocity > 0.5) aşıldığında `closeCommittee()` çağırır.

#### Three.js etkileşimi

- Bu section için **`SECTION_MODES`'a EKLENMEMİŞ** — komite section'ı görünür olduğunda body class olarak `committees-visible` eklenir ve `#bg-canvas` CSS ile fade-out olur. Bu sırada `#committees-stage` (ayrı canvas) sahnesi devreye girer.
- Stage'in mode'u, kamerası, intensity'leri active slide'a göre dinamik değişir. Detay Bölüm 6.2'de.

---

### 3.12 `#program`

```
satır ~526-676
```

#### Yapı

`<section class="section section--ink" id="program">` — `--ink` modifier'ı CSS'te koyu zemin verir.

Header:
- `<h2 class="section__title section__title--light">İki günlük akış.</h2>`
- "Matbu programı görüntüle" link — `assets/images/program/genel.png`'ye new tab'ta gider.

Tab + panel yapısı (`<div class="program" data-tabs>`):

- **Tab listesi** (`role="tablist"`, "Program günleri"):
  - Day 1: `<button class="program__tab is-active" data-tab="day1">9 Mayıs Cumartesi</button>`
  - Day 2: `<button class="program__tab" data-tab="day2" tabindex="-1">10 Mayıs Pazar</button>`
- **Paneller**:
  - `<div class="program__panel is-active" id="day1">` (görünür)
  - `<div class="program__panel" id="day2" hidden>` (gizli)

Her panel içinde `<ol class="timeline">` — saat-içerik ardışık liste.

#### Timeline öğeleri

```html
<li class="timeline__item">
  <span class="timeline__time">08:30</span>
  <div class="timeline__body">
    <h3 class="timeline__title">Kayıt & Açılış Kahvesi</h3>
    <p class="timeline__meta">Ana Giriş · Konferans Salonu Fuayesi</p>
  </div>
</li>
```

Modifier class'lar:
- `.timeline__item--highlight` — açılış/kapanış konferansları gibi vurgulu satırlar (örn 09:30 açılış, 16:30 kapanış)
- `.timeline__item--soft` — molalar/transition'lar (soluk renk, daha az dikkat)

#### Day 1 timeline (sıra)

08:30 Kayıt → 09:30 Açılış Konferansı (highlight) → 11:00 Komite 1 → 12:15 Öğle (soft) → 13:30 Komite 2 → 14:45 Çay arası (soft) → 15:30 Komite 3 → 16:45 Gün sonu (soft)

#### Day 2 timeline

09:30 Sabah kahvesi → 11:00 Komite 1 → 12:15 Öğle (soft) → 13:30 Komite 2 → 14:45 Çay arası (soft) → 15:30 Komite 3 (rapor) → 16:30 Kapanış konferansı (highlight) → 17:30 Sertifika & Resepsiyon (soft)

#### Tab JS davranışı (main.js:490)

```js
document.querySelectorAll('[data-tabs]').forEach(root => {
    const tabs = root.querySelectorAll('.program__tab');
    const panels = root.querySelectorAll('.program__panel');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const target = tab.dataset.tab;
            tabs.forEach(t => {
                const active = t === tab;
                t.classList.toggle('is-active', active);
                t.setAttribute('aria-selected', active ? 'true' : 'false');
                t.setAttribute('tabindex', active ? '0' : '-1');
            });
            panels.forEach(panel => {
                const active = panel.id === target;
                panel.classList.toggle('is-active', active);
                if (active) panel.removeAttribute('hidden');
                else panel.setAttribute('hidden', '');
            });
        });
    });
});
```

Tab erişilebilirliği: `role="tab"`, `aria-selected`, `aria-controls`, `tabindex` doğru yönetiliyor.

#### Three.js etkileşimi

`SECTION_MODES['program'] = 'timeline'` — 12 nodlu sin-cos yollu polyline animasyonu.

---

### 3.13 `#team`

```
satır ~679-779
```

#### Yapı

İki alt-grup:

##### A. Sorumlu öğretmenler (`.team-grid`)

4 `.team-card` — her birinde:
- `.team-photo` (şu an SVG generic person icon, gerçek fotoğraf yok)
- `<h4 class="team-name">İsim Soyisim</h4>`
- `<span class="team-role">Rol</span>`
- `<p class="team-desc">Açıklama</p>`

Hierarchical sıra (önemli — yetki sırası):
1. Murat ÇAVUŞLU — Başdanışman Öğretmen
2. Berna GÜNGÖR — Danışman Öğretmen
3. Arzu ALPARSLAN — Danışman Öğretmen
4. Hüseyin PALABIYIKOĞLU — Danışman Öğretmen

##### B. Alt ekiplerimiz (`.subteam-grid`)

`<h3 class="team-subtitle">Ekiplerimiz</h3>` + 7 `.subteam-card`:

1. Genel Koordinatör (`team/genel-koordinator.png`)
2. Yardımcı Koordinatör (`team/yardimci-koordinator.png`)
3. PR Başkanı (`team/pr-baskan.jpeg`)
4. Press Başkanı (`team/press-baskan.jpeg`)
5. Akademi Başkanı (`team/akademi-baskan.png`)
6. Lojistik Eş Başkanları (`team/lojistik-baskanlari.png`)
7. Saha Eş Başkanları (`team/saha-baskanlari.png`)

Her kartta:
```html
<div class="subteam-card reveal">
  <div class="subteam-cover">
    <img src="assets/images/team/X.png" alt="Rol" class="subteam-photo">
  </div>
  <div class="subteam-body">
    <h4 class="subteam-name">Rol</h4>
  </div>
</div>
```

İsim/soyadı görsel olarak yok — sadece rol başlığı. Fotoğraflar gerçek kişilerin yüzlerini gösterir.

#### Three.js etkileşimi

`SECTION_MODES['team'] = 'constellation'` — 30 yıldız + close-distance polyline'larla constellation modu.

#### Card hover/tilt

Hem `.team-card` hem `.subteam-card` tilt selector'da. Mouse hareketi → 3D rotation + glow + card-hover event'i.

---

### 3.14 `#faq`

```
satır ~782-845
```

#### Yapı

`<div class="faq-list">` — 6 `.faq-item`:

1. "Çalıştaya kimler katılabilir?" → "Tüm lise öğrencileri..."
2. "Çalıştay ücreti ne kadar?" → "Katılım ücreti ve ödeme detayları başvuru sürecinde paylaşılacaktır."
3. "Başvurular hâlâ açık mı?" → "Hayır, başvurular kapanmıştır..." (mail link içerir)
4. "Çalıştay nerede gerçekleşecek?" → "Üsküdar Sağlık Bilimleri Üniversitesi'nde"
5. "Komitem nasıl belirlendi?" → komite atama logic'i
6. "Etkinlik kaç gün sürecek?" → "9-10 Mayıs 2026 tarihlerinde 2 gün"

Her item:
```html
<div class="faq-item">
  <button class="faq-question" aria-expanded="false">
    <span>Soru?</span>
    <svg class="faq-chevron">...</svg>
  </button>
  <div class="faq-answer">
    <p>Cevap.</p>
  </div>
</div>
```

#### JS accordion (main.js:160)

Tıklanan button için:
1. Tüm `.faq-question`'lerin `aria-expanded`'ini `false` yap, `parentElement.active` class'ını sil.
2. Açılan button isOpen değildiyse `aria-expanded=true` ve `.active` ekle.

Accordion **tek-açık** mantığında: her zaman ya 0 ya da 1 açık item olur.

#### CSS

`.faq-answer` default `max-height: 0; overflow: hidden`. `.faq-item.active .faq-answer` `max-height: 500px` (içeriğe göre büyük yeterli). `.faq-chevron` `.active` durumunda `rotate(180deg)`.

#### Erişilebilirlik

- `aria-expanded` her button için doğru yönetiliyor.
- `.faq-answer` semantik olarak button'un controls hedefi olmalı (ama şu anda `aria-controls` yok — küçük bir eksiklik).

---

### 3.15 `#sponsors`

```
satır ~848-865
```

#### Yapı

`<div class="sponsors-grid sponsors-grid--3">` — 3 `.sponsor-item`:

1. **Eker** — `assets/images/sponsors/eker.png`, `.sponsor-logo.sponsor-logo--white-bg` (zemin beyaz olduğu için modifier).
2. **Porty** — `assets/images/sponsors/porty.png`. Inline style `background: #19253F; border-color: #19253F` ile koyu zemin (logo açık renk gerektirir).
3. **Uludağ** — `assets/images/sponsors/uludag.png`.

`.sponsors-grid--3` modifier 3 sütun grid layout.

#### Three.js etkileşimi

`SECTION_MODES['sponsors'] = 'neural'` — about ile aynı neural mode.

---

### 3.16 `#eventinfo`

```
satır ~868-886
```

#### Yapı

Section badge "9 - 10 Mayıs 2026" + başlık "Etkinlik Bilgileri".

Grid:
- **Sol**: `.eventinfo-program` → `assets/images/program/genel.png`, `.zoomable` class'ı (lightbox'a açılabilir).
- **Sağ**: `.eventinfo-map` → Google Maps embed iframe (Sağlık Bilimleri Üniversitesi konumu). Üstüne "Google Maps'te Aç" link butonu (`maps.app.goo.gl` kısa link).

Map embed kullanılan koordinatlar:
- 41.0044719°N, 29.0212792°E (Üsküdar Sağlık Bilimleri Üniversitesi)

#### Three.js etkileşimi

`SECTION_MODES['eventinfo'] = 'wave'` — workshop ile aynı wave mode.

---

### 3.17 `#past`

```
satır ~889-910
```

#### Yapı

Section badge "Geçmişimiz" + başlık "Geçmiş Çalıştayımız" + `<h3 class="past-year">'25</h3>`.

`.past-gallery .past-gallery--4` — 4 sütun grid:
- `past-2025/1.png` (en büyük dosya, 1.1 MB)
- `past-2025/2.png`
- `past-2025/3.png`
- `past-2025/4.png`

Hepsi `.zoomable` — lightbox'ta açılabilir. Alt text `"FBÇ '25"`.

#### Three.js etkileşimi

`SECTION_MODES['past'] = 'constellation'` — team ile aynı mode.

---

### 3.18 `#contact`

```
satır ~913-952
```

#### Yapı

Section badge "Bize Ulaşın" + başlık "İletişim".

`.contact-grid` — 3 `.contact-item`:

1. **E-posta** (mailto link) — `maltepefenfbc@gmail.com`
2. **Instagram** (external link) — `@mflfenbilimlericalistayi`
3. **Konum** (external Google Maps link) — Maltepe Fen Lisesi

Her item içinde:
- `.contact-icon` (SVG)
- `<h4>` başlık
- `<span>` değer

`.contact-link-wrap` `<a>` tag'i tüm item'ı tıklanabilir yapar.

Altında `.contact-map` — bu sefer Maltepe Fen Lisesi'nin embed haritası (event venue değil okul, çünkü iletişim section'ı okula ait).

#### Three.js etkileşimi

`SECTION_MODES['contact'] = 'constellation'`.

---

### 3.19 `<footer>`

```
satır ~955-1008
```

#### Yapı

`.footer-grid` 4 sütun (mobile'da 2 veya 1):

1. **Footer brand**: MFL logosu + "MFL FBÇ '26" text + footer desc.
2. **Footer links**: Sayfalar (Hakkımızda, Ekibimiz, Komiteler, Program, SSS).
3. **Footer contact**: Konum (Maltepe Fen Lisesi) + e-posta.
4. **Footer social**: Instagram link.

Footer-bottom (altına ayrı satır): `© 2026 Maltepe Fen Lisesi Çalıştay. Tüm hakları saklıdır.`

---

### 3.20 `#lightbox` (Görsel zoom overlay)

```
satır ~1028-1032 (HTML) + main.js:518-553 (JS)
```

#### Yapı

```html
<div id="lightbox" class="lightbox" aria-hidden="true" role="dialog" aria-modal="true" aria-label="Görsel önizleme">
  <button class="lightbox__close" id="lightboxClose" aria-label="Kapat">×</button>
  <img class="lightbox__img" id="lightboxImg" alt="">
  <div class="lightbox__caption" id="lightboxCaption"></div>
</div>
```

#### JS davranışı

Document-level click listener: tıklanan element'in `closest('.zoomable')` (yani `<img class="zoomable">`) olup olmadığını kontrol eder. Hero logo, eventinfo program görseli, past gallery görselleri `.zoomable`. Tıklanınca:

1. `img.src = z.currentSrc || z.src` — responsive variant varsa currentSrc.
2. `cap.textContent = z.alt`.
3. `lb.classList.add('is-open')`, `aria-hidden=false`.
4. `body.lightbox-open` (scroll lock).

Kapatma:
- `.lightbox__close` butonu
- Backdrop click (`e.target === lb`)
- Escape tuşu

300ms sonra `img.src = ''` (memory cleanup).

---

### 3.21 `</body>` sonu — Scripts

```
satır ~1010-1039
```

#### Sırasıyla:

1. **Importmap** (`<script type="importmap">`) — Three.js modülleri için:
   ```json
   { "imports": { "three": "https://unpkg.com/three@0.166.0/build/three.module.js", "three/addons/": "https://unpkg.com/three@0.166.0/examples/jsm/" } }
   ```
2. **GSAP** + **ScrollTrigger** + **ScrollToPlugin** (defer).
3. **Lenis** smooth scroll (defer).
4. **Lightbox HTML** (yukarıda).
5. `<script src="js/main.js"></script>` — regular script.
6. `<script type="module" src="js/three-scene.js"></script>` — ES module.
7. `<script type="module" src="js/carousel.js"></script>` — ES module.

#### Sıralama önemli mi?

- `main.js` `<script>` (non-module), regular DOM-ready akışıyla çalışır.
- `three-scene.js` ve `carousel.js` module'dir, defer gibi davranır.
- Importmap mutlaka `three-scene.js` ve `carousel.js`'den ÖNCE gelmeli (yoksa `import * as THREE from 'three'` resolve olmaz).
- GSAP `carousel.js`'in `window.gsap` referansını kullanması için `carousel.js`'den önce yüklenmeli — defer ile yüklendiğinden bu doğal olarak garanti.

---

## 4. css/style.css Mimarisi

Tek dosya, ~2900 satır. Bölgeler `==================== BÖLÜM ====================` yorum satırlarıyla ayrılır.

### 4.1 Design Token Sistemi (`:root`)

İlk 55 satır. Tüm tasarım kararlarının kaynağı:

#### Navy Family

```css
--navy-dark: #2C56A5;      /* en koyu — ink / text */
--navy-primary: #3A64A7;   /* blue-dark */
--navy-medium: #4472B6;    /* derin mavi — primary */
```

#### Accent

```css
--accent: #819FCD;         /* orta mavi */
--accent-light: #9FB6D5;   /* açık pudra */
--accent-hover: #5381BE;   /* hover (koyulaşan) */
```

#### Neutrals

```css
--white: #FFFFFF;
--off-white: #F3F7FC;
--gray-light: #DDE8F3;     /* line/border */
--gray: #7B93B8;           /* mid desatüre */
--text-dark: #2C56A5;      /* ink — body text */
--text-muted: #7B93B8;
```

#### Typography

```css
--font-body: 'Inter', sans-serif;
--font-display: 'Playfair Display', serif;
```

#### Spacing

```css
--section-padding: 100px 0;
--container-width: 1200px;
--nav-height: 70px;
```

#### Transitions

```css
--transition: 0.3s ease;
--transition-slow: 0.6s ease;
```

#### Mobile breakpoints (sadece dokümantasyon için, @media literal sayı kullanır)

```css
--bp-sm: 480px;
--bp-md: 768px;
--bp-lg: 1024px;
```

Bu üç variable CSS custom property olarak tanımlı ama `@media` query'ler içinde kullanılamadığı için (CSS spec kısıtlaması) sadece referans için duruyor.

#### Touch target

```css
--touch-min: 44px;  /* Apple HIG minimum touch target */
```

#### Fluid type scale

```css
--text-h1: clamp(1.9rem, 5vw, 3.4rem);
--text-body: clamp(0.95rem, 1.4vw, 1.05rem);
```

#### Light-bg text colors

```css
--text-on-light: #2d3e5c;
--text-on-light-muted: #5a6e8a;
```

Bu iki variable beyaz/açık zemin section'larında (`#vision`, `#about`, `#faq`, `#sponsors`, `#contact`) metin kontrastı için kullanılır. `--text-muted` (`#7B93B8`) açık zeminde yetersiz kontrast verdiği için bunlar daha koyu tutuldu.

### 4.2 Reset

```css
*, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
html { scroll-behavior: smooth; }
body { font-family: var(--font-body); font-size: var(--text-body); color: var(--text-dark); line-height: 1.6; overflow-x: hidden; background: var(--navy-medium); }
body.menu-open { overflow: hidden; }
a { text-decoration: none; color: inherit; transition: color var(--transition); }
ul { list-style: none; }
img { max-width: 100%; height: auto; }
.container { max-width: var(--container-width); margin: 0 auto; padding: 0 24px; }
```

`html { scroll-behavior: smooth }` native smooth scroll'u açar — JS smooth scroll'la birlikte çalışır (komite section'ında Lenis kendi smooth scroll'unu üst-üste bindirir, native ile çakışmaz çünkü Lenis programmatic scroll yapıyor).

`body.menu-open` mobile menü açıkken scroll lock.

### 4.3 Background Canvas

```css
#bg-canvas {
    position: fixed; inset: 0;
    width: 100%; height: 100%;
    z-index: -1;
    pointer-events: none;
    display: block;
    transition: opacity 0.4s ease;
}
```

`z-index: -1` ile her şeyin altına gizlenir, `pointer-events: none` ile click event'leri canvas'a düşmez. `transition: opacity` komiteler görünürken fade-out için.

### 4.4 Section Overlay Sistemi

Tüm section'lar `position: relative; isolation: isolate` alır. `isolation: isolate` her section'a kendi stacking context'i verir — z-index çakışmalarını izole eder.

#### Section background tinting (rgba sistem)

```css
.section-theme { background: rgba(58, 100, 167, 0.70); }
.section-vm { background: rgba(228, 236, 246, 0.62); }
.section-about { background: rgba(237, 242, 248, 0.62); }
.section-workshop { background: linear-gradient(135deg, rgba(58, 100, 167, 0.72), rgba(68, 114, 182, 0.72)); }
.section-team { background: rgba(44, 86, 165, 0.72); }
.section-faq { background: rgba(237, 242, 248, 0.62); }
.section-sponsors { background: rgba(228, 236, 246, 0.62); }
.section-eventinfo { background: rgba(44, 86, 165, 0.72); }
.section-past { background: rgba(58, 100, 167, 0.70); }
.section-contact { background: rgba(44, 86, 165, 0.78); }
.section--paper { background: rgba(237, 242, 248, 0.62); }
.section--ink { background: rgba(44, 86, 165, 0.72); }
```

Her section yarı saydam — arkadaki `#bg-canvas` (Three.js sahnesi) görünür. Açık zemin section'ları (`vm`, `about`, `faq`, `sponsors`, `--paper`) `rgba(*, 0.62)`, koyu zemin section'ları (`team`, `eventinfo`, `contact`, `--ink`) `rgba(navy, 0.72-0.78)`.

#### Hero özel

Hero radial-gradient'le merkezden dışarı navy fade verir, `!important` ile (mobil keşif sırasında inline style override'larından korumak için).

### 4.5 Navbar

```css
.navbar {
    position: fixed; top: 0; left: 0; right: 0;
    z-index: 1000;
    height: var(--nav-height);
    transition: background var(--transition), box-shadow var(--transition);
}
.navbar.scrolled {
    background: var(--navy-dark);
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.3);
}
```

`z-index: 1000` modal'lardan (z-index: 1000) önce mi sonra mı? Aynı katmandalar; modal `position: fixed` ile inset:0 olduğu için navbar'ı kapatır. Hamburger `z-index: 1001` ile modal sırasında üstte kalabilir (ama açıkken hamburger zaten klavyeden erişilebilir değil).

Nav logo `.nav-logo`:
- `display: flex; gap: 10px; z-index: 10` (modal sırasında modal'ın altında, navbar içinde üstte)
- `.nav-logo-img { width: 36px; height: 36px; border-radius: 50%; object-fit: cover }`

### 4.6 Hamburger

```css
.hamburger {
    display: none;  /* desktop'ta gizli */
    flex-direction: column;
    width: var(--touch-min); height: var(--touch-min);
    background: none; border: none;
    cursor: pointer;
    z-index: 1001;
}
.hamburger span {
    width: 24px; height: 2px; background: var(--white);
    transition: transform var(--transition), opacity var(--transition);
    border-radius: 2px;
}
.hamburger.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
.hamburger.active span:nth-child(2) { opacity: 0; }
.hamburger.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
@media (max-width: 768px) { .hamburger { display: flex; } .nav-links { display: none; } }
```

Active state: 3 bar X'e dönüşür.

### 4.7 CTA Buttons

`.btn` base class — padding, border-radius:50px (pill shape), spesifik transition. `.btn-primary` (accent bg) ve `.btn-secondary` (border outline).

`.is-closed` state: hem `.btn.is-closed` hem `.nav-cta.is-closed` hem `.committees-cta.is-closed` aynı pattern — opacity düşür, cursor not-allowed, hover hareketsiz. Etkinlik başvuruları kapalı olduğunu görsel olarak iletir.

### 4.8 Hero

```css
.hero { position: relative; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding-top: var(--nav-height); }
.hero-content { text-align: center; max-width: 800px; margin: 0 auto; padding: 0 24px; z-index: 2; }
.hero-title { font-family: var(--font-display); font-size: var(--text-h1); color: var(--white); letter-spacing: -0.02em; line-height: 1.1; margin-bottom: 24px; }
.hero-highlight { display: block; color: var(--accent-light); }
.hero-subtitle { font-size: 1.2rem; color: rgba(255, 255, 255, 0.85); max-width: 600px; margin: 0 auto 40px; line-height: 1.6; }
```

Countdown:
```css
.countdown { display: flex; justify-content: center; gap: 24px; margin-bottom: 40px; flex-wrap: wrap; }
.countdown-item { background: rgba(255, 255, 255, 0.08); border: 1px solid rgba(255, 255, 255, 0.15); border-radius: 12px; padding: 16px 20px; min-width: 80px; backdrop-filter: blur(10px); }
.countdown-number { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--white); display: block; }
.countdown-label { font-size: 0.75rem; letter-spacing: 0.15em; text-transform: uppercase; color: var(--accent-light); margin-top: 4px; }
```

`.scroll-indicator` mutlak konum bottom: 30px, animation float 2s infinite (yukarı-aşağı bob).

### 4.9 Section Generic Header

```css
.section { padding: var(--section-padding); position: relative; z-index: 1; }
.section-badge { font-size: 0.75rem; letter-spacing: 0.18em; text-transform: uppercase; color: var(--accent); font-weight: 600; margin-bottom: 16px; }
.section-title { font-family: var(--font-display); font-size: clamp(2rem, 4vw, 2.8rem); letter-spacing: -0.02em; color: var(--text-dark); margin-bottom: 16px; line-height: 1.2; }
.section-desc { font-size: 1.05rem; color: var(--text-on-light-muted); max-width: 700px; margin: 0 auto 48px; line-height: 1.7; }
```

`.section__title` (BEM çift dash) `--committees` ve `--ink` modifier'lı section'larda kullanılır. Genelde aynı font/size ama renk farklı (`--light` modifier → beyaz).

### 4.10 Komite Slide System

```css
.section--committees {
    padding: 140px 0 180px;
    background: #0A1128;  /* deep navy fixed bg, override committees fade işlemi için */
}
.committees-stack {
    display: flex; flex-direction: column;
    gap: 72px;
    align-items: center;
    padding: 64px 0 80px;
    position: relative; z-index: 3;  /* committee-stage canvas (z:1) üzerinde */
}
.committee-slide {
    width: min(640px, 100%);
    padding: 32px 36px;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    backdrop-filter: blur(16px) saturate(130%);
    color: #fff;
    cursor: pointer;
    box-shadow: 0 12px 32px rgba(5, 10, 25, 0.24);
    transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.committee-slide:hover { transform: translateY(-4px); background: rgba(255, 255, 255, 0.12); border-color: rgba(255, 255, 255, 0.32); box-shadow: 0 22px 50px rgba(5, 10, 25, 0.32); }
.committee-slide:focus-visible { border-color: #C88A3E; box-shadow: 0 0 0 3px rgba(200, 138, 62, 0.35), 0 18px 40px rgba(5, 10, 25, 0.3); }
.committee-slide.is-active { border-color: rgba(255, 255, 255, 0.42); box-shadow: 0 24px 60px rgba(5, 10, 25, 0.4); }
.committee-slide.is-zooming { transition: transform 0.6s cubic-bezier(0.34, 1.4, 0.64, 1), opacity 0.3s ease; transform: scale(1.04); opacity: 0.85; }
```

`:focus-visible` accent rengi `#C88A3E` (turuncu) — bu bilinçli, koyu zeminde mavi tonlu focus halkası fark edilmez, kontrast için turuncu seçildi.

`backdrop-filter: blur(16px) saturate(130%)` — Three.js sahnesinin arkasında kalan kısımları blur eder, frosted glass effect.

### 4.11 Card Hover/Tilt System

```css
.committee, .team-card, .subteam-card, .faq-item, .vm-card, .eventinfo-program, .eventinfo-map {
    transform-style: preserve-3d;
    transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease !important;
    will-change: transform;
}
.committee:hover, .team-card:hover, .subteam-card:hover, .vm-card:hover, .eventinfo-program:hover, .eventinfo-map:hover {
    transform: translateY(-10px) scale(1.05) !important;
    box-shadow: 0 25px 60px rgba(129, 159, 205, 0.35), 0 0 0 1px rgba(159, 182, 213, 0.4) !important;
    z-index: 2;
}
```

`!important` consolidated rule'un per-component rule'lardan üstün gelmesi için. `will-change: transform` GPU compositor hint.

#### Glow halo (pointer-tracking radial gradient)

```css
.committee, .team-card, .subteam-card, .vm-card { position: relative; }
.committee::after, .team-card::after, .subteam-card::after, .vm-card::after {
    content: ''; position: absolute; inset: -2px; border-radius: inherit;
    background: radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(129, 159, 205, 0.25), transparent 60%);
    opacity: 0; pointer-events: none;
    transition: opacity 0.3s ease;
    z-index: -1;
}
.committee:hover::after, .team-card:hover::after, .subteam-card:hover::after, .vm-card:hover::after { opacity: 1; }
```

`--mx` ve `--my` CSS custom properties JS tarafından set edilir (`main.js`:457). Mouse'un kart üzerindeki yüzde konumu — radial gradient'in merkezi mouse'u takip eder.

#### hover-tilt class

```css
.hover-tilt {
    transform: translateY(-10px) scale(1.05) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)) !important;
}
```

JS hover-tilt class'ını eklerken `--rx` ve `--ry` set eder. Sonuç: kart kalkar + ölçek büyür + 3D rotation. `:hover` selector'ın transform'unu override eder.

### 4.12 Committee Hover Hint ("Detayları gör →")

```css
.committee { cursor: pointer; }
.committee::before {
    content: 'Detayları gör →';
    position: absolute; bottom: 16px; right: 16px;
    font-size: 0.7rem; letter-spacing: 0.12em; text-transform: uppercase; font-weight: 700;
    color: var(--white);
    background: linear-gradient(135deg, var(--navy-medium), var(--accent-hover));
    padding: 7px 14px; border-radius: 50px;
    opacity: 0; transform: translateY(8px) scale(0.92);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
    z-index: 3;
    box-shadow: 0 6px 18px rgba(58, 100, 167, 0.3);
}
.committee:hover::before { opacity: 1; transform: translateY(0) scale(1); }
```

Hover'da kartın sağ-alt köşesinde pill-shaped "Detayları gör →" çıkar — kullanıcıya tıklanabilir olduğunu söyler.

### 4.13 Committee Modal

```css
.committee-modal[hidden] { display: none; }
.committee-modal {
    position: fixed; inset: 0; z-index: 1000;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 20px;
}
.committee-modal__backdrop {
    position: absolute; inset: 0;
    background: radial-gradient(ellipse at center, rgba(7, 16, 31, 0.2) 0%, rgba(7, 16, 31, 0.45) 70%, rgba(7, 16, 31, 0.7) 100%);
    opacity: 0;
    transition: opacity 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}
.committee-modal.is-open .committee-modal__backdrop { opacity: 1; }
.committee-modal__panel {
    position: relative;
    width: min(780px, 94vw); max-height: 92vh;
    background: rgba(12, 22, 42, 0.42);
    border: 1px solid rgba(159, 182, 213, 0.32);
    border-radius: 16px;
    box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6), 0 0 60px rgba(129, 159, 205, 0.18) inset;
    color: var(--white);
    overflow: hidden;
    display: flex; flex-direction: column;
    transform: scale(0.88); opacity: 0;
    backdrop-filter: blur(8px) saturate(140%);
    transition: transform 0.6s cubic-bezier(0.2, 0.9, 0.2, 1), opacity 0.4s ease;
}
.committee-modal.is-open .committee-modal__panel { transform: scale(1); opacity: 1; }
```

Modal cinematic açılır: backdrop fade-in (0.5s) + panel scale 0.88→1 + opacity 0→1 (0.6s cubic-bezier spring).

#### Modal symbol animation

`.committee-modal__symbol` modal içinde komite SVG'sinin çiziliği sahne. JS SVG'yi clone'lar ve her path'in `getTotalLength()` ile stroke-dasharray'ı ayarlar. Sonra CSS animasyonları:

```css
@keyframes symbolDraw { to { stroke-dashoffset: 0; opacity: 1; } }
@keyframes symbolSpin { 0% { transform: rotate(-120deg) scale(0.6); opacity: 0; } 60% { opacity: 1; } 100% { transform: rotate(0) scale(1); opacity: 1; } }
@keyframes symbolFloat { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
@keyframes symbolRipple { 0% { transform: scale(0.4); opacity: 0.8; } 100% { transform: scale(2.2); opacity: 0; } }
```

Symbol açılırken:
1. 1.4s'lik `symbolSpin` (rotate -120° → 0°) + 4s sonsuz `symbolFloat`.
2. Her path nth-child(N) için 0.1s + 0.15s × (N-1) staggered `symbolDraw` (stroke-dashoffset 0'a).
3. Symbol arkasında 2 kez tekrarlanan `symbolRipple` ring expansion.

Content fade-in:
- `__num` 0.8s gecikme
- `__title` 0.9s gecikme
- `__tagline` 1.0s gecikme
- `__block:nth-of-type(1)` 1.1s gecikme
- `__block:nth-of-type(2)` 1.2s gecikme
- `__block:nth-of-type(3)` 1.3s gecikme

#### Speaker highlight card

```css
.speaker-highlight {
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(129, 159, 205, 0.18);
    border-radius: 7px;
    padding: 10px 12px;
    display: flex; flex-direction: column;
    gap: 2px;
    transition: transform 0.25s ease, border-color 0.25s ease, background 0.25s ease;
}
.speaker-highlight:hover { border-color: var(--accent); background: rgba(129, 159, 205, 0.08); transform: translateY(-2px); }
.speaker-highlight__name { font-family: var(--font-display); font-size: 0.9rem; font-weight: 700; color: var(--white); }
.speaker-highlight__inst { font-size: 0.72rem; color: var(--accent); font-weight: 600; }
.speaker-highlight__focus { font-size: 0.72rem; color: rgba(255, 255, 255, 0.7); margin-top: 2px; }
```

### 4.14 Mobile Breakpoints

Üç ana breakpoint:

- **`@media (max-width: 1024px)`**: Tablet — bazı grid'leri 2 sütuna düşür, padding'leri azalt.
- **`@media (max-width: 768px)`**: Mobil — hamburger açılır, nav-links gizlenir, grid'ler tek sütuna iner, font boyutları küçülür.
- **`@media (max-width: 480px)`**: Küçük mobil — section padding 44px, daha tight spacing.

Son override:
```css
@media (max-width: 768px) {
    .section { padding: 60px 0; }
    .vm-grid, .stats-grid, .team-grid, .subteam-grid, .sponsors-grid, .contact-grid {
        grid-template-columns: 1fr !important;
    }
}
```

`!important` yetkili override — per-component media query'leri yenebilmek için.

### 4.15 Hover-only effect kapatma

```css
@media (hover: none) {
    .vm-card:hover, .stat-item:hover, .team-card:hover, .subteam-card:hover, .speaker-highlight:hover, .committee:hover, .btn-primary:hover, .btn-secondary:hover, .nav-cta:hover {
        transform: none;
        box-shadow: none;
    }
}
```

`@media (hover: none)` — gerçek touch-only cihazlarda (telefon, tablet stylus'suz). Hover state'leri "stuck" görünmesin diye nötr.

### 4.16 Preloader

```css
#preloader {
    position: fixed; inset: 0;
    background: var(--navy-medium);
    z-index: 9999;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    transition: opacity 0.6s ease;
}
#preloader.is-hidden { opacity: 0; pointer-events: none; }
body.is-loading { overflow: hidden; }
```

Z-index 9999 — her şeyin üstü. Modal'lar da kalır altında (modal:1000).

`#preloader.is-hidden` opacity:0 ile fade out. 600ms sonra `display: none` ile DOM'dan kaldırılabilir (ama main.js bunu yapmıyor, sadece pointer-events:none ile invisible bırakıyor — küçük memory tradeoff).

### 4.17 Reduced motion handling

`prefers-reduced-motion: reduce` query ile:

```css
@media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
        scroll-behavior: auto !important;
    }
}
```

CSS animasyonları neredeyse anında biter. JavaScript animasyonları (Three.js, GSAP) ise CSS query'sini ayrıca kontrol ediyor:
- `js/three-scene.js`:9 `const prefersReducedMotion = false` — TASARIM KARARI olarak override edilmiş. Site animasyon-merkezli, donmuş bir görüntüye düşürmek mantıklı değil.
- `js/carousel.js`:55 `const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches` — Lenis smooth scroll devre dışı bırakılır.

### 4.18 z-index katmanları

```
-1     : #bg-canvas (Three.js arka plan)
1      : #committees-stage (komite canvas)
2      : .section z-index, .hero-content
3      : .committees-stack (komite kartları stage üstünde)
10     : .nav-logo (modal sırasında modal altında, nav içinde üstte)
1000   : .navbar, .committee-modal, .mobile-menu, .lightbox
1001   : .hamburger
9999   : #preloader
```

---

## 5. js/main.js Anatomisi

`main.js` regular `<script>` (module değil). Top-level IIFE'lerle modüler olarak organize edilmiş.

### 5.1 Preloader IIFE (satır 1-44)

```js
(function preloader() {
    const fill = document.getElementById('preloaderFill');
    const pre = document.getElementById('preloader');
    if (!pre) return;
    const imgs = Array.from(document.images);
    let loaded = 0;
    const total = Math.max(imgs.length, 1);
    function update() {
        const p = Math.round((loaded / total) * 100);
        if (fill) fill.style.width = p + '%';
    }
    imgs.forEach(img => {
        if (img.complete) loaded++;
        else {
            img.addEventListener('load', () => { loaded++; update(); }, { once: true });
            img.addEventListener('error', () => { loaded++; update(); }, { once: true });
        }
    });
    update();
    function finish() {
        if (pre.classList.contains('is-hidden')) return;
        if (fill) fill.style.width = '100%';
        setTimeout(() => {
            pre.classList.add('is-hidden');
            document.body.classList.remove('is-loading');
            window.dispatchEvent(new Event('preloader:done'));
        }, 350);
    }
    if (document.readyState === 'complete') finish();
    else window.addEventListener('load', finish);
    setTimeout(finish, 6000);  // hard fallback
})();
```

Önemli özellikler:
- Idempotent: `is-hidden` set edildiyse yeniden çalıştırılmaz.
- 350ms tampon: progress bar dolduktan sonra göz seviyesinde tutar.
- 6 saniye fallback: bir image hang olduğunda kullanıcıyı sınırsız bekletmez.

### 5.2 Navbar Scroll Effect (satır 46-57)

```js
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});
```

Eşik 50px. Throttle yok — scroll event her seferinde class kontrol ediyor, classList.add idempotent olduğu için sorun değil.

### 5.3 Mobile Menu (satır 60-95)

`openNav()` / `closeNav()` — hamburger ve mobile menu için class toggle. Body `menu-open` ile scroll lock.

Outside tap algılaması:
```js
mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeNav();
});
```

Mobile menu drawer tam genişlikte olduğu için `.mobile-links` listesinin dışındaki arka plana click'i `e.target === mobileMenu` ile yakalanır.

### 5.4 Smooth Scroll (satır 97-110)

```js
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        e.preventDefault();
        const target = document.querySelector(targetId);
        if (target) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({ top: targetPosition, behavior: 'smooth' });
        }
    });
});
```

Tüm anchor link'leri override eder. Navbar yüksekliği kadar offset bırakır ki section header'ı navbar altında kalmasın.

Native `behavior: 'smooth'` kullanır — CSS `scroll-behavior: smooth` ile tutarlı.

### 5.5 Active Nav Link (satır 112-131)

Scroll event'inde tüm section'ların `offsetTop - 100` değerini kontrol eder, hangi section'da olduğunu bulur, ilgili nav-link'e `.active` ekler.

### 5.6 Countdown (satır 133-157)

```js
const targetDate = new Date('2026-05-09T09:00:00').getTime();
function updateCountdown() {
    const distance = targetDate - Date.now();
    if (distance < 0) {
        document.getElementById('countdown').innerHTML = '<p class="countdown-ended">Etkinlik başladı!</p>';
        return;
    }
    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);
    document.getElementById('days').textContent = String(days).padStart(2, '0');
    // ...
}
updateCountdown();
setInterval(updateCountdown, 1000);
```

Target tarihi hardcoded. Etkinlik geçtikten sonra (2026-05-13'te bugün), `distance < 0` durumu tetiklenir, "Etkinlik başladı!" mesajı gösterilir.

`setInterval` 1 saniye — performans olarak çok hafif, sayfa çekirdek loop'unun dışında.

### 5.7 FAQ Accordion (satır 159-176)

Tek-açık accordion. Tıklanan item zaten açıksa kapatır, değilse diğerlerini kapatıp bunu açar.

### 5.8 Scroll Reveal (satır 178-190)

```js
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
```

Element viewport'a girdiğinde `.revealed` ekler, sonra observe'u bırakır (one-shot). CSS `.reveal` initial state: `opacity: 0; transform: translateY(20px)`. `.revealed`: `opacity: 1; transform: translateY(0)`.

### 5.9 Stat Counter (satır 192-214)

```js
const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            const duration = 2000;
            let current = 0;
            const step = target / (duration / 16);
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    el.textContent = target;
                    clearInterval(counter);
                } else el.textContent = Math.floor(current);
            }, 16);
            statObserver.unobserve(el);
        }
    });
}, { threshold: 0.5 });
```

`data-target` değerine kadar 16ms tick'le artış. 16ms ~60fps gibi düşünülmüş. 2 saniye toplam.

Not: `setInterval` ile yapıldı, `requestAnimationFrame` daha smooth olurdu ama bu kadar uzun süre için pratikte fark etmez.

### 5.10 Committee Modal (satır 216-441)

`COMMITTEE_DATA` objesi 7 komite için tam detayı içerir (yukarıda Bölüm 3.11'de detaylı).

`openCommittee(key, sourceCard)` — yukarıda anlattığım SVG clone + dasharray + content fill + class toggle akışı.

`closeCommittee()` — reverse + 400ms cleanup.

Modal kapatma yolları:
1. `.committee-modal__close` butonu tıklama
2. Backdrop click (data-close)
3. Escape tuşu
4. Mobile: swipe-down

Swipe-down implementasyonu:
- `touchstart` → `touchStartY`, `touchStartTime`, `dragging=true`, `swipePanel.style.transition='none'` (manual drag için).
- `touchmove` → `delta = currentY - startY`, `delta > 0` ise `translateY(delta)`. Aşağı drag, yukarı yok say.
- `touchend` → `velocity = delta / elapsed`. Eşik (delta > 80px veya velocity > 0.5) aşıldıysa `closeCommittee()`, yoksa transform reset.

`window.openCommitteeModal = openCommittee` — global expose. Carousel.js bunu çağırır.

### 5.11 Card 3D Tilt + Tap Burst (satır 443-488)

Pointer detection:
```js
const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
```

Mouse'lu cihazlarda (`pointer: fine`):
- `mousemove`: kart üzerindeki x/y pozisyonundan rotation X/Y hesapla, CSS custom properties set et, `card-hover` event dispatch et (Three.js orb için).
- `mouseleave`: rotation properties sil, hover-tilt class sil.
- `mouseenter`: `card-enter` event dispatch et (Three.js burst için).

Touch cihazlarda:
- `touchstart`: `card-enter` event dispatch et (burst spark efekti).

### 5.12 Program Tabs (satır 490-514)

`[data-tabs]` root içindeki tab'ları yöneten generic mantık. Tek root, ileride başka tab grupları eklenebilir.

### 5.13 Image Lightbox (satır 518-553)

`.zoomable` IMG'lerine document-level click delegation. Click → open, close → src=''.

### 5.14 Scroll Progress Bar (satır 555-569)

`requestAnimationFrame` throttle ile scroll yüzdesini hesaplar, `#scrollProgressFill` width'ini günceller.

---

## 6. Three.js Mimarisi

### 6.1 İki Ayrı Sahne — Neden?

Projede iki AYRI Three.js renderer çalışır:

1. **`#bg-canvas`** → `js/three-scene.js` — sayfa boyunca arka planda görünür dekoratif sahne. 7 mode (atom/dna/flow/neural/wave/timeline/constellation) section'a göre fade ile geçer.

2. **`#committees-stage`** → `js/carousel.js` + `js/scene/*` — sadece komiteler section'ında görünür. 7 imza sahnesi, GTA-style kamera arc'ları, bloom postprocessing, split-mirror system.

Neden iki ayrı? — Komite sahnesi çok daha karmaşık (bloom, split-mirror, intensity damping), CPU/GPU intensive. Sayfanın başka section'larında çalışsaydı performans çöker. Body class `committees-visible` ile geçişler yönetilir.

### 6.2 `js/three-scene.js` — Arka plan beyin sahnesi

Tek IIFE değil, top-level module. Renderer setup'tan animasyon loop'una kadar her şey aynı dosyada.

#### Setup (satır 1-49)

```js
import * as THREE from 'three';
const canvas = document.getElementById('bg-canvas');
if (!canvas) throw new Error('bg-canvas not found');

const prefersReducedMotion = false;  // Bilinçli override
const isMobile = window.innerWidth < 768;

const PALETTE = {
    dark: { particle: 0x9FB6D5, accent: 0x819FCD, lines: 0x5381BE, fog: 0x2C56A5 },
    light: { particle: 0x4472B6, accent: 0x3A64A7, lines: 0x5381BE, fog: 0xF3F7FC }
};

const SECTION_MODES = {
    hero: 'atom',
    theme: 'dna',
    vision: 'flow',
    about: 'neural',
    workshop: 'wave',
    program: 'timeline',
    team: 'constellation',
    faq: 'flow',
    sponsors: 'neural',
    eventinfo: 'wave',
    past: 'constellation',
    contact: 'constellation'
};

const DARK_SECTIONS = new Set(['hero', 'theme', 'vision', 'workshop', 'program', 'team', 'about', 'faq', 'sponsors', 'eventinfo', 'past', 'contact']);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.set(0, 0, 60);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: !isMobile });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 0);
```

Not: `prefersReducedMotion = false` bilinçli. Yorum şöyle: "Site is animation-first... Honoring prefers-reduced-motion would freeze the entire scene to a still image, which defeats the design intent."

`alpha: true` — transparent canvas, body background görünür.
`antialias: !isMobile` — mobilde devre dışı (perf).
`setPixelRatio(min(devicePixelRatio, mobile?1.5:2))` — retina full DPR mobilde fazla, 1.5 cap.

`DARK_SECTIONS` neredeyse her section — sadece komiteler hariç. Light theme komite section'ında kullanılırdı ama "blashbang" flash sorunu yaratmış, kullanıcı tüm site'yi dark'a sabitlemiş.

#### Katmanlar

##### Particle Field (satır 51-74)

500 (desktop) / 250 (mobile) parçacık. BufferGeometry + Float32Array. Each particle has position + velocity, brownian-like motion in animate loop. AdditiveBlending + depthWrite:false (overlay/glow effect).

##### Deep Starfield (satır 76-96)

900 / 400 uzak yıldız. Z konum -100 ile -400 arası — derinlik hissi.

##### Ambient Orbiting Polyhedrons (satır 98-139)

12 / 6 wireframe shape (Tetrahedron, Octahedron, Icosahedron, Torus, Box). 3 orbital band: 22, 40, 60 unit radius. Keplerian feel: inner orbits spin faster (0.28 → 0.15 → 0.08 angular speed).

Her shape:
- Random tilt X/Z (eccentricity feel)
- Random rotation speed (x, y, z)
- Float offset (sin-wave bobbing)
- Random direction (25% chance retrograde)

##### Comets (satır 141-182)

2 line-based comet trail (20 nokta). Periyodik launch: 3-7 saniye aralıkla bir tane fire. Trail effect: head ileri gider, eski nokta o eski pozisyonu alır (rolling array).

Mobile'da comet'ler launch edilmez (`!isMobile && nextCometTime <= 0`).

##### Mouse-Follower Glow Orb (satır 184-206)

```js
const orbGroup = new THREE.Group();
const orbCore = new THREE.Mesh(new SphereGeometry(0.6, 24, 24), new MeshBasicMaterial({ color: 0x9FB6D5, transparent: true, opacity: 0.9 }));
const orbHalo = new THREE.Mesh(new SphereGeometry(1.5, 24, 24), new MeshBasicMaterial({ color: 0x819FCD, transparent: true, opacity: 0.55, blending: AdditiveBlending, depthWrite: false }));
orbGroup.position.set(0, 0, 10);
orbGroup.visible = !isMobile;  // Touch'ta mouse follower mantıksız
```

Animate loop'ta: mouse pozisyonunu world space'e unproject et, orb'u o noktaya lerp ile takip ettir. Card hover'da scale 1 → 2.2, opacity artar.

##### Burst Particles (satır 208-232)

4 burst pool (object pool pattern). Her burst 10 parçacık. card-enter event'inde free olan birini bul, fire et.

```js
function fireBurst(screenX, screenY) {
    const free = bursts.find(b => !b.userData.active);
    if (!free) return;
    // unproject screen pos → world pos at fixed z plane
    const world = camera.position.clone().add(dir.multiplyScalar(dist));
    for (let i = 0; i < free.userData.n; i++) {
        // start at world pos, random angle/speed
    }
    free.userData.active = true;
    free.userData.life = 0;
    free.userData.maxLife = 0.8 + Math.random() * 0.3;
}
```

Animate loop'ta: aktif burst'ler için position += velocity * dt, velocity *= 0.96 (drag), opacity life'a göre düşer.

##### Mode Groups (satır 269-510)

7 mod, her biri ayrı `THREE.Group`:

- **atom** (`buildAtom`): 5 torus ring + her ring'in üzerinde orbiting electron sphere + outer ring + 25-particle cloud + nucleus. Animasyonu: ring rotation Y/X, electron orbit, nucleus scale pulse, cloud rotation.

- **flow** (`buildFlow`): 14 unit Icosahedron wireframe (subdivisions 2). Animate'te: vertex positions sinüs dalgasıyla deforme olur (organik flow).

- **wave** (`buildWave`): 60x60 PlaneGeometry 40x40 segments, wireframe. Rotation -π/2.5 (eğik düzlem). Animate'te: her vertex Z konumu `sin(x*0.3 + t*1.5) + cos(y*0.3 + t)`.

- **timeline** (`buildTimeline`): 12 node sin-cos curved path, line birleştirici. Animate'te: nodlar baseY etrafında sin oscillation, pulse scale, line points güncellenir.

- **constellation** (`buildConstellation`): 30 random star + close-distance pairwise line segments. Animate'te: yıldız opacity pulse, group rotation.

- **dna** (`buildDNA`): Double helix, 4 turn, 80 segment. İki strand line + her 4 segment'te bir rung line + node sphere. Animate'te: group rotation, node scale pulse.

- **neural** (`buildNeural`): 4-6-6-3 layer'lı feedforward network, full connection. Animate'te: nodlar phase'e göre opacity pulse, connection'lar `sin(t*2.5 + phase)` ile sinyal "akar".

Build pattern her mod için aynı: bir `THREE.Group()` oluştur, içine geometry+material+mesh ekle, group'u `modes.<name>` olarak sakla, `scene.add(group)`. Initially `visible = false` (sadece aktif mod görünür).

#### Section Observer (satır 528-555)

```js
const sectionObserver = new IntersectionObserver((entries) => {
    let best = null;
    let bestRatio = 0;
    entries.forEach(e => {
        if (e.intersectionRatio > bestRatio) {
            bestRatio = e.intersectionRatio;
            best = e;
        }
    });
    if (best && best.target.id) {
        const id = best.target.id;
        const nextMode = SECTION_MODES[id] || 'flow';
        if (nextMode !== targetMode) {
            targetMode = nextMode;
            modeFade = 0;
            modes[targetMode].visible = true;
        }
        targetTheme = DARK_SECTIONS.has(id) ? 'dark' : 'light';
    }
}, { threshold: [0.25, 0.5, 0.75] });
```

En çok intersection oranı olan section'ı seçer. SECTION_MODES'daki mode'a transition başlar. modeFade 0'dan 1'e gider, eski mode opacity 1→0, yeni mode 0→1.

#### Mouse / Gyro Parallax (satır 557-588)

Desktop: `mousemove` → `mouse.tx/ty` set. Animate loop'ta `mouse.x/y` lerp ile takip eder, camera x/y `mouse.x*3, -mouse.y*3` olur. Hafif parallax.

Mobile: `DeviceOrientationEvent`. iOS 13+ permission gerekli — touchend'de silent request. gamma (left-right tilt) ve beta (front-back tilt -35° baseline) normalize edilir.

#### Resize (satır 590-599)

150ms debounce. Camera aspect güncelle, renderer resize.

#### Animate Loop (satır 601-871)

```js
function animate() {
    if (!running) { requestAnimationFrame(animate); return; }
    const dt = Math.min(clock.getDelta(), 0.05);
    const t = clock.elapsedTime;
    
    // mouse lerp + camera position
    mouse.x = lerp(mouse.x, mouse.tx, 0.05);
    camera.position.x = mouse.x * 3;
    camera.lookAt(0, 0, 0);
    
    // orb update (desktop only)
    // bursts update
    // theme color mix (dark/light blend)
    // particle field motion
    // far field rotation
    // ambient shapes orbit + rotation
    // comet launch + trail update
    // mode fade crossover
    // animateMode(modes.atom, 'atom', t); ... her mod için
    
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}
```

`document.visibilitychange` ile tab gizliyse render etmiyor (battery save).

`Math.min(clock.getDelta(), 0.05)` — tab geri geldiğinde delta büyük olmasın (animation jump önle).

Mode fade strategy: `modeFade` 0→1, eski mode'un her material'inin opacity'sini `_baseOpacity * (1-modeFade)`, yeni mode'unkini `_baseOpacity * modeFade` ile çarp. `_baseOpacity` her material'a ilk başta cache'lenir.

#### animateMode() (satır 762-870)

Switch-case her mod için kendi animasyonu:

- **atom**: group rotation Y/X, ring electron orbit, outer ring rotation, nucleus scale pulse, cloud rotation.
- **flow**: vertex displacement (sinusoidal swell).
- **wave**: Z displacement field.
- **timeline**: node Y oscillation, scale pulse, line update.
- **constellation**: stars opacity pulse.
- **dna**: group rotation, node scale pulse.
- **neural**: node scale + opacity pulse, connection signal (positive sine = bright).

#### Performans notları

- Her frame `new Color()` allocation `targetTheme` blending'inde yapılır — küçük allocation, ihmal edilebilir.
- Particle positions her frame array'de update edilir, `attributes.position.needsUpdate = true` ile GPU'ya yeniden yüklenir.
- Mod animasyonları sadece aktif modun group'unda çalışır mı? Hayır — `animateMode` her mod için çağrılıyor, `if (!group.visible) return` ile early-out. Yine de switch dahil tüm modlar her frame için dispatch ediliyor.

### 6.3 `js/carousel.js` — Komite slide picker

#### Mobile path (satır 28-49)

```js
const isMobile = window.matchMedia('(max-width: 768px)').matches;
if (isMobile) {
    slides.forEach((slide) => {
        slide.setAttribute('role', 'button');
        slide.setAttribute('tabindex', '0');
        slide.addEventListener('click', (e) => {
            if (e.target.closest('a, button')) return;
            const num = slide.querySelector('.committee__num')?.textContent?.trim();
            if (num && typeof window.openCommitteeModal === 'function') {
                window.openCommitteeModal(num, slide);
            }
        });
        slide.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                slide.click();
            }
        });
    });
    return;
}
```

Mobil cihazlarda **Three.js sahnesi tamamen atlanır**. Slide'lar dikey kart listesi olarak görünür, tap → `openCommitteeModal` (main.js'deki). Bu performans için kritik (mobile GPU bloom postprocess'i kaldıramaz).

#### Desktop path

```js
const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
const stage = initStage(canvas, { palette: PALETTE, dpr });

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis = null;
if (window.Lenis && !reduced) {
    lenis = new window.Lenis({
        duration: 1.1,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
    });
    function lenisRaf(time) {
        lenis.raf(time);
        requestAnimationFrame(lenisRaf);
    }
    requestAnimationFrame(lenisRaf);
}
```

Stage init + Lenis smooth scroll. Lenis sadece prefers-reduced-motion değilse.

#### Scroll-based active detection

```js
function updateActiveFromScroll() {
    const vh = window.innerHeight;
    const vc = vh * 0.5;
    let best = null;
    let bestDist = Infinity;
    let anyInView = false;
    for (const s of slides) {
        const r = s.getBoundingClientRect();
        if (r.bottom < 0 || r.top > vh) continue;
        anyInView = true;
        const center = r.top + r.height * 0.5;
        const dist = Math.abs(center - vc);
        if (dist < bestDist) { bestDist = dist; best = s; }
    }
    inView = anyInView;
    if (!modalOpen) document.body.classList.toggle('committees-visible', anyInView);
    
    // Overview mode handling
    if (anyInView) {
        const firstR = slides[0].getBoundingClientRect();
        const lastR = slides[slides.length - 1].getBoundingClientRect();
        const beforeFirst = firstR.top > vc;
        const afterLast = lastR.bottom < vc;
        if (beforeFirst || afterLast) setActiveSlide(null);
        else if (best) setActiveSlide(best);
    }
    if ((anyInView || modalOpen) && rafId === null) loop(performance.now());
}
```

Viewport center'a en yakın slide aktif olur. İlk slide'dan önce veya son slide'dan sonra → "overview mode" (kamera HOME_TARGET'a, hiçbir imza aktif değil).

#### Slide click → modal

```js
function onCardActivate(slide) {
    const sig = slide.getAttribute('data-signature');
    const num = slide.querySelector('.committee__num')?.textContent?.trim();
    if (!sig || !num) return;
    slide.classList.add('is-zooming');
    stage.zoomTo(sig);
    setTimeout(() => {
        if (typeof window.openCommitteeModal === 'function') {
            window.openCommitteeModal(num, slide);
        }
        slide.classList.remove('is-zooming');
    }, 720);
}
```

Click → CSS zoom başlar (`.is-zooming`) → Three.js stage zoom yapar → 720ms sonra modal açılır. Total sequence ~1.5s cinematic.

#### Modal lifecycle events

```js
window.addEventListener('committee-modal:opened', (e) => {
    const sig = e.detail?.sig;
    if (sig) stage.zoomTo(sig);
    stage.isolate(true);
    modalOpen = true;
    document.body.classList.add('committees-visible');
    if (rafId === null) loop(performance.now());
    lenis?.stop();
});

window.addEventListener('committee-modal:closed', () => {
    stage.isolate(false);
    stage.zoomOut();
    modalOpen = false;
    if (!inView) document.body.classList.remove('committees-visible');
    lenis?.start();
});
```

Modal açıldığında: stage zoom + isolate (diğer imzalar fade), Lenis stop (modal içeriği native scroll edebilsin).

Modal kapandığında: stage zoom out + isolate off, Lenis start.

#### Render loop

```js
function loop(t) {
    stage.tick(t);
    if ((inView || modalOpen) && document.visibilityState === 'visible') {
        rafId = requestAnimationFrame(loop);
    } else rafId = null;
}
```

Sadece view'da veya modal açıkken çalışır. Dışarı çıkıldığında durur (battery save).

### 6.4 `js/scene/stage.js` — Stage kurucu

`initStage(canvas, options)` — komite stage'inin tüm setup'ı.

#### Renderer setup

```js
const scene = new Scene();
scene.background = new Color(0x0A1128);  // deep navy
const camera = new PerspectiveCamera(42, 1, 0.1, 100);
camera.position.copy(HOME_TARGET.position);
camera.lookAt(HOME_TARGET.lookAt);

const renderer = new WebGLRenderer({
    canvas, antialias: true, alpha: true,
    powerPreference: 'high-performance',
});
renderer.setPixelRatio(dpr);
renderer.setClearColor(new Color(0x000000), 0);
```

`alpha: true` çünkü body background'un üzerine ekler. `powerPreference: 'high-performance'` GPU önceliğini yüksek tutar (laptop integrated GPU yerine discrete GPU seçer).

#### Signature palettes

7 imza için ayrı renk paleti — her komite görsel olarak ayırt edilebilir:

```js
const SIGNATURE_PALETTES = {
    quantum:  { accent: '#7B8FE8', mist: '#C4D1F2', navy500: '#3A64A7', navy400: '#4472B6', navy300: '#5381BE' },
    neuro:    { accent: '#FF7BAE', mist: '#FFC2D6', navy500: '#B54873', navy400: '#C25B86', navy300: '#D07299' },
    'ai-nlp': { accent: '#33E1C9', mist: '#B9F4EB', navy500: '#2E8E80', navy400: '#3BA697', navy300: '#4FBEAE' },
    aero:     { accent: '#C8E6FF', mist: '#E9F4FF', navy500: '#5A93C4', navy400: '#6AA5D0', navy300: '#7FB6DB' },
    molbio:   { accent: '#6EE58C', mist: '#C2F3CE', navy500: '#3C9454', navy400: '#49A863', navy300: '#58B974' },
    forensic: { accent: '#FFA65C', mist: '#FFD7B5', navy500: '#C56A3A', navy400: '#D47D48', navy300: '#E28F58' },
    smart:    { accent: '#FFD23F', mist: '#FFEA9E', navy500: '#C49522', navy400: '#D6A630', navy300: '#E5B843' },
};
```

quantum: mavi-pembe. neuro: pembe. ai-nlp: turkuaz. aero: gök mavisi. molbio: yeşil. forensic: turuncu. smart: sarı.

#### Signature build loop

```js
const handles = {};
const splitProgress = {};
signatureOrder.forEach((sig) => {
    const anchor = anchors[sig];
    handles[sig] = signatures[sig]({ palette: SIGNATURE_PALETTES[sig], anchor });
    rootGroup.add(handles[sig].group);
    
    const mirror = handles[sig].group.clone(true);
    mirror.traverse((child) => {
        if (child.material) {
            child.material = Array.isArray(child.material)
                ? child.material.map((m) => m.clone())
                : child.material.clone();
        }
    });
    mirror.scale.x = -1;
    handles[sig].mirror = mirror;
    rootGroup.add(mirror);
    
    splitProgress[sig] = { v: 0 };
    applySplit(sig);
});
```

Her signature için:
- Group'u oluştur (signatures[sig](...) — örn `quantum({palette, anchor})`).
- Anchor'a göre konum.
- **Mirror twin**: deep clone, materyal'leri INDEPENDENT (clone'lanmış) — opacity'leri ayrı kontrol edilebilir. `scale.x = -1` ile X ekseninde aynalı.
- splitProgress: 0 = merged (her iki yarı anchor'da), 1 = fully split (orijinal anchor.x - SPLIT_DISTANCE, mirror anchor.x + SPLIT_DISTANCE).

`SPLIT_DISTANCE = 5.0`. Kamera bir imzayı framing alırken anchor + (0, 0, +9.5) konumunda; halve'ler anchor.x ± 5 = yan yana iki şekil olarak görünür (orta yer kart için boş kalır).

#### Postprocessing

```js
const composer = new EffectComposer(renderer);
composer.setPixelRatio(dpr);
composer.addPass(new RenderPass(scene, camera));
const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.75, 0.55, 0.12);
composer.addPass(bloom);
composer.addPass(new OutputPass());
```

UnrealBloomPass parametreleri:
- strength: 0.75 (orta yoğunluk)
- radius: 0.55 (orta)
- threshold: 0.12 (düşük — pek çok ışık alanı bloom alır)

Bloom accent particle/line'ları glow'lu yapar.

#### Camera tween (`tweenCameraTo`)

GSAP tabanlı. İki mod:

1. **Direct ease**: pozisyon farkı küçük veya Z değişimi büyükse `gsap.to(camPos, {pos, ease: 'power2.inOut'})`.

2. **GTA arc**: lateral move büyükse ve Z farkı küçükse (yakındaki imzalar arası geçiş), önce Z'yi pullback (4-10 unit geri çek), sonra hedef Z'ye in. Bu cinematic "GTA mission select" feel veriyor.

```js
const useGtaArc = zDiff < 3 && lateral > 2;
if (!useGtaArc) {
    gsap.to(camPos, { x: pos.x, y: pos.y, z: pos.z, duration, ease: 'power2.inOut' });
    return;
}
const pullback = Math.min(10, Math.max(4, lateral * 0.6));
const midZ = pos.z + pullback;
const tl = gsap.timeline();
tl.to(camPos, { x: pos.x, y: pos.y, z: midZ, duration: duration * 0.55, ease: 'power2.inOut' }, 0);
tl.to(camPos, { z: pos.z, duration: duration * 0.5, ease: 'power2.out' }, duration * 0.55);
tl.to(camLook, { x: look.x, y: look.y, z: look.z, duration: duration * 0.95, ease: 'power2.inOut' }, 0);
```

#### Intensity damping

Her signature'ın bir intensity değeri var (0-1). Active/zoomed/isolated durumunda 1, değilse 0.35 (default fade). Her frame:

```js
let target;
if (isolated) target = (zoomedSig === sig || activeSig === sig) ? 1 : 0;
else if (zoomedSig === sig) target = 1;
else if (zoomedSig) target = 0;
else if (activeSig === sig) target = 1;
else target = 0.35;
const speed = isolated ? 7 : 5;
intensity[sig] += (target - intensity[sig]) * Math.min(1, dt * speed);
handles[sig].update(elapsed, dt, intensity[sig]);
syncMirror(sig);
```

`isolated` true iken (modal açık) sadece aktif sig 1, diğerleri 0 (modal'da diğer imzalar görünmesin).

`syncMirror()`: original group'un rotation'larını mirror'a kopyala, material opacity'lerini `splitProgress` ile çarp (mirror split olurken fade-in).

#### setActive/zoomTo/zoomOut/isolate API

```js
function setActive(sig) {
    if (sig === activeSig) return;
    const prev = activeSig;
    activeSig = sig;
    if (!zoomedSig) applyTarget();  // camera move (zoom mode'unda override etme)
    if (prev) animateSplit(prev, 0, { duration: 0.5, ease: 'power2.in' });  // prev merge
    signatureOrder.forEach((s) => {
        if (s === sig || s === prev) return;
        if (splitProgress[s].v > 0.001) animateSplit(s, 0, { duration: 0.25, ease: 'power2.in' });  // force-merge stale
    });
    if (sig) animateSplit(sig, 1, { delay: 0.8, duration: 1.4, ease: 'power2.out' });  // new split
}
```

Active değişimi:
1. Eski split'i hemen geri al (0.5s).
2. Geçici stale split'leri zorla geri al (kullanıcı hızlı scroll yaptıysa).
3. Yeni sig için 0.8s delay sonra split'i tetikle (kamera arrival için zaman tanı).

```js
function zoomTo(sig) {
    zoomedSig = sig;
    applyTarget();
    // Halves stay SPLIT — symmetric on modal sides
}
```

Modal açıldığında. Kamera zoomTargets[sig]'e gider. Split halves modal yan taraflarında kalır.

```js
function zoomOut() {
    zoomedSig = null;
    applyTarget();
}
```

Modal kapandığında. Kamera activeSig'in cameraTargets'ına (veya HOME) döner.

```js
function isolate(on) { isolated = !!on; }
```

Modal sırasında izole mod (diğer imzalar tamamen kaybolur).

#### Tick (render loop)

```js
function tick(timeMs) {
    const elapsed = timeMs / 1000;
    const dt = Math.min(0.05, (timeMs - prevTime) / 1000);
    prevTime = timeMs;
    
    signatureOrder.forEach((sig) => {
        // intensity damping
        // handles[sig].update(elapsed, dt, intensity[sig])
        // syncMirror(sig)
    });
    rootGroup.rotation.y = 0.04 * Math.sin(elapsed * 0.12);  // hafif idle drift
    
    if (!gsap) {  // fallback: manual damp (GSAP yoksa)
        const lambda = zoomedSig ? 4.0 : 2.4;
        dampVec(camPos, targetPos, lambda, dt);
        dampVec(camLook, targetLook, lambda, dt);
    }
    camera.position.copy(camPos);
    camera.lookAt(camLook);
    composer.render();  // bloom composer, raw renderer.render yerine
}
```

### 6.5 `js/scene/anchors.js` — Imza konumları

```js
import { Vector3 } from 'three';

export const anchors = {
    quantum:  new Vector3( 0.0,  0.0,  0),
    neuro:    new Vector3( 8.5,  3.6,  0),
    'ai-nlp': new Vector3( 2.2,  9.2,  0),
    aero:     new Vector3(-7.4,  5.1,  0),
    molbio:   new Vector3(-9.8, -4.5,  0),
    forensic: new Vector3(-2.1, -10.4, 0),
    smart:    new Vector3( 9.6, -5.8,  0),
};
```

Quantum merkez (0,0,0). Diğer 6 imza non-uniform açılarda etrafına dağılır. Her çiftin distance'ı ≥ ~8 unit — bir imzaya kamera focus olduğunda komşu imzalar frame dışında kalır.

### 6.6 `js/scene/camera.js`

```js
export const SPLIT_DISTANCE = 5.0;

function buildTargets(distance) {
    const out = {};
    for (const sig of Object.keys(anchors)) {
        const p = anchors[sig];
        out[sig] = {
            position: new Vector3(p.x, p.y, p.z + distance),
            lookAt: new Vector3(p.x, p.y, p.z),
        };
    }
    return out;
}

export const HOME_TARGET = {
    position: new Vector3(0, 0.3, 32),
    lookAt: new Vector3(0, 0, 0),
};

export const cameraTargets = buildTargets(9.5);
export const zoomTargets  = buildTargets(9.5);

export function dampVec(current, target, lambda, dt) {
    current.x = MathUtils.damp(current.x, target.x, lambda, dt);
    current.y = MathUtils.damp(current.y, target.y, lambda, dt);
    current.z = MathUtils.damp(current.z, target.z, lambda, dt);
}
```

HOME_TARGET: kamera (0, 0.3, 32) — orta-üst hafif, derinlikten tüm imzaları görür. Sayfa açıldığında veya overview mode'unda.

cameraTargets ve zoomTargets şu an aynı (9.5 unit distance) — modal'a girince split halves modal yan taraflarında kalması için extra yakınlaşma yapılmıyor.

`dampVec`: GSAP yoksa fallback. Three.js MathUtils.damp ile critically damped lerp.

### 6.7 `js/scene/dispose.js`

```js
export function disposeGroup(root) {
    root.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        const m = child.material;
        if (Array.isArray(m)) m.forEach(disposeMaterial);
        else if (m) disposeMaterial(m);
    });
}

function disposeMaterial(material) {
    for (const key of Object.keys(material)) {
        const value = material[key];
        if (value && typeof value === 'object' && value.isTexture) value.dispose();
    }
    material.dispose();
}
```

Memory cleanup: bir group dispose edilirken alt'taki tüm geometry+material+texture'ları temizle. Şu an `stage.destroy()` çağrılmıyor (sayfa unload'unda gerek yok), ama Class API bırakılmış.

### 6.8 `js/scene/signatures/index.js`

```js
export const signatures = { quantum, neuro, 'ai-nlp': aiNlp, aero, molbio, forensic, smart };
export const signatureOrder = ['quantum', 'neuro', 'ai-nlp', 'aero', 'molbio', 'forensic', 'smart'];
```

7 imza factory function aggregate'i. signatureOrder array sıra önemli (slide HTML sırasıyla eşleşmeli).

### 6.9 Signature Factories — Genel Pattern

Her signature `({ palette, anchor })` alır, `{ group: THREE.Group, update(elapsed, dt, intensity) }` döner.

Pattern:
```js
export function <name>({ palette, anchor }) {
    const group = new Group();
    group.position.copy(anchor);  // anchor'a yerleş
    
    // ... geometries / materials / meshes ekle ...
    
    return {
        group,
        update(elapsed, _delta, intensity) {
            // intensity-based opacity, rotation, etc.
        },
    };
}
```

#### quantum.js (gösterim için detay)

3 kabuk (electron shell) — yarıçaplar 0.7, 0.95, 1.2. Her kabukta 340-540 nokta (idx göre arttırılır). Sphere surface'inde uniform random distribution:

```js
const theta = 2 * Math.PI * u;
const phi = Math.acos(2 * v - 1);
positions[i*3]     = r * Math.sin(phi) * Math.cos(theta);
positions[i*3 + 1] = r * Math.sin(phi) * Math.sin(theta);
positions[i*3 + 2] = r * Math.cos(phi);
```

Bu `phi = acos(2v - 1)` formülü kabuğun her noktasının eşit olasılığa sahip olmasını sağlar (kutuplarda yığılma olmaz).

Renkler: ortadaki kabuk `palette.accent`, en içteki `palette.mist`, en dıştaki `palette.navy300`.

Update'te: shells `s.rotation.y = elapsed * (0.08 + i * 0.04)` (her kabuk farklı hızda dönüyor), `s.rotation.x` küçük sin oscillation, opacity intensity ile blend.

Diğer 6 signature (neuro, ai-nlp, aero, molbio, forensic, smart) benzer pattern'i izler — Group + Points/Lines + Material + update fn.

---

## 7. Harici Bağımlılıklar

### 7.1 Three.js (v0.166.0)

CDN: `https://unpkg.com/three@0.166.0/build/three.module.js`

Importmap ile resolve edilir, sadece ES module syntax (`import * as THREE from 'three'`).

Add-on'lar `three/addons/` aliası ile:
- `postprocessing/EffectComposer.js`
- `postprocessing/RenderPass.js`
- `postprocessing/UnrealBloomPass.js`
- `postprocessing/OutputPass.js`

unpkg'ın native ES module servisi — Three.js her addon'u ayrıca yükler (network'te ~10 dosya), HTTP/2 ile multiplex çalışır.

### 7.2 GSAP (v3.13.0)

CDN: `https://unpkg.com/gsap@3.13.0/dist/gsap.min.js`

Plugin'ler:
- `ScrollTrigger.min.js`
- `ScrollToPlugin.min.js`

`defer` ile yüklenir. Global `window.gsap` üzerinden erişilir.

Kullanımı: sadece `stage.js`'de camera tween (gsap.timeline, gsap.to, gsap.killTweensOf, ease 'power2.inOut').

`gsap` undefined olursa stage.js fallback: manual MathUtils.damp.

### 7.3 Lenis (v1.1.20)

CDN: `https://unpkg.com/lenis@1.1.20/dist/lenis.min.js`

`defer` ile yüklenir. Sadece carousel.js'de kullanılır. Komiteler section'ı dışında etkin değil (Lenis instance global olmayan, sadece carousel scope'unda).

### 7.4 Google Fonts

`https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap`

`display=swap` ile FOIT/FOUT yönetimi: font yüklenmeden önce fallback font ile metin gösterilir, font hazır olunca swap.

Preconnect ile DNS lookup erken.

### 7.5 Google Maps Embed

`#eventinfo` ve `#contact` section'larında `<iframe>` ile embed. JS yok, sadece iframe URL'i konumu encode eder.

### 7.6 Vercel Insights

`/_vercel/insights/script.js` + `/_vercel/speed-insights/script.js` — Vercel routing'inin runtime'da enjekte ettiği script'ler. Production'da otomatik çalışır, local'de 404 — ignore edilebilir.

### 7.7 Hiçbir build adımı yok

- npm yok
- yarn yok
- pnpm yok
- Webpack/Vite/Rollup/Parcel yok
- TypeScript yok
- Sass/PostCSS yok

Her şey vanilla. Edit ederken kaydet → tarayıcıyı refresh et = anında değişiklik görünür.

---

## 8. Görsel Envanteri

Toplam 17 görsel, ~12 MB.

### 8.1 Brand (her yerde tekrar kullanılan markalar)

- **brand/mfl.png** (~52 KB) — Maltepe Fen Lisesi okul logosu. Kullanılan yerler: navbar (line 66), footer (line 960). Yuvarlak crop ile `.nav-logo-img` ve `.footer-logo-img` class'larında.

- **brand/fbc.png** (~118 KB) — FBÇ etkinlik logosu. ÇOK kullanılan: favicon (line 17), apple-touch-icon (line 18), preloader (line 52), navbar (line 67), hero (line 112). Toplam 5 referans.

### 8.2 Sponsors

- **sponsors/eker.png** (~115 KB) — Eker (gıda). Beyaz zemin (`--white-bg` modifier).
- **sponsors/porty.png** (~10 KB) — Porty. Koyu zeminde duruyor (HTML'de inline `style="background:#19253F"`).
- **sponsors/uludag.png** (~22 KB) — Uludağ (içecek).

### 8.3 Team

- **team/akademi-baskan.png** (~1.7 MB) — Akademi Başkanı.
- **team/genel-koordinator.png** (~1.6 MB) — Genel Koordinatör.
- **team/yardimci-koordinator.png** (~1.8 MB) — Yardımcı Koordinatör.
- **team/pr-baskan.jpeg** (~142 KB) — PR Başkanı.
- **team/press-baskan.jpeg** (~148 KB) — Press Başkanı.
- **team/lojistik-baskanlari.png** (~1.7 MB) — Lojistik Eş Başkanları.
- **team/saha-baskanlari.png** (~1.5 MB) — Saha Eş Başkanları.

PNG'ler büyük çünkü orijinal fotoğraf kalitesi korunmuş. WebP'ye dönüşüm + sıkıştırma ~%70 boyut tasarrufu sağlardı, ama mevcut performans yeterli ve preloader gating var.

### 8.4 Past 2025

- **past-2025/1.png** (~628 KB)
- **past-2025/2.png** (~614 KB)
- **past-2025/3.png** (~1.1 MB) — en büyüğü
- **past-2025/4.png** (~504 KB)

FBÇ '25 etkinlik fotoğrafları. `.zoomable` ile lightbox'a açılır.

### 8.5 Program

- **program/genel.png** (~813 KB) — Matbu program görseli. İki yerde referans:
  - line 532: `<a href="...">Matbu programı görüntüle</a>` (yeni tab)
  - line 875: `<img class="eventinfo-img zoomable">` (lightbox)

### 8.6 Dosya isimlendirme kuralı

- Tüm filename'ler **lowercase**.
- Kelimeler arası **kebab-case** (`-`).
- Türkçe/özel karakter (ç/ş/ı/ğ/ö/ü) YOK — ASCII-safe (cross-platform için).
- Kategori klasör (`brand`, `sponsors`, `team`, `past-2025`, `program`) ile organize.

---

## 9. Class İsimleri Sözlüğü

Bu, HTML'de gerçekten kullanılan ve CSS'te tanımlı class'ların listesidir. Dead/legacy class'lar listede yok (önceki temizlikte silindiler).

### 9.1 Layout / Container

- `.container` — max-width: 1200px, margin auto, padding 0 24px.
- `.section` — generic section wrapper, padding 100px 0.
- `.section-badge` — küçük uppercase letterspacing'li label.
- `.section-title` — display font başlık.
- `.section-desc` — açıklama paragrafı.
- `.section__title`, `.section__title--light` — BEM çift dash modifier ile beyaz title (komiteler ve --ink section'larda).
- `.section__head`, `.section__head--split` — komite header split layout.
- `.section__note` — komite header sağ taraf açıklama.

### 9.2 Section Modifier'ları

Live olanlar:
- `.section-theme`, `.section-vm`, `.section-about`, `.section-workshop`, `.section-team`, `.section-faq`, `.section-sponsors`, `.section-eventinfo`, `.section-past`, `.section-contact` — single dash (geleneksel naming).
- `.section--committees`, `.section--ink`, `.section--paper` — BEM çift dash.

### 9.3 Navigation

- `.navbar`, `.navbar.scrolled`, `.nav-container`, `.nav-logo`, `.nav-logo-img`, `.logo-text-group`, `.logo-text`, `.logo-sub`.
- `.nav-links`, `.nav-link`, `.nav-link.active`.
- `.nav-cta`, `.nav-cta.is-closed`.
- `.hamburger`, `.hamburger.active`.
- `.mobile-menu`, `.mobile-menu.active`, `.mobile-links`, `.mobile-link`, `.mobile-cta`.

### 9.4 Hero

- `.hero`, `.hero-overlay`, `.hero-content`, `.hero-logo`, `.hero-title`, `.hero-highlight`, `.hero-subtitle`, `.hero-buttons`, `.hero-date`.
- `.countdown`, `.countdown-item`, `.countdown-number`, `.countdown-label`, `.countdown-ended`.
- `.scroll-indicator`.

### 9.5 Buttons

- `.btn`, `.btn-primary`, `.btn-secondary`.
- `.btn.is-closed` (state modifier).

### 9.6 Vision / Mission

- `.vm-grid`, `.vm-card`, `.vm-icon`, `.vm-title`, `.vm-text`.

### 9.7 About / Stats

- `.stats-grid`, `.stat-item`, `.stat-number`, `.stat-plus`, `.stat-label`.

### 9.8 Workshop

- `.workshop-box`, `.workshop-content`, `.workshop-highlights`, `.workshop-highlight-item`.

### 9.9 Komiteler (Carousel)

- `.committees-stack`, `.committee-slide`, `.committee-slide.is-active`, `.committee-slide.is-zooming`.
- `.committee-slide__head`, `.committee-slide__page`, `.committee-slide__title`, `.committee-slide__lede`, `.committee-slide__topics`, `.committee-slide__speakers`, `.committee-slide__speakers-lbl`.
- `.committee__num`, `.committee__icon`.
- `.speaker-name`, `.speaker-inst`.
- `.committees-cta`, `.committees-cta__kicker`, `.committees-cta__title`, `.committees-cta__arrow`, `.committees-cta.is-closed`.

### 9.10 Komite Modal

- `.committee-modal`, `.committee-modal.is-open`.
- `.committee-modal__backdrop`, `.committee-modal__panel`, `.committee-modal__close`.
- `.committee-modal__symbol`, `.committee-modal__inner`, `.committee-modal__head`.
- `.committee-modal__num`, `.committee-modal__title`, `.committee-modal__tagline`.
- `.committee-modal__grid`, `.committee-modal__block`, `.committee-modal__block--full`.
- `.committee-modal__lbl`, `.committee-modal__topics`, `.committee-modal__learn`, `.committee-modal__speakers`.
- `.speaker-highlight`, `.speaker-highlight__name`, `.speaker-highlight__inst`, `.speaker-highlight__focus`.
- `.committee.is-active` (legacy card binding state).

### 9.11 Program

- `.program`, `.program__tabs`, `.program__tab`, `.program__tab.is-active`.
- `.program__tab-date`, `.program__tab-day`.
- `.program__panels`, `.program__panel`, `.program__panel.is-active`.
- `.program__download`.
- `.timeline`, `.timeline__item`, `.timeline__item--highlight`, `.timeline__item--soft`, `.timeline__time`, `.timeline__body`, `.timeline__title`, `.timeline__meta`.

### 9.12 Team

- `.team-grid`, `.team-card`, `.team-photo`, `.team-name`, `.team-role`, `.team-desc`.
- `.team-subtitle`.
- `.subteam-grid`, `.subteam-card`, `.subteam-cover`, `.subteam-photo`, `.subteam-body`, `.subteam-name`.

### 9.13 FAQ

- `.faq-list`, `.faq-item`, `.faq-item.active`, `.faq-question`, `.faq-chevron`, `.faq-answer`.

### 9.14 Sponsors

- `.sponsors-grid`, `.sponsors-grid--3`.
- `.sponsor-item`, `.sponsor-logo`, `.sponsor-logo--white-bg`.

### 9.15 Eventinfo

- `.eventinfo-content`, `.eventinfo-program`, `.eventinfo-img`, `.eventinfo-map`, `.eventinfo-map-link`.

### 9.16 Past

- `.past-year`, `.past-gallery`, `.past-gallery--4`, `.past-photo`.

### 9.17 Contact

- `.contact-grid`, `.contact-item`, `.contact-icon`, `.contact-link-wrap`, `.contact-map`.

### 9.18 Footer

- `.footer`, `.footer-grid`, `.footer-brand`, `.footer-logo`, `.footer-logo-img`, `.footer-desc`.
- `.footer-links`, `.footer-contact`, `.footer-social`, `.social-links`.
- `.footer-bottom`.

### 9.19 Modal States ve Helpers

- `.modal-open` (body class) — komite modal açıkken scroll lock.
- `.menu-open` (body class) — mobile menu açıkken scroll lock.
- `.committees-visible` (body class) — komite stage'i görünür/active.
- `.lightbox-open` (body class) — lightbox açıkken scroll lock.
- `.is-loading` (body class) — preloader aktif.

### 9.20 Animation/State

- `.reveal`, `.revealed` — IntersectionObserver hedef + revealed state.
- `.hover-tilt` — JS tarafından eklenen 3D tilt active class.
- `.zoomable` — lightbox hedef img (zoom on click).

### 9.21 Preloader

- `#preloader`, `.preloader__scene`, `.preloader__orbit`, `.preloader__orbit--outer`, `.preloader__orbit--inner`, `.preloader__logo-img`, `.preloader__bar`, `.preloader__bar-fill`.
- `#preloader.is-hidden`.

### 9.22 Lightbox

- `#lightbox`, `.lightbox.is-open`, `.lightbox__close`, `.lightbox__img`, `.lightbox__caption`.

### 9.23 Scroll Progress

- `#scrollProgress`, `#scrollProgressFill`.

### 9.24 Canvases

- `#bg-canvas` — three-scene.js (arka plan).
- `#committees-stage` — carousel.js (komite sahnesi).

---

## 10. Etkileşim Akışları

Bu bölüm bir kullanıcının yaptığı bir hareket sonrası ne olduğunu adım adım izler. Debugging için faydalı.

### 10.1 Sayfa yüklenmesi

1. `index.html` parse edilir.
2. `<head>` Google Fonts preconnect başlar.
3. `body class="is-loading"` ile preloader görünür, scroll lock.
4. `<canvas id="bg-canvas">` DOM'a eklenir (Three.js sahnesi henüz boş).
5. Navbar, mobile menu, section'lar DOM'da kurulur.
6. `<script>` etiketleri (sayfa sonu):
   - Importmap parse edilir.
   - GSAP + ScrollTrigger + ScrollToPlugin defer ile yüklenir.
   - Lenis defer ile yüklenir.
   - `main.js` <script> yüklenir ve hemen çalışır:
     - Preloader IIFE: `document.images` üzerinde iterate, onload/onerror dinler.
     - Navbar scroll listener kurulur.
     - Mobile menu listeners.
     - Smooth scroll anchor listeners.
     - Active nav scroll listener.
     - Countdown başlar, setInterval.
     - FAQ accordion listeners.
     - Reveal IntersectionObserver.
     - Stat counter Observer.
     - COMMITTEE_DATA tanımlanır.
     - Modal listeners (open/close/swipe).
     - Card 3D tilt listeners (sadece pointer:fine).
     - Program tab listeners.
     - Lightbox listener.
     - Scroll progress listener.
   - `three-scene.js` (module) yüklenir ve hemen çalışır:
     - Three.js sahnesi kurulur (particles, far field, ambient shapes, comets, orb, bursts, modes).
     - SECTION_MODES IntersectionObserver kurulur.
     - Mouse/gyro parallax listeners.
     - Resize debounce.
     - animate() loop başlar.
   - `carousel.js` (module) yüklenir ve hemen çalışır:
     - Slides toplanır.
     - Mobile detection.
     - Desktop: initStage(canvas), Lenis init, slide listeners, scroll listener.
7. Image'lar yüklenir, preloader progress artar.
8. Tüm image'lar yüklendiğinde (veya 6s timeout): preloader fade out, `body.is-loading` kaldırılır.
9. Kullanıcı sayfayı görür, animasyonlar başlar.

### 10.2 Bir section'a scroll

1. Kullanıcı aşağı kaydırır.
2. Browser native smooth scroll (CSS `scroll-behavior: smooth`) veya Lenis (komiteler içinde).
3. `window.scroll` event fire eder:
   - main.js: navbar.classList toggle('scrolled') eşik 50px.
   - main.js: active nav link güncelle.
   - main.js: scroll progress bar fill width güncelle.
4. IntersectionObserver'lar tetiklenir:
   - main.js: `.reveal` elementleri viewport'a girince `.revealed` ekle.
   - main.js: stat-number'lar viewport'a girince counter animasyonu başlat.
   - three-scene.js: hangi section dominant olduğunu kontrol et, SECTION_MODES'a göre targetMode değiştir, targetTheme set et.
5. Yeni section komiteler ise:
   - carousel.js: `updateActiveFromScroll()` çağrılır.
   - `body.committees-visible` class'ı eklenir (CSS: #bg-canvas opacity 0, #committees-stage opacity 1).
   - Stage tick loop başlar (eğer yoksa).
   - Viewport center'a en yakın slide aktif olur, stage.setActive(sig).
   - Three.js: kamera tween (cameraTargets[sig]'e GSAP ile).
   - Split progress: prev sig 0'a, new sig 1'e tween.

### 10.3 Komite slide'a tıklama

1. Kullanıcı `.committee-slide` öğesine tıklar.
2. carousel.js click listener: `onCardActivate(slide)`.
3. `slide.classList.add('is-zooming')` — CSS transform scale(1.04) + opacity 0.85.
4. `stage.zoomTo(sig)` — Three.js kamera zoomTargets[sig]'e tween. Split halves modal yan tarafları için kalır.
5. 720ms timer:
   - `window.openCommitteeModal(num, slide)` çağrılır (main.js).
   - main.js openCommittee(key, sourceCard):
     - COMMITTEE_DATA[key] data alır.
     - Slide SVG'sini clone'lar, modal symbol element'ine ekler.
     - Path'lerin stroke-dasharray/dashoffset ayarlar.
     - Modal field'larını doldurur.
     - `#committeeModal.hidden = false`, reflow, `.is-open` class'ı ekler.
     - CSS transitions başlar:
       - Backdrop opacity 0 → 1 (0.5s)
       - Panel scale 0.88 → 1, opacity 0 → 1 (0.6s)
       - Symbol spin + ripple + draw animations
       - Content fade-in (staggered 0.8s-1.3s)
     - `committee-modal:opened` custom event dispatch ({key, sig}).
   - carousel.js modal:opened listener:
     - stage.zoomTo(sig) (zaten yapılmıştı, redundant).
     - stage.isolate(true) — diğer imzalar fade out.
     - modalOpen = true.
     - Stage tick loop devam.
     - Lenis durur.
6. `slide.classList.remove('is-zooming')`.

### 10.4 Modal kapatma

1. Kullanıcı:
   - `.committee-modal__close` X butonuna tıklar, VEYA
   - `.committee-modal__backdrop`'a tıklar (data-close), VEYA
   - Escape tuşuna basar, VEYA
   - Mobile: panel'i aşağı sürükler (>80px veya velocity>0.5).
2. main.js closeCommittee() çağrılır:
   - `.is-open` class'ı kaldırılır → CSS reverse transitions başlar (backdrop fade out, panel scale down).
   - `body.modal-open` kaldırılır → scroll unlock.
   - `.committee.is-active`, `.committee-slide.is-active` class'ları silinir.
   - 400ms timer:
     - `#committeeModal.hidden = true`.
     - `symbolEl.innerHTML = ''` (cleanup).
   - `committee-modal:closed` event dispatch.
3. carousel.js modal:closed listener:
   - stage.isolate(false).
   - stage.zoomOut() → kamera activeSig'e veya HOME'a tween.
   - modalOpen = false.
   - Eğer komiteler artık viewport'ta değilse `body.committees-visible` kaldır.
   - Lenis start.

### 10.5 Kart hover (desktop)

1. Mouse `.team-card`, `.subteam-card`, `.vm-card`, `.committee`, `.eventinfo-program`, `.eventinfo-map` üzerine girer.
2. main.js mouseenter listener: `card-enter` event dispatch ({x, y}).
3. three-scene.js card-enter listener: `fireBurst(x, y)` — screen pos'u world space'e unproject et, free burst'ü o noktada fire et (10 parçacık, 0.8-1.1s life).
4. Mouse hareket eder (mousemove):
   - main.js mousemove listener: kart üzerindeki x/y yüzde hesapla, rotation X/Y (-14 ile +14 derece), CSS `--rx`, `--ry`, `--mx`, `--my` set et.
   - `.hover-tilt` class'ı ekle.
   - `card-hover` event dispatch ({x, y, active: true}).
5. CSS:
   - `.hover-tilt` selector: `transform: translateY(-10px) scale(1.05) rotateX(...) rotateY(...)`.
   - `::after` glow halo opacity 1, radial gradient center mouse pozisyonunda.
6. three-scene.js card-hover listener: hoverTarget güncellenir → animate loop'ta orb scale 1 → 2.2, opacity artar.
7. Mouse kart'tan çıkar (mouseleave):
   - main.js mouseleave: `--rx`, `--ry` sil, `.hover-tilt` kaldır.
   - card-hover event dispatch ({active: false}).
8. Orb scale 1'e, opacity normal'e döner.

### 10.6 Zoomable image lightbox

1. Kullanıcı `.zoomable` IMG'ye tıklar (hero logo, eventinfo program, past gallery).
2. main.js document-level click delegation: `closest('.zoomable')` match → preventDefault.
3. `open(src, alt)`:
   - `img.src = z.currentSrc || z.src`, `img.alt = alt`.
   - Caption set.
   - `#lightbox.classList.add('is-open')`, `aria-hidden="false"`.
   - `body.lightbox-open` (scroll lock).
4. CSS: lightbox display flex, fade-in.
5. Kullanıcı kapatma:
   - `.lightbox__close` X butonu, VEYA
   - Backdrop click (`e.target === lb`), VEYA
   - Escape tuşu.
6. `close()`:
   - `.is-open` kaldır.
   - `body.lightbox-open` kaldır.
   - 300ms sonra `img.src = ''` (memory cleanup).

### 10.7 Mobil viewport ve etkileşimler

Mobilde (max-width: 768px):

- Navbar links gizli, hamburger görünür.
- Hamburger tıkla → mobile menu aç → scroll lock.
- Mobile link tıkla → menu kapat → smooth scroll target'a.
- Mobile menu açıkken Escape veya outside-tap kapatır.

- Komite slide'ları list olarak görünür (Three.js sahne yok mobilde).
- Slide tıkla → doğrudan openCommitteeModal (carousel.js Three.js zoom atlanır).
- Modal swipe-down ile kapatılabilir.

- Mouse follower orb (three-scene.js) gizli (`orbGroup.visible = false`).
- Card tilt: mouse events yerine touchstart → burst event (sadece).

- Three.js sahnesi parametreleri reduced:
  - 250 particle (yerine 500)
  - 400 far field (yerine 900)
  - 6 ambient shape (yerine 12)
  - Comet'ler launch edilmez.
  - antialias kapalı.
  - pixelRatio 1.5 cap.

---

## 11. Tarayıcı Desteği ve Erişilebilirlik

### 11.1 Hedef tarayıcılar

- Chrome 90+ (en yeni 2 versiyon)
- Firefox 88+ (en yeni 2 versiyon)
- Safari 14+ (en yeni 2 versiyon)
- Edge 90+ (Chromium tabanlı)

### 11.2 Kullanılan modern API'ler

- **ES Modules** (`<script type="module">`) — Safari 11+, Chrome 61+, Firefox 60+, Edge 16+. Importmap için Safari 16.4+, Chrome 89+, Firefox 108+.
- **IntersectionObserver** — universal support 2019'dan beri.
- **WebGL2** — Three.js v0.166 default. Eski cihazlarda WebGL1 fallback yok.
- **CSS Custom Properties** — universal.
- **CSS Grid + Flexbox** — universal.
- **backdrop-filter** — Safari/Chrome/Firefox modern destekli. Eski Firefox fallback yok.
- **Touch events** — mobil için universal.
- **DeviceOrientationEvent** — iOS 13+ permission gerekli (touchend ile silent request main.js'de).

### 11.3 ARIA kullanımı

- `<nav>`, `<header>`, `<footer>`, `<section>`, `<article>` — semantik HTML.
- `role="dialog"` modal'larda.
- `aria-modal="true"` modal'larda.
- `aria-label` icon-only butonlarda (hamburger, modal close, social links).
- `aria-expanded` accordion FAQ ve hamburger'da.
- `aria-selected` program tablarında.
- `aria-controls` tab'lardan panel'lere referans.
- `aria-hidden="true"` dekoratif element'lerde (icons, scenes, scroll progress).
- `aria-disabled="true"` `.is-closed` CTA'larda.
- `role="status"` preloader'da.
- `aria-live="polite"` preloader'da.
- `aria-labelledby` section'larda title'a referans.

### 11.4 Focus management

- Tüm tıklanabilir element'ler `:focus-visible` state'i alır.
- Modal açıldığında: focus modal panel'e taşınmıyor (eksiklik — eklenebilir).
- Modal kapatıldığında: focus tetikleyen element'e dönmez (eksiklik).
- Tab order: source order (HTML sırası). Skip link yok.
- Klavye nav: tab + enter/space ile her şey erişilebilir (modal aç, accordion, lightbox).

### 11.5 Color contrast (WCAG)

- Body text `var(--text-dark)` (#2C56A5) on `--white`/`--off-white` → ~7:1 AAA pass.
- Body text `var(--white)` on `var(--navy-dark)` → ~10:1 AAA pass.
- `var(--gray)` (#7B93B8) on light bg → ~3.5:1 AA fail (kullanım sınırlı, özellikle `--text-muted` yerine `--text-on-light-muted` (#5a6e8a) tercih ediliyor).
- Hover/focus state'leri kontrast farkı sağlar.

### 11.6 Reduced motion

- CSS `@media (prefers-reduced-motion: reduce)` ile animation-duration ~0ms, transition-duration ~0ms.
- BUT three-scene.js'de `prefersReducedMotion = false` bilinçli override (yoruma bak — site animasyon-merkezli).
- Lenis smooth scroll `prefers-reduced-motion` ile devre dışı bırakılır.

---

## 12. Deploy ve Hosting

### 12.1 Vercel auto-deploy

- Repo Vercel projesine bağlı.
- `main` branch'e push → otomatik build başlar.
- Build komutu yok (static asset transfer).
- Output: tüm dosyalar olduğu gibi CDN'e dağıtılır.
- ~30 saniye içinde production'da.

### 12.2 vercel.json

```json
{
  "trailingSlash": false
}
```

Sadece tek setting: trailing slash kapalı (URL `/about` çalışır, `/about/` 308 redirect olur).

### 12.3 Domain

- Production: `maltepefencalistay.org`
- Vercel project'ine bağlı, SSL otomatik (Let's Encrypt).

### 12.4 robots.txt

```
User-agent: *
Allow: /
Sitemap: https://maltepefencalistay.org/sitemap.xml
```

(Sitemap.xml file yok, sadece referans verilmiş — küçük bir eksiklik.)

### 12.5 Local development

- Node.js yüklü ise:
  ```bash
  node -e "const http=require('http'),fs=require('fs'),path=require('path');const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon'};http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0]);if(u==='/')u='/index.html';const f=path.join(process.cwd(),u);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('404');return}res.writeHead(200,{'Content-Type':types[path.extname(f).toLowerCase()]||'application/octet-stream'});res.end(d)})}).listen(8000)"
  ```
- Python yüklü ise:
  ```bash
  python -m http.server 8000
  ```
- VS Code Live Server extension.

`file://` protokolü ES modules için yüklenemez — HTTP server zorunlu.

### 12.6 Local dev'de 404'ler

`/_vercel/insights/script.js` ve `/_vercel/speed-insights/script.js` 404 verir — bunlar Vercel'in runtime injection'ı, production'da otomatik servisli. Local'de ignore et.

---

## 13. Tasarım Kararları ve Quirks

### 13.1 Neden vanilla, neden build-step yok?

- Tek bir geliştirici (kullanıcı) yönetiyor — toolchain bakımı maliyetli.
- Site içerik ağırlıklı, dinamik state minimal — framework overkill.
- Deploy basit: git push → tek tıkla canlı.
- Onboarding hızlı: HTML/CSS/JS bilen herkes anında üretken.

### 13.2 Neden iki ayrı Three.js sahnesi?

- Komite sahnesi (bloom + split-mirror) yüksek GPU kullanır.
- Tüm sayfa boyunca çalışsaydı battery + thermal kötüleşir.
- İki ayrı renderer ile section-based on/off net.

### 13.3 Neden React Three Fiber yok?

- React eklemek tüm build-step kararını ters çevirir.
- Vanilla Three.js bu boyutta proje için yeterli okunabilir.
- Kullanıcının tercihi.

### 13.4 Neden başvurular kapalı CTA hâlâ duruyor?

- Etkinlik 9-10 Mayıs 2026'da yapıldı, bugün 13 Mayıs.
- Site'yi arşiv olarak yayında tutmak istiyor.
- CTA'yı tamamen kaldırmak yerine "Başvurular bitti" durumu olarak göstermek mantıklı: ziyaretçi geçmişi anlar, ileride yeni etkinlik için referans.

### 13.5 Neden BEM mixed kullanımı?

- Eski section'lar single-dash (`.section-team`, `.team-card`).
- Yeni section'lar BEM çift-dash (`.section--committees`, `.committee-slide__head`).
- Komite section refactor'ünde yeni naming benimsendi, ama mevcutları yeniden adlandırmak büyük churn — eskileri korundu.

### 13.6 Neden prefers-reduced-motion override?

- Site'nin tasarım dili animasyon-merkezli (countdown, Three.js, scroll reveal).
- Tamamen durdurmak ziyaretçiye "boş site" hissi verir.
- CSS animation-duration azalır ama Three.js sahnesi devam eder.
- Bu bilinçli bir trade-off; erişilebilirlik puristleri farklı düşünebilir.

### 13.7 Neden Lenis sadece komite section'ında?

- Lenis tüm sayfaya uygulansaydı, native anchor scroll (smooth scroll'a smooth scroll) çakışırdı.
- Komite section'ında long-scroll cinematic feel için Lenis ideal.
- Diğer section'lar default browser scroll ile yeterli.

### 13.8 Neden GSAP sadece komite stage'inde?

- GSAP kamera tween'leri için kullanılır (cubic-bezier ease, GTA arc).
- Diğer animasyonlar CSS transition/animation veya manual `requestAnimationFrame` ile yapılır.
- Gereksiz kullanım kütüphaneyi büyütür.

### 13.9 SVG icon'ların inline olması

- HTML içinde inline SVG (sprite değil).
- Avantaj: CSS ile fill/stroke kontrol edebilirsin, JS ile clone'layabilirsin (modal'da symbol draw için kritik).
- Dezavantaj: aynı icon birden çok yerde tekrar eder (FAQ chevron 6x).
- `<symbol>` + `<use>` pattern'a geçilebilir ama küçük gzip kazanç (~1 KB), büyük refactor.

### 13.10 Yetki hiyerarşisi sıralaması

`<section id="team">` içinde sıralama ÖNEMLI:
- Sorumlu öğretmenler: Başdanışman → 3 Danışman.
- Alt ekipler: Genel Koordinatör → Yardımcı Koord → PR → Press → Akademi → Lojistik → Saha.
- Bu sıra ekip içi yetki hiyerarşisine göre. Değiştirmeden önce kullanıcıya sor.

### 13.11 Renk paleti — neden "navy"?

- Maltepe Fen Lisesi'nin okul logosu mavi.
- FBÇ etkinlik logosu navy gradient.
- Bilim + ciddiyet + gençlik üçgeninde mavi tonları tercih edildi.
- Light/dark variantlar Three.js arka planının ister koyu ister açık section'da uyum sağlaması için.

---

## 14. Sık Sorulan Sorular

### S: Yeni bir komite eklemek istiyorum, nereden başlamalı?

1. `index.html` komiteler section'ına yeni `<article class="committee-slide" data-signature="<yeni-sig>">` ekle.
2. `js/scene/anchors.js`'e yeni sig için anchor Vector3 ekle (mevcut 7'den uzak olsun).
3. `js/scene/signatures/<yeni-sig>.js` dosyası oluştur, factory function export et.
4. `js/scene/signatures/index.js`'e import ve register et, signatureOrder array'e ekle.
5. `js/scene/stage.js`'deki SIGNATURE_PALETTES objesine yeni renk paleti ekle.
6. `js/main.js`'deki COMMITTEE_DATA objesine yeni komite verisini ekle (title, tagline, topics, learn, speakers).
7. CSS'te ekstra bir şey yapma gerek YOK (committee-slide generic style'lar her sig için çalışır).

### S: Renk paletini değiştirmek istiyorum.

`css/style.css`:1-20'deki `:root` blokunda CSS variable'ları güncelle. Tüm proje bu token'lara bağlı, tek noktadan değişir. Three.js sahneleri için ayrıca `js/three-scene.js`:12-15 PALETTE objesini ve `js/scene/stage.js` SIGNATURE_PALETTES'ı senkron tut.

### S: Yeni bir section eklemek istiyorum.

1. CLAUDE.md kuralı: brainstorming skill'ini önce çağır.
2. `index.html` `<section class="section section-<name>" id="<name>">` ile yeni section.
3. `css/style.css` background rgba ekle (canvas bleed-through için, `.section-<name>` background list'ine).
4. `js/three-scene.js` SECTION_MODES'a section ID → mode mapping ekle.
5. Section list'ine (position relative) ekle.

### S: Mobile menü çalışmıyor.

1. `#hamburger` element'i DOM'da mı?
2. `#mobileMenu` element'i DOM'da mı?
3. `main.js`'deki mobile menu listeners çalışıyor mu (console.error)?
4. CSS'te `@media (max-width: 768px)` doğru breakpoint'te `.nav-links { display: none }` ve `.hamburger { display: flex }` aktif mi?

### S: Countdown'u değiştirmek istiyorum.

`js/main.js`:134:
```js
const targetDate = new Date('2026-05-09T09:00:00').getTime();
```

Tarihi güncelle. Etkinlik geçtikten sonra `distance < 0` durumu "Etkinlik başladı!" gösterir.

### S: Three.js sahnesi çok ağır geliyor, perf düşür.

`js/three-scene.js`:
- `particleCount` (line 51) düşür.
- `farCount` (line 77) düşür.
- `ambientCount` (line 100) düşür.
- isMobile true ise zaten reduced — desktop için de azaltmak gerekirse manual.

`js/scene/stage.js`:
- bloom strength/radius/threshold parametrelerini düşür.

### S: Komite modal'ı açılmıyor.

1. `COMMITTEE_DATA[key]` undefined olabilir — key formatı `'C/01'` (slash dahil).
2. `#committeeModal` DOM'da var mı?
3. `window.openCommitteeModal` global'i set mi? (`main.js`:388 set ediyor.)
4. SVG clone hatası olabilir (SVG yapısı beklenenden farklıysa).

### S: Yeni bir image eklerken nasıl naming?

- Lowercase + kebab-case.
- ASCII-only (özel karakter yok).
- Uygun klasöre koy: `assets/images/{brand,sponsors,team,past-2025,program}/`.
- Yeni kategori gerekirse yeni klasör aç, `index.html`'de o path'le referansla.

### S: Lenis ne işe yarıyor?

`js/carousel.js` içinde sadece komiteler section'ında smooth scroll için kullanılır. Modal açıldığında Lenis durur (modal içeriği native scroll edebilsin). `prefers-reduced-motion` aktifse Lenis devre dışı kalır.

### S: Sahne neden bazı section'larda mode değişmiyor?

`js/three-scene.js`:22 SECTION_MODES objesi sadece listelenen section ID'leri için mode tanımlı. Listede olmayan section default 'flow' alır (line 545: `const nextMode = SECTION_MODES[id] || 'flow';`). Yeni section eklerken SECTION_MODES'a da ekle.

---

## Notlar (geleceğe)

- `brain_v3.png` / `brain_v4.png` / `brain_live.png` referansları CLAUDE.md'de vardı, gerçek dosyalar yok — referanslar kaldırıldı.
- `_vercel/insights/script.js` 404 local'de normal.
- Service Role Key veya benzeri secret repo'da YOK (.gitignore'da `.env` var ama .env dosyası da yok).
- Önceki commit'lerde yemek QR sistemi vardı — git log'ta görülebilir, ama mevcut kodbase'de tamamen kaldırıldı.

Bu doküman sondu — okumaya devam edersen padding'e döner. Daha derin bir konu için spesifik dosyaya git, satır numarasıyla okuyup grep'le.
