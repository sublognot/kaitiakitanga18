<?php
/**
 * 404.php — Bulunamadı sayfası (karadelik animasyonlu).
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>

<main class="error-page error-404-main" id="primary" role="main">
    <section class="error-card" aria-label="<?php esc_attr_e( 'Sayfa bulunamadı', 'kaitiakitanga' ); ?>">

        <div class="wormhole" aria-hidden="true">
            <div class="wormhole-core"></div>
            <div class="wormhole-disk wormhole-disk-1"></div>
            <div class="wormhole-disk wormhole-disk-2"></div>
            <div class="wormhole-disk wormhole-disk-3"></div>
            <div class="wormhole-spark spark-1"></div>
            <div class="wormhole-spark spark-2"></div>
            <div class="wormhole-spark spark-3"></div>
        </div>

        <span class="error-eyebrow">
            <i class="fa-solid fa-satellite-dish" aria-hidden="true"></i>
            <?php esc_html_e( 'Sinyal kayboldu', 'kaitiakitanga' ); ?>
        </span>

        <h1 class="error-title">404</h1>

        <p class="error-text">
            <?php esc_html_e( 'Aradığınız konu ya kaldırılmış, ya taşınmış veya hiç var olmamış olabilir.', 'kaitiakitanga' ); ?>
        </p>

        <div class="error-search" role="search">
            <form class="hero-search-form" autocomplete="off" action="<?php echo esc_url( home_url( '/' ) ); ?>" method="get">
                <i class="fa-solid fa-magnifying-glass hero-search-icon" aria-hidden="true"></i>
                <label class="screen-reader-text" for="error-404-search-input"><?php esc_html_e( 'Ara:', 'kaitiakitanga' ); ?></label>
                <input type="search" id="error-404-search-input" class="hero-search-input" name="s" placeholder="<?php esc_attr_e( 'Arama yapın…', 'kaitiakitanga' ); ?>" value="" autocomplete="off" aria-label="<?php esc_attr_e( 'Canlı arama', 'kaitiakitanga' ); ?>" aria-controls="error-404-search-results" aria-expanded="false">
                <button type="submit" class="hero-search-submit btn btn-primary" aria-label="<?php esc_attr_e( 'Ara', 'kaitiakitanga' ); ?>">
                    <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
                </button>
            </form>
            <div id="error-404-search-results" class="hero-search-results" role="listbox" aria-label="<?php esc_attr_e( 'Arama sonuçları', 'kaitiakitanga' ); ?>" hidden></div>
        </div>

        <div class="error-actions">
            <button type="button" class="btn btn-primary explore-btn" data-explore>
                <i class="fa-solid fa-shuffle" aria-hidden="true"></i>
                <span><?php esc_html_e( 'Keşfe çık', 'kaitiakitanga' ); ?></span>
            </button>
            <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-outline">
                <i class="fa-solid fa-house" aria-hidden="true"></i>
                <?php esc_html_e( 'Ana sayfa', 'kaitiakitanga' ); ?>
            </a>
        </div>
    </section>
</main>

<?php get_footer(); ?>
