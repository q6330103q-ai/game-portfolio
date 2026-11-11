/* 시안 A · 에디토리얼 — renders window.PORTFOLIO (../../../games.js) as a magazine issue */
(function () {
  'use strict';

  var ROOT = '../../../';
  var FINAL_IDS = ['necro-climb', 'football-director', 'mallang-shelter'];
  /* each final keeps its own screen shape on the cover: two vertical phone captures, or two stacked wide frames */
  var COVER = {
    'necro-climb': { shape: 'tall', shots: [0, 2] },
    'football-director': { shape: 'wide', shots: [0, 2] },
    'mallang-shelter': { shape: 'tall-m', shots: [0, 1] }
  };
  /* pixel sizes of the media files, so every frame is laid out at its true ratio before it loads */
  var SIZES = {"adrift-deck":[1016,640],"adrift-editor":[1280,770],"adrift-ocean":[1016,640],"adrift-scoop":[1016,640],"alkkagi-aim":[731,404],"alkkagi-end":[731,404],"alkkagi-growth":[731,404],"arena-fate":[1600,900],"arena-unreal":[1600,900],"aurora":[1440,900],"dice-combat":[738,1600],"dice-menu":[540,1170],"dungeon":[738,1600],"football-career":[1280,800],"football-match":[1600,900],"football-thunder":[768,512],"greed-attack":[1600,900],"greed-boss":[1600,900],"greed-city":[1600,900],"greed-early-absorb":[1600,1000],"greed-gate":[1600,900],"greed-title":[1600,900],"greed-workbench":[1600,900],"hanbit-clash":[1280,720],"hanbit-cutin":[1280,720],"hanbit-lineup":[1280,720],"hanbit-match":[1280,720],"hanbit-skills":[1600,976],"hanbit-transfer":[1280,720],"last-armor":[1280,720],"last-combat":[1280,720],"last-verdict":[1600,900],"lucky-growth":[1280,720],"lucky-play":[1280,720],"lucky-title":[1280,720],"lumi-evolution":[1600,900],"lumi-night":[1600,900],"lumi-raptor":[1600,900],"lumi-start":[1600,900],"lumi3d-evolution":[1280,720],"lumi3d-forest":[1280,720],"mafia":[1440,900],"mallang-details":[540,960],"mallang-eating":[540,960],"mallang-help":[540,960],"mallang-room":[540,960],"mallang-sharing":[540,960],"mukbot-charge":[1600,942],"mukbot-collect":[1600,942],"mukbot-day1":[1600,942],"mukbot-ghost":[1600,942],"necro-2d-prototype":[1280,720],"necro-battle":[540,1170],"necro-build":[540,1170],"necro-guardian":[540,1170],"necro-map":[540,1170],"necro-relic":[540,1170],"necro-title":[720,1280],"necro-upgrade":[540,1170],"pixel-frontier-buildings":[1600,900],"pixel-frontier-cinematic":[1280,720],"pixel-frontier-deploy":[1600,900],"pixel-frontier-golem":[1600,900],"pixel-frontier-guardian":[1600,900],"pixel-frontier-prototype":[1600,900],"pixel-frontier-qa-army":[1280,720],"pixel-frontier-roulette":[1600,900],"pixel-frontier-title":[1600,900],"rift-gameplay":[1600,900],"rift-title":[1600,900],"seongrim-burst":[1280,720],"seongrim-foxfire":[1280,720],"seongrim-gate":[1400,900],"seongrim-village-render":[1600,1000],"snow-leopard-chat":[780,600],"snow-leopard-run":[360,360],"snow-leopard-tail":[360,360],"snow-leopard-walk":[360,360],"star-guardian-clear":[1600,900],"star-guardian-combat":[1440,900],"star-guardian-dragon":[1600,900],"star-guardian-levelup":[1440,900],"star-guardian-shooting":[1440,900],"star-guardian-yeti":[1600,900],"threemin-boss-arena":[1600,1000],"threemin-boss":[1600,1000],"threemin-clear":[1600,1000],"threemin-companion":[1600,1000],"threemin-forge":[1600,1000],"threemin-puzzle":[1600,1000],"threemin-title":[1600,1000],"tom-jerry":[1280,800],"verdict-hallway":[1600,1000],"verdict-lobby":[1600,1000],"verdict-room":[1600,1000],"verdict-title":[1600,1000],"wall-breaker-arc":[1280,400],"wall-breaker-skins":[1280,400],"wall-breaker-ultimate":[1280,400],"wall-breaker-upgrade":[1280,400]};

  var doc = document.documentElement;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  var esc = function (s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  };
  var url = function (p) { return ROOT + p; };
  var size = function (p) {
    var key = String(p).replace(/^media\//, '').replace(/\.webp$/, '');
    return SIZES[key] || [16, 10];
  };
  var shapeOf = function (p) {
    var s = size(p), r = s[0] / s[1];
    if (r < 0.8) return 'tall';
    if (r > 2.4) return 'strip';
    if (r < 1.2) return 'square';
    return 'wide';
  };
  var motionOn = function () { return doc.getAttribute('data-motion') === 'on'; };

  var P = window.PORTFOLIO;
  if (!P || !Array.isArray(P.games) || !P.games.length) {
    var err = $('#dataError');
    if (err) err.hidden = false;
    return;
  }
  var games = P.games;
  var byId = {};
  games.forEach(function (g) { byId[g.id] = g; });
  var imgs = function (g) { return Array.isArray(g.images) ? g.images : []; };
  var vids = function (g) { return Array.isArray(g.videos) ? g.videos : []; };

  $('#gameCount').textContent = games.length;
  $('#archiveTotal').textContent = games.length;

  /* ---------- motion toggle ---------- */
  var motionBtn = $('#motionToggle');
  function syncMotionLabel() {
    motionBtn.textContent = motionOn() ? '모션 끄기' : '모션 켜기';
  }
  syncMotionLabel();
  motionBtn.addEventListener('click', function () {
    var next = motionOn() ? 'off' : 'on';
    doc.setAttribute('data-motion', next);
    try { localStorage.setItem('gp-r2a-motion', next); } catch (e) { /* storage unavailable */ }
    if (next === 'off') revealAll();
    syncMotionLabel();
  });

  /* ---------- cover: the three finals ---------- */
  function renderFinals() {
    $('#finals').innerHTML = FINAL_IDS.map(function (id, c) {
      var g = byId[id];
      if (!g) return '';
      var cover = COVER[id];
      var shots = cover.shots.map(function (i, s) {
        var im = imgs(g)[i];
        if (!im) return '';
        var wh = size(im.src);
        return '<figure class="shot" style="--c:' + c + ';--s:' + s + '"><img src="' + esc(url(im.src)) + '" alt="' + esc(im.alt) +
          '" width="' + wh[0] + '" height="' + wh[1] + '"' + (im.pos ? ' style="object-position:' + esc(im.pos) + '"' : '') + ' fetchpriority="high" decoding="async"></figure>';
      }).join('');
      var meta = [g.category, g.engine, g.period || g.year].filter(Boolean).join(' · ');
      var hasVideo = vids(g).length > 0;
      return '<article class="final" data-shape="' + cover.shape + '" style="--c:' + c + '" aria-labelledby="final-' + id + '">' +
        '<div class="final__media" data-open="' + id + '">' + shots + '</div>' +
        '<div class="final__text">' +
          '<h2 class="final__title" id="final-' + id + '">' + esc(g.title) + '</h2>' +
          '<p class="final__sub">' + esc(g.subtitle) + '</p>' +
          '<p class="final__meta">' + esc(meta) + '<br>' + esc(g.status) + '</p>' +
          '<div class="final__actions">' +
            '<a class="btn btn--primary" href="#game=' + id + '" data-open="' + id + '" aria-label="' + esc(g.title) + ' 작품 보기">작품 보기</a>' +
            (hasVideo ? '<a class="btn btn--quiet" href="#game=' + id + '" data-open="' + id + '" data-video aria-label="' + esc(g.title) + ' 영상 보기"><span class="btn__play" aria-hidden="true"></span>영상 보기</a>' : '') +
          '</div>' +
        '</div>' +
      '</article>';
    }).join('');
  }

  /* ---------- compare sheet ---------- */
  function renderCompare() {
    var finals = FINAL_IDS.map(function (id) { return byId[id]; }).filter(Boolean);
    var rows = [
      ['장르', function (g) { return esc(g.category); }],
      ['엔진', function (g) { return esc(g.engine); }],
      ['개발 기간', function (g) { return esc(g.period || g.year); }],
      ['확인한 상태', function (g) { return esc(g.status); }],
      ['핵심 기능', function (g) {
        return '<ul class="feat">' + (g.features || []).map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>';
      }],
      ['화면과 영상', function (g) { return '캡처 ' + imgs(g).length + '장 · 영상 ' + vids(g).length + '편'; }]
    ];
    var head = '<colgroup><col class="c-label">' + finals.map(function () { return '<col>'; }).join('') + '</colgroup>' +
      '<thead><tr><td></td>' + finals.map(function (g) {
        var im = imgs(g)[0];
        return '<th scope="col"><a class="ch" href="#game=' + g.id + '" data-open="' + g.id + '">' +
          '<span class="ch__thumb">' + (im ? '<img src="' + esc(url(im.src)) + '" alt="" loading="lazy" style="object-position:' + esc(im.pos || '50% 30%') + '">' : '') + '</span>' +
          '<span class="ch__name">' + esc(g.title) + '</span></a></th>';
      }).join('') + '</tr></thead>';
    var body = '<tbody>' + rows.map(function (r) {
      return '<tr><th scope="row">' + r[0] + '</th>' + finals.map(function (g) {
        return '<td data-game="' + esc(g.title) + '">' + r[1](g) + '</td>';
      }).join('') + '</tr>';
    }).join('') + '</tbody>';
    var foot = '<tfoot><tr><th scope="row"><span class="sr">열기</span></th>' + finals.map(function (g) {
      return '<td><a class="btn btn--quiet" href="#game=' + g.id + '" data-open="' + g.id + '">' + esc(g.title) + ' 보기</a></td>';
    }).join('') + '</tr></tfoot>';
    $('#compareTable').innerHTML = '<caption class="sr">최종 프로젝트 세 편 비교</caption>' + head + body + foot;
  }

  /* ---------- archive: contents page grouped by genre ---------- */
  var FILTERS = [
    { id: 'all', label: '전체', test: function () { return true; } },
    { id: 'final', label: '최종작', test: function (g) { return !!g.final; } },
    { id: 'team', label: '팀 프로젝트', test: function (g) { return !!g.team; } },
    { id: 'video', label: '영상 있음', test: function (g) { return vids(g).length > 0; } }
  ];
  var activeFilter = 'all';

  function thumbHtml(g) {
    var im = imgs(g)[0];
    if (!im) return '<span class="entry__thumb entry__thumb--none"><span>실행 화면 미확보</span></span>';
    var wh = size(im.src);
    var shape = shapeOf(im.src);
    var pos = im.pos ? ' style="object-position:' + esc(im.pos) + '"' : '';
    return '<span class="entry__thumb" data-fit="' + (shape === 'wide' || shape === 'tall' ? 'cover' : 'contain') + '"><img src="' + esc(url(im.src)) +
      '" alt="" loading="lazy" decoding="async" width="' + wh[0] + '" height="' + wh[1] + '"' + pos + '></span>';
  }

  function renderArchive() {
    var cats = [];
    games.forEach(function (g) { if (cats.indexOf(g.category) < 0) cats.push(g.category); });
    $('#archiveGroups').innerHTML = cats.map(function (cat) {
      var list = games.filter(function (g) { return g.category === cat; });
      return '<section class="genre" data-cat="' + esc(cat) + '" aria-label="' + esc(cat) + '">' +
        '<h3 class="genre__name">' + esc(cat) + '<span class="genre__n" data-n>' + list.length + '편</span></h3>' +
        '<ul class="genre__list">' + list.map(function (g) {
          var marks = [];
          if (g.final) marks.push('<span class="entry__mark">최종작</span>');
          if (g.team) marks.push('<span class="entry__mark">' + esc(g.team) + '</span>');
          var meta = marks.concat([esc(g.engine), esc(g.status)]).join(' · ');
          return '<li data-id="' + g.id + '"><a class="entry" href="#game=' + g.id + '" data-open="' + g.id + '">' + thumbHtml(g) +
            '<span class="entry__text"><span class="entry__title">' + esc(g.title) + '</span>' +
            '<span class="entry__sub" style="display:block">' + esc(g.subtitle) + '</span>' +
            '<span class="entry__meta" style="display:block">' + meta + '</span></span></a></li>';
        }).join('') + '</ul></section>';
    }).join('');

    $('#filters').innerHTML = FILTERS.map(function (f) {
      var n = games.filter(f.test).length;
      return '<button class="filter" type="button" data-filter="' + f.id + '" aria-pressed="' + (f.id === activeFilter) + '">' +
        f.label + '<span class="filter__n">' + n + '</span></button>';
    }).join('');
    applyFilter(activeFilter, false);
  }

  function applyFilter(id, animate) {
    var f = FILTERS.filter(function (x) { return x.id === id; })[0] || FILTERS[0];
    activeFilter = f.id;
    $$('.filter').forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === f.id)); });
    var shown = [];
    $$('.genre').forEach(function (sec) {
      var count = 0;
      $$('li[data-id]', sec).forEach(function (li) {
        var ok = f.test(byId[li.getAttribute('data-id')]);
        li.hidden = !ok;
        if (ok) { count++; shown.push(li.firstElementChild); }
      });
      sec.hidden = count === 0;
      $('[data-n]', sec).textContent = count + '편';
    });
    $('#archiveStatus').textContent = (f.id === 'all' ? '전체 ' : f.label + ' ') + shown.length + '편을 보고 있습니다.';
    if (animate && motionOn()) {
      shown.forEach(function (el, i) {
        el.classList.remove('is-in');
        el.classList.add('pre');
        el.style.setProperty('--d', Math.min(i, 10) * 50 + 'ms');
      });
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          shown.forEach(function (el) { el.classList.remove('pre'); el.classList.add('is-in'); });
        });
      });
    }
  }

  $('#filters').addEventListener('click', function (e) {
    var b = e.target.closest('.filter');
    if (b) applyFilter(b.getAttribute('data-filter'), true);
  });

  /* ---------- notes ---------- */
  function renderNotes() {
    $('#notesGrid').innerHTML = (P.notes || []).map(function (n, i) {
      return '<div class="note" data-reveal style="--d:' + (i % 3) * 80 + 'ms"><h3 class="note__title">' + esc(n.title) + '</h3><p class="note__text">' + esc(n.text) + '</p></div>';
    }).join('');
  }

  /* ---------- entrances (once, only below the first screen) ---------- */
  var io = null;
  function revealAll() {
    $$('.pre').forEach(function (el) { el.classList.remove('pre'); el.classList.add('is-in'); });
    if (io) io.disconnect();
  }
  function setupReveals() {
    if (!motionOn() || !('IntersectionObserver' in window)) return;
    io = new IntersectionObserver(function (entries) {
      var batch = 0;
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target;
        if (el.classList.contains('entry')) el.style.setProperty('--d', Math.min(batch++, 6) * 70 + 'ms');
        el.classList.remove('pre');
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    var limit = window.innerHeight * 0.92;
    $$('[data-reveal], .entry').forEach(function (el) {
      if (el.getBoundingClientRect().top > limit) { el.classList.add('pre'); io.observe(el); }
    });
    window.addEventListener('beforeprint', revealAll);
  }

  /* ---------- video rules: one plays at a time; off-screen, closed or hidden tab pauses ---------- */
  function pauseAll() { $$('video').forEach(function (v) { if (!v.paused) v.pause(); }); }
  document.addEventListener('play', function (e) {
    if (e.target.tagName !== 'VIDEO') return;
    $$('video').forEach(function (v) { if (v !== e.target && !v.paused) v.pause(); });
  }, true);
  document.addEventListener('visibilitychange', function () { if (document.hidden) pauseAll(); });
  var vio = 'IntersectionObserver' in window ? new IntersectionObserver(function (entries) {
    entries.forEach(function (e) { if (!e.isIntersecting && !e.target.paused) e.target.pause(); });
  }, { root: $('#story'), threshold: 0.15 }) : null;

  /* ---------- detail: the case-study spread ---------- */
  var dlg = $('#story');
  var storyBody = $('#storyBody');
  var currentId = null;
  var lastFocus = null;
  var pushed = false; /* true while the open spread owns a history entry */

  function factsHtml(g) {
    var rows = [];
    if (g.final) rows.push(['구분', '최종 프로젝트']);
    if (g.team) rows.push(['팀', g.team]);
    if (g.role) rows.push(['맡은 일', g.role]);
    rows.push(['장르', g.category]);
    rows.push(['엔진', g.engine]);
    rows.push([g.period ? '개발 기간' : '연도', g.period || g.year]);
    rows.push(['상태', g.status]);
    if (g.tools && g.tools.length) rows.push(['제작 도구', g.tools.join(', ')]);
    return '<dl class="facts">' + rows.filter(function (r) { return r[1]; }).map(function (r) {
      return '<dt>' + esc(r[0]) + '</dt><dd>' + esc(r[1]) + '</dd>';
    }).join('') + '</dl>';
  }

  function videoHtml(v) {
    var shape = v.poster ? shapeOf(v.poster) : 'wide';
    var wh = v.poster ? size(v.poster) : [16, 9];
    return '<figure class="vid" data-shape="' + shape + '"><video controls playsinline preload="none"' +
      (v.poster ? ' poster="' + esc(url(v.poster)) + '"' : '') + ' width="' + wh[0] + '" height="' + wh[1] + '" aria-label="' + esc(v.title) + '">' +
      '<source src="' + esc(url(v.src)) + '" type="video/mp4"></video>' +
      '<figcaption><p class="vid__title">' + esc(v.title) + '</p><p class="cap">' + esc(v.caption) + '</p></figcaption></figure>';
  }

  function block(title, inner, cls) {
    return '<section class="sp-block' + (cls ? ' ' + cls : '') + '"><h3 class="sp-h">' + esc(title) + '</h3>' + inner + '</section>';
  }

  function renderStory(g) {
    var images = imgs(g), videos = vids(g);
    var idx = games.indexOf(g);
    var next = games[(idx + 1) % games.length];

    var lead;
    if (images.length) {
      var im = images[0], wh = size(im.src);
      lead = '<figure class="sp-lead" data-shape="' + (shapeOf(im.src) === 'tall' ? 'tall' : 'wide') + '">' +
        '<button class="sp-lead__btn" type="button" data-view="0" aria-label="' + esc(im.alt) + ' 크게 보기">' +
        '<img src="' + esc(url(im.src)) + '" alt="' + esc(im.alt) + '" width="' + wh[0] + '" height="' + wh[1] + '"></button>' +
        '<figcaption class="cap">' + esc(im.caption) + '</figcaption></figure>';
    } else {
      lead = '<div class="sp-noimg"><p class="sp-noimg__big">실행 화면 미확보</p><p class="sp-noimg__small">확보된 화면과 영상이 없어 기록만 싣습니다.</p></div>';
    }

    var actions = [];
    if (videos.length) actions.push('<button class="btn btn--primary" type="button" data-jump="sp-videos"><span class="btn__play" aria-hidden="true"></span>영상 보기</button>');
    if (images.length > 1) actions.push('<button class="btn btn--quiet" type="button" data-jump="sp-gallery">화면 ' + images.length + '장 보기</button>');

    var main = ['<p class="sp-lede">' + esc(g.description) + '</p>'];
    var featuresB = g.features && g.features.length ? block('핵심 기능', '<ul class="feat">' + g.features.map(function (f) { return '<li>' + esc(f) + '</li>'; }).join('') + '</ul>') : '';
    var historyB = g.history && g.history.length ? block('개발 이력', '<ol class="hist">' + g.history.map(function (h) { return '<li>' + esc(h) + '</li>'; }).join('') + '</ol>') : '';
    var detailsB = (g.details || []).map(function (d) {
      return '<section class="sp-block sp-detail"><h3 class="sp-h">' + esc(d.title) + '</h3><p>' + esc(d.text) + '</p></section>';
    }).join('');

    var side;
    if (videos.length) {
      main.push(featuresB, historyB, detailsB);
      var allTall = videos.length > 1 && videos.every(function (v) { return v.poster && shapeOf(v.poster) === 'tall'; });
      side = '<aside class="sp-side' + (allTall ? ' sp-side--pair' : '') + '" id="sp-videos" aria-label="영상">' + '<h3 class="sp-h">영상 ' + videos.length + '편</h3>' + videos.map(videoHtml).join('') + '</aside>';
    } else if (detailsB) {
      main.push(featuresB, historyB);
      side = '<div class="sp-side">' + detailsB + '</div>';
    } else {
      side = '<div class="sp-side">' + featuresB + historyB + '</div>';
    }

    var gallery = '';
    if (images.length > 1) {
      gallery = '<section class="sp-gallery" id="sp-gallery" aria-labelledby="sp-gallery-title">' +
        '<div class="sp-gallery__head"><h3 class="sp-gallery__title" id="sp-gallery-title">화면 ' + images.length + '장</h3>' +
        '<p class="sp-gallery__hint">누르면 원본 비율 그대로 크게 봅니다.</p></div>' +
        '<div class="plates">' + images.map(function (im, i) {
          var wh = size(im.src), shape = shapeOf(im.src);
          return '<figure class="plate" data-shape="' + (shape === 'square' ? 'tall' : shape) + '">' +
            '<button class="plate__btn" type="button" data-view="' + i + '" aria-label="' + esc(im.alt) + ' 크게 보기">' +
            '<img src="' + esc(url(im.src)) + '" alt="' + esc(im.alt) + '" loading="lazy" decoding="async" width="' + wh[0] + '" height="' + wh[1] + '"></button>' +
            '<figcaption class="cap">' + esc(im.caption) + '</figcaption></figure>';
        }).join('') + '</div></section>';
    }

    storyBody.innerHTML =
      '<header class="sp-head">' +
        '<div class="sp-intro">' +
          '<h2 class="sp-title" id="storyTitle">' + esc(g.title) + '</h2>' +
          '<p class="sp-dek">' + esc(g.subtitle) + '</p>' +
          factsHtml(g) +
          (actions.length ? '<div class="sp-actions">' + actions.join('') + '</div>' : '') +
        '</div>' + lead +
      '</header>' +
      '<div class="sp-cols"><div class="sp-main">' + main.join('') + '</div>' + side + '</div>' +
      gallery +
      '<nav class="sp-next" aria-label="다음 작품"><button class="sp-next__btn" type="button" data-goto="' + next.id + '">' +
        '<span><span class="sp-next__label">다음 작품</span><span class="sp-next__name">' + esc(next.title) + '</span></span>' +
        '<span class="sp-next__arrow" aria-hidden="true">→</span></button></nav>';

    $('#storyCrumb').textContent = (g.final ? '최종 프로젝트' : g.category) + ' · ' + g.title + ' · ' + (idx + 1) + ' / ' + games.length;
    if (vio) { vio.disconnect(); $$('video', storyBody).forEach(function (v) { vio.observe(v); }); }
    currentId = g.id;
  }

  function lock(on) { doc.classList.toggle('is-locked', on); }

  function openStory(id, opts) {
    opts = opts || {};
    var g = byId[id];
    if (!g) return;
    pauseAll();
    closeViewer(true);
    if (!dlg.open) lastFocus = opts.focusEl || document.activeElement;
    renderStory(g);
    if (opts.history === 'push') { history.pushState({ story: id }, '', '#game=' + id); pushed = true; }
    else if (opts.history === 'replace') history.replaceState({ story: id }, '', '#game=' + id);
    if (!dlg.open) { dlg.showModal(); lock(true); }
    dlg.scrollTop = 0;
    if (opts.video) {
      var v = $('video', storyBody);
      var target = $('#sp-videos', storyBody);
      if (target) target.scrollIntoView({ block: 'start', behavior: 'auto' });
      if (v) {
        v.focus({ preventScroll: true });
        var p = v.play();
        if (p && p.catch) p.catch(function () { /* autoplay refused: native controls stay available */ });
      }
    } else {
      $('#storyClose').focus();
    }
  }

  function closeStory(fromPop) {
    if (!dlg.open) return;
    pauseAll();
    closeViewer(true);
    dlg.close();
    lock(false);
    currentId = null;
    if (!fromPop) {
      if (pushed) history.back();
      else history.replaceState(null, '', location.pathname + location.search);
    }
    pushed = false;
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    lastFocus = null;
  }

  document.addEventListener('click', function (e) {
    var t = e.target.closest('[data-open]');
    if (!t || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();
    var focusEl = t.matches('a, button') ? t : (t.closest('.final') ? $('.btn', t.closest('.final')) : t);
    openStory(t.getAttribute('data-open'), { history: 'push', video: t.hasAttribute('data-video'), focusEl: focusEl });
  });

  $('#storyClose').addEventListener('click', function () { closeStory(false); });
  dlg.addEventListener('cancel', function (e) {
    e.preventDefault();
    if (!$('#viewer').hidden) closeViewer();
    else closeStory(false);
  });
  dlg.addEventListener('close', function () { lock(false); pauseAll(); });

  dlg.addEventListener('click', function (e) {
    var step = e.target.closest('[data-step]');
    if (step && currentId) {
      var i = games.indexOf(byId[currentId]);
      var n = games[(i + Number(step.getAttribute('data-step')) + games.length) % games.length];
      openStory(n.id, { history: 'replace' });
      return;
    }
    var go = e.target.closest('[data-goto]');
    if (go) { openStory(go.getAttribute('data-goto'), { history: 'replace' }); return; }
    var jump = e.target.closest('[data-jump]');
    if (jump) {
      var el = document.getElementById(jump.getAttribute('data-jump'));
      if (el) {
        el.scrollIntoView({ block: 'start', behavior: motionOn() ? 'smooth' : 'auto' });
        if (jump.getAttribute('data-jump') === 'sp-videos') {
          var v = $('video', el);
          if (v) { v.focus({ preventScroll: true }); var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        }
      }
      return;
    }
    var view = e.target.closest('[data-view]');
    if (view) openViewer(Number(view.getAttribute('data-view')), view);
  });

  window.addEventListener('popstate', function () {
    var id = idFromHash();
    if (id) { openStory(id, {}); pushed = !!(history.state && history.state.story); }
    else closeStory(true);
  });

  function idFromHash() {
    var m = /^#game=([\w-]+)/.exec(location.hash);
    return m && byId[m[1]] ? m[1] : null;
  }

  /* ---------- viewer: full image at its own ratio, with its caption ---------- */
  var viewer = $('#viewer');
  var vIndex = 0, vOpener = null;
  function showViewerImage() {
    var list = imgs(byId[currentId]);
    var im = list[vIndex];
    if (!im) return;
    var img = $('#viewerImg');
    img.src = url(im.src);
    img.alt = im.alt;
    $('#viewerCount').textContent = (vIndex + 1) + ' / ' + list.length;
    $('#viewerCap').textContent = im.caption;
    var many = list.length > 1;
    $('#viewerPrev').hidden = !many;
    $('#viewerNext').hidden = !many;
  }
  function openViewer(i, opener) {
    if (!currentId) return;
    vIndex = i;
    vOpener = opener || null;
    pauseAll();
    showViewerImage();
    viewer.hidden = false;
    $('.story__bar').inert = true;
    storyBody.inert = true;
    $('#viewerClose').focus();
  }
  function closeViewer(silent) {
    if (viewer.hidden) return;
    viewer.hidden = true;
    $('.story__bar').inert = false;
    storyBody.inert = false;
    if (!silent && vOpener && document.contains(vOpener)) vOpener.focus();
    vOpener = null;
  }
  function stepViewer(d) {
    var n = imgs(byId[currentId]).length;
    vIndex = (vIndex + d + n) % n;
    showViewerImage();
  }
  $('#viewerClose').addEventListener('click', function () { closeViewer(); });
  $('#viewerPrev').addEventListener('click', function () { stepViewer(-1); });
  $('#viewerNext').addEventListener('click', function () { stepViewer(1); });
  viewer.addEventListener('click', function (e) { if (e.target === viewer) closeViewer(); });
  viewer.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); stepViewer(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); stepViewer(1); }
  });

  /* ---------- go ---------- */
  renderFinals();
  renderCompare();
  renderArchive();
  renderNotes();
  setupReveals();
  /* the cover loads first; the archive's pictures follow in the background so a fast scroll finds them ready */
  window.addEventListener('load', function () {
    $$('img[loading="lazy"]').forEach(function (img) { img.loading = 'eager'; });
  });

  var initial = idFromHash();
  if (initial) openStory(initial, {});
})();
