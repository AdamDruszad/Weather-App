import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import { JSDOM } from 'jsdom';
const root = new URL('../', import.meta.url);
const html = fs.readFileSync(new URL('index.html', root), 'utf8');
const script = fs.readFileSync(new URL('index.js', root), 'utf8');
const payload = (name = 'Budapest', extra = {}) => ({ name, main: { temp: 20, feels_like: 19, temp_min: 16, temp_max: 23, humidity: 55 }, sys: { country: 'HU' }, weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01d' }], wind: { speed: 5, deg: 90 }, visibility: 10000, dt: 1727712000, timezone: 7200, ...extra });
const tick = () => new Promise(resolve => setImmediate(resolve));
function setup(preferences = {}, denyStorage = false) {
  const dom = new JSDOM(html, { url: 'http://localhost/', runScripts: 'outside-only' });
  const w = dom.window;
  for (const [key, value] of Object.entries(preferences)) w.localStorage.setItem(key, value);
  if (denyStorage) Object.defineProperty(w, 'localStorage', { get() { throw new Error('Blocked storage'); } });
  w.eval(w.document.querySelector('script:not([src])').textContent);
  const calls = [];
  const timeouts = new Map();
  let timerId = 100;
  w.setTimeout = (fn) => { const id = ++timerId; timeouts.set(id, fn); return id; };
  w.clearTimeout = id => timeouts.delete(id);
  w.fetch = (url, options) => new Promise((resolve, reject) => { calls.push({ url, options, resolve: (data, status = 200) => resolve({ ok: status >= 200 && status < 300, status, json: async () => data }), reject }); });
  w.eval(script);
  return { w, dom, calls, timeouts, el: id => w.document.getElementById(id), search: name => w.searchWeather(name) };
}
const run = test;

  await run('empty search and correction', async () => {
    const t = setup(); await t.search('   ');
    assert.equal(t.calls.length, 0); assert.equal(t.el('city').getAttribute('aria-invalid'), 'true'); assert.match(t.el('search-status').textContent, /Enter a city/);
    t.el('city').dispatchEvent(new t.w.Event('input')); assert.equal(t.el('city').hasAttribute('aria-invalid'), false); assert.equal(t.el('search-status').textContent, ''); t.dom.window.close();
  });
  await run('success, metric units, timestamp and refresh', async () => {
    const t = setup(); const pending = t.search('Budapest,HU');
    assert.equal(t.el('search-button').disabled, true); assert.equal(t.el('weather').getAttribute('aria-busy'), 'true');
    assert.equal(t.calls[0].url.searchParams.get('q'), 'Budapest,HU'); assert.equal(t.calls[0].url.pathname, '/api/weather'); assert.equal(t.calls[0].url.searchParams.has('appid'), false);
    t.calls[0].resolve(payload()); await pending;
    assert.equal(t.el('city-name').textContent, 'Budapest'); assert.equal(t.el('temperature').textContent, '20°C'); assert.equal(t.el('feels-like').textContent, '19°C'); assert.equal(t.el('wind-speed').textContent, '18.0 km/h'); assert.equal(t.el('wind-direction').textContent, 'From the E'); assert.equal(t.el('visibility').textContent, '10.0 km'); assert.match(t.el('observation-time').textContent, /^Observed at \d{2}:\d{2} · city local time$/);
    assert.equal(t.el('empty-state').hidden, true); assert.equal(t.el('weather-result').hidden, false); assert.equal(t.el('refresh-button').hidden, false); assert.equal(t.el('search-button').disabled, false); assert.equal(t.el('weather').getAttribute('aria-busy'), 'false'); assert.equal(t.timeouts.size, 0);
    t.w.document.querySelector('[data-unit="f"]').click();
    assert.equal(t.el('temperature').textContent, '68°F'); assert.equal(t.el('feels-like').textContent, '66°F'); assert.equal(t.el('temp-low').textContent, '61°F'); assert.equal(t.el('temp-high').textContent, '73°F'); assert.equal(t.el('wind-speed').textContent, '11.2 mph'); assert.equal(t.el('visibility').textContent, '6.2 mi'); assert.equal(t.w.localStorage.getItem('weather-unit'), 'f'); assert.equal(t.calls.length, 1);
    t.el('refresh-button').click(); assert.equal(t.calls.length, 2); assert.equal(t.calls[1].url.searchParams.get('q'), 'Budapest,HU'); t.calls[1].resolve(payload()); await tick(); t.dom.window.close();
  });
  await run('form and quick-city buttons', async () => {
    const t = setup(); t.el('city').value = 'Paris,FR'; t.w.document.querySelector('form').dispatchEvent(new t.w.Event('submit', { cancelable: true })); assert.equal(t.calls[0].url.searchParams.get('q'), 'Paris,FR'); t.calls[0].resolve(payload('Paris')); await tick();
    t.w.document.querySelector('[data-city="London,GB"]').click(); assert.equal(t.calls[1].url.searchParams.get('q'), 'London,GB'); assert.equal(t.el('city').value, 'London'); t.calls[1].resolve(payload('London')); await tick(); t.dom.window.close();
  });
  await run('HTTP errors preserve previous results', async () => {
    const t = setup(); const initial = t.search('Budapest'); t.calls[0].resolve(payload()); await initial;
    const errors = [[404, /couldn't find/], [401, /configured/], [403, /configured/], [429, /busy/], [500, /unavailable/]];
    for (const [code, expected] of errors) { const pending = t.search('Unknown'); t.calls.at(-1).resolve({}, code); await pending; assert.match(t.el('search-status').textContent, expected); assert.match(t.el('search-status').textContent, /Previous results/); assert.equal(t.el('city-name').textContent, 'Budapest'); assert.equal(t.el('search-button').disabled, false); } t.dom.window.close();
  });
  await run('network failure and timeout', async () => {
    const t = setup(); let pending = t.search('Paris'); t.calls[0].reject(new t.w.TypeError('Network failed')); await pending; assert.match(t.el('search-status').textContent, /Check your connection/);
    pending = t.search('Paris'); t.calls[1].options.signal.addEventListener('abort', () => t.calls[1].reject(new t.w.DOMException('Aborted', 'AbortError'))); [...t.timeouts.values()][0](); await pending; assert.match(t.el('search-status').textContent, /took too long/); assert.equal(t.el('search-button').disabled, false); assert.equal(t.timeouts.size, 0); t.dom.window.close();
  });
  await run('latest request wins despite late results and failures', async () => {
    const t = setup(); const old = t.search('Paris'); const latest = t.search('Budapest'); assert.equal(t.calls[0].options.signal.aborted, true); t.calls[1].resolve(payload()); await latest; t.calls[0].resolve(payload('Paris')); await old; assert.equal(t.el('city-name').textContent, 'Budapest'); assert.match(t.el('search-status').textContent, /loaded for Budapest/);
    const a = t.search('London'); const b = t.search('Debrecen'); t.calls[2].reject(new t.w.DOMException('Aborted', 'AbortError')); await a; assert.equal(t.el('search-button').disabled, true); assert.match(t.el('search-status').textContent, /Debrecen/); t.calls[3].resolve(payload('Debrecen')); await b; assert.equal(t.el('city-name').textContent, 'Debrecen'); assert.equal(t.timeouts.size, 0); t.dom.window.close();
  });
  await run('theme and unit preferences, including denied storage', async () => {
    for (const blocked of [false, true]) { const t = setup({ 'weather-theme': 'light', 'weather-unit': 'f' }, blocked); assert.equal(t.w.document.documentElement.dataset.theme, blocked ? 'dark' : 'light'); assert.equal(t.el('theme-toggle').getAttribute('aria-label'), blocked ? 'Switch to light mode' : 'Switch to dark mode'); t.el('theme-toggle').click(); assert.equal(t.w.document.documentElement.dataset.theme, blocked ? 'light' : 'dark'); assert.equal(t.el('theme-icon').getAttribute('href'), blocked ? '#moon' : '#sun'); assert.equal(t.w.document.querySelector('meta[name="theme-color"]').content, blocked ? '#14263a' : '#08111a'); if (!blocked) { assert.equal(t.w.localStorage.getItem('weather-theme'), 'dark'); assert.equal(t.w.document.querySelector('[data-unit="f"]').getAttribute('aria-pressed'), 'true'); } t.dom.window.close(); }
  });
  await run('optional observations and night icon', async () => {
    const t = setup(); const pending = t.search('Budapest'); t.calls[0].resolve(payload('Budapest', { main: { temp: 0 }, wind: {}, visibility: null, sys: {}, dt: null, weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: '01n' }] })); await pending; assert.equal(t.el('temperature').textContent, '0°C'); assert.equal(t.el('humidity').textContent, '—'); assert.equal(t.el('wind-speed').textContent, '—'); assert.equal(t.el('visibility').textContent, '—'); assert.equal(t.el('condition-icon').getAttribute('href'), '#moon'); assert.equal(t.el('observation-time').textContent, 'Current weather observation'); t.dom.window.close();
  });
  await run('invalid JSON produces a useful service error', async () => { const t = setup(); t.w.fetch = async () => ({ ok: true, status: 200, json: async () => { throw new t.w.SyntaxError('Unexpected token'); } }); await t.search('Budapest'); assert.match(t.el('search-status').textContent, /incomplete data/); assert.equal(t.el('weather-result').hidden, true); assert.equal(t.el('search-button').disabled, false); t.dom.window.close(); });
  await run('malformed data does not replace good results', async () => {
    const t = setup(); const initial = t.search('Budapest'); t.calls[0].resolve(payload()); await initial;
    for (const data of [null, {}, payload('Broken', { weather: [{}] }), payload('Broken', { weather: [{ id: 800, main: 'Clear', description: 'clear sky', icon: null }] })]) {
      const pending = t.search('Broken'); t.calls.at(-1).resolve(data); await pending; assert.match(t.el('search-status').textContent, /incomplete data/); assert.equal(t.el('city-name').textContent, 'Budapest'); assert.equal(t.el('temperature').textContent, '20°C');
    } t.dom.window.close();
  });



