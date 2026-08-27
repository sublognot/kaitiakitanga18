/**
 * Kaitiakitanga — reading.js
 * Yazı boyutu, gözlük paneli, okuma genişliği, kaynak paneli, okuma ilerlemesi,
 * seçim araç çubuğu (Kopyala | Sözlük | Ara).
 */

(function () {
    'use strict';

    function onReady(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    /* Yazı boyutu kontrolü (gözlük paneli) */
    function initFontSizeControl() {
        var content = document.getElementById('single-content');
        if (!content) return;

        var store = 'kaitiakitanga_font_scale';
        var scales = ['small', 'normal', 'large', 'xlarge', 'xxlarge'];
        var saved = null;
        try { saved = localStorage.getItem(store); } catch (e) {}
        if (saved && scales.indexOf(saved) !== -1) {
            content.setAttribute('data-font-scale', saved);
        }

        // Tüm font butonlarını seç (gözlük panelindeki −, ↺, + butonları).
        var actions = document.querySelectorAll('.meta-font-increase, .meta-font-decrease, .meta-font-reset');
        if (!actions.length) return;

        actions.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                // Event'in yayılmasını durdur — böylece gözlük paneli kapanmaz,
                // dışarı tıklama handler'ı tetiklenmez.
                e.preventDefault();
                e.stopPropagation();

                var action = btn.getAttribute('data-action') || 'increase';
                var current = content.getAttribute('data-font-scale') || 'normal';
                var idx = scales.indexOf(current);
                if (idx === -1) idx = 1;

                if (action === 'increase') {
                    idx = Math.min(idx + 1, scales.length - 1);
                } else if (action === 'decrease') {
                    idx = Math.max(idx - 1, 0);
                } else if (action === 'reset') {
                    idx = 1; // normal
                }

                var next = scales[idx];
                content.setAttribute('data-font-scale', next);
                try { localStorage.setItem(store, next); } catch (e) {}

                // Aktif butonu görsel olarak işaretle (feedback).
                actions.forEach(function (b) { b.classList.remove('is-active'); });
                btn.classList.add('is-active');
                setTimeout(function () { btn.classList.remove('is-active'); }, 300);

                // 3 nokta menüsünü kapat (varsa).
                closeMoreMenu();
            });
        });
    }

    /* 3 nokta menüyü kapatma köprüsü — sahiplik main.js'tedir.
     * Doğrudan class manipülasyonu [hidden]/aria-expanded tutarsızlığı
     * yaratabildiğinden tek kapıdan çağrılır (yoksa sessizce yok sayılır). */
    function closeMoreMenu() {
        var ui = window.KaitiakitangaUI;
        if (ui && typeof ui.closeMoreMenu === 'function') { ui.closeMoreMenu(); }
    }

    /* Gözlük paneli aç/kapat — portal + sabit katman konumlandırma.
     *
     * Kök neden (hata: − ↺ + simgeleri temanın dışına taşıyordu):
     * .post-meta.glass-meta üzerindeki backdrop-filter, position:fixed
     * torunları için "containing block" oluşturur; JS'in viewport koordinatı
     * sandığı left/top, tarayıcı tarafından .post-meta kutusuna göre
     * yorumlanır ve panel düğmeden çok uzakta, hatta temanın dışında bir yerde
     * belirir. Panel <body> düzeyine taşındığında bu tuzak tamamen ortadan
     * kalkar. */
    function initGlassesPanel() {
        var wrap = document.querySelector('.meta-glasses-wrap');
        if (!wrap) return;
        var btn = wrap.querySelector('.meta-glasses');
        var panel = wrap.querySelector('.meta-glasses-panel');
        if (!btn || !panel) return;

        // Portal: metin çubuğundaki backdrop-filter/transform tuzaklarından çıkar.
        if (panel.parentNode !== document.body) { document.body.appendChild(panel); }

        var MARGIN = 8;
        var repFrame = null;
        var posFrame = null;

        function isPanelOpen() { return panel.classList.contains('is-open'); }

        function positionPanel() {
            var btnRect = btn.getBoundingClientRect();
            var pw = panel.offsetWidth;
            var ph = panel.offsetHeight;
            var vw = window.innerWidth;
            var vh = window.innerHeight;

            // Yatayda butona göre ortala, ekran kenarlarına kelepçele.
            var left = btnRect.left + (btnRect.width / 2) - (pw / 2);
            left = Math.max(MARGIN, Math.min(left, vw - pw - MARGIN));

            // Dikeyde: önce butonun altında; altta yer yoksa üstüne çevir.
            // position:fixed olduğundan (ve panel body altına alındığından)
            // koordinatlar gerçekten viewport'a göredir.
            var top = btnRect.bottom + MARGIN;
            if (top + ph > vh - MARGIN) { top = btnRect.top - ph - MARGIN; }
            top = Math.max(MARGIN, Math.min(top, Math.max(MARGIN, vh - ph - MARGIN)));

            panel.style.left = Math.round(left) + 'px';
            panel.style.top = Math.round(top) + 'px';
        }

        function scheduleReposition() {
            if (!isPanelOpen() || repFrame) return;
            repFrame = requestAnimationFrame(function () {
                repFrame = null;
                positionPanel();
            });
        }

        function openPanel() {
            if (isPanelOpen()) return;
            panel.removeAttribute('hidden');
            // Ölçüm ilk karede yanlış yerde gösterilmeden yapılır.
            panel.style.visibility = 'hidden';
            posFrame = requestAnimationFrame(function () {
                posFrame = null;
                positionPanel();
                panel.style.visibility = '';
                panel.classList.add('is-open');
            });
            btn.setAttribute('aria-expanded', 'true');
        }

        function closePanel() {
            if (!isPanelOpen()) return;
            panel.classList.remove('is-open');
            btn.setAttribute('aria-expanded', 'false');
            setTimeout(function () {
                if (!panel.classList.contains('is-open')) {
                    panel.setAttribute('hidden', '');
                    panel.style.left = '';
                    panel.style.top = '';
                    panel.style.visibility = '';
                }
            }, 200);
        }

        btn.addEventListener('click', function (e) {
            e.preventDefault(); e.stopPropagation();
            if (isPanelOpen()) closePanel();
            else openPanel();
        });

        // Panel artık body altında; içeriğine dokunulduğunda kapanmasın.
        panel.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        panel.addEventListener('mousedown', function (e) {
            e.stopPropagation();
        });

        document.addEventListener('click', function (e) {
            if (!isPanelOpen()) return;
            if (wrap.contains(e.target) || panel.contains(e.target)) return;
            closePanel();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isPanelOpen()) { closePanel(); btn.focus(); }
        });

        // Açıkken scroll/resize: kapatmak yerine paneli düğmeyle birlikte taşı —
        // kullanıcı yazı boyutunu deneyip kaydırma yaparken panel kaybolmasın.
        window.addEventListener('scroll', scheduleReposition, { passive: true });
        window.addEventListener('resize', scheduleReposition, { passive: true });
    }

    /* Okuma genişliği seçimi */
    function initReadingWidthSelector() {
        var buttons = document.querySelectorAll('.meta-rw-option');
        if (!buttons.length) return;
        var store = 'kaitiakitanga_reading_width';

        try {
            var saved = localStorage.getItem(store);
            if (saved) applyWidth(saved);
        } catch (e) {}

        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                var w = btn.getAttribute('data-rw') || '600';
                applyWidth(w);
                try { localStorage.setItem(store, w); } catch (e) {}

                buttons.forEach(function (b) {
                    var bw = b.getAttribute('data-rw');
                    var icon = b.querySelector('i');
                    b.setAttribute('aria-checked', bw === w ? 'true' : 'false');
                    if (icon) icon.className = 'fa-solid ' + (bw === w ? 'fa-circle-check' : 'fa-circle');
                });

                closeMoreMenu();

                var K = window.KaitiakitangaData || {};
                var nonce = (K.nonces && K.nonces.width) ? K.nonces.width : (K.nonce || '');
                var postId = parseInt(K.postId, 10) || 0;
                if (postId && nonce) {
                    var body = 'action=kaitiakitanga_save_reading_width&post_id=' + postId + '&width=' + encodeURIComponent(w) + '&nonce=' + encodeURIComponent(nonce);
                    try {
                        fetch((window.KaitiakitangaData.ajaxUrl) || '/wp-admin/admin-ajax.php', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                            body: body
                        }).catch(function () {});
                    } catch (e) {}
                }
            });
        });

        function applyWidth(w) {
            var style = document.getElementById('kaitiakitanga-rw-dynamic');
            if (!style) {
                style = document.createElement('style');
                style.id = 'kaitiakitanga-rw-dynamic';
                document.head.appendChild(style);
            }
            style.textContent = '.reading-width{max-width:' + w + 'px;margin-left:auto;margin-right:auto;}';
        }
    }

    /* Kaynak paneli aç/kapat — portal + çubuğun altına sabit açılış.
     *
     * Kök neden (hata: "Kaynak ve İleri Okuma" aşağı doğru açılmıyordu):
     * Panel <aside>'ı .post-meta hap çubuğunun flex satırının ÇOCUĞUYDU;
     * açılınca yana sıkışıyor/hapın içine gömülüyordu ve scrollIntoView
     * sayfayı gereksiz kaydırıyordu.
     *
     * Çözüm: Panel <body> düzeyine taşınır (portal) ve konumu meta çubuğuna
     * göre hesaplanır — her zaman çubuğun ALTINDA tam genişlikte açılır,
     * altta yer yoksa üstüne çevrilir, ekran kenarlarına kelepçelenir ve
     * scroll/resize'da çubukla birlikte yeniden konumlanır. */
    function initSourcePanel() {
        var btn = document.querySelector('.meta-source-toggle');
        var panel = document.querySelector('.meta-source-panel');
        var bar = document.querySelector('.post-meta');
        if (!btn || !panel || !bar) return;

        // Portal: hap çubuğun flex akışından ve backdrop-filter tuzaklarından çıkar.
        if (panel.parentNode !== document.body) { document.body.appendChild(panel); }

        var MARGIN = 8;
        var repFrame = null;

        function isPanelOpen() { return !panel.hasAttribute('hidden'); }

        function positionPanel() {
            var barRect = bar.getBoundingClientRect();
            var vw = window.innerWidth;
            var vh = window.innerHeight;

            // Genişlik: meta çubuğuyla hizalı ama viewport'u asla aşmasın.
            var pw = Math.min(barRect.width, vw - MARGIN * 2);
            panel.style.width = Math.round(pw) + 'px';

            var ph = panel.offsetHeight;

            // Yatay: çubuğun sol kenarına hizala, ekran içine kelepçele.
            var left = Math.max(MARGIN, Math.min(barRect.left, vw - pw - MARGIN));

            // Dikey: ÖNCE çubuğun ALTINDA aç; altta yer yoksa üstüne çevir.
            var top = barRect.bottom + MARGIN;
            if (top + ph > vh - MARGIN) {
                top = barRect.top - ph - MARGIN;
            }
            top = Math.max(MARGIN, Math.min(top, Math.max(MARGIN, vh - ph - MARGIN)));

            panel.style.left = Math.round(left) + 'px';
            panel.style.top = Math.round(top) + 'px';
        }

        function scheduleReposition() {
            if (!isPanelOpen() || repFrame) return;
            repFrame = requestAnimationFrame(function () {
                repFrame = null;
                positionPanel();
            });
        }

        function openPanel() {
            panel.removeAttribute('hidden');
            btn.classList.add('is-active');
            // Ölçüm ilk karede kullanıcıya yanlış yerde gösterilmeden yapılır.
            panel.style.visibility = 'hidden';
            requestAnimationFrame(function () {
                positionPanel();
                panel.style.visibility = '';
            });
        }

        function closePanel() {
            if (!isPanelOpen()) return;
            panel.setAttribute('hidden', '');
            panel.style.width = '';
            panel.style.left = '';
            panel.style.top = '';
            panel.style.visibility = '';
            btn.classList.remove('is-active');
        }

        btn.addEventListener('click', function () {
            if (isPanelOpen()) closePanel();
            else openPanel();
            closeMoreMenu();
        });

        // Dışarı tıklama: panel dışındaki ve menü bağımsız tıklamalarda kapan.
        document.addEventListener('click', function (e) {
            if (!isPanelOpen()) return;
            if (panel.contains(e.target)) return;
            var menu = document.querySelector('.meta-more-menu');
            if (menu && menu.contains(e.target)) return;   // menü içi eylemler karıştırmasın
            if (bar.contains(e.target)) return;            // çubuktaki tıklamalar serbest
            closePanel();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && isPanelOpen()) { closePanel(); }
        });

        window.addEventListener('scroll', scheduleReposition, { passive: true });
        window.addEventListener('resize', scheduleReposition, { passive: true });
    }

    /* Okuma ilerleme çubuğu */
    function initReadingProgress() {
        var content = document.getElementById('single-content');
        if (!content) return;
        var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReduced) return;

        var bar = document.createElement('div');
        bar.className = 'reading-progress';
        bar.setAttribute('role', 'progressbar');
        bar.setAttribute('aria-label', 'Okuma ilerlemesi');
        bar.innerHTML = '<span class="reading-progress-fill"></span>';
        document.body.appendChild(bar);
        var fill = bar.querySelector('.reading-progress-fill');

        function update() {
            var rect = content.getBoundingClientRect();
            var percent = 0;
            if (rect.top < 0) {
                percent = Math.min(100, Math.max(0, (-rect.top / (rect.height - window.innerHeight)) * 100));
            }
            if (rect.top >= 0) percent = 0;
            if (rect.bottom <= window.innerHeight) percent = 100;
            fill.style.width = percent + '%';
        }

        window.addEventListener('scroll', update, { passive: true });
        window.addEventListener('resize', update, { passive: true });
        update();
    }

    /* ============ Sözlük çekirdeği — hover balonu ve seçim çubuğu için ortak servis ============
     * - Türkçe-duyarlı kelime normalleştirme ('İ'.toLowerCase() kombinasyon noktası tuzağını aşar)
     * - Anlam zinciri: Vikisözlük (TR) → Vikipedi (TR) özeti → Vikisözlük (EN)
     * - Bellek + sessionStorage önbelleği (pozitif 7 gün, negatif 30 dakika) ve aynı kelimeye
     *   art arda gelen isteklerin tek ağ çağrısına indirgenmesi.
     */
    var DictCore = (function () {
        var SS_PREFIX = 'kk_dict_v2_';
        var POS_TTL = 7 * 24 * 60 * 60 * 1000;   // başarılı sonuç 7 gün
        var NEG_TTL = 30 * 60 * 1000;             // "anlam yok" 30 dakika
        var memCache = new Map();
        var pending = {};

        var POS_TR = {
            noun: 'isim', verb: 'fiil', adjective: 'sıfat', adverb: 'zarf',
            pronoun: 'zamir', preposition: 'ilgeç', postposition: 'ilgeç',
            conjunction: 'bağlaç', interjection: 'ünlem', numeral: 'sayı',
            article: 'belirteç', particle: 'parçacık', phrase: 'tamlama',
            proverb: 'atasözü', idiom: 'deyim', abbreviation: 'kısaltma',
            prefix: 'ön ek', suffix: 'ek', name: 'özel ad'
        };

        function toLowerTr(str) {
            return String(str || '')
                .replace(/\u0130/g, 'i')   // İ → i (noktanın kaybolması gerekir, birleşme noktası kalmasın)
                .replace(/\u0049/g, '\u0131') // I → ı
                .toLowerCase();
        }

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.textContent = str == null ? '' : String(str);
            return div.innerHTML;
        }

        function stripTags(html) {
            var div = document.createElement('div');
            div.innerHTML = html == null ? '' : String(html);
            return (div.textContent || div.innerText || '').trim();
        }

        function translatePos(pos) {
            if (!pos) return '';
            var key = String(pos).toLowerCase().trim();
            return POS_TR[key] || key;
        }

        /* Aday metinden aranabilir tek bir Türkçe kelime üretir; uygun değilse null.
         * Örnek: "Ölçeğin'de!" → "ölçek", "v2.3" → null */
        function normalizeWord(raw) {
            if (!raw) return null;
            var tokens = String(raw).split(/[\s\u00a0,.:;!?"\u201c\u201d\u00ab\u00bb()\[\]{}\u2013\u2014\u2026\/|]+/);
            for (var i = 0; i < tokens.length; i++) {
                var tok = (tokens[i] || '').replace(/^['’\-]+|['’\-]+$/g, '');
                tok = tok.replace(/[^A-Za-zÇĞİÖŞÜçğıöşüâîû'’]/g, '');
                if (tok.length < 2 || tok.length > 48) continue;
                var lower = toLowerTr(tok);
                var cut = lower.search(/['’]/);
                if (cut > 1) { lower = lower.slice(0, cut); }      // "türkiye'de" → "türkiye"
                if (!/^[a-zçğıöşüâîû]{2,48}$/.test(lower)) continue;
                return lower;
            }
            return null;
        }

        function sortTrFirst(list) {
            return (list || []).slice().sort(function (a, b) {
                return (a.lang === 'tr' ? 0 : 1) - (b.lang === 'tr' ? 0 : 1);
            });
        }

        function parseWiktionary(data) {
            var out = [];
            Object.keys(data || {}).forEach(function (langCode) {
                var sections = data[langCode];
                if (!Array.isArray(sections)) return;
                sections.forEach(function (section) {
                    if (!section || !Array.isArray(section.definitions)) return;
                    section.definitions.forEach(function (def) {
                        var meaning = stripTags(def && def.definition);
                        if (meaning) {
                            out.push({
                                lang: langCode,
                                pos: translatePos(section.partOfSpeech || ''),
                                meaning: meaning
                            });
                        }
                    });
                });
            });
            return out;
        }

        function fetchJSON(url, onSuccess, onFail, timeoutMs) {
            var ctrl = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            var settled = false;
            var timer = setTimeout(function () {
                if (ctrl) { try { ctrl.abort(); } catch (e) {} }
                if (!settled) { settled = true; onFail(new Error('timeout')); }
            }, timeoutMs || 8000);

            var opts = { headers: { 'Accept': 'application/json' } };
            if (ctrl) opts.signal = ctrl.signal;

            fetch(url, opts).then(function (r) {
                if (!r.ok) throw new Error('http ' + r.status);
                return r.json();
            }).then(function (data) {
                clearTimeout(timer);
                if (!settled) { settled = true; onSuccess(data); }
            }).catch(function (err) {
                clearTimeout(timer);
                if (!settled) { settled = true; onFail(err || new Error('network')); }
            });
        }

        function pickWiki(summary) {
            if (!summary || typeof summary !== 'object') return null;
            if (summary.type === 'disambiguation') return null;
            var extract = (typeof summary.extract === 'string') ? summary.extract.trim() : '';
            if (!extract) return null;
            var title = (summary.titles && summary.titles.normal) || summary.title || '';
            var url = (summary.content_urls && summary.content_urls.desktop && summary.content_urls.desktop.page) ||
                ('https://tr.wikipedia.org/w/index.php?search=' + encodeURIComponent(title));
            return { title: title, extract: extract, url: url };
        }

        /* Zincir: TR Vikisözlük tanımı → TR Vikipedi özeti → EN Vikisözlük tanımı → null */
        function runChain(word, done) {
            fetchJSON(
                'https://tr.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(word),
                function (data) {
                    var defs = sortTrFirst(parseWiktionary(data));
                    if (defs.length) { finish({ defs: defs, wiki: null, matched: 'wikt-tr' }); return; }
                    tryWiki(null);
                },
                function () { tryWiki(null); }
            );

            function tryWiki(enDefs) {
                fetchJSON(
                    'https://tr.wikipedia.org/api/rest_v1/page/summary/' + encodeURIComponent(word),
                    function (summary) {
                        var wiki = pickWiki(summary);
                        if (wiki) {
                            finish({
                                defs: [],
                                wiki: wiki,
                                matched: 'wiki-tr'
                            });
                            return;
                        }
                        tryEn(null, enDefs);
                    },
                    function () { tryEn(null, enDefs); }
                );
            }

            function tryEn(fallbackUnused, enDefs) {
                fetchJSON(
                    'https://en.wiktionary.org/api/rest_v1/page/definition/' + encodeURIComponent(word),
                    function (data) {
                        var defs = sortTrFirst(parseWiktionary(data));
                        if (defs.length) { finish({ defs: defs, wiki: null, matched: 'wikt-en' }); return; }
                        finish(null);
                    },
                    function () { finish(null); }
                );
            }

            function finish(result) {
                done(result ? deepCopy(result) : null);
            }
        }

        function deepCopy(res) {
            if (!res) return null;
            var copy = {
                defs: (res.defs || []).map(function (d) {
                    return { lang: d.lang, pos: d.pos, meaning: d.meaning };
                }),
                wiki: res.wiki ? {
                    title: res.wiki.title, extract: res.wiki.extract, url: res.wiki.url
                } : null,
                matched: res.matched || null
            };
            return copy;
        }

        function memGet(key) {
            if (!memCache.has(key)) return undefined;
            var rec = memCache.get(key);
            var ttl = rec.neg ? NEG_TTL : POS_TTL;
            if (Date.now() - rec.ts > ttl) { memCache.delete(key); return undefined; }
            return rec.v;
        }
        function ssGet(key) {
            try {
                var raw = sessionStorage.getItem(SS_PREFIX + key);
                if (!raw) return undefined;
                var rec = JSON.parse(raw);
                if (!rec || typeof rec.ts !== 'number') return undefined;
                var ttl = rec.neg ? NEG_TTL : POS_TTL;
                if (Date.now() - rec.ts > ttl) { sessionStorage.removeItem(SS_PREFIX + key); return undefined; }
                return rec.neg ? null : (rec.v || null);
            } catch (e) { return undefined; }
        }
        function storeCache(key, value) {
            var neg = value == null;
            memCache.set(key, { ts: Date.now(), neg: neg, v: value });
            try {
                sessionStorage.setItem(SS_PREFIX + key, JSON.stringify({ ts: Date.now(), neg: neg, v: value }));
            } catch (e) {}
        }

        function fetch(word, cb) {
            var key = String(word || '').toLowerCase();
            if (!key || typeof cb !== 'function') return;

            var cached = memGet(key);
            if (cached === undefined) cached = ssGet(key);
            if (cached !== undefined) { cb(deepCopy(cached)); return; }

            pending[key] = pending[key] || [];
            pending[key].push(cb);
            if (pending[key].length > 1) return;   // aynı kelime zaten yolda

            runChain(key, function (result) {
                storeCache(key, result);
                var queue = pending[key] || [];
                delete pending[key];
                queue.forEach(function (fn) {
                    try { fn(deepCopy(result)); } catch (e) {}
                });
            });
        }

        /* Kelimeye otomatik bağlı detaylandırma/kaynak bağlantıları (kararsız rastgele sıra yerine sabit alaka sırası). */
        function buildAutoLinks(word, res) {
            var enc = encodeURIComponent(word);
            var list = [];
            if (res && res.wiki && res.wiki.url) {
                list.push({ name: 'Vikipedi maddesi', url: res.wiki.url, icon: 'fa-globe' });
            }
            list.push({ name: 'Vikisözlük (TR)', url: 'https://tr.wiktionary.org/wiki/' + enc, icon: 'fa-book' });
            list.push({ name: 'TDK Sözlük', url: 'https://sozluk.gov.tr/?ara=' + enc, icon: 'fa-book-open' });
            list.push({ name: 'Nişanyan Sözlük', url: 'https://www.nisanyansozluk.com/?word=' + enc, icon: 'fa-feather-pointed' });
            list.push({ name: 'Etimoloji Sözlüğü', url: 'https://www.etimolojiturkce.com/kelime/' + enc, icon: 'fa-clock-rotate-left' });
            list.push({ name: 'Wikipedia (arama)', url: 'https://tr.wikipedia.org/w/index.php?search=' + enc, icon: 'fa-magnifying-glass' });
            list.push({ name: 'Sesli Sözlük', url: 'https://www.seslisozluk.net/' + enc + '-nedir-ne-demek/', icon: 'fa-volume-high' });
            list.push({ name: 'Tureng (çeviri)', url: 'https://tureng.com/tr/turkce-ingilizce/' + enc, icon: 'fa-language' });
            list.push({ name: 'Vikisözlük (EN)', url: 'https://en.wiktionary.org/wiki/' + enc, icon: 'fa-globe' });
            return list;
        }

        function sourceLabel(matched) {
            if (matched === 'wikt-tr') return 'Vikisözlük (TR)';
            if (matched === 'wiki-tr') return 'Vikipedi (TR)';
            if (matched === 'wikt-en') return 'Vikisözlük (EN)';
            return '';
        }

        function attributionHtml(matched, word) {
            if (matched === 'wiki-tr') {
                return '<i class="fa-solid fa-quote-left" aria-hidden="true"></i><span>Yararlanılan kaynak: Vikipedi · <span class="sp-license">CC BY-SA</span></span>';
            }
            var langUrl = (matched === 'wikt-en')
                ? 'https://en.wiktionary.org/wiki/' + encodeURIComponent(word)
                : 'https://tr.wiktionary.org/wiki/' + encodeURIComponent(word);
            return '<i class="fa-solid fa-quote-left" aria-hidden="true"></i><span>Yararlanılan kaynak: <a href="' + langUrl + '" target="_blank" rel="noopener noreferrer">' + (matched === 'wikt-en' ? 'Vikisözlük (EN)' : 'Vikisözlük') + '</a> · <span class="sp-license">CC BY-SA 4.0</span></span>';
        }

        return {
            normalizeWord: normalizeWord,
            escapeHtml: escapeHtml,
            stripTags: stripTags,
            translatePos: translatePos,
            toLowerTr: toLowerTr,
            fetch: fetch,
            buildAutoLinks: buildAutoLinks,
            sourceLabel: sourceLabel,
            attributionHtml: attributionHtml,
            MAX_MEANINGS_PANEL: 4,
            MAX_MEANINGS_BUBBLE: 3
        };
    })();

    /* Seçim araç çubuğu: Kopyala | Sözlük | Ara */
    function initSelectionToolbar() {
        var content = document.getElementById('single-content');
        if (!content) return;

        var toolbar = document.createElement('div');
        toolbar.className = 'selection-toolbar';
        toolbar.setAttribute('role', 'toolbar');
        toolbar.setAttribute('aria-hidden', 'true');
        toolbar.innerHTML =
            '<button type="button" class="st-btn st-copy" data-action="copy"><i class="fa-regular fa-copy" aria-hidden="true"></i><span>Kopyala</span></button>' +
            '<span class="st-sep" aria-hidden="true"></span>' +
            '<button type="button" class="st-btn st-dict" data-action="dict"><i class="fa-solid fa-book" aria-hidden="true"></i><span>Sözlük</span></button>' +
            '<span class="st-sep" aria-hidden="true"></span>' +
            '<button type="button" class="st-btn st-search" data-action="search"><i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i><span>Ara</span></button>';
        document.body.appendChild(toolbar);

        var panel = document.createElement('div');
        panel.className = 'selection-panel';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-hidden', 'true');
        document.body.appendChild(panel);

        var currentSelection = '';
        var panelOpen = false;
        var pendingController = null;
        /* Dokunmatik koruması: kendi eylemlerimizin (Sözlük/Ara/Kopyala tıklaması)
         * tetiklediği seçim-düşme olayları kutuyu hemen kapatmasın. */
        var actionGuardTs = 0;

        function escapeHtml(str) {
            var div = document.createElement('div');
            div.textContent = str == null ? '' : String(str);
            return div.innerHTML;
        }

        function getSelectionInfo() {
            var sel = window.getSelection();
            if (!sel || sel.rangeCount === 0) return null;
            var text = sel.toString().trim();
            if (!text) return null;
            var range = sel.getRangeAt(0);
            var container = range.commonAncestorContainer;
            if (container.nodeType !== 1) container = container.parentNode;
            if (!content.contains(container)) return null;
            var rect = range.getBoundingClientRect();
            if (rect.width === 0 && rect.height === 0) return null;
            return { text: text, rect: rect };
        }

        function positionToolbar(rect) {
            toolbar.style.visibility = 'hidden';
            toolbar.style.left = '0px'; toolbar.style.top = '0px';
            toolbar.classList.add('is-visible');
            var tw = toolbar.offsetWidth, th = toolbar.offsetHeight;
            toolbar.style.visibility = '';
            var left = rect.left + (rect.width / 2) - (tw / 2);
            left = Math.max(8, Math.min(left, window.innerWidth - tw - 8));
            var top = rect.top + window.scrollY - th - 8;
            if (rect.top < th + 16) { top = rect.bottom + window.scrollY + 8; toolbar.classList.add('st-below'); }
            else { toolbar.classList.remove('st-below'); }
            toolbar.style.left = left + 'px';
            toolbar.style.top = top + 'px';
            toolbar.setAttribute('aria-hidden', 'false');
        }

        function hideToolbar() { toolbar.classList.remove('is-visible'); toolbar.setAttribute('aria-hidden', 'true'); }
        function hidePanel() {
            panel.classList.remove('is-visible');
            panel.setAttribute('aria-hidden', 'true');
            panelOpen = false;
            if (pendingController) { try { pendingController.abort(); } catch (e) {} pendingController = null; }
        }

        function showPanel(html, type) {
            panel.innerHTML = html;
            panel.className = 'selection-panel is-visible sp-' + type;
            panel.setAttribute('aria-hidden', 'false');
            panelOpen = true;
            panel.style.visibility = 'hidden';
            panel.style.left = '0px'; panel.style.top = '0px';
            var ph = panel.offsetHeight;
            panel.style.visibility = '';
            var tRect = toolbar.getBoundingClientRect();
            var panelWidth = Math.min(420, window.innerWidth - 16);
            var left = tRect.left + (tRect.width / 2) - (panelWidth / 2);
            left = Math.max(8, Math.min(left, window.innerWidth - panelWidth - 8));
            var top;
            if (toolbar.classList.contains('st-below')) {
                top = tRect.top + window.scrollY - ph - 6;
                if (top < window.scrollY + 8) top = tRect.bottom + window.scrollY + 6;
            } else {
                top = tRect.bottom + window.scrollY + 6;
                if (top + ph > window.scrollY + window.innerHeight - 8) top = tRect.top + window.scrollY - ph - 6;
            }
            panel.style.left = left + 'px';
            panel.style.top = top + 'px';
            panel.style.maxWidth = panelWidth + 'px';
        }

        function handleSelectionEnd(e) {
            /* Araç çubuğu/kutu üzerinde kalkan parmak: yeniden konumlandırma/kapama yapma */
            if (Date.now() - actionGuardTs < 500 && e && e.target &&
                (toolbar.contains(e.target) || panel.contains(e.target))) return;
            setTimeout(function () {
                var info = getSelectionInfo();
                if (!info) { hideToolbar(); if (!panelOpen) hidePanel(); return; }
                currentSelection = info.text;
                positionToolbar(info.rect);
                if (panelOpen) hidePanel();
            }, 10);
        }

        document.addEventListener('mouseup', handleSelectionEnd);
        document.addEventListener('touchend', handleSelectionEnd);

        document.addEventListener('selectionchange', function () {
            var sel = window.getSelection();
            if (!sel || !sel.toString().trim()) {
                if (Date.now() - actionGuardTs < 800) return;   // eylem sonrası sentetik temizleme
                hideToolbar(); if (!panelOpen) hidePanel();
            }
        });

        var scrollTimer = null;
        window.addEventListener('scroll', function () {
            if (!toolbar.classList.contains('is-visible')) return;
            if (scrollTimer) return;
            scrollTimer = setTimeout(function () {
                scrollTimer = null;
                var info = getSelectionInfo();
                if (!info) { hideToolbar(); hidePanel(); }
                else { positionToolbar(info.rect); if (panelOpen) hidePanel(); }
            }, 80);
        }, { passive: true });

        window.addEventListener('resize', function () { hideToolbar(); hidePanel(); }, { passive: true });

        toolbar.addEventListener('click', function (e) {
            var btn = e.target.closest('.st-btn');
            if (!btn) return;
            e.preventDefault(); e.stopPropagation();
            actionGuardTs = Date.now();   // dokunuş zincirinden gelen seçim-düşmesini yok say
            var action = btn.getAttribute('data-action');
            if (!currentSelection) return;
            if (action === 'copy') doCopy(currentSelection, btn);
            else if (action === 'dict') doDict(currentSelection);
            else if (action === 'search') doSearch(currentSelection);
        });

        document.addEventListener('mousedown', function (e) {
            if (toolbar.contains(e.target) || panel.contains(e.target)) return;
            if (!panelOpen) return;
            var sel = window.getSelection();
            if (!sel || !sel.toString().trim()) hidePanel();
        });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                hidePanel(); hideToolbar();
                window.getSelection().removeAllRanges();
            }
        });

        /* Kopyala */
        function doCopy(text, btn) {
            var original = btn.innerHTML;
            function done() {
                btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i><span>Kopyalandı</span>';
                btn.classList.add('is-success');
                setTimeout(function () { btn.innerHTML = original; btn.classList.remove('is-success'); }, 1500);
            }
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(text).then(done).catch(function () { fallbackCopy(text); done(); });
            } else { fallbackCopy(text); done(); }
        }

        function fallbackCopy(text) {
            try {
                var ta = document.createElement('textarea');
                ta.value = text;
                ta.style.position = 'absolute'; ta.style.left = '-9999px';
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            } catch (e) {}
        }

        /* Sözlük — DictCore üzerinden Türkçe öncelikli anlamlar + otomatik kaynak listesi */
        var dictToken = 0;

        function doDict(text) {
            var word = DictCore.normalizeWord(text);
            if (!word) {
                showPanel('<div class="sp-error"><i class="fa-solid fa-circle-info"></i><span>Lütfen tek bir kelime seçin.</span></div>', 'dict');
                return;
            }
            showPanel('<div class="sp-loading"><div class="sp-spinner"></div><span>Sözlükte aranıyor…</span></div>', 'dict');

            var token = ++dictToken;
            DictCore.fetch(word, function (res) {
                if (token !== dictToken || !panelOpen) return;   // yeni istek açıldı ya da panel kapandı
                renderDict(word, res);
            });
        }

        function renderDict(word, res) {
            if (!res || (!res.defs.length && !res.wiki)) {
                showPanel(
                    '<div class="sp-error sp-error-block"><i class="fa-solid fa-circle-info"></i><div><strong>"' + DictCore.escapeHtml(word) + '"</strong> için anlam bulunamadı.</div><a class="sp-link" href="https://tr.wiktionary.org/wiki/' + encodeURIComponent(word) + '" target="_blank" rel="noopener noreferrer">Vikisözlük\'te ara <i class="fa-solid fa-arrow-up-right-from-square"></i></a></div>' + buildDictSources(word),
                    'dict'
                );
                return;
            }

            /* KUTU DÜZENİ (kullanıcı şartnamesi):
             * 1) başlıkta kelime, 2) kutu içinde KISACA anlam, 3) anlamın altında
             * yararlanılan kaynak satırı, 4) en altta otomatik detaylandırma bağlantıları. */
            var defs = (res.defs || []).slice(0, DictCore.MAX_MEANINGS_PANEL);

            var html = '<div class="sp-head"><i class="fa-solid fa-book"></i><strong>' + DictCore.escapeHtml(word) + '</strong>';
            if (res.matched) html += '<span class="sp-matched">' + DictCore.escapeHtml(DictCore.sourceLabel(res.matched)) + '</span>';
            html += '</div>';

            /* 1) Kısaca anlam: sözlük tanımları öne alınır; tanım yoksa Vikipedi
             *    kavram açıklaması anlam yerine gösterilir (örn. "wordpress"). */
            if (defs.length) {
                html += '<ul class="sp-meanings">';
                defs.forEach(function (d) {
                    var langLabel = d.lang === 'tr' ? 'Türkçe' : (d.lang === 'en' ? 'İngilizce' : d.lang);
                    html += '<li><span class="sp-lang">' + DictCore.escapeHtml(langLabel) + '</span>';
                    if (d.pos) html += '<span class="sp-pos">' + DictCore.escapeHtml(d.pos) + '</span>';
                    html += '<span class="sp-meaning">' + DictCore.escapeHtml(d.meaning) + '</span></li>';
                });
                html += '</ul>';
            } else if (res.wiki && res.wiki.extract) {
                var ex = res.wiki.extract.replace(/\s+/g, ' ').trim();
                if (ex.length > 320) { ex = ex.slice(0, 320).replace(/\s+\S*$/, '') + '…'; }
                html += '<div class="sp-wiki">';
                html += '<div class="sp-wiki-head"><i class="fa-solid fa-landmark-dome" aria-hidden="true"></i><span>Vikipedi</span></div>';
                html += '<p class="sp-wiki-text">' + DictCore.escapeHtml(ex) + '</p>';
                html += '<a class="sp-wiki-link" href="' + DictCore.escapeHtml(res.wiki.url) + '" target="_blank" rel="noopener noreferrer nofollow">Maddenin tamamını oku <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i></a>';
                html += '</div>';
            }

            /* 2) Anlamın HEMEN ALTINDA yararlanılan kaynak belirtilir. */
            if (res.matched) {
                html += '<div class="sp-source">' + DictCore.attributionHtml(res.matched, word) + '</div>';
            }

            /* 3) En altta: kelimenin alaka sıralı otomatik detaylandırma bağlantıları. */
            html += buildDictSources(word, res);
            showPanel(html, 'dict');
        }

        /* Rastgele karıştırma kaldırıldı: kelimeye derin-bağlı, alaka sırasına göre otomatik kaynak listesi */
        function buildDictSources(word, res) {
            var links = DictCore.buildAutoLinks(word, res || null);
            var html = '<div class="sp-sources-list"><div class="sp-sources-title"><i class="fa-solid fa-link"></i><span>Kelimenin detaylandırması · otomatik kaynaklar</span></div><div class="sp-sources-grid">';
            links.forEach(function (s) {
                html += '<a class="sp-source-link" href="' + s.url + '" target="_blank" rel="noopener noreferrer nofollow" title="' + DictCore.escapeHtml(s.name) + '"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i><span>' + DictCore.escapeHtml(s.name) + '</span></a>';
            });
            html += '</div></div>';
            return html;
        }

        /* Site içinde Ara */
        function doSearch(text) {
            var q = text.trim().substring(0, 100);
            if (q.length < 2) {
                showPanel('<div class="sp-error"><i class="fa-solid fa-circle-info"></i><span>Daha uzun bir metin seçin.</span></div>', 'search');
                return;
            }
            showPanel('<div class="sp-loading"><div class="sp-spinner"></div><span>Aranıyor…</span></div>', 'search');

            var ajaxUrl = (window.KaitiakitangaData && window.KaitiakitangaData.ajaxUrl) || '/wp-admin/admin-ajax.php';
            var nonce = (window.KaitiakitangaData && window.KaitiakitangaData.nonce) || '';
            var bodyStr = 'action=kaitiakitanga_live_search&s=' + encodeURIComponent(q) + '&nonce=' + encodeURIComponent(nonce);

            var controller = (typeof AbortController !== 'undefined') ? new AbortController() : null;
            pendingController = controller;

            fetch(ajaxUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: bodyStr,
                signal: controller ? controller.signal : undefined
            }).then(function (r) { return r.json(); }).then(function (data) {
                if (pendingController === controller) pendingController = null;
                if (data && data.success && data.data && data.data.items && data.data.items.length) {
                    renderSearchResults(q, data.data.items);
                } else {
                    showPanel('<div class="sp-error sp-error-block"><i class="fa-solid fa-magnifying-glass"></i><div><strong>"' + escapeHtml(q) + '"</strong> için sonuç bulunamadı.</div></div>' + buildSearchSources(q), 'search');
                }
            }).catch(function () {
                if (pendingController === controller) pendingController = null;
                showPanel('<div class="sp-error"><i class="fa-solid fa-triangle-exclamation"></i><span>Arama yapılamadı.</span></div>', 'search');
            });
        }

        function renderSearchResults(q, items) {
            var shortQ = q.length > 40 ? q.substring(0, 40) + '…' : q;
            var html = '<div class="sp-head"><i class="fa-solid fa-magnifying-glass"></i><strong>' + escapeHtml(shortQ) + '</strong></div>';
            html += '<ul class="sp-results">';
            items.slice(0, 4).forEach(function (item) {
                var thumb = item.thumb
                    ? '<div class="sp-thumb"><img src="' + escapeHtml(item.thumb) + '" alt="" loading="lazy" decoding="async"></div>'
                    : '<div class="sp-thumb sp-thumb-empty"><i class="fa-solid fa-file-lines"></i></div>';
                var cat = item.category ? '<span class="sp-cat">' + escapeHtml(item.category) + '</span>' : '';
                html += '<li class="sp-result-item"><a href="' + escapeHtml(item.url) + '" class="sp-result-link">' + thumb + '<div class="sp-result-body"><span class="sp-result-title">' + escapeHtml(item.title) + '</span>';
                if (item.excerpt) html += '<span class="sp-result-excerpt">' + escapeHtml(item.excerpt) + '</span>';
                html += '<span class="sp-result-meta">' + cat + '</span></div></a></li>';
            });
            html += '</ul>';
            html += '<a class="sp-more" href="' + ((window.KaitiakitangaData && window.KaitiakitangaData.homeUrl) || '/') + '?s=' + encodeURIComponent(q) + '"><span>Daha fazlasını gör</span><i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>';
            html += buildSearchSources(q);
            showPanel(html, 'search');
        }

        function buildSearchSources(q) {
            var sources = [
                { name: 'Google', url: 'https://www.google.com/search?q=' + encodeURIComponent(q), icon: 'fa-g' },
                { name: 'DuckDuckGo', url: 'https://duckduckgo.com/?q=' + encodeURIComponent(q), icon: 'fa-feather' },
                { name: 'Bing', url: 'https://www.bing.com/search?q=' + encodeURIComponent(q), icon: 'fa-magnifying-glass' },
                { name: 'Yandex', url: 'https://yandex.com/search/?text=' + encodeURIComponent(q), icon: 'fa-y' },
                { name: 'Wikipedia (TR)', url: 'https://tr.wikipedia.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-w' },
                { name: 'Wikipedia (EN)', url: 'https://en.wikipedia.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-w' },
                { name: 'Wikidata', url: 'https://www.wikidata.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-database' },
                { name: 'Vikisözlük', url: 'https://tr.wiktionary.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-book' },
                { name: 'Vikikitap', url: 'https://tr.wikibooks.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-book-open' },
                { name: 'Vikihaber', url: 'https://tr.wikinews.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-newspaper' },
                { name: 'Wikimedia Commons', url: 'https://commons.wikimedia.org/w/index.php?search=' + encodeURIComponent(q), icon: 'fa-image' },
                { name: 'Internet Archive', url: 'https://archive.org/search?query=' + encodeURIComponent(q), icon: 'fa-box-archive' }
            ];
            var shuffled = sources.slice().sort(function () { return Math.random() - 0.5; });
            var picked = shuffled.slice(0, 9);
            var html = '<div class="sp-sources-list"><div class="sp-sources-title"><i class="fa-solid fa-up-right-from-square"></i><span>Diğer arama kaynakları</span></div><div class="sp-sources-grid">';
            picked.forEach(function (s) {
                html += '<a class="sp-source-link" href="' + s.url + '" target="_blank" rel="noopener noreferrer nofollow" title="' + escapeHtml(s.name) + '"><i class="fa-solid ' + s.icon + '" aria-hidden="true"></i><span>' + escapeHtml(s.name) + '</span></a>';
            });
            html += '</div></div>';
            return html;
        }
    }

    /* Hızlı sözlük balonu: kelimenin üzerine gelince önizleme, üzerine TIKLAYINCA/DOKUNUNCA anında açılır.
     * Fareli cihazlarda hover önizlemesi de çalışır; dokunmatikte tek dokunuş yeterlidir. */
    function initHoverDictionary() {
        var content = document.getElementById('single-content');
        if (!content) return;

        var DWELL_MS = 220;      // kelime üzerinde durma süresi
        var HIDE_GRACE_MS = 160; // çekilme toleransı

        var bubble = document.createElement('div');
        bubble.className = 'dict-hover-bubble';
        bubble.setAttribute('role', 'region');
        bubble.setAttribute('aria-label', 'Hızlı sözlük');
        bubble.innerHTML =
            '<div class="dh-head"><span class="dh-word"></span><span class="dh-badge"></span>' +
            '<button type="button" class="dh-close" aria-label="Kapat">×</button></div>' +
            '<div class="dh-body"></div>' +
            '<div class="dh-foot"><div class="dh-links"></div></div>';
        document.body.appendChild(bubble);

        var elWord = bubble.querySelector('.dh-word');
        var elBadge = bubble.querySelector('.dh-badge');
        var elBody = bubble.querySelector('.dh-body');
        var elFoot = bubble.querySelector('.dh-foot');
        var elLinks = bubble.querySelector('.dh-links');
        var elClose = bubble.querySelector('.dh-close');

        elClose.addEventListener('click', function () { hideBubble(); });

        var hideTimer = null;
        var dwellTimer = null;
        var currentWord = '';
        var dictToken = 0;
        var anchorRect = null;
        var visible = false;

        function clearTimers() {
            if (dwellTimer) { clearTimeout(dwellTimer); dwellTimer = null; }
            if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
        }

        function scheduleHide(ms) {
            if (hideTimer) clearTimeout(hideTimer);
            hideTimer = setTimeout(function () { hideTimer = null; hideBubble(); }, ms || 0);
        }

        function hideBubble() {
            clearTimers();
            currentWord = '';
            if (!visible) return;
            visible = false;
            bubble.classList.remove('is-visible');
        }

        /* İmleç noktasındaki metin düğümünü ve karakter ofsetini bulur (DOM'a dokunmaz). */
        function caretPointAt(x, y) {
            try {
                if (document.caretRangeFromPoint) {
                    var r = document.caretRangeFromPoint(x, y);
                    if (r) return { node: r.startContainer, offset: r.startOffset };
                } else if (document.caretPositionFromPoint) {
                    var p = document.caretPositionFromPoint(x, y);
                    if (p) return { node: p.offsetNode, offset: p.offset };
                }
            } catch (e) {}
            return null;
        }

        /* Türkçe harfleri (ve kesme işaretlerini) kelime parçası say. */
        var WORD_CHAR = /[A-Za-zÇĞİÖŞÜçğıöşüâîû0-9\u2019']/;

        function wordAtPoint(x, y) {
            var hit = caretPointAt(x, y);
            if (!hit || !hit.node || hit.node.nodeType !== Node.TEXT_NODE) return null;
            if (!content.contains(hit.node)) return null;

            var holder = hit.node.parentElement;
            if (holder && holder.closest('a, button, input, textarea, select, [contenteditable]')) return null;

            var text = hit.node.nodeValue || '';
            var i = hit.offset;
            if (i >= text.length) i = text.length - 1;
            if (i < 0 || !WORD_CHAR.test(text.charAt(i))) return null;

            var start = i, end = i;
            while (start > 0 && WORD_CHAR.test(text.charAt(start - 1))) start--;
            while (end < text.length && WORD_CHAR.test(text.charAt(end))) end++;
            if (end - start < 2) return null;

            var word = DictCore.normalizeWord(text.slice(start, end));
            if (!word) return null;

            var range = null;
            try {
                range = document.createRange();
                range.setStart(hit.node, start);
                range.setEnd(hit.node, end);
                var rect = range.getBoundingClientRect();
                if (!rect || (rect.width === 0 && rect.height === 0)) return null;
                return { word: word, rect: rect };
            } catch (e) { return null; }
        }

        function hasTextSelection() {
            var sel = window.getSelection();
            return !!(sel && sel.toString().trim());
        }

        function placeBubble(rect) {
            var maxW = Math.min(360, Math.max(240, window.innerWidth - 16));
            bubble.style.maxWidth = maxW + 'px';
            bubble.style.visibility = 'hidden';
            bubble.style.left = '0px';
            bubble.style.top = '0px';
            bubble.classList.add('is-visible');
            var bw = bubble.offsetWidth, bh = bubble.offsetHeight;
            bubble.style.visibility = '';

            var left = Math.max(8, Math.min(rect.left, window.innerWidth - bw - 8));

            var top;
            if (rect.bottom + 10 + bh <= window.innerHeight - 8) {
                top = rect.bottom + 10;                       // kelimenin altına aç
            } else if (rect.top - 10 - bh >= 8) {
                top = rect.top - 10 - bh;                     // yukarı çevir
            } else {
                top = Math.max(8, Math.min(window.innerHeight - bh - 8, rect.bottom + 10));
            }

            bubble.style.left = left + 'px';
            bubble.style.top = top + 'px';
        }

        /* Balonu kelime başlığıyla birlikte "aranıyor" durumunda açar. */
        function showLoadingFor(word) {
            elWord.textContent = word;
            elBadge.textContent = '';
            elBody.innerHTML =
                '<div class="dh-loading"><span class="sp-spinner" aria-hidden="true"></span><span>Sözlükte aranıyor…</span></div>';
            elFoot.hidden = true;
            elLinks.innerHTML = '';
            visible = true;
            placeBubble(anchorRect);
        }

        function requestWord(word) {
            showLoadingFor(word);
            var token = ++dictToken;
            DictCore.fetch(word, function (res) {
                if (token !== dictToken || !visible || currentWord !== word) return;
                renderResult(word, res);
            });
        }

        function renderResult(word, res) {
            var label = DictCore.sourceLabel(res && res.matched);
            elBadge.textContent = label || '';

            var bodyHtml = '';
            var defs = (res && res.defs) || [];
            defs.slice(0, DictCore.MAX_MEANINGS_BUBBLE).forEach(function (d) {
                bodyHtml += '<p class="dh-def">';
                if (d.pos) bodyHtml += '<span class="dh-pos">' + DictCore.escapeHtml(d.pos) + '</span>';
                bodyHtml += DictCore.escapeHtml(d.meaning) + '</p>';
            });

            var wiki = res && res.wiki;
            if (wiki && wiki.extract) {
                var ex = String(wiki.extract).replace(/\s+/g, ' ').trim();
                if (ex.length > 240) { ex = ex.slice(0, 240).replace(/\s+\S*$/, '') + '…'; }
                bodyHtml += '<p class="dh-wiki">' + DictCore.escapeHtml(ex) + '</p>';
            }

            if (!bodyHtml) {
                bodyHtml = '<p class="dh-none">Anlamda eşleşme bulunamadı.</p>';
            }
            elBody.innerHTML = bodyHtml;

            /* Otomatik detaylandırma/kaynak bağlantıları (her durumda) */
            var links = DictCore.buildAutoLinks(word, res || null).slice(0, 4);
            var linksHtml = '';
            links.forEach(function (s) {
                linksHtml += '<a class="dh-link" href="' + s.url + '" target="_blank" rel="noopener noreferrer nofollow">' + DictCore.escapeHtml(s.name) + '</a>';
            });
            elLinks.innerHTML = linksHtml;
            elFoot.hidden = false;

            placeBubble(anchorRect);
        }

        function onMove(e) {
            /* Balon üzerindeyse kapanmayı ertele — içindeki bağlantılar okunup tıklanabilsin */
            if (bubble.contains(e.target)) {
                if (hideTimer) { clearTimeout(hideTimer); hideTimer = null; }
                return;
            }

            if (!content.contains(e.target)) {
                if (visible || dwellTimer) scheduleHide(HIDE_GRACE_MS);
                return;
            }

            /* Metin seçerken veya etkileşimli öğelerde tetiklenme */
            if (hasTextSelection()) { clearTimers(); hideBubble(); return; }
            var tEl = (e.target && e.target.closest) ? e.target : null;
            if (tEl && e.target.closest('a, button, input, textarea, select, [contenteditable]')) {
                clearTimers(); hideBubble(); return;
            }

            var found = wordAtPoint(e.clientX, e.clientY);
            if (!found) {
                if (visible || dwellTimer) scheduleHide(HIDE_GRACE_MS);
                return;
            }

            if (visible && found.word === currentWord) {
                anchorRect = found.rect;
                placeBubble(anchorRect);
                return;
            }

            if (found.word !== currentWord) {
                clearTimers();
                hideBubble();
                currentWord = found.word;
                anchorRect = found.rect;
                dwellTimer = setTimeout(function () {
                    dwellTimer = null;
                    requestWord(currentWord);
                }, DWELL_MS);
            }
        }

        document.addEventListener('mousemove', onMove, { passive: true });

        content.addEventListener('mouseleave', function () {
            /* Dokunmatik cihazlardaki sentetik leave olayları balonu gereksiz kapatmasın */
            var fineMouse = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
            if (!fineMouse) return;
            if (visible || dwellTimer) scheduleHide(HIDE_GRACE_MS);
        });

        /* TIKLAMA / DOKUNMA — kısıtsız yol: kelimeye tıklandığında anlam anında açılır.
         * Balon dışına ya da kelime olmayan bir alana tıklamak balonu kapatır. */
        document.addEventListener('click', function (e) {
            if (bubble.contains(e.target)) return;   // balon içi tıklamalar serbest (linkler, kapat)
            clearTimers();

            if (!content.contains(e.target)) { hideBubble(); return; }

            var tEl = (e.target && e.target.closest) ? e.target : null;
            if (tEl && e.target.closest('a, button, input, textarea, select, [contenteditable]')) return;

            /* Sürüklemeyle metin seçiliyse akışı seçim araç çubuğuna bırak */
            if (hasTextSelection()) { hideBubble(); return; }

            var found = wordAtPoint(e.clientX, e.clientY);
            if (!found) { hideBubble(); return; }

            anchorRect = found.rect;
            currentWord = found.word;
            requestWord(found.word);                 // gecikmesiz, otomatik
        });

        window.addEventListener('scroll', function () {
            if (visible || dwellTimer) { clearTimers(); hideBubble(); }
        }, { passive: true });

        window.addEventListener('resize', function () {
            clearTimers();
            hideBubble();
        }, { passive: true });

        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') { clearTimers(); hideBubble(); }
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { clearTimers(); hideBubble(); }
        });
    }

    onReady(function () {
        initFontSizeControl();
        initGlassesPanel();
        initReadingWidthSelector();
        initSourcePanel();
        initReadingProgress();
        initSelectionToolbar();
        initHoverDictionary();
    });
})();