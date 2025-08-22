// Simple theme controller with dark as default
(function () {
  const KEY = 'gpt_theme';
  function apply(theme) {
    const t = theme === 'light' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', t);
    try { localStorage.setItem(KEY, t); } catch {}
    var toggle = document.getElementById('themeToggle');
    if (toggle) toggle.checked = (t !== 'light');
  }
  function init() {
    var saved = 'dark';
    try { saved = localStorage.getItem(KEY) || 'dark'; } catch {}
    apply(saved);
    var tg = document.getElementById('themeToggle');
    if (tg) tg.addEventListener('change', function (e) { apply(e.target.checked ? 'dark' : 'light'); });
  }
  window.Theme = { apply: apply, init: init, toggle: function(){
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    apply(cur === 'light' ? 'dark' : 'light');
  } };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();

