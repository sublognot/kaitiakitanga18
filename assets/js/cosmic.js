/**
 * Kaitiakitanga — cosmic.js
 * Yıldız alanı canvas animasyonu.
 */

(function () {
    'use strict';

    function onReady(fn) {
        if (document.readyState !== 'loading') { fn(); }
        else { document.addEventListener('DOMContentLoaded', fn); }
    }

    function resolveDensity() {
        // 1) body[data-cosmic-density] attribute'u,
        // 2) yoksa cosmic-density-* body class'ı (Customizer ayarı).
        var attr = (document.body.getAttribute('data-cosmic-density') || '').toLowerCase();
        if (attr === 'low' || attr === 'high' || attr === 'medium') return attr;

        if (document.body.classList.contains('cosmic-density-low')) return 'low';
        if (document.body.classList.contains('cosmic-density-high')) return 'high';
        return 'medium';
    }

    function initStars() {
        var canvas = document.getElementById('cosmic-stars');
        if (!canvas) return;

        var density;
        switch (resolveDensity()) {
            case 'low': density = 80; break;
            case 'high': density = 280; break;
            default: density = 160;
        }

        var prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        var ctx = canvas.getContext('2d');
        var stars = [];
        var w = 0, h = 0;
        var dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));

        function resize() {
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function pickStarColor() {
            var colors = [
                'rgba(255, 255, 255, ',
                'rgba(199, 210, 254, ',
                'rgba(254, 240, 138, ',
                'rgba(253, 230, 138, ',
                'rgba(216, 180, 254, ',
                'rgba(147, 197, 253, '
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }

        function buildStars() {
            stars = [];
            for (var i = 0; i < density; i++) {
                var big = Math.random() > 0.92;
                stars.push({
                    x: Math.random() * w,
                    y: Math.random() * h,
                    r: big ? Math.random() * 1.6 + 1.2 : Math.random() * 1.0 + 0.3,
                    alpha: Math.random() * 0.7 + 0.3,
                    twinkleSpeed: Math.random() * 0.018 + 0.005,
                    twinkleDir: Math.random() > 0.5 ? 1 : -1,
                    color: pickStarColor(),
                    big: big
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, w, h);
            for (var i = 0; i < stars.length; i++) {
                var s = stars[i];
                if (!prefersReduced) {
                    s.alpha += s.twinkleSpeed * s.twinkleDir;
                    if (s.alpha >= 1) { s.alpha = 1; s.twinkleDir = -1; }
                    if (s.alpha <= 0.15) { s.alpha = 0.15; s.twinkleDir = 1; }
                }
                ctx.beginPath();
                ctx.arc(s.x, s.y, Math.max(0.1, s.r), 0, Math.PI * 2);
                ctx.fillStyle = s.color + s.alpha + ')';
                ctx.fill();
                if (s.big && s.alpha > 0.7) {
                    ctx.beginPath();
                    ctx.arc(s.x, s.y, s.r * 2.5, 0, Math.PI * 2);
                    ctx.fillStyle = s.color + (s.alpha * 0.15) + ')';
                    ctx.fill();
                }
            }
            if (!prefersReduced) rafId = requestAnimationFrame(draw);
        }

        var rafId = null;
        function start() { if (rafId) cancelAnimationFrame(rafId); draw(); }

        function parallax() {
            var y = window.scrollY * 0.05;
            canvas.style.transform = 'translate3d(0,' + (-y) + 'px,0)';
        }

        resize();
        buildStars();
        start();

        if (!prefersReduced) {
            window.addEventListener('scroll', parallax, { passive: true });
        }

        var resizeTimer;
        window.addEventListener('resize', function () {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function () {
                resize(); buildStars();
                if (prefersReduced) draw();
            }, 150);
        });

        document.addEventListener('visibilitychange', function () {
            if (document.hidden) { if (rafId) { cancelAnimationFrame(rafId); rafId = null; } }
            else { if (!rafId && !prefersReduced) start(); }
        });
    }

    onReady(function () { initStars(); });
})();