# Kaitiakitanga 18
Kaitiakitanga 18, sade ve modern bir WordPress temasıdır.

# Açıklama
Kaitiakitanga 18, içerik üreticileri ve blog yazarları için tasarlanmış şık bir WordPress temasıdır. Tema adını Maori dilinde "korumak, gözetmek ve sahip çıkmak" anlamına gelen Kaitiakitanga felsefesinden alır. Bu felsefe, temanın kaliteli içerik sunma ve kullanıcı deneyimine verdiği öneme yansımıştır.

# Özellikler
Tamamen duyarlı (mobil uyumlu) ve sade tasarım

Standart WordPress şablon hiyerarşisine uygun yapı

Özel menü, widget ve yan çubuk (sidebar) desteği

WordPress kodlama standartlarına uygun, temiz ve düzenli kod

Hafif yapısı sayesinde hızlı yüklenme süresi

# Kurulum
WordPress yönetici paneli üzerinden:

WordPress panonuzda Görünüm > Temalar bölümüne gidin.

Yeni Ekle butonuna tıklayıp Tema Yükle seçeneğini seçin.

Temanın .zip dosyasını seçip yükleyin.

Yükleme tamamlandıktan sonra Etkinleştir butonuna tıklayın.

# FTP ile:

kaitiakitanga18 klasörünü /wp-content/themes/ dizinine yükleyin.

WordPress panonuzda Görünüm > Temalar bölümüne gelin, temayı bulun ve Etkinleştir'e tıklayın.

# Doya Yapısı

<code>- kaitiakitanga18/
├── assets/              # Görseller, CSS ve JavaScript dosyaları
├── inc/                 # Yardımcı fonksiyonlar ve tema modülleri
├── template-parts/      # Tekrar kullanılabilir şablon parçaları
├── 404.php              # 404 hata sayfası şablonu
├── 503.php              # 503 bakım modu sayfası şablonu
├── archive.php          # Arşiv sayfaları şablonu
├── comments.php         # Yorum alanı şablonu
├── footer.php           # Alt bilgi (footer) şablonu
├── front-page.php       # Ana sayfa şablonu (statik ön sayfa)
├── functions.php        # Tema çekirdek işlevleri
├── header.php           # Üst bilgi (header) şablonu
├── index.php            # Ana indeks şablonu
├── page.php             # Sayfa şablonu
├── search.php           # Arama sonuçları şablonu
├── searchform.php       # Arama formu şablonu
├── sidebar.php          # Yan çubuk (sidebar) şablonu
├── single.php           # Tekil yazı (blog yazısı) şablonu
├── style.css            # Ana stil dosyası
├── screenshot.jpg       # Tema önizleme görseli
└── LICENSE              # Lisans dosyası</code>

# Geliştirme

Sistem Gereksinimleri
WordPress 5.0 ve üzeri

# PHP 7.4 ve üzeri

Yerel Geliştirme Ortamında Kurulum
Temayı yerel WordPress kurulumunuzun /wp-content/themes/ dizinine klonlayın:
git clone https://github.com/sublognot/kaitiakitanga18.git

WordPress panonuzdan temayı etkinleştirerek geliştirmeye başlayabilirsiniz.

# Özelleştirme
Tema aşağıdaki WordPress özelliklerini desteklemektedir (ilgili fonksiyonlar functions.php dosyasında düzenlenebilir):

Özel Menüler (register_nav_menus())

Widget Alanları (register_sidebar())

Öne Çıkan Görsel (Post Thumbnail) (add_theme_support('post-thumbnails'))

Yazı Biçimleri (Post Formats) (add_theme_support('post-formats'))

İhtiyacınıza göre functions.php dosyası üzerinden bu özellikleri aktifleştirebilir veya devre dışı bırakabilirsiniz.

# Katkıda Bulunma
Her türlü geri bildirim, hata raporu ve katkıya açığız. Lütfen aşağıdaki adımları izleyin:

Bu depoyu fork'layın.

Kendi özellik dalınızı oluşturun (git checkout -b feature/harika-ozellik).

Değişikliklerinizi kaydedin (git commit -m 'Harika bir özellik eklendi').

Dalınıza gönderin (git push origin feature/harika-ozellik).

Pull Request (Çekme İsteği) oluşturun.

# Lisans
Bu proje, GNU General Public License v3.0 ile lisanslanmıştır. Açık kaynak ruhuyla herkesin kullanımına ve katkısına açıktır.

# Not:
 Bu Wordpress temayı geliştirme ortamında test ediniz. https://playground.wordpress.net/ ortamında da test edebilirsiniz. sorumluluk geliştiriciye ait değildir. sorumluluk kullanıcıya aittir.


