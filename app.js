(function () {
  'use strict';

  var doc = document;
  var root = doc.documentElement;
  var MOTION_KEY = 'js-game-archive-motion';
  var CATEGORY_ORDER = ['액션', '스포츠', '시뮬레이션', '추리', '아케이드', 'RPG', '실험', '기타'];

  var dom = {};
  var state = {
    motion: true,
    data: null,
    games: [],
    featured: [],
    videos: [],
    notes: [],
    hasData: false,
    query: '',
    activeCategory: 'all',
    currentVideoIndex: -1,
    showreelInView: false,
    showreelAutoplayed: false,
    dialogOpen: false,
    lastDialogTrigger: null,
    scrollPending: false,
    glowFrame: 0,
    glowX: 0,
    glowY: 0
  };

  var reduceQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  var fineQuery = window.matchMedia ? window.matchMedia('(hover: hover) and (pointer: fine)') : null;
  var revealObserver = null;

  function $(selector, scope) {
    return (scope || doc).querySelector(selector);
  }

  function $$(selector, scope) {
    return Array.prototype.slice.call((scope || doc).querySelectorAll(selector));
  }

  function el(tag, className, text) {
    var node = doc.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = String(text);
    return node;
  }

  function clean(value) {
    if (typeof value !== 'string') return '';
    return value.normalize ? value.normalize('NFKC').trim() : value.trim();
  }

  function pad(value) {
    return String(value).padStart(2, '0');
  }

  function safeMediaSrc(value) {
    if (typeof value !== 'string') return '';
    var src = value.trim();
    if (!src) return '';
    if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(src)) return '';
    if (src.indexOf('//') === 0 || src.charAt(0) === '/' || src.charAt(0) === '\\') return '';
    return src;
  }

  function makeImage(src, alt, options) {
    var opts = options || {};
    var img = doc.createElement('img');
    img.src = src;
    img.alt = alt || '';
    img.loading = opts.lazy === false ? 'eager' : 'lazy';
    img.decoding = 'async';
    if (opts.className) img.className = opts.className;
    if (opts.priority) {
      try {
        img.setAttribute('fetchpriority', 'high');
      } catch (error) {
        /* Older browsers ignore fetchpriority. */
      }
    }
    return img;
  }

  /* ---------------------------------------------------------
     Data normalization
     --------------------------------------------------------- */

  function normalizeImage(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var src = safeMediaSrc(raw.src);
    if (!src) return null;
    var pos = clean(raw.pos);
    return {
      src: src,
      alt: clean(raw.alt),
      caption: clean(raw.caption),
      pos: /^\d{1,3}% \d{1,3}%$/.test(pos) ? pos : ''
    };
  }

  function normalizeVideo(raw) {
    if (!raw || typeof raw !== 'object') return null;
    var src = safeMediaSrc(raw.src);
    if (!src) return null;
    return {
      src: src,
      poster: safeMediaSrc(raw.poster),
      title: clean(raw.title),
      caption: clean(raw.caption)
    };
  }

  function normalizeGame(raw, index) {
    var images = Array.isArray(raw.images) ? raw.images.map(normalizeImage).filter(Boolean) : [];
    var videos = Array.isArray(raw.videos) ? raw.videos.map(normalizeVideo).filter(Boolean) : [];
    var features = Array.isArray(raw.features)
      ? raw.features.map(clean).filter(Boolean)
      : [];
    var tools = Array.isArray(raw.tools) ? raw.tools.map(clean).filter(Boolean) : [];
    var history = Array.isArray(raw.history) ? raw.history.map(clean).filter(Boolean) : [];

    return {
      id: clean(raw.id) || 'project-' + (index + 1),
      title: clean(raw.title) || '제목 없는 프로젝트',
      subtitle: clean(raw.subtitle),
      engine: clean(raw.engine),
      category: clean(raw.category),
      status: clean(raw.status),
      description: clean(raw.description),
      year: clean(raw.year),
      period: clean(raw.period),
      team: clean(raw.team),
      role: clean(raw.role),
      tools: tools,
      history: history,
      features: features,
      images: images,
      videos: videos,
      featured: raw.featured === true
    };
  }

  function readPortfolio() {
    var source = window.PORTFOLIO;
    if (!source || typeof source !== 'object' || !Array.isArray(source.games)) return null;

    var seen = Object.create(null);
    var games = [];
    source.games.forEach(function (raw, index) {
      if (!raw || typeof raw !== 'object') return;
      var game = normalizeGame(raw, index);
      if (seen[game.id]) return;
      seen[game.id] = true;
      games.push(game);
    });

    return {
      name: clean(source.name),
      games: games,
      notes: Array.isArray(source.notes) ? source.notes.slice() : []
    };
  }

  /* ---------------------------------------------------------
     DOM cache
     --------------------------------------------------------- */

  function cacheDom() {
    [
      'motionToggle', 'motionState', 'motionAnnounce', 'pointerGlow', 'scrollProgress',
      'siteHeader', 'dataNotice', 'dataNoticeText', 'dataRetry', 'heroStage',
      'heroFrameCount', 'featuredGrid', 'archiveMeta', 'projectSearch',
      'categoryFilters', 'resetFilters', 'projectGrid', 'archiveEmpty', 'emptyTitle',
      'emptyText', 'emptyReset', 'showreelTabs', 'showreelHint', 'showreelEmpty',
      'showreelVideo', 'showreelError', 'showreelMeta', 'showreelGame',
      'showreelVideoTitle', 'showreelCaption', 'showreelMetaCount', 'showreelCount',
      'showreelPanel', 'notesList', 'notesEmpty', 'footerName', 'projectDialog',
      'dialogClose', 'dialogScroll', 'dialogContent'
    ].forEach(function (id) {
      dom[id] = doc.getElementById(id);
    });

    dom.statNodes = $$('[data-stat]');
    dom.showreelSection = doc.getElementById('showreel');
    dom.showreelFrame = $('.showreel__frame');
  }

  /* ---------------------------------------------------------
     Motion preference and global motion
     --------------------------------------------------------- */

  function readStoredMotion() {
    try {
      var value = window.localStorage.getItem(MOTION_KEY);
      if (value === 'on') return true;
      if (value === 'off') return false;
      return null;
    } catch (error) {
      return null;
    }
  }

  function setMotion(enabled, options) {
    var opts = options || {};
    state.motion = Boolean(enabled);

    root.classList.toggle('motion-on', state.motion);
    root.classList.toggle('motion-off', !state.motion);

    if (dom.motionToggle) {
      dom.motionToggle.setAttribute('aria-pressed', String(state.motion));
      dom.motionToggle.setAttribute(
        'aria-label',
        state.motion ? '전체 모션 끄기' : '전체 모션 켜기'
      );
    }
    if (dom.motionState) dom.motionState.textContent = state.motion ? 'ON' : 'OFF';
    if (dom.motionToggle) {
      dom.motionToggle.title = state.motion ? '전체 모션 끄기' : '전체 모션 켜기';
    }

    if (opts.persist) {
      try {
        window.localStorage.setItem(MOTION_KEY, state.motion ? 'on' : 'off');
      } catch (error) {
        /* Storage can be unavailable for file:// or private contexts. */
      }
    }

    if (opts.announce && dom.motionAnnounce) {
      dom.motionAnnounce.textContent = state.motion ? '모션을 켰습니다.' : '모션을 껐습니다.';
    }

    if (!state.motion) {
      pauseAllVideos();
      resetCardTilts();
      if (dom.pointerGlow) dom.pointerGlow.classList.remove('is-active');
    }

    updateShowreelHint();
  }

  function setupMotion() {
    var stored = readStoredMotion();
    var initial = stored === null ? !(reduceQuery && reduceQuery.matches) : stored;
    setMotion(initial);

    if (dom.motionToggle) {
      dom.motionToggle.addEventListener('click', function () {
        setMotion(!state.motion, { persist: true, announce: true });
      });
    }

    if (reduceQuery) {
      var onPreferenceChange = function (event) {
        if (readStoredMotion() === null) {
          setMotion(!event.matches);
        }
      };
      if (typeof reduceQuery.addEventListener === 'function') {
        reduceQuery.addEventListener('change', onPreferenceChange);
      } else if (typeof reduceQuery.addListener === 'function') {
        reduceQuery.addListener(onPreferenceChange);
      }
    }
  }

  function setupGlobalChrome() {
    setupScrollChrome();
    setupPointerGlow();
    setupMotionScopes();
    setupRevealObserver();
    setupShowreelObserver();

    doc.addEventListener('visibilitychange', function () {
      var hidden = doc.hidden;
      root.classList.toggle('is-page-hidden', hidden);
      if (hidden) pauseAllVideos();
    });
  }

  function setupScrollChrome() {
    function update() {
      state.scrollPending = false;
      var max = root.scrollHeight - window.innerHeight;
      var top = window.scrollY || root.scrollTop || 0;
      var ratio = max > 0 ? Math.min(1, Math.max(0, top / max)) : 0;
      if (dom.scrollProgress) {
        dom.scrollProgress.style.transform = 'scaleX(' + ratio.toFixed(4) + ')';
      }
      if (dom.siteHeader) {
        dom.siteHeader.classList.toggle('is-scrolled', top > 8);
      }
    }

    function schedule() {
      if (state.scrollPending) return;
      state.scrollPending = true;
      window.requestAnimationFrame(update);
    }

    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    update();
  }

  function setupPointerGlow() {
    if (!dom.pointerGlow) return;

    window.addEventListener('pointermove', function (event) {
      if (!state.motion) return;
      if (!fineQuery || !fineQuery.matches) return;
      if (event.pointerType && event.pointerType !== 'mouse') return;

      state.glowX = event.clientX;
      state.glowY = event.clientY;

      if (state.glowFrame) return;
      state.glowFrame = window.requestAnimationFrame(function () {
        state.glowFrame = 0;
        if (!state.motion) return;
        dom.pointerGlow.style.setProperty('--pointer-x', state.glowX + 'px');
        dom.pointerGlow.style.setProperty('--pointer-y', state.glowY + 'px');
        dom.pointerGlow.classList.add('is-active');
      });
    }, { passive: true });

    root.addEventListener('pointerleave', function () {
      dom.pointerGlow.classList.remove('is-active');
    });

    window.addEventListener('blur', function () {
      dom.pointerGlow.classList.remove('is-active');
    });
  }

  function setupMotionScopes() {
    if (!('IntersectionObserver' in window)) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('is-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '100px 0px' });

    $$('[data-motion-scope]').forEach(function (node) {
      observer.observe(node);
    });
  }

  function setupRevealObserver() {
    if (!('IntersectionObserver' in window)) {
      $$('[data-reveal]').forEach(function (node) {
        node.classList.add('is-revealed');
      });
      return;
    }

    revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-revealed');
        observer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    observeReveals();
  }

  function observeReveals(scope) {
    var nodes = $$('[data-reveal]', scope || doc);
    if (!revealObserver) {
      nodes.forEach(function (node) {
        node.classList.add('is-revealed');
      });
      return;
    }

    nodes.forEach(function (node) {
      if (node.dataset.revealBound === '1') return;
      node.dataset.revealBound = '1';
      revealObserver.observe(node);
    });
  }

  /* ---------------------------------------------------------
     Hero
     --------------------------------------------------------- */

  function pickHeroImages(limit) {
    var ordered = [];
    var seenGame = Object.create(null);

    state.featured.forEach(function (game) {
      if (seenGame[game.id]) return;
      seenGame[game.id] = true;
      ordered.push(game);
    });
    state.games.forEach(function (game) {
      if (seenGame[game.id]) return;
      seenGame[game.id] = true;
      ordered.push(game);
    });

    var picks = [];
    var seenSrc = Object.create(null);

    for (var round = 0; round < 4 && picks.length < limit; round += 1) {
      for (var i = 0; i < ordered.length && picks.length < limit; i += 1) {
        var game = ordered[i];
        var image = game.images[round];
        if (!image || seenSrc[image.src]) continue;
        seenSrc[image.src] = true;
        picks.push({ game: game, image: image });
      }
    }

    return picks;
  }

  function buildStageCard(figure, game, image, index) {
    var float = figure.firstElementChild;
    if (!float) {
      float = el('div', 'stage-card__float');
      figure.appendChild(float);
    }

    var frame = el('div', 'stage-card__frame');

    if (image) {
      var img = makeImage(image.src, '', {
        lazy: false,
        priority: index === 0
      });
      img.addEventListener('error', function () {
        buildStageCard(figure, game, null, index);
      }, { once: true });
      frame.appendChild(img);
      frame.appendChild(el('span', 'stage-card__tag', 'FRAME / ' + pad(index + 1)));
    } else {
      frame.classList.add('stage-card__frame--type');
      frame.appendChild(el(
        'span',
        'stage-card__tag',
        game ? 'PROJECT / ' + pad(index + 1) : 'JS / ARCHIVE'
      ));

      var type = el('span', 'stage-card__type');
      if (game) {
        type.appendChild(el('span', '', game.title));
        type.appendChild(el('span', '', game.category || game.year || 'GAME'));
        if (game.category && game.year) type.appendChild(el('span', '', game.year));
      } else {
        ['PLAY.', 'BUILD.', 'REPEAT.'].forEach(function (word) {
          type.appendChild(el('span', '', word));
        });
      }
      frame.appendChild(type);
    }

    var label = el('span', 'stage-card__label');
    label.appendChild(el('span', '', game ? game.title : 'SELECTED WORK'));
    label.appendChild(el('span', '', game && game.year ? game.year : '2026'));
    frame.appendChild(label);

    var previous = float.querySelector('.stage-card__frame');
    if (previous) previous.replaceWith(frame);
    else float.appendChild(frame);
  }

  function renderHeroStage() {
    if (!dom.heroStage) return;
    dom.heroStage.replaceChildren();

    var picks = pickHeroImages(3);
    var classes = ['stage-card--a', 'stage-card--b', 'stage-card--c'];

    for (var i = 0; i < 3; i += 1) {
      var figure = el('figure', 'stage-card ' + classes[i]);
      var float = el('div', 'stage-card__float');
      float.style.setProperty('--float-delay', (i * -1.7).toFixed(1) + 's');
      figure.appendChild(float);
      dom.heroStage.appendChild(figure);

      var pick = picks[i];
      var fallbackGame = pick ? pick.game : (state.featured[i] || state.games[i] || null);
      buildStageCard(figure, fallbackGame, pick ? pick.image : null, i);
    }

    if (dom.heroFrameCount) {
      dom.heroFrameCount.textContent = 'SELECTED FRAMES / ' + pad(picks.length);
    }
  }

  function renderStats() {
    var values = {
      projects: 0,
      categories: 0,
      images: 0,
      videos: 0
    };

    if (state.hasData) {
      var categories = Object.create(null);
      state.games.forEach(function (game) {
        if (game.category) categories[game.category] = true;
        values.images += game.images.length;
        values.videos += game.videos.length;
      });
      values.projects = state.games.length;
      values.categories = Object.keys(categories).length;
    }

    dom.statNodes.forEach(function (node) {
      var key = node.getAttribute('data-stat');
      node.textContent = state.hasData ? String(values[key] || 0) : '—';
    });
  }

  /* ---------------------------------------------------------
     Cards
     --------------------------------------------------------- */

  function createMediaFallback(game, labelText) {
    var box = el('div', 'media-fallback');
    box.appendChild(el('span', 'media-fallback__label', labelText));
    box.appendChild(el('span', 'media-fallback__title', game.title));
    var meta = [game.category, game.year].filter(Boolean).join(' / ');
    if (meta) box.appendChild(el('span', 'media-fallback__meta', meta));
    return box;
  }

  function addCardMedia(media, game) {
    var image = game.images[0];
    if (!image) {
      media.appendChild(createMediaFallback(game, 'CAPTURE / 미확보'));
      return;
    }

    var img = makeImage(image.src, image.alt || game.title + ' 프로젝트 이미지', {
      lazy: true,
      className: 'project-card__img'
    });
    if (image.pos) img.style.objectPosition = image.pos;
    img.addEventListener('error', function () {
      img.remove();
      media.prepend(createMediaFallback(game, 'IMAGE / UNAVAILABLE'));
    }, { once: true });
    media.appendChild(img);
  }

  function createProjectCard(game, options) {
    var opts = options || {};
    var classes = 'project-card';
    if (opts.span) classes += ' project-card--span-' + opts.span;
    if (opts.compact) classes += ' project-card--compact';

    var article = el('article', classes);
    article.dataset.projectId = game.id;

    var surface = el('div', 'project-card__tilt');
    var media = el('div', 'project-card__media');
    addCardMedia(media, game);

    media.appendChild(el('span', 'project-card__index', pad((opts.index || 0) + 1)));
    if (game.featured) {
      media.appendChild(el('span', 'project-card__badge', 'FEATURED'));
    }

    var body = el('div', 'project-card__body');
    var meta = el('div', 'project-card__meta');
    if (game.engine) meta.appendChild(el('span', '', game.engine));
    if (game.category) meta.appendChild(el('span', '', game.category));
    if (game.team) meta.appendChild(el('span', '', '팀 프로젝트'));
    if (meta.childNodes.length) body.appendChild(meta);

    body.appendChild(el('h3', 'project-card__title', game.title));

    var summary = game.subtitle || game.description;
    if (summary) body.appendChild(el('p', 'project-card__subtitle', summary));

    if (game.period || game.year || game.status) {
      var foot = el('div', 'project-card__foot');
      var when = game.period ? game.period.split(' ')[0].slice(0, 7) : game.year;
      if (when) foot.appendChild(el('span', '', when));
      if (game.status) foot.appendChild(el('span', 'project-card__status', game.status));
      body.appendChild(foot);
    }

    var open = el('button', 'project-card__open');
    open.type = 'button';
    open.setAttribute('aria-label', game.title + ' 상세 정보 보기');
    open.addEventListener('click', function () {
      openProject(game, open);
    });

    surface.appendChild(media);
    surface.appendChild(body);
    surface.appendChild(open);
    article.appendChild(surface);

    setupCardTilt(article);
    return article;
  }

  function getFeaturedSpans(count) {
    if (count >= 6) return [7, 5, 5, 7, 7, 5];
    if (count === 5) return [7, 5, 5, 7, 12];
    if (count === 4) return [7, 5, 5, 7];
    if (count === 3) return [7, 5, 12];
    if (count === 2) return [7, 5];
    if (count === 1) return [12];
    return [];
  }

  function createStatePanel(code, title, text) {
    var panel = el('div', 'empty-state');
    panel.style.gridColumn = '1 / -1';
    panel.appendChild(el('p', 'empty-state__code', code));
    panel.appendChild(el('h3', '', title));
    panel.appendChild(el('p', '', text));
    return panel;
  }

  function renderFeatured() {
    if (!dom.featuredGrid) return;
    dom.featuredGrid.replaceChildren();

    if (!state.featured.length) {
      dom.featuredGrid.appendChild(createStatePanel(
        state.hasData ? 'ARCHIVE / EMPTY' : 'ARCHIVE / OFFLINE',
        state.hasData ? '등록된 대표 프로젝트가 없습니다.' : '아카이브를 표시할 수 없습니다.',
        state.hasData
          ? '새 프로젝트가 등록되면 이곳에 표시됩니다.'
          : '프로젝트 데이터를 불러오지 못했습니다.'
      ));
      dom.featuredGrid.setAttribute('aria-busy', 'false');
      return;
    }

    var spans = getFeaturedSpans(state.featured.length);
    state.featured.forEach(function (game, index) {
      var card = createProjectCard(game, {
        span: spans[index],
        index: index
      });
      card.setAttribute('data-reveal', '');
      card.style.setProperty('--reveal-delay', (index * 80) + 'ms');
      dom.featuredGrid.appendChild(card);
    });

    dom.featuredGrid.setAttribute('aria-busy', 'false');
    observeReveals(dom.featuredGrid);
  }

  function setupCardTilt(card) {
    if (!card || card.dataset.tiltBound === '1') return;
    card.dataset.tiltBound = '1';

    var surface = $('.project-card__tilt', card);
    if (!surface) return;

    function reset() {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
    }

    card.addEventListener('pointermove', function (event) {
      if (!state.motion) return;
      if (!fineQuery || !fineQuery.matches) return;
      if (event.pointerType && event.pointerType !== 'mouse') return;

      var rect = card.getBoundingClientRect();
      if (!rect.width || !rect.height) return;

      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      surface.style.setProperty('--tilt-x', (-y * 3.2).toFixed(2) + 'deg');
      surface.style.setProperty('--tilt-y', (x * 4.0).toFixed(2) + 'deg');
    });

    card.addEventListener('pointerleave', reset);
    card.addEventListener('focusout', reset);
  }

  function resetCardTilts() {
    $$('.project-card__tilt').forEach(function (surface) {
      surface.style.setProperty('--tilt-x', '0deg');
      surface.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* ---------------------------------------------------------
     Archive filters
     --------------------------------------------------------- */

  function bindArchiveControls() {
    if (dom.projectSearch) {
      dom.projectSearch.addEventListener('input', function (event) {
        state.query = event.target.value;
        renderArchive();
      });
    }

    if (dom.categoryFilters) {
      dom.categoryFilters.addEventListener('click', function (event) {
        var chip = event.target.closest('button[data-category]');
        if (!chip) return;
        var category = chip.getAttribute('data-category');
        if (category === state.activeCategory) return;
        state.activeCategory = category;
        syncFilterChips();
        renderArchive();
      });
    }

    if (dom.resetFilters) {
      dom.resetFilters.addEventListener('click', function () {
        resetArchiveFilters();
        if (dom.projectSearch && !dom.projectSearch.disabled) {
          dom.projectSearch.focus({ preventScroll: true });
        }
      });
    }

    if (dom.emptyReset) {
      dom.emptyReset.addEventListener('click', function () {
        resetArchiveFilters();
        if (dom.projectSearch && !dom.projectSearch.disabled) {
          dom.projectSearch.focus({ preventScroll: true });
        }
      });
    }

    if (dom.dataRetry) {
      dom.dataRetry.addEventListener('click', function () {
        window.location.reload();
      });
    }
  }

  function addFilterChip(value, label, count) {
    var chip = el('button', 'filter__chip');
    chip.type = 'button';
    chip.dataset.category = value;
    chip.setAttribute('aria-pressed', value === state.activeCategory ? 'true' : 'false');
    chip.classList.toggle('is-active', value === state.activeCategory);
    chip.appendChild(doc.createTextNode(label));
    chip.appendChild(el('span', 'filter__count', String(count)));
    dom.categoryFilters.appendChild(chip);
  }

  function buildCategoryFilters() {
    if (!dom.categoryFilters) return;
    dom.categoryFilters.replaceChildren();

    var counts = Object.create(null);
    state.games.forEach(function (game) {
      if (!game.category) return;
      counts[game.category] = (counts[game.category] || 0) + 1;
    });

    addFilterChip('all', '전체', state.games.length);

    var categories = CATEGORY_ORDER.filter(function (category) {
      return counts[category] > 0;
    });
    Object.keys(counts).forEach(function (category) {
      if (categories.indexOf(category) === -1) categories.push(category);
    });
    categories.forEach(function (category) {
      addFilterChip(category, category, counts[category]);
    });

    dom.categoryFilters.setAttribute('aria-busy', 'false');
    syncFilterChips();
  }

  function syncFilterChips() {
    if (!dom.categoryFilters) return;
    $$('.filter__chip', dom.categoryFilters).forEach(function (chip) {
      var active = chip.getAttribute('data-category') === state.activeCategory;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', active ? 'true' : 'false');
    });
  }

  function matchesGame(game) {
    if (state.activeCategory !== 'all' && game.category !== state.activeCategory) {
      return false;
    }

    var query = clean(state.query).toLowerCase();
    if (!query) return true;

    var haystack = [
      game.title,
      game.subtitle,
      game.engine,
      game.category,
      game.status,
      game.year,
      game.period,
      game.team,
      game.role,
      game.description
    ].concat(game.features, game.tools, game.history).join(' ').toLowerCase();

    return haystack.indexOf(query) !== -1;
  }

  function isFiltering() {
    return state.activeCategory !== 'all' || clean(state.query) !== '';
  }

  function renderArchive() {
    if (!dom.projectGrid) return;

    var filtered = state.games.filter(matchesGame);
    var fragment = doc.createDocumentFragment();

    filtered.forEach(function (game, index) {
      fragment.appendChild(createProjectCard(game, {
        compact: true,
        index: index
      }));
    });

    dom.projectGrid.replaceChildren(fragment);
    dom.projectGrid.setAttribute('aria-busy', 'false');

    if (dom.projectSearch) {
      dom.projectSearch.disabled = state.games.length === 0;
    }

    var filtering = isFiltering();
    if (dom.resetFilters) dom.resetFilters.hidden = !filtering;

    if (dom.archiveMeta) {
      if (!state.games.length) {
        dom.archiveMeta.textContent = '등록된 프로젝트 없음';
      } else if (filtering) {
        dom.archiveMeta.textContent = '전체 ' + state.games.length + '개 중 ' + filtered.length + '개 표시';
      } else {
        dom.archiveMeta.textContent = '전체 ' + state.games.length + '개 프로젝트';
      }
    }

    if (!dom.archiveEmpty) return;

    if (filtered.length === 0) {
      var code = $('.empty-state__code', dom.archiveEmpty);
      dom.archiveEmpty.hidden = false;

      if (!state.games.length) {
        if (code) code.textContent = 'ARCHIVE / EMPTY';
        if (dom.emptyTitle) dom.emptyTitle.textContent = '등록된 프로젝트가 없습니다.';
        if (dom.emptyText) dom.emptyText.textContent = '새 프로젝트가 등록되면 이 아카이브에 표시됩니다.';
        if (dom.emptyReset) dom.emptyReset.hidden = true;
      } else {
        if (code) code.textContent = 'NO RESULTS / 00';
        if (dom.emptyTitle) dom.emptyTitle.textContent = '조건에 맞는 프로젝트가 없습니다.';
        if (dom.emptyText) dom.emptyText.textContent = '검색어를 줄이거나 다른 카테고리를 선택해 보세요.';
        if (dom.emptyReset) dom.emptyReset.hidden = false;
      }
    } else {
      dom.archiveEmpty.hidden = true;
      if (dom.emptyReset) dom.emptyReset.hidden = false;
    }
  }

  function resetArchiveFilters() {
    state.query = '';
    state.activeCategory = 'all';
    if (dom.projectSearch) dom.projectSearch.value = '';
    syncFilterChips();
    renderArchive();
  }

  /* ---------------------------------------------------------
     Showreel
     --------------------------------------------------------- */

  function setupShowreelObserver() {
    if (!dom.showreelSection) return;

    if (!('IntersectionObserver' in window)) {
      state.showreelInView = true;
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        state.showreelInView = entry.isIntersecting && entry.intersectionRatio >= 0.35;
        if (!state.showreelInView) {
          pauseShowreel();
          return;
        }
        if (state.motion && state.videos.length && !state.showreelAutoplayed) {
          state.showreelAutoplayed = true;
          playShowreel();
        }
      });
    }, { threshold: [0, 0.35] });

    observer.observe(dom.showreelVideo);
  }

  function updateShowreelHint() {
    if (!dom.showreelHint || !state.hasData) return;
    if (!state.videos.length) {
      dom.showreelHint.hidden = true;
      return;
    }

    dom.showreelHint.hidden = false;
    dom.showreelHint.textContent = state.motion
      ? '영상을 선택하면 음소거로 재생됩니다. 컨트롤에서 소리를 켤 수 있습니다.'
      : '모션 꺼짐 · 재생 버튼으로 직접 시청할 수 있습니다.';
  }

  function setShowreelEmpty(code, title, text) {
    if (!dom.showreelEmpty) return;
    dom.showreelEmpty.replaceChildren(
      el('p', 'showreel__empty-code', code),
      el('h3', '', title),
      el('p', '', text)
    );
    dom.showreelEmpty.hidden = false;
  }

  function renderShowreel() {
    if (!dom.showreelTabs || !dom.showreelVideo) return;

    state.videos = [];
    state.currentVideoIndex = -1;
    state.showreelAutoplayed = false;
    dom.showreelTabs.replaceChildren();
    dom.showreelTabs.setAttribute('aria-busy', 'false');
    dom.showreelError.hidden = true;

    state.games.forEach(function (game) {
      game.videos.forEach(function (video) {
        state.videos.push({ game: game, video: video });
      });
    });

    if (!state.videos.length) {
      if (dom.showreelFrame) dom.showreelFrame.classList.add('is-empty');
      dom.showreelTabs.hidden = true;
      dom.showreelVideo.pause();
      dom.showreelVideo.hidden = true;
      dom.showreelVideo.removeAttribute('src');
      dom.showreelVideo.removeAttribute('poster');
      dom.showreelVideo.load();
      dom.showreelMeta.hidden = true;
      if (dom.showreelCount) dom.showreelCount.textContent = '[ 00 ]';
      if (dom.showreelHint) dom.showreelHint.hidden = true;
      setShowreelEmpty(
        'SHOWREEL / 00',
        state.hasData ? '등록된 쇼릴 영상이 아직 없습니다.' : '쇼릴을 표시할 수 없습니다.',
        state.hasData
          ? '이미지와 프로젝트 기록은 위 아카이브에서 확인할 수 있습니다. 실제 영상이 등록되면 이곳에서 재생됩니다.'
          : '프로젝트 데이터를 불러오지 못해 영상 목록을 만들 수 없습니다.'
      );
      return;
    }

    if (dom.showreelFrame) dom.showreelFrame.classList.remove('is-empty');
    dom.showreelTabs.hidden = false;
    dom.showreelEmpty.hidden = true;
    dom.showreelVideo.hidden = false;
    dom.showreelMeta.hidden = false;
    if (dom.showreelHint) dom.showreelHint.hidden = false;
    if (dom.showreelCount) dom.showreelCount.textContent = '[ ' + pad(state.videos.length) + ' ]';

    var fragment = doc.createDocumentFragment();
    state.videos.forEach(function (entry, index) {
      var tab = el('button', 'showreel__tab');
      tab.type = 'button';
      tab.id = 'showreel-tab-' + index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false');
      tab.setAttribute('aria-controls', 'showreelPanel');
      tab.tabIndex = index === 0 ? 0 : -1;

      tab.appendChild(el('span', 'showreel__tab-index', pad(index + 1)));
      tab.appendChild(el('span', 'showreel__tab-title', entry.video.title || entry.game.title));
      tab.appendChild(el('span', 'showreel__tab-game', entry.game.title));

      tab.addEventListener('click', function () {
        selectShowreelVideo(index, {
          autoplay: state.motion && state.showreelInView
        });
      });
      tab.addEventListener('keydown', onShowreelTabKeydown);

      fragment.appendChild(tab);
    });

    dom.showreelTabs.appendChild(fragment);
    selectShowreelVideo(0, { autoplay: false });
    updateShowreelHint();

    window.requestAnimationFrame(function () {
      if (!state.videos.length || !state.motion || state.dialogOpen) return;
      var rect = dom.showreelSection.getBoundingClientRect();
      var visible = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      state.showreelInView = visible || state.showreelInView;
      if (visible && !state.showreelAutoplayed) {
        state.showreelAutoplayed = true;
        playShowreel();
      }
    });
  }

  function selectShowreelVideo(index, options) {
    var entry = state.videos[index];
    if (!entry || index === state.currentVideoIndex) return;
    var opts = options || {};
    var video = dom.showreelVideo;

    pauseShowreel();
    state.currentVideoIndex = index;

    if (entry.video.poster) video.poster = entry.video.poster;
    else video.removeAttribute('poster');

    video.muted = Boolean(opts.autoplay);
    video.src = entry.video.src;
    video.load();
    video.hidden = false;
    dom.showreelError.hidden = true;
    dom.showreelEmpty.hidden = true;
    dom.showreelMeta.hidden = false;

    if (dom.showreelGame) {
      dom.showreelGame.textContent = entry.game.title +
        (entry.game.category ? ' / ' + entry.game.category : '');
    }
    if (dom.showreelVideoTitle) {
      dom.showreelVideoTitle.textContent = entry.video.title || entry.game.title;
    }
    if (dom.showreelCaption) {
      dom.showreelCaption.textContent = entry.video.caption || '';
    }
    if (dom.showreelMetaCount) {
      dom.showreelMetaCount.textContent = pad(index + 1) + ' / ' + pad(state.videos.length);
    }
    dom.showreelPanel.setAttribute('aria-labelledby', 'showreel-tab-' + index);

    syncShowreelTabs(index);
    updateShowreelHint();

    if (opts.autoplay && state.motion && state.showreelInView && !doc.hidden) {
      state.showreelAutoplayed = true;
      playShowreel();
    }
  }

  function syncShowreelTabs(activeIndex) {
    if (!dom.showreelTabs) return;
    $$('.showreel__tab', dom.showreelTabs).forEach(function (tab, index) {
      var active = index === activeIndex;
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
  }

  function onShowreelTabKeydown(event) {
    var keys = ['ArrowDown', 'ArrowRight', 'ArrowUp', 'ArrowLeft', 'Home', 'End'];
    if (keys.indexOf(event.key) === -1) return;

    var tabs = $$('.showreel__tab', dom.showreelTabs);
    if (!tabs.length) return;

    var current = tabs.indexOf(event.currentTarget);
    var next = current;

    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      next = (current + 1) % tabs.length;
    } else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      next = (current - 1 + tabs.length) % tabs.length;
    } else if (event.key === 'Home') {
      next = 0;
    } else if (event.key === 'End') {
      next = tabs.length - 1;
    }

    event.preventDefault();
    tabs[next].focus();
    selectShowreelVideo(next, {
      autoplay: state.motion && state.showreelInView
    });
  }

  function playShowreel() {
    if (!state.motion || state.dialogOpen || doc.hidden) return;
    var video = dom.showreelVideo;
    if (!video || !video.getAttribute('src')) return;

    video.muted = true;
    var playing = video.play();
    if (playing && typeof playing.catch === 'function') {
      playing.catch(function () {
        /* Autoplay can be declined; the native controls remain available. */
      });
    }
  }

  function pauseShowreel() {
    if (dom.showreelVideo && !dom.showreelVideo.paused) {
      dom.showreelVideo.pause();
    }
  }

  function pauseAllVideos() {
    $$('video').forEach(function (video) {
      if (!video.paused) {
        try {
          video.pause();
        } catch (error) {
          /* Ignore media elements that are not ready. */
        }
      }
    });
  }

  function bindShowreelMediaEvents() {
    if (!dom.showreelVideo) return;

    dom.showreelVideo.addEventListener('error', function () {
      if (!dom.showreelVideo.hidden && dom.showreelVideo.getAttribute('src')) {
        dom.showreelError.hidden = false;
      }
    });

    dom.showreelVideo.addEventListener('loadeddata', function () {
      dom.showreelError.hidden = true;
    });
  }

  /* ---------------------------------------------------------
     Notes
     --------------------------------------------------------- */

  function noteFlagsFromText(text) {
    var flags = [];
    if (/샘플|튜토리얼|sample/i.test(text)) flags.push('sample');
    if (/실험|테크 데모|기술 데모|experiment/i.test(text)) flags.push('experiment');
    return flags;
  }

  function normalizeNote(raw) {
    if (typeof raw === 'string') {
      return { title: '', text: clean(raw), kind: '' };
    }
    if (!raw || typeof raw !== 'object') {
      return { title: '', text: '', kind: '' };
    }

    var kindText = [raw.kind, raw.type, raw.tag, raw.label]
      .filter(function (value) { return typeof value === 'string'; })
      .join(' ');
    var kind = '';
    if (/experiment|실험/i.test(kindText)) kind = 'experiment';
    if (/sample|샘플/i.test(kindText)) kind = kind ? 'both' : 'sample';
    if (/both|샘플.*실험|실험.*샘플/i.test(kindText)) kind = 'both';

    return {
      title: clean(raw.title || raw.name || ''),
      text: clean(raw.body || raw.text || raw.description || raw.content || raw.note || ''),
      kind: kind
    };
  }

  function noteBadge(kind) {
    var label = kind === 'sample' ? '샘플' : '실험';
    return el('span', 'note-badge note-badge--' + kind, label);
  }

  function renderNotes() {
    if (!dom.notesList) return;

    dom.notesList.replaceChildren();
    dom.notesList.setAttribute('aria-busy', 'false');

    if (!state.notes.length) {
      if (dom.notesEmpty) {
        dom.notesEmpty.hidden = false;
        dom.notesEmpty.textContent = state.hasData
          ? '등록된 제작 노트가 아직 없습니다.'
          : '제작 노트를 불러오지 못했습니다.';
      }
      return;
    }

    if (dom.notesEmpty) dom.notesEmpty.hidden = true;

    state.notes.forEach(function (raw, index) {
      var note = normalizeNote(raw);
      var flags = [];
      if (note.kind === 'sample' || note.kind === 'both') flags.push('sample');
      if (note.kind === 'experiment' || note.kind === 'both') flags.push('experiment');
      noteFlagsFromText(note.text).forEach(function (flag) {
        if (flags.indexOf(flag) === -1) flags.push(flag);
      });

      var item = el('li', 'note');
      item.appendChild(el('span', 'note__index', pad(index + 1)));

      var body = el('div', 'note__body');
      var paragraph = el('p', 'note__text');
      if (note.title) {
        paragraph.appendChild(el('strong', '', note.title));
        if (note.text) paragraph.appendChild(doc.createTextNode(' ' + note.text));
      } else {
        paragraph.textContent = note.text;
      }
      body.appendChild(paragraph);

      if (flags.length) {
        var tags = el('div', 'note__tags');
        flags.forEach(function (flag) {
          tags.appendChild(noteBadge(flag));
        });
        body.appendChild(tags);
      }

      item.appendChild(body);
      dom.notesList.appendChild(item);
    });
  }

  /* ---------------------------------------------------------
     Dialog
     --------------------------------------------------------- */

  function bindDialog() {
    if (!dom.projectDialog) return;

    if (dom.dialogClose) {
      dom.dialogClose.addEventListener('click', closeProjectDialog);
    }

    dom.projectDialog.addEventListener('click', function (event) {
      if (event.target === dom.projectDialog) closeProjectDialog();
    });

    dom.projectDialog.addEventListener('close', handleDialogClosed);
  }

  function openProject(game, trigger) {
    if (!state.hasData || !dom.projectDialog) return;

    state.lastDialogTrigger = trigger || doc.activeElement;
    renderDialog(game);

    dom.projectDialog.setAttribute('aria-label', game.title + ' 상세 정보');
    state.dialogOpen = true;
    root.classList.add('dialog-open');
    pauseShowreel();

    if (typeof dom.projectDialog.showModal === 'function') {
      if (dom.projectDialog.open) dom.projectDialog.close();
      dom.projectDialog.showModal();
    } else {
      dom.projectDialog.setAttribute('open', '');
    }

    dom.dialogScroll.scrollTop = 0;
    if (dom.dialogClose) dom.dialogClose.focus({ preventScroll: true });
  }

  function closeProjectDialog() {
    if (!dom.projectDialog) return;
    if (dom.projectDialog.open) {
      dom.projectDialog.close();
    } else {
      dom.projectDialog.removeAttribute('open');
      handleDialogClosed();
    }
  }

  function handleDialogClosed() {
    state.dialogOpen = false;
    root.classList.remove('dialog-open');

    if (dom.dialogContent) {
      $$('video', dom.dialogContent).forEach(function (video) {
        video.pause();
      });
    }

    var trigger = state.lastDialogTrigger;
    state.lastDialogTrigger = null;

    if (trigger && trigger.isConnected) {
      trigger.focus({ preventScroll: true });
      return;
    }

    var fallback = doc.getElementById('projectsTitle');
    if (fallback) {
      fallback.tabIndex = -1;
      fallback.focus({ preventScroll: true });
    }
  }

  function addDialogPill(container, text, lime) {
    if (!text) return;
    container.appendChild(el('span', 'dialog__pill' + (lime ? ' dialog__pill--lime' : ''), text));
  }

  function createDialogFacts(game) {
    var facts = el('dl', 'dialog__facts');
    var rows = [
      ['엔진', game.engine],
      ['카테고리', game.category],
      ['상태', game.status],
      ['기간', game.period || game.year],
      ['팀', game.team],
      ['담당', game.role],
      ['제작 도구', game.tools.join(' · ')]
    ];

    rows.forEach(function (row) {
      if (!row[1]) return;
      var wrap = el('div', 'dialog__fact');
      wrap.appendChild(el('dt', '', row[0]));
      wrap.appendChild(el('dd', '', row[1]));
      facts.appendChild(wrap);
    });

    return facts;
  }

  function renderDialog(game) {
    if (!dom.dialogContent) return;
    dom.dialogContent.replaceChildren();

    var top = el('div', 'dialog__top');
    if (game.featured) addDialogPill(top, 'FEATURED', true);
    addDialogPill(top, game.category);
    addDialogPill(top, game.engine);
    addDialogPill(top, game.status);
    addDialogPill(top, game.team);
    addDialogPill(top, game.period || game.year);
    if (top.childNodes.length) dom.dialogContent.appendChild(top);

    dom.dialogContent.appendChild(el('h2', 'dialog__title', game.title));

    if (game.subtitle) {
      dom.dialogContent.appendChild(el('p', 'dialog__subtitle', game.subtitle));
    }
    if (game.description) {
      dom.dialogContent.appendChild(el('p', 'dialog__description', game.description));
    }

    var facts = createDialogFacts(game);
    var sections = [];

    if (game.features.length) {
      var featureSection = el('section', 'dialog__section');
      featureSection.appendChild(el('h3', '', 'FEATURES / 주요 특징'));
      var list = el('ul', 'features');
      game.features.forEach(function (feature) {
        list.appendChild(el('li', '', feature));
      });
      featureSection.appendChild(list);
      sections.push(featureSection);
    }

    if (facts.childNodes.length) {
      var factSection = el('section', 'dialog__section');
      factSection.appendChild(el('h3', '', 'DETAILS / 제작 정보'));
      factSection.appendChild(facts);
      sections.push(factSection);
    }

    if (sections.length) {
      var grid = el('div', 'dialog__grid' + (sections.length === 1 ? ' dialog__grid--single' : ''));
      sections.forEach(function (section) {
        grid.appendChild(section);
      });
      dom.dialogContent.appendChild(grid);
    }

    if (game.history.length) {
      var historyBlock = el('section', 'dialog__section dialog__history');
      historyBlock.appendChild(el('h3', '', 'DEVLOG / 개발 이력'));
      var timeline = el('ol', 'devlog');
      game.history.forEach(function (entry) {
        timeline.appendChild(el('li', '', entry));
      });
      historyBlock.appendChild(timeline);
      dom.dialogContent.appendChild(historyBlock);
    }

    if (game.images.length) {
      var imageBlock = el('section', 'dialog__media-block');
      imageBlock.appendChild(el('h3', '', 'IMAGES / 이미지 갤러리'));
      var gallery = el('div', 'gallery');

      game.images.forEach(function (image, index) {
        var figure = el('figure');
        var img = makeImage(image.src, image.alt || game.title + ' 이미지 ' + (index + 1), {
          lazy: true,
          className: 'gallery__image'
        });
        img.addEventListener('error', function () {
          img.remove();
          figure.prepend(createMediaFallback(game, 'IMAGE / UNAVAILABLE'));
        }, { once: true });
        figure.appendChild(img);

        if (image.caption || image.alt) {
          figure.appendChild(el('figcaption', '', image.caption || image.alt));
        }
        gallery.appendChild(figure);
      });

      imageBlock.appendChild(gallery);
      dom.dialogContent.appendChild(imageBlock);
    }

    if (game.videos.length) {
      var videoBlock = el('section', 'dialog__media-block');
      videoBlock.appendChild(el('h3', '', 'VIDEOS / 영상'));
      var videoList = el('div', 'dialog-videos');

      game.videos.forEach(function (item) {
        var figure = el('figure', 'dialog-video');
        var video = doc.createElement('video');
        video.controls = true;
        video.playsInline = true;
        video.preload = 'metadata';
        video.src = item.src;
        if (item.poster) video.poster = item.poster;
        video.setAttribute('aria-label', item.title || game.title + ' 영상');
        figure.appendChild(video);

        var caption = el('figcaption');
        if (item.title) caption.appendChild(el('strong', '', item.title));
        if (item.caption) caption.appendChild(doc.createTextNode(item.caption));
        if (caption.childNodes.length) figure.appendChild(caption);

        var error = el('p', 'video-error', '이 영상을 재생할 수 없습니다.');
        error.hidden = true;
        video.addEventListener('error', function () {
          error.hidden = false;
        });
        figure.appendChild(error);

        videoList.appendChild(figure);
      });

      videoBlock.appendChild(videoList);
      dom.dialogContent.appendChild(videoBlock);
    }

    if (!game.images.length && !game.videos.length) {
      dom.dialogContent.appendChild(el(
        'p',
        'dialog__empty-note',
        '이 프로젝트에는 등록된 이미지나 영상이 없습니다.'
      ));
    }
  }

  /* ---------------------------------------------------------
     Identity / boot
     --------------------------------------------------------- */

  function applyIdentity() {
    if (!state.data || !state.data.name) return;
    if (dom.footerName) dom.footerName.textContent = state.data.name;
    doc.title = state.data.name + ' — JS / GAME ARCHIVE';
  }

  function chooseFeatured() {
    var list = state.games.filter(function (game) {
      return game.featured;
    }).slice(0, 6);

    if (!list.length) list = state.games.slice(0, 6);
    return list;
  }

  function renderDataError() {
    state.hasData = false;
    state.games = [];
    state.featured = [];
    state.videos = [];
    state.notes = [];

    if (dom.dataNotice) dom.dataNotice.hidden = false;
    if (dom.dataNoticeText) {
      dom.dataNoticeText.textContent = '프로젝트 데이터를 불러오지 못했습니다. games.js가 index.html과 같은 폴더에 있는지 확인한 뒤 새로고침해 주세요.';
    }

    renderStats();
    renderHeroStage();

    if (dom.featuredGrid) {
      dom.featuredGrid.replaceChildren(createStatePanel(
        'ARCHIVE / OFFLINE',
        '아카이브를 표시할 수 없습니다.',
        '프로젝트 데이터를 읽지 못했습니다. 페이지를 새로고침해 주세요.'
      ));
      dom.featuredGrid.setAttribute('aria-busy', 'false');
    }

    if (dom.categoryFilters) {
      dom.categoryFilters.replaceChildren();
      dom.categoryFilters.setAttribute('aria-busy', 'false');
    }
    if (dom.projectGrid) {
      dom.projectGrid.replaceChildren();
      dom.projectGrid.setAttribute('aria-busy', 'false');
    }
    if (dom.projectSearch) dom.projectSearch.disabled = true;
    if (dom.resetFilters) dom.resetFilters.hidden = true;
    if (dom.archiveMeta) dom.archiveMeta.textContent = '데이터 없음';

    if (dom.archiveEmpty) {
      dom.archiveEmpty.hidden = false;
      var code = $('.empty-state__code', dom.archiveEmpty);
      if (code) code.textContent = 'ARCHIVE / OFFLINE';
      if (dom.emptyTitle) dom.emptyTitle.textContent = '아카이브를 표시할 수 없습니다.';
      if (dom.emptyText) dom.emptyText.textContent = '데이터 파일을 불러오지 못했습니다. 페이지를 새로고침해 주세요.';
      if (dom.emptyReset) dom.emptyReset.hidden = true;
    }

    if (dom.showreelTabs) {
      dom.showreelTabs.replaceChildren();
      dom.showreelTabs.hidden = true;
      dom.showreelTabs.setAttribute('aria-busy', 'false');
    }
    if (dom.showreelFrame) dom.showreelFrame.classList.add('is-empty');
    if (dom.showreelCount) dom.showreelCount.textContent = '[ 00 ]';
    if (dom.showreelHint) dom.showreelHint.hidden = true;
    if (dom.showreelVideo) {
      dom.showreelVideo.pause();
      dom.showreelVideo.hidden = true;
      dom.showreelVideo.removeAttribute('src');
      dom.showreelVideo.load();
    }
    if (dom.showreelMeta) dom.showreelMeta.hidden = true;
    if (dom.showreelError) dom.showreelError.hidden = true;
    setShowreelEmpty(
      'SHOWREEL / OFFLINE',
      '쇼릴을 표시할 수 없습니다.',
      '프로젝트 데이터를 불러오지 못해 영상 목록을 만들 수 없습니다.'
    );

    if (dom.notesList) {
      dom.notesList.replaceChildren();
      dom.notesList.setAttribute('aria-busy', 'false');
    }
    if (dom.notesEmpty) {
      dom.notesEmpty.hidden = false;
      dom.notesEmpty.textContent = '제작 노트를 불러오지 못했습니다.';
    }

    observeReveals();
  }

  function init() {
    cacheDom();
    setupMotion();
    setupGlobalChrome();
    bindArchiveControls();
    bindDialog();
    bindShowreelMediaEvents();

    var portfolio = readPortfolio();
    if (!portfolio) {
      renderDataError();
      return;
    }

    state.data = portfolio;
    state.games = portfolio.games;
    state.notes = portfolio.notes;
    state.hasData = true;
    state.featured = chooseFeatured();

    applyIdentity();
    renderStats();
    renderHeroStage();
    renderFeatured();
    buildCategoryFilters();
    renderArchive();
    renderShowreel();
    renderNotes();

    if (dom.dataNotice) dom.dataNotice.hidden = true;
    observeReveals();
  }

  function boot() {
    try {
      init();
    } catch (error) {
      if (window.console && typeof window.console.error === 'function') {
        window.console.error(error);
      }
      renderDataError();
    }
  }

  if (doc.readyState === 'loading') {
    doc.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
