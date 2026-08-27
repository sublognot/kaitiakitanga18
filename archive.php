<?php
/**
 * archive.php — Kategori, etiket, taksonomi arşivleri.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();
?>
<main class="archive-main container" id="primary">
    <header class="page-header archive-header glass-card">
        <h1 class="page-title">
            <i class="fa-solid fa-folder-open" aria-hidden="true"></i>
            <?php the_archive_title(); ?>
        </h1>
        <?php the_archive_description( '<div class="archive-description">', '</div>' ); ?>
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
        <?php get_template_part( 'template-parts/content', 'none' ); ?>
    <?php endif; ?>
</main>
<?php get_footer(); ?>
