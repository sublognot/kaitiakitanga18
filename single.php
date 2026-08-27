<?php
/**
 * single.php — Tekil yazı şablonu.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

get_header();

while ( have_posts() ) :
    the_post();
    $format = get_post_format() ?: 'standard';
    $is_video = 'video' === $format || has_category( 'video' );
    $is_image = 'image' === $format || has_category( 'galeri' );
    ?>
    <main class="single-main reading-width" id="primary">
        <article id="post-<?php the_ID(); ?>" <?php post_class( 'single-post-article' ); ?>>
            <header class="single-header">
                <h1 class="single-title"><?php the_title(); ?></h1>

                <?php if ( has_excerpt() ) : ?>
                    <p class="single-subtitle"><?php echo esc_html( get_the_excerpt() ); ?></p>
                <?php endif; ?>

                <?php kaitiakitanga_post_meta(); ?>

                <?php if ( $is_video ) : ?>
                    <div class="single-type-banner video">
                        <i class="fa-solid fa-play" aria-hidden="true"></i>
                        <?php esc_html_e( 'Bu yazı video içerir', 'kaitiakitanga' ); ?>
                    </div>
                <?php elseif ( $is_image ) : ?>
                    <div class="single-type-banner image">
                        <i class="fa-regular fa-image" aria-hidden="true"></i>
                        <?php esc_html_e( 'Bu yazı görsel ağırlıklıdır', 'kaitiakitanga' ); ?>
                    </div>
                <?php endif; ?>
            </header>

            <div class="single-content entry-content" id="single-content">
                <?php
                the_content();
                wp_link_pages( array(
                    'before' => '<div class="page-links"><span class="page-links-label">' . esc_html__( 'Sayfalar:', 'kaitiakitanga' ) . '</span>',
                    'after'  => '</div>',
                ) );
                ?>
            </div>

            <?php kaitiakitanga_tags_list(); ?>
            <?php kaitiakitanga_share_buttons(); ?>

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