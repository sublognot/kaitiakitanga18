<?php
/**
 * search.php — Arama sonuçları.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>
<main class="archive-main container" id="primary">
    <header class="page-header search-header glass-card">
        <h1 class="page-title">
            <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            <?php printf( esc_html__( 'Arama sonuçları: %s', 'kaitiakitanga' ), '<span class="search-query">' . esc_html( get_search_query() ) . '</span>' ); ?>
        </h1>
    </header>

    <?php if ( have_posts() ) : ?>
        <div class="title-list">
            <?php while ( have_posts() ) : the_post(); get_template_part( 'template-parts/content', 'title' ); endwhile; ?>
        </div>

        <nav class="pagination-nav" aria-label="<?php esc_attr_e( 'Sayfa navigasyonu', 'kaitiakitanga' ); ?>">
            <?php the_posts_pagination( array(
                'mid_size'  => 1,
                'prev_text' => '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ' . esc_html__( 'Önceki', 'kaitiakitanga' ),
                'next_text' => esc_html__( 'Sonraki', 'kaitiakitanga' ) . ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>',
            ) ); ?>
        </nav>
    <?php else : ?>
        <div class="no-results-wrap">
            <p><?php esc_html_e( 'Maalesef aramanızla eşleşen içerik bulunamadı. Farklı anahtar kelimeler deneyin.', 'kaitiakitanga' ); ?></p>
            <?php get_search_form(); ?>
        </div>
    <?php endif; ?>
</main>
<?php get_footer(); ?>