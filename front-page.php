<?php
/**
 * front-page.php — Kozmik animasyonlu ana sayfa.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();

if ( get_theme_mod( 'kaitiakitanga_cosmic_enable', true ) ) {
    kaitiakitanga_cosmic_background();
}
?>

<main class="front-main">
    <section class="cosmic-hero" aria-label="<?php esc_attr_e( 'Ana sayfa hero', 'kaitiakitanga' ); ?>">
        <div class="container cosmic-hero-inner">
            <h1 class="hero-title fade-in-title">
                <span class="hero-title-text" data-text="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
                    <?php bloginfo( 'name' ); ?>
                </span>
            </h1>

            <div class="hero-search fade-in-up" role="search">
                <form class="hero-search-form" autocomplete="off" action="<?php echo esc_url( home_url( '/' ) ); ?>" method="get">
                    <i class="fa-solid fa-magnifying-glass hero-search-icon" aria-hidden="true"></i>
                    <label class="screen-reader-text" for="hero-search-input"><?php esc_html_e( 'Ara:', 'kaitiakitanga' ); ?></label>
                    <input
                        type="search"
                        id="hero-search-input"
                        class="hero-search-input"
                        name="s"
                        placeholder="<?php esc_attr_e( 'Arama yapın…', 'kaitiakitanga' ); ?>"
                        value=""
                        autocomplete="off"
                        aria-label="<?php esc_attr_e( 'Canlı arama', 'kaitiakitanga' ); ?>"
                        aria-controls="hero-search-results"
                        aria-expanded="false"
                    >
                    <button type="submit" class="hero-search-submit btn btn-primary" aria-label="<?php esc_attr_e( 'Ara', 'kaitiakitanga' ); ?>">
                        <?php esc_html_e( 'Ara', 'kaitiakitanga' ); ?>
                    </button>
                </form>
                <div id="hero-search-results" class="hero-search-results" role="listbox" aria-label="<?php esc_attr_e( 'Arama sonuçları', 'kaitiakitanga' ); ?>" hidden></div>
            </div>
        </div>
    </section>
</main>

<?php get_footer(); ?>