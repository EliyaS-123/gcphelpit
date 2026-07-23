# GoogleHelpit 🛠️

**Your nerdy Google IT helper.** An independent, community-built hub of troubleshooting guides, learning resources, and certification guidance for **Google Cloud Platform (GCP)** and **Google Workspace (GWS)**.

> ⚠️ **Independent community project.** GoogleHelpit is **not affiliated with, endorsed by, or sponsored by Google LLC.** "Google", "Google Cloud", and "Google Workspace" are trademarks of Google LLC. All product links point to official Google documentation.

## What's here

A plain **static website** (hand-written HTML/CSS/vanilla JS — no build step, no dependencies). Open `index.html` in a browser, or serve it locally:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

### Pages
| File | Purpose |
|------|---------|
| `index.html` | Landing page + global search |
| `gcp-troubleshooting.html` | Common GCP errors → fixes |
| `workspace-troubleshooting.html` | Common Workspace errors → fixes |
| `learn.html` | Curated learning resources |
| `certifications.html` | GCP/GWS certifications + learning path |
| `about.html` | About, disclaimer, how to contribute |

### Assets
- `assets/css/styles.css` — single stylesheet (dark-first "nerdy" theme)
- `assets/js/main.js` — search/filter, collapsible cards, copy-to-clipboard, theme toggle
- `assets/img/` — original logo + favicon

## Status

v0.1 — initial content build.
