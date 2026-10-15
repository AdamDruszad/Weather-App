# Weather-App: audit and redesign

The audit covers the baseline at commit `04d4730`, which records the owner's uncommitted work
exactly as it was found. The redesign lives on the `redesign` branch.

- Before screenshots: `docs/redesign-screenshots/before/` (`home-*.png` and 15 states per width
  in `before/states/`)
- After screenshots: `docs/redesign-screenshots/after/` (same widths and states)
- State script: `../.claude/tools/weather-states.mjs`. It mocks `/api/weather` with the exact
  JSON shape `api/weather.js` returns.
- Contract: [`REDESIGN_INVENTORY.md`](REDESIGN_INVENTORY.md)

## Stack and data flow

Vanilla HTML, CSS and JS with no build step and no runtime dependencies.

1. `index.html` holds the markup and an inline pre-paint theme script.
2. `index.js` reads the query and calls `GET /api/weather?q=…` (same origin, `AbortController`,
   15 s timeout, latest request wins). It validates the shape, renders, converts units, and
   persists the theme and unit in `localStorage`.
3. `api/weather.js` is a Vercel Node function. It validates `q` (1–100 characters, no control
   characters), calls the fixed OpenWeather endpoint `/data/2.5/weather` (metric, 8 s timeout),
   maps upstream failures to safe codes (`INVALID_CITY`, `SERVICE_NOT_CONFIGURED`,
   `CITY_NOT_FOUND`, `RATE_LIMITED`, `UPSTREAM_UNAVAILABLE`, `INVALID_WEATHER_DATA`) and
   returns only `{ name, main, weather, wind, visibility, dt, timezone, sys: { country } }`.
4. `scripts/dev.mjs` serves an allow-list of static files plus the same handler on port 5180.
5. `vercel.json` adds a CSP (`default-src 'self'`, Google Fonts allowed, inline scripts
   allowed), `nosniff` and a referrer policy.

Locally, `.env.local` does not exist, so every live search returns 503 `SERVICE_NOT_CONFIGURED`
(screenshot `before/states/unconfigured-390.png`). Success states were driven by mocking
`/api/weather` with `page.route`.

## Scores

| Area | Before | After |
|------|:------:|:-----:|
| Visual design & consistency | 5 | 8 |
| UX & navigation | 6 | 8 |
| Responsiveness / mobile | 6 | 8 |
| Accessibility | 5 | 8 |
| Performance | 5 | 8 |
| Code quality & structure | 6 | 7 |
| SEO basics | 5 | 6 |
| Security (report only) | 5 | 5 (unchanged; see below) |

The after scores are self-assessed from `docs/redesign-screenshots/after/` (17 states at 390 and
1440 px, plus 1024 px spot checks), the passing `npm test` run and a keyboard walk. No
independent design review or automated a11y scanner was run.

### Visual design & consistency: 5/10

- The look lands in a familiar AI-generated cluster: near-black olive ground, one neon lime
  accent, an italic display serif ("your day.", "A new perspective.") and tiny tracked monospace
  caps. Nothing in it says *weather*. The condition shows only as a 125 px outline icon and a 7 px
  label (`style.css:68`).
- The type scale has no floor. Labels that carry real information are set at 7 px
  (`#weather-state-label`, `.details-heading>span`, `style.css:68,90`), 8 px (observation time,
  `style.css:76`) and 9 px (`.header-note`, metric hints, footer, `style.css:27,99,106`).
- The condition photo behind the stage is shown at 8% opacity (`style.css:60`), which is
  practically invisible (`before/states/rain-1440.png`).
- Decorative arrows look like links but do nothing (`index.html:63`, the stage footer arrow).
- Before a search, the details grid is four large em dashes (`before/home-1440.png`).
- In light mode the lime button sits on a cream ground at 1.11:1, so it barely reads as a shape
  (`before/states/clear-day-light-1440.png`).

### UX & navigation: 6/10

- Good: one clear task, quick cities, errors that keep earlier results, a polite status line.
- The answer is not first. On desktop the eyebrow, the 70 px headline and the tagline take the
  top 370 px before the search field (`before/home-1440.png`). On phones the result starts about
  475 px down (`before/states/clear-day-390.png`).
- Refresh sits at the bottom right of the page (`index.html:75`), far from the timestamp it
  updates. The °C/°F switch is tucked at the far end of the quick-city row.
- After a failed search the old city stays on screen with nothing marking it as stale; only a
  sentence in the status line says so (`before/states/not-found-after-success-1440.png`).
- Descriptions are title-cased per word ("Thunderstorm With Heavy Rain And Strong Gusts",
  `style.css:85`).
- The native search-clear button renders unstyled (a white "×", `before/states/clear-day-1440.png`).
- The theme defaults to dark and ignores the OS colour-scheme preference (`index.html:2,9`).

### Responsiveness / mobile: 6/10

- No horizontal overflow at 390 or 1440, and there are breakpoints at 1050, 767 and 360 px
  (`style.css:109–111`).
- Touch targets are small: unit buttons are 38×32 px (`style.css:54`), quick-city buttons 36 px
  tall with 10 px text (`style.css:50`).
- Long names break mid-word ("…gogoc / h", `before/states/worst-case-390.png`) because of
  `overflow-wrap:anywhere` (`style.css:80`).
- The intro paragraph is hidden on phones (`style.css:110`), so mobile users lose content.
- Each breakpoint is written as one 600-character line, so responsive fixes are hard to make
  safely.

### Accessibility: 5/10

- Good: skip link, labelled input, `role="status"` live region, `aria-pressed` units,
  `aria-busy`, focus-visible outlines and a reduced-motion rule.
- Text at 7–9 px (see above) is unreadable for low-vision users and on small phones.
- The search field border is 1.63:1 against the page (`--line #3a4133` on `#181c17`), which fails
  WCAG 1.4.11 non-text contrast (3:1). The light-mode placeholder is 4.32:1 on its field
  (`#68725d` on `#edeee5`), which fails 1.4.3.
- Unicode "↗" glyphs inside buttons and links become part of their names (`index.html:50,75,77`),
  so a screen reader says "Debrecen north east arrow".
- The brand link's accessible name is "weatherby a/d." (`index.html:34`, missing space).
- `<p>` elements inside `<dl>` groups are invalid markup (`index.html:68–71`).
- External links open a new tab with no warning (`index.html:77`).
- The only visible label for the search field is its placeholder (`index.html:45`).

### Performance: 5/10

- Every successful search loads a 1536×1024 PNG of 2.0–2.4 MB (`pictures/*.png`) to show at 8%
  opacity. That is about 2 MB per condition change and 11 MB if a visitor sees all five.
  `pictures/deafult.png` (1.8 MB, misspelt) is never referenced.
- Render-blocking Google Fonts CSS loads two families and six styles (`index.html:13`).
- The rest is lean: 9.6 KB JS, 12 KB CSS, no frameworks and no third-party scripts.

### Code quality & structure: 6/10

- Good: 16 passing tests cover proxy validation, upstream errors, timeouts, request races, units,
  theme, blocked storage and malformed data. Request handling uses `AbortController` and a
  request id so the latest search wins.
- The condition ranges are duplicated in `getBackground` and `getConditionIcon`
  (`index.js:175–189`). Temperature conversion is duplicated (`index.js:128–131` vs `148`).
- Theme colours are hard-coded in JS and repeated from CSS (`index.js:25`).
- The CSS is written as long single-line rules and one-line media queries with many magic pixel
  values. The HTML search row is a single 400-character line (`index.html:50`).
- Dead asset (`deafult.png`) and a stale `.vite/` cache folder (ignored by git).

### SEO basics: 5/10

- Title, meta description, `lang="en"` and a single H1 are present.
- Missing: Open Graph and Twitter card tags, a `color-scheme` meta, a canonical URL and a social
  preview image. The production URL isn't in the repo, so the canonical link and image remain
  the owner's to add.

### Security (report only; nothing was changed): 5/10

- Good: the key moved to the server, strict query validation, a fixed upstream URL, no upstream
  error text forwarded, a timeout, GET-only, the dev-server allow-list, and a CSP with `nosniff`.
- 🔴 **An OpenWeather API key is committed in `index.js`** in every commit from `ffac3d0`
  (2026-04-07) to `4fc9d34`, the current `main` and `origin/main`. It is public on GitHub now.
  Removing it from the working tree does not help, so **revoke the key in the OpenWeather account
  and issue a new one**, as the README's "Exposed key follow-up" says. Rewriting history is
  optional once the key is revoked.
- 🟠 The CSP keeps `script-src 'unsafe-inline'` only for the one-line theme script in `<head>`.
  A `sha256-…` hash for that script would allow removing `'unsafe-inline'`.
- 🟠 The public proxy has no rate limiting, so anyone can spend the API quota (the README
  acknowledges this). Consider Vercel firewall rate limits or a per-IP limit.
- 🟡 With `"framework": null` and no output directory, Vercel serves every repository file as
  static content (`tests/`, `scripts/`, `README.md`, `.env.example`, these docs). None contain
  secrets, but a `.vercelignore` or a `public/` output directory would narrow what is exposed.
- 🟡 No explicit `Permissions-Policy` or `Strict-Transport-Security` header (Vercel adds HSTS on
  its own domains).

## Top 10 problems, ranked by impact

1. **The micro-typography is unreadable.** Condition, observation time, panel state, hints and
   the footer are set at 7–10 px. These are the details people need, and they fail on every
   phone and for every low-vision reader.
2. **A 2 MB photo loads on every search for almost no visible effect** (8% opacity). On mobile
   data that is real time and money for nothing.
3. **The answer is not first.** Marketing copy fills the top of the page, and before a search
   the result area is decorative. A weather check should put the search and the conditions in
   the first glance, especially on a phone.
4. **The search field and controls have low contrast** (1.63:1 border, 4.32:1 light
   placeholder). People can't see where to type, and it fails WCAG 1.4.11 and 1.4.3.
5. **Touch targets are under 44 px** (units 38×32 px, quick cities 36 px with 10 px text). That
   causes mis-taps on the main mobile controls.
6. **Screen-reader noise and invalid markup:** "↗" read aloud in names, "weatherby a/d.",
   `<p>` inside `<dl>`, and new tabs without warning. It degrades the experience for exactly the
   users the existing ARIA work was meant to serve.
7. **A stale result is ambiguous.** After a failed search the previous city looks current. That
   misleads anyone who doesn't read the status sentence.
8. **The condition isn't communicated visually.** Clear, rain and snow look nearly identical
   (same olive panel, small outline icon), so the page doesn't do the one thing a weather glance
   is for.
9. **The OS colour scheme is ignored.** Everyone gets dark mode first, including people who set
   their phone to light.
10. **Maintainability.** Duplicated condition logic, one-line media queries, colours repeated in
    JS and CSS, and a dead 1.8 MB asset make every future change riskier.

## Redesign direction

**A public-information sign for the sky.** This follows the 1970s Ulm-school wayfinding
tradition: strict grid, solid pictograms, colours that each mean exactly one thing. The result
panel takes the code colour of the current condition: clear orange, cloud silver, mist sage,
rain blue, storm violet, snow ice or night blue. A seven-colour code bar under the navy header
band widens the current condition's segment. Before a search, the panel shows the pictogram
key, so the colour code teaches itself. There is one type family (Archivo, using its width
axis), the minimum size is 13 px, and the temperature is set at 6 rem.

What changed against the top 10:

1. No text under 13 px.
2. The photos are no longer loaded. The condition is colour plus pictogram, about 2 MB less per
   search.
3. Desktop is three columns (search, plate, details) and fits one 1440×900 viewport. On phones
   the plate scrolls into view after a search.
4. Control borders are at least 3:1 and every text pair at least 4.5:1. On the coloured plates,
   text measures 5.4–12.6:1.
5. Every target is at least 44 px.
6. Clean accessible names, valid `<dl>`, and new-tab links are announced.
7. A failed search stamps "Previous result" and a dashed border on the old panel.
8. Each condition looks distinct.
9. The theme follows the OS until the visitor chooses.
10. One condition table, shared conversion helpers, readable CSS with tokens.

Constraints kept: same stack, no new static files, no new origins (Google Fonts only), and the
API and `scripts/dev.mjs` untouched. `tests/ui.test.js` changed only in three presentation
assertions (sentence case, new `theme-color` values).

Not done: no independent finish review, no generated DESIGN.md, and no automated axe or
Lighthouse run. `pictures/*.png` (12.8 MB) stay in the repository unused. The owner can delete
them.
