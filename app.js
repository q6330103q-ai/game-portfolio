(() => {
  'use strict';

  const data = window.PORTFOLIO;
  const html = document.documentElement;
  const body = document.body;
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const fineMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
  const MOTION_KEY = 'gp-motion';
  const AUTHOR = (data && typeof data.name === 'string' && data.name) || '김준식';
  const BASE_TITLE = document.title || '게임 포트폴리오';
  const ROTATE_MS = 9000; // showcase auto rotation (CSS bar reads --showcase-duration)
  const LEAVE_MS = 1100; // a leaving showcase scene stays rendered this long, then is hidden and unloaded
  const saveData = !!(navigator.connection && navigator.connection.saveData);
  if (saveData) html.dataset.saveData = '';

  const arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v) => (typeof v === 'string' ? v : v == null ? '' : String(v));
  const motionOn = () => html.dataset.motion !== 'off';
  const scrollBehavior = () => (motionOn() ? 'smooth' : 'auto');
  const hasIO = 'IntersectionObserver' in window;
  const focusVisible = (node) => {
    try { return !!node && node.matches(':focus-visible'); } catch (e) { return true; }
  };

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

  const ICONS = {
    prev: '<path d="M15 5l-7 7 7 7"/>',
    next: '<path d="M9 5l7 7-7 7"/>',
    pause: '<path d="M8 5v14M16 5v14"/>',
    play: '<path d="M7 5v14l12-7z" fill="currentColor" stroke="none"/>',
    arrow: '<path d="M4 12h15M13 6l6 6-6 6"/>',
    expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  };
  const icon = (name, cls = 'icon') => {
    const span = document.createElement('span');
    span.className = cls;
    span.setAttribute('aria-hidden', 'true');
    span.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" focusable="false" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="square">${ICONS[name]}</svg>`;
    return span;
  };

  // Shared mutable state (declared early: lifecycle hooks may run before every module exists).
  let currentView = null;
  let showcase = null;
  let reel = null;
  let detailLead = null;
  const viewer = $('#mediaViewer');
  const viewerOpen = () => !!(viewer && viewer.open);

  /* ---------- frame scheduler: one pending rAF, all reads before all writes ---------- */
  const frameJobs = new Set();
  let frameId = 0;
  const runFrame = () => {
    frameId = 0;
    const jobs = Array.from(frameJobs);
    frameJobs.clear();
    for (const job of jobs) if (job.read) job.read();
    for (const job of jobs) if (job.write) job.write();
  };
  const schedule = (job) => {
    frameJobs.add(job);
    if (!frameId) frameId = window.requestAnimationFrame(runFrame);
  };

  /* ---------- motion toggle: persisted choice, otherwise follows the OS setting ---------- */
  const motionBtn = $('#motionToggle');
  const motionLabel = motionBtn && $('.motion-toggle__label', motionBtn);
  const motionHooks = [];
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
    const was = motionOn();
    html.dataset.motion = on ? 'on' : 'off';
    if (persist) {
      try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch (e) { /* storage blocked: lasts this visit */ }
    }
    if (!on) revealAll();
    syncMotionButton();
    if (was !== on) for (const hook of motionHooks) hook(on);
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
  const revealIO = hasIO
    ? new IntersectionObserver((entries) => {
        let k = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t = entry.target;
          t.style.setProperty('--reveal-delay', `${Math.min(k, 5) * 60}ms`);
          k += 1;
          t.classList.add('is-visible');
          revealIO.unobserve(t);
        }
      }, { rootMargin: '0px 0px -6% 0px' })
    : null;
  const reveal = (node) => {
    node.setAttribute('data-reveal', '');
    if (revealIO && motionOn()) revealIO.observe(node);
    else node.classList.add('is-visible');
  };

  /* ---------- scroll progress: [data-scroll-progress] → --progress (0..1), cached geometry ---------- */
  const progressItems = new Map();
  let viewportH = window.innerHeight;
  const progressJob = {
    read() {
      const y = window.scrollY;
      for (const [node, rec] of progressItems) {
        if (!rec.visible) continue;
        if (rec.dirty) {
          const r = node.getBoundingClientRect();
          rec.top = r.top + y;
          rec.height = r.height;
          rec.dirty = false;
        }
        const span = rec.height - viewportH;
        const p = rec.mode === 'sticky' && span > 40
          ? (y - rec.top) / span
          : (y + viewportH - rec.top) / (rec.height + viewportH);
        rec.next = Math.min(1, Math.max(0, p));
      }
    },
    write() {
      if (!motionOn()) return;
      for (const [node, rec] of progressItems) {
        if (!rec.visible || rec.next == null || Math.abs(rec.next - rec.value) < 0.0005) continue;
        rec.value = rec.next;
        node.style.setProperty('--progress', rec.next.toFixed(4));
      }
    },
  };
  const progressVisible = () => {
    for (const rec of progressItems.values()) if (rec.visible) return true;
    return false;
  };
  const markProgressDirty = () => {
    for (const rec of progressItems.values()) rec.dirty = true;
    if (motionOn() && progressVisible()) schedule(progressJob);
  };
  const progressIO = hasIO
    ? new IntersectionObserver((entries) => {
        for (const entry of entries) {
          const rec = progressItems.get(entry.target);
          if (!rec) continue;
          rec.visible = entry.isIntersecting;
          rec.dirty = true;
        }
        if (motionOn()) schedule(progressJob);
      })
    : null;
  const sizeRO = 'ResizeObserver' in window ? new ResizeObserver(markProgressDirty) : null;
  if (sizeRO) sizeRO.observe(body);
  const trackProgress = (node, mode) => {
    if (!node || progressItems.has(node)) return;
    node.dataset.scrollProgress = mode;
    progressItems.set(node, { mode, visible: !progressIO, dirty: true, top: 0, height: 0, value: -1, next: null });
    if (progressIO) progressIO.observe(node);
    if (sizeRO) sizeRO.observe(node);
  };
  const clearProgress = () => {
    for (const [node, rec] of progressItems) {
      node.style.removeProperty('--progress');
      rec.value = -1;
    }
  };

  /* ---------- pointer tilt: [data-tilt] → --tilt-x/--tilt-y, fine mouse + motion on only ---------- */
  let tiltNode = null;
  let tiltX = 0;
  let tiltY = 0;
  let tiltNX = 0;
  let tiltNY = 0;
  const resetTilt = (node) => {
    node.style.removeProperty('--tilt-x');
    node.style.removeProperty('--tilt-y');
  };
  const tiltJob = {
    read() {
      if (!tiltNode) return;
      const r = tiltNode.getBoundingClientRect();
      tiltNX = r.width ? Math.max(-1, Math.min(1, ((tiltX - r.left) / r.width) * 2 - 1)) : 0;
      tiltNY = r.height ? Math.max(-1, Math.min(1, ((tiltY - r.top) / r.height) * 2 - 1)) : 0;
    },
    write() {
      if (!tiltNode || !motionOn()) return;
      tiltNode.style.setProperty('--tilt-x', tiltNX.toFixed(3));
      tiltNode.style.setProperty('--tilt-y', tiltNY.toFixed(3));
    },
  };
  const dropTilt = () => {
    if (tiltNode) resetTilt(tiltNode);
    tiltNode = null;
  };
  document.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    const t = motionOn() && fineMQ.matches && e.target.closest ? e.target.closest('[data-tilt]') : null;
    if (t !== tiltNode) {
      dropTilt();
      tiltNode = t;
    }
    if (!t) return;
    tiltX = e.clientX;
    tiltY = e.clientY;
    schedule(tiltJob);
  }, { passive: true });
  html.addEventListener('mouseleave', dropTilt);

  /* ---------- toast ---------- */
  const toastEl = $('#toast');
  let toastTimer = 0;
  const toast = (msg) => {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => { toastEl.hidden = true; }, 2600);
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
  const categories = [];
  for (const g of games) if (g.category && !categories.includes(g.category)) categories.push(g.category);

  const coverOf = (g) => {
    const img = arr(g.images).find((i) => i && i.src);
    if (img) return img;
    const vid = arr(g.videos).find((v) => v && v.poster);
    return vid ? { src: vid.poster, alt: vid.title || g.title, pos: null } : null;
  };
  const firstVideo = (g) => arr(g.videos).find((v) => v && v.src) || null;
  const shortStatus = (s) => str(s).split(' · ')[0];
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
  const mediaItemsOf = (g) => [
    ...arr(g.videos).filter((v) => v && v.src).map((v) => ({ kind: 'video', src: v.src, poster: v.poster || '', title: str(v.title), caption: str(v.caption), alt: str(v.title) })),
    ...arr(g.images).filter((i) => i && i.src).map((i) => ({ kind: 'image', src: i.src, alt: str(i.alt), caption: str(i.caption), pos: i.pos || null })),
  ];
  const itemCaption = (item) => (item.kind === 'video' ? [item.title, item.caption].filter(Boolean).join(' · ') : str(item.caption || item.alt));
  // Hero picks: first video, its poster, and two other real captures of the same game.
  const heroPick = (g) => {
    const video = firstVideo(g);
    const cover = coverOf(g);
    const poster = (video && video.poster) || (cover && cover.src) || '';
    const companions = arr(g.images).filter((i) => i && i.src && i.src !== poster).slice(0, 2);
    return { video, poster, companions };
  };

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
      if (!$('.media-error', container)) container.append(el('span', { class: 'media-error', text: '이미지를 불러오지 못했습니다' }));
    }, { once: true });
    return img;
  };
  const textCover = (g) => el('span', { class: 'text-cover', 'aria-hidden': 'true' }, [
    el('span', { class: 'text-cover__title', text: g.title }),
    el('span', { class: 'text-cover__label', text: '제작 기록' }),
  ]);

  // Muted looping clip with an honest state machine. src is only set when it should actually play.
  // state: idle | loading | playing | paused | blocked | error
  const loopVideo = ({ src, poster, label, cls, mount, onState }) => {
    let video = null;
    let state = 'idle';
    let token = 0;
    const set = (next) => {
      if (state === next) return;
      state = next;
      if (onState) onState(next);
    };
    const ensure = () => {
      if (video) return video;
      const v = document.createElement('video');
      v.className = cls;
      v.muted = true;
      v.defaultMuted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      v.setAttribute('loop', '');
      v.preload = 'none';
      if (poster) v.poster = poster;
      v.setAttribute('aria-label', label);
      v.addEventListener('playing', () => { if (v === video && v.getAttribute('src') && !v.paused) set('playing'); });
      v.addEventListener('waiting', () => { if (v === video && !v.paused) set('loading'); });
      v.addEventListener('pause', () => {
        if (v !== video || state === 'error' || state === 'blocked') return;
        set(v.getAttribute('src') ? 'paused' : 'idle');
      });
      v.addEventListener('error', () => {
        if (v !== video || !v.getAttribute('src')) return;
        token += 1;
        set('error');
      });
      video = v;
      mount(v);
      return v;
    };
    const api = {
      get state() { return state; },
      get node() { return video; },
      play() {
        if (state === 'error') return;
        const v = ensure();
        if (!v.getAttribute('src')) {
          v.preload = 'auto';
          v.src = src;
        }
        if (!v.paused && (state === 'playing' || state === 'loading')) return;
        const my = ++token;
        set('loading');
        let p = null;
        try { p = v.play(); } catch (err) { p = Promise.reject(err); }
        if (p && typeof p.then === 'function') {
          p.then(() => { if (my === token && v === video && !v.paused) set('playing'); })
            .catch((err) => {
              if (my !== token || v !== video) return;
              if (err && err.name === 'AbortError') return;
              set(v.error ? 'error' : 'blocked');
            });
        }
      },
      pause() {
        token += 1;
        if (video && !video.paused) video.pause();
        if (state !== 'error') set(video && video.getAttribute('src') ? 'paused' : 'idle');
      },
      unload() {
        token += 1;
        if (video) {
          video.pause();
          if (video.getAttribute('src')) {
            video.removeAttribute('src');
            video.load();
          }
        }
        if (state !== 'error') set('idle');
      },
      destroy() {
        api.unload();
        if (video) video.remove();
        video = null;
      },
    };
    return api;
  };

  /* ---------- lifecycle: one place decides which clip may play ---------- */
  function syncPlayback() {
    if (reel) reel.sync();
    if (showcase) showcase.sync();
    if (detailLead) detailLead.sync();
  }
  document.addEventListener('visibilitychange', syncPlayback);

  /* ---------- lightbox ---------- */
  const viewerContent = $('#viewerContent');
  const viewerCaption = $('#viewerCaption');
  const viewerCount = $('#viewerCount');
  const viewerPrev = $('#viewerPrev');
  const viewerNext = $('#viewerNext');
  const viewerClose = $('#viewerClose');
  let detailItems = [];
  let viewerItems = [];
  let viewerIndex = 0;
  let viewerOpenedAt = 0;
  let viewerReturn = null;
  let skipFocusRestore = false;
  let openingTimer = 0;

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
    if (viewerCaption) viewerCaption.textContent = itemCaption(item);
    if (viewerCount) viewerCount.textContent = `${viewerIndex + 1} / ${n}`;
    if (viewerPrev) viewerPrev.hidden = n < 2;
    if (viewerNext) viewerNext.hidden = n < 2;
    if (item.kind === 'video' && motionOn()) {
      const p = node.play && node.play();
      if (p && p.catch) p.catch(() => { /* autoplay refused: native controls remain */ });
    }
  };

  // Opening: carry the clicked picture into the viewer (FLIP, transform/opacity only); else CSS fade.
  const flipFrom = (source) => {
    if (!source || !motionOn() || typeof Element.prototype.animate !== 'function') return null;
    const r = source.getBoundingClientRect();
    return r.width > 8 && r.height > 8 ? r : null;
  };
  const playOpening = (from) => {
    if (!viewer) return;
    window.clearTimeout(openingTimer);
    if (!motionOn()) { delete viewer.dataset.opening; return; }
    const media = viewerContent && $('.viewer-media', viewerContent);
    viewer.dataset.opening = from && media ? 'flip' : 'fade';
    openingTimer = window.setTimeout(() => { delete viewer.dataset.opening; }, 760);
    if (!from || !media) return;
    const run = () => {
      if (!viewer.open || !media.isConnected) return;
      const to = media.getBoundingClientRect();
      if (to.width < 8 || to.height < 8) return;
      const s = Math.max(from.width / to.width, from.height / to.height);
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      media.animate([
        { transform: `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px) scale(${s.toFixed(4)})`, opacity: 0.4 },
        { transform: 'translate(0px, 0px) scale(1)', opacity: 1 },
      ], { duration: 620, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
    };
    if (media.tagName === 'IMG' && typeof media.decode === 'function') {
      Promise.race([media.decode(), new Promise((r) => window.setTimeout(r, 240))]).then(run, run);
    } else {
      window.requestAnimationFrame(run);
    }
  };

  const openViewer = (items, index, returnEl, sourceEl) => {
    if (!viewer || !items.length) return;
    const from = flipFrom(sourceEl);
    viewerItems = items;
    viewerReturn = returnEl || null;
    skipFocusRestore = false;
    showViewerItem(index, null);
    viewerOpenedAt = viewerIndex;
    if (!viewer.open) {
      if (typeof viewer.showModal === 'function') viewer.showModal();
      else viewer.setAttribute('open', '');
    }
    if (viewerClose) viewerClose.focus();
    playOpening(from);
    syncPlayback();
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
      window.clearTimeout(openingTimer);
      delete viewer.dataset.opening;
      syncPlayback();
      if (skipFocusRestore) { skipFocusRestore = false; return; }
      // Same item as opened → back to the opener; otherwise to the matching gallery thumb.
      const thumb = viewerItems === detailItems && views.detail ? $(`.media-thumb[data-media-index="${viewerIndex}"]`, views.detail) : null;
      const target = viewerIndex === viewerOpenedAt && viewerReturn && viewerReturn.isConnected ? viewerReturn : thumb || viewerReturn;
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

  /* ---------- showcase: final three as a cinematic stage ---------- */
  showcase = (() => {
    const root = $('#motionShowcase');
    const stage = $('#showcaseStage');
    const controls = $('#showcaseControls');
    if (!root || !stage) return null;
    if (!finals.length) {
      root.hidden = true;
      return null;
    }

    let active = -1;
    let leaving = null; // { s, timer }
    let inView = !hasIO;
    let focusHold = false;
    let userPaused = false;
    let manualPlay = false;
    let timer = 0;
    let timerStart = 0;
    let timerRunning = false;
    let remaining = ROTATE_MS;

    const sceneStateChanged = (s, st) => {
      s.node.dataset.video = st;
      s.errNote.hidden = st !== 'error';
      if (s === scenes[active]) syncStatus();
    };

    const buildScene = (g, i) => {
      const pick = heroPick(g);
      const v = pick.video;
      const node = el('div', { class: 'showcase-scene', 'data-game': g.id, 'data-index': String(i), 'data-video': 'idle' });
      const ambient = el('div', { class: 'showcase-ambient', 'aria-hidden': 'true' });
      const screen = el('div', { class: 'showcase-screen', 'data-tilt': '' });
      if (pick.poster) {
        const amb = makeImg(pick.poster, { alt: '', eager: i === 0 });
        amb.addEventListener('error', () => amb.remove(), { once: true });
        ambient.append(amb);
        const still = makeImg(pick.poster, { cls: 'showcase-still', alt: '', eager: i === 0 });
        if (i === 0) still.setAttribute('fetchpriority', 'high');
        setOrient(still, [node, screen]);
        still.addEventListener('error', () => {
          still.remove();
          screen.classList.add('is-broken');
          if (!$('.media-error', screen)) screen.append(el('span', { class: 'media-error', text: '이미지를 불러오지 못했습니다' }));
        }, { once: true });
        screen.append(still);
      } else {
        screen.append(textCover(g));
      }
      const playBtn = el('button', { type: 'button', class: 'showcase-play', hidden: true, 'aria-label': `${g.title} 영상 재생` }, [icon('play'), el('span', { class: 'showcase-play__label', text: '영상 재생' })]);
      const errNote = el('p', { class: 'showcase-error', hidden: true, text: '영상을 불러오지 못했습니다 · 정지 화면을 보여 드립니다' });
      screen.append(playBtn, errNote);

      const companion = (im, side) => {
        const fig = el('figure', { class: `showcase-companion showcase-companion--${side}` });
        const img = containerImg(fig, im.src, { cls: 'showcase-companion__img', alt: str(im.alt), pos: im.pos, eager: i === 0 }, g.title);
        fig.append(img);
        if (im.caption) fig.append(el('figcaption', { class: 'showcase-companion__caption', text: str(im.caption) }));
        return fig;
      };
      const visual = el('div', { class: 'showcase-visual' }, [
        pick.companions[0] ? companion(pick.companions[0], 'left') : null,
        screen,
        pick.companions[1] ? companion(pick.companions[1], 'right') : null,
      ]);

      const title = el('h2', { class: 'showcase-title' });
      str(g.title).trim().split(/\s+/).forEach((word, k) => {
        if (k) title.append(' ');
        const w = el('span', { class: 'showcase-word' }, [el('span', { class: 'showcase-word__inner', text: word })]);
        w.style.setProperty('--w', String(k));
        title.append(w);
      });
      const period = periodOf(g);
      const hasMedia = mediaItemsOf(g).length > 0;
      const copy = el('div', { class: 'showcase-copy' }, [
        title,
        g.subtitle ? el('p', { class: 'showcase-subtitle', text: str(g.subtitle) }) : null,
        el('p', { class: 'showcase-meta' }, [
          el('span', { class: 'showcase-meta__category', text: str(g.category) }),
          period ? ' ' : null,
          period ? el('span', { class: 'showcase-meta__period', text: period }) : null,
        ]),
        v && v.caption ? el('p', { class: 'showcase-caption', text: str(v.caption) }) : null,
        el('div', { class: 'showcase-actions' }, [
          el('a', { class: 'showcase-link', href: gameHref(g), 'data-game': g.id, 'aria-label': `${g.title} 작품 자세히` }, ['작품 자세히', icon('arrow', 'link-arrow')]),
          hasMedia ? el('button', { type: 'button', class: 'showcase-view', 'data-showcase-view': '' }, [icon('expand'), v ? '영상 크게 보기' : '화면 크게 보기']) : null,
        ]),
      ]);
      node.append(ambient, visual, copy);
      node.hidden = true;
      node.setAttribute('inert', '');

      const s = { g, i, node, screen, playBtn, errNote, pick, player: null };
      if (v) {
        s.player = loopVideo({
          src: v.src,
          poster: pick.poster,
          label: str(v.title) || g.title,
          cls: 'showcase-video',
          mount: (video) => {
            const still = $('.showcase-still', screen);
            if (still) still.after(video);
            else screen.prepend(video);
          },
          onState: (st) => sceneStateChanged(s, st),
        });
      }
      return s;
    };
    const scenes = finals.map(buildScene);

    // Controls
    const choices = scenes.map((s) => el('button', {
      type: 'button',
      class: 'showcase-choice',
      'data-showcase-index': String(s.i),
      'aria-pressed': 'false',
      'aria-controls': 'showcaseStage',
    }, [
      el('span', { class: 'showcase-choice__thumb', 'aria-hidden': 'true' }, s.pick.poster ? [makeImg(s.pick.poster, { alt: '' })] : []),
      el('span', { class: 'showcase-choice__title', text: s.g.title }),
      el('span', { class: 'showcase-choice__progress', 'aria-hidden': 'true' }, [el('span', { class: 'showcase-choice__bar' })]),
    ]));
    const prevBtn = el('button', { type: 'button', id: 'showcasePrev', class: 'showcase-btn showcase-btn--prev', 'aria-label': '이전 최종 프로젝트' }, [icon('prev')]);
    const nextBtn = el('button', { type: 'button', id: 'showcaseNext', class: 'showcase-btn showcase-btn--next', 'aria-label': '다음 최종 프로젝트' }, [icon('next')]);
    const countEl = el('p', { id: 'showcaseCount', class: 'showcase-count' });
    const pauseLabel = el('span', { class: 'showcase-btn__label' });
    const pauseIcon = el('span', { class: 'showcase-btn__icon', 'aria-hidden': 'true' });
    const pauseBtn = el('button', { type: 'button', id: 'showcasePause', class: 'showcase-btn showcase-btn--pause' }, [pauseIcon, pauseLabel]);
    const statusEl = el('span', { class: 'showcase-status' });
    if (controls) {
      controls.replaceChildren(
        el('div', { class: 'showcase-choices', role: 'group', 'aria-label': '최종 프로젝트 선택' }, choices),
        el('div', { class: 'showcase-transport' }, [prevBtn, countEl, nextBtn, pauseBtn, statusEl]),
        el('div', { class: 'showcase-progress', 'aria-hidden': 'true' }, [el('span', { class: 'showcase-progress__bar' })]),
      );
    }
    if (scenes.length < 2) {
      prevBtn.hidden = true;
      nextBtn.hidden = true;
    }
    stage.replaceChildren(...scenes.map((s) => s.node));
    root.style.setProperty('--showcase-duration', `${ROTATE_MS}ms`);
    trackProgress(root, 'sticky');

    const autoOK = () => motionOn() && !saveData && !userPaused;
    const wantVideo = () => autoOK() || manualPlay;
    const envOK = () => currentView === 'home' && !document.hidden && inView && !viewerOpen() && !(reel && reel.active());
    const canRotate = () => motionOn() && !userPaused && scenes.length > 1 && envOK() && !focusHold;

    const STATUS = {
      playing: '재생 중',
      loading: '불러오는 중',
      blocked: '자동 재생이 막혔습니다',
      error: '영상을 불러오지 못했습니다',
      paused: '일시정지됨',
      static: '정지 화면',
    };
    let lastPauseState = '';
    const syncStatus = () => {
      const s = scenes[active];
      const st = s && s.player ? s.player.state : 'none';
      let key;
      if (st === 'playing' || st === 'loading' || st === 'blocked' || st === 'error') key = st;
      else if (userPaused) key = 'paused';
      else if (!s || !s.player || !wantVideo()) key = 'static';
      else key = 'paused';
      root.dataset.playback = key;
      statusEl.textContent = STATUS[key];
      const clipMoving = st === 'playing' || st === 'loading';
      // The button pauses everything that moves here: the clip and the auto rotation.
      const moving = clipMoving || (motionOn() && !userPaused && scenes.length > 1);
      const next = moving ? 'playing' : 'paused';
      if (next !== lastPauseState) {
        lastPauseState = next;
        pauseBtn.dataset.state = next;
        pauseBtn.setAttribute('aria-label', moving ? '영상과 자동 전환 일시정지' : '영상과 자동 전환 재생');
        pauseLabel.textContent = moving ? '일시정지' : '재생';
        pauseIcon.replaceChildren(icon(moving ? 'pause' : 'play'));
      }
      for (const sc of scenes) {
        const scState = sc.player ? sc.player.state : 'none';
        sc.playBtn.hidden = !(sc === s && sc.player && scState !== 'playing' && scState !== 'loading' && scState !== 'error');
      }
    };

    const updateTimer = () => {
      if (canRotate()) {
        if (!timerRunning) {
          timerRunning = true;
          timerStart = performance.now();
          timer = window.setTimeout(tick, remaining);
        }
        root.dataset.timer = 'running';
      } else {
        if (timerRunning) {
          window.clearTimeout(timer);
          timer = 0;
          timerRunning = false;
          remaining = Math.max(0, remaining - (performance.now() - timerStart));
        }
        root.dataset.timer = motionOn() && !userPaused && scenes.length > 1 ? 'paused' : 'off';
      }
    };
    const resetTimer = (reflowDone) => {
      if (timerRunning) {
        window.clearTimeout(timer);
        timer = 0;
        timerRunning = false;
      }
      remaining = ROTATE_MS;
      if (!reflowDone) {
        root.classList.remove('is-timing');
        if (motionOn()) void root.offsetWidth;
      }
      if (motionOn()) root.classList.add('is-timing');
      updateTimer();
    };
    function tick() {
      timer = 0;
      timerRunning = false;
      remaining = ROTATE_MS;
      if (!canRotate()) { updateTimer(); return; }
      select(active + 1, 'next');
    }

    const retire = (s) => {
      s.node.classList.remove('is-leaving', 'is-active');
      s.node.hidden = true;
      s.node.setAttribute('inert', '');
      if (s.player) s.player.unload();
    };
    const finishLeave = () => {
      if (!leaving) return;
      const L = leaving;
      leaving = null;
      window.clearTimeout(L.timer);
      if (L.s !== scenes[active]) retire(L.s);
    };

    const sync = () => {
      const s = scenes[active];
      if (!s) return;
      const ok = envOK();
      if (s.player) {
        if (ok && wantVideo()) s.player.play();
        else s.player.pause();
      }
      if (leaving && (!ok || !motionOn())) finishLeave();
      updateTimer();
      syncStatus();
    };

    function select(index, dirHint, opts = {}) {
      const n = scenes.length;
      const nextIndex = ((index % n) + n) % n;
      if (nextIndex === active) {
        if (opts.user) resetTimer();
        return;
      }
      const prev = active >= 0 ? scenes[active] : null;
      const next = scenes[nextIndex];
      const dir = dirHint || (!prev || nextIndex > active ? 'next' : 'prev');
      const animate = !!prev && motionOn() && !opts.instant;
      const focused = prev && prev.node.contains(document.activeElement) ? document.activeElement : null;
      // At most one scene leaves at a time: an older wipe is finished at once (max two clips alive).
      if (leaving) {
        const L = leaving;
        leaving = null;
        window.clearTimeout(L.timer);
        if (L.s !== next) retire(L.s);
      }
      root.dataset.dir = dir;
      root.classList.remove('is-timing');
      next.node.dataset.dir = dir;
      next.node.hidden = false;
      next.node.removeAttribute('inert');
      next.node.classList.remove('is-leaving');
      if (prev) {
        prev.node.dataset.dir = dir;
        prev.node.classList.remove('is-active');
        prev.node.setAttribute('inert', '');
        if (animate) prev.node.classList.add('is-leaving');
      }
      // Animated: flush styles so the wipe starts from its initial state. Instant (first paint,
      // back-restore, motion off): hidden→active in one style pass, so nothing re-wipes.
      if (animate) void next.node.offsetWidth;
      next.node.classList.add('is-active');
      active = nextIndex;
      if (prev) {
        if (animate) leaving = { s: prev, timer: window.setTimeout(finishLeave, LEAVE_MS) };
        else retire(prev);
      }
      root.dataset.activeGame = next.g.id;
      root.dataset.activeIndex = String(nextIndex);
      choices.forEach((b, k) => b.setAttribute('aria-pressed', String(k === nextIndex)));
      countEl.textContent = `${nextIndex + 1} / ${n}`;
      if (focused) {
        const cls = focused.classList[0];
        const twin = cls ? $(`.${cls}`, next.node) : null;
        (twin || choices[nextIndex]).focus({ preventScroll: true });
      }
      resetTimer(animate);
      sync();
    }

    // Events
    choices.forEach((b, k) => b.addEventListener('click', () => select(k, null, { user: true })));
    prevBtn.addEventListener('click', () => select(active - 1, 'prev', { user: true }));
    nextBtn.addEventListener('click', () => select(active + 1, 'next', { user: true }));
    const manualStart = () => {
      userPaused = false;
      manualPlay = true;
      sync(); // play() runs inside the click: user activation unlocks blocked autoplay
    };
    pauseBtn.addEventListener('click', () => {
      if (pauseBtn.dataset.state === 'playing') {
        userPaused = true;
        manualPlay = false;
        sync();
      } else {
        manualStart();
        resetTimer();
      }
    });
    stage.addEventListener('click', (e) => {
      const s = scenes[active];
      if (!s) return;
      if (e.target.closest('.showcase-play')) {
        manualStart();
        return;
      }
      const view = e.target.closest('[data-showcase-view]');
      if (view) {
        const source = (s.player && s.player.node && s.player.state === 'playing' ? s.player.node : null) || $('.showcase-still', s.node);
        openViewer(mediaItemsOf(s.g), 0, view, source);
      }
    });
    root.addEventListener('focusin', (e) => {
      const hold = focusVisible(e.target);
      if (hold !== focusHold) {
        focusHold = hold;
        updateTimer();
      }
    });
    root.addEventListener('focusout', (e) => {
      if (e.relatedTarget && root.contains(e.relatedTarget)) return;
      if (focusHold) {
        focusHold = false;
        updateTimer();
      }
    });
    if (hasIO) {
      const watched = $('.motion-showcase__sticky', root) || stage;
      // Seed visibility now so the first paint doesn't flash a paused state before the IO reports.
      const r0 = watched.getBoundingClientRect();
      const vis0 = Math.min(r0.bottom, window.innerHeight) - Math.max(r0.top, 0);
      inView = r0.height > 0 && vis0 >= Math.min(r0.height, window.innerHeight) * 0.3;
      new IntersectionObserver((entries) => {
        const e = entries[entries.length - 1];
        const need = Math.min(e.boundingClientRect.height, window.innerHeight) * 0.3;
        const next = e.isIntersecting && e.intersectionRect.height >= need;
        if (next === inView) return;
        inView = next;
        sync();
      }, { threshold: [0, 0.1, 0.2, 0.3, 0.45, 0.6, 0.8, 1] }).observe(watched);
    }

    select(0, 'next', { instant: true });
    // Warm the other scenes' stills once the page settles, so a wipe never reveals an empty frame.
    const warm = () => $$('img[loading="lazy"]', stage).forEach((img) => { img.loading = 'eager'; });
    const idle = window.requestIdleCallback || ((fn) => window.setTimeout(fn, 400));
    if (document.readyState === 'complete') idle(warm);
    else window.addEventListener('load', () => idle(warm), { once: true });

    return {
      sync,
      reveal(gameId) {
        const k = scenes.findIndex((s) => s.g.id === gameId);
        if (k >= 0 && k !== active) select(k, null, { instant: true });
      },
      onMotion(on) {
        if (!on) {
          manualPlay = false;
          finishLeave();
          root.classList.remove('is-timing');
          sync();
        } else {
          resetTimer();
          sync();
        }
      },
    };
  })();

  /* ---------- filmstrip: representative clips, intent-only previews ---------- */
  reel = (() => {
    const track = $('#motionReelTrack');
    if (!track) return null;
    const section = $('#motionReel') || track.closest('section');
    const list = games.filter((g) => g.final !== true && g.featured && firstVideo(g)).slice(0, 5);
    if (!list.length) {
      if (section) section.hidden = true;
      return null;
    }

    let current = null; // { c, reason: hover|focus|click }
    let hoverTimer = 0;
    let visible = !hasIO;
    let geomDirty = true;
    let trackW = 0;
    let scrollX = 0;
    let lastPointer = 'mouse';
    let drag = null;
    let blockClick = false;

    const STATE_TEXT = { loading: '불러오는 중', playing: '미리보기 중', paused: '일시정지됨', blocked: '재생이 막혔습니다', error: '영상을 불러오지 못했습니다', idle: '' };
    const setUI = (c, st) => {
      c.node.dataset.preview = st;
      const on = st !== 'idle';
      c.btn.setAttribute('aria-pressed', String(on));
      c.btn.setAttribute('aria-label', `${c.g.title} ${on ? '미리보기 정지' : '미리보기'}`);
      c.btnLabel.textContent = on ? '미리보기 정지' : '미리보기';
      c.btnIcon.replaceChildren(icon(on ? 'pause' : 'play'));
      c.stateEl.textContent = STATE_TEXT[st] || '';
    };

    const cards = list.map((g, i) => {
      const v = firstVideo(g);
      const posterSrc = v.poster || (coverOf(g) || {}).src || '';
      const media = el('div', { class: 'reel-card__media' });
      if (posterSrc) media.append(containerImg(media, posterSrc, { cls: 'reel-card__poster', alt: '' }, g.title));
      else media.append(textCover(g));
      const stateEl = el('span', { class: 'reel-card__state', 'aria-hidden': 'true' });
      media.append(stateEl);
      const btnLabel = el('span', { class: 'reel-preview__label', text: '미리보기' });
      const btnIcon = el('span', { class: 'reel-preview__icon', 'aria-hidden': 'true' }, [icon('play')]);
      const btn = el('button', { type: 'button', class: 'reel-preview', 'data-preview-game': g.id, 'aria-pressed': 'false', 'aria-label': `${g.title} 미리보기` }, [btnIcon, btnLabel]);
      const link = el('a', { class: 'reel-card__link', href: gameHref(g), 'data-game': g.id, 'aria-label': `${g.title} 작품 자세히` }, ['작품 자세히', icon('arrow', 'link-arrow')]);
      const period = periodOf(g);
      const node = el('article', { class: 'reel-card', 'data-game': g.id, 'data-preview': 'idle' }, [
        media,
        el('div', { class: 'reel-card__body' }, [
          el('h3', { class: 'reel-card__title', text: g.title }),
          v.title ? el('p', { class: 'reel-card__clip', text: str(v.title) }) : null,
          v.caption ? el('p', { class: 'reel-card__caption', text: str(v.caption) }) : null,
          el('p', { class: 'reel-card__meta', text: [g.category, period].filter(Boolean).join(' · ') }),
          el('div', { class: 'reel-card__actions' }, [btn, link]),
        ]),
      ]);
      node.style.setProperty('--i', String(i));
      reveal(node);
      return { g, v, node, media, btn, btnLabel, btnIcon, stateEl, link, player: null, center: 0, off: null };
    });
    track.replaceChildren(...cards.map((c) => c.node));
    const cardOf = (node) => {
      const host = node && node.closest ? node.closest('.reel-card') : null;
      return host ? cards.find((c) => c.node === host) || null : null;
    };

    const envOK = () => currentView === 'home' && !document.hidden && !viewerOpen();
    let hoverCard = null;
    const stop = (silent) => {
      window.clearTimeout(hoverTimer);
      hoverCard = null;
      if (!current) return;
      const { c } = current;
      current = null;
      if (c.player) {
        c.player.destroy();
        c.player = null;
      }
      setUI(c, 'idle');
      if (!silent) syncPlayback();
    };
    const start = (c, reason) => {
      if (!envOK()) return;
      if (reason !== 'click' && !motionOn()) return;
      if (current && current.c === c) {
        if (reason === 'click') current.reason = 'click';
        return;
      }
      stop(true);
      current = { c, reason };
      c.player = loopVideo({
        src: c.v.src,
        poster: c.v.poster || '',
        label: `${str(c.v.title) || c.g.title} 미리보기`,
        cls: 'reel-card__video',
        mount: (video) => {
          const poster = $('.reel-card__poster', c.media);
          if (poster) poster.after(video);
          else c.media.prepend(video);
        },
        onState: (st) => { if (current && current.c === c) setUI(c, st === 'idle' ? 'loading' : st); },
      });
      setUI(c, 'loading');
      syncPlayback(); // hero yields before the preview starts: one moving clip on screen
      if (current && current.c === c && c.player) c.player.play();
    };

    // Intent: fine-pointer hover (short dwell after real movement), keyboard focus, or explicit button/tap.
    for (const c of cards) {
      c.node.addEventListener('pointermove', (e) => {
        if (e.pointerType !== 'mouse' || !fineMQ.matches || !motionOn() || drag) return;
        if (!e.movementX && !e.movementY) return; // page scrolled a card under a still pointer: not intent
        if (hoverCard === c || (current && current.c === c)) return;
        hoverCard = c;
        window.clearTimeout(hoverTimer);
        hoverTimer = window.setTimeout(() => {
          hoverCard = null;
          start(c, 'hover');
        }, 180);
      });
      c.node.addEventListener('pointerleave', (e) => {
        if (e.pointerType !== 'mouse') return;
        if (hoverCard === c) {
          window.clearTimeout(hoverTimer);
          hoverCard = null;
        }
        if (current && current.c === c && current.reason === 'hover') stop();
      });
      c.node.addEventListener('focusin', (e) => {
        if (!motionOn() || !focusVisible(e.target)) return;
        start(c, 'focus');
      });
      c.node.addEventListener('focusout', (e) => {
        if (e.relatedTarget && c.node.contains(e.relatedTarget)) return;
        if (current && current.c === c && current.reason === 'focus') stop();
      });
    }
    track.addEventListener('click', (e) => {
      if (!blockClick) return;
      e.preventDefault();
      e.stopPropagation();
    }, true);
    track.addEventListener('click', (e) => {
      const c = cardOf(e.target);
      if (!c) return;
      if (e.target.closest('.reel-preview')) {
        if (current && current.c === c) stop();
        else start(c, 'click');
        return;
      }
      if (!e.target.closest('.reel-card__media')) return;
      if (lastPointer === 'mouse') c.link.click();
      else if (current && current.c === c) stop();
      else start(c, 'click');
    });

    // Native horizontal scroll; mouse users can also drag the strip (snap resumes on release).
    track.addEventListener('pointerdown', (e) => {
      lastPointer = e.pointerType || 'mouse';
      if (e.pointerType !== 'mouse' || e.button !== 0) return;
      drag = { id: e.pointerId, x: e.clientX, left: track.scrollLeft, moved: false };
    });
    track.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved) {
        if (Math.abs(dx) < 6) return;
        drag.moved = true;
        track.dataset.dragging = '';
        window.clearTimeout(hoverTimer);
        hoverCard = null;
        try { track.setPointerCapture(e.pointerId); } catch (err) { /* ignore */ }
      }
      track.scrollLeft = drag.left - dx;
    });
    const endDrag = (e) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      const moved = drag.moved;
      drag = null;
      delete track.dataset.dragging;
      if (moved) {
        blockClick = true;
        window.setTimeout(() => { blockClick = false; }, 0);
      }
    };
    track.addEventListener('pointerup', endDrag);
    track.addEventListener('pointercancel', endDrag);
    track.addEventListener('lostpointercapture', endDrag);
    track.addEventListener('dragstart', (e) => e.preventDefault());

    // Lateral depth: --reel-offset per card (layout offsets, immune to the card transforms).
    const depthJob = {
      read() {
        if (geomDirty) {
          trackW = track.clientWidth;
          for (const c of cards) {
            const base = c.node.offsetParent === track ? 0 : track.offsetLeft + track.clientLeft;
            c.center = c.node.offsetLeft - base + c.node.offsetWidth / 2;
          }
          geomDirty = false;
        }
        scrollX = track.scrollLeft;
      },
      write() {
        if (!motionOn() || !visible) return;
        const half = trackW / 2 || 1;
        const mid = scrollX + half;
        let best = null;
        let bestD = Infinity;
        for (const c of cards) {
          const off = Math.max(-2, Math.min(2, (c.center - mid) / half));
          if (c.off == null || Math.abs(off - c.off) > 0.002) {
            c.off = off;
            c.node.style.setProperty('--reel-offset', off.toFixed(3));
          }
          if (Math.abs(off) < bestD) { bestD = Math.abs(off); best = c; }
        }
        for (const c of cards) c.node.classList.toggle('is-centered', c === best);
      },
    };
    const clearDepth = () => {
      for (const c of cards) {
        c.off = null;
        c.node.style.removeProperty('--reel-offset');
        c.node.classList.remove('is-centered');
      }
    };
    track.addEventListener('scroll', () => { if (visible && motionOn()) schedule(depthJob); }, { passive: true });
    if ('ResizeObserver' in window) new ResizeObserver(() => { geomDirty = true; if (visible && motionOn()) schedule(depthJob); }).observe(track);
    if (hasIO) {
      new IntersectionObserver((entries) => {
        visible = entries[entries.length - 1].isIntersecting;
        if (visible && motionOn()) { geomDirty = true; schedule(depthJob); }
      }).observe(track);
      // A preview stops once its card is mostly out of view (vertical or lateral).
      const cardIO = new IntersectionObserver((entries) => {
        for (const e of entries) {
          if (e.intersectionRatio < 0.35 && current && current.c.node === e.target) stop();
        }
      }, { threshold: [0, 0.35] });
      cards.forEach((c) => cardIO.observe(c.node));
    }
    watchRail(track);

    return {
      active: () => !!current,
      stop: () => stop(),
      sync() {
        if (!current) return;
        if (!envOK() || (!motionOn() && current.reason !== 'click')) stop(true);
      },
      resize() { geomDirty = true; if (visible && motionOn()) schedule(depthJob); },
      onMotion(on) {
        stop(true);
        if (!on) clearDepth();
        else { geomDirty = true; if (visible) schedule(depthJob); }
      },
    };
  })();

  /* ---------- home: chapters, archive, notes ---------- */
  const finalGrid = $('#finalGrid');
  const allGrid = $('#allGrid');
  const notesList = $('#notesList');

  // Chapter layers prefer captures the hero did not already show.
  const chapterImages = (g) => {
    const pick = heroPick(g);
    const used = new Set([pick.poster, ...pick.companions.map((c) => c.src)]);
    const imgs = arr(g.images).filter((i) => i && i.src);
    return [...imgs.filter((i) => !used.has(i.src)), ...imgs.filter((i) => used.has(i.src))].slice(0, 3);
  };
  const finalChapter = (g, i) => {
    const layers = chapterImages(g);
    const media = el('a', { class: 'final-chapter__media', href: gameHref(g), tabindex: '-1', 'aria-hidden': 'true', 'data-tilt': '' });
    const names = ['lead', 'back', 'front'];
    layers.forEach((im, k) => {
      const cls = `final-chapter__layer final-chapter__layer--${names[k]}`;
      if (k === 0) {
        media.append(containerImg(media, im.src, { cls, alt: '', pos: im.pos }, g.title));
      } else {
        const img = makeImg(im.src, { cls, alt: '', pos: im.pos });
        img.addEventListener('error', () => img.remove(), { once: true });
        media.append(img);
      }
    });
    if (!layers.length) media.append(textCover(g));
    const period = periodOf(g);
    const node = el('article', { class: 'final-chapter', 'data-game': g.id, 'data-index': String(i) }, [
      media,
      el('div', { class: 'final-chapter__body' }, [
        el('h3', { class: 'final-chapter__title', text: g.title }),
        g.subtitle ? el('p', { class: 'final-chapter__line', text: str(g.subtitle) }) : null,
        g.description ? el('p', { class: 'final-chapter__text', text: str(g.description) }) : null,
        el('p', { class: 'final-chapter__meta' }, [
          el('span', { text: str(g.category) }),
          period ? ' ' : null,
          period ? el('span', { text: period }) : null,
        ]),
        g.status ? el('p', { class: 'final-chapter__status', text: str(g.status) }) : null,
        el('a', { class: 'final-chapter__link', href: gameHref(g), 'data-game': g.id }, ['작품 자세히 보기', icon('arrow', 'link-arrow')]),
      ]),
    ]);
    node.style.setProperty('--i', String(i));
    reveal(node);
    trackProgress(node, 'travel');
    return node;
  };

  const workCard = (g, { compact = false, index = 0 } = {}) => {
    const c = coverOf(g);
    const kind = g.final === true ? 'final' : g.featured ? 'featured' : c ? 'media' : 'text';
    const media = el('span', { class: 'work-card__media' });
    if (c) media.append(containerImg(media, c.src, { cls: 'work-card__image', pos: c.pos }, g.title));
    else media.append(textCover(g));
    const status = shortStatus(g.status);
    const card = el('a', {
      class: `work-card work-card--${kind}${compact ? ' work-card--compact' : ''}`,
      href: gameHref(g),
      'data-game': g.id,
      'data-id': g.id,
    }, [
      media,
      el('span', { class: 'work-card__body' }, [
        el('h3', { class: 'work-card__title', text: g.title }),
        el('span', { class: 'work-card__meta', text: [g.category, g.engine, periodOf(g)].filter(Boolean).join(' · ') }),
        status ? el('span', { class: 'work-card__note', text: status, title: str(g.status) }) : null,
        el('span', { class: 'work-card__count', text: mediaSummary(g) }),
      ]),
    ]);
    card.style.setProperty('--i', String(index));
    reveal(card);
    return card;
  };

  if (finalGrid) finalGrid.replaceChildren(...finals.map((g, i) => finalChapter(g, i)));
  if (allGrid) allGrid.replaceChildren(...games.map((g, i) => workCard(g, { index: i })));
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
  const catalogCards = new Map(games.map((g, i) => [g.id, workCard(g, { index: i })]));

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
    let title = '전체 작품';
    if (q) title = `‘${q}’ 검색 결과`;
    else if (state.cat) title = catLabel(state.cat);
    if (catalogTitle) catalogTitle.textContent = title;
    if (resultCount) {
      const parts = [`${list.length}개 작품`];
      if (q && state.cat) parts.push(`${catLabel(state.cat)} 필터 적용`);
      if (q || state.cat) parts.push(`전체 ${games.length}개 중`);
      resultCount.textContent = parts.join(' · ');
    }
    document.title = `${title} · ${BASE_TITLE}`;
  };

  const storeCatalogState = () => {
    try { history.replaceState({ ...(history.state || {}), app: true, q: state.q, cat: state.cat }, '', location.href); } catch (e) { /* ignore */ }
  };

  /* ---------- detail: cinematic case study ---------- */
  const detailContent = $('#detailContent');
  const detailBack = $('#detailBack');
  const canCopy = !!(navigator.clipboard && navigator.clipboard.writeText && window.isSecureContext);

  const infoList = (rows) => el('dl', { class: 'info-list' }, rows.filter((r) => r && r[1] != null && r[1] !== '').map(([dt, dd]) => el('div', {}, [
    el('dt', { text: dt }),
    typeof dd === 'string' ? el('dd', { text: dd }) : el('dd', {}, dd),
  ])));

  const detailMissing = (id) => el('div', { class: 'detail-missing' }, [
    el('h1', { class: 'detail-title', text: '작품을 찾을 수 없습니다' }),
    el('p', { text: `주소의 작품 ID ‘${id}’와 일치하는 프로젝트가 없습니다. 전체 작품 목록에서 다시 찾아 주세요.` }),
    el('div', { class: 'detail-actions' }, [
      el('a', { class: 'case-button', href: '#catalog', text: '작품 목록 보기' }),
      el('a', { class: 'case-button case-button--quiet', href: '#home', text: '처음으로' }),
    ]),
  ]);

  // Large lead: poster still; the clip plays inline only on explicit request (no autoplay downloads).
  const buildLead = (g, items, header) => {
    const vItem = items.find((m) => m.kind === 'video') || null;
    const iItem = items.find((m) => m.kind === 'image') || null;
    const leadItem = vItem || iItem;
    if (!leadItem) return null;
    const media = el('div', { class: 'case-hero__media', 'data-video': vItem ? 'idle' : null });
    const stillSrc = vItem ? vItem.poster || (iItem && iItem.src) : iItem.src;
    if (stillSrc) {
      const still = makeImg(stillSrc, { cls: 'case-hero__still', alt: vItem ? '' : iItem.alt, pos: vItem ? null : iItem.pos, eager: true });
      still.setAttribute('fetchpriority', 'high');
      setOrient(still, [media, header]);
      still.addEventListener('error', () => {
        still.remove();
        media.classList.add('is-broken');
        media.append(el('span', { class: 'media-error', text: '이미지를 불러오지 못했습니다' }));
      }, { once: true });
      media.append(still);
    }
    const lead = { media, player: null, manual: false, inView: !hasIO, io: null };
    const controls = el('div', { class: 'case-hero__controls' });
    let toggle = null;
    let toggleLabel = null;
    let toggleIcon = null;
    const syncToggle = () => {
      if (!toggle) return;
      const st = lead.player.state;
      const moving = st === 'playing' || st === 'loading';
      toggle.dataset.state = moving ? 'playing' : 'paused';
      toggleLabel.textContent = moving ? '일시정지' : st === 'error' ? '영상을 불러오지 못했습니다' : '영상 재생';
      toggleIcon.replaceChildren(icon(moving ? 'pause' : 'play'));
      toggle.disabled = st === 'error';
    };
    if (vItem) {
      lead.player = loopVideo({
        src: vItem.src,
        poster: vItem.poster,
        label: vItem.title || g.title,
        cls: 'case-hero__video',
        mount: (video) => {
          const still = $('.case-hero__still', media);
          if (still) still.after(video);
          else media.prepend(video);
        },
        onState: (st) => {
          media.dataset.video = st;
          syncToggle();
        },
      });
      toggleLabel = el('span', { class: 'case-hero__toggle-label', text: '영상 재생' });
      toggleIcon = el('span', { class: 'case-hero__toggle-icon', 'aria-hidden': 'true' }, [icon('play')]);
      toggle = el('button', { type: 'button', class: 'case-hero__toggle', 'data-state': 'paused' }, [toggleIcon, toggleLabel]);
      toggle.addEventListener('click', () => {
        const st = lead.player.state;
        lead.manual = !(st === 'playing' || st === 'loading');
        lead.sync();
      });
      controls.append(toggle);
    }
    controls.append(el('button', { type: 'button', class: 'case-hero__open', 'data-media-index': String(items.indexOf(leadItem)) }, [icon('expand'), '크게 보기']));
    media.append(controls);
    const cap = itemCaption(leadItem);
    if (cap) media.append(el('p', { class: 'case-hero__caption', text: cap }));

    lead.sync = () => {
      if (!lead.player) return;
      const ok = lead.manual && currentView === 'detail' && !document.hidden && lead.inView && !viewerOpen();
      if (ok) lead.player.play();
      else lead.player.pause();
    };
    lead.destroy = () => {
      if (lead.io) lead.io.disconnect();
      if (lead.player) lead.player.destroy();
    };
    if (vItem && hasIO) {
      lead.io = new IntersectionObserver((entries) => {
        lead.inView = entries[entries.length - 1].isIntersecting;
        lead.sync();
      }, { threshold: 0.2 });
      lead.io.observe(media);
    }
    return lead;
  };

  const mediaSection = (g, items) => {
    const head = el('div', { class: 'section-head' }, [el('h2', { text: '영상과 스크린샷', tabindex: '-1' })]);
    const section = el('section', { class: 'detail-media', id: 'projectMedia' }, [head]);
    if (!items.length) {
      section.append(el('p', { class: 'no-media-note', text: '이 프로젝트는 공개할 실행 화면이나 영상을 확보하지 못했습니다. 대신 위의 게임 소개와 아래 제작 기록에 남은 내용을 정리했습니다.' }));
      return section;
    }
    const rail = el('div', { class: 'screenshot-rail', id: 'projectRail', role: 'list' });
    items.forEach((item, i) => {
      const figure = el('figure', { class: 'media-item', role: 'listitem' });
      const label = item.kind === 'video' ? `영상 열기: ${item.title || g.title}` : `크게 보기: ${item.alt || item.caption || g.title}`;
      const btn = el('button', { type: 'button', class: item.kind === 'video' ? 'media-thumb media-thumb--video' : 'media-thumb', 'data-media-index': String(i), 'aria-label': label });
      const thumbSrc = item.kind === 'video' ? item.poster : item.src;
      if (thumbSrc) {
        btn.append(containerImg(btn, thumbSrc, { alt: '', pos: item.pos, eager: i < 2 }, g.title, [figure]));
      } else {
        btn.append(textCover(g));
      }
      if (item.kind === 'video') btn.append(el('span', { class: 'video-label', text: '영상' }));
      const capText = itemCaption(item);
      figure.append(btn);
      if (capText) figure.append(el('figcaption', { class: 'media-caption', text: capText }));
      rail.append(figure);
    });
    if (items.length > 1) {
      head.append(el('div', { class: 'rail-nav' }, [
        el('button', { type: 'button', class: 'rail-button', 'data-rail-target': 'projectRail', 'data-rail-dir': '-1', 'data-rail-auto': '', 'aria-label': '이전 화면들', hidden: true }, [icon('prev')]),
        el('button', { type: 'button', class: 'rail-button', 'data-rail-target': 'projectRail', 'data-rail-dir': '1', 'data-rail-auto': '', 'aria-label': '다음 화면들', hidden: true }, [icon('next')]),
      ]));
    }
    section.append(rail);
    return section;
  };

  const dropDetailLead = () => {
    if (!detailLead) return;
    detailLead.destroy();
    detailLead = null;
  };

  const renderDetail = (id) => {
    if (!detailContent) return;
    dropDetailLead();
    const g = byId.get(id);
    detailItems = [];
    if (!g) {
      detailContent.replaceChildren(detailMissing(id));
      document.title = `작품을 찾을 수 없습니다 · ${BASE_TITLE}`;
      return;
    }
    const items = mediaItemsOf(g);
    detailItems = items;
    const hasVideo = items.some((m) => m.kind === 'video');

    const header = el('header', { class: items.length ? 'case-hero' : 'case-hero case-hero--dossier' });
    const lead = buildLead(g, items, header);
    const metaParts = g.final === true ? ['최종 프로젝트', g.category, g.engine, periodOf(g)] : [g.category, g.engine, periodOf(g)];
    const author = g.team ? `${AUTHOR} 참여 · ${g.team}` : AUTHOR;
    const actions = el('div', { class: 'detail-actions' }, [
      items.length
        ? el('button', { type: 'button', class: 'case-button', 'data-scroll-media': '' }, [hasVideo ? '영상·화면 모두 보기' : '화면 모두 보기'])
        : el('button', { type: 'button', class: 'case-button', 'data-scroll-about': '' }, ['제작 기록 읽기']),
      canCopy ? el('button', { type: 'button', class: 'case-button case-button--quiet', 'data-copy-link': '', text: '링크 복사' }) : null,
    ]);
    if (lead) header.append(lead.media);
    header.append(
      el('div', { class: 'case-hero__copy' }, [
        el('h1', { class: 'detail-title', text: g.title }),
        el('p', { class: 'case-meta', text: metaParts.filter(Boolean).map(str).join(' · ') }),
        g.subtitle ? el('p', { class: 'detail-subtitle', text: str(g.subtitle) }) : null,
        el('p', { class: 'detail-author', text: author }),
        g.status ? el('p', { class: 'detail-status' }, [el('span', { class: 'detail-status__label', text: '상태' }), ` ${str(g.status)}`]) : null,
        actions,
      ]),
    );

    const about = el('section', { class: 'case-about', id: 'projectAbout' }, [
      el('h2', { text: '게임 소개', tabindex: '-1' }),
      el('p', { class: 'case-lede', text: str(g.description) }),
    ]);
    const details = arr(g.details).filter((d) => d && (d.title || d.text));
    if (details.length) {
      about.append(el('div', { class: 'detail-sections' }, details.map((d) => el('section', { class: 'detail-section' }, [
        el('h3', { text: str(d.title) }),
        el('p', { text: str(d.text) }),
      ]))));
    }

    const caseBody = el('div', { class: 'case-body' }, [about, mediaSection(g, items)]);
    const features = arr(g.features).filter(Boolean);
    if (features.length) caseBody.append(el('section', { class: 'detail-features' }, [el('h2', { text: '주요 기능' }), el('ul', {}, features.map((f) => el('li', { text: str(f) })))]));
    const historyList = arr(g.history).filter(Boolean);
    if (historyList.length) caseBody.append(el('section', { class: 'detail-history' }, [el('h2', { text: '개발 기록' }), el('ol', {}, historyList.map((h) => el('li', { text: str(h) })))]));

    const tools = arr(g.tools).filter(Boolean);
    caseBody.append(el('aside', { class: 'case-credits', 'aria-label': '프로젝트 정보' }, [
      el('h2', { text: '크레디트' }),
      infoList([
        ['참여 형태', str(g.team)],
        ['맡은 역할', str(g.role)],
        ['제작 도구', tools.length ? [el('ul', { class: 'tool-list' }, tools.map((t) => el('li', { text: str(t) })))] : ''],
        ['제작 시기', periodOf(g)],
        ['엔진', str(g.engine)],
        ['장르', str(g.category)],
        ['상태', str(g.status)],
        ['미디어', mediaSummary(g)],
      ]),
    ]));

    const pos = games.indexOf(g);
    const nextGame = games[(pos + 1) % games.length];
    const related = games.filter((o) => o.id !== g.id && o.category && o.category === g.category).slice(0, 3);
    const next = el('nav', { class: 'case-next', 'aria-label': '다른 작품' }, [
      related.length ? el('section', { class: 'related-panel' }, [
        el('h2', { text: '같은 장르의 작품' }),
        el('div', { class: 'related-list' }, related.map((o, i) => workCard(o, { compact: true, index: i }))),
      ]) : null,
      nextGame && nextGame !== g ? el('a', { class: 'case-next__link', href: gameHref(nextGame), 'data-game': nextGame.id }, [
        el('span', { class: 'case-next__label', text: '다음 작품' }),
        el('span', { class: 'case-next__title', text: nextGame.title }),
        icon('arrow', 'link-arrow'),
      ]) : null,
    ]);

    detailContent.replaceChildren(header, caseBody, next);
    detailLead = lead && lead.player ? lead : null;
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
      const opener = t.closest('button.media-thumb, button.case-hero__open');
      if (opener) {
        const source = opener.classList.contains('case-hero__open')
          ? (detailLead && detailLead.player.state === 'playing' && detailLead.player.node) || $('.case-hero__still', detailContent)
          : $('img', opener);
        openViewer(detailItems, Number(opener.dataset.mediaIndex) || 0, opener, source);
        return;
      }
      if (t.closest('[data-scroll-media]')) { scrollToSection($('#projectMedia', detailContent)); return; }
      if (t.closest('[data-scroll-about]')) { scrollToSection($('#projectAbout', detailContent)); return; }
      if (t.closest('[data-copy-link]')) {
        navigator.clipboard.writeText(location.href)
          .then(() => toast('이 작품의 링크를 복사했습니다.'))
          .catch(() => toast('링크를 복사하지 못했습니다. 주소창의 주소를 사용해 주세요.'));
      }
    });
  }

  /* ---------- motion changes reach every module ---------- */
  motionHooks.push((on) => {
    if (!on) {
      clearProgress();
      dropTilt();
    } else {
      markProgressDirty();
    }
    if (showcase) showcase.onMotion(on);
    if (reel) reel.onMotion(on);
    syncPlayback();
  });

  let resizeRaf = 0;
  window.addEventListener('resize', () => {
    viewportH = window.innerHeight;
    if (resizeRaf) return;
    resizeRaf = window.requestAnimationFrame(() => {
      resizeRaf = 0;
      $$('[data-rail-target]').map((b) => document.getElementById(b.dataset.railTarget)).forEach(updateRail);
      markProgressDirty();
      if (reel) reel.resize();
    });
  });
  window.addEventListener('scroll', () => {
    if (motionOn() && progressVisible()) schedule(progressJob);
  }, { passive: true });

  /* ---------- routing: #home · #catalog · #notes · #p=<id> ---------- */
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
    if (route.view !== 'detail') dropDetailLead();
    showView(route.view);
    if (route.view === 'catalog') renderCatalog();
    else if (route.view === 'detail') renderDetail(route.id);
    else document.title = BASE_TITLE;
    syncPlayback();
    if (route.view === 'home') markProgressDirty();

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
          if (st.focusIn === 'showcaseStage' && showcase) showcase.reveal(st.focusGame);
          const root = (st.focusIn && document.getElementById(st.focusIn)) || view;
          const sel = `a[data-game="${CSS.escape(st.focusGame)}"]:not([tabindex="-1"])`;
          const target = $(sel, root) || $(sel, view);
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
