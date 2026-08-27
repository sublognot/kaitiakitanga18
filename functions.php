<?php
/**
 * Kaitiakitanga Teması functions.php
 *
 * @package Kaitiakitanga
 * @since   1.0.0
 * @version 2.4.0
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'KAITIAKITANGA_VERSION', '2.4.0' );
define( 'KAITIAKITANGA_DIR', get_template_directory() );
define( 'KAITIAKITANGA_URI', get_template_directory_uri() );

/* -------------------------------------------------------------------------
 * 1. TEMA KURULUMU
 * ---------------------------------------------------------------------- */

/**
 * Tema kurulumu.
 */
function kaitiakitanga_setup(): void {
        load_theme_textdomain( 'kaitiakitanga', KAITIAKITANGA_DIR . '/languages' );

        add_theme_support( 'automatic-feed-links' );
        add_theme_support( 'title-tag' );
        add_theme_support( 'post-thumbnails' );
        add_theme_support( 'customize-selective-refresh-widgets' );
        add_theme_support( 'responsive-embeds' );
        add_theme_support( 'align-wide' );
        add_theme_support( 'editor-styles' );
        add_theme_support( 'wp-block-styles' );
        add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
        add_theme_support( 'custom-logo', array(
                'height'      => 51,
                'width'       => 260,
                'flex-height' => false,
                'flex-width'  => false,
        ) );
        add_theme_support( 'post-formats', array( 'aside', 'gallery', 'link', 'image', 'quote', 'status', 'video', 'audio' ) );

        add_image_size( 'kaitiakitanga-card', 800, 500, true );
        add_image_size( 'kaitiakitanga-wide', 1600, 700, true );
        add_image_size( 'kaitiakitanga-thumb', 400, 300, true );

        register_nav_menus( array(
                'primary' => __( 'Birincil Menü', 'kaitiakitanga' ),
                'footer'  => __( 'Alt Bilgi Menüsü', 'kaitiakitanga' ),
                'social'  => __( 'Sosyal Menü', 'kaitiakitanga' ),
        ) );
}
add_action( 'after_setup_theme', 'kaitiakitanga_setup' );

function kaitiakitanga_content_width(): void {
        $GLOBALS['content_width'] = apply_filters( 'kaitiakitanga_content_width', 1200 );
}
add_action( 'after_setup_theme', 'kaitiakitanga_content_width', 0 );

/**
 * Widget kaydı — v2.3.0 itibarıyla alt bilgi (footer) widget alanları kaldırıldı;
 * alt bilgi yerine marka satırı, alt bilgi menüsü ve sosyal menü kullanılır.
 */
function kaitiakitanga_widgets_init(): void {
        // Bilinçli olarak boş: tema artık footer widget sütunları sunmuyor.
}
add_action( 'widgets_init', 'kaitiakitanga_widgets_init' );

/* -------------------------------------------------------------------------
 * 2. YARDIMCI FONKSİYONLAR
 * ---------------------------------------------------------------------- */

/**
 * İstemci IP'sini güvenli biçimde döndürür.
 */
function kaitiakitanga_client_ip(): string {
        $ip = isset( $_SERVER['REMOTE_ADDR'] ) ? wp_unslash( $_SERVER['REMOTE_ADDR'] ) : '';
        return filter_var( $ip, FILTER_VALIDATE_IP ) ? $ip : '';
}

/**
 * Basit transient tabanlı hız sınırı.
 *
 * @return bool true = istek serbest, false = limit aşıldı.
 */
function kaitiakitanga_rate_limit( string $bucket, int $limit = 30, int $window = MINUTE_IN_SECONDS ): bool {
        $bucket = sanitize_key( $bucket );
        if ( '' === $bucket || apply_filters( 'kaitiakitanga_bypass_rate_limit', false ) ) {
                return true;
        }
        $key   = 'kk_rl_' . md5( $bucket . '|' . kaitiakitanga_client_ip() );
        $count = (int) get_transient( $key );
        if ( $count >= $limit ) {
                return false;
        }
        set_transient( $key, $count + 1, $window );
        return true;
}

/**
 * JSON hata yanıtı + doğru HTTP durum kodu.
 */
function kaitiakitanga_json_error( int $status = 400 ): void {
        wp_send_json_error(
                array( 'message' => __( 'İşlem gerçekleştirilemedi.', 'kaitiakitanga' ) ),
                $status
        );
}

/**
 * Sayfanın 503 modunda olup olmadığı (?error=503 veya /503/).
 */
function kaitiakitanga_is_503(): bool {
        if ( isset( $_GET['error'] ) && '503' === sanitize_key( wp_unslash( $_GET['error'] ) ) ) {
                return true;
        }
        return '503' === kaitiakitanga_request_path();
}

/**
 * Ev URL'sine göre normalize edilmiş istek yolunu döndürür.
 */
function kaitiakitanga_request_path(): string {
        $request_uri = isset( $_SERVER['REQUEST_URI'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REQUEST_URI'] ) ) : '';
        $path        = trim( wp_parse_url( $request_uri, PHP_URL_PATH ), '/' );
        $home_path   = trim( wp_parse_url( home_url(), PHP_URL_PATH ), '/' );

        if ( '' !== $home_path && '' !== $path && 0 === strpos( $path . '/', $home_path . '/' ) ) {
                $path = trim( substr( $path, strlen( $home_path ) ), '/' );
        }
        return $path;
}

/* -------------------------------------------------------------------------
 * 3. STİL VE SCRIPTLER
 * ---------------------------------------------------------------------- */

/**
 * Stil ve scriptleri kuyruğa ekle.
 */
function kaitiakitanga_scripts(): void {
        $is_503        = kaitiakitanga_is_503();
        $is_error_page = is_404() || $is_503;

        // FontAwesome 6 (CDN).
        wp_enqueue_style( 'fontawesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css', array(), '6.5.2' );

        // Google Fonts.
        wp_enqueue_style( 'kaitiakitanga-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700&family=Ubuntu:wght@400;500;700&display=swap', array(), null );

        // Tema ana stili.
        wp_enqueue_style( 'kaitiakitanga-style', get_stylesheet_uri(), array(), KAITIAKITANGA_VERSION );

        // Ana CSS.
        wp_enqueue_style( 'kaitiakitanga-main', KAITIAKITANGA_URI . '/assets/css/main.css', array( 'kaitiakitanga-style' ), KAITIAKITANGA_VERSION );

        // Kozmik CSS (ana sayfa + hata sayfaları).
        if ( is_front_page() || $is_error_page ) {
                wp_enqueue_style( 'kaitiakitanga-cosmic', KAITIAKITANGA_URI . '/assets/css/cosmic.css', array( 'kaitiakitanga-main' ), KAITIAKITANGA_VERSION );
        }

        // Okuma modu CSS (tekil içerikler + hata sayfaları).
        if ( is_singular() || $is_error_page ) {
                wp_enqueue_style( 'kaitiakitanga-reading', KAITIAKITANGA_URI . '/assets/css/reading.css', array( 'kaitiakitanga-main' ), KAITIAKITANGA_VERSION );
        }

        // Ana JS.
        wp_enqueue_script( 'kaitiakitanga-main', KAITIAKITANGA_URI . '/assets/js/main.js', array(), KAITIAKITANGA_VERSION, true );

        // Kozmik JS (ana sayfa).
        if ( is_front_page() ) {
                wp_enqueue_script( 'kaitiakitanga-cosmic', KAITIAKITANGA_URI . '/assets/js/cosmic.js', array( 'kaitiakitanga-main' ), KAITIAKITANGA_VERSION, true );
        }

        // Okuma modu JS (tekil içerikler).
        if ( is_singular() ) {
                wp_enqueue_script( 'kaitiakitanga-reading', KAITIAKITANGA_URI . '/assets/js/reading.js', array( 'kaitiakitanga-main' ), KAITIAKITANGA_VERSION, true );
        }

        if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
                wp_enqueue_script( 'comment-reply' );
        }

        // Her AJAX aksiyonu için ayrı nonce (granüler güvenlik).
        wp_localize_script( 'kaitiakitanga-main', 'KaitiakitangaData', array(
                'ajaxUrl'     => admin_url( 'admin-ajax.php' ),
                'homeUrl'     => home_url( '/' ),
                'postId'      => is_singular() ? get_the_ID() : 0,
                'trackViews'  => is_singular( 'post' ),
                'i18n'        => array(
                        'searching'    => __( 'Aranıyor…', 'kaitiakitanga' ),
                        'noResults'    => __( 'Sonuç bulunamadı:', 'kaitiakitanga' ),
                        'seeAll'       => __( 'Tüm sonuçları gör', 'kaitiakitanga' ),
                        'tryDifferent' => __( 'Farklı anahtar kelimeler deneyin.', 'kaitiakitanga' ),
                        'exploring'    => __( 'Keşfe çıkılıyor…', 'kaitiakitanga' ),
                        'exploreFail'  => __( 'Şu an keşif yapılamıyor.', 'kaitiakitanga' ),
                        'copied'       => __( 'Kopyalandı', 'kaitiakitanga' ),
                ),
                'nonces'      => array(
                        'search' => wp_create_nonce( 'kaitiakitanga_live_search' ),
                        'random' => wp_create_nonce( 'kaitiakitanga_random_post' ),
                        'width'  => wp_create_nonce( 'kaitiakitanga_reading_width' ),
                        'view'   => wp_create_nonce( 'kaitiakitanga_track_view' ),
                ),
        ) );
}
add_action( 'wp_enqueue_scripts', 'kaitiakitanga_scripts' );

/* -------------------------------------------------------------------------
 * 4. İÇERİK YARDIMCILARI
 * ---------------------------------------------------------------------- */

/**
 * Yazarın "onaylı" durumu.
 */
function kaitiakitanga_is_verified_author( int $user_id ): bool {
        if ( $user_id <= 0 ) { return false; }
        $verified = get_user_meta( $user_id, 'kaitiakitanga_verified', true );
        if ( '' !== $verified ) { return (bool) $verified; }
        return count_user_posts( $user_id, 'post', true ) >= 10;
}

/**
 * Okuma süresi tahmini (UTF-8 / Türkçe uyumlu).
 */
function kaitiakitanga_reading_time( string $content ): int {
        $text = wp_strip_all_tags( $content );
        $words = preg_match_all( '/[\p{L}\p{Nd}]+/u', $text, $m );
        $total = max( 0, (int) $words );
        return (int) max( 1, ceil( $total / 220 ) );
}

/**
 * Kaynak ve İleri Okuma bağlantılarını getirir.
 * Post meta'da ham metin olarak saklanır; her satır "Etiket | URL" formatında.
 *
 * @return array<int, array{url:string,label:string}>
 */
function kaitiakitanga_get_source_links( int $post_id ): array {
        $raw = get_post_meta( $post_id, '_kaitiakitanga_source_text', true );
        if ( ! is_string( $raw ) ) { $raw = ''; }

        $links = array();
        $lines = preg_split( '/\r\n|\r|\n/', $raw );
        if ( ! is_array( $lines ) ) { return $links; }

        foreach ( $lines as $line ) {
                $line = trim( (string) $line );
                if ( '' === $line ) { continue; }

                if ( strpos( $line, '|' ) !== false ) {
                        $parts = explode( '|', $line, 2 );
                        $label = trim( $parts[0] );
                        $url   = trim( $parts[1] );
                } else {
                        $label = '';
                        $url   = $line;
                }

                if ( '' === $url ) { continue; }

                $clean = esc_url_raw( $url, array( 'http', 'https', 'mailto', 'tel' ) );
                if ( '' === $clean ) { continue; }

                $links[] = array( 'url' => $clean, 'label' => $label );
        }
        return $links;
}

/* -------------------------------------------------------------------------
 * 5. YAZI META BİLGİSİ
 * ---------------------------------------------------------------------- */

/**
 * Meta bilgi satırı (yazar, onay, tarih, gözlük, kopyala, üç nokta menü).
 */
function kaitiakitanga_post_meta(): void {
        $post_id    = (int) get_the_ID();
        $author_id  = (int) get_post_field( 'post_author', $post_id );
        $author     = get_the_author_meta( 'display_name', $author_id );
        $verified   = kaitiakitanga_is_verified_author( $author_id );
        $published  = get_the_date( 'd.m.Y' );
        $modified   = get_the_modified_date( 'd.m.Y' );
        $permalink  = get_permalink( $post_id );
        $source_links     = kaitiakitanga_get_source_links( $post_id );
        $has_source_panel = ! empty( $source_links );
        $reading          = is_singular() ? kaitiakitanga_reading_time( get_the_content() ) : 0;
        $views            = (int) get_post_meta( $post_id, '_kaitiakitanga_views', true );
        $categories       = get_the_category();
        $has_categories   = ! empty( $categories ) && ! is_wp_error( $categories );
        $rw = get_post_meta( $post_id, '_kaitiakitanga_reading_width', true );
        if ( ! in_array( (string) $rw, array( '500', '600', '700', '800' ), true ) ) { $rw = '600'; }

        $rw_options = array(
                '500' => __( '500px', 'kaitiakitanga' ),
                '600' => __( '600px (Varsayılan)', 'kaitiakitanga' ),
                '700' => __( '700px', 'kaitiakitanga' ),
                '800' => __( '800px', 'kaitiakitanga' ),
        );
        ?>
        <div class="post-meta glass-meta" role="group" aria-label="<?php esc_attr_e( 'Yazı meta bilgileri', 'kaitiakitanga' ); ?>">
                <span class="meta-author">
                        <i class="fa-regular fa-user" aria-hidden="true"></i>
                        <span class="meta-author-name"><?php echo esc_html( $author ); ?></span>
                        <?php if ( $verified ) : ?>
                                <i class="fa-solid fa-circle-check meta-verified" title="<?php esc_attr_e( 'Onaylı yazar', 'kaitiakitanga' ); ?>" aria-label="<?php esc_attr_e( 'Onaylı yazar', 'kaitiakitanga' ); ?>"></i>
                        <?php endif; ?>
                </span>
                <span class="meta-sep" aria-hidden="true">·</span>
                <span class="meta-date" title="<?php echo esc_attr( sprintf( __( 'Güncelleme: %s', 'kaitiakitanga' ), $modified ) ); ?>">
                        <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>"><?php echo esc_html( $published ); ?></time>
                </span>
                <span class="meta-sep" aria-hidden="true">·</span>

                <!-- Gözlük: Yazı büyüt/küçült/sıfırla paneli -->
                <div class="meta-glasses-wrap">
                        <button type="button" class="meta-glasses btn-meta" aria-haspopup="dialog" aria-expanded="false">
                                <svg viewBox="0 0 640 640" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" class="glasses-svg"><path d="M175.3 160C161.3 160 148.8 169.2 144.7 182.6L102.4 320L256 320C273.7 320 288 334.3 288 352L352 352C352 334.3 366.3 320 384 320L537.6 320L495.3 182.6C491.2 169.2 478.8 160 464.7 160L432 160C414.3 160 400 145.7 400 128C400 110.3 414.3 96 432 96L464.7 96C506.8 96 544.1 123.5 556.5 163.8L601.9 311.3C606 324.5 608 338.2 608 352L608 448C608 501 565 544 512 544L448 544C395 544 352 501 352 448L352 416L288 416L288 448C288 501 245 544 192 544L128 544C75 544 32 501 32 448L32 352C32 338.2 34.1 324.5 38.1 311.3L83.5 163.8C95.9 123.5 133.1 96 175.3 96L208 96C225.7 96 240 110.3 240 128C240 145.7 225.7 160 208 160L175.3 160zM96 384L96 448C96 465.7 110.3 480 128 480L192 480C209.7 480 224 465.7 224 448L224 384L96 384zM512 480C529.7 480 544 465.7 544 448L544 384L416 384L416 448C416 465.7 430.3 480 448 480L512 480z"/></svg>
                        </button>
                        <div class="meta-glasses-panel glass-card" role="dialog" hidden>
                                <button type="button" class="meta-glasses-btn meta-font-decrease" data-action="decrease">
                                        <i class="fa-solid fa-minus" aria-hidden="true"></i>
                                </button>
                                <button type="button" class="meta-glasses-btn meta-font-reset" data-action="reset">
                                        <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
                                </button>
                                <button type="button" class="meta-glasses-btn meta-font-increase" data-action="increase">
                                        <i class="fa-solid fa-plus" aria-hidden="true"></i>
                                </button>
                        </div>
                </div>

                <span class="meta-sep" aria-hidden="true">·</span>

                <!-- Kopyala -->
                <button type="button" class="meta-copy btn-meta" data-url="<?php echo esc_url( $permalink ); ?>" data-copied="<?php esc_attr_e( 'Kopyalandı', 'kaitiakitanga' ); ?>" aria-label="<?php esc_attr_e( 'Bağlantıyı Kopyala', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Bağlantıyı Kopyala', 'kaitiakitanga' ); ?>">
                        <i class="fa-regular fa-copy" aria-hidden="true"></i>
                        <span class="meta-copy-label"><?php esc_html_e( 'Kopyala', 'kaitiakitanga' ); ?></span>
                </button>

                <!-- Üç nokta: en sağa -->
                <div class="meta-more-wrap">
                        <button type="button" class="meta-more btn-meta" aria-haspopup="menu" aria-expanded="false" aria-label="<?php esc_attr_e( 'Daha fazla seçenek', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Daha fazla', 'kaitiakitanga' ); ?>">
                                <i class="fa-solid fa-ellipsis" aria-hidden="true"></i>
                        </button>
                        <ul class="meta-more-menu glass-card" role="menu" hidden>
                                <li role="none" class="meta-submenu-wrap">
                                        <span class="meta-submenu-label" aria-disabled="true">
                                                <i class="fa-solid fa-text-width" aria-hidden="true"></i>
                                                <?php esc_html_e( 'Okuma Genişliğini Seç', 'kaitiakitanga' ); ?>
                                        </span>
                                        <ul class="meta-submenu" role="group" aria-label="<?php esc_attr_e( 'Genişlik seçenekleri', 'kaitiakitanga' ); ?>">
                                                <?php foreach ( $rw_options as $val => $label ) : ?>
                                                        <li role="none">
                                                                <button type="button" role="menuitemradio" aria-checked="<?php echo $rw === $val ? 'true' : 'false'; // phpcs:ignore WordPress.Security.EscapeOutput -- sabit değerler ?>" class="meta-action meta-rw-option" data-rw="<?php echo esc_attr( $val ); ?>">
                                                                        <i class="fa-solid <?php echo $rw === $val ? 'fa-circle-check' : 'fa-circle'; // phpcs:ignore WordPress.Security.EscapeOutput -- sabit değerler ?>" aria-hidden="true"></i>
                                                                        <span><?php echo esc_html( $label ); ?></span>
                                                                </button>
                                                        </li>
                                                <?php endforeach; ?>
                                        </ul>
                                </li>
                                <?php if ( $reading > 0 ) : ?>
                                <li role="none" class="meta-divider"></li>
                                <li role="none" class="meta-info-item" aria-disabled="true">
                                        <span class="meta-info-inner"><i class="fa-regular fa-clock" aria-hidden="true"></i> <?php printf( esc_html__( '%d dk okuma', 'kaitiakitanga' ), (int) $reading ); ?></span>
                                </li>
                                <?php endif; ?>
                                <?php if ( $views > 0 ) : ?>
                                <li role="none" class="meta-info-item" aria-disabled="true">
                                        <span class="meta-info-inner"><i class="fa-regular fa-eye" aria-hidden="true"></i> <?php printf( esc_html__( '%d görüntülenme', 'kaitiakitanga' ), (int) $views ); ?></span>
                                </li>
                                <?php endif; ?>
                                <?php if ( $has_categories ) : ?>
                                <li role="none" class="meta-divider"></li>
                                <li role="none" class="meta-cats-wrap">
                                        <span class="meta-cats-label" aria-disabled="true">
                                                <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
                                                <?php esc_html_e( 'Kategoriler', 'kaitiakitanga' ); ?>
                                        </span>
                                        <span class="meta-cats-list">
                                                <?php foreach ( $categories as $cat ) : ?>
                                                        <a href="<?php echo esc_url( get_category_link( $cat->term_id ) ); ?>" class="meta-cat-pill" rel="category"><?php echo esc_html( $cat->name ); ?></a>
                                                <?php endforeach; ?>
                                        </span>
                                </li>
                                <?php endif; ?>
                                <?php if ( $has_source_panel ) : ?>
                                <li role="none" class="meta-divider"></li>
                                <li role="none">
                                        <button type="button" role="menuitem" class="meta-action meta-source-toggle">
                                                <i class="fa-solid fa-book-open" aria-hidden="true"></i>
                                                <?php esc_html_e( 'Kaynak ve İleri Okuma', 'kaitiakitanga' ); ?>
                                        </button>
                                </li>
                                <?php endif; ?>
                        </ul>
                </div>

                <?php if ( $has_source_panel ) : ?>
                <aside class="meta-source-panel glass-card" hidden>
                        <h4><i class="fa-solid fa-book-open" aria-hidden="true"></i> <?php esc_html_e( 'Kaynak ve İleri Okuma', 'kaitiakitanga' ); ?></h4>
                        <ul class="source-links">
                                <?php foreach ( $source_links as $link ) :
                                        $url      = $link['url'];
                                        $label    = $link['label'];
                                        $display  = ( '' !== $label ) ? $label : $url;
                                        $is_external = ( 0 === strpos( $url, 'http://' ) || 0 === strpos( $url, 'https://' ) );
                                        ?>
                                        <li>
                                                <a href="<?php echo esc_url( $url ); ?>" <?php echo $is_external ? 'target="_blank" rel="noopener noreferrer nofollow"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput -- statik güvenli çıktı ?> class="source-link">
                                                        <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
                                                        <span><?php echo esc_html( $display ); ?></span>
                                                </a>
                                        </li>
                                <?php endforeach; ?>
                        </ul>
                </aside>
                <?php endif; ?>
        </div>
        <?php
}

/* -------------------------------------------------------------------------
 * 6. GÖRÜNTÜLENME SAYACI
 * ---------------------------------------------------------------------- */

/**
 * AJAX ile tekil yazı görüntülenmesini sayar.
 * Bot/bot benzeri istemciler ve aynı ziyaretçi (transient penceresi içinde)
 * tekrar tekrar sayılmaz.
 */
function kaitiakitanga_track_view(): void {
        check_ajax_referer( 'kaitiakitanga_track_view', 'nonce' );

        if ( ! kaitiakitanga_rate_limit( 'view', 60, MINUTE_IN_SECONDS ) ) {
                kaitiakitanga_json_error( 429 );
        }

        $post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;

        // Bot filtresi (yaygın bot tanımlayıcıları).
        $ua = isset( $_SERVER['HTTP_USER_AGENT'] ) ? strtolower( sanitize_text_field( wp_unslash( $_SERVER['HTTP_USER_AGENT'] ) ) ) : '';
        $bot_patterns = apply_filters( 'kaitiakitanga_bot_patterns', 'bot|crawl|slurp|spider|curl|wget|python|httpclient|headless|preview|monitor|pingdom|uptime|facebookexternalhit|semrush|ahrefs' );
        $is_bot = ( 1 === preg_match( '/' . $bot_patterns . '/i', $ua ) );
        if ( '' === $ua || $is_bot ) {
                wp_send_json_success( array( 'counted' => false ) );
        }

        if ( ! $post_id || 'post' !== get_post_type( $post_id ) || 'publish' !== get_post_status( $post_id ) ) {
                kaitiakitanga_json_error( 400 );
        }

        // Aynı ziyaretçinin 1 saat içindeki tekrar sayımları engellenir.
        $view_key = 'kk_v_' . md5( $post_id . '|' . kaitiakitanga_client_ip() );
        if ( get_transient( $view_key ) ) {
                wp_send_json_success( array( 'counted' => false ) );
        }
        set_transient( $view_key, 1, HOUR_IN_SECONDS );

        // Doğrudan güncellenmiş değeri okuyup +1 yaparak yaz.
        $views = (int) get_post_meta( $post_id, '_kaitiakitanga_views', true );
        update_post_meta( $post_id, '_kaitiakitanga_views', $views + 1 );

        do_action( 'kaitiakitanga_after_count_view', $post_id, $views + 1 );

        wp_send_json_success( array( 'counted' => true, 'views' => $views + 1 ) );
}
add_action( 'wp_ajax_kaitiakitanga_track_view', 'kaitiakitanga_track_view' );
add_action( 'wp_ajax_nopriv_kaitiakitanga_track_view', 'kaitiakitanga_track_view' );

/* -------------------------------------------------------------------------
 * 7. EDITÖR META KUTUSU (Kaynak ve İleri Okuma)
 * ---------------------------------------------------------------------- */

/**
 * Kaynak meta kutusu (editör ekranı).
 */
function kaitiakitanga_add_source_meta_box(): void {
        add_meta_box(
                'kaitiakitanga_source_mb',
                __( 'Kaynak ve İleri Okuma', 'kaitiakitanga' ),
                'kaitiakitanga_source_meta_box_html',
                array( 'post', 'page' ),
                'side',
                'default'
        );
}
add_action( 'add_meta_boxes', 'kaitiakitanga_add_source_meta_box' );

function kaitiakitanga_source_meta_box_html( WP_Post $post ): void {
        wp_nonce_field( 'kaitiakitanga_source_save', 'kaitiakitanga_source_nonce' );
        $raw = get_post_meta( $post->ID, '_kaitiakitanga_source_text', true );
        if ( ! is_string( $raw ) ) { $raw = ''; }
        ?>
        <p><label for="kaitiakitanga_source_text"><strong><?php esc_html_e( 'Kaynak ve İleri Okuma', 'kaitiakitanga' ); ?></strong></label></p>
        <p class="description" style="margin:0 0 8px;">
                <?php echo wp_kses_post( sprintf( __( 'Her satıra bir kaynak: <strong>%s</strong>. Bu bağlantılar, yazı sayfasındaki "Kaynak ve İleri Okuma" başlığı altında listelenir.', 'kaitiakitanga' ), 'Etiket | https://baglanti.com' ) ); ?>
        </p>
        <textarea name="kaitiakitanga_source_text" id="kaitiakitanga_source_text" rows="6" style="width:100%;font-family:monospace;font-size:13px;line-height:1.5;" placeholder="<?php esc_attr_e( 'Örn: Etiket | https://www.ornek.com', 'kaitiakitanga' ); ?>"><?php echo esc_textarea( $raw ); ?></textarea>
        <?php
}

function kaitiakitanga_save_source_meta( int $post_id ): void {
        // Otomatik kaydetme / revizyon / içe aktarma senaryolarını dışla.
        if ( ( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE )
                || wp_is_post_revision( $post_id )
                || wp_is_post_autosave( $post_id )
                || ( defined( 'DOING_CRON' ) && DOING_CRON )
        ) {
                return;
        }

        if ( ! isset( $_POST['kaitiakitanga_source_nonce'] )
                || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['kaitiakitanga_source_nonce'] ) ), 'kaitiakitanga_source_save' )
        ) {
                return;
        }

        if ( ! current_user_can( 'edit_post', $post_id ) ) { return; }

        if ( isset( $_POST['kaitiakitanga_source_text'] ) && is_string( $_POST['kaitiakitanga_source_text'] ) ) {
                $raw   = wp_unslash( $_POST['kaitiakitanga_source_text'] );
                $lines = preg_split( '/\r\n|\r|\n/', (string) $raw );
                $clean_lines = array();
                if ( is_array( $lines ) ) {
                        foreach ( $lines as $line ) {
                                $clean_lines[] = sanitize_text_field( $line );
                        }
                }
                $clean = trim( implode( "\n", $clean_lines ) );
                update_post_meta( $post_id, '_kaitiakitanga_source_text', $clean );
        }
}
add_action( 'save_post_post', 'kaitiakitanga_save_source_meta' );
add_action( 'save_post_page', 'kaitiakitanga_save_source_meta' );

/* -------------------------------------------------------------------------
 * 8. ONAYLI YAZAR PROFİL ALANI
 * ---------------------------------------------------------------------- */

/**
 * Yazar profilinde "Onaylı" alanı.
 */
function kaitiakitanga_verified_author_field( WP_User $user ): void {
        if ( ! current_user_can( 'edit_users' ) ) { return; }
        $verified = get_user_meta( $user->ID, 'kaitiakitanga_verified', true );
        wp_nonce_field( 'kaitiakitanga_verified_save', 'kaitiakitanga_verified_nonce' );
        ?>
        <h3><?php esc_html_e( 'Kaitiakitanga — Onay Durumu', 'kaitiakitanga' ); ?></h3>
        <table class="form-table">
                <tr>
                        <th><label for="kaitiakitanga_verified"><?php esc_html_e( 'Onaylı Yazar', 'kaitiakitanga' ); ?></label></th>
                        <td>
                                <input type="checkbox" name="kaitiakitanga_verified" id="kaitiakitanga_verified" value="1" <?php checked( $verified, '1' ); ?>>
                                <span class="description"><?php esc_html_e( 'İşaretlendiğinde yazar adının yanında onay rozeti gösterilir.', 'kaitiakitanga' ); ?></span>
                        </td>
                </tr>
        </table>
        <?php
}
add_action( 'show_user_profile', 'kaitiakitanga_verified_author_field' );
add_action( 'edit_user_profile', 'kaitiakitanga_verified_author_field' );

function kaitiakitanga_save_verified_author( int $user_id ): void {
        if ( ! current_user_can( 'edit_user', $user_id ) ) { return; }

        if ( ! isset( $_POST['kaitiakitanga_verified_nonce'] )
                || ! wp_verify_nonce( sanitize_text_field( wp_unslash( $_POST['kaitiakitanga_verified_nonce'] ) ), 'kaitiakitanga_verified_save' )
        ) {
                return;
        }

        $verified = isset( $_POST['kaitiakitanga_verified'] ) ? '1' : '0';
        update_user_meta( $user_id, 'kaitiakitanga_verified', $verified );
}
add_action( 'personal_options_update', 'kaitiakitanga_save_verified_author' );
add_action( 'edit_user_profile_update', 'kaitiakitanga_save_verified_author' );

/* -------------------------------------------------------------------------
 * 9. AJAX UÇLARI: CANLI ARAMA / RASTGELE YAZI / OKUMA GENİŞLİĞİ
 * ---------------------------------------------------------------------- */

/**
 * Canlı arama AJAX.
 */
function kaitiakitanga_live_search(): void {
        check_ajax_referer( 'kaitiakitanga_live_search', 'nonce' );

        if ( ! kaitiakitanga_rate_limit( 'search', 30, MINUTE_IN_SECONDS ) ) {
                kaitiakitanga_json_error( 429 );
        }

        $s = isset( $_POST['s'] ) ? sanitize_text_field( wp_unslash( $_POST['s'] ) ) : '';
        if ( mb_strlen( $s ) < 2 || mb_strlen( $s ) > 100 ) {
                wp_send_json_success( array( 'items' => array() ) );
        }

        $query = new WP_Query( array(
                's'                   => $s,
                'posts_per_page'      => 8,
                'post_status'         => 'publish',
                'post_type'           => 'post',
                'ignore_sticky_posts' => true,
                'no_found_rows'       => true,
        ) );

        $items = array();
        while ( $query->have_posts() ) {
                $query->the_post();
                $cats     = get_the_category();
                $cat_name = ! empty( $cats ) && ! is_wp_error( $cats ) ? $cats[0]->name : '';
                $excerpt  = wp_trim_words( wp_strip_all_tags( get_the_excerpt() ), 14, '…' );
                $thumb    = has_post_thumbnail() ? get_the_post_thumbnail_url( get_the_ID(), 'kaitiakitanga-thumb' ) : '';

                $items[] = array(
                        'id'       => get_the_ID(),
                        'title'    => html_entity_decode( get_the_title(), ENT_QUOTES, 'UTF-8' ),
                        'url'      => get_permalink(),
                        'excerpt'  => $excerpt,
                        'date'     => get_the_date( 'd.m.Y' ),
                        'category' => $cat_name,
                        'thumb'    => $thumb,
                );
        }
        wp_reset_postdata();

        wp_send_json_success( array( 'items' => $items ) );
}
add_action( 'wp_ajax_kaitiakitanga_live_search', 'kaitiakitanga_live_search' );
add_action( 'wp_ajax_nopriv_kaitiakitanga_live_search', 'kaitiakitanga_live_search' );

/**
 * Rastgele yazı (Keşfe çık).
 */
function kaitiakitanga_random_post(): void {
        check_ajax_referer( 'kaitiakitanga_random_post', 'nonce' );

        if ( ! kaitiakitanga_rate_limit( 'random', 20, MINUTE_IN_SECONDS ) ) {
                kaitiakitanga_json_error( 429 );
        }

        $post_ids = get_posts( array(
                'posts_per_page'   => 1,
                'orderby'          => 'rand',
                'post_status'      => 'publish',
                'post_type'        => 'post',
                'fields'           => 'ids',
                'suppress_filters' => false,
        ) );

        if ( ! empty( $post_ids ) ) {
                wp_send_json_success( array(
                        'url'   => get_permalink( $post_ids[0] ),
                        'title' => get_the_title( $post_ids[0] ),
                ) );
        }
        wp_send_json_error( array( 'message' => __( 'Henüz gönderi yok.', 'kaitiakitanga' ) ), 404 );
}
add_action( 'wp_ajax_kaitiakitanga_random_post', 'kaitiakitanga_random_post' );
add_action( 'wp_ajax_nopriv_kaitiakitanga_random_post', 'kaitiakitanga_random_post' );

/**
 * Okuma genişliği kaydetme AJAX (sadece oturum açık kullanıcılar).
 */
function kaitiakitanga_save_reading_width(): void {
        check_ajax_referer( 'kaitiakitanga_reading_width', 'nonce' );

        $post_id = isset( $_POST['post_id'] ) ? absint( $_POST['post_id'] ) : 0;
        $width   = isset( $_POST['width'] ) ? sanitize_text_field( wp_unslash( $_POST['width'] ) ) : '600';

        if ( ! in_array( $width, array( '500', '600', '700', '800' ), true ) ) {
                $width = '600';
        }

        if ( ! $post_id || ! current_user_can( 'edit_post', $post_id ) ) {
                wp_send_json_success( array( 'width' => $width, 'saved' => false ), 200 );
        }

        update_post_meta( $post_id, '_kaitiakitanga_reading_width', $width );
        wp_send_json_success( array( 'width' => $width, 'saved' => true ) );
}
add_action( 'wp_ajax_kaitiakitanga_save_reading_width', 'kaitiakitanga_save_reading_width' );

/* -------------------------------------------------------------------------
 * 10. HATA SAYFALARI (/404 VE /503 YAKALAMA)
 * ---------------------------------------------------------------------- */

function kaitiakitanga_maybe_error_pages(): void {
        $path = kaitiakitanga_request_path();

        if ( kaitiakitanga_is_503() ) {
                global $wp_query;
                status_header( 503 );
                nocache_headers();
                header( 'Retry-After: 300' );
                $wp_query->is_404 = false;
                include KAITIAKITANGA_DIR . '/503.php';
                exit;
        }

        // /404 garantisi.
        if ( '404' === $path ) {
                global $wp_query;
                $wp_query->is_404 = true;
                status_header( 404 );
                nocache_headers();
                include KAITIAKITANGA_DIR . '/404.php';
                exit;
        }
}
add_action( 'template_redirect', 'kaitiakitanga_maybe_error_pages', 1 );

/* -------------------------------------------------------------------------
 * 11. CUSTOMIZER
 * ---------------------------------------------------------------------- */

function kaitiakitanga_customize_register( WP_Customize_Manager $wp_customize ): void {
        $wp_customize->add_section( 'kaitiakitanga_colors', array(
                'title'    => __( 'Kaitiakitanga Renkler', 'kaitiakitanga' ),
                'priority' => 30,
        ) );

        $wp_customize->add_setting( 'kaitiakitanga_accent_color', array(
                'default'           => '#4f46e5',
                'sanitize_callback' => 'sanitize_hex_color',
                'transport'         => 'postMessage',
        ) );
        $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'kaitiakitanga_accent_color', array(
                'label'   => __( 'Vurgu rengi', 'kaitiakitanga' ),
                'section' => 'kaitiakitanga_colors',
        ) ) );

        $wp_customize->add_section( 'kaitiakitanga_cosmic', array(
                'title'    => __( 'Kozmik Animasyonlar', 'kaitiakitanga' ),
                'priority' => 35,
        ) );

        $wp_customize->add_setting( 'kaitiakitanga_cosmic_enable', array(
                'default'           => true,
                'sanitize_callback' => 'rest_sanitize_boolean',
        ) );
        $wp_customize->add_control( 'kaitiakitanga_cosmic_enable', array(
                'label'   => __( 'Ana sayfa kozmik efekti', 'kaitiakitanga' ),
                'section' => 'kaitiakitanga_cosmic',
                'type'    => 'checkbox',
        ) );

        $wp_customize->add_setting( 'kaitiakitanga_cosmic_density', array(
                'default'           => 'medium',
                'sanitize_callback' => 'sanitize_key',
        ) );
        $wp_customize->add_control( 'kaitiakitanga_cosmic_density', array(
                'label'   => __( 'Yıldız yoğunluğu', 'kaitiakitanga' ),
                'section' => 'kaitiakitanga_cosmic',
                'type'    => 'select',
                'choices' => array(
                        'low'    => __( 'Az', 'kaitiakitanga' ),
                        'medium' => __( 'Orta', 'kaitiakitanga' ),
                        'high'   => __( 'Yoğun', 'kaitiakitanga' ),
                ),
        ) );
}
add_action( 'customize_register', 'kaitiakitanga_customize_register' );

/**
 * Customizer canlı önizleme JS'i (postMessage transport için).
 */
function kaitiakitanga_customize_preview_js(): void {
        wp_enqueue_script( 'kaitiakitanga-customizer-preview', KAITIAKITANGA_URI . '/assets/js/customizer-preview.js', array( 'customize-preview' ), KAITIAKITANGA_VERSION, true );
}
add_action( 'customize_preview_init', 'kaitiakitanga_customize_preview_js' );

function kaitiakitanga_customizer_css(): void {
        $accent = get_theme_mod( 'kaitiakitanga_accent_color', '#4f46e5' );
        if ( ! preg_match( '/^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/', $accent ) ) {
                $accent = '#4f46e5';
        }
        echo '<style id="kaitiakitanga-customizer">:root{--color-accent:' . esc_html( $accent ) . ';}</style>' . "\n";
}
add_action( 'wp_head', 'kaitiakitanga_customizer_css', 15 );

/* -------------------------------------------------------------------------
 * 12. BODY CLASS / SATIR İÇİ CSS
 * ---------------------------------------------------------------------- */

/**
 * Body class: yoğunluk ayarı cosmic.js tarafından okunur.
 */
function kaitiakitanga_body_classes( array $classes ): array {
        if ( is_singular() ) { $classes[] = 'is-singular'; }
        if ( is_front_page() ) { $classes[] = 'is-cosmic'; }
        if ( 'post' === get_post_type() && is_singular() ) { $classes[] = 'reading-mode'; }

        if ( is_front_page() && get_theme_mod( 'kaitiakitanga_cosmic_enable', true ) ) {
                $density = get_theme_mod( 'kaitiakitanga_cosmic_density', 'medium' );
                if ( ! in_array( $density, array( 'low', 'medium', 'high' ), true ) ) {
                        $density = 'medium';
                }
                $classes[] = 'cosmic-density-' . $density;
        }
        return $classes;
}
add_filter( 'body_class', 'kaitiakitanga_body_classes' );

/**
 * Satır içi okuma genişliği CSS (allowlist ile).
 */
function kaitiakitanga_inline_reading_width(): void {
        if ( ! is_singular( 'post' ) ) { return; }
        $width = (string) get_post_meta( get_the_ID(), '_kaitiakitanga_reading_width', true );
        if ( ! in_array( $width, array( '500', '600', '700', '800' ), true ) ) {
                $width = '600';
        }
        echo '<style id="kaitiakitanga-rw">.reading-width{max-width:' . (int) $width . 'px;margin-left:auto;margin-right:auto;}</style>' . "\n";
}
add_action( 'wp_head', 'kaitiakitanga_inline_reading_width', 20 );

/* -------------------------------------------------------------------------
 * 13. RESOURCE HINTS / ÖZET / PINGBACK
 * ---------------------------------------------------------------------- */

function kaitiakitanga_resource_hints( array $urls, string $relation_type ): array {
        if ( 'preconnect' === $relation_type ) {
                $urls[] = array(
                        'href'        => 'https://fonts.gstatic.com',
                        'crossorigin' => 'anonymous',
                );
                $urls[] = array(
                        'href'        => 'https://cdnjs.cloudflare.com',
                        'crossorigin' => 'anonymous',
                );
        }
        return $urls;
}
add_filter( 'wp_resource_hints', 'kaitiakitanga_resource_hints', 10, 2 );

function kaitiakitanga_excerpt_length(): int {
        return 28;
}
add_filter( 'excerpt_length', 'kaitiakitanga_excerpt_length' );

function kaitiakitanga_excerpt_more( string $more ): string {
        unset( $more );
        return '…';
}
add_filter( 'excerpt_more', 'kaitiakitanga_excerpt_more' );

/**
 * Pingback header.
 */
function kaitiakitanga_pingback_header(): void {
        if ( is_singular() && pings_open() ) {
                printf( '<link rel="pingback" href="%s">' . "\n", esc_url( get_bloginfo( 'pingback_url' ) ) );
        }
}
add_action( 'wp_head', 'kaitiakitanga_pingback_header', 5 );

require_once KAITIAKITANGA_DIR . '/inc/template-tags.php';
