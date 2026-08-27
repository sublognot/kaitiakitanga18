<?php
/**
 * footer.php — Alt bilgi: marka satırı, menüler, sosyal ikonlar ve telif.
 *
 * v2.3.0: Alt bilgi widget sütunları kaldırıldı; okunaklı üç bölgeli düzen:
 * 1) marka (site adı + slogan) ve alt bilgi menüsü, 2) sosyal ikonlar,
 * 3) telif + sayfa başına dön.
 *
 * @package Kaitiakitanga
 * @version 2.4.0
 */
?>
</div><!-- #main -->

<footer id="colophon" class="site-footer glass-footer" role="contentinfo">
        <div class="container footer-main">
                <div class="footer-brand">
                        <p class="footer-site-title">
                                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
                        </p>
                        <?php $kk_site_desc = get_bloginfo( 'description', 'display' ); ?>
                        <?php if ( ! empty( $kk_site_desc ) ) : ?>
                                <p class="footer-site-desc"><?php echo esc_html( $kk_site_desc ); ?></p>
                        <?php endif; ?>
                </div>

                <?php if ( has_nav_menu( 'footer' ) ) : ?>
                        <nav class="footer-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Alt Bilgi Menüsü', 'kaitiakitanga' ); ?>">
                                <?php
                                wp_nav_menu( array(
                                        'theme_location' => 'footer',
                                        'menu_id'        => 'footer-menu',
                                        'container'      => false,
                                        'menu_class'     => 'menu footer-menu',
                                        'depth'          => 1,
                                ) );
                                ?>
                        </nav>
                <?php endif; ?>
        </div>

        <?php if ( has_nav_menu( 'social' ) ) : ?>
        <div class="footer-social-row">
                <div class="container footer-social-inner">
                        <nav class="social-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Sosyal Menü', 'kaitiakitanga' ); ?>">
                                <?php
                                wp_nav_menu( array(
                                        'theme_location' => 'social',
                                        'menu_id'        => 'social-menu',
                                        'container'      => false,
                                        'menu_class'     => 'menu social-menu',
                                        'depth'          => 1,
                                        'link_before'    => '<span class="screen-reader-text">',
                                        'link_after'     => '</span><i class="fa-solid fa-link social-icon" aria-hidden="true"></i>',
                                ) );
                                ?>
                        </nav>
                </div>
        </div>
        <?php endif; ?>

        <div class="footer-bottom">
                <div class="container footer-bottom-inner">
                        <p class="footer-copyright">
                                &copy; <?php echo esc_html( gmdate( 'Y' ) ); ?>
                                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home"><?php bloginfo( 'name' ); ?></a>
                                <span class="meta-sep" aria-hidden="true">·</span>
                                <span><?php esc_html_e( 'Tüm hakları saklıdır.', 'kaitiakitanga' ); ?></span>
                        </p>

                        <a class="back-to-top btn-icon" href="#main" aria-label="<?php esc_attr_e( 'Sayfa başına dön', 'kaitiakitanga' ); ?>">
                                <i class="fa-solid fa-arrow-up" aria-hidden="true"></i>
                        </a>
                </div>
        </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
