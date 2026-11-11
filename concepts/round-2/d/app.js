/* 시안 D · 크리에이터 노트 — behaviour
   Final-project index tabs that keep the reader's place, an archive contents page with a preview plate,
   and one detail sheet for every work. Data: window.PORTFOLIO from ../../../games.js. */
(() => {
  'use strict';

  const MEDIA = '../../../';
  const FINALS = ['necro-climb', 'football-director', 'mallang-shelter'];
  const DIMS = {'necro-guardian.webp':[540,1170],'necro-title.webp':[720,1280],'necro-battle.webp':[540,1170],'necro-build.webp':[540,1170],'necro-upgrade.webp':[540,1170],'necro-map.webp':[540,1170],'necro-relic.webp':[540,1170],'necro-2d-prototype.webp':[1280,720],'hanbit-clash.webp':[1280,720],'hanbit-match.webp':[1280,720],'hanbit-cutin.webp':[1280,720],'hanbit-skills.webp':[1600,976],'hanbit-transfer.webp':[1280,720],'hanbit-lineup.webp':[1280,720],'mallang-sharing.webp':[540,960],'mallang-room.webp':[540,960],'mallang-eating.webp':[540,960],'mallang-help.webp':[540,960],'mallang-details.webp':[540,960],'pixel-frontier-guardian.webp':[1600,900],'pixel-frontier-deploy.webp':[1600,900],'pixel-frontier-golem.webp':[1600,900],'pixel-frontier-buildings.webp':[1600,900],'pixel-frontier-roulette.webp':[1600,900],'pixel-frontier-title.webp':[1600,900],'pixel-frontier-qa-army.webp':[1280,720],'pixel-frontier-prototype.webp':[1600,900],'greed-attack.webp':[1600,900],'greed-title.webp':[1600,900],'greed-gate.webp':[1600,900],'greed-boss.webp':[1600,900],'greed-workbench.webp':[1600,900],'greed-city.webp':[1600,900],'greed-early-absorb.webp':[1600,1000],'last-combat.webp':[1280,720],'last-armor.webp':[1280,720],'lucky-play.webp':[1280,720],'lucky-title.webp':[1280,720],'lucky-growth.webp':[1280,720],'alkkagi-aim.webp':[731,404],'alkkagi-growth.webp':[731,404],'alkkagi-end.webp':[731,404],'threemin-boss.webp':[1600,1000],'threemin-title.webp':[1600,1000],'threemin-companion.webp':[1600,1000],'threemin-puzzle.webp':[1600,1000],'threemin-forge.webp':[1600,1000],'threemin-boss-arena.webp':[1600,1000],'threemin-clear.webp':[1600,1000],'rift-gameplay.webp':[1600,900],'rift-title.webp':[1600,900],'lumi-raptor.webp':[1600,900],'lumi-start.webp':[1600,900],'lumi-night.webp':[1600,900],'lumi-evolution.webp':[1600,900],'lumi3d-forest.webp':[1280,720],'lumi3d-evolution.webp':[1280,720],'verdict-hallway.webp':[1600,1000],'verdict-title.webp':[1600,1000],'verdict-lobby.webp':[1600,1000],'verdict-room.webp':[1600,1000],'last-verdict.webp':[1600,900],'mukbot-day1.webp':[1600,942],'mukbot-collect.webp':[1600,942],'mukbot-charge.webp':[1600,942],'mukbot-ghost.webp':[1600,942],'wall-breaker-upgrade.webp':[1280,400],'wall-breaker-arc.webp':[1280,400],'wall-breaker-ultimate.webp':[1280,400],'wall-breaker-skins.webp':[1280,400],'snow-leopard-walk.webp':[360,360],'snow-leopard-tail.webp':[360,360],'snow-leopard-run.webp':[360,360],'snow-leopard-chat.webp':[780,600],'star-guardian-combat.webp':[1440,900],'star-guardian-shooting.webp':[1440,900],'star-guardian-levelup.webp':[1440,900],'star-guardian-dragon.webp':[1600,900],'star-guardian-yeti.webp':[1600,900],'star-guardian-clear.webp':[1600,900],'adrift-deck.webp':[1016,640],'adrift-scoop.webp':[1016,640],'adrift-ocean.webp':[1016,640],'adrift-editor.webp':[1280,770],'seongrim-foxfire.webp':[1280,720],'seongrim-burst.webp':[1280,720],'seongrim-gate.webp':[1400,900],'tom-jerry.webp':[1280,800],'seongrim-village-render.webp':[1600,1000],'football-match.webp':[1600,900],'football-career.webp':[1280,800],'football-thunder.webp':[768,512],'dungeon.webp':[738,1600],'arena-unreal.webp':[1600,900],'aurora.webp':[1440,900],'mafia.webp':[1440,900],'arena-fate.webp':[1600,900],'dice-combat.webp':[738,1600],'dice-menu.webp':[540,1170],'pixel-frontier-cinematic.webp':[1280,720]};

  const doc = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const arr = (v) => (Array.isArray(v) ? v : []);
  const str = (v) => (v == null ? '' : String(v));
  const url = (p) => MEDIA + str(p);
  const dimsOf = (p) => DIMS[str(p).replace(/^media\//, '')] || null;
  const ratioOf = (p, fallback) => { const d = dimsOf(p); return d ? d[0] / d[1] : (fallback || 16 / 9); };
  const periodOf = (g) => str(g.period) || (g.year ? `${g.year}년` : '');
  const motionOn = () => doc.getAttribute('data-motion') === 'on';
  const canVT = () => motionOn() && typeof document.startViewTransition === 'function' && !matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isNarrow = () => matchMedia('(max-width: 1199px)').matches;

  const ICONS = {
    play: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5v9l8-4.5z" fill="currentColor"/></svg>',
    pause: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 1.5h2.6v9H2.5zM6.9 1.5h2.6v9H6.9z" fill="currentColor"/></svg>',
    plus: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M6 0h2v14H6zM0 6h14v2H0z" fill="currentColor"/></svg>',
  };
  const icon = (name) => {
    const t = document.createElement('template');
    t.innerHTML = ICONS[name];
    return t.content.firstChild;
  };

  function el(tag, attrs, kids) {
    const node = document.createElement(tag);
    if (attrs) {
      for (const [k, v] of Object.entries(attrs)) {
        if (v == null || v === false) continue;
        if (k === 'class') node.className = v;
        else if (k === 'text') node.textContent = v;
        else if (k === 'style') node.setAttribute('style', v);
        else if (k.startsWith('on')) node.addEventListener(k.slice(2), v);
        else if (v === true) node.setAttribute(k, '');
        else node.setAttribute(k, String(v));
      }
    }
    for (const kid of [].concat(kids || [])) {
      if (kid == null || kid === false) continue;
      node.append(kid instanceof Node ? kid : document.createTextNode(String(kid)));
    }
    return node;
  }

  const sheet = $('#sheet');
  const D = window.PORTFOLIO;
  if (!D || !Array.isArray(D.games) || !D.games.length) {
    const err = $('#dataError');
    if (err) err.hidden = false;
    return;
  }
  const GAMES = D.games;
  const byId = Object.fromEntries(GAMES.map((g) => [g.id, g]));

  /* All media of a work, videos first: the moving record is the strongest proof. */
  function mediaOf(g) {
    return [
      ...arr(g.videos).map((v) => ({ kind: 'video', src: v.src, poster: v.poster, title: str(v.title), caption: str(v.caption), alt: str(v.title) })),
      ...arr(g.images).map((i) => ({ kind: 'image', src: i.src, alt: str(i.alt), caption: str(i.caption), pos: i.pos })),
    ];
  }
  const stillOf = (item) => (item.kind === 'video' ? item.poster : item.src);

  function factsList(g, opts) {
    const rows = [
      ['상태', str(g.status), 'status'],
      ['맡은 역할', str(g.role)],
      ['참여 형태', str(g.team)],
      ['장르', str(g.category)],
      ['제작 시기', periodOf(g)],
      ['엔진', str(g.engine)],
    ];
    if (opts && opts.tools && arr(g.tools).length) rows.push(['제작 도구', arr(g.tools).join(', ')]);
    return el('dl', { class: 'facts' }, rows.filter((r) => r[1]).map(([k, v, mod]) =>
      el('div', { class: mod ? `facts__row facts__row--${mod}` : 'facts__row' }, [el('dt', { text: k }), el('dd', { text: v })])));
  }

  /* ---------- Motion toggle ---------- */
  const motionBtn = $('#motionToggle');
  motionBtn.removeAttribute('aria-pressed');
  function syncMotion() {
    motionBtn.textContent = motionOn() ? '모션 끄기' : '모션 켜기';
  }
  motionBtn.addEventListener('click', () => {
    const next = motionOn() ? 'off' : 'on';
    doc.setAttribute('data-motion', next);
    try { localStorage.setItem('gp-d-motion', next); } catch (e) { /* storage unavailable */ }
    $$('[data-reveal]').forEach((n) => n.classList.add('is-in'));
    syncMotion();
    updatePlateVideo();
  });
  syncMotion();

  /* ---------- Spread: plates and concise copy ---------- */
  const platesEl = $('#plates');
  const copyEl = $('#spreadCopy');
  const caseBody = $('#caseBody');
  const caseTitle = $('#caseTitle');
  const project = $('#project');
  let current = FINALS[0];
  try {
    const saved = sessionStorage.getItem('gp-d-final');
    if (FINALS.includes(saved)) current = saved;
  } catch (e) { /* storage unavailable */ }

  let plateVideo = null;
  let plateIntent = null; // null = follow motion setting, 'play' | 'pause' = the visitor decided
  let plateVisible = true;
  const openFolds = new Set();

  function plateSet(g) {
    const items = mediaOf(g);
    const video = items.find((i) => i.kind === 'video');
    const images = items.filter((i) => i.kind === 'image');
    const main = video || images[0];
    const mainStill = main ? stillOf(main) : '';
    const orient = ratioOf(mainStill) < 1 ? 'portrait' : 'landscape';
    const rest = images.filter((i) => i.src !== mainStill);
    const sides = rest.slice(0, orient === 'portrait' ? 1 : 2);
    return { items, main, sides, orient };
  }

  function mainPlate(g, item, items) {
    const ar = ratioOf(stillOf(item), 9 / 16);
    const frame = el('div', { class: 'plate__frame', style: `--ar:${ar}` });
    let cap;
    if (item.kind === 'video') {
      const video = el('video', {
        muted: true, loop: true, playsinline: true, preload: 'metadata',
        poster: url(item.poster), 'aria-label': `${item.title} 영상`,
      });
      video.muted = true;
      video.src = url(item.src);
      video.addEventListener('loadedmetadata', () => {
        if (video.videoWidth && video.videoHeight) frame.style.setProperty('--ar', String(video.videoWidth / video.videoHeight));
      });
      const toggle = el('button', { class: 'plate__toggle', type: 'button' });
      const syncToggle = () => {
        toggle.replaceChildren(icon(video.paused ? 'play' : 'pause'), video.paused ? '영상 재생' : '영상 일시정지');
      };
      video.addEventListener('play', syncToggle);
      video.addEventListener('pause', syncToggle);
      toggle.addEventListener('click', () => {
        plateIntent = video.paused ? 'play' : 'pause';
        updatePlateVideo();
      });
      syncToggle();
      frame.append(video);
      plateVideo = video;
      cap = el('figcaption', { class: 'plate__cap' }, [el('strong', { text: item.title }), ' · ', item.caption]);
      return el('div', { class: 'plate plate--main', style: `--ar:${ar}` }, [el('figure', { class: 'plate__fig' }, [frame, cap]), toggle]);
    } else {
      frame.append(el('img', { src: url(item.src), alt: item.alt, width: (dimsOf(item.src) || [])[0], height: (dimsOf(item.src) || [])[1], fetchpriority: 'high' }));
      plateVideo = null;
      cap = el('figcaption', { class: 'plate__cap', text: item.caption });
    }
    return el('div', { class: 'plate plate--main', style: `--ar:${ar}` }, el('figure', { class: 'plate__fig' }, [frame, cap]));
  }

  function sidePlate(g, item, index) {
    const d = dimsOf(item.src) || [];
    const frame = el('span', { class: 'plate__frame', style: `--ar:${ratioOf(item.src)}` }, [
      el('img', { src: url(item.src), alt: item.alt, width: d[0], height: d[1], decoding: 'async' }),
      el('span', { class: 'plate__open', 'aria-hidden': 'true', text: '크게 보기' }),
    ]);
    const btn = el('button', { class: 'plate__btn', type: 'button', 'aria-label': `크게 보기: ${item.alt}` }, frame);
    btn.addEventListener('click', () => openSheet(g.id, index, { source: frame, list: FINALS }));
    return el('figure', { class: 'plate plate--side', style: `--ar:${ratioOf(item.src)}` }, [btn, el('figcaption', { class: 'plate__cap', text: item.caption })]);
  }

  function renderSpread(g) {
    const { items, main, sides, orient } = plateSet(g);
    platesEl.dataset.orient = orient;
    const kids = [];
    if (main) kids.push(mainPlate(g, main, items));
    kids.push(el('div', { class: 'plate__sides' }, sides.map((s) => sidePlate(g, s, items.indexOf(s)))));
    platesEl.replaceChildren(...kids);

    const videoIndex = items.findIndex((i) => i.kind === 'video');
    const actions = el('div', { class: 'spread__actions' }, [
      el('button', { class: 'btn btn--primary', type: 'button', onclick: () => openSheet(g.id, 0, { source: $('.plate--main .plate__frame', platesEl), list: FINALS }) }, ['작품 보기']),
      videoIndex >= 0 ? el('button', { class: 'btn btn--quiet', type: 'button', onclick: () => openSheet(g.id, videoIndex, { source: $('.plate--main .plate__frame', platesEl), list: FINALS, play: true }) }, [icon('play'), '영상 보기']) : null,
    ]);
    copyEl.replaceChildren(
      el('h2', { class: 'spread__title', id: 'spreadTitle', text: g.title }),
      el('p', { class: 'spread__sub', text: g.subtitle }),
      factsList(g),
      actions,
      arr(g.features).length ? el('div', { class: 'spread__feats' }, [
        el('h3', { class: 'case__h', text: '핵심 시스템' }),
        el('ul', { class: 'featlist' }, arr(g.features).map((f) => el('li', { text: f }))),
      ]) : null,
    );
  }

  /* ---------- Case notes: the deeper page for the selected final ---------- */
  function sceneFigure(g, item, index, list) {
    const still = stillOf(item);
    const d = dimsOf(still) || [];
    const orient = ratioOf(still) < 1 ? 'portrait' : 'landscape';
    const frame = el('span', { class: 'plate__frame', style: `--ar:${ratioOf(still)}` }, [
      el('img', { src: url(still), alt: item.kind === 'video' ? '' : item.alt, width: d[0], height: d[1], loading: 'lazy', decoding: 'async' }),
      item.kind === 'video' ? el('span', { class: 'scene__kind' }, [icon('play'), '영상']) : null,
    ]);
    const label = item.kind === 'video' ? `영상 열기: ${item.title}` : `크게 보기: ${item.alt}`;
    const btn = el('button', { class: 'scene__btn', type: 'button', 'aria-label': label }, frame);
    btn.addEventListener('click', () => openSheet(g.id, index, { source: frame, list, play: item.kind === 'video' }));
    const cap = item.kind === 'video'
      ? el('figcaption', { class: 'plate__cap' }, [el('strong', { text: item.title }), ' · ', item.caption])
      : el('figcaption', { class: 'plate__cap', text: item.caption });
    return el('figure', { class: 'scene', 'data-orient': orient }, [btn, cap]);
  }

  function fold(key, title, hint, body) {
    const d = el('details', { class: 'fold', 'data-fold': key }, [
      el('summary', {}, [el('span', { text: title }), el('span', { class: 'fold__hint' }, [hint, icon('plus')])]),
      el('div', { class: 'fold__body' }, body),
    ]);
    if (openFolds.has(key)) d.open = true;
    d.addEventListener('toggle', () => { if (d.open) openFolds.add(key); else openFolds.delete(key); });
    return d;
  }

  function scenesBlock(g, list) {
    const items = mediaOf(g);
    if (!items.length) return null;
    const nImg = arr(g.images).length;
    const nVid = arr(g.videos).length;
    const portrait = items.filter((i) => ratioOf(stillOf(i)) < 1).length >= items.length / 2;
    return el('div', { class: 'scenes', 'data-anchor': 'scenes' }, [
      el('h3', { class: 'case__h', text: [nImg ? `캡처 ${nImg}장` : '', nVid ? `영상 ${nVid}편` : ''].filter(Boolean).join(' · ') }),
      el('div', { class: 'scenes__grid', 'data-orient': portrait ? 'portrait' : 'landscape' }, items.map((item, i) => sceneFigure(g, item, i, list))),
    ]);
  }

  function renderCase(g) {
    caseTitle.textContent = `${g.title} 작업 노트`;
    const folds = [];
    if (arr(g.history).length) folds.push(fold('history', '개발 이력', `${arr(g.history).length}개 기록`, el('ol', { class: 'timeline' }, arr(g.history).map((h) => el('li', { text: h })))));
    if (arr(g.details).length) folds.push(fold('details', '세부 기록', `${arr(g.details).length}개 항목`, el('div', { class: 'detail-list' }, arr(g.details).map((x) => el('div', {}, [el('h4', { text: x.title }), el('p', { text: x.text })])))));
    if (arr(g.tools).length) folds.push(fold('tools', '제작 도구', `${arr(g.tools).length}가지`, el('ul', { class: 'taglist' }, arr(g.tools).map((t) => el('li', { text: t })))));
    folds.push(fold('facts', '상태와 제작 정보', '펼치기', factsList(g, { tools: false })));
    const intro = el('div', { class: 'case__intro', 'data-anchor': 'about' }, [
      el('div', {}, [el('h3', { class: 'case__h', text: '이 작품은' }), el('p', { class: 'case__desc', text: g.description })]),
      el('div', { class: 'more', 'data-anchor': 'more' }, [el('h3', { class: 'case__h', text: '더 깊은 기록' }), ...folds]),
    ]);
    caseBody.replaceChildren(intro, scenesBlock(g, FINALS) || '');
  }

  function renderProject() {
    const g = byId[current];
    if (!g) return;
    plateIntent = null;
    renderSpread(g);
    renderCase(g);
    project.setAttribute('aria-labelledby', `tab-${g.id}`);
    $$('.tab').forEach((t) => {
      const on = t.dataset.id === current;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      if (on && !$('.tab__marker', t)) {
        const m = $('.tab__marker') || el('span', { class: 'tab__marker', 'aria-hidden': 'true' });
        t.prepend(m);
      }
    });
    updatePlateVideo();
  }

  /* ---------- Final tabs: change project without losing the reading place ---------- */
  const finalsNav = $('#finals');
  const stickyOffset = () => (isNarrow() && !finalsNav.classList.contains('is-away') ? finalsNav.offsetHeight : 0);

  function captureAnchor() {
    const r = project.getBoundingClientRect();
    const top = stickyOffset();
    if (r.bottom < top + 120 || r.top > innerHeight * 0.8) return { mode: 'jump' };
    const anchors = $$('[data-anchor]', project);
    let best = anchors[0];
    for (const a of anchors) if (a.getBoundingClientRect().top <= top + 140) best = a;
    return { mode: 'keep', key: best.dataset.anchor, top: best.getBoundingClientRect().top };
  }
  function restoreAnchor(a) {
    if (a.mode === 'jump') {
      const y = project.getBoundingClientRect().top + scrollY - stickyOffset();
      scrollTo({ top: Math.max(0, y), behavior: motionOn() ? 'smooth' : 'instant' });
      return;
    }
    const target = $(`[data-anchor="${a.key}"]`, project) || $('#case');
    const delta = target.getBoundingClientRect().top - a.top;
    if (Math.abs(delta) > 1) scrollTo({ top: scrollY + delta, behavior: 'instant' });
  }

  function enterAnimate(nodes) {
    if (!motionOn()) return;
    nodes.forEach((n, i) => {
      if (!n) return;
      n.style.setProperty('--i', String(i));
      n.classList.remove('is-entering');
      void n.offsetWidth;
      n.classList.add('is-entering');
      n.addEventListener('animationend', () => n.classList.remove('is-entering'), { once: true });
    });
  }

  function selectFinal(id) {
    if (id === current || !byId[id]) return;
    const dir = FINALS.indexOf(id) > FINALS.indexOf(current) ? '1' : '-1';
    const anchor = captureAnchor();
    const apply = () => { current = id; renderProject(); restoreAnchor(anchor); };
    try { sessionStorage.setItem('gp-d-final', id); } catch (e) { /* storage unavailable */ }
    if (anchor.mode === 'keep' && canVT()) {
      doc.setAttribute('data-dir', dir);
      const t = document.startViewTransition(apply);
      t.ready.catch(() => {});
      t.finished.finally(() => doc.removeAttribute('data-dir'));
    } else {
      apply();
      enterAnimate([$('.plate--main', platesEl), ...$$('.plate--side', platesEl), copyEl]);
    }
  }

  const tablist = $('.tabs');
  const tabs = $$('.tab', tablist);
  tabs.forEach((t) => {
    const g = byId[t.dataset.id];
    if (g) {
      $('.tab__title', t).textContent = g.title;
      $('.tab__meta', t).textContent = [g.category, periodOf(g)].filter(Boolean).join(' · ');
    }
    t.addEventListener('click', () => selectFinal(t.dataset.id));
  });
  tablist.addEventListener('keydown', (e) => {
    const i = tabs.indexOf(document.activeElement);
    if (i < 0) return;
    let n = -1;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') n = (i + 1) % tabs.length;
    else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') n = (i - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') n = 0;
    else if (e.key === 'End') n = tabs.length - 1;
    if (n < 0) return;
    e.preventDefault();
    tabs[n].focus();
    selectFinal(tabs[n].dataset.id);
  });

  /* ---------- Plate video: one active video, muted, only while seen ---------- */
  function updatePlateVideo() {
    if (!plateVideo) return;
    const sheetOpen = sheet.open;
    const wants = plateIntent === 'play' || (plateIntent === null && motionOn());
    if (wants && plateVisible && !document.hidden && !sheetOpen) {
      const p = plateVideo.play();
      if (p && p.catch) p.catch(() => {});
    } else if (!plateVideo.paused) {
      plateVideo.pause();
    }
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      entries.forEach((e) => { plateVisible = e.isIntersecting; });
      updatePlateVideo();
    }, { threshold: 0.3 }).observe(platesEl);
  }
  document.addEventListener('visibilitychange', () => {
    updatePlateVideo();
    if (document.hidden) $$('video', sheet).forEach((v) => v.pause());
  });

  /* ---------- Archive: contents page with a preview plate ---------- */
  const rowsEl = $('#rows');
  const filtersEl = $('#filters');
  const countEl = $('#archiveCount');
  const previewStage = $('#previewStage');
  let activeFilter = '전체';

  const cats = [];
  GAMES.forEach((g) => { if (g.category && !cats.includes(g.category)) cats.push(g.category); });
  const catCount = (c) => (c === '전체' ? GAMES.length : GAMES.filter((g) => g.category === c).length);
  ['전체', ...cats].forEach((c) => {
    filtersEl.append(el('button', { class: 'filter', type: 'button', 'aria-pressed': String(c === activeFilter), 'data-cat': c, onclick: () => setFilter(c) },
      [c, el('span', { class: 'filter__n', text: String(catCount(c)) })]));
  });

  function rowThumb(g) {
    const items = mediaOf(g);
    const first = arr(g.images)[0] || items[0];
    if (!first) return el('span', { class: 'row__thumb row__thumb--blank', 'aria-hidden': 'true', text: '실행 화면 미확보' });
    const still = first.kind === 'video' ? first.poster : first.src;
    return el('span', { class: 'row__thumb', 'aria-hidden': 'true' }, el('img', { src: url(still), alt: '', loading: 'lazy', decoding: 'async', width: (dimsOf(still) || [])[0], height: (dimsOf(still) || [])[1], style: first.pos ? `object-position:${first.pos}` : null }));
  }

  GAMES.forEach((g) => {
    const btn = el('button', { class: 'row', type: 'button', 'data-id': g.id }, [
      rowThumb(g),
      el('span', { class: 'row__main' }, [
        el('span', { class: 'row__title', text: g.title }),
        el('span', { class: 'row__sub', text: g.subtitle }),
      ]),
      el('span', { class: 'row__cat' }, [g.category, FINALS.includes(g.id) ? el('span', { class: 'row__final', text: '최종 프로젝트' }) : null]),
      el('span', { class: 'row__state', text: g.status }),
    ]);
    btn.addEventListener('pointerenter', () => setPreview(g.id));
    btn.addEventListener('focus', () => setPreview(g.id));
    btn.addEventListener('click', () => {
      const source = isNarrow() ? $('.row__thumb', btn) : previewStage;
      setPreview(g.id);
      openSheet(g.id, 0, { source, list: visibleIds() });
    });
    rowsEl.append(el('li', { 'data-cat': g.category }, btn));
  });

  const visibleIds = () => $$('li', rowsEl).filter((li) => !li.hidden).map((li) => $('.row', li).dataset.id);

  function setFilter(c) {
    activeFilter = c;
    $$('.filter', filtersEl).forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.cat === c)));
    $$('li', rowsEl).forEach((li) => { li.hidden = c !== '전체' && li.dataset.cat !== c; });
    const ids = visibleIds();
    countEl.textContent = c === '전체' ? `${GAMES.length}편 모두 보는 중` : `${GAMES.length}편 중 ${c} ${ids.length}편`;
    if (ids.length) setPreview(ids[0]);
  }

  let previewId = null;
  function setPreview(id) {
    if (id === previewId) return;
    previewId = id;
    const g = byId[id];
    $$('.row', rowsEl).forEach((r) => r.classList.toggle('is-active', r.dataset.id === id));
    const items = mediaOf(g);
    const first = arr(g.images)[0] || items[0];
    const old = $$('img, .preview__blank', previewStage);
    if (first) {
      const still = stillOf(first);
      const img = el('img', { src: url(still), alt: '', decoding: 'async' });
      if (motionOn()) img.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, easing: 'ease-out' });
      previewStage.append(img);
      $('#previewCaption').textContent = first.kind === 'video' ? `${first.title} · ${first.caption}` : first.caption;
    } else {
      previewStage.append(el('div', { class: 'preview__blank' }, [el('strong', { text: '이미지와 영상이 없습니다' }), el('span', { text: g.status })]));
      $('#previewCaption').textContent = '';
    }
    old.forEach((n) => {
      if (motionOn() && n.tagName === 'IMG') setTimeout(() => n.remove(), 260); else n.remove();
    });
    $('#previewTitle').textContent = g.title;
    $('#previewStatus').textContent = g.status;
  }
  setFilter('전체');

  /* ---------- Notes ---------- */
  $('#notesList').append(...arr(D.notes).map((n, i) =>
    el('article', { class: 'note', 'data-reveal': true, style: `--i:${i % 3}` }, [el('h3', { class: 'note__title', text: n.title }), el('p', { class: 'note__text', text: n.text })])));

  /* ---------- Detail sheet ---------- */
  const sheetBody = $('#sheetBody');
  const sheetPrev = $('#sheetPrev');
  const sheetNext = $('#sheetNext');
  const state = { id: null, index: 0, list: [], opener: null, source: null };

  function showMedia(g, items, index, play) {
    const stage = $('.viewer__stage', sheetBody);
    const capT = $('.viewer__title', sheetBody);
    const capX = $('.viewer__text', sheetBody);
    const count = $('.viewer__count', sheetBody);
    $$('video', stage).forEach((v) => v.pause());
    const item = items[index];
    state.index = index;
    if (!item) return;
    let node;
    if (item.kind === 'video') {
      node = el('video', { controls: true, playsinline: true, preload: 'metadata', poster: url(item.poster), 'aria-label': `${item.title} 영상` });
      node.src = url(item.src);
      capT.textContent = item.title;
      capX.textContent = item.caption;
    } else {
      const d = dimsOf(item.src) || [];
      node = el('img', { src: url(item.src), alt: item.alt, width: d[0], height: d[1], decoding: 'async' });
      capT.textContent = item.alt;
      capX.textContent = item.caption;
    }
    stage.replaceChildren(node);
    count.textContent = `${index + 1} / ${items.length}`;
    $$('.thumb', sheetBody).forEach((t, i) => t.setAttribute('aria-current', String(i === index)));
    if (play && item.kind === 'video') {
      const p = node.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  function fillSheet(id, index, play) {
    $$('video', sheetBody).forEach((v) => v.pause());
    const g = byId[id];
    state.id = id;
    const items = mediaOf(g);
    $('#sheetCrumb').textContent = FINALS.includes(id) ? `최종 프로젝트 · ${g.title}` : `전체 작품 · ${g.title}`;
    const pos = state.list.indexOf(id);
    sheetPrev.disabled = pos <= 0;
    sheetNext.disabled = pos < 0 || pos >= state.list.length - 1;

    const head = el('header', { class: 'sheet__head' }, [
      el('h2', { class: 'sheet__title', id: 'sheetTitle', tabindex: '-1', text: g.title }),
      el('p', { class: 'sheet__sub', text: g.subtitle }),
    ]);
    let viewer;
    if (items.length) {
      viewer = el('div', { class: 'viewer' }, [
        el('div', { class: 'viewer__stage' }),
        el('p', { class: 'viewer__cap' }, [el('span', { class: 'viewer__title' }), el('span', { class: 'viewer__text' }), el('span', { class: 'viewer__count' })]),
        items.length > 1 ? el('div', { class: 'thumbs', role: 'group', 'aria-label': '캡처와 영상 고르기' }, items.map((item, i) => {
          const still = stillOf(item);
          const b = el('button', { class: 'thumb', type: 'button', 'aria-label': item.kind === 'video' ? `영상: ${item.title}` : item.alt },
            [el('img', { src: url(still), alt: '', loading: 'lazy', width: (dimsOf(still) || [])[0], height: (dimsOf(still) || [])[1] }),
              item.kind === 'video' ? el('span', { class: 'thumb__kind', 'aria-hidden': 'true' }, icon('play')) : null]);
          b.addEventListener('click', () => showMedia(g, items, i, item.kind === 'video'));
          return b;
        })) : null,
      ]);
    } else {
      viewer = el('div', { class: 'viewer' }, [
        el('div', { class: 'viewer__stage viewer__stage--blank' }, el('div', { class: 'viewer__blank' }, [el('strong', { text: '이미지와 영상이 없습니다' }), el('span', { text: g.status })])),
      ]);
    }
    const text = el('div', { class: 'sheet__text' }, [
      el('section', {}, [el('h3', { class: 'case__h', text: '이 작품은' }), el('p', { class: 'sheet__desc', text: g.description })]),
      arr(g.features).length ? el('section', {}, [el('h3', { class: 'case__h', text: '핵심 시스템' }), el('ul', { class: 'featlist' }, arr(g.features).map((f) => el('li', { text: f })))]) : null,
      arr(g.details).length ? el('section', {}, [el('h3', { class: 'case__h', text: '세부 기록' }), el('div', { class: 'detail-list' }, arr(g.details).map((x) => el('div', {}, [el('h4', { text: x.title }), el('p', { text: x.text })])))]) : null,
      arr(g.history).length ? el('section', {}, [el('h3', { class: 'case__h', text: '개발 이력' }), el('ol', { class: 'timeline' }, arr(g.history).map((h) => el('li', { text: h })))]) : null,
    ]);
    const aside = el('aside', { class: 'sheet__facts', 'aria-label': '상태와 제작 정보' }, factsList(g, { tools: true }));
    sheetBody.replaceChildren(head, viewer, el('div', { class: 'sheet__cols' }, [text, aside]));
    sheetBody.scrollTop = 0;
    if (items.length) showMedia(g, items, Math.min(index || 0, items.length - 1), play);
  }

  function withVT(update, onDone) {
    if (!canVT()) { update(); if (onDone) onDone(); return; }
    doc.classList.add('vt-sheet');
    const t = document.startViewTransition(update);
    t.ready.catch(() => {});
    t.finished.finally(() => { doc.classList.remove('vt-sheet'); if (onDone) onDone(); });
  }

  const inView = (n) => {
    if (!n || !n.isConnected) return false;
    const r = n.getBoundingClientRect();
    return r.width > 0 && r.bottom > 0 && r.top < innerHeight;
  };

  function openSheet(id, index, opts) {
    const o = opts || {};
    state.list = o.list && o.list.length ? o.list.slice() : GAMES.map((g) => g.id);
    if (!state.list.includes(id)) state.list = GAMES.map((g) => g.id);
    if (sheet.open) { fillSheet(id, index, o.play); history.replaceState({ sheet: id }, '', `#work/${id}`); return; }
    state.opener = document.activeElement;
    state.source = o.source || null;
    const source = inView(state.source) ? state.source : null;
    const show = () => {
      if (source) source.style.viewTransitionName = '';
      fillSheet(id, index, o.play);
      sheet.showModal();
      sheetBody.scrollTop = 0;
      const t = $('#sheetTitle', sheet);
      if (t) t.focus({ preventScroll: true });
      updatePlateVideo();
    };
    if (source && canVT()) source.style.viewTransitionName = 'sheet-media';
    withVT(show);
    if (!(history.state && history.state.sheet)) history.pushState({ sheet: id }, '', `#work/${id}`);
    else history.replaceState({ sheet: id }, '', `#work/${id}`);
  }

  function closeSheet() {
    if (!sheet.open) return;
    const source = inView(state.source) ? state.source : null;
    const hide = () => {
      $$('video', sheet).forEach((v) => v.pause());
      sheet.close();
      if (source && canVT()) source.style.viewTransitionName = 'sheet-media';
    };
    withVT(hide, () => { if (source) source.style.viewTransitionName = ''; });
  }

  sheet.addEventListener('close', () => {
    $$('video', sheet).forEach((v) => v.pause());
    if (history.state && history.state.sheet) history.back();
    const back = state.opener;
    if (back && back.isConnected && typeof back.focus === 'function') back.focus({ preventScroll: true });
    updatePlateVideo();
  });
  sheet.addEventListener('cancel', (e) => { e.preventDefault(); closeSheet(); });
  sheet.addEventListener('click', (e) => {
    if (e.target !== sheet) return;
    const r = sheet.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeSheet();
  });
  $('#sheetClose').addEventListener('click', closeSheet);
  const stepSheet = (dir) => {
    const pos = state.list.indexOf(state.id);
    const next = state.list[pos + dir];
    if (!next) return;
    fillSheet(next, 0, false);
    sheetBody.scrollTop = 0;
    history.replaceState({ sheet: next }, '', `#work/${next}`);
    const t = $('#sheetTitle', sheet);
    if (t) t.focus({ preventScroll: true });
  };
  sheetPrev.addEventListener('click', () => stepSheet(-1));
  sheetNext.addEventListener('click', () => stepSheet(1));
  sheet.addEventListener('keydown', (e) => {
    if (e.target.closest('video, .thumbs')) return;
    const stage = $('.viewer__stage', sheetBody);
    if (!stage) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      const g = byId[state.id];
      const items = mediaOf(g);
      if (items.length < 2) return;
      e.preventDefault();
      const n = (state.index + (e.key === 'ArrowRight' ? 1 : -1) + items.length) % items.length;
      showMedia(g, items, n, false);
    }
  });

  window.addEventListener('popstate', () => {
    const s = history.state;
    if (sheet.open && !(s && s.sheet)) {
      $$('video', sheet).forEach((v) => v.pause());
      sheet.close();
    } else if (!sheet.open && s && s.sheet && byId[s.sheet]) {
      state.list = GAMES.map((g) => g.id);
      state.opener = document.activeElement;
      fillSheet(s.sheet, 0, false);
      sheet.showModal();
      updatePlateVideo();
    }
  });

  /* ---------- Contents: where am I ---------- */
  const tocLinks = $$('.toc__link');
  if ('IntersectionObserver' in window) {
    const map = new Map([['spread', '#project'], ['case', '#case'], ['archive', '#archive'], ['notes', '#notes']]);
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        const href = map.get(e.target.id);
        tocLinks.forEach((a) => { if (a.getAttribute('href') === href) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); });
      });
    }, { rootMargin: '-35% 0px -60% 0px' });
    ['spread', 'case', 'archive', 'notes'].forEach((id) => { const n = document.getElementById(id); if (n) spy.observe(n); });

    new IntersectionObserver((entries) => {
      entries.forEach((e) => finalsNav.classList.toggle('is-away', !e.isIntersecting));
    }, { rootMargin: '0px 0px -40% 0px' }).observe(project);

    const reveal = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); reveal.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    $$('[data-reveal]').forEach((n) => reveal.observe(n));
  } else {
    $$('[data-reveal]').forEach((n) => n.classList.add('is-in'));
  }
  $$('.toc__link, .end__nav a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const y = target.getBoundingClientRect().top + scrollY - stickyOffset() - (target.id === 'top' ? 0 : 8);
      scrollTo({ top: Math.max(0, y), behavior: motionOn() ? 'smooth' : 'instant' });
      const focusTarget = target.id === 'top' ? $('#main') : target;
      if (!focusTarget.hasAttribute('tabindex')) focusTarget.setAttribute('tabindex', '-1');
      focusTarget.focus({ preventScroll: true });
    });
  });

  /* ---------- First paint ---------- */
  renderProject();
  enterAnimate([$('.plate--main', platesEl), ...$$('.plate--side', platesEl), copyEl]);

  const m = /^#work\/([\w-]+)$/.exec(location.hash);
  if (m && byId[m[1]]) {
    history.replaceState(null, '', location.pathname + location.search);
    openSheet(m[1], 0, {});
  }
})();
