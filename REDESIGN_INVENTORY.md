# Redesign inventory

This is the contract for the redesign. It lists everything a visitor could see or do on the site
before the redesign (baseline commit `04d4730`). The redesign must keep every item, or the
**Verified** column must explain the change.

Baseline screenshots: `docs/redesign-screenshots/before/` (kept out of git). They cover the default
page at 390 and 1440 px plus 15 states per width in `before/states/`, driven with a mocked
`/api/weather`.

How this was verified: `../.claude/tools/weather-verify.mjs` drives the running page with a mocked `/api/weather` and checks 72 items (112 assertions) against the copy, attributes and behaviour listed here: **72/72 pass**. Items it doesn't exercise in the browser (M3 timeout, B1 request races, B2 malformed data, B9 blocked storage) are covered by `npm test` (16/16 pass). R2/R3: `git diff 04d4730 -- api scripts vercel.json package.json` is empty. States X1–X10 were checked in `docs/redesign-screenshots/after/states/`.

Status key: ✅ present and working in the redesign · ♻️ present, deliberately reworked (see note)
· ❌ missing

## 1. Routes and endpoints

| # | Item | Verified |
|---|------|----------|
| R1 | `/`: the only page (`index.html`) | ✅ |
| R2 | `GET /api/weather?q=<city>` same-origin proxy. The JSON response, status codes and error codes stay unchanged (`api/weather.js` untouched) | ✅ |
| R3 | Dev server (`scripts/dev.mjs`) serves only `index.html`, `index.js`, `style.css`, `favicon.svg`, `pictures/*.png` and returns 404 for anything else | ✅ (file untouched; the redesign adds no new static files) |

## 2. Document head

| # | Item | Verified |
|---|------|----------|
| H1 | Title "Weather — A clearer view of your day" | ✅ |
| H2 | Meta description "A considered little weather app. Find current conditions, temperature, humidity and wind for cities around the world." | ✅ |
| H3 | `theme-color` meta that follows the theme | ✅ (new values match the new palette) |
| H4 | Favicon `favicon.svg` (sun mark) | ♻️ same sun mark, recoloured to the new palette |
| H5 | Inline pre-paint theme script (no flash of the wrong theme) | ✅ (now also follows the OS colour scheme when nothing is stored) |
| H6 | Web fonts from Google Fonts (Manrope, Instrument Serif) | ♻️ replaced by one variable family (Archivo) from the same CSP-allowed origin |

## 3. Header

| # | Item | Verified |
|---|------|----------|
| N1 | Skip link "Skip to weather search" → `#main` | ✅ |
| N2 | Brand link to `./`: sun icon, "weather", "by a/d." | ✅ |
| N3 | Tagline "A little perspective on the outside." (shown from tablet width up) | ✅ |
| N4 | Theme toggle: icon button, label and title "Switch to light mode" / "Switch to dark mode", sun or moon icon | ✅ |

## 4. Intro

| # | Item | Verified |
|---|------|----------|
| T1 | Eyebrow "Look up. Step out." | ♻️ kept as the opening sentence of the intro line, because eyebrow labels are dropped from the new type system |
| T2 | H1 "A clearer view of your day." | ✅ |
| T3 | "Wherever you're headed, start with the weather." (hidden on phones before) | ✅ (now shown at every width) |

## 5. Search

| # | Item | Verified |
|---|------|----------|
| S1 | Label "City name" (visually hidden before) | ♻️ now visible |
| S2 | Search input: placeholder "Search a city, anywhere…", max 100 characters, autocomplete off | ✅ |
| S3 | Submit button "Find weather" (text hidden visually on phones before); shows "Looking up…" and is disabled while loading | ✅ |
| S4 | Enter key submits | ✅ |
| S5 | Helper text "Try somewhere familiar" (linked with `aria-describedby`) | ✅ |
| S6 | Quick cities Debrecen (`Debrecen,HU`), Budapest (`Budapest,HU`), London (`London,GB`). Each fills the input with the bare city name and searches with the country code | ✅ |
| S7 | Unit group "Temperature unit": °C (Celsius) / °F (Fahrenheit) with `aria-pressed`, remembered in `localStorage` (`weather-unit`) | ✅ (moved to the header beside the theme toggle) |
| S8 | Status line (`role="status"`, polite live region) for progress, success and errors | ✅ |
| S9 | Empty or blank query → "Enter a city name to find its weather.", input marked `aria-invalid` and focused, no request sent | ✅ |
| S10 | Typing clears the invalid mark and any error message | ✅ |

### Status messages (exact copy, unchanged)

| # | Message | Verified |
|---|---------|----------|
| M1 | "Checking the sky over {city}…" | ✅ |
| M2 | "Current weather loaded for {name}." | ✅ |
| M3 | "The weather service took too long. Please try again." (15 s client timeout) | ✅ |
| M4 | "Couldn't connect to the weather service. Check your connection and try again." | ✅ |
| M5 | "The weather service returned incomplete data. Please try again." | ✅ |
| M6 | "Weather search is not configured on this host. Please try again after the service is connected." (404 without JSON) | ✅ |
| M7 | "The weather service isn't configured correctly. Please try again later." (503 `SERVICE_NOT_CONFIGURED`, 401, 403) | ✅ |
| M8 | "We couldn't find that city. Check the spelling, or add a country code (for example, Paris, FR)." | ✅ |
| M9 | "The weather service is busy. Please wait a moment and try again." (429) | ✅ |
| M10 | "The weather service is unavailable right now. Please try again shortly." | ✅ |
| M11 | Suffix " Previous results are still shown below." when an earlier result is on screen | ✅ |

## 6. Current conditions panel

| # | Item | Verified |
|---|------|----------|
| C1 | Panel label "Current conditions" | ♻️ moved from above the city name into the caption strip at the foot of the panel ("Current conditions · Clear") |
| C2 | State label: "Your world, at a glance" before a search, then the condition group (for example "Clear") | ♻️ same text, now in the caption strip next to C1 |
| C3 | Empty state: "A new place. A new perspective.", "Search for a city to see what's happening outside.", sun illustration | ♻️ copy kept; the single sun became a key of the condition pictograms |
| C4 | Pin icon + city name (H2) + country code | ✅ |
| C5 | Temperature, rounded, with a °C/°F unit | ✅ |
| C6 | Condition icon: sun, moon (clear at night), cloud, rain, snow, mist | ♻️ redrawn as one pictogram set; adds sun-and-cloud, moon-and-cloud and thunderstorm variants for accuracy |
| C7 | Description, for example "clear sky" (shown title-cased before) | ✅ (sentence case) |
| C8 | Low and High temperatures | ✅ (plus a range bar marking where the current temperature sits) |
| C9 | Footer line: "The sky has a story. Find yours." before a search, then "Observed at HH:MM · city local time", or "Current weather observation" when the time is missing | ✅ (sentence case instead of all caps) |
| C10 | Condition-driven look (`data-weather`: sunny, cloudy, rainy, snowy, foggy, default) shown as a background photo at 8% opacity | ♻️ the condition now sets the whole panel colour; the 2 MB photos are no longer loaded (files stay in `pictures/`) |
| C11 | Decorative arrow icon in the panel footer | ♻️ removed: it looked like a link but did nothing. The Refresh button sits there now |

## 7. Details

| # | Item | Verified |
|---|------|----------|
| D1 | H2 "The finer details" | ✅ |
| D2 | State label "Waiting for a city" → "Current observations" | ✅ |
| D3 | Feels like (°C/°F), hint "How it feels outside" | ✅ |
| D4 | Humidity (%), hint "Moisture in the air" | ✅ |
| D5 | Wind speed (km/h or mph), hint "At ground level" → "From the {N…NW}" | ✅ (plus an arrow showing the wind direction) |
| D6 | Visibility (km or mi), hint "How far you can see" | ✅ |
| D7 | "—" for any value the service did not return | ✅ |

## 8. Data note and footer

| # | Item | Verified |
|---|------|----------|
| F1 | "A snapshot of right now." + "Current observations from OpenWeather. Conditions can change between updates." | ✅ |
| F2 | "Refresh weather" button: hidden until the first success, then repeats the last successful query | ✅ (moved next to the observation time) |
| F3 | "Made for the everyday explorer." | ✅ |
| F4 | "Source code" → https://github.com/AdamDruszad/Weather-App (new tab, `noopener noreferrer`) | ✅ |
| F5 | "An Adam Biró project" → https://portfolio-orpin-eight-240etcohnd.vercel.app/ (new tab, `noopener noreferrer`) | ✅ |

## 9. Behaviour

| # | Item | Verified |
|---|------|----------|
| B1 | The latest request wins: a new search aborts the one in flight, and late responses are ignored | ✅ |
| B2 | Client checks the response shape; malformed data never replaces a good result | ✅ |
| B3 | Errors keep the previous result on screen | ✅ (now also marked on the panel itself) |
| B4 | Switching units re-renders without a new request | ✅ |
| B5 | Unit conversion: °F, mph (m/s × 2.23694), miles (m ÷ 1609.344), km/h (m/s × 3.6), km | ✅ |
| B6 | Wind direction on an 8-point compass ("From the E") | ✅ |
| B7 | Observation time shown in the city's local time (dt + timezone, formatted en-GB as HH:MM) | ✅ |
| B8 | Theme toggle remembered in `localStorage` (`weather-theme`) and updates `theme-color` | ✅ |
| B9 | Works when `localStorage` is blocked (defaults: dark theme, °C) | ✅ |
| B10 | `aria-busy` on `#weather` while loading | ✅ |
| B11 | Reduced-motion users get no transitions or animations | ✅ |
| B12 | Focus-visible outlines on every control | ✅ |

## 10. States

| # | State | Verified |
|---|-------|----------|
| X1 | Empty (first load) | ✅ |
| X2 | Validation error (blank search) | ✅ |
| X3 | Loading | ✅ (adds a progress line and dims the values) |
| X4 | Success, for each condition: clear day, clear night, clouds, rain, snow, mist/fog (thunderstorm shown as rain before) | ✅ |
| X5 | Success in °F | ✅ |
| X6 | Error without a previous result | ✅ |
| X7 | Error with a previous result | ✅ |
| X8 | Service not configured (the real local state without `.env.local`) | ✅ |
| X9 | Light and dark theme | ✅ |
| X10 | Very long city name and condition text | ✅ (wraps inside the panel with no page overflow; a 58-letter single word still breaks mid-word) |
