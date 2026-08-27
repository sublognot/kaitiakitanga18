<?php
/**
 * Template part: sadece başlık listesi (modern UI).
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

$reading = function_exists( 'kaitiakitanga_reading_time' )
    ? kaitiakitanga_reading_time( get_the_content() )
    : 0;
?>
<article id="post-<?php the_ID(); ?>" <?php post_class( 'title-list-item' ); ?>>
    <a href="<?php the_permalink(); ?>" class="title-list-link" rel="bookmark">
        <span class="title-list-text"><?php the_title(); ?></span>
        <span class="title-list-meta">
            <?php if ( $reading > 0 ) : ?>
                <span class="title-list-reading">
                    <i class="fa-regular fa-clock" aria-hidden="true"></i>
                    <?php echo esc_html( $reading ); ?> <?php esc_html_e( 'dk', 'kaitiakitanga' ); ?>
                </span>
            <?php endif; ?>
            <span class="title-list-date" title="<?php echo esc_attr( sprintf( __( 'Güncelleme: %s', 'kaitiakitanga' ), get_the_modified_date( 'd.m.Y' ) ) ); ?>">
                <i class="fa-regular fa-calendar" aria-hidden="true"></i>
                <?php echo esc_html( get_the_date( 'd.m.Y' ) ); ?>
            </span>
            <i class="fa-solid fa-arrow-right title-list-arrow" aria-hidden="true"></i>
        </span>
    </a>
</article>