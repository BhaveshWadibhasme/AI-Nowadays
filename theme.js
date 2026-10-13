(function () {
  var stored = localStorage.getItem('theme');
  if (stored === 'light' || stored === 'dark') document.documentElement.dataset.theme = stored;

  function current() {
    var explicit = document.documentElement.dataset.theme;
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function paint() {
    var dark = current() === 'dark';
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
      var label = btn.querySelector('.theme-label');
      if (label) label.textContent = dark ? 'Dark' : 'Light';
    });
    document.documentElement.classList.add('theme-ready');
  }

  window.toggleTheme = function () {
    var next = current() === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    localStorage.setItem('theme', next);
    paint();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
})();
