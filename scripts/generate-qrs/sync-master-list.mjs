// MFL FBÇ '26 — Master katılımcı listesi senkronizasyonu
// Çalıştırma:
//   SB_SVC=<service_role_key> node sync-master-list.mjs        (dry-run, sadece diff)
//   SB_SVC=<service_role_key> node sync-master-list.mjs --execute  (uygulama)

const SB_URL = 'https://sfoimuxbvxbwywujoeoa.supabase.co';
const SB_SVC = process.env.SB_SVC;
if (!SB_SVC) { console.error('SB_SVC env var lazım'); process.exit(1); }
const EXECUTE = process.argv.includes('--execute');

// ------------------------- MASTER LİSTE -------------------------
// PDF 1 (kabul edilenler) + PDF 2 (geç başvurular) + 5 yeni
// Email normalize edildi (lowercase, .coM/.cm typo düzeltildi)
const master = [
  // Kuantum Fiziği
  { n: 'Ayça Karaca',           e: 'aychakaraca456@gmail.com',                 c: 'Kuantum Fiziği' },
  { n: 'Fatma Zehra Yazar',     e: 'fatmazehrayazar28@gmail.com',              c: 'Kuantum Fiziği' },
  { n: 'Burak Taşkın',          e: 'buraktaskin0953@gmail.com',                c: 'Kuantum Fiziği' },
  { n: 'Ömer Polat',            e: 'omerpolat2809@gmail.com',                  c: 'Kuantum Fiziği' },
  { n: 'Ege Hilmi Kendir',      e: 'hegekendir@gmail.com',                     c: 'Kuantum Fiziği' },
  { n: 'Burak Esen Kopuz',      e: 'burakesenkopuz@maltepefenlisesi.k12.tr',   c: 'Kuantum Fiziği' },
  { n: 'Alper Bora Cengiz',     e: 'alperboracengiz@gmail.com',                c: 'Kuantum Fiziği' },
  { n: 'Zeynep Adra Yıldız',    e: 'zay62011@gmail.com',                       c: 'Kuantum Fiziği' },
  { n: 'Gonca Uzunoğlu',        e: 'goncauzunoglu18@gmail.com',                c: 'Kuantum Fiziği' },
  { n: 'Duru Çakmaz',           e: 'durucakmaz@gmail.com',                     c: 'Kuantum Fiziği' },
  { n: 'Sine Ecrin Göktaş',     e: 'sineecringoktas@gmail.com',                c: 'Kuantum Fiziği' },
  { n: 'Meryem Şahin',          e: 'sahiinnmeryem@icloud.com',                 c: 'Kuantum Fiziği' },
  { n: 'Zeynep Elif Söğüt',     e: 'sogutzeynepelif@gmail.com',                c: 'Kuantum Fiziği' },

  // Nöropsikoloji
  { n: 'Halime İrem Işıkhan',   e: null,                                       c: 'Nöropsikoloji' }, // sadece telefon
  { n: 'Ferah Alizade',         e: 'ferahalizade@gmail.com',                   c: 'Nöropsikoloji' },
  { n: 'Ayşe Ceren Özakın',     e: 'asecern10@gmail.com',                      c: 'Nöropsikoloji' },
  { n: 'Deniz Gülsün Şentürk',  e: 'denizg.senturk@gmail.com',                 c: 'Nöropsikoloji' },
  { n: 'Yade Vural',            e: 'chronosaurus255@gmail.com',                c: 'Nöropsikoloji' },
  { n: 'Duru Tuğsem Taner',     e: 'durutugsem3@gmail.com',                    c: 'Nöropsikoloji' },
  { n: 'Melik Esat Koçal',      e: 'estkcl1967@gmail.com',                     c: 'Nöropsikoloji' },
  { n: 'İrem Naz Özyurt',       e: 'iremnozyurt@gmail.com',                    c: 'Nöropsikoloji' },
  { n: 'Ravzanur Baltacı',      e: 'r.baltacii19@icloud.com',                  c: 'Nöropsikoloji' },
  { n: 'Miray Bektaş',          e: 'miraybktas@icloud.com',                    c: 'Nöropsikoloji' },
  { n: 'Hüseyin Tuna Odabaşı',  e: 'tunaodabasi2010@gmail.com',                c: 'Nöropsikoloji' },
  { n: 'Beyzanur Ekin',         e: 'ekinbeyzanur35@gmail.com',                 c: 'Nöropsikoloji' },
  { n: 'Doğa Yonar',            e: 'dogayonar@gmail.com',                      c: 'Nöropsikoloji' },
  { n: 'Zeynep Asu Aydın',      e: 'aydinzeynepasu@gmail.com',                 c: 'Nöropsikoloji' },
  { n: 'Zeynep Öykü Yenigün',   e: 'oykuyenigunbilsem@gmail.com',              c: 'Nöropsikoloji' },
  { n: 'Nilay Polat',           e: 'nilay.polat3333@gmail.com',                c: 'Nöropsikoloji' },
  { n: 'Ecrin Şimal Fidan',     e: 'ecrn08sml16fdn@gmail.com',                 c: 'Nöropsikoloji' }, // typo .cm fixed
  { n: 'Gülbeyaz Sude Yücel',   e: 'gulbeyazsude58@gmail.com',                 c: 'Nöropsikoloji' },
  { n: 'Damla Akgül',           e: 'dmlakgl2404@gmail.com',                    c: 'Nöropsikoloji' },
  { n: 'Esma Gündöndü',         e: 'gundonduesma6@gmail.com',                  c: 'Nöropsikoloji' },
  { n: 'Yağmur İkizdere',       e: 'yagmurikizdere@gmail.com',                 c: 'Nöropsikoloji' },

  // Moleküler Biyoloji ve Genetik
  { n: 'Elvin Seziner',         e: 'elvinseziner@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Zeynep Duru Alaca',     e: 'durualaca704@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Mert Dursun Korkmaz',   e: 'mertdursunkorkmaz.79@gmail.com',           c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Zeynep Eylül Beşinci',  e: 'zeynepeylulbesinci@gmail.com',             c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Meryem Irmak Demirli',  e: 'meryemirmakd@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Ece Pınarbaşı',         e: 'ecepinarbasi2010@gmail.com',               c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Ayşe Rana Argın',       e: 'ayseranaargin@gmail.com',                  c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Sabri Karan Yeniyol',   e: 'sabrikarany@gmail.com',                    c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Beren Yıldırım',        e: 'berenyldrm2009@gmail.com',                 c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Ayşenur Beyza Tümer',   e: 'beyzatumerrr29@gmail.com',                 c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Görkem Çınar Yeşil',    e: 'gorkemcinaryesil@gmail.com',               c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Zeynepnaz Kırkpınar',   e: 'zynpkrkpnr10@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Züleyha Gülce Uzun',    e: 'zuleyha.gulce28@gmail.com',                c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Zeynep Bölük',          e: 'zeynepboluk10@gmail.com',                  c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Elif Deniz Odabaşı',    e: null,                                       c: 'Moleküler Biyoloji ve Genetik' }, // PDF'te yanlış email (Zeynep Bölük'unkiyle aynı)
  { n: 'Damla Ayşenaz Öztürk',  e: 'ozturkdamlaaisenaz@gmail.com',             c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Selim Ömercepoğlu',     e: 'selimomercep@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Ela Özcan',             e: 'elaozcn@hotmail.com',                      c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Nisan Denizci',         e: 'nisdenizci@gmail.com',                     c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Yağmur Kantar',         e: 'yagmurkantar23@gmail.com',                 c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Elif Günar',            e: 'elifgunar7@gmail.com',                     c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Şevval Ok',             e: 'sevval.9ok@gmail.com',                     c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Sevde Arife Yeşilyurt', e: 'sevdeyesilyurt101@gmail.com',              c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Nehir Sağır',           e: 'nehirsagir2853@gmail.com',                 c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Toprak Erdem',          e: 'toprakerdem1933@gmail.com',                c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Zeynep Ula',            e: 'zeynp.gke04@icloud.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Era Yağmur Gökdemir',   e: 'erayagmurgokdemir@gmail.com',              c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Nil Zorlu',             e: 'nilzorlu14@gmail.com',                     c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'İlkim Zeynep Üner',     e: 'zeynepunerr0@gmail.com',                   c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Meryem Saide Yılmaz',   e: 'merymsyyy@icloud.com',                     c: 'Moleküler Biyoloji ve Genetik' },
  { n: 'Rana İdil Erdağ',       e: 'ranaidilerdag@gmail.com',                  c: 'Moleküler Biyoloji ve Genetik' },

  // AI/Data/NLP
  { n: 'Elif Sevimli',          e: 'elifsevimli2010@hotmail.com',              c: 'AI/Data/NLP' },
  { n: 'İremsu Şafak',          e: 'safakiremsu@gmail.com',                    c: 'AI/Data/NLP' },
  { n: 'Feyza Gündogdu',        e: 'feyza67678@gmail.com',                     c: 'AI/Data/NLP' },
  { n: 'Ceyda Nimet Koloğlu',   e: 'ceydankologlu@gmail.com',                  c: 'AI/Data/NLP' },
  { n: 'Göktürk Ünal Balak',    e: 'balakgokturk@gmail.com',                   c: 'AI/Data/NLP' },
  { n: 'Bedirhan Yakışırboy',   e: 'bedirhanyakisirboy36@gmail.com',           c: 'AI/Data/NLP' },
  { n: 'Alperen Tekin',         e: 'alperentekin1176@gmail.com',               c: 'AI/Data/NLP' },
  { n: 'Bahadır Bektaş',        e: 'bektasbahadir914@gmail.com',               c: 'AI/Data/NLP' },
  { n: 'İrem Meriç Şener',      e: 'iremeric.s@gmail.com',                     c: 'AI/Data/NLP' },
  { n: 'Ahmet Hamza Altın',     e: 'ahmethamzaaltin@gmail.com',                c: 'AI/Data/NLP' },
  { n: 'Ece Serdaş',            e: 'ece.serdas@gmail.com',                     c: 'AI/Data/NLP' },
  { n: 'Binay Cön',             e: 'binay.con8@gmail.com',                     c: 'AI/Data/NLP' },
  { n: 'Ali Kaan Eltutar',      e: 'alikeltutar@gmail.com',                    c: 'AI/Data/NLP' },
  { n: 'Nisan Özdamar',         e: 'nozdamar1950@gmail.com',                   c: 'AI/Data/NLP' },
  { n: 'Defne Ela Gürbüz',      e: 'defnelagurbuz@gmail.com',                  c: 'AI/Data/NLP' },
  { n: 'Bora Mir Atik',         e: 'atikbora6@gmail.com',                      c: 'AI/Data/NLP' },
  { n: 'Ali Tuna Baylan',       e: 'tunaonair@gmail.com',                      c: 'AI/Data/NLP' },
  { n: 'Yusuf Hazar Vural',     e: 'vyusufhazar@gmail.com',                    c: 'AI/Data/NLP' },
  { n: 'Talha Biçer',           e: 'talhabicer34@gmail.com',                   c: 'AI/Data/NLP' },
  { n: 'Anıl Ege Orhanlar',     e: 'anil.ege.orhanlar1905@gmail.com',          c: 'AI/Data/NLP' },
  { n: 'Ali Kayra Bayramoğlu',  e: 'alikayrabayramoglu@gmail.com',             c: 'AI/Data/NLP' },
  { n: 'Ezgi Külkaya',          e: 'ezgigulkaya2010@gmail.com',                c: 'AI/Data/NLP' },
  { n: 'Derin Yağmur Akyıldız', e: 'akyildiz2011drn@gmail.com',                c: 'AI/Data/NLP' },
  { n: 'Şuheda Baldan',         e: 'suhedabaldan72@gmail.com',                 c: 'AI/Data/NLP' },
  { n: 'Nehir Başmanav',        e: 'nhrbsmnv@gmail.com',                       c: 'AI/Data/NLP' },
  { n: 'Hanan Ayhan',           e: 'hanan.ayhan72@gmail.com',                  c: 'AI/Data/NLP' },
  { n: 'Zeynep Duru Arslan',    e: 'zeynepduru0909@gmail.com',                 c: 'AI/Data/NLP' },

  // Uçak ve Havacılık
  { n: 'Berke Çolak',           e: 'berkecolak@sezin.k12.tr',                  c: 'Uçak ve Havacılık' },
  { n: 'Almira Ayyıldız',       e: 'almrryldzz@gmail.com',                     c: 'Uçak ve Havacılık' },
  { n: 'Eylül Kaya',            e: 'kayaeylul1223@gmail.com',                  c: 'Uçak ve Havacılık' },
  { n: 'Öykü Demirel',          e: 'oykudemirel14@gmail.com',                  c: 'Uçak ve Havacılık' },
  { n: 'Dila Bal',              e: 'dilaball44@gmail.com',                     c: 'Uçak ve Havacılık' },
  { n: 'Ömer Sezai Acar',       e: 'omersezaiacar@gmail.com',                  c: 'Uçak ve Havacılık' },
  { n: 'Alperen Oduncu',        e: 'alperenoduncu10@gmail.com',                c: 'Uçak ve Havacılık' },
  { n: 'Efe Yosunlu',           e: 'efeyosunlu@sezin.k12.tr',                  c: 'Uçak ve Havacılık' },
  { n: 'Ceyda Küçükaslan',      e: 'kucukaslanceyda687@gmail.com',             c: 'Uçak ve Havacılık' },
  { n: 'Asya Çakkal',           e: 'drasyacakkal@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Can Arslan',            e: 'canarslan4444@gmail.com',                  c: 'Uçak ve Havacılık' },
  { n: 'Çağan Gürler',          e: 'caganberen02@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Eda Kurtoğlu',          e: 'eda.krtogluu@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Arda Mert',             e: 'ardamerttt05@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Asya Aytar',            e: 'esmasyaytar@icloud.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Gamze Taş',             e: 'tasgamze2734@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Görkem Gözübüyük',      e: 'gorkemgozubuyuk@gmail.com',                c: 'Uçak ve Havacılık' },
  { n: 'İlke Demir Topçuoğlu',  e: 'ilket4805@gmail.com',                      c: 'Uçak ve Havacılık' },
  { n: 'Bennu Kalkan',          e: 'bennukalkan@icloud.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Emirhan Canal',         e: 'aslen1275@gmail.com',                      c: 'Uçak ve Havacılık' },
  { n: 'Hatice Ortaç',          e: 'haticeortac18@gmail.com',                  c: 'Uçak ve Havacılık' },
  { n: 'Mustafa Konuk',         e: 'mustafa80konuk@gmail.com',                 c: 'Uçak ve Havacılık' },
  { n: 'Ömer Karaaslan',        e: 'karaomer2011@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Efe Yiğiter',           e: 'efeyigiter20@gmail.com',                   c: 'Uçak ve Havacılık' },
  { n: 'Ali Egemen Güler',      e: 'guleraliegemen@gmail.com',                 c: 'Uçak ve Havacılık' },
  { n: 'Ada Soğuktaş',          e: 'adasoguktas@gmail.com',                    c: 'Uçak ve Havacılık' },
  { n: 'Ömür Turgut',           e: 'omurturgut924@gmail.com',                  c: 'Uçak ve Havacılık' },

  // Adli Bilimler, Kriminalistik ve Toksikoloji
  { n: 'Nazlı Zerya Küçükkaya', e: 'nazlizerya04@gmail.com',                   c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Bora Avcı',             e: 'boraavci200913@gmail.com',                 c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ege Yılmaz',            e: 'egeyilmazzz11@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Batuhan Türkmen',       e: 'batuhantrkmn.60@gmail.com',                c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ceyhun Uras Karadağ',   e: 'ceyhunuraskaradag@gmail.com',              c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Yağmur Çoban',          e: 'ygmrcbn17@gmail.com',                      c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ecrin Karaca',          e: 'ecrinnkaracaa@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ilgın Ayhan',           e: 'ilginn.ayhann@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Enisa Balkan',          e: 'enisa_balkan@hotmail.com',                 c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ekin Bilgiç',           e: 'zeynepekinbilgic.e24@fmvisik.k12.tr',      c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Hamza Gül',             e: 'h1810mza@gmail.com',                       c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Azra Altınpınar',       e: 'azraaaltinpinar@gmail.com',                c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'İdil Can',              e: 'tusumakix@gmail.com',                      c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Şevval Akpınar',        e: 'sevvalakpinar2010@gmail.com',              c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ela Başak',             e: 'elabasakyuksel@gmail.com',                 c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Altay Tahsin Çavdar',   e: 'altaytahsinc@gmail.com',                   c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Elif Irmak Dede',       e: 'elifirmak2010@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Sena Nur Aydın',        e: 'senanuraydin2122@gmail.com',               c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Kübranur Açıkgöz',      e: 'acikgozkubranur72@gmail.com',              c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Asel Ecrin Şimşek',     e: 'aselecrinsimsek@gmail.com',                c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Şimal Taştepe',         e: 'tastepesimal0@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Argon Enes Özpınar',    e: 'ozpinarenes10@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ayşe Özyaşar',          e: 'ayseozyasar09@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ada Vardar',            e: 'adavrdr43@gmail.com',                      c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Elif Özyaşar',          e: 'elifozyasar09@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Ecrin Naz Bayram',      e: 'ecrinnazbayram@gmail.com',                 c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Gözde Başlı',           e: 'gozdebasli4@gmail.com',                    c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Zehra Hamide Kızıldağ', e: 'zehra.kizildag.23@gmail.com',              c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Eylül Nafiye Yılmaz',   e: 'eylulnafiyeyilmaz@gmail.com',              c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Emine Sude Önal',       e: 'onaleminesude@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Berfin Aktaş',          e: 'berfinaktass57@gmail.com',                 c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Rabia İclal Kandemir',  e: null,                                       c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' }, // sadece telefon
  { n: 'Nilüfer Deniz Altan',   e: 'niluferdenizaltan55@gmail.com',            c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Duru Özlük',            e: 'duruozluk23@gmail.com',                    c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Arda Ünsal',            e: 'unsalarda3443@gmail.com',                  c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Berna Yetim',           e: 'bernaytm2010@gmail.com',                   c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },
  { n: 'Beren Yetim',           e: null,                                       c: 'Adli Bilimler, Kriminalistik ve Toksikoloji' },

  // Akıllı Sistemler ve Mühendislik (Gelişim Projesi)
  { n: 'Buse Yıldırım',         e: 'by675347@gmail.com',                       c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Akif Aydoğan',          e: 'akifaydogan284@gmail.com',                 c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Ali Eren Çelikkol',     e: 'celikkolalieren@gmail.com',                c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Sarp Ilgaz',            e: 'sarp50804@gmail.com',                      c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Defne Yıldız',          e: '34defne.yildiz@gmail.com',                 c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Gani Ege Akın',         e: 'gegeakin@gmail.com',                       c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Abdülhamit Özbek',      e: 'hamitozbek07@gmail.com',                   c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Muaz Yaser Aşçı',       e: 'muazyaserasci@gmail.com',                  c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Alper Işılak',          e: 'alperisilak@gmail.com',                    c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Yılmaz Kerem Akdeniz',  e: 'akdenizyilmazkerem@gmail.com',             c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Helin Zeynep Ersin',    e: 'helinzeynepersin@gmail.com',               c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Toprak Doruk Kaya',     e: 'toprakdkaya9@gmail.com',                   c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Alper Yücelsin',        e: 'yucelsinalper@gmail.com',                  c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Deniz Yüksek',          e: null,                                       c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Elvin Tekyıldız',       e: 'elvin.tekyildiz@gmail.com',                c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Ada Defne Şahin',       e: 'defneqwexewq@gmail.com',                   c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Pars Kalafat',          e: 'parskalafat@anabilim.net',                 c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Nejdet Demir Demirci',  e: 'nejdetdemirdemirci@gmail.com',             c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Alp Eren Akay',         e: 'alperenakay@gmail.com',                    c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Batuhan Vural',         e: 'batuhaanvuraal@gmail.com',                 c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Eren Güngör',           e: 'erengungor730@gmail.com',                  c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },
  { n: 'Eren Kasım Patlar',     e: 'erenpatlar2010@gmail.com',                 c: 'Akıllı Sistemler ve Mühendislik Gelişim Projesi' },

  // 5 yeni eklenen (komite belirsiz - boş bırakıldı, sonra atanacak)
  { n: 'Ela Özüm Okumuş',       e: 'elaozlemokumus@gmail.com',                 c: null },
  { n: 'Elanur Sözkesen',       e: 'asyasozkesen28@gmail.com',                 c: null },
  { n: 'Nurefşan Varıcı',       e: 'nurefsanvarici@gmail.com',                 c: null },
  { n: 'Berat Deniz Gelgeç',    e: null,                                       c: null },
  { n: 'Elif Ece Yılmaz',       e: 'elifceyilmazz@gmail.com',                  c: null }, // .coM typo fixed
];

// ------------------------- HELPERS -------------------------
const normEmail = e => (e || '').trim().toLowerCase()
  .replace(/\.coM$/i, '.com').replace(/@gmail\.cm$/i, '@gmail.com');
const normName = n => (n || '').trim().toLocaleLowerCase('tr')
  .replace(/\s+/g, ' ');

async function sb(method, path, body) {
  const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
    method,
    headers: {
      'apikey': SB_SVC,
      'Authorization': `Bearer ${SB_SVC}`,
      'Content-Type': 'application/json',
      'Prefer': method === 'PATCH' ? 'return=representation' : 'return=minimal'
    },
    body: body ? JSON.stringify(body) : undefined
  });
  if (!r.ok) throw new Error(`${method} ${path}: ${r.status} ${await r.text()}`);
  if (r.status === 204) return null;
  const t = await r.text();
  return t ? JSON.parse(t) : null;
}

// ------------------------- MAIN -------------------------
const all = await sb('GET', `cards?select=id,short_code,name,email,committee&order=short_code`);
const assigned = all.filter(c => c.name);
const unassigned = all.filter(c => !c.name);

console.log(`\n=== DURUM ===`);
console.log(`DB: ${all.length} kart toplam, ${assigned.length} atanmış, ${unassigned.length} boş`);
console.log(`Master liste: ${master.length} kişi (${master.filter(m => m.e).length} email'li, ${master.filter(m => !m.e).length} email'siz)\n`);

// Index'le
const dbByEmail = new Map();
const dbByName  = new Map();
for (const c of assigned) {
  if (c.email) dbByEmail.set(normEmail(c.email), c);
  dbByName.set(normName(c.name), c);
}

// Master'da var ama DB'de yok
const toAdd = [];
for (const m of master) {
  let match = null;
  if (m.e) match = dbByEmail.get(normEmail(m.e));
  if (!match) match = dbByName.get(normName(m.n));
  if (!match) toAdd.push(m);
}

// DB'de var ama Master'da yok
const masterEmails = new Set(master.filter(m => m.e).map(m => normEmail(m.e)));
const masterNames  = new Set(master.map(m => normName(m.n)));
const toRemove = [];
for (const c of assigned) {
  const ne = c.email ? normEmail(c.email) : null;
  const nn = normName(c.name);
  if (ne && masterEmails.has(ne)) continue;
  if (masterNames.has(nn)) continue;
  toRemove.push(c);
}

console.log(`=== EKLENECEKLER (${toAdd.length}) ===`);
for (const m of toAdd) console.log(`  + ${m.n}${m.e ? ' / ' + m.e : ''}${m.c ? ' [' + m.c + ']' : ' [komite YOK]'}`);

console.log(`\n=== ÇIKARILACAKLAR (${toRemove.length}) ===`);
for (const c of toRemove) console.log(`  - ${c.short_code}: ${c.name}${c.email ? ' / ' + c.email : ''} [${c.committee || '—'}]`);

console.log(`\n=== ÖZET ===`);
console.log(`Eklenecek: ${toAdd.length}`);
console.log(`Çıkarılacak: ${toRemove.length}`);
console.log(`Boş kart: ${unassigned.length} (eklemeler için yeterli mi: ${unassigned.length >= toAdd.length ? 'EVET' : 'HAYIR — kart sayısı yetmez!'})`);

if (!EXECUTE) {
  console.log(`\n[DRY-RUN] Hiçbir şey değiştirilmedi. Uygulamak için: --execute flag'i ekle.\n`);
  process.exit(0);
}

console.log(`\n=== UYGULANIYOR ===`);

// 1) Çıkar: name/email/committee NULL'a çek (kart kaydını silme — geri alınabilir)
let removed = 0;
for (const c of toRemove) {
  await sb('PATCH', `cards?id=eq.${c.id}`, { name: null, email: null, committee: null });
  removed++;
  if (removed % 20 === 0) console.log(`  ... ${removed}/${toRemove.length} çıkarıldı`);
}
console.log(`  ✓ ${removed} kart NULL'a çekildi`);

// 2) Ekle: boş kartlara assign (short_code sırayla en küçükten başla)
const freshAll = await sb('GET', `cards?select=id,short_code,name&order=short_code`);
const free = freshAll.filter(c => !c.name);
let added = 0;
for (const m of toAdd) {
  if (!free.length) { console.log(`  ! Boş kart bitti, ${toAdd.length - added} kişi eklenmedi`); break; }
  const slot = free.shift();
  await sb('PATCH', `cards?id=eq.${slot.id}`, { name: m.n, email: m.e, committee: m.c });
  added++;
  console.log(`  + ${slot.short_code}: ${m.n}${m.e ? ' / ' + m.e : ''}${m.c ? ' [' + m.c + ']' : ''}`);
}
console.log(`  ✓ ${added} yeni kart atandı`);

console.log(`\n=== BİTTİ ===\n`);
