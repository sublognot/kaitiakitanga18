<?php
/**
 * 503.php — Hizmet dışı sayfası (uyuyan gezegen animasyonlu).
 * Erişim: /503/ veya ?error=503
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>

<main class="error-page error-503-main" id="primary" role="main">
    <section class="error-card" aria-label="<?php esc_attr_e( 'Hizmet dışı', 'kaitiakitanga' ); ?>">

        <div class="sleeping-planet" aria-hidden="true">
            <div class="planet-body">
                <div class="planet-crater crater-1"></div>
                <div class="planet-crater crater-2"></div>
                <div class="planet-crater crater-3"></div>
                <div class="planet-eye">
                    <span class="planet-lid"></span>
                </div>
            </div>
            <div class="zzz">
                <span class="zzz-item zzz-1">z</span>
                <span class="zzz-item zzz-2">z</span>
                <span class="zzz-item zzz-3">Z</span>
            </div>
            <div class="planet-orbit"></div>
        </div>

        <span class="error-eyebrow error-eyebrow-503">
            <i class="fa-solid fa-wrench" aria-hidden="true"></i>
            <?php esc_html_e( 'Hizmet dışı', 'kaitiakitanga' ); ?>
        </span>

        <h1 class="error-title">503</h1>

        <p class="error-text">
            <?php esc_html_e( 'Sunucu şu an cevap veremiyor — birazdan tekrar deneyin veya keşfe çıkarak içeriklere göz atın.', 'kaitiakitanga' ); ?>
        </p>

        <div class="error-search" role="search">
            <form class="hero-search-form" autocomplete="off" action="<?php echo esc_url( home_url( '/' ) ); ?>" method="get">
                <i class="fa-solid fa-magnifying-glass hero-search-icon" aria-hidden="true"></i>
                <label class="screen-reader-text" for="error-503-search-input"><?php esc_html_e( 'Ara:', 'kaitiakitanga' ); ?></label>
                <input type="search" id="error-503-search-input" class="hero-search-input" name="s" placeholder="<?php esc_attr_e( 'Arama yapın…', 'kaitiakitanga' ); ?>" value="" autocomplete="off" aria-label="<?php esc_attr_e( 'Canlı arama', 'kaitiakitanga' ); ?>" aria-controls="error-503-search-results" aria-expanded="false">
                <button type="submit" class="hero-search-submit btn btn-primary" aria-label="<?php esc_attr_e( 'Ara', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                </button>
            </form>
            <div id="error-503-search-results" class="hero-search-results" role="listbox" aria-label="<?php esc_attr_e( 'Arama sonuçları', 'kaitiakitanga' ); ?>" hidden></div>
        </div>

        <div class="error-actions">
            <button type="button" class="btn btn-primary explore-btn" data-explore>
                <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                <span><?php esc_html_e( 'Keşfe çık', 'kaitiakitanga' ); ?></span>
            </button>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-outline">
                <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
                <?php esc_html_e( 'Tekrar dene', 'kaitiakitanga' ); ?>
            </a>
        </div>
    </section>
</main>

<?php get_footer(); ?>
