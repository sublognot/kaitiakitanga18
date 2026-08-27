<?php
/**
 * header.php
 *
 * @package Kaitiakitanga
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
    <meta name="theme-color" content="#0a0a1f">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<a class="skip-link screen-reader-text" href="#main"><?php esc_html_e( 'İçeriğe atla', 'kaitiakitanga' ); ?></a>

<header id="masthead" class="site-header" role="banner">
    <div class="container header-inner">
        <div class="site-branding">
            <?php if ( has_custom_logo() ) : ?>
                <?php the_custom_logo(); ?>
            <?php else : ?>
                <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="site-logo-text" rel="home">
                    <i class="fa-solid fa-atom" aria-hidden="true"></i>
                    <span class="site-title"><?php bloginfo( 'name' ); ?></span>
                </a>
            <?php endif; ?>
        </div>

        <nav id="site-navigation" class="main-navigation" role="navigation" aria-label="<?php esc_attr_e( 'Birincil menü', 'kaitiakitanga' ); ?>">
            <?php
            if ( has_nav_menu( 'primary' ) ) {
                wp_nav_menu( array( 'theme_location' => 'primary', 'menu_id' => 'primary-menu', 'container' => false, 'menu_class' => 'menu nav-menu', 'depth' => 3 ) );
            } else {
                echo '<ul class="menu nav-menu"><li><a href="' . esc_url( home_url( '/' ) ) . '">' . esc_html__( 'Ana Sayfa', 'kaitiakitanga' ) . '</a></li></ul>';
            }
            ?>
        </nav>

        <div class="header-actions">
            <button type="button" class="search-toggle btn-icon" aria-label="<?php esc_attr_e( 'Arama', 'kaitiakitanga' ); ?>" aria-expanded="false" aria-controls="header-search-form">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
            <button type="button" class="menu-toggle btn-icon" aria-label="<?php esc_attr_e( 'Menü', 'kaitiakitanga' ); ?>" aria-expanded="false" aria-controls="primary-menu">
                <i class="fa-solid fa-bars" aria-hidden="true"></i>
            </button>
        </div>

        <form id="header-search-form" class="header-search" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>" hidden>
            <label class="screen-reader-text" for="header-search-field"><?php esc_html_e( 'Arama:', 'kaitiakitanga' ); ?></label>
            <input type="search" id="header-search-field" class="header-search-field" placeholder="<?php esc_attr_e( 'Ara…', 'kaitiakitanga' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" autocomplete="off">
            <button type="submit" class="header-search-submit" aria-label="<?php esc_attr_e( 'Ara', 'kaitiakitanga' ); ?>">
                <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
            </button>
        </form>
    </div>
</header>

<div id="main" class="site-main">