/*
 * Shared app-shell navigation. Injects one consistent header into every page so
 * all surfaces hang off a single structure (fixes the previously broken nav
 * graph where settings/dashboard were unreachable from the landing page).
 *
 * Layout-safe: some pages make <body> a flex/grid container (e.g. llm-console).
 * Inserting the nav as a bare child would become a flex item and break the
 * layout, so we move the page's existing children into a wrapper that inherits
 * the body's display, then reset the body to a simple block column with the nav
 * on top. Pure static links — no fetch, no dependencies.
 */
(function () {
  var LINKS = [
    { href: '/', label: 'Overview' },
    { href: '/dashboard.html', label: 'Dashboard' },
    { href: '/shell.html', label: 'Shell' },
    { href: '/llm-console.html', label: 'LLM Console' },
    { href: '/settings.html', label: 'Settings' },
    { href: '/endpoint-status.html', label: 'Status' },
    { href: '/docs', label: 'API Docs' },
    { href: '/login.html', label: 'Login' },
  ];

  function currentPath() {
    var p = location.pathname;
    if (p === '' || p === '/index.html') return '/';
    return p;
  }

  function buildHeader() {
    var path = currentPath();
    var header = document.createElement('header');
    header.className = 'app-nav';

    var brand = document.createElement('a');
    brand.className = 'app-nav__brand';
    brand.href = '/';
    brand.innerHTML = 'GPT&nbsp;Terminal<span>+</span>';
    header.appendChild(brand);

    var nav = document.createElement('nav');
    nav.className = 'app-nav__links';
    nav.setAttribute('aria-label', 'Primary');
    LINKS.forEach(function (l) {
      var a = document.createElement('a');
      a.className = 'app-nav__link';
      a.href = l.href;
      a.textContent = l.label;
      if (l.href === path) a.setAttribute('aria-current', 'page');
      nav.appendChild(a);
    });
    header.appendChild(nav);
    return header;
  }

  function build() {
    if (document.querySelector('.app-nav')) return; // idempotent
    var body = document.body;
    if (!body) return;

    // Move existing content into a wrapper that takes over the body's layout.
    var bodyDisplay = getComputedStyle(body).display;
    var wrapper = document.createElement('div');
    wrapper.className = 'app-shell__content';
    while (body.firstChild) wrapper.appendChild(body.firstChild);

    // If the page styled the body as a flex/grid container, transfer that to the
    // wrapper so its children lay out exactly as before; otherwise leave it.
    if (bodyDisplay === 'flex' || bodyDisplay === 'grid' || bodyDisplay === 'inline-flex' || bodyDisplay === 'inline-grid') {
      var cs = getComputedStyle(body);
      wrapper.style.display = bodyDisplay;
      wrapper.style.flexDirection = cs.flexDirection;
      wrapper.style.gridTemplateColumns = cs.gridTemplateColumns;
      wrapper.style.height = cs.height;
      wrapper.style.minHeight = cs.minHeight;
      wrapper.style.overflow = cs.overflow;
      body.style.display = 'block';
      body.style.height = 'auto';
      body.style.overflow = 'visible';
    }

    body.appendChild(buildHeader()); // nav first
    body.appendChild(wrapper);       // then the page content
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
