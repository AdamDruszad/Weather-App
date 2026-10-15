# Weather

A responsive current-weather app with city search, Celsius/Fahrenheit, saved dark/light mode, current observations and recoverable error states. Built with browser JavaScript and CSS; no production package dependencies.

## Run locally

Use Node.js 24.15 or newer in the Node 24 release line (all supported versions are listed in `package.json`).

1. Copy `.env.example` to `.env.local`.
2. Set `OPENWEATHER_API_KEY` to your own newly issued OpenWeather key. This file is ignored by Git.
3. Run `npm ci`, then `npm run dev`.
4. Open `http://127.0.0.1:5180`.

The page renders without a key, but searches report that the service is not configured. Never put the key in HTML, browser JavaScript or a public environment variable.

## Hosting

Deploy the repository to Vercel with the **Other** framework preset and no build command. Add `OPENWEATHER_API_KEY` as a server environment variable for the intended environments, then deploy. `api/weather.js` runs as a Node.js function. See [Vercel Node.js Functions](https://vercel.com/docs/functions/runtimes/node-js) and [environment variables](https://vercel.com/docs/environment-variables).

The browser calls `/api/weather?q=Budapest,HU`; the server contacts a fixed OpenWeather endpoint with an eight-second timeout. Successful responses can be cached for five minutes at the CDN; failed responses are not cached. Error responses do not include provider URLs or credentials. The public proxy still consumes API quota, so configure hosting rate limits and provider usage alerts appropriate to the deployment.

**GitHub Pages cannot run this server endpoint.** The old Pages address can show the static page, but weather search requires hosting the app together with the proxy, or separately configuring a trusted API host. The UI reports a missing service instead of exposing a browser-side key.

## Exposed key follow-up

An API key was previously committed in `index.js` and included in public browser code. Removing it from current source does not remove it from Git history or deployed versions. Revoke that old key in the OpenWeather account, issue a replacement, and configure it only on the server. No key rotation, account change, history rewrite or deployment is performed by these code changes.

## Validation

```bash
npm test
```

Tests cover server validation, upstream failures and timeout, secret-safe responses, client request races, weather/units, theme/storage, missing observations and error recovery. UI tests use simulated responses, not live paid API calls. Browser/device visual checks remain separate.
