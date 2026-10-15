import test from "node:test";
import assert from "node:assert/strict";
import handler, { getWeatherResponse } from "../api/weather.js";

const fixture = { name: "Budapest", main: { temp: 20 }, weather: [{ id: 800, main: "Clear", description: "clear sky" }], sys: { country: "HU", internal: "not-needed" }, extra: "not-needed" };
const options = (fetchWeather) => ({ apiKey: "test-only-placeholder", fetchWeather });

test("invalid city input and missing configuration never contact the provider", async () => {
  let calls = 0;
  const config = options(() => { calls++; throw new Error("Unexpected request"); });
  for (const city of ["", " ", "x".repeat(101), "Paris\nFR"]) {
    assert.equal((await getWeatherResponse(`/api/weather?q=${encodeURIComponent(city)}`, config)).status, 400);
  }
  assert.deepEqual(await getWeatherResponse("/api/weather?q=Budapest", { ...config, apiKey: "" }), { status: 503, body: { code: "SERVICE_NOT_CONFIGURED" } });
  assert.equal(calls, 0);
});

test("valid searches use a fixed HTTPS endpoint and only return observation fields", async () => {
  const result = await getWeatherResponse("/api/weather?q=Budapest%2CHU&appid=attacker&url=https://example.invalid", options(async (url, config) => {
    assert.equal(url.origin, "https://api.openweathermap.org");
    assert.equal(url.pathname, "/data/2.5/weather");
    assert.equal(url.searchParams.get("q"), "Budapest,HU");
    assert.equal(url.searchParams.get("appid"), "test-only-placeholder");
    assert.equal(url.searchParams.get("units"), "metric");
    assert.equal(url.searchParams.has("url"), false);
    assert.ok(config.signal);
    return { ok: true, status: 200, json: async () => fixture };
  }));
  assert.equal(result.status, 200);
  assert.equal(result.body.name, "Budapest");
  assert.deepEqual(result.body.sys, { country: "HU" });
  assert.equal("extra" in result.body, false);
  assert.equal(JSON.stringify(result).includes("test-only-placeholder"), false);
});

test("provider errors map to safe local errors without forwarding sensitive messages", async () => {
  for (const [upstream, local, code] of [[401, 503, "SERVICE_NOT_CONFIGURED"], [403, 503, "SERVICE_NOT_CONFIGURED"], [404, 404, "CITY_NOT_FOUND"], [429, 429, "RATE_LIMITED"], [500, 502, "UPSTREAM_UNAVAILABLE"]]) {
    const result = await getWeatherResponse("/?q=Paris", options(async () => ({ ok: false, status: upstream, json: async () => ({ message: "test-only-placeholder" }) })));
    assert.deepEqual(result, { status: local, body: { code } });
  }
});

test("malformed successful responses and JSON errors are recoverable", async () => {
  for (const data of [null, {}, { ...fixture, main: { temp: "20" } }, { ...fixture, weather: [] }]) {
    assert.equal((await getWeatherResponse("/?q=Paris", options(async () => ({ ok: true, json: async () => data })))).status, 502);
  }
  assert.equal((await getWeatherResponse("/?q=Paris", options(async () => ({ ok: true, json: async () => { throw new SyntaxError("Bad JSON"); } })))).status, 502);
});

test("network failures and timeouts return safe errors", async () => {
  const network = await getWeatherResponse("/?q=Paris", options(async () => { throw new Error("test-only-placeholder"); }));
  assert.deepEqual(network, { status: 502, body: { code: "UPSTREAM_UNAVAILABLE" } });
  const timeout = await getWeatherResponse("/?q=Paris", { ...options((_url, { signal }) => new Promise((_resolve, reject) => signal.addEventListener("abort", () => reject(new Error("Aborted"))))), timeoutMs: 5 });
  assert.deepEqual(timeout, { status: 504, body: { code: "UPSTREAM_UNAVAILABLE" } });
});

test("HTTP endpoint rejects unsupported methods and sends no-store security headers", async () => {
  const headers = {};
  let body;
  const response = { setHeader(name, value) { headers[name] = value; }, end(value) { body = value; } };
  await handler({ method: "POST", url: "/api/weather?q=Paris" }, response);
  assert.equal(response.statusCode, 405);
  assert.equal(headers.Allow, "GET");
  assert.equal(headers["Cache-Control"], "no-store");
  assert.equal(headers["X-Content-Type-Options"], "nosniff");
  assert.deepEqual(JSON.parse(body), { code: "METHOD_NOT_ALLOWED" });
});
