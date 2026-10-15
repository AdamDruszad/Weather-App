// The browser calls this same-origin endpoint; the provider key stays on the server.
export async function getWeatherResponse(requestUrl, {
  apiKey = process.env.OPENWEATHER_API_KEY,
  fetchWeather = globalThis.fetch,
  timeoutMs = 8000,
} = {}) {
  const city = new URL(requestUrl, "http://localhost").searchParams.get("q")?.trim();
  const error = (status, code) => ({ status, body: { code } });
  if (!city || city.length > 100 || /[\u0000-\u001f\u007f]/u.test(city)) return error(400, "INVALID_CITY");
  if (!apiKey?.trim()) return error(503, "SERVICE_NOT_CONFIGURED");

  const url = new URL("https://api.openweathermap.org/data/2.5/weather");
  url.search = new URLSearchParams({ q: city, appid: apiKey, units: "metric", lang: "en" });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchWeather(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (response.status === 404) return error(404, "CITY_NOT_FOUND");
    if (response.status === 401 || response.status === 403) return error(503, "SERVICE_NOT_CONFIGURED");
    if (response.status === 429) return error(429, "RATE_LIMITED");
    if (!response.ok) return error(502, "UPSTREAM_UNAVAILABLE");
    const data = await response.json();
    if (typeof data?.name !== "string" || !data.name.trim() || !Number.isFinite(data?.main?.temp)
      || !Number.isFinite(data?.weather?.[0]?.id) || typeof data.weather[0].main !== "string"
      || typeof data.weather[0].description !== "string") return error(502, "INVALID_WEATHER_DATA");
    // Return only observations needed by the page, never provider errors or URLs.
    const { name, main, weather, wind, visibility, dt, timezone } = data;
    return { status: 200, body: { name, main, weather, wind, visibility, dt, timezone, sys: { country: data.sys?.country } } };
  } catch {
    return error(controller.signal.aborted ? 504 : 502, "UPSTREAM_UNAVAILABLE");
  } finally {
    clearTimeout(timeout);
  }
}

export default async function handler(request, response) {
  response.setHeader("Content-Type", "application/json; charset=utf-8");
  response.setHeader("X-Content-Type-Options", "nosniff");
  response.setHeader("Cache-Control", "no-store");
  if (request.method !== "GET") {
    response.setHeader("Allow", "GET");
    response.statusCode = 405;
    response.end(JSON.stringify({ code: "METHOD_NOT_ALLOWED" }));
    return;
  }
  const result = await getWeatherResponse(request.url);
  response.statusCode = result.status;
  if (result.status === 200) response.setHeader("Cache-Control", "public, max-age=60, s-maxage=300, stale-while-revalidate=60");
  response.end(JSON.stringify(result.body));
}
