(() => {
  'use strict';

  const data = window.PORTFOLIO;
  const html = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const splitMQ = window.matchMedia('(min-width: 1000px)');
  const hoverMQ = window.matchMedia('(hover: hover) and (pointer: fine)');
  const MOTION_KEY = 'gp-motion';
  const EASE = {
    out: 'cubic-bezier(0.22, 1, 0.36, 1)',
    expo: 'cubic-bezier(0.16, 1, 0.3, 1)',
    io: 'cubic-bezier(0.76, 0, 0.24, 1)',
    exit: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
  };
  const motionOn = () => html.dataset.motion !== 'off';
  const KOREAN_COUNT = ['영', '한', '두', '세', '네', '다섯', '여섯', '일곱', '여덟', '아홉', '열'];
  const countWord = (n) => (n <= 10 ? KOREAN_COUNT[n] : String(n));

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else if (key in node && typeof value !== 'string') node[key] = value;
      else node.setAttribute(key, value);
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.append(child);
    }
    return node;
  };

  /* ---------- scroll: one frame callback for the progress band and the stage pick ---------- */
  const progressBar = $('#progressBar');
  let frame = 0;
  let onFrame = null;
  let lastScrollAt = 0;
  const updateProgress = () => {
    const max = html.scrollHeight - window.innerHeight;
    progressBar.style.setProperty('--p', max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)).toFixed(4) : '0');
  };
  const queueFrame = () => {
    if (frame) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      updateProgress();
      if (onFrame) onFrame();
    });
  };
  window.addEventListener('scroll', () => { lastScrollAt = performance.now(); queueFrame(); }, { passive: true });
  window.addEventListener('resize', queueFrame);
  updateProgress();

  /* ---------- reveal: once, staggered within each batch that enters together ---------- */
  const revealObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((entries) => {
        let k = 0;
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const t = entry.target;
          if (!t.hasAttribute('data-delay-fixed')) t.style.setProperty('--delay', `${Math.min(k, 6) * 80}ms`);
          k += 1;
          t.classList.add('is-in');
          revealObserver.unobserve(t);
          if (t._onReveal) t._onReveal();
        }
      }, { rootMargin: '0px 0px -8% 0px' })
    : null;
  const reveal = (node, delay) => {
    node.setAttribute('data-reveal', '');
    if (delay != null) {
      node.style.setProperty('--delay', `${delay}ms`);
      node.setAttribute('data-delay-fixed', '');
    }
    if (revealObserver) revealObserver.observe(node);
    else { node.classList.add('is-in'); if (node._onReveal) node._onReveal(); }
  };

  /* ---------- counters ---------- */
  const countUp = (node, to, { delay = 0, duration = 1200 } = {}) => {
    node.textContent = String(to);
    if (!motionOn() || !to) return;
    node.textContent = '0';
    const start = performance.now() + delay;
    const step = (now) => {
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
      node.textContent = String(Math.round(to * eased));
      if (t < 1) window.requestAnimationFrame(step);
    };
    window.requestAnimationFrame(step);
  };

  /* ---------- motion toggle (persisted; follows the OS setting until the visitor chooses) ---------- */
  const motionBtn = $('#motionToggle');
  const motionListeners = [];
  const syncMotionButton = () => {
    const on = motionOn();
    motionBtn.textContent = on ? '모션 끄기' : '모션 켜기';
    motionBtn.setAttribute('aria-label', on ? '페이지 모션 끄기' : '페이지 모션 켜기');
  };
  const setMotion = (on, persist) => {
    html.dataset.motion = on ? 'on' : 'off';
    if (persist) {
      try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch (e) { /* storage unavailable: setting lasts this visit */ }
    }
    if (!on) {
      for (const a of document.getAnimations()) {
        if (typeof CSSAnimation !== 'undefined' && a instanceof CSSAnimation) continue;
        if (typeof CSSTransition !== 'undefined' && a instanceof CSSTransition) continue;
        a.cancel();
      }
    }
    syncMotionButton();
    for (const fn of motionListeners) fn(on);
  };
  motionBtn.addEventListener('click', () => setMotion(!motionOn(), true));
  reduceMQ.addEventListener('change', () => {
    let saved = null;
    try { saved = localStorage.getItem(MOTION_KEY); } catch (e) { saved = null; }
    if (saved !== 'on' && saved !== 'off') setMotion(!reduceMQ.matches, false);
  });
  syncMotionButton();

  document.querySelectorAll('[data-reveal]').forEach((node) => {
    if (revealObserver) revealObserver.observe(node); else node.classList.add('is-in');
  });

  if (!data || !Array.isArray(data.games) || data.games.length === 0) {
    $('#dataError').hidden = false;
    $('#stageCaption').textContent = '작품 데이터를 불러오지 못했습니다.';
    $('#stageToggle').hidden = true;
    return;
  }

  const games = data.games;
  const byId = new Map(games.map((g) => [g.id, g]));
  const finals = games.filter((g) => g.final === true);
  const featured = games.filter((g) => g.featured && g.final !== true);
  const categories = [...new Set(games.map((g) => g.category))];
  const when = (g) => g.period || g.year || '';
  const imagesOf = (g) => g.images || [];
  const videosOf = (g) => g.videos || [];
  const detailsOf = (g) => (Array.isArray(g.details) ? g.details.filter((d) => d && d.title && d.text) : []);
  const firstSentence = (text = '') => {
    const t = String(text).trim();
    const m = /^.+?[.!?](?=\s|$)/.exec(t);
    return m ? m[0] : t;
  };

  /* ---------- hero copy and numbers, from the data ---------- */
  const count = (key) => games.reduce((n, g) => n + (g[key] ? g[key].length : 0), 0);
  $('#heroCount').textContent = games.length;
  if (finals.length) {
    $('#heroLede').textContent = `최종 프로젝트 ${countWord(finals.length)} 편을 앞에 두고, Unity와 Unreal로 만든 완성작과 프로토타입, 작은 실험까지 ${games.length}편을 직접 실행 기록과 확보한 녹화·캡처, 제작 노트로 정리했습니다. 무대에는 지금 읽는 작품의 화면이 걸립니다.`;
  }
  const facts = [
    ['games', games.length],
    ['cats', categories.length],
    ['videos', count('videos')],
    ['images', count('images')],
  ];
  facts.forEach(([key, n], i) => countUp($(`[data-fact="${key}"]`), n, { delay: 620 + i * 90, duration: 1300 }));
  const archiveTotal = $('#archiveTotal');
  archiveTotal.textContent = games.length;
  const archiveHead = archiveTotal.closest('[data-reveal]');
  if (archiveHead) archiveHead._onReveal = () => countUp(archiveTotal, games.length, { delay: 150, duration: 1000 });

  $('#finalCount').textContent = countWord(finals.length);
  $('#featuredCount').textContent = countWord(featured.length);
  if (!finals.length) {
    $('#final').hidden = true;
    document.querySelectorAll('a[href="#final"]').forEach((a) => {
      if (a.classList.contains('btn')) { a.href = '#featured'; a.textContent = '대표작부터 보기'; } else a.hidden = true;
    });
  }
  if (!featured.length) {
    $('#featured').hidden = true;
    document.querySelectorAll('a[href="#featured"]').forEach((a) => { a.hidden = true; });
  }

  const factsList = (g, { withTools = false, withStatus = true } = {}) => {
    const rows = [
      withStatus ? ['상태', g.status, true] : null,
      ['기간', when(g)],
      ['분류', g.category],
      ['엔진', g.engine],
      ['팀', g.team],
      ['역할', g.role],
      withTools && g.tools && g.tools.length ? ['도구', g.tools.join(' · ')] : null,
    ].filter((row) => row && row[1]);
    return el('dl', { class: 'facts' }, rows.map(([k, v, strong]) =>
      el('div', {}, [el('dt', { text: k }), el('dd', { class: strong ? 'is-status' : null, text: v })])));
  };

  const listOf = (items, cls) => el('ul', { class: cls }, items.map((text, i) => {
    const li = el('li', { text });
    li.style.setProperty('--li', i);
    return li;
  }));

  const openButton = (g, accent) => el('button', {
    class: `btn ${accent ? 'btn--accent' : 'btn--quiet'}`, type: 'button', 'data-open': g.id, 'aria-label': `${g.title} 자세히 보기`,
  }, ['자세히 보기', el('span', { class: 'btn__arrow', 'aria-hidden': 'true', text: '→' })]);

  /* ---------- final + featured entries ---------- */
  const shotFor = (g) => {
    const im = imagesOf(g)[0];
    if (!im) return null;
    const img = el('img', { src: im.src, alt: im.alt, loading: 'lazy', decoding: 'async' });
    if (im.pos) img.style.objectPosition = im.pos;
    return el('figure', { class: 'feature__shot' }, [img, el('figcaption', { text: im.caption })]);
  };

  const entryFor = (g, isFinal) => {
    const titleId = `${isFinal ? 'fin' : 'f'}-${g.id}`;
    const parts = [
      el('h3', { class: 'feature__title t-mask', id: titleId }, el('span', { text: g.title })),
      el('p', { class: 'feature__sub', text: g.subtitle }),
      isFinal && g.description ? el('p', { class: 'feature__desc', text: g.description }) : null,
      isFinal ? shotFor(g) : null,
      factsList(g),
      g.features && g.features.length ? listOf(g.features, 'feature__list') : null,
      el('div', { class: 'feature__act' }, [openButton(g, isFinal)]),
    ].filter(Boolean);
    const entry = el('article', { class: `feature${isFinal ? ' feature--final' : ''}`, 'data-id': g.id, 'aria-labelledby': titleId }, parts);
    parts.forEach((part, i) => reveal(part, i * 80));
    return entry;
  };
  const finalList = $('#finalList');
  for (const g of finals) finalList.append(entryFor(g, true));
  const featuredList = $('#featuredList');
  for (const g of featured) featuredList.append(entryFor(g, false));

  /* ---------- archive with filter ---------- */
  const mediaNote = (g) => {
    const v = videosOf(g).length;
    const i = imagesOf(g).length;
    if (!v && !i) return '화면 없음 · 글로 기록';
    return [v ? `영상 ${v}` : null, i ? `캡처 ${i}` : null].filter(Boolean).join(' · ');
  };
  const archiveList = $('#archiveList');
  const rows = games.map((g) => {
    const isFinal = g.final === true;
    const row = el('article', {
      class: 'row', 'data-id': g.id, 'data-cat': g.category, 'data-final': isFinal ? 'true' : null, 'aria-labelledby': `r-${g.id}`,
    }, [
      el('div', { class: 'row__main' }, [
        el('h3', { class: 'row__title', id: `r-${g.id}`, text: g.title }),
        el('p', { class: 'row__sub', text: g.subtitle }),
        el('p', { class: 'row__status' }, [
          isFinal ? el('span', { class: 'is-final', text: '최종 프로젝트' }) : null,
          isFinal ? ' · ' : null,
          el('strong', { text: g.status }),
        ]),
      ]),
      el('div', { class: 'row__side' }, [
        el('span', { text: g.category }),
        el('span', { text: when(g) }),
        el('span', { text: mediaNote(g) }),
        openButton(g, false),
      ]),
    ]);
    archiveList.append(row);
    reveal(row);
    return row;
  });

  const FINAL_FILTER = '__final';
  const filters = $('#filters');
  const status = $('#archiveStatus');
  const filterButtons = [];
  const makeFilter = (label, value, n, extra) => {
    const b = el('button', { class: `filter${extra ? ` ${extra}` : ''}`, type: 'button', 'aria-pressed': 'false', 'data-cat': value }, [label, el('span', { text: n })]);
    filterButtons.push(b);
    filters.append(b);
  };
  makeFilter('전체', '', games.length);
  if (finals.length) makeFilter('최종 프로젝트', FINAL_FILTER, finals.length, 'filter--final');
  for (const c of categories) makeFilter(c, c, games.filter((g) => g.category === c).length);

  const matches = (row, value) => !value || (value === FINAL_FILTER ? row.dataset.final === 'true' : row.dataset.cat === value);
  let currentFilter = null;
  let filterTimer = 0;

  const applyFilter = (value, animate = true) => {
    if (value === currentFilter) return;
    currentFilter = value;
    window.clearTimeout(filterTimer);
    for (const r of rows) for (const a of r.getAnimations()) a.cancel();

    const next = rows.filter((r) => matches(r, value));
    const nextSet = new Set(next);
    const before = rows.filter((r) => !r.hidden);
    const leaving = before.filter((r) => !nextSet.has(r));
    const doAnimate = animate && motionOn();

    for (const b of filterButtons) b.setAttribute('aria-pressed', String(b.dataset.cat === value));
    $('#archiveEmpty').hidden = next.length !== 0;
    const label = value === FINAL_FILTER ? '최종 프로젝트' : value;
    status.textContent = value ? `${label} ${next.length}편을 보고 있습니다.` : `전체 ${next.length}편을 보고 있습니다.`;

    const commit = () => {
      // FLIP: remember where the staying rows were, change the layout, then play them home.
      const first = new Map();
      if (doAnimate) for (const r of before) if (nextSet.has(r)) first.set(r, r.getBoundingClientRect().top);
      for (const r of rows) r.hidden = !nextSet.has(r);
      if (doAnimate) {
        const vh = window.innerHeight;
        let k = 0;
        for (const r of next) {
          const top = r.getBoundingClientRect().top;
          const onScreen = top < vh && top > -r.offsetHeight;
          if (first.has(r)) {
            const dy = first.get(r) - top;
            if (Math.abs(dy) > 1 && (onScreen || Math.abs(first.get(r)) < vh)) {
              r.animate([{ transform: `translateY(${dy}px)` }, { transform: 'none' }], { duration: 640, easing: EASE.expo });
            }
          } else {
            r.classList.add('is-in');
            if (onScreen) {
              r.animate([{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'none' }], {
                duration: 640, delay: Math.min(k, 8) * 60, easing: EASE.expo, fill: 'backwards',
              });
              k += 1;
            }
          }
        }
      } else {
        for (const r of next) r.classList.add('is-in');
      }
      queueFrame();
    };

    if (doAnimate && leaving.length) {
      for (const r of leaving) {
        r.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.98)' }], { duration: 200, easing: EASE.exit, fill: 'forwards' });
      }
      filterTimer = window.setTimeout(() => {
        for (const r of leaving) for (const a of r.getAnimations()) a.cancel();
        commit();
      }, 200);
    } else commit();
  };
  filters.addEventListener('click', (e) => {
    const b = e.target.closest('.filter');
    if (b) applyFilter(b.dataset.cat);
  });
  $('#emptyReset').addEventListener('click', () => applyFilter(''));
  applyFilter('', false);

  /* ---------- notes ---------- */
  const notesList = $('#notesList');
  (data.notes || []).forEach((n, i) => {
    const note = el('div', { class: 'note' }, [el('h3', { text: n.title }), el('p', { text: n.text })]);
    notesList.append(note);
    reveal(note, (i % 2) * 90 + Math.floor(i / 2) * 40);
  });

  const footName = $('#footName');
  if (!(window.CSS && CSS.supports && CSS.supports('animation-timeline: view()'))) reveal(footName);

  /* ---------- typographic card: the stage for work without footage ---------- */
  const cardLines = (g) => {
    const details = detailsOf(g);
    if (details.length) return details.map((d) => ({ label: d.title, text: firstSentence(d.text) }));
    const lines = [];
    if (g.description) lines.push({ label: '소개', text: firstSentence(g.description) });
    for (const f of g.features || []) lines.push({ label: '주요 기능', text: f });
    return lines;
  };

  const buildCard = (g, { bare = false } = {}) => {
    const lines = cardLines(g);
    const engineWord = (g.engine || '').split('·')[0].trim();
    const word = [g.category, engineWord].filter(Boolean).join(' · ');
    const hasStills = imagesOf(g).length > 0;
    const factRows = [['분류', g.category], ['엔진', g.engine], ['기간', when(g)], ['상태', g.status]].filter((r) => r[1]);
    const label = el('span', { class: 'card__line-label', text: lines[0] ? lines[0].label : '' });
    const text = el('span', { class: 'card__line-text', text: lines[0] ? lines[0].text : '' });
    const lineBox = el('p', { class: 'card__line' }, [label, text]);
    const node = el('div', { class: bare ? 'card card--bare' : 'card', 'aria-hidden': 'true' }, [
      el('p', { class: 'card__word' }, el('span', { class: 'card__track' }, [0, 1, 2, 3].map(() => el('span', { text: word })))),
      el('div', { class: 'card__head' }, [
        el('div', { class: 'card__mask' }, el('p', { class: 'card__title', text: g.title })),
        el('p', { class: 'card__sub', text: g.subtitle }),
        el('p', { class: 'card__mini', text: hasStills ? `정보 카드 · ${g.category}` : `정보 카드 · 화면 없음` }),
      ]),
      el('dl', { class: 'card__facts' }, factRows.map(([k, v], i) => {
        const d = el('div', {}, [el('dt', { text: k }), el('dd', { text: v })]);
        d.style.setProperty('--i', i);
        return d;
      })),
      lines.length ? lineBox : null,
      el('p', { class: 'card__tag', text: hasStills ? `정보 카드 · 캡처 ${imagesOf(g).length}장 · 등록된 영상 없음` : '정보 카드 · 확보한 실행 화면 없음' }),
    ]);
    return { node, lines, label, text, lineBox, i: 0 };
  };

  const rotateCard = (card) => {
    if (card.lines.length < 2) return;
    card.i = (card.i + 1) % card.lines.length;
    const line = card.lines[card.i];
    const set = () => { card.label.textContent = line.label; card.text.textContent = line.text; };
    if (!motionOn()) { set(); return; }
    const out = card.lineBox.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-10px)' }], { duration: 220, easing: EASE.exit, fill: 'forwards' });
    out.onfinish = () => {
      set();
      out.cancel();
      card.lineBox.animate([{ opacity: 0, transform: 'translateY(14px)' }, { opacity: 1, transform: 'none' }], { duration: 560, easing: EASE.out });
    };
  };
  const CARD_LINE_MS = 4200;

  /* ---------- the stage ---------- */
  const stageEl = $('#stage');
  const stage = {
    layers: [...document.querySelectorAll('.stage__layer')],
    front: 0,
    key: '',
    gameId: '',
    playlist: [],
    index: 0,
    timer: 0,
    clearTimer: 0,
    cardTimer: 0,
    card: null,
    timerAnim: null,
    paused: !motionOn(),
    visible: true,
    mode: '',
    reelIndex: 0,
  };
  const stageTitle = $('#stageTitle');
  const stageWhere = $('#stageWhere');
  const stageCaption = $('#stageCaption');
  const stageStrip = $('#stageStrip');
  const stageTimer = $('#stageTimer');
  const toggle = $('#stageToggle');

  // One stage item per media file: a game's videos; otherwise its captures followed by its information card;
  // with nothing at all, the card alone.
  const itemsFor = (g) => {
    const videos = videosOf(g).map((v) => ({ game: g, kind: 'video', src: v.src, poster: v.poster, caption: v.caption, alt: v.title }));
    if (videos.length) return videos;
    const stills = imagesOf(g).map((im) => ({ game: g, kind: 'image', src: im.src, caption: im.caption, alt: im.alt, pos: im.pos }));
    const card = {
      game: g,
      kind: 'card',
      caption: stills.length ? '정보 카드 · 등록된 영상이 없어 캡처와 함께 작품 정보를 보여 줍니다.' : `확보한 실행 화면이 없어 정보 카드로 소개합니다 · ${g.status}`,
    };
    return [...stills, card];
  };
  const reelGames = finals.length || featured.length ? [...finals, ...featured] : games.slice(0, 6);
  const reel = reelGames.map((g) => itemsFor(g)[0]);
  const holdFor = (item) => (item.kind === 'image' ? 6000 : 9000);

  const KEN_BURNS = [
    [[1.12, -2, -1.5], [1.0, 1, 1]],
    [[1.0, 1.5, 1], [1.11, -1.5, -1]],
    [[1.1, 2, -1], [1.02, -1, 1.2]],
    [[1.03, -1, 1.5], [1.12, 1.6, -1]],
  ];
  let kenIndex = 0;
  const kenBurns = (img, ms) => {
    if (!motionOn()) return;
    const [[s0, x0, y0], [s1, x1, y1]] = KEN_BURNS[kenIndex++ % KEN_BURNS.length];
    img.animate([
      { transform: `translate(${x0}%, ${y0}%) scale(${s0})` },
      { transform: `translate(${x1}%, ${y1}%) scale(${s1})` },
    ], { id: 'ken-burns', duration: ms + 2000, easing: 'linear', fill: 'both' });
  };

  const stopVideo = (v) => { v.pause(); v.removeAttribute('src'); v.load(); };

  const buildMedia = (item) => {
    if (item.kind === 'video') {
      const v = el('video', { muted: true, loop: true, playsInline: true, preload: 'auto', 'aria-label': `${item.game.title} · ${item.alt}` });
      v.muted = true;
      v.setAttribute('muted', '');
      v.setAttribute('playsinline', '');
      if (item.poster) v.poster = item.poster;
      v.src = item.src;
      return { node: v };
    }
    if (item.kind === 'image') {
      const img = el('img', { src: item.src, alt: item.alt, decoding: 'async' });
      if (item.pos) img.style.objectPosition = item.pos;
      kenBurns(img, holdFor(item));
      return { node: img };
    }
    const card = buildCard(item.game);
    return { node: card.node, card };
  };

  const playbackAllowed = () => !stage.paused && stage.visible && !document.hidden;
  const playFront = () => {
    const v = stage.layers[stage.front].querySelector('video');
    if (!v) return;
    if (playbackAllowed()) v.play().catch(() => {});
    else v.pause();
  };
  const holdAnimations = () => {
    const run = playbackAllowed();
    for (const layer of stage.layers) {
      // Only the slow drift on stills holds with the stage; entrances, wipes and transitions always finish.
      for (const a of layer.getAnimations({ subtree: true })) {
        if (a.id !== 'ken-burns') continue;
        if (!run && a.playState === 'running') a.pause();
        else if (run && a.playState === 'paused') a.play();
      }
    }
    stageEl.classList.toggle('is-paused', !run);
  };

  const stopCard = () => { window.clearInterval(stage.cardTimer); stage.cardTimer = 0; };
  const startCard = () => {
    stopCard();
    const c = stage.card;
    if (!c || c.lines.length < 2 || !playbackAllowed()) return;
    stage.cardTimer = window.setInterval(() => rotateCard(c), CARD_LINE_MS);
  };

  const stopTimerBar = () => { if (stage.timerAnim) { stage.timerAnim.cancel(); stage.timerAnim = null; } };
  const runTimerBar = (ms) => {
    stopTimerBar();
    if (!motionOn()) return;
    stage.timerAnim = stageTimer.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' });
  };

  const swapMeta = (item) => {
    const g = item.game;
    const newGame = g.id !== stage.gameId;
    stage.gameId = g.id;
    stageWhere.replaceChildren(
      ...(g.final === true ? [el('strong', { text: '최종 프로젝트' }), ' · '] : []),
      [g.category, when(g)].filter(Boolean).join(' · '),
    );
    stageCaption.textContent = item.caption || '';
    if (newGame) stageTitle.textContent = g.title;
    if (motionOn()) {
      if (newGame) stageTitle.animate([{ transform: 'translateY(105%)' }, { transform: 'none' }], { duration: 900, easing: EASE.expo });
      stageCaption.animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 140, easing: EASE.out, fill: 'backwards' });
    }
    if (!newGame) return;
    const stills = imagesOf(g).filter((im) => im.src !== item.src && im.src !== item.poster).slice(0, 4);
    stageStrip.replaceChildren(...stills.map((im, i) => {
      const img = el('img', { src: im.src, alt: im.alt, loading: 'lazy', decoding: 'async' });
      if (im.pos) img.style.objectPosition = im.pos;
      if (motionOn()) {
        img.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: 600, delay: 180 + i * 70, easing: EASE.out, fill: 'backwards' });
      }
      return img;
    }));
  };

  const LEAVE_TO = { down: 'translateY(-6%)', up: 'translateY(6%)', next: 'translateX(-8%)' };
  const ENTER_FROM = { down: 'inset(100% 0 0 0)', up: 'inset(0 0 100% 0)', next: 'inset(0 0 0 100%)' };
  const show = (item, dir = 'down') => {
    const back = stage.layers[1 - stage.front];
    const old = stage.layers[stage.front];
    window.clearTimeout(stage.clearTimer);
    stopCard();
    for (const a of back.getAnimations({ subtree: true })) a.cancel();
    back.querySelectorAll('video').forEach(stopVideo);
    const built = buildMedia(item);
    back.replaceChildren(built.node);
    back.classList.remove('is-leaving');
    back.classList.add('is-on');
    old.classList.remove('is-on');
    old.classList.add('is-leaving');
    stage.front = 1 - stage.front;
    stage.card = built.card || null;

    const moving = motionOn();
    if (moving) {
      back.animate([
        { clipPath: ENTER_FROM[dir] || ENTER_FROM.down, transform: 'scale(1.06)' },
        { clipPath: 'inset(0 0 0 0)', transform: 'none' },
      ], { duration: 1150, easing: EASE.io });
      old.animate([
        { transform: 'none', opacity: 1 },
        { transform: LEAVE_TO[dir] || LEAVE_TO.down, opacity: 0.3 },
      ], { duration: 1150, easing: EASE.io, fill: 'forwards' });
    }
    stage.clearTimer = window.setTimeout(() => {
      for (const a of old.getAnimations({ subtree: true })) a.cancel();
      old.querySelectorAll('video').forEach(stopVideo);
      old.replaceChildren();
      old.classList.remove('is-leaving');
    }, moving ? 1250 : 0);

    playFront();
    holdAnimations();
    startCard();
    swapMeta(item);
  };

  const schedule = () => {
    window.clearTimeout(stage.timer);
    if (!playbackAllowed() || stage.playlist.length < 2) { stopTimerBar(); return; }
    const hold = holdFor(stage.playlist[stage.index]);
    runTimerBar(hold);
    stage.timer = window.setTimeout(() => {
      stage.index = (stage.index + 1) % stage.playlist.length;
      if (stage.mode === 'reel') stage.reelIndex = stage.index;
      show(stage.playlist[stage.index], 'next');
      schedule();
    }, hold);
  };

  const setStage = (key, dir = 'down') => {
    if (key === stage.key) return;
    const playlist = key === 'reel' ? reel : (byId.has(key) ? itemsFor(byId.get(key)) : null);
    if (!playlist || !playlist.length) return;
    stage.key = key;
    stage.mode = key === 'reel' ? 'reel' : 'project';
    stage.playlist = playlist;
    stage.index = key === 'reel' ? stage.reelIndex : 0;
    show(stage.playlist[stage.index], dir);
    schedule();
    for (const node of document.querySelectorAll('.is-live')) node.classList.remove('is-live');
    if (key !== 'reel') document.querySelectorAll(`[data-id="${CSS.escape(key)}"]`).forEach((n) => n.classList.add('is-live'));
  };

  const refreshPlayback = () => {
    playFront();
    holdAnimations();
    startCard();
    schedule();
  };
  const syncToggle = () => {
    toggle.textContent = stage.paused ? '재생' : '멈춤';
    toggle.setAttribute('aria-pressed', String(stage.paused));
    toggle.setAttribute('aria-label', stage.paused ? '무대 재생' : '무대 멈춤');
  };
  toggle.addEventListener('click', () => {
    stage.paused = !stage.paused;
    syncToggle();
    refreshPlayback();
  });
  syncToggle();

  motionListeners.push((on) => {
    stage.paused = !on;
    syncToggle();
    refreshPlayback();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      window.clearTimeout(stage.timer);
      stopTimerBar();
      stopCard();
      const v = stage.layers[stage.front].querySelector('video');
      if (v) v.pause();
      document.querySelectorAll('.sheet video').forEach((sv) => sv.pause());
      holdAnimations();
    } else refreshPlayback();
  });

  // Pause the stage when it scrolls out of view (the notes and footer sit below the split).
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      const visible = entries[entries.length - 1].isIntersecting;
      if (visible === stage.visible) return;
      stage.visible = visible;
      refreshPlayback();
    }, { threshold: 0.05 }).observe(stageEl);
  }

  /* ---------- scroll sync: whichever entry crosses the reading line takes the stage ---------- */
  const hero = $('.hero');
  // Section heads are interludes: the stage goes back to the reel (final projects first).
  const entries = [...document.querySelectorAll('.sec-head, .feature, .row')];
  let pendingKey = '';
  let switchTimer = 0;
  let lastY = window.scrollY;
  let scrollDir = 'down';

  const pick = () => {
    const y = window.scrollY;
    if (y !== lastY) { scrollDir = y > lastY ? 'down' : 'up'; lastY = y; }
    if (sheet.open) return;
    const vh = window.innerHeight;
    const band = splitMQ.matches ? 0 : stageEl.getBoundingClientRect().height;
    const line = band + (vh - band) * (splitMQ.matches ? 0.45 : 0.3);
    let key = '';
    if (hero.getBoundingClientRect().bottom > line) key = 'reel';
    else {
      for (const entry of entries) {
        if (entry.hidden || entry.closest('[hidden]')) continue;
        const r = entry.getBoundingClientRect();
        if (r.top <= line && r.bottom >= line) { key = entry.dataset.id || 'reel'; break; }
      }
    }
    if (!key || key === pendingKey) return;
    pendingKey = key;
    window.clearTimeout(switchTimer);
    const dir = scrollDir;
    switchTimer = window.setTimeout(() => setStage(pendingKey, dir), stage.key ? 160 : 0);
  };
  onFrame = pick;

  /* hover or keyboard focus on an entry previews it on the stage (desktop split only for hover) */
  const column = $('#main');
  let hoverTimer = 0;
  let hoverKey = '';
  column.addEventListener('pointerover', (e) => {
    if (!hoverMQ.matches || !splitMQ.matches || sheet.open) return;
    if (performance.now() - lastScrollAt < 400) return;
    const host = e.target.closest('.row, .feature');
    if (!host || host.dataset.id === hoverKey) return;
    hoverKey = host.dataset.id;
    window.clearTimeout(hoverTimer);
    hoverTimer = window.setTimeout(() => { pendingKey = hoverKey; setStage(hoverKey, 'next'); }, 220);
  });
  column.addEventListener('pointerleave', () => {
    window.clearTimeout(hoverTimer);
    if (!hoverKey) return;
    hoverKey = '';
    pendingKey = '';
    queueFrame();
  });
  column.addEventListener('focusin', (e) => {
    if (sheet.open) return;
    const host = e.target.closest('.row, .feature');
    if (host) { pendingKey = host.dataset.id; setStage(host.dataset.id, 'next'); }
  });

  /* ---------- detail sheet ---------- */
  const sheet = $('#sheet');
  const sheetBody = $('#sheetBody');
  let opener = null;
  let closing = false;
  let closeTimer = 0;
  let sheetCardTimer = 0;

  const sheetVideoObserver = 'IntersectionObserver' in window
    ? new IntersectionObserver((list) => {
        for (const entry of list) if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
      }, { root: sheet, threshold: 0.2 })
    : null;

  const mediaFigure = (kind, item, lazy) => {
    const media = kind === 'video'
      ? el('video', { controls: true, playsInline: true, preload: 'metadata', poster: item.poster || null, src: item.src, 'aria-label': item.title })
      : el('img', { src: item.src, alt: item.alt, loading: lazy ? 'lazy' : null, decoding: 'async' });
    if (kind === 'image' && item.pos) media.style.objectPosition = item.pos;
    if (kind === 'video' && sheetVideoObserver) sheetVideoObserver.observe(media);
    const fig = el('figure', { class: 'media' }, [
      media,
      el('figcaption', {}, [kind === 'video' ? el('strong', { text: item.title }) : null, item.caption]),
    ]);
    return fig;
  };

  const openSheet = (id, from) => {
    const g = byId.get(id);
    if (!g) return;
    window.clearTimeout(closeTimer);
    closing = false;
    sheet.classList.remove('is-closing');
    opener = from || null;
    const isFinal = g.final === true;
    $('#sheetCrumb').replaceChildren(
      ...(isFinal ? [el('strong', { text: '최종 프로젝트' }), ' · '] : []),
      [g.category, when(g)].filter(Boolean).join(' · '),
    );
    const videos = videosOf(g);
    const images = imagesOf(g);
    const noMedia = videos.length === 0 && images.length === 0;
    const details = detailsOf(g);
    let card = null;
    if (noMedia) card = buildCard(g, { bare: true });

    const items = [
      card ? el('div', { class: 'sheet__card' }, card.node) : null,
      el('h2', { class: 'sheet__title t-mask', id: 'sheetTitle' }, el('span', { text: g.title })),
      el('p', { class: 'sheet__sub', text: g.subtitle }),
      isFinal ? el('p', { class: 'sheet__final', text: `최종 프로젝트 ${countWord(finals.length)} 편 가운데 하나입니다.` }) : null,
      el('p', { class: 'sheet__status' }, [el('span', { text: '현재 상태' }), el('strong', { text: g.status })]),
      el('p', { class: 'sheet__desc', text: g.description }),
      details.length
        ? el('div', { class: `details${noMedia ? ' details--lead' : ''}` }, details.map((d) => el('section', { class: 'detail' }, [
            el('h3', { text: d.title }),
            el('p', { text: d.text }),
          ])))
        : null,
      factsList(g, { withTools: true, withStatus: false }),
      g.features && g.features.length ? el('h3', { text: '주요 기능' }) : null,
      g.features && g.features.length ? el('ul', { class: 'sheet__list' }, g.features.map((f) => el('li', { text: f }))) : null,
      g.history && g.history.length ? el('h3', { text: '개발 기록' }) : null,
      g.history && g.history.length ? el('ol', { class: 'sheet__list' }, g.history.map((h) => el('li', { text: h }))) : null,
    ];
    if (noMedia) {
      items.push(
        el('h3', { text: '화면과 영상' }),
        el('p', { class: 'sheet__empty', text: '확보한 실행 화면과 영상이 없어 글과 정보 카드로 기록했습니다. 다른 게임의 화면을 대신 쓰지 않습니다.' }),
      );
    } else {
      items.push(
        el('h3', { text: '영상' }),
        videos.length
          ? el('div', {}, videos.map((v) => mediaFigure('video', v)))
          : el('p', { class: 'sheet__empty', text: '이 작품에는 등록된 영상이 없습니다.' }),
        el('h3', { text: '화면' }),
        images.length
          ? el('div', { class: 'gallery' }, images.map((im, i) => mediaFigure('image', im, i > 0)))
          : el('p', { class: 'sheet__empty', text: '확보한 실행 화면이 없습니다.' }),
      );
    }
    const children = items.filter(Boolean);
    let n = 0;
    for (const child of children) {
      if (child.classList.contains('sheet__title')) continue;
      if (n < 10) { child.classList.add('s-item'); child.style.setProperty('--i', n); }
      n += 1;
    }
    sheetBody.replaceChildren(...children);
    sheetBody.querySelectorAll('.gallery .media').forEach((fig, i) => { if (i > 0) reveal(fig); });

    window.clearInterval(sheetCardTimer);
    if (card && card.lines.length > 1 && motionOn()) sheetCardTimer = window.setInterval(() => rotateCard(card), CARD_LINE_MS);

    pendingKey = g.id;
    setStage(g.id, 'next');
    // On narrow screens the sheet opens under the stage band, so the project keeps playing above it.
    const bandBottom = splitMQ.matches ? 0 : Math.max(0, Math.round(stageEl.getBoundingClientRect().bottom));
    html.style.setProperty('--sheet-top', `${bandBottom}px`);
    if (!sheet.open) sheet.showModal();
    sheet.scrollTop = 0;
    $('#sheetClose').focus();
    try { history.replaceState(null, '', `#p=${g.id}`); } catch (e) { /* file:// may refuse; the sheet still opens */ }
  };

  const closeSheet = () => {
    if (!sheet.open || closing) return;
    if (!motionOn()) { sheet.close(); return; }
    closing = true;
    sheet.classList.add('is-closing');
    closeTimer = window.setTimeout(() => { if (sheet.open) sheet.close(); }, 300);
  };
  sheet.addEventListener('cancel', (e) => {
    e.preventDefault();
    closeSheet();
  });
  sheet.addEventListener('close', () => {
    window.clearTimeout(closeTimer);
    window.clearInterval(sheetCardTimer);
    closing = false;
    sheet.classList.remove('is-closing');
    sheet.querySelectorAll('video').forEach((v) => v.pause());
    try {
      if (/^#p=/.test(location.hash)) history.replaceState(null, '', location.pathname + location.search);
    } catch (e) { /* ignore */ }
    if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    pendingKey = '';
    queueFrame();
  });
  $('#sheetClose').addEventListener('click', closeSheet);
  sheet.addEventListener('click', (e) => {
    if (e.target !== sheet) return;
    const r = sheet.getBoundingClientRect();
    const inside = e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom;
    if (!inside) closeSheet();
  });
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-open]');
    if (b) openSheet(b.dataset.open, b);
  });

  setStage('reel', 'down');
  pendingKey = 'reel';
  queueFrame();

  // #p=<id> opens a project directly (shareable link to a detail).
  const hashMatch = /^#p=([\w-]+)$/.exec(location.hash);
  if (hashMatch && byId.has(hashMatch[1])) openSheet(hashMatch[1]);
})();
