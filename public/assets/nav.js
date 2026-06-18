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

    // Snapshot the body's layout BEFORE mutating it. getComputedStyle returns a
    // LIVE declaration, so these must be copied to plain strings now — reading
    // them after we set body.style.* would return the new (wrong) values.
    var cs = getComputedStyle(body);
    var bodyDisplay = cs.display;
    var origFlexDirection = cs.flexDirection;
    var origGridTemplateColumns = cs.gridTemplateColumns;
    var isFullHeightLayout =
      (bodyDisplay === 'flex' || bodyDisplay === 'grid' || bodyDisplay === 'inline-flex' || bodyDisplay === 'inline-grid');

    var wrapper = document.createElement('div');
    wrapper.className = 'app-shell__content';
    wrapper.id = 'main';
    wrapper.setAttribute('role', 'main');
    while (body.firstChild) wrapper.appendChild(body.firstChild);

    // Skip-to-content link for keyboard users (targets the content wrapper).
    var skip = document.createElement('a');
    skip.className = 'app-skip-link';
    skip.href = '#main';
    skip.textContent = 'Skip to content';

    var header = buildHeader();
    body.appendChild(skip);
    body.appendChild(header); // nav first
    body.appendChild(wrapper); // then the page content

    // If the page styled the body as a flex/grid container (full-height apps like
    // llm-console), turn the BODY into a 100vh flex column: nav (fixed height) +
    // wrapper (fills the rest). The wrapper keeps the page's original flex/grid
    // layout for its own children. This fills the viewport minus the nav with no
    // overflow and no brittle calc() arithmetic.
    if (isFullHeightLayout) {
      body.style.display = 'flex';
      body.style.flexDirection = 'column';
      body.style.height = '100vh';
      body.style.margin = '0';
      body.style.overflow = 'hidden';

      header.style.flex = '0 0 auto';

      wrapper.style.flex = '1 1 auto';
      wrapper.style.minHeight = '0';
      wrapper.style.display = bodyDisplay;
      wrapper.style.flexDirection = origFlexDirection;
      wrapper.style.gridTemplateColumns = origGridTemplateColumns;
      wrapper.style.overflow = 'hidden';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
