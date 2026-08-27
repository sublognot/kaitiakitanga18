<?php
/**
 * Arama formu şablonu.
 *
 * @package Kaitiakitanga
 */
?>
<form role="search" method="get" class="search-form glass-card" action="<?php echo esc_url( home_url( '/' ) ); ?>">
    <label class="screen-reader-text" for="kaitiakitanga-search-field"><?php esc_html_e( 'Arama:', 'kaitiakitanga' ); ?></label>
    <div class="search-form-row">
        <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i>
        <input type="search" id="kaitiakitanga-search-field" class="search-field" placeholder="<?php esc_attr_e( 'Ara…', 'kaitiakitanga' ); ?>" value="<?php echo esc_attr( get_search_query() ); ?>" name="s" autocomplete="off">
        <button type="submit" class="search-submit btn btn-primary"><?php esc_html_e( 'Ara', 'kaitiakitanga' ); ?></button>
    </div>
</form>