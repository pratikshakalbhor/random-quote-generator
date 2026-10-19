# Random Quote Generator

A single-screen React app that shows a random proverb or public-domain saying, with
favorites you can keep and a production build that keeps working with no internet
connection.

**[Live demo](https://your-username.github.io/random-quote-generator/)** <!-- TODO: replace your-username after the first deploy -->

---

## Overview

The app renders one quote on load — no loading spinner, no empty state — and every
press of **New Quote** picks a different one. Favorites are stored locally and
survive refreshes and browser restarts. A generated service worker precaches the
app shell, so once visited the app opens offline. There are no servers, no external
APIs, and no paid services: all forty quotes are bundled with the app.

## Features

- **Instant first quote** — the initial quote comes from a lazy `useState`
  initializer, so a valid quote is on screen in the first paint.
- **Never repeats** — "New Quote" is guaranteed to differ from the quote currently
  displayed.
- **Smooth transitions** — the outgoing quote fades and slides out, the new one
  fades in (~400ms). The card's height is frozen during the swap so nothing jumps.
  Fully disabled under `prefers-reduced-motion`.
- **Favorites** — a heart/star toggle on the card (`aria-pressed`, dynamic
  accessible label) and a favorites list with per-item **Remove**, an empty state,
  and a live count in the header. Persisted in `localStorage`.
- **Corruption-safe storage** — invalid JSON, wrong-shaped data, or blocked storage
  degrade to an empty list instead of crashing.
- **Light / dark theme** — driven entirely by `prefers-color-scheme` and design
  tokens.
- **Responsive** — designed from 320px to desktop, portrait and landscape.
- **Accessible** — semantic `blockquote`, real `button` elements, one consistent
  `:focus-visible` ring, and an `aria-live="polite"` region for quote changes.
- **Offline-ready** — installable PWA with a manifest (name, icons, theme colour).

## Tech stack

| Layer | Choice | Why |
| --- | --- | --- |
| Build tool | [Vite](https://vite.dev/) 8 | Instant dev server, tiny production output |
| UI | [React](https://react.dev/) 19 (JavaScript, no TypeScript) | Component model, hooks-only state |
| Linting | [oxlint](https://oxc.rs/docs/guide/usage/linter) | Fast, zero-config, ships with the Vite template |
| Offline | [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (Workbox) | Generates the manifest and service worker at build time |
| Styling | Hand-written CSS with custom properties | Tokens, theming, and responsive rules with no runtime cost |
| Deployment | [gh-pages](https://github.com/tschaub/gh-pages) | Publishes `dist/` to the `gh-pages` branch |
| Persistence | `localStorage` via a custom `useLocalStorage` hook | No backend, no account, works offline |

## Project structure

```
random-quote-generator/
├─ docs/                      # design notes + screenshot drop folder
├─ public/
│  └─ favicon.svg             # app icon (also used by the web manifest)
├─ src/
│  ├─ components/
│  │  ├─ QuoteCard.jsx        # current quote + favorite toggle
│  │  └─ FavoritesList.jsx    # saved quotes, remove, empty state
│  ├─ data/
│  │  └─ quotes.json          # the 40-quote dataset
│  ├─ hooks/
│  │  └─ useLocalStorage.js   # reusable, corruption-safe storage state
│  ├─ styles/
│  │  ├─ global.css           # tokens, theme, layout, primitives
│  │  └─ app.css              # transitions, favorites, toggle
│  ├─ utils/
│  │  └─ pickRandom.js        # random quote, never the current one
│  ├─ App.jsx                 # screen composition
│  └─ main.jsx                # entry point
├─ index.html
├─ vite.config.js             # React, base path, PWA manifest + Workbox
└─ package.json
```

## Data schema

`src/data/quotes.json` is an array of 40 objects:

| Field | Type | Required | Description |
| --- | --- | --- | --- |
| `id` | `number` | yes | Unique, stable identifier (1–40). Used for dedupe, React keys, and "not the same quote" checks. |
| `text` | `string` | yes | The quote itself. Kept short; no long passages. |
| `author` | `string \| null` | yes | Attribution. Three entries are `null`; the UI renders those as **"Unknown author"**. |
| `genre` | `string` | yes | One of `Wisdom`, `Motivation`, `Courage`, `Life`, `Success`. Rendered as a chip. |

Example:

```json
{
  "id": 18,
  "text": "A ship in harbor is safe, but that is not what ships are for.",
  "author": "John A. Shedd",
  "genre": "Courage"
}
```

The dataset is imported directly (`import quotes from './data/quotes.json'`), so the
data is **bundled into the JavaScript chunk** rather than fetched at runtime. That is
what makes the first render instant and the app fully functional offline.

## Setup and run

Requires Node.js 20.19+ (developed on Node 22).

```bash
npm install        # install dependencies
npm run dev        # start the dev server (http://localhost:5173)
npm run build      # production build -> dist/ (also generates the service worker)
npm run preview    # serve the production build
npm run lint       # run oxlint
```

> The service worker is only generated for production builds, so test offline
> behaviour with `npm run build && npm run preview`, not `npm run dev`.

## How the offline fallback works

1. **Build time.** `vite-plugin-pwa` runs Workbox in `generateSW` mode. It enumerates
   the build output matching `globPatterns` and writes a precache manifest into
   `dist/sw.js`. The precached set is the app shell: `index.html`, the JS bundle
   (which contains `quotes.json`), the CSS bundle, `favicon.svg`,
   `manifest.webmanifest`, and the registration script.
2. **Install time.** On the first visit the generated service worker installs and
   downloads every precached URL into the Cache Storage API under a revisioned cache
   name. Nothing is fetched from the network at runtime — there is no API to call.
3. **Serve time.** Requests are answered cache-first from the precache. A Workbox
   `NavigationRoute` is registered with `createHandlerBoundToURL('index.html')`, so
   any navigation — including a hard refresh on a deep URL — falls back to the cached
   shell instead of a network error.
4. **Updates.** `registerType: 'autoUpdate'` calls `skipWaiting()` and
   `clientsClaim()`; `cleanupOutdatedCaches()` removes caches from previous builds.
   A new deploy replaces the precache on the next visit.
5. **No internet at all.** Because the shell and the quote data are both in the
   precache, the app loads, renders a quote, and responds to "New Quote". Favorites
   are read from `localStorage`, which also needs no network.

Offline-ready does not mean "empty app offline": every screen and interaction in this
project is client-side, so the offline experience is identical to the online one.

## Design inspiration notes

Short version — the full write-up is in [`docs/design-notes.md`](docs/design-notes.md).

- **One idea per screen.** The quote is the hero; everything else (favorites,
  metadata) is deliberately quiet so the card stays the focal point.
- **Editorial serif for quotes, system sans for UI.** Georgia sets quotations apart
  from interface copy without a webfont request.
- **A single accent colour.** Indigo (`#6366f1`) carries the primary action, the
  focus ring, and the saved-favorite state; everything else is neutral.
- **Border + soft shadow on cards.** The border keeps the surface legible in dark
  mode; the shadow gives it depth in light mode.
- **Tokenised theming.** Colour, spacing, radius, typography, and motion are all
  custom properties, re-declared once under `prefers-color-scheme: dark`. Components
  never branch on the theme.
- **Responsive without breakpoint sprawl.** Fluid `clamp()` typography, a single
  `40rem` content column, and only three media queries: compact phones, 768px and up
  (two-column favorites), and short landscape viewports.
- **Motion as explanation, not decoration.** A fade/slide marks the state change; a
  frozen card height keeps it from causing layout shift; reduced-motion users get an
  instant swap.

## Screenshots

Captured screenshots live in [`docs/screenshots/`](docs/screenshots/). See
[`docs/screenshots/README.md`](docs/screenshots/README.md) for the capture checklist.

| Viewport | Light | Dark |
| --- | --- | --- |
| 320px (phone) | [`320px-light.png`](docs/screenshots/320px-light.png) | — |
| 768px (tablet) | [`768px-light.png`](docs/screenshots/768px-light.png) | — |
| 1280px (desktop) | [`1280px-light.png`](docs/screenshots/1280px-light.png) | [`1280px-dark.png`](docs/screenshots/1280px-dark.png) |
| Favorites | [`favorites.png`](docs/screenshots/favorites.png) | — |

## Deployment to GitHub Pages

The build is configured for a **project site**, served from
`https://<user>.github.io/<repo>/`. `base` in `vite.config.js` is set to
`/random-quote-generator/` — change it if the repository name differs, or set it to
`/` for a user/organisation site or a custom domain.

```bash
npm run deploy     # runs predeploy (npm run build), then publishes dist/ to gh-pages
```

Then in the repository settings, set **Pages → Source** to the `gh-pages` branch.

## Testing checklist

**Animation**

- [ ] "New Quote" fades/slides the old quote out and the new one in.
- [ ] The card height does not jump or flicker during the change.
- [ ] With reduced motion enabled, the quote swaps instantly (no delay, no animation).
- [ ] Rapid clicking never leaves the card faded out or blank.

**Favorites**

- [ ] The toggle flips, `aria-pressed` updates, and the label changes between
      "Add to favorites" and "Remove from favorites".
- [ ] Adding shows the quote in the list and increments the header count.
- [ ] **Remove** deletes that quote and decrements the count.
- [ ] The empty state appears when nothing is saved.
- [ ] Add a favorite, refresh, then restart the browser: it persists.
- [ ] Set `random-quote-generator:favorites` to `{oops` in Local Storage and refresh:
      the app loads with an empty list and no crash.

**Offline (DevTools → Network → Offline)**

- [ ] `npm run build && npm run preview`, then check Application → Service Workers
      for an activated worker.
- [ ] Application → Manifest shows the name, icon, and theme colour.
- [ ] Go offline and reload: the app loads and "New Quote" still works.
- [ ] The Network tab shows no requests to external APIs.

## Note on quote sources

The forty entries are short, widely reproduced proverbs and classical sayings chosen
to stay clear of copyright: ancient and traditional proverbs (Latin, Japanese,
English, Māori), and quotations from long-dead public-domain authors such as
Socrates, Lao Tzu, Shakespeare, Franklin, Emerson, Seneca, and Thoreau. No long
passages, lyrics, or modern speeches are included.

Practical caveats:

- Several proverbs are recorded in `author` as their tradition (for example
  `"Japanese proverb"`, `"Latin proverb"`) rather than a named individual.
- Three entries have `author: null` — genuinely unattributed sayings ("Haste makes
  waste.", "Actions speak louder than words.", "All good things come to an end.").
  The UI renders these as **"Unknown author"**.
- Some classical attributions are traditional rather than documented (for example
  "The secret of getting ahead is getting started." is popularly attributed to Mark
  Twain). Popular attributions were preferred over obscure ones so the dataset reads
  as familiar, and no claim of scholarly certainty is made.
- `genre` is an editorial label for grouping, not a property of the source text.

## License

MIT (or your preferred license) — the bundled quotations are public domain as
described above.
