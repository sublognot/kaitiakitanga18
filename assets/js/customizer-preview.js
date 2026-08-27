/**
 * Kaitiakitanga — customizer-preview.js
 * Customizer canlı önizleme: vurgu rengi değişikliğini anında uygular.
 * Bağımlılık: customize-preview (WP çekirdeği).
 */
(function () {
	'use strict';

	if ( ! window.wp || ! window.wp.customize ) { return; }

	wp.customize( 'kaitiakitanga_accent_color', function ( value ) {
		value.bind( function ( to ) {
			if ( to && /^#[0-9a-fA-F]{3}([0-9a-fA-F]{3})?$/.test( to ) ) {
				document.documentElement.style.setProperty( '--color-accent', to );
			}
		} );
	} );
})();
