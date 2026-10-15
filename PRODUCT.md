# Product

<!-- impeccable:product-schema 1 -->

> Written during the autonomous redesign (October 2026) from the repository, README and the
> redesign brief. No owner interview took place. Lines marked *(inferred)* are reasoned from the
> code and copy, not confirmed by the owner.

## Platform

web

## Users

- People who want the current conditions for a city before heading out, usually on a phone,
  sometimes on a laptop at a desk. *(inferred from the copy "Wherever you're headed, start with
  the weather" and the mobile layout work)*
- Visitors to the author's portfolio judging the craft of the project (the footer links to the
  portfolio as "An Adam Biró project"). *(inferred)*
- The quick-city shortcuts (Debrecen, Budapest, London) suggest a Hungarian author and a partly
  Hungarian audience. *(inferred)*

## Product Purpose

A single-purpose current-weather page: type a city, or pick a suggested one, and see what it is
like there right now. Success is getting the answer at a glance, in the unit you prefer, with
clear recovery when something fails.

## Positioning

A small, carefully built page with no tracking, ads or third-party scripts. The OpenWeather key
stays on the server behind a same-origin proxy (`/api/weather`) with strict validation and a CSP.
It shows current observations only, deliberately without forecasts.

## Operating Context

- Deployed on Vercel as static files plus one Node function (`api/weather.js`); local
  development uses `scripts/dev.mjs` on port 5180.
- Data: OpenWeather "current weather" (`/data/2.5/weather`, metric units, English descriptions).

## Capabilities and Constraints

- City search by name, optionally with a country code (`Paris, FR`); max 100 characters.
- Three quick-city shortcuts: Debrecen, HU · Budapest, HU · London, GB.
- °C / °F toggle and dark / light theme, both remembered in `localStorage` (optional; the page
  works when storage is blocked).
- Shown per search: city and country code, temperature, condition description and icon (day and
  night for clear sky), low and high, feels-like, humidity, wind speed and the direction it blows
  from, visibility, and the observation time in the city's local time.
- Refresh repeats the last successful search. Errors keep the previous result on screen.
- The proxy also returns `main.pressure` and `wind.gust`, which the page does not show today.
- There is no forecast, geolocation, hourly data or search history.
- Technical: vanilla HTML/CSS/JS with no build step and no runtime dependencies. The CSP in
  `vercel.json` allows only same-origin assets plus Google Fonts. The dev server only serves
  `index.html`, `index.js`, `style.css`, `favicon.svg` and `pictures/*.png`. The API contract and
  `scripts/dev.mjs` are fixed. `tests/ui.test.js` relies on element ids, `data-*` hooks and
  status wording.

## Brand Commitments

- Name: "weather", signed "by a/d." The favicon is a sun mark.
- Voice: calm, short, a little poetic. "A clearer view of your day.", "Look up. Step out.", "Made
  for the everyday explorer."
- Links: source code on GitHub (AdamDruszad/Weather-App) and the author's portfolio.

## Evidence on Hand

- `pictures/`: six sky photographs (sunny, cloudy, rainy, snowy, foggy, plus an unused
  `deafult.png`), each 1536×1024 and about 2 MB.
- No testimonials, usage numbers or press exist, so none may be invented.

## Product Principles

1. The answer comes first: the conditions you searched for take priority over decoration.
2. Honest data: show a dash when a value is missing and never fabricate an observation.
3. The key never reaches the browser, and the page needs no third-party code to work.
4. Failure is recoverable: every error says what happened and what to do, and earlier results
   stay on screen.
5. Light enough to load fast on a phone.

## Accessibility & Inclusion

Target WCAG 2.2 AA. *(inferred from the existing skip link, live region, pressed states and
reduced-motion rule)*
