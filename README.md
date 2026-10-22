# AI Nowdays

Bhavesh's AI digest: https://bhaveshwadibhasme.github.io/AI-Nowadays/

Static site in the repository root (`index.html`, `style.css`, `theme.js`, `digests.json`, `digests/`, and `ai-engineering/`). There is no build step. GitHub Pages publishes that root on every push to `main` through `.github/workflows/pages.yml`. The same workflow can be started by hand with `workflow_dispatch`.

The home page reads `digests.json` and renders the latest issue, the archive grid, search, category chips, and tag filters. A new digest is one HTML file plus one manifest entry. Leave the digest-rendering script in `index.html` alone. The AI Engineering block above the feed is a separate section; leave it in place.

## Add a digest

1. Copy an existing digest to `digests/YYYY-MM-DD-{daily|weekly|frameworks|langchain}.html`. Use `digests/2026-10-13-langchain.html` for a LangChain LinkedIn roundup.
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

`type` is `daily`, `weekly`, `frameworks`, or `langchain`. The home page labels those Daily, Weekly deep-dive, Frameworks, and LangChain. `langchain` is for updates gathered from LangChain's LinkedIn page. Each story card has a "View LinkedIn post" button and, when the source gives one, "Read full story", "Repo", or "Livestream". Keep every URL exactly as published.

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

The home page does not gain a pillar filter. Each primer has a "Latest from the feed" list that reads `digests.json` and shows entries whose `pillar` matches. With no matches, the list stays empty.

Licensed under the MIT License. See [LICENSE](LICENSE).
