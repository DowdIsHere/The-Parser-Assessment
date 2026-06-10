/* Mobile navigation drawer behaviour — shared across pages.
   Toggles `mn-open` on <html>, manages aria, Escape, scrim, and a
   focus trap (taste-skill: trap focus inside the drawer until close). */
(function () {
  var html = document.documentElement;
  var header = document.querySelector('header');
  if (!header) return;
  var btn = header.querySelector('.nav-toggle');
  var nav = header.querySelector('nav');
  var scrim = document.querySelector('.nav-scrim');
  if (!btn || !nav) return;

  function trapItems() {
    return [btn].concat([].slice.call(nav.querySelectorAll('a[href]')));
  }
  function isOpen() { return html.classList.contains('mn-open'); }

  function setOpen(open) {
    html.classList.toggle('mn-open', open);
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    btn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (open) {
      var links = nav.querySelectorAll('a[href]');
      if (links.length) links[0].focus();
    } else {
      btn.focus();
    }
  }

  btn.addEventListener('click', function () { setOpen(!isOpen()); });
  if (scrim) scrim.addEventListener('click', function () { setOpen(false); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setOpen(false); });

  document.addEventListener('keydown', function (e) {
    if (!isOpen()) return;
    if (e.key === 'Escape') { setOpen(false); return; }
    if (e.key === 'Tab') {
      var f = trapItems(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  window.addEventListener('resize', function () {
    if (isOpen() && window.innerWidth > 860) setOpen(false);
  });
})();
