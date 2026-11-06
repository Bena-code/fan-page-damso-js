/**
 * layout.js — coquille commune à toutes les pages.
 *
 * Une seule liste (PAGES) décrit le site : le menu, les flèches
 * précédent / suivant, le sommaire et la page d'accueil en dépendent.
 * Pour ajouter une page, il suffit d'ajouter une ligne ici.
 *
 * Chaque page déclare sa place avec <body data-page="nom-du-fichier.html">
 * et des emplacements : [data-site-header], [data-pager], [data-sommaire],
 * [data-site-footer].
 */
(() => {
  'use strict';

  const PAGES = [
    {
      href: 'index.html',
      label: 'Accueil',
      desc: "Découverte de l'artiste, biographie…",
      img: '../image/accueil.webp',
    },
    {
      href: 'page1.html',
      label: 'Sommaire',
      desc: 'Toutes les pages du site en un coup d\'œil.',
      img: '../image/fond.jpg',
    },
    {
      href: 'page2.html',
      label: "Vie d'artiste",
      desc: "Parcours de l'artiste, albums, discographie…",
      img: '../image/lithopedion.webp',
    },
    {
      href: 'page3.html',
      label: 'Médias',
      desc: 'Recherche Deezer, logo interactif, vidéo, sources…',
      img: '../image/OIP.jpg',
    },
    {
      href: 'page4.html',
      label: 'Newsletter',
      desc: 'Rejoignez-nous pour ne plus rien manquer !',
      img: '../image/sdf.jpg',
    },
  ];

  const current = document.body.dataset.page;
  const currentIndex = PAGES.findIndex((page) => page.href === current);

  /** Crée un élément : h('a', { href: '#' }, 'texte', enfant…) */
  const h = (tag, attrs = {}, ...children) => {
    const el = document.createElement(tag);
    for (const [name, value] of Object.entries(attrs)) {
      if (value === false || value == null) continue;
      el.setAttribute(name, value === true ? '' : value);
    }
    el.append(...children);
    return el;
  };

  /* ---------- En-tête + menu (avec bouton burger sur mobile) ---------- */
  const renderHeader = (header) => {
    const links = PAGES.map((page) =>
      h(
        'li',
        {},
        h(
          'a',
          { href: page.href, 'aria-current': page.href === current ? 'page' : false },
          page.label,
        ),
      ),
    );

    const nav = h(
      'nav',
      { class: 'site-nav', id: 'site-nav', 'aria-label': 'Navigation principale' },
      h('ul', {}, ...links),
    );

    const toggle = h(
      'button',
      { class: 'nav-toggle', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'site-nav' },
      h('span', { class: 'visually-hidden' }, 'Menu'),
      h('span', { class: 'nav-toggle__bars', 'aria-hidden': 'true' }),
    );

    const brand = h(
      'a',
      { class: 'brand', href: 'index.html', 'aria-label': 'DMS, retour à l\'accueil' },
      'DMS',
      h('span', { class: 'brand__dot', 'aria-hidden': 'true' }, '.'),
    );

    header.append(h('div', { class: 'site-header__inner' }, brand, toggle, nav));

    const setOpen = (open) => {
      header.toggleAttribute('data-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };

    toggle.addEventListener('click', () => setOpen(!header.hasAttribute('data-open')));
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') setOpen(false);
    });
    matchMedia('(min-width: 761px)').addEventListener('change', () => setOpen(false));
  };

  /* ---------- Pied de page + horloge ---------- */
  const renderFooter = (footer) => {
    const clock = h('time', { class: 'clock', id: 'horloge', 'aria-label': 'Heure actuelle' });

    footer.append(
      h(
        'div',
        { class: 'site-footer__inner' },
        h('p', { class: 'brand brand--small' }, 'DMS'),
        h('p', { class: 'muted' }, `© ${new Date().getFullYear()} · Site de fan non officiel`),
        clock,
      ),
    );

    const format = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
    const tick = () => {
      const now = new Date();
      clock.textContent = format.format(now);
      clock.dateTime = now.toTimeString().slice(0, 8);
    };
    tick();
    setInterval(tick, 1000);
  };

  /* ---------- Flèches précédent / suivant ---------- */
  const renderPager = (pager) => {
    if (currentIndex === -1) return;
    pager.setAttribute('aria-label', 'Pages précédente et suivante');

    const link = (page, rel, hint) =>
      h('a', { href: page.href, rel }, h('small', {}, hint), h('strong', {}, page.label));

    const previous = PAGES[currentIndex - 1];
    const next = PAGES[currentIndex + 1];
    if (previous) pager.append(link(previous, 'prev', '← Précédent'));
    if (next) pager.append(link(next, 'next', 'Suivant →'));
  };

  /* ---------- Cartes de navigation : toutes les pages sauf la page courante ---------- */
  const renderCards = (list) => {
    const cards = PAGES.filter((page) => page.href !== current).map((page) =>
      h(
        'li',
        {},
        h(
          'a',
          { class: 'nav-card', href: page.href },
          h(
            'span',
            { class: 'nav-card__media', 'aria-hidden': 'true' },
            h('img', { src: page.img, alt: '', loading: 'lazy', decoding: 'async', width: '500', height: '281' }),
          ),
          h(
            'span',
            { class: 'nav-card__body' },
            h('span', { class: 'nav-card__title' }, page.label),
            h('span', { class: 'nav-card__desc' }, page.desc),
          ),
        ),
      ),
    );
    list.append(...cards);
  };

  const mount = (selector, render) => {
    const host = document.querySelector(selector);
    if (host) render(host);
  };

  mount('[data-site-header]', renderHeader);
  mount('[data-site-footer]', renderFooter);
  mount('[data-pager]', renderPager);
  mount('[data-sommaire]', renderCards);
})();
