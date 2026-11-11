(() => {
  'use strict';

  const DATA = window.PORTFOLIO;
  const ROOT = '../../../';
  const FINAL_IDS = ['necro-climb', 'football-director', 'mallang-shelter'];
  /* Stage videos recorded in a vertical phone frame (540×1170, 540×960). */
  const PORTRAIT_IDS = new Set(['necro-climb', 'mallang-shelter']);
  const CASE_SHOTS = {
    'necro-climb': ['media/necro-battle.webp', 'media/necro-build.webp', 'media/necro-map.webp'],
    'football-director': ['media/hanbit-skills.webp', 'media/hanbit-transfer.webp', 'media/hanbit-lineup.webp'],
    'mallang-shelter': ['media/mallang-room.webp', 'media/mallang-eating.webp', 'media/mallang-details.webp']
  };
  const CASE_LAYOUT = ['case--tall', 'case--wide', 'case--tall case--mirror'];

  const doc = document.documentElement;
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const src = (path) => ROOT + path;

  if (!DATA || !Array.isArray(DATA.games)) {
    $('dataError').hidden = false;
    return;
  }

  const games = DATA.games;
  const byId = new Map(games.map((g) => [g.id, g]));
  const finals = FINAL_IDS.map((id) => byId.get(id)).filter(Boolean);

  const els = {
    picks: $('picks'), frame: $('screenFrame'), video: $('screenVideo'), ambient: $('screenAmbient'),
    cut: $('screenCut'), bigPlay: $('bigPlay'), play: $('playToggle'), scrubInput: $('scrubInput'),
    scrubFill: $('scrubFill'), time: $('timeLabel'), clips: $('clips'), caption: $('screenCaption'), scenes: $('scenes'),
    slate: $('slate'), caseList: $('caseList'), rows: $('rows'), noteList: $('noteList'),
    aImg: $('archiveImage'), aAmb: $('archiveAmbient'), aEmpty: $('archiveEmpty'), aCap: $('archiveCap'),
    detail: $('detail'), detailBody: $('detailBody'), detailCrumb: $('detailCrumb'), detailClose: $('detailClose'),
    motion: $('motionToggle')
  };

  const state = {
    game: null,
    clip: 0,
    wantsPlay: false,
    inView: true,
    dialogOpen: false,
    mediaObserver: null,
    cutToken: 0,
    opener: null
  };

  const isCalm = () => doc.getAttribute('data-motion') === 'off';

  /* ---------- helpers ---------- */
  const factRows = (g, opts = {}) => {
    const rows = [];
    if (g.status) rows.push(['상태', g.status]);
    if (g.category) rows.push(['장르', g.category]);
    if (g.engine) rows.push(['엔진', g.engine]);
    if (g.period) rows.push(['기간', g.period]);
    else if (g.year) rows.push(['연도', g.year]);
    if (g.team) rows.push(['팀', g.team]);
    if (g.role) rows.push(['맡은 역할', g.role]);
    if (opts.tools && g.tools && g.tools.length) rows.push(['제작 도구', g.tools.join(', ')]);
    return rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
  };
  const listItems = (arr) => arr.map((t) => `<li>${esc(t)}</li>`).join('');
  const fmt = (t) => {
    if (!isFinite(t) || t < 0) t = 0;
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };
  const shortClip = (title) => {
    const parts = String(title).split('·');
    return parts.length > 1 ? parts[parts.length - 1].trim() : title;
  };

  /* ---------- picks ---------- */
  function renderPicks() {
    els.picks.innerHTML = finals.map((g) => {
      const img = g.images[0];
      return `<button class="pick" type="button" data-id="${esc(g.id)}" aria-pressed="false" aria-controls="screen slate">
        <span class="pick__thumb"><img src="${esc(src(img.src))}" alt="" style="object-position:${esc(img.pos || '50% 50%')}" decoding="async"></span>
        <span class="pick__text">
          <span class="pick__title">${esc(g.title)}</span>
          <span class="pick__meta">${esc(g.category)} · ${esc(g.engine.split('·')[0].trim())}</span>
          <span class="pick__state" data-state>영상 보기</span>
        </span>
      </button>`;
    }).join('');
    els.picks.addEventListener('click', (e) => {
      const b = e.target.closest('.pick');
      if (!b) return;
      select(b.dataset.id, true);
    });
  }

  function updatePickStates() {
    const playing = !els.video.paused && !els.video.ended;
    els.picks.querySelectorAll('.pick').forEach((b) => {
      const on = state.game && b.dataset.id === state.game.id;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      const s = b.querySelector('[data-state]');
      s.textContent = on ? (playing ? '재생 중' : '선택됨 · 정지') : '영상 보기';
    });
  }

  /* ---------- screen ---------- */
  function select(id, byUser) {
    const g = byId.get(id);
    if (!g) return;
    if (state.game && state.game.id === id) {
      if (byUser && els.video.paused) { state.wantsPlay = true; reconcile(); }
      return;
    }
    const first = !state.game;
    state.game = g;
    if (byUser) state.wantsPlay = !isCalm() || state.wantsPlay;
    updatePickStates();
    const swap = () => {
      setClip(0);
      renderSlate(!first);
    };
    if (first) swap(); else cutTo(swap);
  }

  function cutTo(swap) {
    const token = ++state.cutToken;
    const cut = els.cut;
    if (isCalm()) { swap(); return; }
    els.video.pause();
    cut.classList.remove('is-out');
    void cut.offsetWidth;
    cut.classList.add('is-in');
    window.setTimeout(() => {
      if (token !== state.cutToken) return;
      swap();
      cut.classList.remove('is-in');
      cut.classList.add('is-out');
      window.setTimeout(() => { if (token === state.cutToken) cut.classList.remove('is-out'); }, 420);
    }, 220);
  }

  function setClip(i) {
    const g = state.game;
    const v = g.videos[i];
    state.clip = i;
    const video = els.video;
    video.pause();
    video.removeAttribute('src');
    video.setAttribute('poster', src(v.poster));
    video.src = src(v.src);
    video.load();
    els.ambient.src = src(v.poster);
    const landscape = !PORTRAIT_IDS.has(g.id);
    els.frame.dataset.orient = landscape ? 'landscape' : 'portrait';
    const extra = landscape ? g.images.filter((im) => im.src !== v.poster).slice(0, 2) : [];
    els.scenes.hidden = !extra.length;
    els.scenes.innerHTML = extra.map((im) => `<figure class="scene">
        <img src="${esc(src(im.src))}" alt="${esc(im.alt)}" decoding="async">
        <figcaption>${esc(im.caption)}</figcaption>
      </figure>`).join('');
    els.caption.innerHTML = `<strong>${esc(v.title)}</strong><span>${esc(v.caption)}</span>`;
    setScrub(0, 0);
    if (g.videos.length > 1) {
      els.clips.hidden = false;
      els.clips.innerHTML = g.videos.map((c, k) => `<button class="clip" type="button" data-clip="${k}" aria-pressed="${k === i}">${esc(shortClip(c.title))}</button>`).join('');
    } else {
      els.clips.hidden = true;
      els.clips.innerHTML = '';
    }
    reconcile();
    updateTransport();
  }

  function setScrub(cur, dur) {
    const p = dur > 0 ? Math.min(1, cur / dur) : 0;
    els.scrubFill.style.transform = `scaleX(${p})`;
    if (document.activeElement !== els.scrubInput || !state.scrubbing) els.scrubInput.value = String(Math.round(p * 1000));
    els.time.textContent = `${fmt(cur)} / ${fmt(dur)}`;
    els.scrubInput.setAttribute('aria-valuetext', `${fmt(cur)} / ${fmt(dur)}`);
  }

  function updateTransport() {
    const playing = !els.video.paused && !els.video.ended;
    els.play.classList.toggle('is-playing', playing);
    els.play.querySelector('.transport__label').textContent = playing ? '일시정지' : '재생';
    els.play.setAttribute('aria-label', playing ? '영상 일시정지' : '영상 재생');
    els.bigPlay.hidden = playing || state.wantsPlay;
    updatePickStates();
  }

  function reconcile() {
    const can = state.wantsPlay && state.inView && !document.hidden && !state.dialogOpen;
    const v = els.video;
    if (can && v.paused) {
      const p = v.play();
      if (p && p.catch) p.catch(() => { state.wantsPlay = false; updateTransport(); });
    } else if (!can && !v.paused) {
      v.pause();
    }
    updateTransport();
  }

  function bindScreen() {
    const v = els.video;
    ['play', 'pause', 'ended'].forEach((ev) => v.addEventListener(ev, updateTransport));
    v.addEventListener('timeupdate', () => setScrub(v.currentTime, v.duration));
    v.addEventListener('loadedmetadata', () => setScrub(v.currentTime, v.duration));
    els.play.addEventListener('click', () => {
      state.wantsPlay = v.paused;
      reconcile();
    });
    els.bigPlay.addEventListener('click', () => {
      state.wantsPlay = true;
      reconcile();
      els.play.focus();
    });
    els.scrubInput.addEventListener('input', () => {
      state.scrubbing = true;
      if (isFinite(v.duration) && v.duration > 0) {
        const t = (Number(els.scrubInput.value) / 1000) * v.duration;
        v.currentTime = t;
        setScrub(t, v.duration);
      }
    });
    els.scrubInput.addEventListener('change', () => { state.scrubbing = false; });
    els.clips.addEventListener('click', (e) => {
      const b = e.target.closest('.clip');
      if (!b) return;
      const k = Number(b.dataset.clip);
      if (k === state.clip) return;
      state.wantsPlay = true;
      cutTo(() => setClip(k));
    });

    if ('IntersectionObserver' in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((en) => { state.inView = en.intersectionRatio >= 0.3; });
        reconcile();
      }, { threshold: [0, 0.3, 0.6] }).observe(els.frame);
    }
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) els.detailBody.querySelectorAll('video').forEach((v) => v.pause());
      reconcile();
    });
  }

  /* ---------- slate ---------- */
  function renderSlate(animate) {
    const g = state.game;
    els.slate.innerHTML = `
      <h3 class="slate__title" data-step style="--i:0">${esc(g.title)}</h3>
      <p class="slate__sub" data-step style="--i:1">${esc(g.subtitle)}</p>
      <p class="slate__desc" data-step style="--i:2">${esc(g.description)}</p>
      <dl class="facts" data-step style="--i:3">${factRows(g)}</dl>
      <div class="slate__actions">
        <button class="btn btn--solid" type="button" data-open="${esc(g.id)}">작품 보기</button>
        <a class="btn btn--quiet" href="#case-${esc(g.id)}">사례 읽기 <span aria-hidden="true">↓</span></a>
      </div>`;
    if (animate && !isCalm()) {
      els.slate.classList.remove('is-fresh');
      void els.slate.offsetWidth;
      els.slate.classList.add('is-fresh');
    }
  }

  /* ---------- cases ---------- */
  function renderCases() {
    els.caseList.innerHTML = finals.map((g, idx) => {
      const shots = (CASE_SHOTS[g.id] || []).map((p) => g.images.find((im) => im.src === p)).filter(Boolean);
      const figs = shots.map((im, k) => `<figure class="shot" data-rise style="--d:${k * 80}ms">
          <img src="${esc(src(im.src))}" alt="${esc(im.alt)}" loading="lazy" decoding="async">
          <figcaption>${esc(im.caption)}</figcaption>
        </figure>`).join('');
      const hist = g.history && g.history.length
        ? `<h4>개발 이력</h4><ul class="case__hist">${listItems(g.history)}</ul>` : '';
      const media = `${g.images.length}장 · 영상 ${g.videos.length}편`;
      return `<article class="case ${CASE_LAYOUT[idx]}" id="case-${esc(g.id)}" aria-labelledby="case-title-${esc(g.id)}">
        <div class="case__media">${figs}</div>
        <div class="case__text">
          <div class="case__lead" data-rise>
            <h3 class="case__title" id="case-title-${esc(g.id)}">${esc(g.title)}</h3>
            <p class="case__sub">${esc(g.subtitle)}</p>
            <p class="case__desc">${esc(g.description)}</p>
          </div>
          <div class="case__spec" data-rise style="--d:90ms">
            <h4>주요 특징</h4>
            <ul class="case__feat">${listItems(g.features)}</ul>
            <dl class="facts facts--case">${factRows(g, { tools: true })}</dl>
            ${hist}
            <div class="case__actions">
              <button class="btn btn--solid" type="button" data-watch="${esc(g.id)}">영상 보기</button>
              <button class="btn btn--quiet" type="button" data-open="${esc(g.id)}">작품 보기 · 이미지 ${media}</button>
            </div>
          </div>
        </div>
      </article>`;
    }).join('');
  }

  /* ---------- archive ---------- */
  function renderArchive() {
    els.rows.innerHTML = games.map((g) => {
      const img = g.images[0];
      const tag = g.final ? '최종 프로젝트' : (g.team ? g.team.replace('팀 프로젝트 · ', '팀 · ') : '');
      const thumb = img
        ? `<img class="row__thumb" src="${esc(src(img.src))}" alt="" loading="lazy" decoding="async" style="object-position:${esc(img.pos || '50% 50%')}">`
        : `<span class="row__thumb row__thumb--none">캡처 없음</span>`;
      return `<li data-rise><button class="row${g.final ? ' row--final' : ''}" type="button" data-open="${esc(g.id)}" data-preview="${esc(g.id)}">
        ${thumb}
        <span class="row__title">${esc(g.title)}</span>
        <span class="row__meta">${esc(g.category)} · ${esc(g.engine)}</span>
        <span class="row__tag">${esc(tag)}</span>
      </button></li>`;
    }).join('');
    const activate = (id) => {
      const g = byId.get(id);
      if (!g || els.rows.dataset.active === id) return;
      els.rows.dataset.active = id;
      els.rows.querySelectorAll('.row').forEach((r) => r.classList.toggle('is-active', r.dataset.preview === id));
      previewArchive(g);
    };
    els.rows.addEventListener('pointerover', (e) => {
      const r = e.target.closest('.row');
      if (r) activate(r.dataset.preview);
    });
    els.rows.addEventListener('focusin', (e) => {
      const r = e.target.closest('.row');
      if (r) activate(r.dataset.preview);
    });
    activate(games[0].id);
  }

  function previewArchive(g) {
    const img = g.images[0];
    const wrap = els.aImg.parentElement;
    const apply = () => {
      if (img) {
        els.aImg.hidden = false;
        els.aAmb.hidden = false;
        els.aEmpty.hidden = true;
        els.aImg.src = src(img.src);
        els.aAmb.src = src(img.src);
        els.aCap.innerHTML = `<strong>${esc(g.title)}</strong> ${esc(img.caption)}`;
      } else {
        els.aImg.hidden = true;
        els.aAmb.hidden = true;
        els.aEmpty.hidden = false;
        els.aEmpty.innerHTML = `<strong>${esc(g.title)}</strong><span>${esc(g.status)}</span>`;
        els.aCap.innerHTML = `<strong>${esc(g.title)}</strong> 등록된 캡처와 영상이 없습니다.`;
      }
    };
    if (isCalm()) { apply(); return; }
    wrap.classList.add('is-swapping');
    window.setTimeout(() => { apply(); wrap.classList.remove('is-swapping'); }, 140);
  }

  /* ---------- notes ---------- */
  function renderNotes() {
    els.noteList.innerHTML = (DATA.notes || []).map((n) => `<div class="note" data-rise>
      <h3>${esc(n.title)}</h3><p>${esc(n.text)}</p></div>`).join('');
  }

  /* ---------- detail dialog ---------- */
  function openDetail(id, opener) {
    const g = byId.get(id);
    if (!g) return;
    state.opener = opener || document.activeElement;
    els.detailCrumb.textContent = `${g.final ? '최종 프로젝트' : '전체 24편'} / ${g.title}`;
    const vids = g.videos.map((v) => `<figure class="d-video">
        <video controls preload="none" playsinline poster="${esc(src(v.poster))}" src="${esc(src(v.src))}"></video>
        <figcaption><strong>${esc(v.title)}</strong><span>${esc(v.caption)}</span></figcaption>
      </figure>`).join('');
    const imgs = g.images.map((im) => `<figure class="d-shot">
        <a href="${esc(src(im.src))}" target="_blank" rel="noopener"><img src="${esc(src(im.src))}" alt="${esc(im.alt)}" loading="lazy" decoding="async"></a>
        <figcaption>${esc(im.caption)}</figcaption>
      </figure>`).join('');
    const details = (g.details || []).map((d) => `<section class="d-sec"><h3>${esc(d.title)}</h3><p>${esc(d.text)}</p></section>`).join('');
    const hist = g.history && g.history.length ? `<section class="d-sec"><h3>개발 이력</h3><ul>${listItems(g.history)}</ul></section>` : '';
    const empty = !g.images.length && !g.videos.length
      ? `<p class="d-none">등록된 이미지와 영상이 없습니다. 상태: ${esc(g.status)}</p>` : '';
    els.detailBody.innerHTML = `
      <header class="d-head">
        <h2 id="detailTitle">${esc(g.title)}</h2>
        <p>${esc(g.subtitle)}</p>
      </header>
      <div class="d-layout">
        ${vids ? `<section class="d-media d-media--first"><h3>영상 ${g.videos.length}편</h3><div class="d-videos">${vids}</div></section>` : ''}
        <div class="d-text">
          <div class="d-grid">
            <div class="d-main">
              <p class="d-desc">${esc(g.description)}</p>
              <section class="d-sec"><h3>주요 특징</h3><ul>${listItems(g.features || [])}</ul></section>
              ${details}${hist}
            </div>
            <aside class="d-aside" aria-label="작품 정보"><dl class="facts facts--detail">${factRows(g, { tools: true })}</dl></aside>
          </div>
        </div>
      </div>
      ${imgs ? `<section class="d-media"><h3>이미지 ${g.images.length}장</h3><div class="d-shots">${imgs}</div></section>` : ''}
      ${empty}`;
    els.detailBody.querySelectorAll('video').forEach((v) => {
      v.addEventListener('play', () => {
        els.detailBody.querySelectorAll('video').forEach((o) => { if (o !== v) o.pause(); });
      });
    });
    els.detailBody.scrollTop = 0;
    state.dialogOpen = true;
    reconcile();
    doc.classList.add('is-locked');
    if (typeof els.detail.showModal === 'function') els.detail.showModal();
    else els.detail.setAttribute('open', '');
    els.detailClose.focus();
    if ('IntersectionObserver' in window) {
      if (state.mediaObserver) state.mediaObserver.disconnect();
      state.mediaObserver = new IntersectionObserver((entries) => {
        entries.forEach((en) => { if (en.intersectionRatio < 0.15) en.target.pause(); });
      }, { root: els.detailBody, threshold: [0, 0.15] });
      els.detailBody.querySelectorAll('video').forEach((v) => state.mediaObserver.observe(v));
    }
  }

  function closeDetail() {
    if (els.detail.open) {
      if (typeof els.detail.close === 'function') els.detail.close();
      else els.detail.removeAttribute('open');
    }
  }

  function bindDetail() {
    els.detailClose.addEventListener('click', closeDetail);
    els.detail.addEventListener('close', () => {
      els.detailBody.querySelectorAll('video').forEach((v) => v.pause());
      if (state.mediaObserver) {
        state.mediaObserver.disconnect();
        state.mediaObserver = null;
      }
      doc.classList.remove('is-locked');
      state.dialogOpen = false;
      reconcile();
      const o = state.opener;
      if (o && document.contains(o)) o.focus();
    });
    els.detail.addEventListener('click', (e) => {
      if (e.target === els.detail) closeDetail();
    });
  }

  /* ---------- global clicks ---------- */
  function bindGlobal() {
    document.addEventListener('click', (e) => {
      const open = e.target.closest('[data-open]');
      if (open) { openDetail(open.dataset.open, open); return; }
      const watch = e.target.closest('[data-watch]');
      if (watch) {
        state.wantsPlay = true;
        $('theater').scrollIntoView({ behavior: isCalm() ? 'auto' : 'smooth', block: 'start' });
        if (state.game && state.game.id === watch.dataset.watch) reconcile();
        else select(watch.dataset.watch, true);
        const pick = els.picks.querySelector(`[data-id="${watch.dataset.watch}"]`);
        if (pick) pick.focus({ preventScroll: true });
      }
    });
  }

  /* ---------- motion ---------- */
  function setMotionLabel() {
    const calm = isCalm();
    els.motion.querySelector('.motion__label').textContent = calm ? '모션 켜기' : '모션 줄이기';
    els.motion.setAttribute('aria-pressed', calm ? 'true' : 'false');
  }
  function bindMotion() {
    setMotionLabel();
    els.motion.addEventListener('click', () => {
      const calm = !isCalm();
      doc.setAttribute('data-motion', calm ? 'off' : 'on');
      try { localStorage.setItem('gp-b-motion', calm ? 'off' : 'on'); } catch (e) { /* storage blocked */ }
      if (calm) {
        state.wantsPlay = false;
        document.querySelectorAll('.rise-wait').forEach((el) => el.classList.remove('rise-wait'));
      }
      reconcile();
      setMotionLabel();
    });
  }

  function bindRise() {
    if (isCalm() || !('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('rise-in');
        en.target.classList.remove('rise-wait');
        io.unobserve(en.target);
      });
    }, { rootMargin: '0px 0px -8% 0px' });
    document.querySelectorAll('[data-rise], .section-head, .notes h2').forEach((el, i) => {
      if (el.getBoundingClientRect().top < window.innerHeight) return;
      el.classList.add('rise-wait');
      io.observe(el);
    });
  }

  /* ---------- init ---------- */
  renderPicks();
  renderCases();
  renderArchive();
  renderNotes();
  bindScreen();
  bindDetail();
  bindGlobal();
  bindMotion();
  state.wantsPlay = !isCalm();
  select(finals[0].id, false);
  bindRise();
})();
