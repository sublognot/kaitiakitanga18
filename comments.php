<?php
/**
 * comments.php — Yorum şablonu.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

if ( post_password_required() ) { return; }
?>
<section id="comments" class="comments-area glass-card" aria-label="<?php esc_attr_e( 'Yorumlar', 'kaitiakitanga' ); ?>">
    <?php if ( have_comments() ) : ?>
        <h3 class="comments-title">
            <i class="fa-regular fa-comments" aria-hidden="true"></i>
            <?php
            $count = get_comments_number();
            printf( esc_html( _n( '%s yorum', '%s yorum', $count, 'kaitiakitanga' ) ), esc_html( number_format_i18n( $count ) ) );
            ?>
        </h3>

        <ol class="comment-list">
            <?php wp_list_comments( array( 'style' => 'ol', 'short_ping' => true, 'avatar_size' => 56 ) ); ?>
        </ol>

        <?php the_comments_navigation( array(
            'prev_text' => '<i class="fa-solid fa-arrow-left" aria-hidden="true"></i> ' . esc_html__( 'Önceki yorumlar', 'kaitiakitanga' ),
            'next_text' => esc_html__( 'Sonraki yorumlar', 'kaitiakitanga' ) . ' <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>',
        ) ); ?>
    <?php endif; ?>

    <?php
    if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) :
        ?>
        <p class="no-comments"><?php esc_html_e( 'Yorumlar kapatıldı.', 'kaitiakitanga' ); ?></p>
        <?php
    endif;

    comment_form( array(
        'title_reply'        => '<i class="fa-regular fa-comment-dots" aria-hidden="true"></i> ' . esc_html__( 'Yorum bırak', 'kaitiakitanga' ),
        'title_reply_to'     => esc_html__( '%s için yorum bırak', 'kaitiakitanga' ),
        'cancel_reply_link'  => esc_html__( 'Yorumu iptal et', 'kaitiakitanga' ),
        'label_submit'       => esc_html__( 'Yorum gönder', 'kaitiakitanga' ),
        'class_submit'       => 'btn btn-primary submit',
        'comment_notes_before' => '<p class="comment-notes">' . esc_html__( 'E-posta adresiniz yayınlanmayacaktır.', 'kaitiakitanga' ) . '</p>',
    ) );
    ?>
</section>
