(function () {
  var roots = Array.prototype.slice.call(document.querySelectorAll('[data-pillar-feed]'));
  if (!roots.length) return;
  var TYPE_LABEL = { daily: 'Daily', weekly: 'Weekly deep-dive', frameworks: 'Frameworks', langchain: 'LangChain', 'google-research': 'Google Research' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function formatDate(iso) {
    var p = String(iso || '').split('-');
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    if (p.length !== 3 || !months[Number(p[1]) - 1]) return iso || '';
    return String(Number(p[2])) + ' ' + months[Number(p[1]) - 1] + ' ' + p[0];
  }
  function hrefFor(url) {
    var value = String(url || '');
    if (/^https?:\/\//i.test(value)) return value;
    return '../' + value.replace(/^\.\//, '');
  }
  function card(d) {
    var tags = (d.tags || []).map(function (t) { return '<span class="tag">' + esc(t) + '</span>'; }).join('');
    var label = TYPE_LABEL[d.type] || d.type || '';
    return '<article class="issue"><div class="meta-row">' +
      (label ? '<span class="chip chip-' + esc(d.type) + '">' + esc(label) + '</span>' : '') +
      '<time datetime="' + esc(d.date) + '">' + esc(formatDate(d.date)) + '</time>' +
      (d.readingTime ? '<span>' + esc(d.readingTime) + '</span>' : '') +
      '</div><h3><a href="' + esc(hrefFor(d.url)) + '">' + esc(d.title) + '</a></h3>' +
      (d.summary ? '<p>' + esc(d.summary) + '</p>' : '') +
      (tags ? '<div class="tag-row">' + tags + '</div>' : '') +
      '</article>';
  }
  function paint(root, html) {
    var mount = root.querySelector('[data-pillar-list]');
    if (mount) mount.innerHTML = html;
  }

  function rowsFor(d) {
    var rows = [];
    if (d.pillar) rows.push(d);
    var nested = Array.isArray(d.items) ? d.items : [];
    nested.forEach(function (item) {
      if (!item || !item.pillar) return;
      rows.push({
        date: item.date || d.date,
        type: item.type || d.type,
        title: item.title || d.title,
        summary: item.summary || '',
        url: item.url || d.url,
        readingTime: item.readingTime || d.readingTime,
        tags: item.tags || d.tags,
        pillar: item.pillar
      });
    });
    return rows;
  }

  fetch('../digests.json').then(function (r) {
    if (!r.ok) throw new Error('manifest');
    return r.json();
  }).then(function (items) {
    var data = [];
    (Array.isArray(items) ? items : []).forEach(function (d) {
      if (d) rowsFor(d).forEach(function (row) { data.push(row); });
    });
    roots.forEach(function (root) {
      var pillar = root.getAttribute('data-pillar-feed');
      var matched = data.filter(function (d) { return d && d.pillar === pillar; })
        .sort(function (a, b) { return String(b.date).localeCompare(String(a.date)); });
      if (!matched.length) {
        paint(root, '<div class="empty-card"><h2>Nothing filed here yet</h2><p>When a digest entry sets <code>"pillar": "' + esc(pillar) + '"</code>, it shows up in this list. Until then the primer stands on its own.</p></div>');
        return;
      }
      paint(root, '<div class="issue-grid">' + matched.map(card).join('') + '</div>');
    });
  }).catch(function () {
    roots.forEach(function (root) {
      paint(root, '<div class="empty-card"><h2>The feed is unavailable</h2><p>digests.json could not be loaded. This primer is unaffected.</p></div>');
    });
  });
})();
