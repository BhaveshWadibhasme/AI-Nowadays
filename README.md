# AI Nowdays

Bhavesh's AI digest: https://bhaveshwadibhasme.github.io/AI-Nowadays/

Static site in the repository root (`index.html`, `style.css`, `theme.js`, `digests.json`, `digests/`, and `ai-engineering/`). There is no build step. GitHub Pages publishes that root on every push to `main` through `.github/workflows/pages.yml`. The same workflow can be started by hand with `workflow_dispatch`.

The home page reads `digests.json` and renders the latest issue, the archive grid, search, category chips, and tag filters. A new digest is one HTML file plus one manifest entry. Leave the digest-rendering script in `index.html` alone. The AI Engineering block above the feed is a separate section; leave it in place.

## Add a digest

1. Copy an existing digest to `digests/YYYY-MM-DD-{daily|weekly|frameworks|langchain|google-research}.html`. Use `digests/2026-10-13-langchain.html` for a LangChain LinkedIn roundup. Use `digests/2026-10-28-google-research.html` for a Google Research LinkedIn roundup.
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

`type` is `daily`, `weekly`, `frameworks`, `langchain`, or `google-research`. The home page labels those Daily, Weekly deep-dive, Frameworks, LangChain, and Google Research. `langchain` is for updates gathered from LangChain's LinkedIn page. `google-research` is for updates gathered from the Google Research LinkedIn showcase (https://www.linkedin.com/showcase/googleresearch/posts/?feedView=all). The home page category chips include Google Research, and `#google-research` filters the archive the same way `#langchain` does. Cards use the `chip-google-research` colour. Each story card has a "View LinkedIn post" button (Google Research cards say "View on LinkedIn") and, when the source gives one, "Read full story", "Repo", or "Livestream". Keep every URL exactly as published.

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

Licensed under the MIT License. See [LICENSE](LICENSE).
