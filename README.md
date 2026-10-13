# AI Nowdays

Bhavesh's AI digest: https://bhaveshwadibhasme.github.io/AI-Nowadays/

Static site in the repository root (`index.html`, `style.css`, `theme.js`, `digests.json`, and `digests/`). There is no build step. GitHub Pages publishes that root on every push to `main` through `.github/workflows/pages.yml`. The same workflow can be started by hand with `workflow_dispatch`.

The home page reads `digests.json` and renders the latest issue, the archive grid, search, category chips, and tag filters. A new digest is one HTML file plus one manifest entry. Leave `index.html` alone.

## Add a digest

1. Copy `digests/2026-10-13-daily.html` to `digests/YYYY-MM-DD-{daily|weekly|frameworks}.html`.
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

`type` is `daily`, `weekly`, or `frameworks`. The home page labels those Daily, Weekly deep-dive, and Frameworks.

`readingTime` is shown next to the date. Use a short phrase such as `4 min read`.

`tags` drives the filters and the chips on each card. Use any of:

- Models
- Agents
- MCP
- Frameworks
- Enterprise
- Webinars
- From X

Search matches the title, summary, date, reading time, type, and tags.

Licensed under the MIT License. See [LICENSE](LICENSE).
