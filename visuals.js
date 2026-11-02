(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CHIP_ACCENT = {
    'chip-daily': 'teal',
    'chip-weekly': 'copper',
    'chip-frameworks': 'iris',
    'chip-langchain': 'chain',
    'chip-google-research': 'research',
    'chip-computer-vision': 'vision'
  };
  var TONES = ['copper', 'teal', 'iris', 'research', 'vision', 'chain'];

  function themeName() {
    var explicit = document.documentElement.dataset.theme;
    if (explicit === 'light' || explicit === 'dark') return explicit;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function setAccent() {
    var chip = document.querySelector('.digest-main .meta-row .chip, .meta-row .chip');
    if (!chip) return;
    var accent = '';
    chip.classList.forEach(function (cls) {
      if (CHIP_ACCENT[cls]) accent = CHIP_ACCENT[cls];
    });
    if (accent) document.documentElement.dataset.accent = accent;
  }

  var revealIO = null;
  function ensureRevealIO() {
    if (revealIO || reduce || !('IntersectionObserver' in window)) return;
    revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealIO.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  }

  function armReveal(root) {
    ensureRevealIO();
    var scope = root && root.querySelectorAll ? root : document;
    var nodes = scope.querySelectorAll('.story, .issue, .featured, .panel, .block, .lede-card, .ae-card, .figure-card, .use-grid, .flip-grid, .viz-stat, .cat-card, .h-timeline, .mindmap, .viz-tabs, .ae-home-card');
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.classList.contains('reveal')) return;
      el.classList.add('reveal');
      if (reduce || !revealIO) el.classList.add('is-in');
      else revealIO.observe(el);
    });
  }

  function animateCount(el) {
    var raw = el.getAttribute('data-count');
    if (raw == null || raw === '') return;
    var target = parseFloat(raw);
    if (!isFinite(target)) return;
    var num = el.querySelector('.stat-num') || el;
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var prefix = el.getAttribute('data-prefix') || '';
    function paint(v) { num.textContent = prefix + v.toFixed(decimals) + suffix; }
    if (reduce) { paint(target); return; }
    var start = performance.now();
    function frame(now) {
      var t = Math.min(1, (now - start) / 900);
      var eased = 1 - Math.pow(1 - t, 3);
      paint(target * eased);
      if (t < 1) requestAnimationFrame(frame);
      else paint(target);
    }
    requestAnimationFrame(frame);
  }

  function armCounters(root) {
    var nodes = (root || document).querySelectorAll('[data-count]');
    if (!nodes.length) return;
    if (reduce || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(nodes, animateCount);
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        animateCount(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.4 });
    Array.prototype.forEach.call(nodes, function (el) {
      if (el.dataset.countArmed) return;
      el.dataset.countArmed = '1';
      io.observe(el);
    });
  }

  function collapseStories() {
    if (!/\/digests\//.test(location.pathname)) return;
    Array.prototype.forEach.call(document.querySelectorAll('.digest-main .story'), function (story) {
      var body = story.querySelector(':scope > div:last-child');
      if (!body || body.querySelector('.fold-toggle')) return;
      var kids = Array.prototype.slice.call(body.children);
      var first = -1;
      for (var i = 0; i < kids.length; i++) {
        if (kids[i].tagName === 'P' && !kids[i].classList.contains('kicker')) { first = i; break; }
      }
      if (first < 0 || first >= kids.length - 1) return;
      var rest = kids.slice(first + 1);
      var extra = rest.reduce(function (n, el) { return n + (el.textContent || '').length; }, 0);
      if (extra < 160) return;
      var wrap = document.createElement('div');
      wrap.className = 'fold-panel';
      wrap.hidden = true;
      rest.forEach(function (el) { wrap.appendChild(el); });
      var hasCallout = !!wrap.querySelector('.callout');
      var closed = hasCallout ? 'Show why it matters' : 'Show the rest';
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'fold-toggle';
      btn.setAttribute('aria-expanded', 'false');
      btn.textContent = closed;
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        wrap.hidden = open;
        btn.textContent = open ? closed : 'Hide the detail';
      });
      body.appendChild(btn);
      body.appendChild(wrap);
    });
    openHashedStory();
  }

  function openHashedStory() {
    var id = (location.hash || '').slice(1);
    if (!id) return;
    var el = document.getElementById(id);
    if (!el) return;
    var story = el.classList && el.classList.contains('story') ? el : (el.closest ? el.closest('.story') : null);
    if (!story) return;
    var btn = story.querySelector('.fold-toggle');
    if (btn && btn.getAttribute('aria-expanded') === 'false') btn.click();
  }

  function cellText(cell) { return cell ? cell.innerHTML : ''; }

  function enhanceTables() {
    Array.prototype.forEach.call(document.querySelectorAll('[data-viz="flips"], [data-viz="cards"]'), function (wrap) {
      var table = wrap.querySelector('table');
      if (!table || wrap.dataset.vizReady) return;
      var headers = Array.prototype.map.call(table.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
      var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));
      if (!rows.length) return;
      var mode = wrap.getAttribute('data-viz');
      var ui = document.createElement('div');
      ui.className = mode === 'flips' ? 'flip-grid' : 'use-grid';
      rows.forEach(function (row, index) {
        var cells = Array.prototype.slice.call(row.children);
        var tone = TONES[index % TONES.length];
        if (mode === 'flips') {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'flip-card';
          btn.setAttribute('data-tone', tone);
          btn.setAttribute('aria-pressed', 'false');
          var frontBits = '';
          var backBits = '';
          cells.forEach(function (cell, i) {
            var label = headers[i] || '';
            var bit = '<span class="flip-label">' + label + '</span>' + (i === 0 ? '<strong>' + cellText(cell) + '</strong>' : '<span>' + cellText(cell) + '</span>');
            if (i < 2) frontBits += bit;
            else backBits += bit;
          });
          btn.innerHTML = '<span class="flip-inner"><span class="flip-face flip-front">' + frontBits + '<span class="flip-hint">Flip the card</span></span><span class="flip-face flip-back">' + backBits + '</span></span>';
          btn.addEventListener('click', function () {
            var on = btn.classList.toggle('is-flipped');
            btn.setAttribute('aria-pressed', on ? 'true' : 'false');
          });
          ui.appendChild(btn);
        } else {
          var card = document.createElement('article');
          card.className = 'use-card';
          card.setAttribute('data-tone', tone);
          var html = '<h3>' + cellText(cells[0]) + '</h3>';
          for (var i = 1; i < cells.length; i++) {
            html += '<p><span class="flip-label">' + (headers[i] || '') + '</span>' + cellText(cells[i]) + '</p>';
          }
          card.innerHTML = html;
          ui.appendChild(card);
        }
      });
      wrap.parentNode.insertBefore(ui, wrap);
      wrap.hidden = true;
      wrap.dataset.vizReady = '1';
      armReveal(ui);
    });
  }

  function initTabs(root) {
    var tabs = Array.prototype.slice.call(root.querySelectorAll('[role="tab"]'));
    var panels = Array.prototype.slice.call(root.querySelectorAll('[role="tabpanel"]'));
    if (!tabs.length) return;
    function select(tab, focus) {
      tabs.forEach(function (t, i) {
        var on = t === tab;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.tabIndex = on ? 0 : -1;
        if (panels[i]) panels[i].hidden = !on;
      });
      var panel = document.getElementById(tab.getAttribute('aria-controls'));
      if (panel) renderMermaidIn(panel);
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { select(tab, false); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (!next) return;
        e.preventDefault();
        select(next, true);
      });
    });
    var current = tabs.filter(function (t) { return t.getAttribute('aria-selected') === 'true'; })[0] || tabs[0];
    select(current, false);
  }

  function initTimeline(root) {
    var items = Array.prototype.slice.call(root.querySelectorAll('li[data-target]'));
    var panels = {};
    Array.prototype.forEach.call(root.querySelectorAll('[data-panel]'), function (p) {
      panels[p.getAttribute('data-panel')] = p;
    });
    var fill = root.querySelector('.h-timeline-fill');
    function show(item, scroll) {
      var id = item.getAttribute('data-target');
      items.forEach(function (li, index) {
        var on = li === item;
        var btn = li.querySelector('button');
        if (btn) btn.setAttribute('aria-pressed', on ? 'true' : 'false');
        if (on && fill) fill.style.setProperty('--p', items.length < 2 ? '1' : String(index / (items.length - 1)));
      });
      Object.keys(panels).forEach(function (key) { panels[key].hidden = key !== id; });
      var panel = panels[id];
      if (panel) {
        var tone = item.getAttribute('data-tone');
        if (tone) panel.setAttribute('data-tone', tone);
      }
      if (!scroll) return;
      var dest = document.getElementById(id);
      if (!dest) return;
      document.querySelectorAll('.era-live').forEach(function (el) { el.classList.remove('era-live'); });
      dest.classList.add('era-live');
      if (item.getAttribute('data-tone')) dest.setAttribute('data-tone', item.getAttribute('data-tone'));
      dest.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    }
    items.forEach(function (li) {
      var btn = li.querySelector('button');
      if (!btn) return;
      btn.addEventListener('click', function () { show(li, true); });
    });
    if (items[0]) show(items[0], false);
  }

  function mindNode(node) {
    var li = document.createElement('li');
    var row = document.createElement('div');
    row.className = 'mind-row';
    var tone = node.tone || '';
    var kids = node.children || [];
    if (kids.length) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mind-node';
      btn.textContent = node.label;
      if (tone) btn.setAttribute('data-tone', tone);
      btn.setAttribute('aria-expanded', 'true');
      var ul = document.createElement('ul');
      kids.forEach(function (child) { ul.appendChild(mindNode(child)); });
      btn.addEventListener('click', function () {
        var open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', open ? 'false' : 'true');
        ul.hidden = open;
      });
      row.appendChild(btn);
      if (node.href) {
        var a = document.createElement('a');
        a.className = 'mind-open';
        a.href = node.href;
        a.textContent = 'Open';
        row.appendChild(a);
      }
      li.appendChild(row);
      li.appendChild(ul);
    } else {
      var leaf = document.createElement('span');
      leaf.className = 'mind-node';
      leaf.textContent = node.label;
      if (tone) leaf.setAttribute('data-tone', tone);
      row.appendChild(leaf);
      if (node.href) {
        var link = document.createElement('a');
        link.className = 'mind-open';
        link.href = node.href;
        link.textContent = 'Open';
        row.appendChild(link);
      }
      li.appendChild(row);
    }
    return li;
  }

  function initMindmap(root) {
    if (root.dataset.mindReady) return;
    var script = root.querySelector('script[type="application/json"]');
    if (!script) return;
    var data;
    try { data = JSON.parse(script.textContent); }
    catch (err) { return; }
    var bar = document.createElement('div');
    bar.className = 'mindmap-bar';
    bar.innerHTML = '<p class="kicker">Mind map</p><div class="mindmap-tools"><button type="button" data-zoom="in" aria-label="Zoom in">+</button><button type="button" data-zoom="out" aria-label="Zoom out">−</button><button type="button" data-zoom="reset">Reset</button></div>';
    var viewport = document.createElement('div');
    viewport.className = 'mindmap-viewport';
    viewport.tabIndex = 0;
    viewport.setAttribute('aria-label', (data.label || 'Mind map') + '. Drag to pan, buttons to zoom, click a branch to expand or collapse.');
    var canvas = document.createElement('div');
    canvas.className = 'mindmap-canvas';
    var tree = document.createElement('ul');
    tree.className = 'mind-tree';
    tree.appendChild(mindNode(data));
    canvas.appendChild(tree);
    viewport.appendChild(canvas);
    root.appendChild(bar);
    root.appendChild(viewport);
    root.dataset.mindReady = '1';

    var scale = 1, x = 8, y = 8;
    function apply() {
      canvas.style.transform = 'translate(' + x + 'px,' + y + 'px) scale(' + scale + ')';
    }
    function fit() {
      var vw = viewport.clientWidth || 320;
      var cw = tree.scrollWidth || 1;
      scale = (vw - 36) / cw;
      if (!isFinite(scale)) scale = 1;
      scale = Math.min(1, Math.max(0.82, scale));
      x = 16;
      y = 20;
      apply();
    }
    bar.addEventListener('click', function (e) {
      var b = e.target.closest('[data-zoom]');
      if (!b) return;
      var z = b.getAttribute('data-zoom');
      if (z === 'in') scale = Math.min(2.2, scale + 0.15);
      else if (z === 'out') scale = Math.max(0.35, scale - 0.15);
      else { fit(); return; }
      apply();
    });
    viewport.addEventListener('wheel', function (e) {
      e.preventDefault();
      var dir = e.deltaY > 0 ? -0.08 : 0.08;
      scale = Math.min(2.2, Math.max(0.35, scale + dir));
      apply();
    }, { passive: false });
    var drag = null;
    viewport.addEventListener('pointerdown', function (e) {
      if (e.target.closest('button, a')) return;
      drag = { x: e.clientX, y: e.clientY, ox: x, oy: y };
      viewport.setPointerCapture(e.pointerId);
    });
    viewport.addEventListener('pointermove', function (e) {
      if (!drag) return;
      x = drag.ox + (e.clientX - drag.x);
      y = drag.oy + (e.clientY - drag.y);
      apply();
    });
    function endDrag() { drag = null; }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('keydown', function (e) {
      if (e.key === '+' || e.key === '=') { scale = Math.min(2.2, scale + 0.15); apply(); }
      if (e.key === '-' || e.key === '_') { scale = Math.max(0.35, scale - 0.15); apply(); }
      if (e.key === '0') fit();
    });
    requestAnimationFrame(function () { requestAnimationFrame(fit); });
  }

  var mermaidPromise = null;
  var mermaidReady = false;
  function loadMermaid() {
    if (window.mermaid) return Promise.resolve(window.mermaid);
    if (mermaidPromise) return mermaidPromise;
    mermaidPromise = new Promise(function (resolve, reject) {
      var s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11.4.1/dist/mermaid.min.js';
      s.async = true;
      s.onload = function () { resolve(window.mermaid); };
      s.onerror = function () { mermaidPromise = null; reject(new Error('mermaid')); };
      document.head.appendChild(s);
    });
    return mermaidPromise;
  }

  function rememberGraphs(nodes) {
    Array.prototype.forEach.call(nodes, function (node) {
      if (!node.dataset.graph) node.dataset.graph = node.textContent.trim();
    });
  }

  function renderNodes(nodes) {
    var list = Array.prototype.filter.call(nodes, function (node) {
      return node.dataset.graph && node.offsetParent !== null && node.dataset.rendering !== '1';
    });
    if (!list.length) return Promise.resolve();
    return loadMermaid().then(function (mermaid) {
      var dark = themeName() === 'dark';
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: 'base',
        fontFamily: 'Inter, Segoe UI, sans-serif',
        themeVariables: dark ? {
          background: '#141820',
          primaryColor: '#1a2e36',
          primaryTextColor: '#f3f5f7',
          primaryBorderColor: '#8ee0d8',
          secondaryColor: '#243044',
          secondaryTextColor: '#f3f5f7',
          tertiaryColor: '#2a241c',
          tertiaryTextColor: '#f3f5f7',
          lineColor: '#a3acb8',
          textColor: '#f3f5f7',
          mainBkg: '#1a2e36',
          nodeBorder: '#8ee0d8',
          clusterBkg: '#182028',
          clusterBorder: '#a3acb8',
          titleColor: '#f3f5f7',
          edgeLabelBackground: '#141820'
        } : {
          background: '#fffcf7',
          primaryColor: '#e3f3f1',
          primaryTextColor: '#16181d',
          primaryBorderColor: '#0d5c58',
          secondaryColor: '#e7ebf8',
          secondaryTextColor: '#16181d',
          tertiaryColor: '#f8ebe3',
          tertiaryTextColor: '#16181d',
          lineColor: '#5c6570',
          textColor: '#16181d',
          mainBkg: '#e3f3f1',
          nodeBorder: '#0d5c58',
          clusterBkg: '#fffcf7',
          clusterBorder: '#5c6570',
          titleColor: '#16181d',
          edgeLabelBackground: '#fffcf7'
        }
      });
      list.forEach(function (node) {
        if (node.dataset.themeDrawn === themeName() && node.querySelector('svg')) return;
        node.removeAttribute('data-processed');
        node.textContent = node.dataset.graph;
      });
      var pending = list.filter(function (node) { return !node.querySelector('svg') || node.dataset.themeDrawn !== themeName(); });
      if (!pending.length) return;
      pending.forEach(function (node) { node.dataset.rendering = '1'; });
      return mermaid.run({ nodes: pending }).then(function () {
        pending.forEach(function (node) {
          node.dataset.themeDrawn = themeName();
          node.dataset.rendering = '';
        });
        mermaidReady = true;
      }).catch(function () {
        pending.forEach(function (node) { node.dataset.rendering = ''; });
      });
    }).catch(function () {});
  }

  function renderMermaidIn(root) {
    if (!root) return;
    var nodes = root.matches && root.matches('.mermaid') ? [root] : root.querySelectorAll('.mermaid');
    rememberGraphs(nodes);
    renderNodes(nodes);
  }

  function watchMermaid() {
    var nodes = document.querySelectorAll('.mermaid');
    if (!nodes.length) return;
    rememberGraphs(nodes);
    if (!('IntersectionObserver' in window)) { renderNodes(nodes); return; }
    var io = new IntersectionObserver(function (entries) {
      var hit = [];
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        hit.push(entry.target);
        io.unobserve(entry.target);
      });
      if (hit.length) renderNodes(hit);
    }, { rootMargin: '120px' });
    Array.prototype.forEach.call(nodes, function (node) {
      if (node.closest('[hidden]')) return;
      io.observe(node);
    });
  }

  function syncCats() {
    var h = (location.hash || '').replace('#', '');
    var known = { daily: 1, weekly: 1, frameworks: 1, langchain: 1, 'google-research': 1, 'computer-vision': 1 };
    var type = known[h] ? h : 'all';
    Array.prototype.forEach.call(document.querySelectorAll('.cat-card'), function (card) {
      card.classList.toggle('is-current', card.getAttribute('data-count-type') === type);
    });
  }

  function fillCategoryCounts() {
    if (!document.querySelector('[data-count-type]')) return;
    syncCats();
    window.addEventListener('hashchange', syncCats);
    fetch(new URL('digests.json', location.href)).then(function (r) {
      if (!r.ok) throw new Error('manifest');
      return r.json();
    }).then(function (items) {
      var list = Array.isArray(items) ? items : [];
      var counts = { all: list.length, daily: 0, weekly: 0, frameworks: 0, langchain: 0, 'google-research': 0, 'computer-vision': 0 };
      list.forEach(function (d) {
        var t = d && d.type;
        if (!t) return;
        counts[t] = (counts[t] || 0) + 1;
      });
      Array.prototype.forEach.call(document.querySelectorAll('[data-count-type]'), function (el) {
        var key = el.getAttribute('data-count-type');
        if (!Object.prototype.hasOwnProperty.call(counts, key)) return;
        var num = el.querySelector('.stat-num');
        if (!num) return;
        el.setAttribute('data-count', String(counts[key]));
        num.textContent = '0';
        animateCount(el);
      });
    }).catch(function () {});
  }

  function watchDigestGrid() {
    var feat = document.getElementById('featured');
    var list = document.getElementById('list');
    if (!feat && !list) return;
    var mo = new MutationObserver(function () { armReveal(document); });
    if (feat) mo.observe(feat, { childList: true });
    if (list) mo.observe(list, { childList: true });
  }

  function boot() {
    setAccent();
    enhanceTables();
    Array.prototype.forEach.call(document.querySelectorAll('[data-tabs]'), initTabs);
    Array.prototype.forEach.call(document.querySelectorAll('[data-timeline]'), initTimeline);
    Array.prototype.forEach.call(document.querySelectorAll('[data-mindmap]'), initMindmap);
    collapseStories();
    armCounters(document);
    armReveal(document);
    watchMermaid();
    fillCategoryCounts();
    watchDigestGrid();
    window.addEventListener('hashchange', openHashedStory);
    document.addEventListener('themechange', function () {
      document.querySelectorAll('.mermaid').forEach(function (node) {
        if (node.dataset.graph) node.dataset.themeDrawn = '';
      });
      document.querySelectorAll('.mermaid').forEach(function (node) {
        if (node.closest('[hidden]')) return;
        renderNodes([node]);
      });
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
