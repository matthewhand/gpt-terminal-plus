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
  function ensureFab() {
    if (document.getElementById('themeFab')) return;
    if (document.getElementById('themeToggle')) return; // page supplies its own toggle
    var style = document.createElement('style');
    style.textContent = `
      .theme-fab{position:fixed;right:16px;bottom:16px;background:var(--accent, #6366f1);color:var(--accent-fg,#fff);border:none;border-radius:999px;cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,.25);}
      .theme-fab button{appearance:none;background:transparent;border:none;color:inherit;padding:.55rem .8rem;border-radius:inherit;font:inherit}
      .theme-fab:hover{filter:brightness(.95)}
    `;
    document.head.appendChild(style);
    var wrap = document.createElement('div');
    wrap.className = 'theme-fab';
    wrap.id = 'themeFab';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Toggle theme';
    btn.textContent = '🌙';
    btn.addEventListener('click', function(){ window.Theme.toggle(); btn.textContent = (document.documentElement.getAttribute('data-theme')==='light') ? '🌞' : '🌙'; });
    wrap.appendChild(btn);
    document.body.appendChild(wrap);
  }

  function init() {
    var saved = 'dark';
    try { saved = localStorage.getItem(KEY) || 'dark'; } catch {}
    apply(saved);
    var tg = document.getElementById('themeToggle');
    if (tg) tg.addEventListener('change', function (e) { apply(e.target.checked ? 'dark' : 'light'); });
    ensureFab();
  }
  window.Theme = { apply: apply, init: init, toggle: function(){
    const cur = document.documentElement.getAttribute('data-theme') || 'dark';
    apply(cur === 'light' ? 'dark' : 'light');
  } };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else { init(); }
})();
