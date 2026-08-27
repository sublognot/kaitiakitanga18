/**
 * Kaitiakitanga — main.js
 * Mobil menü, arama, kopyala, 3 nokta menü, canlı arama, keşfe çık.
 */

(function () {
    'use strict';

    var DATA = window.KaitiakitangaData || {};
    var NONCES = DATA.nonces || {};

    /* Granüler nonce'lara geriye dönük uyumlu erişim */
    function getNonce(name) {
        return (NONCES[name] || DATA.nonce || '');
    }

    function i18n(key, fallback) {
        return (DATA.i18n && DATA.i18n[key]) ? DATA.i18n[key] : fallback;
    }

    function onReady(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    /* Mobil menü */
    function initMenuToggle() {
        var btn = document.querySelector('.menu-toggle');
        var menu = document.querySelector('#primary-menu');
        if (!btn || !menu) return;
        btn.addEventListener('click', function () {
            var isOpen = menu.classList.toggle('is-open');
            btn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });
        document.addEventListener('click', function (e) {
            if (!btn.contains(e.target) && !menu.contains(e.target)) {
                menu.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                menu.classList.remove('is-open');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* Header arama */
    function initSearchToggle() {
        var btn = document.querySelector('.search-toggle');
        var form = document.querySelector('#header-search-form');
        var field = document.querySelector('#header-search-field');
        if (!btn || !form) return;
        btn.addEventListener('click', function () {
            var isOpen = form.hasAttribute('hidden');
            if (isOpen) {
                form.removeAttribute('hidden');
                btn.setAttribute('aria-expanded', 'true');
                if (field) { setTimeout(function () { field.focus(); }, 50); }
            } else {
                form.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !form.hasAttribute('hidden')) {
                form.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', 'false');
                btn.focus();
            }
        });
        document.addEventListener('click', function (e) {
            if (!form.contains(e.target) && !btn.contains(e.target) && !form.hasAttribute('hidden')) {
                form.setAttribute('hidden', '');
                btn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    /* Kopyala butonları */
    function initCopyButtons() {
        var buttons = document.querySelectorAll('.meta-copy, .share-copy');
        if (!buttons.length) return;
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                var url = btn.getAttribute('data-url') || window.location.href;
                var icon = btn.querySelector('i');
                var originalClass = icon ? icon.className : '';
                var label = btn.querySelector('.meta-copy-label, .share-copy-label');
                var originalLabel = label ? label.textContent : '';
                var copiedText = btn.getAttribute('data-copied') || i18n('copied', 'Kopyalandı');

                function showSuccess() {
                    if (label) label.textContent = copiedText;
                    if (icon) icon.className = 'fa-solid fa-check';
                    btn.classList.add('is-copied');
                    btn.setAttribute('title', copiedText);
                    setTimeout(function () {
                        if (label) label.textContent = originalLabel;
                        if (icon) icon.className = originalClass;
                        btn.classList.remove('is-copied');
                        var origTitle = btn.getAttribute('data-original-title') || 'Bağlantıyı Kopyala';
                        btn.setAttribute('title', origTitle);
                    }, 1800);
                }

                if (!btn.getAttribute('data-original-title')) {
                    btn.setAttribute('data-original-title', btn.getAttribute('title') || '');
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(url).then(showSuccess).catch(function () {
                        fallbackCopy(url); showSuccess();
                    });
                } else {
                    fallbackCopy(url); showSuccess();
                }
            });
        });
    }

    function fallbackCopy(text) {
        try {
            var ta = document.createElement('textarea');
            ta.value = text;
            ta.setAttribute('readonly', '');
            ta.style.position = 'absolute';
            ta.style.left = '-9999px';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        } catch (e) {}
    }

    /* 3 nokta menü — portal + sabit katman konumlandırma.
     *
     * Kök neden (hata: menü navigasyonun altında kalıyordu):
     * .post-meta.glass-meta üzerindeki backdrop-filter, çubuğu bir "stacking
     * context"e çevirir; içindeki mutlak konumlu menü hangi z-index'i alırsa
     * alsın sticky .site-header'ın (z-index:100) altına boyanıyordu.
     *
     * Çözüm: Menü <body> düzeyine taşınır (portal). position:fixed koordinatları
     * JS ile düğmeye göre hesaplanır; ekran kenarlarına kelepçelenir, altta yer
     * yoksa düğmenin üstüne çevrilir; scroll/resize'da rAF ile yeniden
     * konumlanır. Böylece hiçbir ata elemanın filter/transform tuzağına
     * düşmez ve asla nav arkasına sızamaz. */
    function initMoreMenu() {
        var wrap = document.querySelector('.meta-more-wrap');
        if (!wrap) return;
        var btn = wrap.querySelector('.meta-more');
        var menu = wrap.querySelector('.meta-more-menu');
        if (!btn || !menu) return;

        // Portal: metin çubuğunun stacking-context tuzaklarından çıkar.
        if (menu.parentNode !== document.body) { document.body.appendChild(menu); }

        var MARGIN = 8;
        var repFrame = null;
        var posFrame = null;

        function isOpen() {
            return menu.classList.contains('is-open');
        }

        function positionMenu() {
            var rect = btn.getBoundingClientRect();
            var vw = window.innerWidth;
            var vh = window.innerHeight;
            var mw = menu.offsetWidth;
            var mh = menu.offsetHeight;

            // Dikey: önce düğmenin altına sığdır; sığmıyorsa üstüne çevir.
            var top = rect.bottom + MARGIN;
            if (top + mh > vh - MARGIN) {
                var aboveTop = rect.top - mh - MARGIN;
                top = (aboveTop >= MARGIN) ? aboveTop : Math.max(MARGIN, vh - mh - MARGIN);
            }
            top = Math.max(MARGIN, Math.min(top, Math.max(MARGIN, vh - MARGIN)));

            // Yatay: sağ kenarları hizala; ekran içine sıkıştır.
            var left = rect.right - mw;
            left = Math.max(MARGIN, Math.min(left, vw - mw - MARGIN));

            menu.style.left = Math.round(left) + 'px';
            menu.style.top = Math.round(top) + 'px';
        }

        function scheduleReposition() {
            if (!isOpen() || repFrame) return;
            repFrame = requestAnimationFrame(function () {
                repFrame = null;
                positionMenu();
            });
        }

        function openMenu() {
            if (isOpen()) return;
            menu.removeAttribute('hidden');
            // Ölçüm ilk karede kullanıcıya yanlış yerde gösterilmeden yapılır.
            menu.style.visibility = 'hidden';
            posFrame = requestAnimationFrame(function () {
                posFrame = null;
                positionMenu();
                menu.style.visibility = '';
                menu.classList.add('is-open');
            });
            btn.setAttribute('aria-expanded', 'true');
        }

        function closeMenu() {
            if (!isOpen()) return;
            menu.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            setTimeout(function () {
                if (!isOpen()) {
                    menu.setAttribute('hidden', '');
                    menu.style.left = '';
                    menu.style.top = '';
                    menu.style.visibility = '';
                }
            }, 250);
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (isOpen()) { closeMenu(); } else { openMenu(); }
        });

        // Dışarı tıklama — menü artık body altında olduğundan içeriği de hariç tutulmalı.
        document.addEventListener('click', function (e) {
            if (!isOpen()) return;
            if (wrap.contains(e.target) || menu.contains(e.target)) return;
            closeMenu();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isOpen()) { closeMenu(); btn.focus(); }
        });

        // Açıkken scroll/resize: kapatmak yerine paneli düğmeyle birlikte taşı.
        window.addEventListener('scroll', scheduleReposition, { passive: true });
        window.addEventListener('resize', scheduleReposition, { passive: true });

        // Şablon JS'i (reading.js) için köprü: doğrudan class manipülasyonu yerine
        // tek kapıdan yönetilsin ki [hidden]/aria-expanded daima tutarlı kalsın.
        window.KaitiakitangaUI = window.KaitiakitangaUI || {};
        window.KaitiakitangaUI.closeMoreMenu = closeMenu;
        window.KaitiakitangaUI.positionMoreMenu = scheduleReposition;
    }

    /* Mobil alt menüler */
    function initMobileSubmenu() {
        var items = document.querySelectorAll('.nav-menu .menu-item-has-children > a');
        if (!items.length) return;
        items.forEach(function (link) {
            link.addEventListener('click', function (e) {
                if (window.innerWidth > 768) return;
                var li = link.parentNode;
                var sub = li.querySelector('.sub-menu');
                if (!sub) return;
                e.preventDefault();
                sub.style.display = (sub.style.display === 'block') ? '' : 'block';
            });
        });
    }

    /* Dış bağlantılara rel ekle */
    function initExternalLinks() {
        var links = document.querySelectorAll('a[href^="http"]');
        var host = window.location.hostname;
        links.forEach(function (a) {
            try {
                var u = new URL(a.href);
                if (u.hostname !== host) {
                    var rel = a.getAttribute('rel') || '';
                    if (rel.indexOf('noopener') === -1) rel += ' noopener';
                    if (rel.indexOf('noreferrer') === -1) rel += ' noreferrer';
                    a.setAttribute('rel', rel.trim());
                    if (!a.hasAttribute('target')) a.setAttribute('target', '_blank');
                }
            } catch (e) {}
        });
    }

    /* Canlı arama (hero + 404 + 503) */
    function initLiveSearch() {
        var inputs = document.querySelectorAll('#hero-search-input, #error-404-search-input, #error-503-search-input');
        if (!inputs.length) return;
        inputs.forEach(function (input) {
            var resultsId;
            if (input.id === 'hero-search-input') resultsId = 'hero-search-results';
            else if (input.id === 'error-404-search-input') resultsId = 'error-404-search-results';
            else resultsId = 'error-503-search-results';
            var results = document.getElementById(resultsId);
            if (!results) return;
            bindLiveSearch(input, results);
        });
    }

    function bindLiveSearch(input, results) {
        var debounceTimer = null;
        var currentRequest = null;
        var minLength = 2;
        var items = [];
        var highlighted = -1;

        function debounce(fn, delay) {
            return function () {
                var ctx = this, args = arguments;
                clearTimeout(debounceTimer);
                debounceTimer = setTimeout(function () { fn.apply(ctx, args); }, delay);
            };
        }

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.textContent = str == null ? '' : String(str);
            return div.innerHTML;
        }

        function highlightMatch(text, q) {
            if (!text || !q) return escapeHtml(text);
            var esc = escapeHtml(text);
            var re = new RegExp('(' + q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi');
            return esc.replace(re, '<mark>$1</mark>');
        }

        function showLoading() {
            results.innerHTML = '<div class="ls-state ls-loading"><div class="ls-spinner"></div><span>' +
                i18n('searching', 'Aranıyor…') + '</span></div>';
            results.removeAttribute('hidden');
            input.setAttribute('aria-expanded', 'true');
        }

        function showEmpty(q) {
            results.innerHTML = '<div class="ls-state ls-empty"><div class="ls-empty-icon"><i class="fa-solid fa-magnifying-glass"></i></div><div class="ls-empty-text"><strong>' +
                (i18n('noResults', 'Sonuç bulunamadı:') + ' "' + escapeHtml(q) + '"') +
                '</strong><span>' + i18n('tryDifferent', 'Farklı anahtar kelimeler deneyin.') + '</span></div></div>';
            results.removeAttribute('hidden');
            input.setAttribute('aria-expanded', 'true');
        }

        function renderItems(data, q) {
            items = data; highlighted = -1;
            if (!items.length) { showEmpty(q); return; }
            var html = '<ul class="ls-list" role="listbox">';
            items.forEach(function (item, idx) {
                var thumb = item.thumb
                    ? '<div class="ls-thumb"><img src="' + escapeHtml(item.thumb) + '" alt="" loading="lazy" decoding="async"></div>'
                    : '<div class="ls-thumb ls-thumb-empty"><i class="fa-solid fa-' + (item.category ? 'newspaper' : 'file-lines') + '" aria-hidden="true"></i></div>';
                var cat = item.category ? '<span class="ls-cat">' + escapeHtml(item.category) + '</span>' : '';
                var date = item.date ? '<span class="ls-date"><i class="fa-regular fa-calendar" aria-hidden="true"></i> ' + escapeHtml(item.date) + '</span>' : '';
                var excerpt = item.excerpt ? '<p class="ls-excerpt">' + highlightMatch(item.excerpt, q) + '</p>' : '';
                html += '<li role="option" class="ls-item" data-idx="' + idx + '" data-url="' + escapeHtml(item.url) + '">' +
                    thumb +
                    '<div class="ls-body">' +
                        '<h4 class="ls-title">' + highlightMatch(item.title, q) + '</h4>' +
                        excerpt +
                        '<div class="ls-meta">' + cat + date + '</div>' +
                    '</div>' +
                    '<i class="fa-solid fa-arrow-right ls-arrow" aria-hidden="true"></i>' +
                '</li>';
            });
            html += '</ul>';
            html += '<a href="' + (DATA.homeUrl || '/') + '?s=' + encodeURIComponent(q) + '" class="ls-all"><span>' +
                i18n('seeAll', 'Tüm sonuçları gör') +
                '</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
            results.innerHTML = html;
            results.removeAttribute('hidden');
            input.setAttribute('aria-expanded', 'true');
            bindItemClicks();
        }

        function bindItemClicks() {
            var lis = results.querySelectorAll('.ls-item');
            lis.forEach(function (li) {
                li.addEventListener('click', function () {
                    var url = li.getAttribute('data-url');
                    if (url) window.location.href = url;
                });
                li.addEventListener('mouseenter', function () {
                    var idx = parseInt(li.getAttribute('data-idx'), 10);
                    setHighlight(idx);
                });
            });
        }

        function setHighlight(idx) {
            var lis = results.querySelectorAll('.ls-item');
            if (!lis.length) return;
            if (idx < 0) idx = lis.length - 1;
            if (idx >= lis.length) idx = 0;
            lis.forEach(function (li, i) {
                if (i === idx) { li.classList.add('is-active'); li.scrollIntoView({ block: 'nearest' }); }
                else { li.classList.remove('is-active'); }
            });
            highlighted = idx;
        }

        function hideResults() {
            results.setAttribute('hidden', '');
            results.innerHTML = '';
            input.setAttribute('aria-expanded', 'false');
            highlighted = -1; items = [];
        }

        function performSearch(q) {
            if (currentRequest) { try { currentRequest.abort(); } catch (e) {} currentRequest = null; }
            if (!q || q.length < minLength) { hideResults(); return; }
            showLoading();
            var ajaxUrl = DATA.ajaxUrl || '/wp-admin/admin-ajax.php';
            var nonce = getNonce('search');
            var body = 'action=kaitiakitanga_live_search&s=' + encodeURIComponent(q) + '&nonce=' + encodeURIComponent(nonce);
            try {
                var xhr = new XMLHttpRequest();
                currentRequest = xhr;
                xhr.open('POST', ajaxUrl, true);
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                xhr.onreadystatechange = function () {
                    if (xhr.readyState !== 4) return;
                    if (xhr === currentRequest) currentRequest = null;
                    if (xhr.status !== 200) { if (xhr.status !== 0) showEmpty(q); return; }
                    try {
                        var data = JSON.parse(xhr.responseText);
                        if (data && data.success && data.data && data.data.items) renderItems(data.data.items, q);
                        else showEmpty(q);
                    } catch (e) { showEmpty(q); }
                };
                xhr.send(body);
            } catch (e) { showEmpty(q); }
        }

        var debouncedSearch = debounce(performSearch, 250);

        input.addEventListener('input', function () {
            var q = (input.value || '').trim();
            if (q.length < minLength) { hideResults(); return; }
            debouncedSearch(q);
        });

        input.addEventListener('focus', function () {
            var q = (input.value || '').trim();
            if (q.length >= minLength && !results.innerHTML) debouncedSearch(q);
        });

        input.addEventListener('keydown', function (e) {
            if (results.hasAttribute('hidden')) return;
            if (e.key === 'Escape') { input.value = ''; hideResults(); input.blur(); return; }
            if (e.key === 'ArrowDown') { e.preventDefault(); setHighlight(highlighted < 0 ? 0 : highlighted + 1); }
            else if (e.key === 'ArrowUp') { e.preventDefault(); setHighlight(highlighted < 0 ? 0 : highlighted - 1); }
            else if (e.key === 'Enter') {
                if (highlighted >= 0 && items[highlighted]) { e.preventDefault(); window.location.href = items[highlighted].url; }
            }
        });

        document.addEventListener('click', function (e) {
            var w = input.closest('.hero-search') || input.closest('.error-search');
            if (w && !w.contains(e.target)) hideResults();
        });
    }

    /* Keşfe çık butonu */
    function initExploreButtons() {
        var buttons = document.querySelectorAll('.explore-btn');
        if (!buttons.length) return;
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault(); e.stopPropagation();
                var ajaxUrl = DATA.ajaxUrl || '/wp-admin/admin-ajax.php';
                var nonce = getNonce('random');
                var originalHTML = btn.innerHTML;
                var exploringText = i18n('exploring', 'Keşfe çıkılıyor…');
                var failText = i18n('exploreFail', 'Şu an keşif yapılamıyor.');

                btn.classList.add('is-loading');
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin" aria-hidden="true"></i><span>' + exploringText + '</span>';

                var body = 'action=kaitiakitanga_random_post&nonce=' + encodeURIComponent(nonce);
                try {
                    var xhr = new XMLHttpRequest();
                    xhr.open('POST', ajaxUrl, true);
                    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
                    xhr.onreadystatechange = function () {
                        if (xhr.readyState !== 4) return;
                        try {
                            var data = JSON.parse(xhr.responseText);
                            if (data && data.success && data.data && data.data.url) {
                                window.location.href = data.data.url; return;
                            }
                        } catch (err) {}
                        btn.classList.remove('is-loading');
                        btn.disabled = false;
                        btn.innerHTML = '<i class="fa-solid fa-triangle-exclamation" aria-hidden="true"></i><span>' + failText + '</span>';
                        setTimeout(function () { btn.innerHTML = originalHTML; }, 2000);
                    };
                    xhr.send(body);
                } catch (e) {
                    btn.classList.remove('is-loading'); btn.disabled = false; btn.innerHTML = originalHTML;
                }
            });
        });
    }

    /* Görüntülenme sayacı (tekil yazılar) */
    function initTrackViews() {
        if (!DATA.trackViews) return;
        var postId = parseInt(DATA.postId, 10);
        if (!postId || postId < 1 || !DATA.ajaxUrl) return;

        // Aynı oturumda tekrar sayma.
        var storeKey = 'kk_viewed_' + postId;
        try {
            if (sessionStorage.getItem(storeKey)) return;
            sessionStorage.setItem(storeKey, '1');
        } catch (e) {}

        var body = 'action=kaitiakitanga_track_view&post_id=' + postId +
            '&nonce=' + encodeURIComponent(getNonce('view'));
        try {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', DATA.ajaxUrl, true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.send(body);
        } catch (e) {}
    }

    onReady(function () {
        initMenuToggle();
        initSearchToggle();
        initCopyButtons();
        initMoreMenu();
        initMobileSubmenu();
        initExternalLinks();
        initLiveSearch();
        initExploreButtons();
        initTrackViews();
    });
})();
