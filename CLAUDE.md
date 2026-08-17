# CLAUDE.md — MFL FBÇ '26 Çalışma Kuralları

Bu doküman Claude'un (veya başka bir AI/insan geliştiricinin) bu projede her göreve başlamadan önce okuyacağı operasyonel kuralname'dir. Proje hakkında **bilgi** istiyorsan [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)'ye git; burada sadece **ne yapmalı / ne yapmamalı** vardır.

Bu projenin diğer geliştirici tarzı dokümanlarından farkı: her satır direkt uygulanabilir bir karar veya yasak içerir. Padding/tekrar yoktur, okunduğu yerden uygulamaya geç.

---

## 0. Bu Dokümanı Nasıl Kullanmalı

- **Her oturum başında** baştan sona oku — 5-10 dakika.
- **Hızlı referans:** İçindekiler üzerinden ilgili bölüme atla.
- **Çakışma:** Kullanıcı talimatı bu kurallardan üstündür (`using-superpowers` skill kuralı). Bir kural seni durduruyorsa ve kullanıcı açıkça istiyorsa kullanıcının dediğini yap.
- **Belirsiz kural:** Kullanıcıya sor, varsayım yapma. Soru sormadan önce kodda bir dakika araştır (CLAUDE.md sözünü grep'le bul, etc.).
- **Skill çağırma kuralı:** İlgili bir skill varsa **önce skill'i çağır**, sonra çalışmaya başla. Skill'ler bu dokümanı override edebilir (örn. test-driven-development skill'i daha sıkı bir disiplin getirebilir).

---

## İçindekiler

1. Proje Kısa Hatırlatması
2. Pre-Task Workflow (her görev başlangıcı)
3. Skill Eşleştirme Tablosu
4. Brainstorming: Ne Zaman / Ne Zaman Değil
5. Dil ve İçerik Kuralları
6. Brand Identity
7. Anti-Generic Stil Kuralları
8. Tipografi Kuralları
9. Three.js Sahne Kuralları (bg-canvas + committees-stage)
10. Animasyon Disiplini
11. CSS Mimari Kuralları
12. JS Mimari Kuralları
13. Erişilebilirlik Kontrol Listesi
14. Test ve Doğrulama Protokolü
15. Yaygın Tuzaklar (Pitfalls)
16. Git ve Commit Disiplini
17. Dokunulmaz Liste
18. Hata Halinde Yol Haritası
19. Dosya-bazlı Edit Kuralları
20. Performans Kuralları (genel)
21. Edit Yapmadan Önce Son Kontrol Listesi

---

## 1. Proje Kısa Hatırlatması

- **Ne:** Maltepe Fen Lisesi Fen Bilimleri Çalıştayı 2026 tanıtım sitesi.
- **Tarihler:** Etkinlik 9-10 Mayıs 2026'da gerçekleşti, bugün 2026-05-13. Site arşiv durumunda yayında.
- **Stack:** Vanilla HTML/CSS/JS + Three.js (CDN) + GSAP + Lenis. **Build adımı YOK, package.json YOK.**
- **Hosting:** Vercel auto-deploy, domain `maltepefencalistay.org`.
- **Dil:** İçerik %100 Türkçe. Kod yorumları/değişken isimleri İngilizce olabilir.
- **Boyut:** ~38 dosya, kod toplam ~4600 satır, görseller ~12 MB.

Daha derin bilgi için [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md).

---

## 2. Pre-Task Workflow

Kullanıcı yeni bir görev verdiğinde aşağıdaki sırayı UYGULA:

### 2.1 Tipi belirle

Görev hangi kategoride?

| Tip | Örnek | İlk Aksiyon |
|---|---|---|
| Bug fix | "FAQ tıklayınca açılmıyor" | Konsol logu/grep ile bug'ı yerinde teşhis et, sonra düzelt. Brainstorming YOK. |
| Tasarım/davranış değişikliği | "Hero'ya yeni bir grafik ekleyelim" | **`superpowers:brainstorming` skill'ini çağır.** Hedef ve gereksinimleri netleştir. |
| Yeni section/component | "Kayıt için yeni section ekle" | **brainstorming** + sonra **frontend-design** skill. |
| Three.js sahne değişikliği | "Beyin sahnesinin renklerini değiştir" | brainstorming + Bölüm 9'u oku. |
| Refactor/temizlik | "Kullanılmayan CSS'leri sil" | Önce envanter (grep), sonra plan, sonra sil. Brainstorming gerekmez. |
| Dosya/path değişikliği | "Görselleri başka klasöre taşı" | Tüm referansları grep'le bul, mv + Edit paralel. |
| Açıklama/araştırma | "Bu Three.js modu ne yapıyor?" | Sadece oku ve cevap ver, Edit YOK. |
| Commit / git | "Şunu commit et" | Konvansiyonu izle (Bölüm 16). |
| Local test | "Çalışıyor mu kontrol et?" | Bölüm 14 protokolüne göre. |

### 2.2 Etki alanını anla

- Hangi dosyalara dokunulacak?
- Hangi class/ID'leri etkileyecek?
- Hangi browser feature'ı gerekecek?
- Mobil + desktop davranışı farklı mı olacak?

Bunlardan emin değilsen `Grep` veya `Read` ile araştır. Önemli: index.html ~1040 satır, css/style.css ~2900 satır — bunları sadece offset/limit ile okuyabilirsin.

### 2.3 Plan kur (gerekirse)

- 3+ adım gerektiren değişiklikler için kısa bir plan oluştur, kullanıcıya göster.
- Kullanıcı plan onayladıysa veya görev küçükse direkt uygula.
- Plan dokümanını kalıcı bir dosyaya yazma — sadece conversation context'inde tut. CLAUDE.md "Bug fix için çevresindeki kodu refactor etme" diyor; spec/plan dosyası üretmek bu spirite aykırı.

### 2.4 Uygula

- En küçük adımdan başla, hızlı feedback al.
- Edit'ten sonra **mutlaka** ya görsel test ya da grep ile sonuç verifikasyonu yap.
- Mock fix değil real fix — bandage çözüm bırakma.

### 2.5 Kullanıcıya rapor et

- Ne değişti, hangi dosya, hangi satır (path:line referans formatı).
- Test yaptıysan sonucu söyle.
- Riskli durum varsa açıkça not düş.

---

## 3. Skill Eşleştirme Tablosu

Belirli görev tipleri için **mutlaka** ilgili skill'i çağır. Çağırmazsan en azından `Skill` tool ile metadata'yı kontrol et.

| Görev İpucu | Skill |
|---|---|
| Yaratıcı iş (yeni section, redesign, feature) | `superpowers:brainstorming` (ZORUNLU) |
| Frontend kod yazımı (UI component, layout) | `frontend-design` |
| Bug teşhisi / unexpected behavior | `superpowers:systematic-debugging` |
| TDD ile feature impl | `superpowers:test-driven-development` |
| Plan yazımı (multi-step task) | `superpowers:writing-plans` |
| Çoklu bağımsız task (parallel) | `superpowers:dispatching-parallel-agents` |
| Verify before complete claim | `superpowers:verification-before-completion` |
| PR / code review | `code-review:code-review` |
| Commit/push/PR | `commit-commands:commit-push-pr` (kullanıcı isterse) |
| İş ortamında deployment | `vercel:deploy` |

**Çakışma kuralı:** Skill talimatı CLAUDE.md kurallarıyla çakıştığında **skill kazanır** (using-superpowers skill açıkça söylüyor). Ama kullanıcı talimatı her şeyden üstün.

---

## 4. Brainstorming: Ne Zaman / Ne Zaman Değil

### 4.1 ZORUNLU brainstorming (önce skill çağır)

- Yeni section/sayfa/component eklemek
- Mevcut bir bölümün tasarımını/davranışını **değiştirmek** (eklemek değil, yenilemek)
- Yeni bir etkileşim (animasyon, modal, filtre, carousel) tasarlamak
- Three.js sahnesini yeniden yapılandırmak (mode eklemek, ana akış değiştirmek)
- Komite/team listesinin **içeriğini veya sırasını** değiştirmek (sıra hiyerarşik)
- Mevcut bir renk/font kararını değiştirmek (sadece kullanıcı açık talep ederse atla)

### 4.2 Brainstorming GEREKSİZ (direkt yap)

- Bug fix / typo
- Mevcut design token kullanarak küçük CSS ayarı (örn. spacing, font-size tweaking)
- Mevcut bir komite veya ekip üyesinin metnini güncellemek (içerik düzeltme)
- Dosya okuma, araştırma, açıklama isteği
- Commit mesajı / git komutu / push
- Kullanıcının net olarak tariflediği ufak değişiklik ("bu butonun rengini accent yap")
- Dead code temizliği
- Refactor (kullanılmayan class silme, duplikatı çıkarma)
- File rename / move (referansları doğru güncellediğin sürece)
- Image optimization / resize
- Markup/path düzeltmesi (404 fix)

### 4.3 Brainstorming çağırma şekli

```
Skill tool → superpowers:brainstorming
```

Skill kullanıcıyla niyet, kısıt, alternatifler üzerine konuşma çerçevesi sunar. Konuşma sonunda gerçek implementation'a geç.

---

## 5. Dil ve İçerik Kuralları

### 5.1 Türkçe metin zorunlu

- Tüm kullanıcıya görünen text Türkçe.
- İngilizce placeholder yazma ("Hello World", "Lorem ipsum" vb).
- Yeni içerik için **profesyonel ama genç** tonu kullan — hedef kitle: lise öğrencileri + eğitimciler.

### 5.2 HTML

- `<html lang="tr">` (zaten ayarlı).
- Tarih formatı: gün-ay-yıl (Türkçe konvansiyon, örn "9 Mayıs 2026").
- Saat: 24 saat format ("13:30" — "1:30 PM" değil).
- Telefon: +90 5XX XXX XX XX (uluslararası prefiks).

### 5.3 Türkçe karakter

Türkçe karakter (ğ, ş, ı, İ, ç, ö, ü) HTML içeriğinde **destekli**. UTF-8 kullanılıyor (`<meta charset="UTF-8">`).

**AMA filename'lerde YOK:**
- `çalıştay.png` ❌ → `fbc.png` ✅
- `nöropsikoloji/` ❌ → `neuro-psikoloji/` veya `neuro/` ✅
- Cross-platform için ASCII-only file paths.

### 5.4 Kod içi yorumlar

- Yorum/değişken isimleri İngilizce olabilir (mevcut konvansiyon).
- Türkçe açıklama gerekirse de OK, ama tutarlı ol — bir fonksiyon yorumu yarı Türkçe yarı İngilizce karışım olmasın.

### 5.5 SEO meta

- `description`, `keywords` Türkçe.
- `og:title`, `og:description` Türkçe.
- `og:locale: tr_TR`.
- Schema.org `Event` zaten doğru ayarlı, dokunma.

---

## 6. Brand Identity

### 6.1 CSS Variable Palette

**`css/style.css` `:root` blokundaki variable'lar TEK doğru kaynak.** İnternette başka palette tahmin etme.

```css
--navy-dark:    #2C56A5   /* ink / metin */
--navy-primary: #3A64A7
--navy-medium:  #4472B6   /* primary brand */
--accent:       #819FCD   /* orta mavi */
--accent-light: #9FB6D5   /* açık pudra */
--accent-hover: #5381BE   /* hover state */
--white:        #FFFFFF
--off-white:    #F3F7FC
--gray-light:   #DDE8F3   /* line/border */
--gray:         #7B93B8   /* mid desatüre */
--text-dark:    #2C56A5   /* body text */
--text-muted:   #7B93B8
--text-on-light: #2d3e5c        /* açık zemin metin */
--text-on-light-muted: #5a6e8a  /* açık zemin muted */
```

### 6.2 Yeni renk yasağı

- **Tailwind/Bootstrap tonları yasak:** `blue-500`, `indigo-600`, `slate-700` gibi default'lar yok.
- **Yeni hex uydurma:** Yeni bir tona ihtiyaç varsa önce variable olarak `:root`'a ekle, sonra kullan.
- **Inline color yasak:** `style="color: #abcdef"` yazma; CSS class kullan.

### 6.3 Three.js renkleri ayrı

Three.js sahnelerinin renkleri JS dosyalarında hardcoded:

- `js/three-scene.js` PALETTE objesi (line 12-15).
- `js/scene/stage.js` SIGNATURE_PALETTES objesi (her komite için ayrı palette).

CSS variable'ları değişirse bu JS palette'lerini de senkron tut (üç dosya: style.css, three-scene.js, stage.js).

### 6.4 Logo kullanımı

İki logo:
- `assets/images/brand/mfl.png` — Maltepe Fen Lisesi (okul logosu)
- `assets/images/brand/fbc.png` — FBÇ etkinlik logosu (ana brand asset)

Konumlar:
- Navbar: ikisi yan yana (mfl + fbc).
- Footer: sadece mfl.
- Hero: sadece fbc (büyük).
- Preloader: fbc.
- Favicon + apple-touch-icon: fbc.

Logo'yu yeniden adlandırırsan **tüm bu yerleri** index.html'de aynı anda güncelle (toplam ~8 referans). PROJECT_SUMMARY.md Bölüm 8'de tüm referans satır numaraları var.

### 6.5 İmza renkleri (komite spesifik)

7 komite için ayrı renk paleti (`js/scene/stage.js`:14-22):
- quantum: indigo/lavender
- neuro: pink/rose
- ai-nlp: teal/aqua
- aero: sky-blue
- molbio: green
- forensic: orange
- smart: yellow/gold

Komite eklerken/değiştirirken bu palette'ler de eklenmeli/güncellenmeli.

---

## 7. Anti-Generic Stil Kuralları

Bu kurallar "AI-generated boilerplate site" görüntüsünden kaçınmak için:

### 7.1 Renk

- ✅ Sadece CSS variable'ları kullan.
- ❌ Tailwind default'ları (`blue-500`, `gray-200` vb) yazma.
- ❌ Inline hex (`#1e293b`) yazma.
- ✅ Yeni ton: variable ekle, sonra kullan.

### 7.2 Shadow

- ❌ Generic flat: `box-shadow: 0 2px 4px rgba(0,0,0,.1)` YASAK.
- ✅ Layered, brand-tinted:
  ```css
  box-shadow: 0 10px 30px -10px rgba(44, 86, 165, 0.2);
  ```
- ✅ Multi-layered modal:
  ```css
  box-shadow: 0 40px 120px rgba(0, 0, 0, 0.6),
              0 0 60px rgba(129, 159, 205, 0.18) inset;
  ```

### 7.3 Animasyon

- ✅ Sadece `transform` ve `opacity` animate et (GPU compositor friendly).
- ❌ `transition: all` **YASAK.** Spesifik property listele:
  ```css
  /* ✅ Doğru */
  transition: background var(--transition), transform var(--transition), box-shadow var(--transition);
  /* ❌ Yanlış */
  transition: all var(--transition);
  ```
- ✅ Spring benzeri easing tercih et:
  ```css
  transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
  ```
- ❌ Linear/ease default genellikle generic durur.

### 7.4 Etkileşim state'leri

Her tıklanabilir element için **üç state zorunlu**:
- `:hover` — pointer üzerinde
- `:focus-visible` — klavye navigasyonu (`:focus` değil — fare click sonrası gözükmesin)
- `:active` — basılı tutuluyorken

Tab ile her interactive element'e ulaşılabilmeli. `tabindex="0"` non-button element'lerde gerekli (örn `.committee-slide`).

### 7.5 Görseller

- ✅ Gerçek görseller `assets/images/{kategori}/` içinde.
- ✅ Mevcut yoksa: `https://placehold.co/WIDTHxHEIGHT` placeholder.
- ❌ Rastgele Unsplash/Pexels link yapıştırma — telif belirsiz, broken link riski.
- ✅ Her `<img>` `alt` attribute zorunlu (boş "" dekoratif için).

### 7.6 Spacing

- ✅ Variable kullan: `var(--section-padding)`, `var(--container-width)`, `var(--nav-height)`.
- ❌ Magic number'lar yazma: `margin: 73px` ❌, `padding: 47px 23px` ❌.
- ✅ rem/em tercih edilebilir, ama bu projede px daha yaygın — tutarlı kal.

### 7.7 Derinlik / z-index

Katman sistemi (PROJECT_SUMMARY.md Bölüm 4.18):
- `-1`: bg-canvas (Three.js)
- `1`: committees-stage
- `2`: section content, hero
- `3`: committees-stack
- `10`: nav-logo
- `1000`: navbar, modal, lightbox
- `1001`: hamburger
- `9999`: preloader

Yeni element eklerken bu listeyi referans al. Random `z-index: 999` yazma.

### 7.8 Tipografi

- ✅ Display font (Playfair) sadece büyük başlıklar.
- ✅ Body font (Inter) gövde + UI.
- ❌ Aynı font hem başlık hem body için kullanma (monotonluk).
- ✅ Tight tracking büyük başlıklarda: `letter-spacing: -0.02em` ila `-0.03em`.
- ✅ Body line-height: `1.6-1.7`.
- ✅ Uppercase letter-spacing badge'lerde: `letter-spacing: 0.15em` ila `0.18em`.

### 7.9 İkonlar

- SVG inline tercih (CSS ile fill/stroke kontrol için).
- ❌ Emoji yerine icon kullan (UI elementlerinde).
- ❌ Icon font yükleme (FontAwesome, Material Icons) — extra dependency.
- ✅ Mevcut SVG'leri clone/copy ile yeniden kullan.

---

## 8. Tipografi Kuralları

### 8.1 Font yükleme

`index.html` head'inde Google Fonts ile yüklü:
- **Inter** (400, 500, 600, 700, 800)
- **Playfair Display** (700)
- `display=swap` — FOIT yerine FOUT.

**Yeni font import etme** — sayfa yükünü artırır. Mevcut iki font yeterli.

### 8.2 Font kullanımı

- Body, paragraf, listeler → Inter.
- Başlık (`<h1>`, `<h2>`, hero-title, section-title) → Playfair Display.
- UI elemanları (button, nav-link, stat-label) → Inter.
- Custom: `var(--font-body)` veya `var(--font-display)`.

### 8.3 Font-weight skalası

- 400 — body text
- 500 — UI labels, secondary headings
- 600 — buttons, badges, emphasis
- 700 — major headings, hero title, modal title
- 800 — display heavy (hero highlight, large stat numbers)

### 8.4 Font-size skalası

CSS'de mostly hardcoded ama tutarlı:
- 0.7-0.75rem — small labels, badges, captions
- 0.85-0.95rem — small body, UI text
- 1rem — default body
- 1.05-1.2rem — emphasized body, subtitles
- 1.3-1.5rem — h3, modal title
- 2-2.8rem — h2, section titles
- 3-3.4rem — h1, hero title (via `clamp()`)

Fluid scale variable: `--text-h1: clamp(1.9rem, 5vw, 3.4rem)`.

---

## 9. Three.js Sahne Kuralları

### 9.1 İki ayrı sahne yapısı

- `#bg-canvas` → `js/three-scene.js` (background, 7 mode)
- `#committees-stage` → `js/scene/stage.js` (komite spesifik, 7 imza)

Bunları **birleştirme** — performans için ayrılar.

### 9.2 Performance disiplini

#### YAPMA listesi

- ❌ Her frame'de yeni `Geometry`, `Material`, `Texture` veya `Mesh` yaratma.
- ❌ Her frame'de `new THREE.Color()`, `new THREE.Vector3()` allocate etme (özel durumlar dışında).
- ❌ Pahalı geometry kullanma (>10k vertex) — özellikle mobile'da.
- ❌ Çoklu render pass eklemeden önce GPU bütçesini düşün.
- ❌ Animasyon loop'unda DOM query (`document.querySelector`) yapma — bir kez referansı al, sakla.

#### YAP listesi

- ✅ Geometry/Material kayıt edip aynı kaynağı birden çok mesh'te paylaş.
- ✅ BufferGeometry kullan (THREE.Geometry deprecated).
- ✅ AdditiveBlending + `depthWrite: false` overlay particle effect'ler için.
- ✅ `attributes.position.needsUpdate = true` sadece pozisyon gerçekten değiştiyse.
- ✅ Object pool kullan (burst pool gibi — sabit sayıda, reuse).
- ✅ Mobile'da küçük parametreler:
  - particle count yarıya
  - antialias kapalı
  - pixelRatio cap 1.5

### 9.3 Resize handling

```js
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }, 150);
});
```

Debounce zorunlu (resize event yüksek frekansta).

### 9.4 Visibility / running guard

```js
let running = true;
document.addEventListener('visibilitychange', () => {
    running = !document.hidden;
    if (running) clock.start();
});

function animate() {
    if (!running) { requestAnimationFrame(animate); return; }
    // render...
}
```

Tab gizliyse render etme (battery save).

### 9.5 Mode geçiş paterni

three-scene.js'deki mode crossfade:
- `targetMode` ve `currentMode` ayrı.
- IntersectionObserver targetMode'u değiştirir.
- Her frame `modeFade` 0'dan 1'e ilerler.
- Material opacity'leri `_baseOpacity * modeFade` ile çarpılır.
- modeFade ≥ 1 olduğunda `currentMode = targetMode`, eski mode görünmez.

Yeni bir mode eklemek istersen:
1. `SECTION_MODES`'a section ID → mode mapping ekle.
2. `build<ModeName>()` fonksiyonu yaz, group döndür.
3. `modes.<modeName> = build<ModeName>()`.
4. `animateMode(group, '<modeName>', t)` switch'e case ekle.

### 9.6 Komite stage spesifik kurallar

#### Signature factory pattern

Her signature:
```js
export function <name>({ palette, anchor }) {
    const group = new Group();
    group.position.copy(anchor);
    // ... mesh ekle ...
    return {
        group,
        update(elapsed, dt, intensity) {
            // intensity 0-1 — opacity ve scale için kullan
        },
    };
}
```

`intensity` parametresi stage'den gelir — slide active mı, isolated mode mı kontrol eder. Signature buna göre opacity/scale yapar.

#### Anchor noktası

Yeni signature eklerken `js/scene/anchors.js`'e ekle, mevcut anchor'lardan ≥8 unit uzak olsun. Bu komşu signature'ın frame dışı kalmasını garanti eder.

#### Palette ekleme

`js/scene/stage.js` `SIGNATURE_PALETTES` objesine yeni sig için renk paleti ekle (`{ accent, mist, navy500, navy400, navy300 }` formatında).

#### Signature register

`js/scene/signatures/index.js`'e:
- Import et: `import { yeniSig } from './yeni-sig.js';`
- `signatures` objesine ekle: `'yeni-sig': yeniSig`
- `signatureOrder` array'e ekle (sıra HTML slide sırasıyla eşleşmeli).

#### Bloom parametreleri

`stage.js`:92 `UnrealBloomPass(resolution, strength, radius, threshold)`:
- strength 0.75
- radius 0.55
- threshold 0.12

Bunları değiştirmek tüm imzaları etkiler. Ufak değişiklik bile dramatic.

### 9.7 prefers-reduced-motion handling

- `three-scene.js`:9 `prefersReducedMotion = false` **bilinçli override.** Site animasyon-merkezli, sahneyi tamamen durdurmak design intent'i bozar.
- Lenis (`carousel.js`:55) gerçekten respect ediyor — reduced motion ile smooth scroll devre dışı.
- CSS animation/transition ise `@media (prefers-reduced-motion: reduce)` ile minimize ediliyor.

Bu trade-off'u **değiştirme** kullanıcı açıkça istemeden.

---

## 10. Animasyon Disiplini

### 10.1 CSS transition kuralları

- ❌ `transition: all` — performans + intent belirsizliği.
- ✅ `transition: <property> <duration> <easing>, <property> <duration> <easing>`.
- ✅ Spring easing: `cubic-bezier(0.2, 0.8, 0.2, 1)` veya `cubic-bezier(0.4, 0, 0.2, 1)`.
- ✅ Duration: 0.2-0.4s UI, 0.4-0.6s modal, 0.6-1.5s cinematic.
- ❌ Discrete value (display, position) animate etme (smooth değil).

### 10.2 GSAP kullanımı

GSAP sadece `js/scene/stage.js` içinde kamera tween'leri için:

```js
gsap.to(camPos, { x, y, z, duration, ease: 'power2.inOut' });
gsap.timeline().to(...).to(...);
gsap.killTweensOf(target);  // önemli — yeni tween'den önce eskileri öldür
```

- ✅ Always `killTweensOf` before new tween (state çakışmasını önle).
- ✅ `ease: 'power2.inOut'` veya `power2.out` cinematic.
- ❌ `ease: 'bounce'` — bu projede uyumsuz, modern minimal feel.
- ❌ GSAP'i diğer dosyalara eklemek — sayfa boyutunu artırır, mevcut CSS transition yeterli.

### 10.3 Lenis smooth scroll

Sadece komite section'ında, sadece desktop, sadece prefers-reduced-motion değilse.

```js
const lenis = new window.Lenis({
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
```

`lenis.stop()` / `lenis.start()` modal aç/kapat'ta — modal içeriği native scroll edebilsin.

`data-lenis-prevent` attribute Lenis'i bir element içinde devre dışı bırakır.

### 10.4 Three.js animasyon disiplini

- ✅ `requestAnimationFrame` döngüsü.
- ✅ `dt` (delta time) kullan, frame-rate independent ol.
- ✅ `Math.min(clock.getDelta(), 0.05)` ile büyük delta'ları cap'le (tab geri geldiğinde animation jump'ı önle).
- ❌ `setTimeout` veya `setInterval` ile animation — async, jitter'lı.
- ❌ Sabit frame rate varsay (`* (1/60)` gibi).

### 10.5 Stagger pattern (CSS)

Modal symbol draw'da kullanılan stagger:

```css
.committee-modal.is-open .committee-modal__symbol svg > *:nth-child(1) { animation-delay: 0.1s; }
.committee-modal.is-open .committee-modal__symbol svg > *:nth-child(2) { animation-delay: 0.25s; }
.committee-modal.is-open .committee-modal__symbol svg > *:nth-child(3) { animation-delay: 0.4s; }
/* vs */
```

Yeni stagger'lı animasyon için bu pattern'i izle (max 10 child için yazılmış).

### 10.6 GPU-friendly transform

- ✅ `transform: translate3d`, `translate`, `scale`, `rotate`.
- ❌ `top`, `left`, `width`, `height` animate etme (reflow tetikler).
- ✅ `will-change: transform` hover-tilt gibi GPU yoğun durumlarda.
- ⚠️ `will-change` overuse — sadece gerçekten transform'lanacak element'lerde.

---

## 11. CSS Mimari Kuralları

### 11.1 Token-first yaklaşım

Her CSS rule yazarken kendine sor: "Buradaki değer `var(--something)` olmalı mı?"

- ✅ Renk → `var(--accent)`, `var(--navy-dark)`, vs.
- ✅ Font family → `var(--font-display)`, `var(--font-body)`.
- ✅ Section padding → `var(--section-padding)`.
- ❌ Hardcoded `padding: 100px 0`.

### 11.2 Class naming

İki konvansiyon karışık:
- **Single-dash:** çoğu section ve component (`.team-card`, `.vm-grid`, `.section-team`).
- **BEM double-dash:** komite section'ı (`.committee-slide__head`, `.section--committees`, `.committee-modal__block--full`).

**Yeni kod yazarken:**
- Mevcut section'a ekleme yapıyorsan, o section'ın konvansiyonuna uy.
- Yeni section eklerken BEM (`__` element, `--` modifier) tercih et — daha tutarlı.

### 11.3 Specificity disiplini

- ✅ Single class selector (`.team-card { ... }`).
- ⚠️ Compound (`.team-card .team-photo`) — gereksiz spesifiklik, descendant chain.
- ❌ ID selector (`#hero { ... }`) — specificity yüksek, kullanım sınırlı.
- ❌ `!important` overuse — sadece **consolidate rule** (`.committee, .team-card, ...`) `:hover { transform: ... !important }` gibi cascade işleri için kullanılıyor.

### 11.4 Modifier pattern

`.is-active`, `.is-open`, `.is-zooming`, `.is-hidden`, `.is-loading`, `.is-closed`, `.scrolled`, `.active`, `.menu-open`, `.modal-open`, `.committees-visible`, `.lightbox-open`, `.revealed`, `.hover-tilt`.

Bu state class'ları JS tarafından eklenir/kaldırılır. CSS'te `.element.is-active { ... }` formatında kullan.

### 11.5 Media query stratejisi

Üç breakpoint:
- `max-width: 1024px` — tablet
- `max-width: 768px` — mobil (en sık kullanılan)
- `max-width: 480px` — küçük mobil

Mobile-first değil — desktop CSS default, media query'lerle downsize. `@media (min-width: ...)` ile mobile-first geçmek istersen tüm dosyayı yeniden yaz.

### 11.6 Section background overlay

Yeni section eklerken:
1. `.section-<name>` selector tanımla.
2. `position: relative; isolation: isolate;` (consolidated list'te `.section-faq, .section-sponsors, ...` listesine ekle).
3. Background rgba ile yarı saydam:
   - Açık zemin: `rgba(228, 236, 246, 0.62)` veya `rgba(237, 242, 248, 0.62)`.
   - Koyu zemin: `rgba(58, 100, 167, 0.70)` veya `rgba(44, 86, 165, 0.72)`.
4. Section background rules listesine ekle (CSS'in alt kısımlarında `.section-theme { background: ... }` toplu).

### 11.7 Card hover/tilt sistemine ekleme

Eğer yeni bir kart-stili component oluşturuyorsan ve 3D tilt + glow halo istersen:

1. CSS'te consolidated rule'a class'ı ekle:
   ```css
   .committee, .team-card, .subteam-card, .faq-item, .vm-card, .eventinfo-program, .eventinfo-map, .yeni-card {
       transform-style: preserve-3d;
       transition: transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.35s ease, border-color 0.35s ease !important;
       will-change: transform;
   }
   ```
2. `.yeni-card:hover` consolidated list'ine ekle.
3. Glow halo consolidated list'ine (`.committee::after, ...`) ekle.
4. `js/main.js`:444 `tiltSelector` const'una class'ı ekle.

### 11.8 Renk varyantları

İki context'i unutma:
- **Koyu zemin** (nav-dark, navy-medium): metin `var(--white)`, muted `rgba(255,255,255,0.7-0.85)`.
- **Açık zemin** (off-white, white): metin `var(--text-dark)`, muted `var(--text-on-light-muted)`.

`var(--gray)` (#7B93B8) açık zeminde kontrast düşük, kullanma. `var(--text-on-light-muted)` (#5a6e8a) açık zemin için optimize.

### 11.9 CSS file size

Mevcut `css/style.css` ~2900 satır. Önemli kontrol noktaları:

- Yeni rule ekliyorsan, mevcut bir rule'u extend edemez misin?
- Duplicate selector var mı? Consolidated rule altına almak mümkün mü?
- `!important` gerçekten gerekli mi yoksa specificity yeterli mi?

Single file approach bilinçli — split etmek (örn. `_buttons.css`, `_modal.css`) build step gerektirir, projenin no-build philosophy'sini bozar.

---

## 12. JS Mimari Kuralları

### 12.1 Vanilla ES modules

- `js/main.js` non-module (`<script>`).
- `js/three-scene.js`, `js/carousel.js`, `js/scene/*` module (`<script type="module">`).

**Yeni JS dosyası eklerken:**
- Three.js ile etkileşim varsa → module.
- Sadece DOM event'leri varsa → main.js'ye ekle (tek dosya organize tutmak için).

### 12.2 IIFE pattern (main.js)

`main.js` global scope'a leak etmemek için top-level IIFE'lerle organize edildi:

```js
(function preloader() {
    const fill = document.getElementById('preloaderFill');
    // ... scoped logic ...
})();
```

Yeni özellik eklerken aynı pattern'i izle. Global olarak expose etmek gerekirse `window.<name>` (örn `window.openCommitteeModal`).

### 12.3 Event delegation

Document-level click delegation (lightbox örneği):

```js
document.addEventListener('click', (e) => {
    const z = e.target.closest('.zoomable');
    if (!z || z.tagName !== 'IMG') return;
    e.preventDefault();
    open(z.currentSrc || z.src, z.alt);
});
```

Yeni dynamic content için event delegation kullan, her element'e ayrı listener ekleme.

### 12.4 IntersectionObserver

Scroll-based trigger için:
- `reveal` animasyonları
- stat counter
- section mode (Three.js)

Pattern:
```js
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // ... action ...
            observer.unobserve(entry.target);  // one-shot
        }
    });
}, { threshold: 0.15 });
document.querySelectorAll('.X').forEach(el => observer.observe(el));
```

Threshold dikkatli seç:
- `0.15` (15% görünür) — reveal animasyonları için yeterli.
- `0.5` (yarısı görünür) — stat counter (görmeden sayma başlamasın).
- `0.25, 0.5, 0.75` array — mode detection (multiple checkpoints).

### 12.5 requestAnimationFrame throttle

Yüksek-frekanslı event'ler (scroll, mousemove) için:

```js
let raf = 0;
function tick() {
    raf = 0;
    // ... actual work ...
}
window.addEventListener('scroll', () => {
    if (!raf) raf = requestAnimationFrame(tick);
}, { passive: true });
```

`{ passive: true }` scroll listener'da zorunlu (browser scroll'u block etmesin).

### 12.6 Custom events (component iletişimi)

`main.js` ↔ `three-scene.js` ↔ `carousel.js` arası custom event'lerle iletişir:

- `card-enter` `{x, y}` — card hover entry, burst tetikler.
- `card-hover` `{x, y, active}` — orb scale state.
- `preloader:done` — preloader bitti.
- `committee-modal:opened` `{key, sig}` — modal açıldı, stage zoom + isolate.
- `committee-modal:closed` — modal kapandı, stage zoom out.

Yeni component iletişimi için aynı pattern kullan, direct global mutation yerine event dispatch tercih et.

### 12.7 Error boundaries

Vanilla JS'de proper error boundary yok. Best practice:
- Try/catch external API çağrılarında.
- DOM element null check (`if (!el) return`).
- Three.js sahnesinde `console.log` veya `console.error` debug için OK ama production'da temizle.

### 12.8 Async / await

Mevcut codebase'de async kullanımı çok sınırlı (sadece DeviceOrientationEvent.requestPermission). Yeni async kod yazarken:

- Promise rejection'ları handle et (`try/catch` veya `.catch`).
- async fonksiyonu IIFE'den çağırma (`(async () => { ... })()`).

### 12.9 Modül import'ları

`js/scene/*` içinde Three.js'den sadece kullanılan class'ları import et:

```js
import { Group, Points, BufferGeometry, Float32BufferAttribute, PointsMaterial, Color, AdditiveBlending } from 'three';
```

`import * as THREE from 'three'` daha az preferred (tree-shake yok ama bundle yok ya — sadece okunabilirlik için spesifik daha iyi).

### 12.10 Type safety yok

TypeScript yok, JSDoc tipler yok. Tip hatalarını runtime'da yakalarız. Defensive coding:
- Optional chain (`?.`) DOM query sonuçlarında.
- Default values (`?? 0`, `|| ''`).
- Array.isArray checks.

---

## 13. Erişilebilirlik Kontrol Listesi

Her yeni feature/değişiklikte aşağıdaki check'leri yap:

### 13.1 Anlamlı HTML

- ✅ `<section>`, `<article>`, `<nav>`, `<header>`, `<footer>` semantik tag'ler.
- ✅ `<h1>`-`<h6>` hierarchy düzgün (skip yapma — h1'den sonra h3 değil h2).
- ✅ `<button>` interactive element'ler için (div+onclick yerine).
- ✅ `<a>` link'ler için (button-styled link de olabilir, `href` zorunlu).

### 13.2 Alt text

- ✅ Her `<img>` `alt` attribute (boş `alt=""` dekoratif için OK).
- ✅ Anlamlı: alt="Maltepe Fen Lisesi logosu", "FBÇ '25 etkinliğinden kareler".
- ❌ `alt="image"` veya `alt="picture"` — değersiz.
- ❌ Filename'i alt olarak kullanma.

### 13.3 Form labels

- ✅ Her input bir `<label>`'a bağlı (`for` attribute veya wrap).
- ✅ Placeholder ≠ label (placeholder kaybolur, label kalır).

(Bu projede form yok ama yeni eklersen kural geçerli.)

### 13.4 ARIA

- ✅ `aria-label` icon-only butonlarda (hamburger, modal close, social link).
- ✅ `aria-expanded` accordion/dropdown'larda.
- ✅ `aria-selected` tab'larda.
- ✅ `aria-controls` tab → panel ilişkisi.
- ✅ `aria-modal="true"` modal'larda.
- ✅ `aria-hidden="true"` dekoratif element'lerde (Three.js canvas, scroll progress, icons).
- ✅ `aria-disabled="true"` `.is-closed` durumlu CTA'larda.
- ✅ `role="dialog"` modal'larda.
- ✅ `role="status" aria-live="polite"` dinamik durum bildirimi (preloader).
- ✅ `role="button"`, `tabindex="0"` non-button interactive element'lerde (örn `.committee-slide`).

### 13.5 Klavye erişilebilirliği

- ✅ Tab ile her interactive element'e ulaş.
- ✅ Enter/Space ile aktivasyon.
- ✅ Escape ile modal/lightbox kapatma.
- ✅ Focus visible (focus ring veya `:focus-visible` style).

#### Focus ring kuralı

Default `outline: none` set etmek yerine:
```css
.element:focus { outline: none; }
.element:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
```

Veya kart-stili element'lerde:
```css
.committee-slide:focus-visible {
    border-color: #C88A3E;
    box-shadow: 0 0 0 3px rgba(200, 138, 62, 0.35), ...;
}
```

### 13.6 Color contrast

- WCAG AA için ≥4.5:1 (normal text), ≥3:1 (large text).
- WCAG AAA için ≥7:1.
- Mevcut palette'de:
  - `var(--text-dark)` (#2C56A5) on white → 7:1 AAA ✅
  - `var(--white)` on `var(--navy-dark)` → 10:1 AAA ✅
  - `var(--gray)` (#7B93B8) on white → 3.4:1 AA fail ❌ (kullanım sınırlı)
  - `var(--accent)` (#819FCD) on white → 2.5:1 AA fail ❌ (sadece button bg veya emphasis için, body text değil)

### 13.7 Reduced motion

- CSS `@media (prefers-reduced-motion: reduce)` aktif (animation/transition 0ms).
- Three.js bilinçli olarak respect etmiyor (tasarım kararı).
- Lenis respect ediyor (smooth scroll off).

Yeni animasyon eklerken: `@media (prefers-reduced-motion: reduce)` ile fallback bırak (özellikle CSS animation'larda).

### 13.8 Touch target size

Minimum 44×44px (`var(--touch-min)`). Mobile'da küçük buton kullanma. Hamburger, modal close, mobile menu items hepsi 44+ px.

---

## 14. Test ve Doğrulama Protokolü

### 14.1 Local server kurma

Python yoksa node ile:

```bash
node -e "const http=require('http'),fs=require('fs'),path=require('path');const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.jpeg':'image/jpeg','.jpg':'image/jpeg','.svg':'image/svg+xml','.ico':'image/x-icon','.json':'application/json'};http.createServer((req,res)=>{let u=decodeURIComponent(req.url.split('?')[0]);if(u==='/')u='/index.html';const f=path.join(process.cwd(),u);fs.readFile(f,(e,d)=>{if(e){res.writeHead(404);res.end('404 '+u);return}res.writeHead(200,{'Content-Type':types[path.extname(f).toLowerCase()]||'application/octet-stream'});res.end(d)})}).listen(8000,()=>console.log('listening'))"
```

`file://` çalışmaz (ES modules engelli).

### 14.2 Browser DevTools açma

1. F12 veya Cmd+Opt+I (Mac) ile DevTools aç.
2. Console tab → JS hatası var mı?
3. Network tab → 404 var mı (Vercel insights 404 hariç, beklenir)?
4. Lighthouse → Performance/Accessibility/Best Practices/SEO skor.

### 14.3 Viewport kontrol

DevTools'ta device emulation:
- **Mobile (375px)**: iPhone SE, iPhone 12.
- **Tablet (768-1024px)**: iPad.
- **Desktop (1440px)**: standart laptop.
- **Wide (1920px+)**: full HD monitor.

Her viewport'ta:
- ✅ Layout bozulmuyor (overflow, ezilme yok).
- ✅ Tüm görseller yükleniyor.
- ✅ Three.js sahnesi render oluyor (bg-canvas görünür).
- ✅ Mobile menü açılıp kapanıyor.
- ✅ Komite slide'ları doğru görünüyor (mobil: dikey kart, desktop: 3D sahne).

### 14.4 Klavye nav

- Tab ile tüm interactive element'lere ulaşıyorsun.
- Focus visible (ring veya stilize state).
- Enter/Space ile aktive ediyor.
- Escape modal/lightbox kapatıyor.

### 14.5 Türkçe karakter

- ğ, ş, ı, İ, ç, ö, ü doğru render oluyor.
- Yeni section eklerken kontrol et — utf-8 BOM yok, file encoding utf-8.

### 14.6 Modal açma akışı

1. Komite kartına tıkla.
2. CSS zoom (`is-zooming`) → 720ms sonra modal.
3. Modal symbol draw + content stagger animasyonu.
4. Modal close (X, backdrop, Escape) → 400ms transition.

Her komite (7 tane) için manual click test — symbol SVG farklı, draw animasyonu farklı görünmeli.

### 14.7 Performans check

- Three.js FPS: 60 hedef, ≥30 kabul.
- CPU profile: spike yok, sustained <%30 (mobil <%50).
- Memory leak: 5 dakika sayfada kal, memory artmıyor.

### 14.8 Beklenen 404'ler

Production'da çalışan ama local'de 404 verenler:
- `/_vercel/insights/script.js` — Vercel Analytics
- `/_vercel/speed-insights/script.js` — Vercel Speed Insights

Bunları görmezden gel.

---

## 15. Yaygın Tuzaklar (Pitfalls)

### 15.1 Image path bozma

Görsel yeniden adlandırırken/taşırken **tüm referansları** güncelle:
- `index.html` içinde (`<img src="">`).
- `index.html` içinde anchor link (`<a href="">`).
- `css/style.css` içinde `background-image: url(...)`.
- `js/*.js` içinde dynamic image src.

```bash
grep -rn "old-image-name" .
```

Hata: bir referans güncel kalmaz, broken image olarak görünür.

### 15.2 CSS variable adı değişikliği

Variable yeniden adlandırırsan tüm projede `var(--eski-isim)` kullanan yerleri güncelle. Mevcut variable'lar:
- 13 navy/accent variant
- 7 neutral
- 2 font
- 4 spacing
- 2 transition
- 5 typography helper

`Grep -n "--navy-light"` gibi tek tek bul/güncelle.

### 15.3 Three.js mode listesinde eksiklik

Yeni section eklediğinde `SECTION_MODES`'a section ID'yi eklemezsen, default mode (`'flow'`) kullanılır — istemediğin görüntü olabilir.

Aynı şekilde `DARK_SECTIONS`'a eklemezsen theme switching çalışmaz.

### 15.4 Reveal animation eksikliği

Yeni element'i animate görünür yapmak istiyorsan `<div class="... reveal">` ekle. JS IntersectionObserver `.reveal` selector'unu izler. Class yoksa initial `opacity: 0; transform: translateY(20px)` state'i kalır.

### 15.5 Modal symbol SVG hatası

Komite modal'ı açtığında symbol draw çalışmazsa:
- SVG `<path>`, `<circle>`, `<rect>`, `<ellipse>`, `<line>`, `<polyline>`, `<polygon>` element'leri olmalı.
- `getTotalLength()` SVGGeometryElement method'u, sadece bu tag'lerde var.
- `<g>` veya `<text>` `getTotalLength()` desteklemez → atlanır, draw animation çalışmaz o element'te.

### 15.6 GSAP referans hatası

GSAP defer ile yüklendiği için `js/main.js` (non-module, doğrudan çalışır) gsap'i kullanamaz. Sadece `js/scene/stage.js` (module, defer'a benzer davranır) `window.gsap` referansını kullanır.

main.js'de GSAP kullanmak istersen `<script>` etiketini defer yap ve script'i body sonuna al (zaten orada).

### 15.7 Importmap eksikliği

`<script type="module">` Three.js import'u yapacaksa, importmap **mutlaka önce** yüklü olmalı.

```html
<script type="importmap">
{ "imports": { "three": "...", "three/addons/": "..." } }
</script>
<script type="module" src="..."></script>  <!-- bundan sonra -->
```

### 15.8 Z-index çakışması

Yeni overlay/modal element'i için z-index seçerken PROJECT_SUMMARY.md Bölüm 4.18 z-index katmanlarına bak. Mantıksız sayı verme (`z-index: 9999` her şeyin üstüne — preloader hariç gerekirse).

### 15.9 Mobile menu kapanmama

Mobile menü açıldıktan sonra `body.menu-open` ile scroll lock olur. Kullanıcı menüyü kapatmadan sayfa içi link'e tıklarsa `closeNav()` çağrıldığına emin ol. Aksi takdirde body scroll lock'lu kalır.

### 15.10 Lenis ve native scroll çakışması

Lenis komite section'ında smooth scroll yapıyor. Modal açıldığında `lenis.stop()` çağrılmazsa modal içeriğinin scroll'u tetiklemez. Yeni dynamic content eklerken Lenis state'i izle.

### 15.11 Stage tick durması

`carousel.js` tick loop'u sadece `inView || modalOpen` olduğunda çalışır. Programmatic olarak başka durumlarda render ettirmek istiyorsan `loop(performance.now())` manuel çağır.

### 15.12 Three.js memory leak

Mesh/Geometry/Material/Texture'ları runtime'da yaratıp dispose etmezsen memory artar. Şu an stage signature'lar bir kez yaratılıp tutuluyor; dispose sadece destroy()'da çağrılıyor — şu an çağrılmıyor (sayfa unload otomatik temizler).

Yeni mesh runtime'da yaratıyorsan `disposeMaterial`, `geometry.dispose()` unutma.

### 15.13 CSS class ismi typo

`.team-cards` (typo, doğrusu `.team-card`) HTML'de yazılırsa CSS uygulanmaz. Yeni class eklerken HTML+CSS+JS tutarlılığını kontrol et.

### 15.14 SVG renk override

Inline SVG `fill="currentColor"` veya `stroke="currentColor"` ile yazıldıysa CSS `color` property'si rengi kontrol eder. `fill="#ABCDEF"` hardcoded olursa CSS override edemez.

Mevcut SVG'lerde `currentColor` pattern'i yaygın — yeni SVG eklerken bu konvansiyona uy.

### 15.15 Font weight load error

Inter veya Playfair'in yüklenmemiş bir weight'i kullanırsan (örn Inter 300, hiç yüklü değil) browser fallback yapar veya artificial weight gösterir. Mevcut yüklü weight'ler:
- Inter: 400, 500, 600, 700, 800
- Playfair Display: 700

Yeni weight gerekirse Google Fonts link'i güncelle.

---

## 16. Git ve Commit Disiplini

### 16.1 Commit mesaj formatı

Türkçe, `tür: açıklama` formatı (mevcut konvansiyon):
- `fix:` hata düzeltme
- `style:` görsel/CSS değişiklik
- `feat:` yeni özellik
- `refactor:` kod yapısı düzenleme (davranış değişmez)
- `docs:` doküman değişikliği (CLAUDE.md, README, vb.)
- `chore:` build/config/deps değişikliği

Örnekler:
- `fix(faq): tıklamada açılmayan accordion`
- `style(hero): countdown stil iyileştirmesi`
- `feat(komiteler): 8. komite eklendi`
- `refactor(css): kullanılmayan card hover rule'ları silindi`

### 16.2 Commit kuralları

- ❌ Kullanıcı açıkça istemeden commit atma.
- ❌ Tek commit'te ilgisiz değişiklikler karıştırma.
- ❌ `git commit --amend` ile geçmişi yeniden yazma (kullanıcı istemeden).
- ❌ `git push --force` (kullanıcı istemeden).
- ❌ Pre-commit hook'u `--no-verify` ile atlama.

### 16.3 Pre-commit kontrol

Commit'ten önce:
- ✅ `git status` ile değişiklik listesini göz at.
- ✅ `git diff` ile değişiklikleri review et.
- ✅ Hiçbir secret/credential commit edilmediğinden emin ol.
- ✅ `.env`, `*.key`, `*.pem` gitignored.

### 16.4 Branch stratejisi

- Main branch: `main`. Bu branch'e push → Vercel deploy.
- Feature branch: küçük projede genelde kullanılmıyor; doğrudan main'e işleniyor.
- Büyük değişiklik için feature branch açılabilir (örn `feat/yeni-kayit-formu`), PR ile merge.

### 16.5 Co-author attribution

Claude commit yaparsa:

```
Co-Authored-By: Claude <noreply@anthropic.com>
```

(commit-commands skill'i bunu otomatik ekler.)

### 16.6 PR pattern (commit-commands skill kullanımı)

`commit-commands:commit-push-pr` skill PR oluştururken:

```
gh pr create --title "fix: kısa başlık" --body "<heredoc>
## Summary
- Bullet 1
- Bullet 2

## Test plan
- [ ] Manual test step
- [ ] Browser check (mobile + desktop)

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF"
```

---

## 17. Dokunulmaz Liste

Aşağıdaki şeylere kullanıcı açıkça istemeden DOKUNMA:

### 17.1 Dosya yapısı

- `package.json` ekleme — bu proje bilinçli no-build.
- `node_modules/` ekleme.
- Build tool config (`webpack.config.js`, `vite.config.js`, `tsconfig.json`, etc.).
- `index.html`'i çoklu dosyaya bölme.
- `css/style.css`'i parça parça yapma.

### 17.2 Asset'ler

- `assets/images/` altındaki dosyaları silme veya yeniden adlandırma (referansları paralel güncellersen istisna).
- Logo dosyalarını (`brand/mfl.png`, `brand/fbc.png`) değiştirme.
- Sponsor logolarını değiştirme.

### 17.3 CSS variables

- `:root` blokundaki variable isimlerini değiştirme.
- Mevcut value'ları **rastgele** değiştirme (kullanıcı talep ederse OK).
- Yeni variable eklerken kategori grupuna ekle (Navy/Accent/Neutral/Typography/Spacing/etc).

### 17.4 İçerik

- Komite sırası: HTML'de slide sırası = signature sırası = anchor sırası — birlikte güncellenmeli.
- Sorumlu öğretmen sırası: yetki hiyerarşisi (Başdanışman → Danışmanlar).
- Alt ekip sırası: yetki hiyerarşisi (Genel Koord → Yardımcı → PR → Press → Akademi → Lojistik → Saha).
- Akademisyen isimleri / kurum isimleri — typo dışında değişmesin.
- Etkinlik tarihi (`9-10 Mayıs 2026`) — değişirse 5+ yerde güncellenmeli (hero, schema.org, countdown target, FAQ, footer).

### 17.5 External dependencies

- Three.js sürümünü güncelleme — major version breaking change olabilir, test gerekli.
- GSAP / Lenis sürümünü güncelleme.
- Google Fonts'a yeni font ekleme — page weight artar.

### 17.6 Vercel config

- `vercel.json` sadece `trailingSlash: false` — buna ekleme yapma kullanıcı açıkça istemeden.

### 17.7 Three.js sahne mimari

- `SECTION_MODES` mapping — section silinmezse modunu silme.
- `SIGNATURE_PALETTES` — komite silinmezse paleti silme.
- `anchors` — komite silinmezse anchor'u silme.
- Bloom parametreleri — dramatic değişim, test gerekli.

---

## 18. Hata Halinde Yol Haritası

### 18.1 Bir şey çalışmıyor — adım adım teşhis

1. **Konsol açık mı?** F12 → Console tab → JS hatası var mı?
2. **Network 200 mü?** Network tab → kırmızı (404/500) yok mu (Vercel insights hariç)?
3. **DOM elementi var mı?** Inspect → element gerçekten DOM'da mı?
4. **CSS uygulanıyor mu?** Inspect → Computed tab → expected style var mı?
5. **JS listener bağlandı mı?** Console'da `getEventListeners(el)` (Chrome) veya inspect → Event Listeners tab.

### 18.2 Image broken

1. Network tab'de hangi URL 404 veriyor?
2. `assets/images/<path>/<file>` gerçek dosya mı? `ls assets/images/...` ile check.
3. HTML'de yazılı yol typo mu?
4. Case sensitive mi? (Linux/Vercel case-sensitive, Windows local case-insensitive — sürpriz olabilir).

### 18.3 Three.js sahne kara/boş

1. `console.error` Three.js render hatası var mı?
2. `js/three-scene.js` veya `stage.js` import path'leri doğru mu?
3. Importmap mevcut script'lerden önce mi yükleniyor?
4. WebGL context kayıp mı? (Inspect → Sources → console: `renderer.getContext()` → null değil mi?)
5. `canvas` element'i visible mi (display: none veya opacity: 0)?

### 18.4 Modal açılmıyor

1. `window.openCommitteeModal` console'da fonksiyon mu? (Test: `console.log(typeof window.openCommitteeModal)`).
2. `COMMITTEE_DATA[key]` key formatı `'C/01'` mi (slash dahil)?
3. `#committeeModal` element'i DOM'da mı?
4. `committee-modal:opened` event dispatch ediliyor mu (Carousel.js listener'da `console.log` ile check)?

### 18.5 Mobile menü stuck açık

1. `closeNav()` çağrıldı mı (hamburger tıklandığında)?
2. `body.menu-open` class'ı kaldırıldı mı?
3. `.mobile-menu.active` class'ı kaldırıldı mı?

### 18.6 Build/deploy hatası (Vercel)

- Vercel dashboard'da build log oku.
- Static asset transfer + Vercel CDN için config sorunu olası değil.
- vercel.json invalid JSON olabilir — `jq . vercel.json` ile validate et.
- 404'ler için `vercel.json`'da rewrite/redirect kontrol et.

### 18.7 Performance regression

1. Lighthouse Performance skor düştü mü?
2. Three.js mesh sayısı arttı mı? (Inspect Three.js scene: `scene.children.length`).
3. Yeni image çok büyük mü? (Network tab → Size column).
4. Yeni external CDN script eklendi mi? (Sayfa boyutunu artırır.)

### 18.8 CSS değişikliği görünmüyor

1. Browser cache temizle (Ctrl+Shift+R hard reload).
2. CSS specificity overide olabilir — Inspect → Computed tab → diğer rule daha spesifik mi?
3. `!important` ile cascade kırılmış mı?
4. CSS variable doğru `var(--name)` yazılmış mı (typo? `var(--Name)` case sensitive)?

---

## 19. Dosya-bazlı Edit Kuralları

### 19.1 `index.html` edit kuralları

- **1040+ satır, single file.** Tüm dosyayı oku DEME (token limit aşar) — offset/limit kullan.
- Section değiştirirken section başlık yorumunu (`<!-- ==================== HERO ==================== -->`) koru, ileride dosyada gezinmek için işaretli.
- Inline SVG'leri düzenlerken `viewBox`, `width`, `height`, `fill`, `stroke` attribute'larını kontrol et.
- Türkçe karakter düzgün, UTF-8 BOM yok — yeni içerik ekledikten sonra ğ/ş/ı bozulmadığını teyit et.
- Schema.org JSON-LD edit edilirken JSON validation yap (bozarsan rich snippet kırılır).

### 19.2 `css/style.css` edit kuralları

- **2900+ satır.** Bütünü okuma — offset/limit ile parça parça.
- Yeni rule'u ilgili bölümün altına ekle (HEAD'den arayarak bul, örn `/* ==================== TEAM ==================== */`).
- Duplicate selector eklemekten kaçın — consolidated rule'a katıl mümkünse.
- `!important` overuse'u arttırma — mevcut `!important`'ler bilinçli (consolidated override için).
- Mobile breakpoint'leri (`@media max-width: 768px`) dosyanın altına yakın yerlerde toplandı.
- CSS variable kullan, hardcoded value yazma.

### 19.3 `js/main.js` edit kuralları

- **570+ satır, non-module.** IIFE pattern'ini izle.
- Top-level code'da hassas: yüklenme sırası önemli (countdown önce başlamalı, modal listener'lar `committeeModal` exist check'ten sonra).
- Yeni feature için yeni IIFE ekle, mevcut IIFE'leri büyütme.
- Global expose gerekirse `window.<isim>` (örn `window.openCommitteeModal`).
- Console.log production'da bırakma (sadece error handler'da OK).

### 19.4 `js/three-scene.js` edit kuralları

- **870+ satır, module.** Tek dosya, IIFE değil — top-level import + execute.
- Yeni mode eklerken:
  - `SECTION_MODES`'a section → mode ekle.
  - `build<ModeName>()` fonksiyon yaz, Group döndür.
  - `modes.<modeName> = build<ModeName>();` register et.
  - Loop'ta `modes.<modeName>.visible = false;` initial state.
  - `animateMode(modes.<modeName>, '<modeName>', t);` çağrı ekle.
  - Switch-case'e `case '<modeName>':` ekle.
- Performance: yeni geometry ekleme sınırlı tut, mobile'da paralleştirme YAP.
- Material clone'lamak yerine reuse et mümkünse.

### 19.5 `js/carousel.js` edit kuralları

- **200+ satır, module.** DOMContentLoaded sonrası çalışır.
- Mobile path ayrı (Three.js sahnesi yok) — yeni feature mobile'da çalışacak mı, ayrı düşün.
- Lenis ile uyum: yeni listener ekleyeceksen `lenis.stop()` / `start()` event'lerini kontrol et.
- Modal events dinleyici sayısı arttıkça `addEventListener` cleanup unutma.

### 19.6 `js/scene/stage.js` edit kuralları

- **320+ satır, module, en karmaşık.** Stage init pattern'ini koru.
- Yeni signature register etmek için `signatures` ve `signatureOrder` paralel güncelle (`signatures/index.js`).
- Camera tween logic'ini değiştirmek istersen `tweenCameraTo`'nun GTA arc detection'ını dikkatli koru (`useGtaArc` condition).
- `applySplit`, `syncMirror` rotation sync detaylı — mirror twin logic'i bozarsan rendering yanlış olur.
- Bloom parametrelerini değiştirmeden önce iki farklı durum (idle vs active) için test et.

### 19.7 `js/scene/signatures/*` edit kuralları

- Her signature `({ palette, anchor })` alır, `{ group, update }` döner — pattern'i koru.
- `update(elapsed, dt, intensity)` signature: elapsed total time, dt frame delta, intensity 0-1.
- Group'a `position.copy(anchor)` setupta zorunlu.
- Yeni signature dosyası: `js/scene/signatures/<sig>.js`, default export değil, named export.
- `index.js`'e register et: import, signatures objesi, signatureOrder array.

### 19.8 `assets/images/*` edit kuralları

- Yeni image kategori klasörüne koy (`brand/`, `sponsors/`, `team/`, `past-2025/`, `program/`).
- Yeni kategori klasörü açabilirsin (örn `awards/`, `partners/`).
- Naming: lowercase-kebab.png/jpeg, ASCII-only.
- HTML'de path: `assets/images/<kategori>/<isim>.<ext>`.
- Optimization: PNG → WebP dönüşüm bilinçli yapılabilir (boyut tasarrufu) ama browser support kontrol et.

### 19.9 `CLAUDE.md` edit kuralları

- Bu doküman operasyonel kuralname — proje değiştikçe güncel kalmalı.
- Yeni bir kural eklerken İçindekiler'i de güncelle.
- Padding ekleme — her satır pratik bilgi taşımalı.
- Türkçe yaz (mevcut konvansiyon).

### 19.10 `PROJECT_SUMMARY.md` edit kuralları

- Proje değişimleri (section eklenmesi, dosya yapısı değişikliği) burada da güncellenmeli.
- Bölüm 3 (index.html section'lar) yeni section eklendiğinde genişlet.
- Bölüm 9 (class isimleri sözlüğü) yeni class eklendiğinde güncelle.
- Bölüm 13 (tasarım kararları) yeni karar alındığında not düş.

### 19.11 `vercel.json` edit kuralları

- Minimum konfigürasyon ile yaşa.
- Yeni redirect/rewrite ekleyeceksen mantığı kullanıcıya açıkla.
- Build settings (`buildCommand`, `outputDirectory`) ekleme — proje no-build.

### 19.12 `.gitignore` edit kuralları

- OS junk + editor temp + node_modules + .vercel zaten kapsanmış.
- Yeni temp/build/secret dosya için ignore ekle.
- Asset dosyaları (PNG/JPG/SVG) ignore ETME — repo'da olmalı.

---

## 20. Performans Kuralları (genel)

### 20.1 Image weight

- PNG transparent gereksiz → JPEG kullan.
- Large image (>500 KB) → WebP veya squoosh ile optimize.
- Responsive: `<img srcset="...">` ekle gerekirse (mevcut sitede yok).
- `loading="lazy"` viewport altı image'larda (mevcut: harita iframe'leri lazy).

### 20.2 Script weight

- Three.js, GSAP, Lenis CDN ile yüklü (~200 KB minified gzip).
- Yeni library eklemek 50+ KB ekler — gerçekten gerekli mi?
- `defer` kullanılıyor — DOM parse'ı bloklamaz.

### 20.3 Font weight

- Inter 5 weight + Playfair 1 weight = ~150 KB ek.
- Yeni weight gerekirse trade-off değerlendir.
- `display=swap` zaten ayarlı (FOIT yerine FOUT).

### 20.4 CSS specificity & re-layout

- `transform` ve `opacity` GPU friendly.
- `width`, `height`, `top`, `left` re-layout tetikler — kullanım sınırlı tut.
- `will-change: transform` GPU hint, ama overuse'da memory artar.

### 20.5 JS event listener sayısı

- Document-level delegation tercih (lightbox, modal close).
- Çok element'e ayrı listener: stat-counter, reveal observer gibi tek-shot pattern'lerle minimize edildi.

### 20.6 Three.js draw call

- Her mesh = bir draw call.
- Instance rendering ile aynı geometry birden çok kez (Three.js InstancedMesh).
- Mevcut sahnelerde InstancedMesh kullanılmıyor — ufak optimization fırsatı.

### 20.7 IntersectionObserver vs scroll listener

- Scroll listener her frame fire eder (debounce/throttle gerekli).
- IntersectionObserver browser'a delegate eder (daha verimli).
- Mevcut codebase: reveal, stat counter, Three.js section observer IntersectionObserver kullanır. Navbar scroll listener manual.

### 20.8 RequestAnimationFrame disiplini

- 60fps hedef: her frame ~16.67ms.
- `dt > 0.05` (50ms tab idle) — animasyon jump'ı önle.
- visibility hidden'da `requestAnimationFrame` zaten otomatik pauses (modern browser).

---

## 21. Edit Yapmadan Önce Son Kontrol Listesi

Edit'e başlamadan önce 30 saniye:

- [ ] Doğru dosya mı? (index.html vs css/style.css vs js/main.js — değişiklik hangisinde olmalı?)
- [ ] Brainstorming gerekli mi? (Bölüm 4'e bak.)
- [ ] İlgili skill çağrıldı mı? (Bölüm 3.)
- [ ] Etkilenecek referans/dosya/class hepsi listelendi mi?
- [ ] CSS variable / design token kullanılıyor mu? (Hardcoded yok.)
- [ ] Anti-generic kuralları geçti mi? (Renk, shadow, transition.)
- [ ] Türkçe karakter doğru mu?
- [ ] Accessibility check (alt, aria, focus)?
- [ ] Mobile + desktop test planı var mı?

Edit'ten sonra:

- [ ] Tüm referanslar tutarlı mı? (Grep ile doğrula.)
- [ ] Konsol hatası yok mu? (Local server'da aç.)
- [ ] Görsel olarak doğru mu? (Tarayıcıda doğrula.)
- [ ] Performance regression yok mu?
- [ ] Kullanıcıya kısa rapor: ne değişti, hangi dosya, hangi satır.

Bu liste her görev için ezbere geçmeli — yarım dakikalık disiplin saatlerce hata ayıklamayı önler.

---

## Notlar

- Bu doküman PROJECT_SUMMARY.md ile birlikte çalışır. **Kural** burada, **bilgi/referans** PROJECT_SUMMARY'de.
- Yeni bir görev başlamadan önce ikisini de hızlıca tara (kural çakışması var mı, ilgili kural hangisi).
- Kullanıcı talimatı her şeyden üstündür. Bir kural seni durduruyorsa ve kullanıcı açıkça istiyorsa, kullanıcının dediğini yap, sonra kuralı güncelle (kullanıcı pattern değişikliği yaptıysa).
- Kuraldan emin değilsen sor. Soruyu sormadan önce ilgili bölümü tekrar oku.

Bu doküman canlı bir kuralname'dir — proje evrildikçe genişletilir, daraltılır. Padding ekleme, gereksiz kuralı silme.
