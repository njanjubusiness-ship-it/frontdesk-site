/* Front Desk AI — nav, reveal, pricing tabs */
document.documentElement.classList.add('js');

(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var nav = document.getElementById('nav');
  var toggle = document.getElementById('navToggle');
  var links = document.getElementById('navLinks');

  /* sticky nav shadow on scroll */
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 12); }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mobile menu */
  if (toggle) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    if (links) links.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  /* reveal on scroll, staggered */
  var revealEls = [].slice.call(document.querySelectorAll('.reveal'));
  function revealAll() { revealEls.forEach(function (el) { el.classList.add('in'); }); }
  if (reduce || !('IntersectionObserver' in window)) {
    revealAll();
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, i) {
        if (e.isIntersecting) {
          var el = e.target;
          setTimeout(function () { el.classList.add('in'); }, Math.min(i * 60, 240));
          io.unobserve(el);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
    if (document.hidden) revealAll();
    document.addEventListener('visibilitychange', function () { if (document.hidden) revealAll(); });
  }

  /* pricing tabs */
  var tabs = [].slice.call(document.querySelectorAll('.tab'));
  var keys = ['rec', 'widget', 'auto'];
  function showTab(name) {
    tabs.forEach(function (t) {
      var on = t.getAttribute('data-tab') === name;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    keys.forEach(function (n) {
      var g = document.getElementById('ptab-' + n);
      if (!g) return;
      var show = (n === name);
      g.classList.toggle('hidden', !show);
      if (show) g.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('in'); });
    });
  }
  tabs.forEach(function (t) { t.addEventListener('click', function () { showTab(t.getAttribute('data-tab')); }); });

  /* "See pricing" deep links open the right tab before the jump */
  [].slice.call(document.querySelectorAll('[data-ptab]')).forEach(function (a) {
    a.addEventListener('click', function () { showTab(a.getAttribute('data-ptab')); });
  });
})();
