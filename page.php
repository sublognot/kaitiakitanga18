<?php
/**
 * page.php — Statik sayfa şablonu.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();

while ( have_posts() ) :
    the_post();
    ?>
    <main class="page-main reading-width" id="primary">
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'page-article' ); ?>>
            <header class="page-header single-header">
                <h1 class="single-title"><?php the_title(); ?></h1>
                <?php kaitiakitanga_post_meta(); ?>
            </header>

            <?php if ( has_post_thumbnail() ) : ?>
                <figure class="single-thumbnail">
                    <?php the_post_thumbnail( 'kaitiakitanga-wide' ); ?>
                </figure>
            <?php endif; ?>

            <div class="single-content entry-content" id="single-content">
                <?php
                the_content();
                wp_link_pages( array(
                    'before' => '<div class="page-links"><span class="page-links-label">' . esc_html__( 'Sayfalar:', 'kaitiakitanga' ) . '</span>',
                    'after'  => '</div>',
                ) );
                ?>
            </div>

            <?php
            if ( comments_open() || get_comments_number() ) {
                comments_template();
            }
            ?>
        </article>
    </main>
    <?php
endwhile;

get_footer();