(function () {
  'use strict';

  var root = document.documentElement;
  var MEDIA = '../../../';
  var FINALS = ['necro-climb', 'football-director', 'mallang-shelter'];
  var MOTION_KEY = 'gp-r2c-motion';
  var desktopQuery = window.matchMedia('(min-width: 1100px)');

  /* Pixel sizes of the project's own stills, so every picture keeps its true shape. */
  var DIMS = {
    'adrift-deck': [1016, 640], 'adrift-editor': [1280, 770], 'adrift-ocean': [1016, 640], 'adrift-scoop': [1016, 640],
    'alkkagi-aim': [731, 404], 'alkkagi-end': [731, 404], 'alkkagi-growth': [731, 404],
    'arena-fate': [1600, 900], 'arena-unreal': [1600, 900], 'aurora': [1440, 900],
    'dice-combat': [738, 1600], 'dice-menu': [540, 1170], 'dungeon': [738, 1600],
    'football-career': [1280, 800], 'football-match': [1600, 900], 'football-thunder': [768, 512],
    'greed-attack': [1600, 900], 'greed-boss': [1600, 900], 'greed-city': [1600, 900], 'greed-early-absorb': [1600, 1000],
    'greed-gate': [1600, 900], 'greed-title': [1600, 900], 'greed-workbench': [1600, 900],
    'hanbit-clash': [1280, 720], 'hanbit-cutin': [1280, 720], 'hanbit-lineup': [1280, 720], 'hanbit-match': [1280, 720],
    'hanbit-skills': [1600, 976], 'hanbit-transfer': [1280, 720],
    'last-armor': [1280, 720], 'last-combat': [1280, 720], 'last-verdict': [1600, 900],
    'lucky-growth': [1280, 720], 'lucky-play': [1280, 720], 'lucky-title': [1280, 720],
    'lumi-evolution': [1600, 900], 'lumi-night': [1600, 900], 'lumi-raptor': [1600, 900], 'lumi-start': [1600, 900],
    'lumi3d-evolution': [1280, 720], 'lumi3d-forest': [1280, 720], 'mafia': [1440, 900],
    'mallang-details': [540, 960], 'mallang-eating': [540, 960], 'mallang-help': [540, 960], 'mallang-room': [540, 960], 'mallang-sharing': [540, 960],
    'mukbot-charge': [1600, 942], 'mukbot-collect': [1600, 942], 'mukbot-day1': [1600, 942], 'mukbot-ghost': [1600, 942],
    'necro-2d-prototype': [1280, 720], 'necro-battle': [540, 1170], 'necro-build': [540, 1170], 'necro-guardian': [540, 1170],
    'necro-map': [540, 1170], 'necro-relic': [540, 1170], 'necro-title': [720, 1280], 'necro-upgrade': [540, 1170],
    'pixel-frontier-buildings': [1600, 900], 'pixel-frontier-cinematic': [1280, 720], 'pixel-frontier-deploy': [1600, 900],
    'pixel-frontier-golem': [1600, 900], 'pixel-frontier-guardian': [1600, 900], 'pixel-frontier-prototype': [1600, 900],
    'pixel-frontier-qa-army': [1280, 720], 'pixel-frontier-roulette': [1600, 900], 'pixel-frontier-title': [1600, 900],
    'rift-gameplay': [1600, 900], 'rift-title': [1600, 900],
    'seongrim-burst': [1280, 720], 'seongrim-foxfire': [1280, 720], 'seongrim-gate': [1400, 900], 'seongrim-village-render': [1600, 1000],
    'snow-leopard-chat': [780, 600], 'snow-leopard-run': [360, 360], 'snow-leopard-tail': [360, 360], 'snow-leopard-walk': [360, 360],
    'star-guardian-clear': [1600, 900], 'star-guardian-combat': [1440, 900], 'star-guardian-dragon': [1600, 900],
    'star-guardian-levelup': [1440, 900], 'star-guardian-shooting': [1440, 900], 'star-guardian-yeti': [1600, 900],
    'threemin-boss-arena': [1600, 1000], 'threemin-boss': [1600, 1000], 'threemin-clear': [1600, 1000], 'threemin-companion': [1600, 1000],
    'threemin-forge': [1600, 1000], 'threemin-puzzle': [1600, 1000], 'threemin-title': [1600, 1000],
    'tom-jerry': [1280, 800], 'verdict-hallway': [1600, 1000], 'verdict-lobby': [1600, 1000], 'verdict-room': [1600, 1000], 'verdict-title': [1600, 1000],
    'wall-breaker-arc': [1280, 400], 'wall-breaker-skins': [1280, 400], 'wall-breaker-ultimate': [1280, 400], 'wall-breaker-upgrade': [1280, 400]
  };

  function dims(src) {
    var key = String(src).replace(/^.*\//, '').replace(/\.\w+$/, '');
    return DIMS[key] || [1600, 900];
  }
  function shapeOf(src) {
    var d = dims(src);
    var r = d[0] / d[1];
    if (r < 0.8) return 'tall';
    if (r > 2.2) return 'band';
    return 'wide';
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function motionOn() { return root.getAttribute('data-motion') === 'on'; }

  var data = window.PORTFOLIO;
  var games = data && Array.isArray(data.games) ? data.games : [];
  var byId = {};
  games.forEach(function (g) { byId[g.id] = g; });

  if (!games.length) {
    var err = document.getElementById('dataError');
    if (err) err.hidden = false;
  }

  /* ---------- Motion switch ---------- */
  var motionBtn = document.getElementById('motionToggle');
  function syncMotionButton() {
    var on = motionOn();
    motionBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
    motionBtn.querySelector('.bar__motion-label').textContent = on ? '모션 끄기' : '모션 켜기';
    motionBtn.setAttribute('aria-label', on ? '모션 끄기' : '모션 켜기');
  }
  motionBtn.addEventListener('click', function () {
    var next = motionOn() ? 'off' : 'on';
    root.setAttribute('data-motion', next);
    try { localStorage.setItem(MOTION_KEY, next); } catch (e) { /* storage blocked: the switch still works for this visit */ }
    syncMotionButton();
    if (next === 'on') revealAll(false);
    updateHeroVideo();
  });
  syncMotionButton();

  /* ---------- Video rules: one plays at a time ---------- */
  document.addEventListener('play', function (e) {
    var v = e.target;
    if (!(v instanceof HTMLVideoElement)) return;
    document.querySelectorAll('video').forEach(function (o) { if (o !== v && !o.paused) o.pause(); });
  }, true);

  var heroVideos = Array.prototype.slice.call(document.querySelectorAll('.poster__video'));
  var heroVisible = {};
  var dialogOpen = false;

  function wantedHeroVideo() {
    if (!motionOn() || dialogOpen || document.hidden) return null;
    if (desktopQuery.matches) {
      var open = document.querySelector('.poster.is-open');
      if (!open || !heroVisible[open.id]) return null;
      return open.querySelector('.poster__video');
    }
    var best = null; var bestRatio = 0.55;
    Object.keys(heroVisible).forEach(function (id) {
      if (heroVisible[id] > bestRatio) { bestRatio = heroVisible[id]; best = document.getElementById(id); }
    });
    return best ? best.querySelector('.poster__video') : null;
  }
  function updateHeroVideo() {
    var want = wantedHeroVideo();
    heroVideos.forEach(function (v) {
      if (v === want) {
        if (!v.src) { v.src = v.getAttribute('data-src'); }
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay refused: the poster frame stays */ });
      } else if (!v.paused) {
        v.pause();
      }
    });
  }
  if ('IntersectionObserver' in window) {
    var heroIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { heroVisible[en.target.id] = en.isIntersecting ? en.intersectionRatio : 0; });
      updateHeroVideo();
    }, { threshold: [0, 0.25, 0.55, 0.75, 1] });
    document.querySelectorAll('.poster').forEach(function (p) { heroIO.observe(p); });
  }
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) document.querySelectorAll('video').forEach(function (v) { v.pause(); });
    else updateHeroVideo();
  });

  /* ---------- Final posters: choose one, it opens wide ---------- */
  var posters = Array.prototype.slice.call(document.querySelectorAll('.poster'));
  function applyInert() {
    var desk = desktopQuery.matches;
    posters.forEach(function (p) {
      var open = p.classList.contains('is-open');
      var part = p.querySelector('.poster__open');
      if (desk && !open) part.setAttribute('inert', ''); else part.removeAttribute('inert');
    });
  }
  function select(id, opts) {
    var target = document.getElementById('final-' + id);
    if (!target || target.classList.contains('is-open')) return;
    posters.forEach(function (p) {
      var on = p === target;
      p.classList.toggle('is-open', on);
      p.querySelector('.poster__pick').setAttribute('aria-pressed', on ? 'true' : 'false');
      p.classList.remove('is-swapping');
    });
    applyInert();
    if (motionOn()) {
      void target.offsetWidth;
      target.classList.add('is-swapping');
      setTimeout(function () { target.classList.remove('is-swapping'); }, 900);
    }
    if (opts && opts.focus) target.querySelector('.poster__title').focus({ preventScroll: true });
    updateHeroVideo();
  }
  document.querySelectorAll('[data-pick]').forEach(function (b) {
    b.addEventListener('click', function () { select(b.getAttribute('data-pick'), { focus: true }); });
  });
  function onLayoutChange() { applyInert(); updateHeroVideo(); }
  if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', onLayoutChange);
  else desktopQuery.addListener(onLayoutChange);
  applyInert();

  /* Arrow keys move between the three posters on desktop. */
  document.getElementById('finals').addEventListener('keydown', function (e) {
    if (!desktopQuery.matches || (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft')) return;
    if (e.target.closest('.poster__open') && e.target.tagName === 'VIDEO') return;
    var cur = FINALS.indexOf(document.querySelector('.poster.is-open').getAttribute('data-id'));
    var next = (cur + (e.key === 'ArrowRight' ? 1 : -1) + FINALS.length) % FINALS.length;
    e.preventDefault();
    select(FINALS[next], { focus: true });
  });

  /* ---------- Shared dialog handling ---------- */
  var openDialogs = [];
  function openDialog(dlg, trigger) {
    dlg._trigger = trigger || document.activeElement;
    dlg.showModal();
    openDialogs.push(dlg);
    dialogOpen = true;
    root.classList.add('is-locked');
    updateHeroVideo();
  }
  function onDialogClose(dlg) {
    dlg.querySelectorAll('video').forEach(function (v) { v.pause(); });
    openDialogs = openDialogs.filter(function (d) { return d !== dlg; });
    dialogOpen = openDialogs.length > 0;
    if (!dialogOpen) root.classList.remove('is-locked');
    var t = dlg._trigger;
    if (t && document.contains(t) && typeof t.focus === 'function') t.focus({ preventScroll: true });
    updateHeroVideo();
  }

  /* ---------- Viewer ---------- */
  var viewer = document.getElementById('viewer');
  var vTitle = document.getElementById('viewerTitle');
  var vCount = document.getElementById('viewerCount');
  var vContent = document.getElementById('viewerContent');
  var vCaption = document.getElementById('viewerCaption');
  var vPrev = document.getElementById('viewerPrev');
  var vNext = document.getElementById('viewerNext');
  var vState = { items: [], i: 0, game: null };

  function mediaItems(g) {
    var out = [];
    (g.videos || []).forEach(function (v) { out.push({ kind: 'video', src: v.src, poster: v.poster, title: v.title, caption: v.caption }); });
    (g.images || []).forEach(function (im) { out.push({ kind: 'image', src: im.src, alt: im.alt, caption: im.caption }); });
    return out;
  }
  function renderViewer(autoplay) {
    var it = vState.items[vState.i];
    var old = vContent.querySelector('video');
    if (old) old.pause();
    vContent.textContent = '';
    if (it.kind === 'video') {
      var v = el('video');
      v.controls = true; v.playsInline = true; v.preload = 'metadata';
      v.src = MEDIA + it.src;
      if (it.poster) v.poster = MEDIA + it.poster;
      v.setAttribute('aria-label', it.title);
      vContent.appendChild(v);
      if (autoplay) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      vTitle.textContent = vState.game.title + ' · 영상';
      vCaption.textContent = it.title + ' — ' + it.caption;
    } else {
      var d = dims(it.src);
      var img = el('img');
      img.src = MEDIA + it.src; img.alt = it.alt || ''; img.width = d[0]; img.height = d[1];
      vContent.appendChild(img);
      vTitle.textContent = vState.game.title;
      vCaption.textContent = it.caption;
    }
    vCount.textContent = (vState.i + 1) + ' / ' + vState.items.length;
    vPrev.disabled = vState.i === 0;
    vNext.disabled = vState.i === vState.items.length - 1;
  }
  function openViewer(id, index, trigger, autoplay) {
    var g = byId[id];
    if (!g) return;
    vState.game = g;
    vState.items = mediaItems(g);
    if (!vState.items.length) return;
    vState.i = Math.max(0, Math.min(index || 0, vState.items.length - 1));
    renderViewer(!!autoplay);
    openDialog(viewer, trigger);
    (autoplay ? vContent.querySelector('video') || document.getElementById('viewerClose') : document.getElementById('viewerClose')).focus();
  }
  vPrev.addEventListener('click', function () { if (vState.i > 0) { vState.i--; renderViewer(false); } });
  vNext.addEventListener('click', function () { if (vState.i < vState.items.length - 1) { vState.i++; renderViewer(false); } });
  document.getElementById('viewerClose').addEventListener('click', function () { viewer.close(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.target.tagName === 'VIDEO') return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); vPrev.click(); }
    if (e.key === 'ArrowRight') { e.preventDefault(); vNext.click(); }
  });
  viewer.addEventListener('close', function () { vContent.textContent = ''; onDialogClose(viewer); });

  /* ---------- Detail sheet ---------- */
  var sheet = document.getElementById('detail');
  var sheetTitle = document.getElementById('detailTitle');
  var sheetBody = document.getElementById('detailBody');
  var sheetScroll = document.getElementById('detailScroll');
  var currentList = games.map(function (g) { return g.id; });
  var clipIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) entry.target.pause();
    });
  }, { root: sheetScroll, threshold: 0 }) : null;

  function addFact(dl, term, value, cls) {
    if (!value) return;
    var dt = el('dt', null, term);
    var dd = el('dd', cls || null, value);
    dl.appendChild(dt); dl.appendChild(dd);
  }
  function list(items) {
    var ul = el('ul', 'case-list');
    items.forEach(function (t) { ul.appendChild(el('li', null, t)); });
    return ul;
  }
  function block(title, child) {
    var b = el('section', 'case-block');
    b.appendChild(el('h3', 'case-h', title));
    if (child) b.appendChild(child);
    return b;
  }
  function renderDetail(g) {
    if (clipIO) clipIO.disconnect();
    sheetBody.querySelectorAll('video').forEach(function (v) { v.pause(); });
    sheetTitle.textContent = g.title;
    sheetBody.textContent = '';

    var lead = el('div', 'case-lead');
    lead.appendChild(el('p', 'case-sub', g.subtitle));
    var dl = el('dl', 'case-facts');
    if (g.final) addFact(dl, '구분', '최종 프로젝트');
    addFact(dl, '상태', g.status, 'is-status');
    addFact(dl, '엔진', g.engine);
    addFact(dl, '장르', g.category);
    addFact(dl, '기간', g.period);
    addFact(dl, '연도', g.year);
    addFact(dl, '팀', g.team);
    addFact(dl, '맡은 일', g.role);
    if (g.tools && g.tools.length) addFact(dl, '제작 도구', g.tools.join(' · '));
    lead.appendChild(dl);

    var media = el('div', 'case-media');
    media.id = 'caseMedia';
    var items = mediaItems(g);
    var vids = g.videos || [];
    var imgs = g.images || [];
    if (vids.length) {
      var vg = el('section', 'case-group');
      vg.appendChild(el('h3', 'case-h', '영상'));
      var allTall = vids.every(function (v) { return shapeOf(v.poster || '') === 'tall'; });
      var clips = el('div', 'clips' + (allTall && vids.length > 1 ? ' clips--pair' : ''));
      vids.forEach(function (v, i) {
        var fig = el('figure', 'clip' + (shapeOf(v.poster || '') === 'tall' ? ' clip--tall' : ''));
        var video = el('video');
        video.controls = true; video.playsInline = true; video.preload = 'none';
        video.src = MEDIA + v.src;
        if (v.poster) { video.poster = MEDIA + v.poster; var d = dims(v.poster); video.width = d[0]; video.height = d[1]; }
        video.setAttribute('aria-label', v.title);
        video.id = 'clip-' + i;
        if (clipIO) clipIO.observe(video);
        fig.appendChild(video);
        var cap = el('figcaption');
        cap.appendChild(el('p', 'clip__title', v.title));
        cap.appendChild(el('p', 'clip__cap', v.caption));
        fig.appendChild(cap);
        clips.appendChild(fig);
      });
      vg.appendChild(clips);
      media.appendChild(vg);
    }
    if (imgs.length) {
      var ig = el('section', 'case-group');
      ig.appendChild(el('h3', 'case-h', '장면'));
      var gal = el('div', 'case-gallery');
      imgs.forEach(function (im, i) {
        var shape = shapeOf(im.src);
        var fig = el('figure', 'shot' + (shape === 'tall' ? ' shot--tall' : '') + ((i === 0 && shape !== 'tall') || shape === 'band' ? ' shot--wide' : ''));
        var btn = el('button', 'shot__btn');
        btn.type = 'button';
        btn.setAttribute('aria-label', (im.alt || g.title) + ' 크게 보기');
        var img = el('img');
        var d = dims(im.src);
        img.src = MEDIA + im.src; img.alt = im.alt || ''; img.width = d[0]; img.height = d[1];
        img.loading = 'lazy'; img.decoding = 'async';
        btn.appendChild(img);
        btn.addEventListener('click', function () { openViewer(g.id, vids.length + i, btn, false); });
        fig.appendChild(btn);
        fig.appendChild(el('figcaption', 'shot__cap', im.caption));
        gal.appendChild(fig);
      });
      ig.appendChild(gal);
      media.appendChild(ig);
    }
    if (!items.length) {
      var empty = el('div', 'case-empty');
      empty.appendChild(el('p', 'case-empty__h', '확보한 실행 화면이 없습니다'));
      empty.appendChild(el('p', null, '이 작품은 캡처와 영상이 없어 글로만 정리했습니다. 상태: ' + g.status));
      media.appendChild(empty);
    }

    var text = el('div', 'case-text');
    var about = el('section', 'case-block');
    about.appendChild(el('h3', 'case-h', '소개'));
    about.appendChild(el('p', 'case-desc', g.description));
    text.appendChild(about);
    if (g.features && g.features.length) text.appendChild(block('주요 기능', list(g.features)));
    if (g.details && g.details.length) {
      var det = block('자세히');
      g.details.forEach(function (d) {
        var s = el('div', 'case-detail');
        s.appendChild(el('h4', null, d.title));
        s.appendChild(el('p', null, d.text));
        det.appendChild(s);
      });
      text.appendChild(det);
    }
    if (g.history && g.history.length) text.appendChild(block('개발 이력', list(g.history)));

    var idx = currentList.indexOf(g.id);
    if (idx === -1) { currentList = games.map(function (x) { return x.id; }); idx = currentList.indexOf(g.id); }
    var step = el('nav', 'case-step');
    step.setAttribute('aria-label', '다른 작품');
    [[-1, '이전 작품'], [1, '다음 작품']].forEach(function (pair) {
      var other = byId[currentList[(idx + pair[0] + currentList.length) % currentList.length]];
      if (!other || other.id === g.id) return;
      var b = el('button', 'btn ' + (pair[0] < 0 ? 'btn--black' : 'btn--red'));
      b.type = 'button';
      b.appendChild(el('span', null, pair[1] + ' · ' + other.title));
      b.addEventListener('click', function () { renderDetail(other); sheetScroll.scrollTop = 0; sheetTitle.focus(); });
      step.appendChild(b);
    });
    text.appendChild(step);

    sheetBody.appendChild(lead);
    sheetBody.appendChild(media);
    sheetBody.appendChild(text);
  }
  function openDetail(id, trigger) {
    var g = byId[id];
    if (!g) return;
    renderDetail(g);
    sheetScroll.scrollTop = 0;
    openDialog(sheet, trigger);
    sheetTitle.setAttribute('tabindex', '-1');
    sheetTitle.focus();
  }
  document.getElementById('detailClose').addEventListener('click', function () { sheet.close(); });
  sheet.addEventListener('close', function () { onDialogClose(sheet); });

  document.addEventListener('click', function (e) {
    var d = e.target.closest('[data-detail]');
    if (d) { e.preventDefault(); openDetail(d.getAttribute('data-detail'), d); return; }
    var v = e.target.closest('[data-video]');
    if (v) { e.preventDefault(); openViewer(v.getAttribute('data-video'), 0, v, true); }
  });

  /* ---------- Archive ---------- */
  var rowsEl = document.getElementById('rows');
  var filtersEl = document.getElementById('filters');
  var countEl = document.getElementById('archiveCount');
  var activeCat = '전체';

  function renderRows() {
    rowsEl.textContent = '';
    var shown = games.filter(function (g) { return activeCat === '전체' || g.category === activeCat; });
    currentList = shown.map(function (g) { return g.id; });
    shown.forEach(function (g, i) {
      var li = el('li', 'row');
      li.setAttribute('data-reveal', '');
      li.style.setProperty('--d', String(i % 2 + Math.floor((i % 8) / 2)));
      var b = el('button', 'row__btn');
      b.type = 'button';
      b.setAttribute('data-detail', g.id);
      var th = el('span', 'row__thumb');
      var first = (g.images || [])[0];
      if (first) {
        var img = el('img');
        var d = dims(first.src);
        img.src = MEDIA + first.src; img.alt = ''; img.width = d[0]; img.height = d[1];
        img.loading = 'lazy'; img.decoding = 'async';
        if (first.pos) img.style.objectPosition = first.pos;
        th.appendChild(img);
      } else {
        th.className = 'row__thumb row__thumb--none';
        th.textContent = '실행 화면 미확보';
      }
      b.appendChild(th);
      var body = el('span', 'row__body');
      body.appendChild(el('span', 'row__title', g.title));
      body.appendChild(el('span', 'row__sub', g.subtitle));
      var meta = el('span', 'row__meta');
      if (g.final) { meta.appendChild(el('span', 'row__final', '최종 프로젝트')); meta.appendChild(document.createTextNode(' · ')); }
      meta.appendChild(document.createTextNode(g.category));
      if (g.engine) meta.appendChild(el('span', 'row__engine', ' · ' + g.engine));
      meta.appendChild(document.createTextNode(' · ' + (g.period || g.year)));
      body.appendChild(meta);
      if (g.team) body.appendChild(el('span', 'row__meta', g.team + ' · 맡은 일: ' + g.role));
      body.appendChild(el('span', 'row__status', g.status));
      b.appendChild(body);
      li.appendChild(b);
      rowsEl.appendChild(li);
    });
    countEl.textContent = activeCat === '전체'
      ? '전체 ' + shown.length + '편'
      : activeCat + ' ' + shown.length + '편 · 전체 ' + games.length + '편 중';
    observeReveals(rowsEl);
  }
  function renderFilters() {
    var cats = ['전체'];
    var counts = { '전체': games.length };
    games.forEach(function (g) {
      if (!counts[g.category]) { counts[g.category] = 0; cats.push(g.category); }
      counts[g.category]++;
    });
    cats.forEach(function (c) {
      var b = el('button', 'filter');
      b.type = 'button';
      b.setAttribute('aria-pressed', c === activeCat ? 'true' : 'false');
      b.appendChild(el('span', null, c));
      b.appendChild(el('span', 'filter__n', String(counts[c])));
      b.addEventListener('click', function () {
        activeCat = c;
        filtersEl.querySelectorAll('.filter').forEach(function (f) { f.setAttribute('aria-pressed', f === b ? 'true' : 'false'); });
        renderRows();
      });
      filtersEl.appendChild(b);
    });
  }

  /* ---------- Notes ---------- */
  function renderNotes() {
    var host = document.getElementById('notesList');
    (data && data.notes || []).forEach(function (n, i) {
      var a = el('article', 'note');
      a.setAttribute('data-reveal', '');
      a.style.setProperty('--d', String(i % 3));
      a.appendChild(el('h3', 'note__title', n.title));
      a.appendChild(el('p', 'note__text', n.text));
      host.appendChild(a);
    });
  }

  /* ---------- Reveal on scroll ---------- */
  var revealIO = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('is-in'); revealIO.unobserve(en.target); }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }) : null;
  function observeReveals(scope) {
    (scope || document).querySelectorAll('[data-reveal]:not(.is-in)').forEach(function (n) {
      if (revealIO) revealIO.observe(n); else n.classList.add('is-in');
    });
  }
  function revealAll(force) {
    if (force) document.querySelectorAll('[data-reveal]').forEach(function (n) { n.classList.add('is-in'); });
    else observeReveals();
  }

  /* Portrait posters carry three more real scenes under the title; each opens the viewer. */
  function buildStrips() {
    posters.forEach(function (p) {
      if (p.getAttribute('data-shape') !== 'portrait') return;
      var g = byId[p.getAttribute('data-id')];
      if (!g || !g.images || g.images.length < 4) return;
      var strip = el('div', 'poster__strip');
      strip.setAttribute('role', 'group');
      strip.setAttribute('aria-label', g.title + ' 장면');
      g.images.slice(1, 4).forEach(function (im, k) {
        var b = el('button', 'strip__btn');
        b.type = 'button';
        b.setAttribute('aria-label', im.alt + ' 크게 보기');
        var img = el('img');
        var d = dims(im.src);
        img.src = MEDIA + im.src; img.alt = ''; img.width = d[0]; img.height = d[1];
        img.decoding = 'async';
        b.appendChild(img);
        b.addEventListener('click', function () { openViewer(g.id, (g.videos || []).length + 1 + k, b, false); });
        strip.appendChild(b);
      });
      var meta = p.querySelector('.poster__meta');
      meta.parentNode.insertBefore(strip, meta.nextSibling);
    });
  }

  if (games.length) {
    renderFilters();
    renderRows();
    renderNotes();
    buildStrips();
  }
  observeReveals();

  /* Posters arrive as panel wipes, once, on load. */
  posters.forEach(function (p, i) {
    p.style.setProperty('--i', String(i));
    if (motionOn()) {
      p.classList.add('is-entering');
      setTimeout(function () { p.classList.remove('is-entering'); }, 1200);
    }
  });
  root.classList.add('reveal-ready');
  updateHeroVideo();
})();
