# AI Nowdays

Bhavesh's AI digest: https://bhaveshwadibhasme.github.io/AI-Nowadays/

Static site in the repository root (`index.html`, `style.css`, `theme.js`, and `digests/`). GitHub Pages publishes that root on every push to `main` through `.github/workflows/pages.yml`. The same workflow can be started by hand with `workflow_dispatch`.

To add a digest: create `digests/YYYY-MM-DD-{daily|weekly|frameworks}.html` (copy an existing one) and add an entry to `digests.json`:

```json
{"date":"YYYY-MM-DD","type":"daily|weekly|frameworks","title":"...","summary":"...","url":"digests/YYYY-MM-DD-daily.html"}
```

Licensed under the MIT License. See [LICENSE](LICENSE).
