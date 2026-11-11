(() => {
  'use strict';

  const data = window.PORTFOLIO;
  const html = document.documentElement;
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const MOTION_KEY = 'gp-motion';
  const AUTHOR = (data && typeof data.name === 'string' && data.name) || '김준식';
  const BASE_TITLE = document.title || '게임 포트폴리오';

  const arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const motionOn = () => html.dataset.motion !== 'off';
  const scrollBehavior = () => (motionOn() ? 'smooth' : 'auto');

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : value);
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.append(child);
    }
    return node;
  };

  /* ---------- motion toggle: persisted choice, otherwise follows the OS setting ---------- */
  const motionBtn = $('#motionToggle');
  const motionLabel = motionBtn && $('.motion-toggle__label', motionBtn);
  const revealAll = () => $$('[data-reveal]').forEach((n) => n.classList.add('is-visible'));
  const syncMotionButton = () => {
    if (!motionBtn) return;
    const on = motionOn();
    const text = on ? '모션 끄기' : '모션 켜기';
    if (motionLabel) motionLabel.textContent = text;
    else motionBtn.textContent = text;
    motionBtn.setAttribute('aria-pressed', String(on));
    motionBtn.dataset.state = on ? 'on' : 'off';
  };
  const setMotion = (on, persist) => {
    html.dataset.motion = on ? 'on' : 'off';
    if (persist) {
      try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch (e) { /* storage blocked: lasts this visit */ }
    }
    if (!on) revealAll();
    syncMotionButton();
  };
  const savedMotion = () => {
    try {
      const v = localStorage.getItem(MOTION_KEY);
      return v === 'on' || v === 'off' ? v : null;
    } catch (e) { return null; }
  };
  if (html.dataset.motion !== 'on' && html.dataset.motion !== 'off') {
    const saved = savedMotion();
    html.dataset.motion = saved || (reduceMQ.matches ? 'off' : 'on');
  }
  if (motionBtn) motionBtn.addEventListener('click', () => setMotion(!motionOn(), true));
  reduceMQ.addEventListener('change', () => { if (!savedMotion()) setMotion(!reduceMQ.matches, false); });
  syncMotionButton();

  /* ---------- reveal + in-view observers (content never depends on them) ---------- */
  const hasIO = 'IntersectionObserver' in window;
  const revealIO = hasIO
    ? new IntersectionObserver((entries) => {
        let k = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t = entry.target;
          t.style.setProperty('--reveal-delay', `${Math.min(k, 5) * 50}ms`);
          k += 1;
          t.classList.add('is-visible');
          revealIO.unobserve(t);
        }
      }, { rootMargin: '0px 0px -4% 0px' })
    : null;
  const reveal = (node) => {
    node.setAttribute('data-reveal', '');
    if (revealIO && motionOn()) revealIO.observe(node);
    else node.classList.add('is-visible');
  };
  const inviewIO = hasIO
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) entry.target.classList.toggle('is-inview', entry.isIntersecting);
      }, { threshold: 0.15 })
    : null;

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastTimer = 0;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    window.requestAnimationFrame(() => toastEl.classList.add('is-shown'));
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => {
      toastEl.classList.remove('is-shown');
      toastEl.hidden = true;
    }, 2600);
  };

  /* ---------- data ---------- */
  const views = { home: $('#homeView'), catalog: $('#catalogView'), detail: $('#detailView') };
  const dataError = $('#dataError');
  const seen = new Set();
  const games = arr(data && data.games).filter((g) => {
    if (!g || typeof g !== 'object' || typeof g.id !== 'string' || !g.id || typeof g.title !== 'string' || seen.has(g.id)) return false;
    seen.add(g.id);
    return true;
  });

  if (!games.length) {
    for (const v of Object.values(views)) if (v) v.hidden = true;
    if (dataError) {
      if (!dataError.textContent.trim()) dataError.textContent = '게임 데이터를 불러오지 못했습니다. 잠시 후 새로고침해 주세요.';
      dataError.hidden = false;
    }
    return;
  }

  const byId = new Map(games.map((g) => [g.id, g]));
  const finals = games.filter((g) => g.final === true);
  const featured = games.filter((g) => g.featured && g.final !== true);
  const categories = [];
  for (const g of games) if (g.category && !categories.includes(g.category)) categories.push(g.category);

  const coverOf = (g) => {
    const img = arr(g.images).find((i) => i && i.src);
    if (img) return img;
    const vid = arr(g.videos).find((v) => v && v.poster);
    return vid ? { src: vid.poster, alt: vid.title || g.title, pos: null } : null;
  };
  const shortStatus = (s) => str(s).split(' · ')[0];
  const initials = (t) => {
    const words = str(t).trim().split(/\s+/).filter(Boolean);
    if (words.length > 1 && /^[A-Za-z0-9]/.test(words[0]) && /^[A-Za-z0-9]/.test(words[1])) return (words[0][0] + words[1][0]).toUpperCase();
    return Array.from(words.join('')).slice(0, 2).join('');
  };
  const periodOf = (g) => str(g.period) || (g.year ? `${g.year}년` : '');
  const mediaSummary = (g) => {
    const parts = [];
    const ni = arr(g.images).length;
    const nv = arr(g.videos).length;
    if (ni) parts.push(`이미지 ${ni}`);
    if (nv) parts.push(`영상 ${nv}`);
    return parts.length ? parts.join(' · ') : '공개 미디어 없음';
  };
  const gameHref = (g) => `#p=${encodeURIComponent(g.id)}`;

  /* ---------- media helpers ---------- */
  const setOrient = (img, targets) => {
    const apply = () => {
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      if (!w || !h) return;
      const r = w / h;
      const orient = r < 0.9 ? 'portrait' : r > 1.1 ? 'landscape' : 'square';
      for (const t of targets) {
        t.dataset.orient = orient;
        t.style.setProperty('--ar', r.toFixed(4));
      }
    };
    if (img.complete && img.naturalWidth) apply();
    else img.addEventListener('load', apply, { once: true });
  };
  const makeImg = (src, { cls, alt = '', pos, eager = false } = {}) => {
    const img = document.createElement('img');
    if (cls) img.className = cls;
    img.alt = alt;
    img.decoding = 'async';
    img.loading = eager ? 'eager' : 'lazy';
    if (pos) img.style.objectPosition = pos;
    img.src = src;
    return img;
  };
  // Image inside a container: orientation hook + honest failure state (no substitute picture).
  const containerImg = (container, src, opts, title, extraOrientTargets = []) => {
    const img = makeImg(src, opts);
    container.dataset.title = title;
    setOrient(img, [container, ...extraOrientTargets]);
    img.addEventListener('error', () => {
      container.classList.add('is-broken');
      img.remove();
      const back = $('.feature-card__backdrop', container);
      if (back) back.remove();
      if (!$('.media-error', container)) container.append(el('span', { class: 'media-error', text: '이미지를 불러오지 못했습니다' }));
    }, { once: true });
    return img;
  };
  const textCover = (g, large) => el('div', { class: large ? 'text-cover text-cover--large' : 'text-cover', 'aria-hidden': large ? null : 'true' }, [
    el('span', { class: 'text-cover__title', text: g.title }),
    el('span', { class: 'text-cover__label', text: '제작 기록' }),
  ]);
  const coverBadge = (g) => {
    const n = arr(g.videos).length;
    return n ? el('span', { class: 'cover-badge', text: `영상 ${n}` }) : null;
  };

  /* ---------- cards ---------- */
  const featureCard = (g, index) => {
    const visual = el('div', { class: 'feature-card__visual' });
    const c = coverOf(g);
    if (c) {
      const back = makeImg(c.src, { cls: 'feature-card__backdrop', pos: c.pos, eager: index === 0 });
      back.setAttribute('aria-hidden', 'true');
      back.addEventListener('error', () => back.remove(), { once: true });
      const img = containerImg(visual, c.src, { cls: 'feature-card__image', pos: c.pos, eager: index === 0 }, g.title);
      if (index === 0) img.setAttribute('fetchpriority', 'high');
      visual.append(back, img);
    } else {
      visual.append(textCover(g));
    }
    const badge = coverBadge(g);
    if (badge) visual.append(badge);
    const card = el('a', { class: 'feature-card', href: gameHref(g), 'data-game': g.id, 'data-id': g.id }, [
      visual,
      el('div', { class: 'feature-card__body' }, [
        el('span', { class: 'eyebrow', text: '최종 프로젝트' }),
        el('h2', { class: 'feature-card__title', text: g.title }),
        el('p', { class: 'feature-card__subtitle', text: str(g.subtitle) }),
        el('div', { class: 'card-meta', text: [g.category, g.engine].filter(Boolean).join(' · ') }),
        el('span', { class: 'card-action' }, ['게임 보기 ', el('span', { class: 'card-action__arrow', 'aria-hidden': 'true', text: '→' })]),
      ]),
    ]);
    card.style.setProperty('--i', String(index));
    reveal(card);
    if (inviewIO) inviewIO.observe(card);
    return card;
  };

  const gameCard = (g, { compact = false, index = 0 } = {}) => {
    const c = coverOf(g);
    const cover = el('div', { class: 'game-card__cover' });
    if (c) cover.append(containerImg(cover, c.src, { cls: 'game-card__image', pos: c.pos }, g.title));
    else cover.append(textCover(g));
    const badge = coverBadge(g);
    if (badge) cover.append(badge);
    const icon = el('div', { class: 'game-icon', 'aria-hidden': 'true' });
    if (c) icon.append(containerImg(icon, c.src, { cls: 'game-icon__image', pos: c.pos }, g.title));
    else icon.append(el('span', { class: 'game-icon__text', text: initials(g.title) }));
    const status = str(g.status);
    const card = el('a', {
      class: compact ? 'game-card game-card--compact' : 'game-card',
      href: gameHref(g),
      'data-game': g.id,
      'data-id': g.id,
    }, [
      cover,
      el('div', { class: 'game-card__info' }, [
        icon,
        el('div', { class: 'game-card__copy' }, [
          el('h3', { class: 'game-card__title', text: g.title }),
          el('p', { class: 'game-card__meta', text: str(g.category) }),
          status ? el('p', { class: 'game-card__status', text: shortStatus(status), title: status }) : null,
        ]),
      ]),
    ]);
    card.style.setProperty('--i', String(index));
    reveal(card);
    return card;
  };

  /* ---------- home ---------- */
  const finalGrid = $('#finalGrid');
  const featuredRail = $('#featuredRail');
  const allGrid = $('#allGrid');
  const notesList = $('#notesList');
  if (finalGrid) finalGrid.replaceChildren(...finals.map((g, i) => featureCard(g, i)));
  if (featuredRail) {
    if (featured.length) featuredRail.replaceChildren(...featured.map((g, i) => gameCard(g, { index: i })));
    else {
      const section = featuredRail.closest('section');
      if (section) section.hidden = true;
    }
  }
  if (allGrid) allGrid.replaceChildren(...games.map((g, i) => gameCard(g, { index: i })));
  if (notesList) {
    const notes = arr(data.notes).filter((n) => n && (n.title || n.text));
    if (notes.length) {
      notesList.replaceChildren(...notes.map((n, i) => {
        const card = el('article', { class: n.kind ? `note-card note-card--${n.kind}` : 'note-card' }, [
          el('h3', { text: str(n.title) }),
          el('p', { text: str(n.text) }),
        ]);
        card.style.setProperty('--i', String(i));
        reveal(card);
        return card;
      }));
    } else {
      const section = $('#notes');
      if (section) section.hidden = true;
    }
  }

  /* ---------- catalogue: search + category (AND) ---------- */
  const state = { q: '', cat: '' };
  const searchForm = $('#searchForm');
  const searchInput = $('#searchInput');
  const searchClear = $('#searchClear');
  const catalogTitle = $('#catalogTitle');
  const categoryFilters = $('#categoryFilters');
  const resultCount = $('#resultCount');
  const resultsGrid = $('#resultsGrid');
  const emptyState = $('#emptyState');
  const resetSearch = $('#resetSearch');

  const norm = (s) => str(s).normalize('NFKC').toLowerCase();
  const haystack = new Map(games.map((g) => [g.id, norm([g.title, g.subtitle, g.category, g.engine, g.description].join(' ')).replace(/\s+/g, '')]));
  const tokens = (q) => norm(q).split(/\s+/).filter(Boolean);
  const matches = (g, toks, cat) => {
    if (cat === '__final' && g.final !== true) return false;
    if (cat && cat !== '__final' && g.category !== cat) return false;
    const h = haystack.get(g.id);
    return toks.every((t) => h.includes(t));
  };
  const validCat = (c) => (c === '__final' || categories.includes(c) ? c : '');
  const catLabel = (c) => (c === '__final' ? '최종 프로젝트' : c);

  const chipDefs = [
    { value: '', label: '전체', count: games.length },
    { value: '__final', label: '최종 프로젝트', count: finals.length },
    ...categories.map((c) => ({ value: c, label: c, count: games.filter((g) => g.category === c).length })),
  ];
  const chips = chipDefs.map((d) => el('button', { type: 'button', class: 'filter-chip', 'data-category': d.value, 'aria-pressed': 'false' }, [
    d.label,
    ' ',
    el('span', { class: 'chip-count', text: String(d.count) }),
  ]));
  if (categoryFilters) {
    if (!categoryFilters.hasAttribute('aria-label') && !categoryFilters.hasAttribute('aria-labelledby')) categoryFilters.setAttribute('aria-label', '장르 필터');
    categoryFilters.replaceChildren(...chips);
  }
  const catalogCards = new Map(games.map((g, i) => [g.id, gameCard(g, { index: i })]));

  const syncSearchUI = () => {
    if (searchInput && searchInput.value !== state.q) searchInput.value = state.q;
    if (searchClear) searchClear.hidden = !state.q;
  };

  const renderCatalog = () => {
    const toks = tokens(state.q);
    const list = games.filter((g) => matches(g, toks, state.cat));
    for (const chip of chips) chip.setAttribute('aria-pressed', String(chip.dataset.category === state.cat));
    const nodes = list.map((g, i) => {
      const card = catalogCards.get(g.id);
      card.style.setProperty('--i', String(i));
      return card;
    });
    if (resultsGrid) {
      resultsGrid.replaceChildren(...nodes);
      resultsGrid.hidden = list.length === 0;
      resultsGrid.classList.remove('is-updating');
      if (motionOn()) {
        void resultsGrid.offsetWidth;
        resultsGrid.classList.add('is-updating');
      }
    }
    if (emptyState) emptyState.hidden = list.length !== 0;
    const q = state.q.trim().replace(/\s+/g, ' ');
    let title = '전체 게임';
    if (q) title = `‘${q}’ 검색 결과`;
    else if (state.cat) title = catLabel(state.cat);
    if (catalogTitle) catalogTitle.textContent = title;
    if (resultCount) {
      const parts = [`${list.length}개 게임`];
      if (q && state.cat) parts.push(`${catLabel(state.cat)} 필터 적용`);
      if (q || state.cat) parts.push(`전체 ${games.length}개 중`);
      resultCount.textContent = parts.join(' · ');
    }
    document.title = `${title} · ${BASE_TITLE}`;
  };

  const storeCatalogState = () => {
    try { history.replaceState({ ...(history.state || {}), app: true, q: state.q, cat: state.cat }, '', location.href); } catch (e) { /* ignore */ }
  };

  /* ---------- lightbox ---------- */
  const viewer = $('#mediaViewer');
  const viewerContent = $('#viewerContent');
  const viewerCaption = $('#viewerCaption');
  const viewerCount = $('#viewerCount');
  const viewerPrev = $('#viewerPrev');
  const viewerNext = $('#viewerNext');
  const viewerClose = $('#viewerClose');
  let detailItems = [];
  let viewerItems = [];
  let viewerIndex = 0;
  let viewerReturn = null;
  let skipFocusRestore = false;

  const stopVideo = (v) => {
    v.pause();
    v.removeAttribute('src');
    v.load();
  };
  const clearViewer = () => {
    if (!viewerContent) return;
    $$('video', viewerContent).forEach(stopVideo);
    viewerContent.replaceChildren();
  };
  const mediaError = (msg) => el('p', { class: 'media-error', text: msg });

  const showViewerItem = (index, dir) => {
    const n = viewerItems.length;
    if (!n || !viewerContent) return;
    viewerIndex = ((index % n) + n) % n;
    const item = viewerItems[viewerIndex];
    clearViewer();
    let node;
    if (item.kind === 'video') {
      node = el('video', { class: 'viewer-media', controls: true, playsinline: true, preload: 'metadata', poster: item.poster || null, 'aria-label': item.title || '게임 영상' });
      node.addEventListener('error', () => node.replaceWith(mediaError('영상을 불러오지 못했습니다.')), { once: true });
      node.src = item.src;
    } else {
      node = makeImg(item.src, { cls: 'viewer-media', alt: item.alt || '', eager: true });
      node.addEventListener('error', () => node.replaceWith(mediaError('이미지를 불러오지 못했습니다.')), { once: true });
    }
    viewerContent.append(node);
    if (viewer) {
      viewer.dataset.kind = item.kind;
      if (dir) viewer.dataset.dir = dir;
      else delete viewer.dataset.dir;
    }
    viewerContent.classList.remove('is-switching');
    if (motionOn() && dir) {
      void viewerContent.offsetWidth;
      viewerContent.classList.add('is-switching');
    }
    if (viewerCaption) viewerCaption.textContent = item.kind === 'video' ? [item.title, item.caption].filter(Boolean).join(' · ') : str(item.caption || item.alt);
    if (viewerCount) viewerCount.textContent = `${viewerIndex + 1} / ${n}`;
    if (viewerPrev) viewerPrev.hidden = n < 2;
    if (viewerNext) viewerNext.hidden = n < 2;
    if (item.kind === 'video' && motionOn()) {
      const p = node.play && node.play();
      if (p && p.catch) p.catch(() => { /* autoplay refused: native controls remain */ });
    }
  };

  const openViewer = (items, index, returnEl) => {
    if (!viewer || !items.length) return;
    viewerItems = items;
    viewerReturn = returnEl || null;
    skipFocusRestore = false;
    showViewerItem(index, null);
    if (!viewer.open) {
      if (typeof viewer.showModal === 'function') viewer.showModal();
      else viewer.setAttribute('open', '');
    }
    if (viewerClose) viewerClose.focus();
  };
  const closeViewer = (restoreFocus) => {
    if (!viewer || !viewer.open) return;
    skipFocusRestore = !restoreFocus;
    if (typeof viewer.close === 'function') viewer.close();
    else {
      viewer.removeAttribute('open');
      viewer.dispatchEvent(new Event('close'));
    }
  };

  if (viewer) {
    viewer.addEventListener('close', () => {
      clearViewer();
      if (skipFocusRestore) { skipFocusRestore = false; return; }
      const thumb = $(`.media-thumb[data-media-index="${viewerIndex}"]`, views.detail || document);
      const target = thumb && viewerItems === detailItems ? thumb : viewerReturn;
      if (target && target.isConnected) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: 'nearest', inline: 'nearest' });
      }
    });
    viewer.addEventListener('click', (e) => { if (e.target === viewer) closeViewer(true); });
    viewer.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const t = e.target;
      if (t && t.closest && t.closest('video, audio, input, textarea, select, [contenteditable]')) return;
      if (viewerItems.length < 2) return;
      e.preventDefault();
      showViewerItem(viewerIndex + (e.key === 'ArrowRight' ? 1 : -1), e.key === 'ArrowRight' ? 'next' : 'prev');
    });
  }
  if (viewerClose) viewerClose.addEventListener('click', () => closeViewer(true));
  if (viewerPrev) viewerPrev.addEventListener('click', () => showViewerItem(viewerIndex - 1, 'prev'));
  if (viewerNext) viewerNext.addEventListener('click', () => showViewerItem(viewerIndex + 1, 'next'));

  /* ---------- horizontal rails: optional prev/next buttons ---------- */
  const railButtons = (rail) => $$(`[data-rail-target="${rail.id}"]`);
  const updateRail = (rail) => {
    if (!rail || !rail.id) return;
    const btns = railButtons(rail);
    if (!btns.length) return;
    const max = rail.scrollWidth - rail.clientWidth;
    const overflow = max > 2;
    for (const b of btns) {
      if (b.hasAttribute('data-rail-auto')) b.hidden = !overflow;
      const dir = Number(b.dataset.railDir);
      b.disabled = !overflow || (dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max - 2);
    }
  };
  const watchRail = (rail) => {
    if (!rail) return;
    let raf = 0;
    const queue = () => {
      if (raf) return;
      raf = window.requestAnimationFrame(() => { raf = 0; updateRail(rail); });
    };
    rail.addEventListener('scroll', queue, { passive: true });
    rail.addEventListener('load', queue, true);
    queue();
  };
  document.addEventListener('click', (e) => {
    const btn = e.target.closest && e.target.closest('button[data-rail-target]');
    if (!btn) return;
    const rail = document.getElementById(btn.dataset.railTarget);
    if (!rail) return;
    const dir = Number(btn.dataset.railDir) < 0 ? -1 : 1;
    rail.scrollBy({ left: dir * rail.clientWidth * 0.85, behavior: scrollBehavior() });
  });
  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    if (resizeRaf) return;
    resizeRaf = window.requestAnimationFrame(() => {
      resizeRaf = 0;
      $$('[data-rail-target]').map((b) => document.getElementById(b.dataset.railTarget)).forEach(updateRail);
    });
  });
  watchRail(featuredRail);

  /* ---------- detail ---------- */
  const detailContent = $('#detailContent');
  const detailBack = $('#detailBack');
  const canCopy = !!(navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext);

  const factList = (cls, rows) => el('dl', { class: cls }, rows.filter((r) => r && r[1] != null && r[1] !== '').map(([dt, dd]) => el('div', { class: cls === 'info-list' ? null : 'fact' }, [
    el('dt', { text: dt }),
    typeof dd === 'string' ? el('dd', { text: dd }) : el('dd', {}, dd),
  ])));

  const detailMissing = (id) => el('div', { class: 'detail-missing' }, [
    el('h1', { class: 'detail-title', text: '게임을 찾을 수 없습니다' }),
    el('p', { text: `주소의 게임 ID ‘${id}’와 일치하는 프로젝트가 없습니다. 전체 게임 목록에서 다시 찾아 주세요.` }),
    el('div', { class: 'detail-actions' }, [
      el('a', { class: 'primary-button', href: '#catalog', text: '전체 게임 보기' }),
      el('a', { class: 'text-button', href: '#home', text: '둘러보기로' }),
    ]),
  ]);

  const mediaItemsOf = (g) => [
    ...arr(g.videos).filter((v) => v && v.src).map((v) => ({ kind: 'video', src: v.src, poster: v.poster || '', title: str(v.title), caption: str(v.caption), alt: str(v.title) })),
    ...arr(g.images).filter((i) => i && i.src).map((i) => ({ kind: 'image', src: i.src, alt: str(i.alt), caption: str(i.caption), pos: i.pos || null })),
  ];

  const mediaSection = (g, items) => {
    const head = el('div', { class: 'section-head' }, [el('h2', { text: '영상과 스크린샷', tabindex: '-1' })]);
    const section = el('section', { class: 'detail-media', id: 'projectMedia' }, [head]);
    if (!items.length) {
      section.append(
        textCover(g, true),
        el('p', { class: 'no-media-note', text: '이 프로젝트는 공개할 실행 화면이나 영상을 확보하지 못했습니다. 대신 아래의 게임 소개와 제작 기록에 남은 내용을 정리했습니다.' }),
      );
      return section;
    }
    const rail = el('div', { class: 'screenshot-rail', id: 'projectRail', role: 'list' });
    items.forEach((item, i) => {
      const figure = el('figure', { class: 'media-item', role: 'listitem' });
      const label = item.kind === 'video' ? `영상 열기: ${item.title || g.title}` : `크게 보기: ${item.alt || item.caption || g.title}`;
      const btn = el('button', { type: 'button', class: item.kind === 'video' ? 'media-thumb media-thumb--video' : 'media-thumb', 'data-media-index': String(i), 'aria-label': label });
      const thumbSrc = item.kind === 'video' ? item.poster : item.src;
      if (thumbSrc) {
        const img = containerImg(btn, thumbSrc, { alt: '', eager: i < 2 }, g.title, [figure]);
        btn.append(img);
        img.addEventListener('load', () => {
          figure.classList.toggle('is-portrait', btn.dataset.orient === 'portrait');
          figure.classList.toggle('is-landscape', btn.dataset.orient !== 'portrait');
        }, { once: true });
      } else {
        btn.append(textCover(g));
      }
      if (item.kind === 'video') btn.append(el('span', { class: 'video-label', text: '영상' }));
      const capText = item.kind === 'video' ? [item.title, item.caption].filter(Boolean).join(' · ') : item.caption;
      figure.append(btn);
      if (capText) figure.append(el('figcaption', { class: 'media-caption', text: capText }));
      rail.append(figure);
    });
    if (items.length > 1) {
      head.append(el('div', { class: 'rail-nav' }, [
        el('button', { type: 'button', class: 'rail-button', 'data-rail-target': 'projectRail', 'data-rail-dir': '-1', 'data-rail-auto': '', 'aria-label': '이전 화면들', hidden: true, text: '‹' }),
        el('button', { type: 'button', class: 'rail-button', 'data-rail-target': 'projectRail', 'data-rail-dir': '1', 'data-rail-auto': '', 'aria-label': '다음 화면들', hidden: true, text: '›' }),
      ]));
    }
    section.append(rail);
    return section;
  };

  const renderDetail = (id) => {
    if (!detailContent) return;
    const g = byId.get(id);
    detailItems = [];
    if (!g) {
      detailContent.replaceChildren(detailMissing(id));
      document.title = `게임을 찾을 수 없습니다 · ${BASE_TITLE}`;
      return;
    }
    const items = mediaItemsOf(g);
    detailItems = items;
    const hasVideo = items.some((m) => m.kind === 'video');
    const c = coverOf(g);

    const icon = el('div', { class: 'detail-icon', 'aria-hidden': 'true' });
    if (c) icon.append(containerImg(icon, c.src, { pos: c.pos, eager: true }, g.title));
    else icon.append(el('span', { class: 'game-icon__text', text: initials(g.title) }));

    const actions = el('div', { class: 'detail-actions' }, [
      items.length
        ? el('button', { type: 'button', class: 'primary-button', 'data-scroll-media': '', text: hasVideo ? '영상·화면 보기' : '화면 보기' })
        : el('button', { type: 'button', class: 'primary-button', 'data-scroll-about': '', text: '제작 기록 보기' }),
      canCopy ? el('button', { type: 'button', class: 'text-button', 'data-copy-link': '', text: '링크 복사' }) : null,
    ]);

    const author = g.team ? `${AUTHOR} 참여 · ${g.team}` : AUTHOR;
    const header = el('header', { class: 'detail-header' }, [
      icon,
      el('div', { class: 'detail-heading' }, [
        g.final === true ? el('span', { class: 'final-label', text: '최종 프로젝트' }) : null,
        el('h1', { class: 'detail-title', text: g.title }),
        el('p', { class: 'detail-author', text: author }),
        g.subtitle ? el('p', { class: 'detail-subtitle', text: str(g.subtitle) }) : null,
        g.status ? el('p', { class: 'detail-status' }, [el('span', { class: 'detail-status__label', text: '상태' }), ` ${str(g.status)}`]) : null,
        el('div', { class: 'detail-facts' }, [factList('facts', [
          ['장르', str(g.category)],
          ['엔진', str(g.engine)],
          ['제작 시기', periodOf(g)],
          ['미디어', mediaSummary(g)],
        ])]),
        actions,
      ]),
    ]);

    const about = el('section', { class: 'detail-about', id: 'projectAbout' }, [
      el('h2', { text: '게임 소개', tabindex: '-1' }),
      el('p', { text: str(g.description) }),
    ]);
    const details = arr(g.details).filter((d) => d && (d.title || d.text));
    if (details.length) {
      about.append(el('div', { class: 'detail-sections' }, details.map((d) => el('section', { class: 'detail-section' }, [
        el('h3', { text: str(d.title) }),
        el('p', { text: str(d.text) }),
      ]))));
    }

    const main = el('div', { class: 'detail-main' }, [mediaSection(g, items), about]);
    const features = arr(g.features).filter(Boolean);
    if (features.length) main.append(el('section', { class: 'detail-features' }, [el('h2', { text: '주요 기능' }), el('ul', {}, features.map((f) => el('li', { text: str(f) })))]));
    const historyList = arr(g.history).filter(Boolean);
    if (historyList.length) main.append(el('section', { class: 'detail-history' }, [el('h2', { text: '개발 기록' }), el('ol', {}, historyList.map((h) => el('li', { text: str(h) })))]));

    const tools = arr(g.tools).filter(Boolean);
    const aside = el('aside', { class: 'detail-aside', 'aria-label': '프로젝트 정보' }, [
      el('section', { class: 'info-panel' }, [
        el('h2', { text: '프로젝트 정보' }),
        factList('info-list', [
          ['참여 형태', str(g.team)],
          ['맡은 역할', str(g.role)],
          ['제작 도구', tools.length ? [el('ul', { class: 'tool-list' }, tools.map((t) => el('li', { text: str(t) })))] : ''],
          ['제작 시기', periodOf(g)],
          ['엔진', str(g.engine)],
          ['장르', str(g.category)],
          ['상태', str(g.status)],
          ['미디어', mediaSummary(g)],
        ]),
      ]),
    ]);
    const related = games.filter((o) => o.id !== g.id && o.category && o.category === g.category).slice(0, 3);
    if (related.length) {
      aside.append(el('section', { class: 'info-panel related-panel' }, [
        el('h2', { text: '같은 장르의 게임' }),
        el('div', { class: 'related-list' }, related.map((o, i) => gameCard(o, { compact: true, index: i }))),
      ]));
    }

    detailContent.replaceChildren(header, el('div', { class: 'detail-layout' }, [main, aside]));
    watchRail($('#projectRail', detailContent));
    document.title = `${g.title} · ${BASE_TITLE}`;
  };

  const scrollToSection = (section) => {
    if (!section) return;
    section.scrollIntoView({ behavior: scrollBehavior(), block: 'start' });
    const h = $('h2', section);
    if (h) {
      if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
      h.focus({ preventScroll: true });
    }
  };

  if (detailContent) {
    detailContent.addEventListener('click', (e) => {
      const t = e.target;
      const thumb = t.closest('button.media-thumb');
      if (thumb) {
        openViewer(detailItems, Number(thumb.dataset.mediaIndex) || 0, thumb);
        return;
      }
      if (t.closest('[data-scroll-media]')) { scrollToSection($('#projectMedia', detailContent)); return; }
      if (t.closest('[data-scroll-about]')) { scrollToSection($('#projectAbout', detailContent)); return; }
      if (t.closest('[data-copy-link]')) {
        navigator.clipboard.writeText(location.href)
          .then(() => toast('이 게임의 링크를 복사했습니다.'))
          .catch(() => toast('링크를 복사하지 못했습니다. 주소창의 주소를 사용해 주세요.'));
      }
    });
  }

  /* ---------- routing: #home · #catalog · #notes · #p=<id> ---------- */
  let currentView = null;
  let lastHref = '';
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  const parseHash = (hash) => {
    const h = str(hash).replace(/^#/, '');
    if (!h || h === 'home') return { view: 'home' };
    if (h === 'catalog') return { view: 'catalog' };
    if (h === 'notes') return { view: 'home', section: 'notes' };
    if (h.startsWith('p=')) {
      let id = h.slice(2);
      try { id = decodeURIComponent(id); } catch (e) { /* keep raw */ }
      return { view: 'detail', id };
    }
    return null;
  };

  const focusHeading = (container) => {
    const h = container && $('h1, h2', container);
    if (!h) return;
    if (!h.hasAttribute('tabindex')) h.setAttribute('tabindex', '-1');
    h.focus({ preventScroll: true });
  };
  const jumpTo = (y) => {
    try { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); } catch (e) { window.scrollTo(0, y); }
  };
  const pauseVideos = () => {
    for (const v of $$('video')) if (!(viewer && viewer.contains(v))) v.pause();
  };
  const navLinks = () => $$('nav a[href^="#"]');

  const showView = (name) => {
    for (const [key, node] of Object.entries(views)) if (node) node.hidden = key !== name;
    const node = views[name];
    if (node) {
      node.classList.remove('is-entering');
      if (motionOn()) {
        void node.offsetWidth;
        node.classList.add('is-entering');
        const done = () => node.classList.remove('is-entering');
        node.addEventListener('animationend', done, { once: true });
        window.setTimeout(done, 900);
      }
    }
    currentView = name;
    body.dataset.view = name;
    html.dataset.view = name;
  };

  const render = (rawState, opts = {}) => {
    lastHref = location.href;
    let route = parseHash(location.hash);
    if (!route) {
      // Plain in-page anchor (e.g. skip link): keep the current view.
      if (currentView) return;
      route = { view: 'home' };
    }
    const st = rawState && typeof rawState === 'object' ? rawState : {};
    closeViewer(false);

    if (route.view === 'home') {
      state.q = '';
      state.cat = '';
    } else if (route.view === 'catalog') {
      state.q = typeof st.q === 'string' ? st.q : '';
      state.cat = validCat(st.cat);
    } else {
      if (typeof st.q === 'string') state.q = st.q;
      if ('cat' in st) state.cat = validCat(st.cat);
    }
    syncSearchUI();
    showView(route.view);
    if (route.view === 'catalog') renderCatalog();
    else if (route.view === 'detail') renderDetail(route.id);
    else document.title = BASE_TITLE;
    pauseVideos();

    const current = route.section === 'notes' ? '#notes' : route.view === 'detail' ? null : `#${route.view}`;
    for (const a of navLinks()) {
      if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    }

    const view = views[route.view];
    const restoring = !opts.fresh && typeof st.scroll === 'number';
    window.requestAnimationFrame(() => {
      if (restoring) {
        jumpTo(st.scroll);
        if (st.focusGame && view) {
          const root = (st.focusIn && document.getElementById(st.focusIn)) || view;
          const target = $(`[data-game="${CSS.escape(st.focusGame)}"]`, root) || $(`[data-game="${CSS.escape(st.focusGame)}"]`, view);
          if (target) target.focus({ preventScroll: true });
        } else if (route.view === 'detail' && views.detail) views.detail.focus({ preventScroll: true });
        return;
      }
      if (route.section === 'notes') {
        const notes = $('#notes');
        if (notes) {
          notes.scrollIntoView({ behavior: opts.fresh ? scrollBehavior() : 'auto', block: 'start' });
          if (opts.fresh) focusHeading(notes);
        }
        return;
      }
      if (opts.initial && route.view === 'home') return;
      jumpTo(0);
      if (route.view === 'detail' && views.detail) views.detail.focus({ preventScroll: true });
      else if (opts.focus) focusHeading(view);
    });
  };

  // Remember where the visitor was on the entry being left (scroll + card) for back/forward.
  const saveCurrentEntry = (focusGame, focusIn) => {
    try {
      history.replaceState({ ...(history.state || {}), app: true, q: state.q, cat: state.cat, scroll: window.scrollY, focusGame: focusGame || null, focusIn: focusIn || null }, '', location.href);
    } catch (e) { /* ignore */ }
  };

  const navigate = (hash, extra, opts = {}) => {
    saveCurrentEntry(opts.focusGame, opts.focusIn);
    const replace = opts.replace || hash === location.hash;
    const st = { app: true, q: state.q, cat: state.cat, from: currentView, ...extra };
    try {
      history[replace ? 'replaceState' : 'pushState'](st, '', hash);
    } catch (e) {
      location.hash = hash;
      return;
    }
    render(st, { fresh: true, focus: opts.focus });
  };

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    const route = parseHash(href);
    if (!route) return;
    e.preventDefault();
    if (viewer && viewer.contains(a)) closeViewer(false);
    if (route.view === 'detail') {
      const holder = a.parentElement && a.parentElement.closest('[id]');
      navigate(href, { from: currentView }, { focusGame: a.dataset.game || null, focusIn: holder ? holder.id : null });
    } else if (route.view === 'catalog') {
      navigate('#catalog', { q: '', cat: '' }, { focus: true });
    } else {
      navigate(route.section === 'notes' ? '#notes' : '#home', { q: '', cat: '' }, { focus: true });
    }
  });

  window.addEventListener('popstate', (e) => render(e.state));
  window.addEventListener('hashchange', () => {
    if (location.href !== lastHref) render(history.state);
  });

  if (detailBack) {
    detailBack.addEventListener('click', () => {
      const st = history.state;
      if (st && st.app && st.from) history.back();
      else navigate('#home', { q: '', cat: '' }, { focus: true });
    });
  }

  /* ---------- search input ---------- */
  const applyQuery = (q, submitted) => {
    state.q = q;
    syncSearchUI();
    if (currentView !== 'catalog') {
      if (!q.trim() && !submitted) return;
      navigate('#catalog', { q, cat: state.cat });
      return;
    }
    storeCatalogState();
    renderCatalog();
  };
  if (searchInput) searchInput.addEventListener('input', () => applyQuery(searchInput.value, false));
  if (searchForm) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      applyQuery(searchInput ? searchInput.value : '', true);
    });
  }
  if (searchClear) {
    searchClear.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      applyQuery('', false);
      if (searchInput) searchInput.focus();
    });
  }
  if (categoryFilters) {
    categoryFilters.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;
      state.cat = validCat(chip.dataset.category);
      storeCatalogState();
      renderCatalog();
    });
  }
  if (resetSearch) {
    resetSearch.addEventListener('click', () => {
      state.q = '';
      state.cat = '';
      syncSearchUI();
      storeCatalogState();
      renderCatalog();
      if (searchInput) searchInput.focus();
    });
  }

  render(history.state, { initial: true });
})();
