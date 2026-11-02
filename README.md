# AI Nowdays

Bhavesh's AI digest: https://bhaveshwadibhasme.github.io/AI-Nowadays/

Static site in the repository root (`index.html`, `style.css`, `theme.js`, `digests.json`, `digests/`, `ai-engineering/`, and `computer-vision.html`). There is no build step. GitHub Pages publishes that root on every push to `main` through `.github/workflows/pages.yml`. The same workflow can be started by hand with `workflow_dispatch`.

The home page reads `digests.json` and renders the latest issue, the archive grid, search, category chips, and tag filters. A new digest is one HTML file plus one manifest entry. Leave the digest-rendering script in `index.html` alone. The AI Engineering block above the feed is a separate section; leave it in place.

## Add a digest

1. Copy an existing digest to `digests/YYYY-MM-DD-{daily|weekly|frameworks|langchain|google-research|computer-vision}.html`. Use `digests/2026-10-13-langchain.html` for a LangChain LinkedIn roundup. Use `digests/2026-10-28-google-research.html` for a Google Research LinkedIn roundup.
2. Keep the shared header, sticky table of contents, story cards (one icon per section), "Why it matters" callouts, link buttons, the webinar list with date badges, and the highlighted "Worth a deep read" and "Trend watch" panels. Preserve every source link.
3. Add an entry at the top of `digests.json`:

```json
{
  "date": "YYYY-MM-DD",
  "type": "daily",
  "title": "Daily AI Digest: ...",
  "summary": "One or two sentences for the featured card.",
  "url": "digests/YYYY-MM-DD-daily.html",
  "readingTime": "4 min read",
  "tags": ["Models", "Agents"]
}
```

`type` is `daily`, `weekly`, `frameworks`, `langchain`, `google-research`, or `computer-vision`. The home page labels those Daily, Weekly deep-dive, Frameworks, LangChain, Google Research, and Computer Vision. `langchain` is for updates gathered from LangChain's LinkedIn page. `google-research` is for updates gathered from the Google Research LinkedIn showcase (https://www.linkedin.com/showcase/googleresearch/posts/?feedView=all). The home page category chips include Google Research, and `#google-research` filters the archive the same way `#langchain` does. Cards use the `chip-google-research` colour. `computer-vision` is for dated Computer Vision updates. The chip uses `chip-computer-vision`, and `#computer-vision` filters the archive the same way. The standing primer is [`computer-vision.html`](computer-vision.html). Add a `computer-vision` entry only when there is a real dated update. Each story card has a "View LinkedIn post" button (Google Research cards say "View on LinkedIn") and, when the source gives one, "Read full story", "Repo", or "Livestream". Keep every URL exactly as published.

4. Include the visual layer from [Visual digests](#visual-digests): the shared stylesheet and script, a stat strip, a small Mermaid flow or mind map, and colour-coded story cards. Copy `digests/_visual-template.html`.

`readingTime` is shown next to the date. Use a short phrase such as `4 min read`.

`tags` drives the filters and the chips on each card. Use any of:

- Models
- Agents
- MCP
- Frameworks
- Enterprise
- Webinars
- From X
- LangChain

Search matches the title, summary, date, reading time, type, tags, and, when set, the `pillar` value and its label (`context` also matches "Context", `tools-agents` also matches "Tools").

An entry may also include an optional `pillar` string. Omit it and the issue stays in the digest only. Set it to file the same issue on an AI Engineering primer. Use exactly one of `context`, `cost`, `measure`, `guardrails`, `tools-agents`.

A daily issue that covers several pillars can instead list `items`. Each item uses the same `pillar` values, plus `title`, `summary`, and `url` (the digest URL plus a story anchor). The home page still lists the issue once. Each primer lists the items whose `pillar` matches.

```json
{
  "date": "YYYY-MM-DD",
  "type": "daily",
  "title": "Daily AI Digest: ...",
  "summary": "One or two sentences for the featured card.",
  "url": "digests/YYYY-MM-DD-daily.html",
  "readingTime": "4 min read",
  "tags": ["Models", "Agents"],
  "pillar": "context"
}
```

## AI Engineering

`ai-engineering/` is a standing section, separate from the digest feed: a landing page and one primer per pillar.

| `pillar` | Primer |
| --- | --- |
| `context` | Give it context |
| `cost` | Cut down the cost |
| `measure` | Measure it |
| `guardrails` | Guardrails |
| `tools-agents` | Tools + agents |

The home page does not gain a pillar filter. Each primer has a "Latest from the feed" list that reads `digests.json` and shows entries whose `pillar` matches, and any `items` whose own `pillar` matches. With no matches, the list stays empty. On a digest page, a pillar tag uses the primer's tone (`tone-teal`, `tone-copper`, `tone-iris`, `tone-chain`, `tone-ink`) and links to that primer.

## Computer Vision

`computer-vision.html` is a standing primer, separate from the digest feed: sixty years from edge detectors to vision agents. Dated updates belong in `digests.json` with `"type": "computer-vision"`. They show on the home page under the Computer Vision chip and in the page's Latest updates list.

## Visual digests

Every page loads `visuals.css` and `visuals.js` next to `style.css` and `theme.js`. From the site root the paths are `visuals.css` and `visuals.js`. From `digests/` and `ai-engineering/` they are `../visuals.css` and `../visuals.js`. The script defers. It does not change digest text, `digests.json`, or the home-page filter script.

On a digest page the script adds three things by itself:

- Scroll-reveal on cards and sections. `prefers-reduced-motion: reduce` shows them immediately, with no animation.
- A category accent from the chip (`chip-daily`, `chip-weekly`, `chip-frameworks`, `chip-langchain`, `chip-google-research`, `chip-computer-vision`).
- A "Show why it matters" or "Show the rest" control on long story cards, after the first paragraph. The first paragraph stays visible. A `#hash` that points at a story opens that card.

Future digests should also include these three pieces in the article, filled with that issue's real themes. Do not invent numbers or sources. Copy `digests/_visual-template.html` and replace every placeholder.

1. A stat strip. Use `viz-stats` and one `viz-stat` per highlight. Put the final number in the HTML so it is visible without JavaScript. Add `data-count` to count up, `data-decimals` when the number has a fraction, and `data-suffix` or `data-prefix` for a unit.

```html
<div class="viz-stats" aria-label="Highlights">
  <p class="viz-stat" data-count="40" data-suffix="%">
    <span class="stat-num">40%</span>
    <span class="stat-label">Short label from the issue</span>
  </p>
</div>
```

2. One diagram that summarises the period. Either a Mermaid flow or a mind map, not a new claim. Mermaid is fetched from a CDN only when the page contains a `pre.mermaid` element, and only once that diagram is on screen. The mind map is drawn by `visuals.js` (pan, zoom, and expand) from JSON in the page, so it does not load another library.

```html
<pre class="mermaid">flowchart LR
  A[Theme] --> B[What changed]
  B --> C[What to do]</pre>
```

```html
<div class="mindmap" data-mindmap>
  <script type="application/json">
  {"label":"This issue","tone":"teal","children":[{"label":"Theme","tone":"copper"}]}
  </script>
</div>
```

Tones are `teal`, `copper`, `iris`, `chain`, `research`, `vision`, and `ink`.

3. Colour-coded story cards. Keep the existing `section.story` markup. Set the icon class to `story-icon`, `story-icon copper`, `story-icon iris`, `story-icon research`, or `story-icon vision` so each card has its own colour. One colour per story is enough.

`visuals.js` also builds tab sets from `[data-tabs]`, horizontal timelines from `[data-timeline]`, flip cards from a comparison table wrapped in `data-viz="flips"`, and use-case cards from `data-viz="cards"`. Light and dark follow `theme.js`. Diagrams redraw when the theme changes.

Pictures belong in `assets/`, with `loading="lazy"` and `width` and `height`. Use a Wikimedia Commons file you have checked, with the author, licence link, and file page in the caption, or an original SVG you drew for this site. Do not hotlink, and do not use a copyrighted image that has no licence.

Licensed under the MIT License. See [LICENSE](LICENSE).
