# Portfolio — Althea Mariel Cinco

A personal portfolio site styled like a code editor, built with plain HTML, CSS, and vanilla JavaScript — no frameworks, no build step.

**Live site:** https://cincoalthea.github.io/portfolio-personal/

## Features

- **Editor-inspired UI** — tab-bar top nav, file-card panels, and terminal-style section prompts (`$ whoami`, `$ ls ./projects`, …)
- **Interactive terminal** — a real (tiny) shell visitors can type into; run `help` for the full command list (`whoami`, `skills`, `neofetch`, `social`, `joke`, `history`, `ls`, `cd <section>`, `github`, `cv`/`resume`, `contact`, `theme <dark|light>`, `palette`, `date`, `echo`, `clear`, plus a couple of easter eggs)
- **Command palette** (`⌘K` / `Ctrl+K`) — quick keyboard-driven navigation
- **Dark/light theme toggle** — respects system preference by default, persists choice via `localStorage`
- **Live GitHub repos** — fetches and renders your most recently updated public repos from the GitHub API
- **Scroll-reveal animations** — sections fade in on scroll (skipped for users with reduced-motion preference)
- **Contact form** — client-side validation with a success/error status message (no backend)
- **Responsive layout** — collapses to a mobile dropdown menu on small screens

## Tech Stack

- HTML5, CSS3 (custom properties for theming, no preprocessor)
- Vanilla JavaScript (no frameworks or dependencies)
- [Google Fonts](https://fonts.google.com/): Space Grotesk, Inter, JetBrains Mono
- [GitHub REST API](https://docs.github.com/en/rest) for the live repos section
- Hosted on GitHub Pages

## Project Structure

```
.
├── index.html          # single-page site
├── css/style.css        # styles (also duplicated at root style.css)
├── js/script.js         # behavior (also duplicated at root script.js)
├── assets/               # images, favicons, CV — referenced by the site
└── *.png, *.jpg, *.pdf   # root copies of the same assets
```

## Running Locally

No build tools or dependencies required — just serve the folder statically:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Or open `index.html` directly in a browser (the GitHub API fetch and fonts still work over `file://`, though a local server is recommended).

## Customizing

Personal details live near the top of `js/script.js`:

```js
const GITHUB_USERNAME = "cincoalthea";
const REPOS_TO_SHOW = 3;
```

Update `GITHUB_USERNAME` to pull a different account's repositories. Colors, fonts, and spacing are controlled by the CSS custom properties at the top of `css/style.css` (`:root` for light theme, `[data-theme="dark"]` for dark).

## Deployment

The site is deployed via **GitHub Pages**, building from the `main` branch's root. Any push to `main` triggers a fresh deployment automatically.
