(() => {
  'use strict';

  const html = document.documentElement;
  const $ = (sel) => document.querySelector(sel);
  const MOTION_KEY = 'gp-motion';
  const reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  const SECTIONS = ['intro', 'work', 'development', 'media', 'notes'];
  const DEFAULT_ID = 'necro-climb';
  const CAT_ALL = 'all';
  const CAT_FINAL = 'final';
  const SITE_TITLE = '김준식 — 게임 포트폴리오';

  const header = $('#siteHeader');
  const main = $('#main');
  const projectRoot = $('#projectRoot');
  const catSelect = $('#categorySelect');
  const gameSelect = $('#gameSelect');
  const sectionNav = $('#sectionNav');
  const motionBtn = $('#motionToggle');
  const routeStatus = $('#routeStatus');
  const dataError = $('#dataError');
  const notesSection = $('#notes');
  const notesList = $('#notesList');

  const el = (tag, props = {}, children = []) => {
    const node = document.createElement(tag);
    // Insertion order matters: `loading` and `preload` are set before `src`, so nothing downloads early.
    for (const [key, value] of Object.entries(props)) {
      if (value == null || value === false) continue;
      if (key === 'class') node.className = value;
      else if (key === 'text') node.textContent = value;
      else node.setAttribute(key, value === true ? '' : String(value));
    }
    for (const child of [].concat(children)) {
      if (child == null || child === false) continue;
      node.append(child);
    }
    return node;
  };
  const list = (v) => (Array.isArray(v) ? v : []);
  const texts = (v) => list(v).filter((s) => typeof s === 'string' && s);

  /* ---------- motion preference (gp-motion, else the OS setting; the head script applied it first) ---------- */
  const motionOn = () => html.dataset.motion !== 'off';
  const motionListeners = [];
  const syncMotionButton = () => {
    if (!motionBtn) return;
    const on = motionOn();
    motionBtn.textContent = on ? '모션 끄기' : '모션 켜기';
    motionBtn.setAttribute('aria-label', on ? '화면 모션과 대표 영상 자동 재생 끄기' : '화면 모션과 대표 영상 자동 재생 켜기');
    motionBtn.removeAttribute('aria-pressed');
  };
  const setMotion = (on, persist) => {
    html.dataset.motion = on ? 'on' : 'off';
    if (persist) {
      try { localStorage.setItem(MOTION_KEY, on ? 'on' : 'off'); } catch (e) { /* storage unavailable: the choice lasts this visit */ }
    }
    syncMotionButton();
    for (const fn of motionListeners) fn(on);
  };
  if (motionBtn) motionBtn.addEventListener('click', () => setMotion(!motionOn(), true));
  reduceMQ.addEventListener('change', () => {
    let saved = null;
    try { saved = localStorage.getItem(MOTION_KEY); } catch (e) { saved = null; }
    if (saved !== 'on' && saved !== 'off') setMotion(!reduceMQ.matches, false);
  });
  syncMotionButton();

  /* ---------- reveal: .is-in once in view; immediately when motion is off ---------- */
  const makeRevealer = () => {
    const pending = new Set();
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver((entries) => {
          for (const entry of entries) {
            if (!entry.isIntersecting) continue;
            entry.target.classList.add('is-in');
            pending.delete(entry.target);
            io.unobserve(entry.target);
          }
        }, { rootMargin: '0px 0px -6% 0px' })
      : null;
    return {
      observe(node) {
        if (!io || !motionOn()) { node.classList.add('is-in'); return; }
        pending.add(node);
        io.observe(node);
      },
      flush() {
        for (const node of pending) node.classList.add('is-in');
        pending.clear();
        if (io) io.disconnect();
      },
      disconnect() {
        pending.clear();
        if (io) io.disconnect();
      },
    };
  };
  const staticReveal = makeRevealer();
  motionListeners.push((on) => { if (!on) staticReveal.flush(); });

  /* ---------- data ---------- */
  const data = window.PORTFOLIO;
  const games = data && Array.isArray(data.games)
    ? data.games.filter((g) => g && typeof g.id === 'string' && g.id && typeof g.title === 'string' && g.title)
    : [];
  if (!games.length) {
    if (dataError) dataError.hidden = false;
    if (projectRoot) projectRoot.replaceChildren();
    for (const s of [catSelect, gameSelect]) if (s) s.disabled = true;
    document.querySelectorAll('[data-reveal]').forEach((n) => n.classList.add('is-in'));
    return;
  }

  const isFinal = (g) => g.final === true;
  const finals = games.filter(isFinal);
  const ordered = [...finals, ...games.filter((g) => !isFinal(g))];
  const byId = new Map(games.map((g) => [g.id, g]));
  const defaultId = byId.has(DEFAULT_ID) ? DEFAULT_ID : ordered[0].id;
  const genres = [...new Set(games.map((g) => g.category).filter(Boolean))];
  const imagesOf = (g) => list(g.images).filter((m) => m && typeof m.src === 'string' && m.src);
  const videosOf = (g) => list(g.videos).filter((m) => m && typeof m.src === 'string' && m.src);
  const detailsOf = (g) => list(g.details).filter((d) => d && d.title && d.text);
  const notes = list(data.notes).filter((n) => n && n.title && n.text);
  const hasSection = (g, s) => (s === 'development' ? texts(g.history).length > 0 : s === 'notes' ? notes.length > 0 : SECTIONS.includes(s));

  const inCat = (g, cat) => cat === CAT_ALL || (cat === CAT_FINAL ? isFinal(g) : g.category === cat);
  const validCat = (cat) => cat === CAT_ALL || (cat === CAT_FINAL && finals.length > 0) || genres.includes(cat);
  const gamesIn = (cat) => ordered.filter((g) => inCat(g, cat));
  const catLabel = (cat) => (cat === CAT_ALL ? '전체' : cat === CAT_FINAL ? '최종 프로젝트' : cat);

  /* ---------- notes (static, outside the project page) ---------- */
  if (notesList) {
    notesList.replaceChildren(...notes.map((n, i) => {
      const note = el('article', { class: 'note', 'data-kind': n.kind || null }, [el('h3', { text: n.title }), el('p', { text: n.text })]);
      note.style.setProperty('--i', i);
      return note;
    }));
  }
  if (notesSection) {
    notesSection.setAttribute('tabindex', '-1');
    if (!notes.length) notesSection.hidden = true;
    notesSection.querySelectorAll('[data-reveal]').forEach((n) => staticReveal.observe(n));
    if (notesList) for (const n of notesList.children) { n.setAttribute('data-reveal', ''); staticReveal.observe(n); }
  }
  // Anything else the shell marks for reveal outside the project page.
  document.querySelectorAll('[data-reveal]:not(.is-in)').forEach((n) => {
    if (!notesSection || !notesSection.contains(n)) staticReveal.observe(n);
  });

  /* ---------- header pickers ---------- */
  const countOf = (cat) => gamesIn(cat).length;
  if (catSelect) {
    catSelect.replaceChildren(...[
      el('option', { value: CAT_ALL, text: `전체 (${games.length})` }),
      finals.length ? el('option', { value: CAT_FINAL, text: `최종 프로젝트 (${finals.length})` }) : null,
      ...genres.map((c) => el('option', { value: c, text: `${c} (${countOf(c)})` })),
    ].filter(Boolean));
  }
  let filledCat = null;
  const fillGames = (cat) => {
    if (!gameSelect || cat === filledCat) return;
    filledCat = cat;
    const items = gamesIn(cat);
    const fin = items.filter(isFinal);
    const rest = items.filter((g) => !isFinal(g));
    const option = (g) => el('option', { value: g.id, text: g.title });
    gameSelect.replaceChildren(...(fin.length && rest.length
      ? [el('optgroup', { label: '최종 프로젝트' }, fin.map(option)), el('optgroup', { label: '다른 작품' }, rest.map(option))]
      : items.map(option)));
  };

  /* ---------- state ---------- */
  const state = { id: '', cat: CAT_ALL, page: null };
  let heroUserPaused = false; // the visitor paused the intro video; stays until they press play again
  let appliedHash = null;

  const say = (() => {
    let timer = 0;
    return (msg) => {
      if (!routeStatus) return;
      window.clearTimeout(timer);
      routeStatus.textContent = '';
      timer = window.setTimeout(() => { routeStatus.textContent = msg; }, 80);
    };
  })();

  const headerOffset = () => {
    if (!header) return 0;
    const pos = window.getComputedStyle(header).position;
    if (pos !== 'sticky' && pos !== 'fixed') return 0;
    return Math.max(0, header.getBoundingClientRect().bottom);
  };
  const scrollToY = (y) => window.scrollTo({ top: Math.max(0, Math.round(y)), left: 0, behavior: 'instant' });
  const sectionNode = (name) => {
    if (name === 'notes') return notesSection;
    const p = state.page;
    return p ? p.sections.get(name) || null : null;
  };
  const scrollToSection = (name) => {
    const node = sectionNode(name);
    if (!node || name === 'intro') { scrollToY(0); return node; }
    scrollToY(node.getBoundingClientRect().top + window.scrollY - headerOffset());
    return node;
  };

  /* ---------- playback: one video at a time; the intro video only when allowed ---------- */
  const heroWants = (p) => !!p.video && !p.failed && !p.blocked && !heroUserPaused && (motionOn() || p.userPlayed);
  const heroMayRun = (p) => heroWants(p) && !p.held && p.visible && !document.hidden;

  const syncHeroControls = (p) => {
    if (!p.toggle) return;
    const v = p.video;
    if (p.failed) {
      p.toggle.disabled = true;
      p.toggle.textContent = '재생 불가';
      p.toggle.dataset.state = 'error';
      p.toggle.setAttribute('aria-label', '대표 영상을 불러오지 못했습니다');
    } else {
      const playing = !v.paused || p.pending;
      p.toggle.textContent = playing ? '일시정지' : '재생';
      p.toggle.dataset.state = playing ? 'playing' : 'paused';
      p.toggle.setAttribute('aria-label', playing ? '대표 영상 일시정지' : '대표 영상 재생');
    }
    if (p.sound) {
      p.sound.disabled = p.failed;
      p.sound.textContent = v.muted ? '소리 켜기' : '소리 끄기';
      p.sound.dataset.state = v.muted ? 'muted' : 'unmuted';
      p.sound.setAttribute('aria-label', v.muted ? '대표 영상 소리 켜기' : '대표 영상 소리 끄기');
    }
  };

  const syncHero = () => {
    const p = state.page;
    if (!p || !p.video) return;
    const v = p.video;
    if (heroMayRun(p)) {
      if (v.paused && !p.pending) {
        if (v.getAttribute('preload') !== 'auto') v.setAttribute('preload', 'auto');
        p.pending = true;
        let attempt;
        try { attempt = v.play(); } catch (e) { attempt = Promise.reject(e); }
        Promise.resolve(attempt).then(() => {
          p.pending = false;
          // A newer project, a pause or a scroll may have landed while play() was pending.
          if (state.page !== p || !heroMayRun(p)) v.pause();
          syncHeroControls(p);
        }, (err) => {
          p.pending = false;
          if (state.page === p && err && err.name === 'NotAllowedError') p.blocked = true;
          syncHeroControls(p);
        });
      }
    } else if (!v.paused || p.pending) {
      v.pause();
    }
    syncHeroControls(p);
  };

  const pauseOthers = (keep) => {
    for (const m of document.querySelectorAll('video, audio')) if (m !== keep && !m.paused) m.pause();
  };

  document.addEventListener('play', (e) => {
    const v = e.target;
    if (!(v instanceof HTMLMediaElement)) return;
    const p = state.page;
    if (!p || !p.root.contains(v) || document.hidden) { v.pause(); return; }
    if (v !== p.video) {
      // Started without being on screen (media keys, devtools): the visibility observer would never fire for it.
      const r = v.getBoundingClientRect();
      if (!r.width || r.bottom <= headerOffset() || r.top >= window.innerHeight) { v.pause(); return; }
    }
    pauseOthers(v);
    if (v === p.video) {
      p.held = false;
    } else {
      p.held = true;
      syncHero();
    }
  }, true);
  const onBodyStop = (e) => {
    const v = e.target;
    const p = state.page;
    if (!p || !(v instanceof HTMLMediaElement) || v === p.video || !p.root.contains(v)) return;
    if (p.held && !p.bodyVideos.some((b) => !b.paused)) {
      p.held = false;
      syncHero();
    }
  };
  document.addEventListener('pause', onBodyStop, true);
  document.addEventListener('ended', onBodyStop, true);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) pauseOthers(null);
    syncHero();
  });
  motionListeners.push((on) => {
    const p = state.page;
    if (!p) return;
    if (!on) {
      p.userPlayed = false;
      p.reveal.flush();
    }
    syncHero();
  });

  /* ---------- project page ---------- */
  const setFormat = (node, w, h) => {
    if (!w || !h) return;
    const ar = w / h;
    node.style.setProperty('--ar', ar.toFixed(4));
    node.dataset.format = ar >= 1 ? 'landscape' : 'portrait';
  };

  const destroyPage = () => {
    const p = state.page;
    if (!p) return;
    state.page = null;
    p.ctl.abort();
    for (const o of p.observers) o.disconnect();
    p.reveal.disconnect();
    for (const v of p.root.querySelectorAll('video')) {
      v.pause();
      v.removeAttribute('src');
      v.load(); // drops the buffered data and any download in flight
    }
    for (const img of p.root.querySelectorAll('img')) if (!img.complete) img.removeAttribute('src');
    p.root.remove();
  };

  const sectionHead = (id, title) => el('header', { class: 'section__head', 'data-reveal': true }, el('h2', { id, text: title }));

  const buildHero = (g, p, on) => {
    const videos = videosOf(g);
    const images = imagesOf(g);
    const v0 = videos[0];
    const im0 = images[0];
    const kind = v0 ? 'video' : im0 ? 'image' : 'empty';
    const hero = el('section', { id: 'intro', class: 'hero', 'data-kind': kind, 'aria-labelledby': 'gameTitle', tabindex: '-1' });
    const stage = el('div', { class: 'hero__stage' });
    const body = el('div', { class: 'hero__body' });
    const errorLine = (msg) => {
      hero.dataset.error = kind;
      if (!body.querySelector('.hero__error')) body.append(el('p', { class: 'hero__error', text: msg }));
    };

    const ambientSrc = v0 ? v0.poster : im0 ? im0.src : '';
    if (ambientSrc) {
      const ambient = el('img', { class: 'hero__ambient', alt: '', 'aria-hidden': 'true', decoding: 'async', src: ambientSrc });
      on(ambient, 'load', () => { if (!hero.dataset.format) setFormat(hero, ambient.naturalWidth, ambient.naturalHeight); });
      on(ambient, 'error', () => ambient.remove());
      if (ambient.complete && ambient.naturalWidth) setFormat(hero, ambient.naturalWidth, ambient.naturalHeight);
      stage.append(ambient);
    }

    if (v0) {
      const video = el('video', {
        class: 'hero__video',
        preload: motionOn() && !heroUserPaused ? 'auto' : 'metadata',
        muted: true,
        loop: true,
        playsinline: true,
        poster: v0.poster || null,
        'aria-label': `대표 영상 · ${v0.title || g.title}`,
      });
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.src = v0.src;
      on(video, 'loadedmetadata', () => setFormat(hero, video.videoWidth, video.videoHeight));
      on(video, 'play', () => syncHeroControls(p));
      on(video, 'pause', () => syncHeroControls(p));
      on(video, 'volumechange', () => syncHeroControls(p));
      on(video, 'error', () => {
        p.failed = true;
        p.pending = false;
        errorLine('대표 영상을 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요. 캡션과 아래 작업 내용은 그대로 읽을 수 있습니다.');
        syncHeroControls(p);
      });
      p.video = video;
      stage.append(el('div', { class: 'hero__media' }, video));
    } else if (im0) {
      const img = el('img', { class: 'hero__image', alt: im0.alt || '', decoding: 'async', fetchpriority: 'high', src: im0.src });
      if (im0.pos) img.style.objectPosition = im0.pos;
      on(img, 'load', () => setFormat(hero, img.naturalWidth, img.naturalHeight));
      on(img, 'error', () => errorLine('대표 화면을 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요. 캡션과 아래 작업 내용은 그대로 읽을 수 있습니다.'));
      if (img.complete && img.naturalWidth) setFormat(hero, img.naturalWidth, img.naturalHeight);
      stage.append(el('div', { class: 'hero__media' }, img));
    } else {
      stage.append(el('div', { class: 'hero__empty' }, [
        el('p', { class: 'hero__empty-label', text: '화면 기록 없음' }),
        el('p', { class: 'hero__empty-text', text: '이 작품은 확보한 실행 화면과 영상이 없어 글로 기록했습니다. 다른 게임의 화면을 대신 쓰지 않습니다.' }),
        el('p', { class: 'hero__empty-status', text: `현재 상태 · ${g.status || '기록 없음'}` }),
      ]));
    }

    const metaParts = [
      isFinal(g) ? el('span', { class: 'hero__badge', text: '최종 프로젝트' }) : null,
      g.category ? el('span', { class: 'hero__category', text: g.category }) : null,
      g.engine ? el('span', { class: 'hero__engine', text: g.engine }) : null,
    ].filter(Boolean);
    const meta = el('p', { class: 'hero__meta' });
    metaParts.forEach((part, i) => { if (i) meta.append(' · '); meta.append(part); });

    const actions = el('div', { class: 'hero__actions' });
    if (v0) {
      p.toggle = el('button', { class: 'hero__btn', id: 'heroToggle', type: 'button' });
      on(p.toggle, 'click', () => {
        const v = p.video;
        if (p.failed) return;
        if (!v.paused || p.pending) {
          heroUserPaused = true;
          p.userPlayed = false;
        } else {
          heroUserPaused = false;
          p.userPlayed = true;
          p.blocked = false;
          p.held = false;
          p.visible = true; // pressed on screen; the observer takes over on the next crossing
        }
        syncHero();
      });
      actions.append(p.toggle);
      if (/소리 있음/.test(v0.caption || '')) {
        p.sound = el('button', { class: 'hero__btn hero__btn--sound', id: 'heroSound', type: 'button' });
        on(p.sound, 'click', () => {
          const v = p.video;
          v.muted = !v.muted;
          if (!v.muted && v.paused && !p.pending) {
            heroUserPaused = false;
            p.userPlayed = true;
            p.blocked = false;
            p.held = false;
            p.visible = true;
            syncHero();
          }
          syncHeroControls(p);
        });
        actions.append(p.sound);
      }
    }
    actions.append(el('a', { class: 'hero__link', 'data-section': 'work', href: hrefFor(g.id, 'work') }, '작업 내용 보기'));

    body.append(...[
      el('h1', { class: 'hero__title', id: 'gameTitle', text: g.title }),
      g.subtitle ? el('p', { class: 'hero__subtitle', text: g.subtitle }) : null,
      meta,
      actions,
    ].filter(Boolean));
    if (v0) {
      body.append(el('p', { class: 'hero__caption' }, [
        v0.title ? el('strong', { text: v0.title }) : null,
        v0.caption ? el('span', { text: v0.caption }) : null,
      ]));
    } else if (im0 && im0.caption) {
      body.append(el('p', { class: 'hero__caption' }, el('span', { text: im0.caption })));
    }
    hero.append(stage, body);
    p.stage = stage;
    return hero;
  };

  const factRows = (g) => {
    const rows = [['status', '상태', g.status]];
    if (g.period) rows.push(['period', '기간', g.period]);
    else if (g.year) rows.push(['year', '연도', g.year]);
    rows.push(['engine', '엔진', g.engine], ['category', '분류', g.category], ['team', '팀', g.team], ['role', '역할', g.role]);
    const tools = texts(g.tools);
    if (tools.length) rows.push(['tools', '도구', tools.join(' · ')]);
    return el('dl', { class: 'project-facts' }, rows.filter((r) => r[2]).map(([key, label, value]) =>
      el('div', { class: 'fact', 'data-fact': key }, [el('dt', { text: label }), el('dd', { text: String(value) })])));
  };

  const buildWork = (g) => {
    const features = texts(g.features);
    const details = detailsOf(g);
    const more = [];
    if (features.length) {
      more.push(
        el('h3', { class: 'work__label', text: '주요 기능' }),
        el('ul', { class: 'feature-list' }, features.map((f) => el('li', { text: f }))),
      );
    }
    if (details.length) {
      more.push(
        el('h3', { class: 'work__label', text: '상세 해설' }),
        el('div', { class: 'detail-list' }, details.map((d) => el('section', { class: 'detail' }, [
          el('h3', { text: d.title }),
          el('p', { text: d.text }),
        ]))),
      );
    }
    return el('section', { id: 'work', class: 'work section', 'aria-labelledby': 'workTitle', tabindex: '-1' }, [
      sectionHead('workTitle', '작업 내용'),
      el('div', { class: 'work__lead', 'data-reveal': true }, [
        g.description ? el('p', { class: 'project-description', text: g.description }) : null,
        factRows(g),
      ]),
      more.length ? el('div', { class: 'work__more', 'data-reveal': true }, more) : null,
    ]);
  };

  const buildDevelopment = (g) => {
    const entries = texts(g.history);
    if (!entries.length) return null;
    return el('section', { id: 'development', class: 'development section', 'aria-labelledby': 'developmentTitle', tabindex: '-1' }, [
      sectionHead('developmentTitle', '개발 기록'),
      el('ol', { class: 'history-list', 'data-reveal': true }, entries.map((h) => {
        const m = /^(.+?) · (.+)$/.exec(h);
        if (!m) return el('li', { text: h });
        return el('li', {}, [
          el('span', { class: 'history__when', text: m[1] }),
          el('span', { class: 'history__sep', text: ' · ' }),
          el('span', { class: 'history__what', text: m[2] }),
        ]);
      })),
    ]);
  };

  const buildMedia = (g, p, on) => {
    const videos = videosOf(g);
    const images = imagesOf(g);
    const failNote = (fig, msg) => {
      fig.classList.add('is-error');
      const cap = fig.querySelector('figcaption');
      if (cap && !cap.querySelector('.media__error')) cap.append(el('p', { class: 'media__error', text: msg }));
    };
    const children = [sectionHead('mediaTitle', '영상과 화면')];
    if (!videos.length && !images.length) {
      children.push(el('p', { class: 'section__note', text: '확보한 실행 화면과 영상이 없습니다. 다른 게임의 화면을 대신 쓰지 않습니다.' }));
    } else if (!videos.length) {
      children.push(el('p', { class: 'section__note', text: `등록된 영상이 없어 화면 캡처 ${images.length}장만 싣습니다.` }));
    } else if (!images.length) {
      children.push(el('p', { class: 'section__note', text: '등록된 화면 캡처가 없어 영상만 싣습니다.' }));
    }
    if (videos.length) {
      children.push(el('div', { class: 'video-list', 'data-count': videos.length }, videos.map((m, i) => {
        const video = el('video', {
          controls: true,
          playsinline: true,
          preload: 'none',
          poster: m.poster || null,
          'aria-label': m.title || `${g.title} 영상 ${i + 1}`,
        });
        video.playsInline = true;
        video.src = m.src;
        const fig = el('figure', { class: 'media media--video', 'data-reveal': true }, [
          video,
          el('figcaption', {}, [m.title ? el('strong', { text: m.title }) : null, m.caption ? el('span', { text: m.caption }) : null]),
        ]);
        fig.style.setProperty('--i', i);
        on(video, 'loadedmetadata', () => setFormat(fig, video.videoWidth, video.videoHeight));
        on(video, 'error', () => failNote(fig, '영상을 불러오지 못했습니다. 새로고침 후 다시 재생해 주세요.'));
        p.bodyVideos.push(video);
        return fig;
      })));
    }
    if (images.length) {
      children.push(el('div', { class: 'image-gallery', 'data-count': images.length }, images.map((m, i) => {
        const img = el('img', { loading: 'lazy', decoding: 'async', alt: m.alt || '', src: m.src });
        if (m.pos) img.style.objectPosition = m.pos;
        const fig = el('figure', { class: 'media media--image', 'data-reveal': true }, [img, el('figcaption', { text: m.caption || null })]);
        fig.style.setProperty('--i', i);
        on(img, 'load', () => setFormat(fig, img.naturalWidth, img.naturalHeight));
        on(img, 'error', () => failNote(fig, '이미지를 불러오지 못했습니다. 새로고침 후 다시 확인해 주세요.'));
        if (img.complete && img.naturalWidth) setFormat(fig, img.naturalWidth, img.naturalHeight);
        return fig;
      })));
    }
    return el('section', { id: 'media', class: 'media-section section', 'aria-labelledby': 'mediaTitle', tabindex: '-1' }, children);
  };

  const render = (g) => {
    destroyPage();
    const p = {
      id: g.id,
      ctl: new AbortController(),
      observers: [],
      reveal: makeRevealer(),
      sections: new Map(),
      root: null,
      stage: null,
      video: null,
      toggle: null,
      sound: null,
      bodyVideos: [],
      pending: false,
      held: false,
      visible: true,
      userPlayed: false,
      blocked: false,
      failed: false,
    };
    const on = (target, type, fn) => target.addEventListener(type, fn, { signal: p.ctl.signal });
    const hero = buildHero(g, p, on);
    const work = buildWork(g);
    const development = buildDevelopment(g);
    const media = buildMedia(g, p, on);
    const article = el('article', { class: 'project', 'data-game': g.id, 'data-final': isFinal(g) ? 'true' : null, 'aria-labelledby': 'gameTitle' },
      [hero, work, development, media]);
    p.root = article;
    p.sections.set('intro', hero).set('work', work);
    if (development) p.sections.set('development', development);
    p.sections.set('media', media);
    if (notesSection && !notesSection.hidden) p.sections.set('notes', notesSection);
    state.page = p;
    state.id = g.id;
    projectRoot.replaceChildren(article);

    article.querySelectorAll('[data-reveal]').forEach((n) => p.reveal.observe(n));

    if ('IntersectionObserver' in window) {
      if (p.video) {
        const heroIO = new IntersectionObserver((entries) => {
          const entry = entries[entries.length - 1];
          const visible = entry.isIntersecting && entry.intersectionRatio >= 0.2;
          if (visible === p.visible) return;
          p.visible = visible; // leaving the screen pauses without touching the visitor's own choice
          syncHero();
        }, { threshold: [0, 0.2] });
        heroIO.observe(p.stage);
        p.observers.push(heroIO);
      }
      if (p.bodyVideos.length) {
        const bodyIO = new IntersectionObserver((entries) => {
          for (const entry of entries) if (!entry.isIntersecting && !entry.target.paused) entry.target.pause();
        });
        p.bodyVideos.forEach((v) => bodyIO.observe(v));
        p.observers.push(bodyIO);
      }
    }
  };

  /* ---------- routes: #p=<id>[&section=<name>] ---------- */
  function hrefFor(id, section) {
    return `#p=${encodeURIComponent(id)}${section && section !== 'intro' ? `&section=${section}` : ''}`;
  }
  const rootUrl = () => location.pathname + location.search;

  // Turns any hash into the game and section to show, plus the address that names them.
  const resolve = (hash, fallbackId) => {
    const raw = String(hash || '').replace(/^#/, '');
    if (!raw) return { id: fallbackId, section: '', url: fallbackId === defaultId ? '' : hrefFor(fallbackId, '') };
    if (/^p=/.test(raw)) {
      const params = new URLSearchParams(raw);
      const asked = params.get('p') || '';
      const known = byId.has(asked);
      const id = known ? asked : fallbackId;
      const sec = params.get('section') || '';
      const section = known && sec !== 'intro' && hasSection(byId.get(id), sec) ? sec : '';
      return { id, section, url: hrefFor(id, section), unknown: !known };
    }
    let name = raw;
    try { name = decodeURIComponent(raw); } catch (e) { /* keep raw */ }
    const section = name !== 'intro' && hasSection(byId.get(fallbackId), name) ? name : '';
    return { id: fallbackId, section, url: section ? hrefFor(fallbackId, section) : (fallbackId === defaultId && !state.id ? '' : hrefFor(fallbackId, '')) };
  };

  const writeHistory = (mode, url, extra) => {
    const st = { ...(mode === 'replace' && history.state && typeof history.state === 'object' ? history.state : {}), cat: state.cat, ...extra };
    try {
      if (mode === 'push') history.pushState(st, '', url || rootUrl());
      else history.replaceState(st, '', url === undefined ? location.href : url || rootUrl());
    } catch (e) { /* some file:// contexts refuse history writes; the page still changes */ }
    appliedHash = location.hash;
  };

  const syncPickers = () => {
    if (catSelect) catSelect.value = state.cat;
    fillGames(state.cat);
    if (gameSelect) gameSelect.value = state.id;
  };
  const syncLinks = () => {
    const g = byId.get(state.id);
    for (const a of document.querySelectorAll('a[data-section]')) {
      const s = a.dataset.section;
      a.setAttribute('href', hrefFor(state.id, s));
      if (!a.closest('#projectRoot')) a.hidden = !hasSection(g, s) || (s === 'notes' && !!notesSection && notesSection.hidden);
    }
  };

  let spyFrame = 0;
  const spy = () => {
    spyFrame = 0;
    const p = state.page;
    if (!p || !sectionNav) return;
    const line = headerOffset() + Math.min(window.innerHeight * 0.3, 260);
    let active = 'intro';
    for (const [name, node] of p.sections) if (node.getBoundingClientRect().top <= line) active = name;
    if (window.scrollY > 0 && window.innerHeight + window.scrollY >= html.scrollHeight - 2) active = [...p.sections.keys()].pop();
    for (const a of sectionNav.querySelectorAll('a[data-section]')) {
      if (a.dataset.section === active) a.setAttribute('aria-current', 'location');
      else a.removeAttribute('aria-current');
    }
  };
  const queueSpy = () => { if (!spyFrame) spyFrame = window.requestAnimationFrame(spy); };
  window.addEventListener('scroll', queueSpy, { passive: true });
  window.addEventListener('resize', queueSpy);

  const focusNode = (node) => {
    if (!node) return;
    if (!node.hasAttribute('tabindex')) node.setAttribute('tabindex', '-1');
    node.focus({ preventScroll: true });
  };

  // Shows game `id` (rendering only when it changed), then places the reading position.
  const apply = (id, section, { announce = '', focus = false, restoreY = null } = {}) => {
    const g = byId.get(id);
    const changed = id !== state.id;
    if (changed) {
      render(g);
      document.title = `${g.title} · ${SITE_TITLE}`;
    }
    syncPickers();
    syncLinks();
    let target = null;
    if (restoreY != null) scrollToY(restoreY);
    else target = scrollToSection(section || 'intro');
    if (focus && target) focusNode(target);
    const p = state.page;
    if (p && p.stage) {
      const r = p.stage.getBoundingClientRect();
      p.visible = r.bottom - headerOffset() > r.height * 0.2 && r.top < window.innerHeight;
    }
    syncHero();
    queueSpy();
    if (changed && announce) say(announce);
  };

  const gameMessage = (g) => `${g.title} 작품 페이지를 열었습니다. ${isFinal(g) ? '최종 프로젝트 · ' : ''}${g.category || ''}`.trim();

  const saveScroll = () => {
    try { history.replaceState({ ...(history.state && typeof history.state === 'object' ? history.state : {}), y: window.scrollY }, ''); } catch (e) { /* ignore */ }
  };

  // Visitor-driven navigation: one history entry per destination, never two for one action.
  const go = (id, section, { focus = false, prefix = '' } = {}) => {
    if (!byId.has(id)) return;
    const url = hrefFor(id, section);
    const current = resolve(location.hash, state.id || defaultId);
    const same = current.id === id && (current.section || '') === (section === 'intro' ? '' : section || '');
    if (!same) saveScroll();
    writeHistory(same ? 'replace' : 'push', url, { y: null });
    const g = byId.get(id);
    apply(id, section, { focus, announce: `${prefix}${gameMessage(g)}` });
  };

  // Back, Forward, a typed or followed hash: show what the address names, keep the category consistent.
  const onLocation = () => {
    if (location.hash === appliedHash) return;
    const r = resolve(location.hash, location.hash ? state.id || defaultId : defaultId);
    const st = history.state && typeof history.state === 'object' ? history.state : null;
    const g = byId.get(r.id);
    state.cat = st && validCat(st.cat) && inCat(g, st.cat) ? st.cat : inCat(g, state.cat) ? state.cat : CAT_ALL;
    const sameGame = r.id === state.id;
    const restoreY = sameGame && st && typeof st.y === 'number' ? st.y : null;
    writeHistory('replace', r.url !== location.hash ? r.url : undefined, {});
    apply(r.id, r.section, { announce: r.unknown ? `요청한 작품을 찾지 못했습니다. ${gameMessage(g)}` : gameMessage(g), restoreY });
  };
  window.addEventListener('popstate', onLocation);
  window.addEventListener('hashchange', onLocation);

  if (gameSelect) {
    gameSelect.addEventListener('change', () => {
      const id = gameSelect.value;
      if (!byId.has(id) || id === state.id) return;
      go(id, '');
    });
  }
  if (catSelect) {
    catSelect.addEventListener('change', () => {
      const cat = catSelect.value;
      if (!validCat(cat)) return;
      state.cat = cat;
      const items = gamesIn(cat);
      const prefix = `${catLabel(cat)} 분류 ${items.length}편. `;
      if (inCat(byId.get(state.id), cat)) {
        syncPickers();
        writeHistory('replace', undefined, {});
        say(`${prefix}${byId.get(state.id).title} 작품은 그대로 둡니다.`);
      } else {
        go(items[0].id, '', { prefix });
      }
    });
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target instanceof Element ? e.target.closest('a[href^="#"]') : null;
    if (!a) return;
    const href = a.getAttribute('href');
    if (a.dataset.section && SECTIONS.includes(a.dataset.section)) {
      e.preventDefault();
      const s = a.dataset.section;
      go(state.id, hasSection(byId.get(state.id), s) ? s : '', { focus: true });
      return;
    }
    if (/^#p=/.test(href)) {
      e.preventDefault();
      const r = resolve(href, state.id);
      go(r.id, r.section, { focus: !!r.section });
      return;
    }
    let name = href.slice(1);
    try { name = decodeURIComponent(name); } catch (err) { /* keep raw */ }
    if (SECTIONS.includes(name)) {
      e.preventDefault();
      go(state.id, hasSection(byId.get(state.id), name) ? name : '', { focus: true });
      return;
    }
    // Other in-page targets (skip link, back-to-top): move there without dropping the game from the address.
    e.preventDefault();
    const target = name ? document.getElementById(name) : null;
    if (!target || name === 'top') { scrollToY(0); return; }
    if (target === main) { focusNode(main); return; }
    scrollToY(target.getBoundingClientRect().top + window.scrollY - headerOffset());
    focusNode(target);
  });

  /* ---------- start ---------- */
  try { history.scrollRestoration = 'manual'; } catch (e) { /* ignore */ }
  {
    const r = resolve(location.hash, defaultId);
    const st = history.state && typeof history.state === 'object' ? history.state : null;
    const g = byId.get(r.id);
    state.cat = st && validCat(st.cat) && inCat(g, st.cat) ? st.cat : CAT_ALL;
    writeHistory('replace', r.url !== location.hash ? r.url : undefined, {});
    apply(r.id, r.section, { announce: r.unknown ? `요청한 작품을 찾지 못했습니다. ${gameMessage(g)}` : '' });
  }
})();
