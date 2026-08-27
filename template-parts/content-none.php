<?php
/**
 * Template part: içerik bulunamadı.
 *
 * @package Kaitiakitanga
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }
?>
<article class="no-results glass-card">
    <header class="page-header">
        <h2 class="page-title">
            <i class="fa-solid fa-ghost" aria-hidden="true"></i>
            <?php esc_html_e( 'İçerik bulunamadı', 'kaitiakitanga' ); ?>
        </h2>
    </header>
    <div class="page-content">
        <p><?php esc_html_e( 'Aradığınız içerik burada değil. Belki kaldırıldı, belki de yeniden adlandırıldı.', 'kaitiakitanga' ); ?></p>
        <?php get_search_form(); ?>
    </div>
</article>