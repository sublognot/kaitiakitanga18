<?php
/**
 * inc/template-tags.php
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

/**
 * Sosyal paylaşım butonları (sadece Kopyala).
 * Sağda: önceki/yukarı/sonraki simgeli butonlar.
 */
function kaitiakitanga_share_buttons(): void {
    $url = get_permalink();
    $prev = get_previous_post();
    $next = get_next_post();
    ?>
    <div class="share-buttons glass-card" aria-label="<?php esc_attr_e( 'Bağlantıyı kopyala ve yazı gezinme', 'kaitiakitanga' ); ?>">
        <button type="button" class="share-btn share-copy" data-url="<?php echo esc_url( $url ); ?>" data-copied="<?php esc_attr_e( 'Kopyalandı', 'kaitiakitanga' ); ?>" aria-label="<?php esc_attr_e( 'Bağlantıyı Kopyala', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Bağlantıyı Kopyala', 'kaitiakitanga' ); ?>">
            <i class="fa-regular fa-copy" aria-hidden="true"></i>
            <span class="share-copy-label"><?php esc_html_e( 'Kopyala', 'kaitiakitanga' ); ?></span>
        </button>

        <span class="share-nav-group" aria-label="<?php esc_attr_e( 'Yazı navigasyonu', 'kaitiakitanga' ); ?>">
            <?php if ( $prev ) : ?>
                <a class="share-btn share-nav prev" href="<?php echo esc_url( get_permalink( $prev ) ); ?>" aria-label="<?php esc_attr_e( 'Önceki yazı', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Önceki', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                </a>
            <?php else : ?>
                <span class="share-btn share-nav prev is-disabled" aria-disabled="true" title="<?php esc_attr_e( 'Önceki yazı yok', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-arrow-left" aria-hidden="true"></i>
                </span>
            <?php endif; ?>

            <a class="share-btn share-nav top" href="#main" aria-label="<?php esc_attr_e( 'Yukarı çık', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Yukarı', 'kaitiakitanga' ); ?>">
                <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
            </a>

            <?php if ( $next ) : ?>
                <a class="share-btn share-nav next" href="<?php echo esc_url( get_permalink( $next ) ); ?>" aria-label="<?php esc_attr_e( 'Sonraki yazı', 'kaitiakitanga' ); ?>" title="<?php esc_attr_e( 'Sonraki', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </a>
            <?php else : ?>
                <span class="share-btn share-nav next is-disabled" aria-disabled="true" title="<?php esc_attr_e( 'Sonraki yazı yok', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
                </span>
            <?php endif; ?>
        </span>
    </div>
    <?php
}

/**
 * Etiketleri yazdırır.
 */
function kaitiakitanga_tags_list(): void {
    $tags = get_the_tags();
    if ( empty( $tags ) ) { return; }
    echo '<span class="tags-list">';
    foreach ( $tags as $tag ) {
        printf( '<a href="%s" class="tag-link" rel="tag">#%s</a>', esc_url( get_tag_link( $tag->term_id ) ), esc_html( $tag->name ) );
    }
    echo '</span>';
}

/**
 * Kozmik arka plan — yalnızca yıldız alanı (canvas) ve kadim uygarlıkların
 * sembolleri (SVG). Görsel kirlilik yaratan galaksi/gezegen katmanları
 * kullanıcı talebiyle kaldırıldı.
 */
function kaitiakitanga_cosmic_background(): void {
    ?>
    <div class="cosmic-bg" aria-hidden="true">
        <canvas class="cosmic-stars" id="cosmic-stars"></canvas>

        <!-- Kadim semboller: altın oran / labirent gözü -->
        <svg class="cosmic-ancient ancient-1" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M10,50 Q50,20 90,50 Q50,80 10,50 Z" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
            <circle cx="50" cy="50" r="4" fill="currentColor"/>
        </svg>
        <!-- Kadim semboller: güneş terazisi -->
        <svg class="cosmic-ancient ancient-2" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="25" r="15" fill="none" stroke="currentColor" stroke-width="3"/>
            <line x1="50" y1="40" x2="50" y2="90" stroke="currentColor" stroke-width="3"/>
            <line x1="30" y1="60" x2="70" y2="60" stroke="currentColor" stroke-width="3"/>
        </svg>
        <!-- Kadim semboller: yılan akımı / R boardu -->
        <svg class="cosmic-ancient ancient-3" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-width="3">
                <path d="M50,50 Q50,20 75,20 Q90,30 80,50"/>
                <path d="M50,50 Q80,50 80,75 Q70,90 50,80"/>
                <path d="M50,50 Q50,80 25,80 Q10,70 20,50"/>
            </g>
        </svg>
        <!-- Kadim semboller: takvim çemberi -->
        <svg class="cosmic-ancient ancient-4" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="50" r="35" fill="none" stroke="currentColor" stroke-width="2" stroke-dasharray="3,4"/>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" stroke-width="1"/>
            <path d="M85,50 L80,45 L80,55 Z" fill="currentColor"/>
        </svg>
        <!-- Kadim semboller: on iki kollu uygarlık yıldızı -->
        <svg class="cosmic-ancient ancient-5" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="2"/>
            <polygon points="50,15 61,40 88,40 66,57 75,85 50,68 25,85 34,57 12,40 39,40" fill="none" stroke="currentColor" stroke-width="2"/>
        </svg>
        <!-- Kadim semboller: piramit (Giza) -->
        <svg class="cosmic-ancient ancient-6" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-linejoin="round">
                <polygon points="50,12 92,88 8,88" stroke-width="2.5"/>
                <line x1="50" y1="12" x2="68" y2="88" stroke-width="1.5"/>
                <path d="M18,74 H82" stroke-width="1.5" stroke-dasharray="3,6"/>
            </g>
        </svg>
        <!-- Kadim semboller: ankh / hayat anahtarı (Mısır) -->
        <svg class="cosmic-ancient ancient-7" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g fill="none" stroke="currentColor" stroke-width="5">
                <ellipse cx="50" cy="28" rx="16" ry="20"/>
                <line x1="50" y1="48" x2="50" y2="92"/>
                <line x1="24" y1="60" x2="76" y2="60"/>
            </g>
        </svg>
        <!-- Kadim semboller: İştirar sekiz köşeli yıldız (Mezopotamya) -->
        <svg class="cosmic-ancient ancient-8" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <polygon points="50,8 56.9,33.4 79.7,20.3 66.6,43.1 92,50 66.6,56.9 79.7,79.7 56.9,66.6 50,92 43.1,66.6 20.3,79.7 33.4,56.9 8,50 33.4,43.1 20.3,20.3 43.1,33.4" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            <circle cx="50" cy="50" r="5" fill="currentColor"/>
        </svg>
    </div>
    <?php
}