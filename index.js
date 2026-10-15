const weatherForm = document.querySelector("form.search");
const cityInput = document.getElementById("city");
const status = document.getElementById("search-status");
const searchButton = document.getElementById("search-button");
const weatherSection = document.getElementById("weather");
const plate = document.querySelector(".plate");
const codeBar = document.querySelector(".code-bar");
const refreshButton = document.getElementById("refresh-button");
// Mirrors --band in style.css so the browser chrome matches the header band.
const THEME_COLORS = { dark: "#1c3350", light: "#14263a" };
const COMPASS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
let currentWeather = null;
let lastCity = "";
let controller = null;
let requestId = 0;
let unit = readPreference("weather-unit") === "f" ? "f" : "c";

function readPreference(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}
function savePreference(key, value) {
  try { localStorage.setItem(key, value); } catch { /* Settings are optional. */ }
}

function updateTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const label = `Switch to ${theme === "dark" ? "light" : "dark"} mode`;
  const button = document.getElementById("theme-toggle");
  button.setAttribute("aria-label", label);
  button.title = label;
  document.getElementById("theme-icon").setAttribute("href", theme === "dark" ? "#sun" : "#moon");
  document.querySelector('meta[name="theme-color"]').content = THEME_COLORS[theme];
}
updateTheme(document.documentElement.dataset.theme === "light" ? "light" : "dark");
document.getElementById("theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  updateTheme(theme);
  savePreference("weather-theme", theme);
});
// Follow the OS colour scheme until the visitor picks a theme themselves.
window.matchMedia?.("(prefers-color-scheme: light)").addEventListener?.("change", event => {
  if (!readPreference("weather-theme")) updateTheme(event.matches ? "light" : "dark");
});

function updateUnitButtons() {
  document.querySelectorAll("[data-unit]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.unit === unit)));
}
updateUnitButtons();
document.querySelectorAll("[data-unit]").forEach(button => button.addEventListener("click", () => {
  unit = button.dataset.unit;
  savePreference("weather-unit", unit);
  updateUnitButtons();
  if (currentWeather) displayWeatherInfo(currentWeather);
}));

weatherForm.addEventListener("submit", event => {
  event.preventDefault();
  searchWeather(cityInput.value, { reveal: true });
});
document.querySelectorAll("[data-city]").forEach(button => button.addEventListener("click", () => {
  cityInput.value = button.dataset.city.split(",")[0];
  searchWeather(button.dataset.city, { reveal: true });
}));
refreshButton.addEventListener("click", () => searchWeather(lastCity));
cityInput.addEventListener("input", () => {
  cityInput.removeAttribute("aria-invalid");
  if (status.classList.contains("is-error")) { status.textContent = ""; status.classList.remove("is-error"); }
});

async function searchWeather(value, { reveal = false } = {}) {
  const city = value.trim();
  if (!city) {
    showError("Enter a city name to find its weather.");
    cityInput.setAttribute("aria-invalid", "true");
    cityInput.focus();
    return;
  }
  controller?.abort();
  controller = new AbortController();
  const thisController = controller;
  const thisRequest = ++requestId;
  const timeout = setTimeout(() => thisController.abort(), 15000);
  searchButton.disabled = true;
  searchButton.querySelector("span").textContent = "Looking up…";
  weatherSection.setAttribute("aria-busy", "true");
  status.classList.remove("is-error");
  status.textContent = `Checking the sky over ${city.split(",")[0]}…`;
  cityInput.removeAttribute("aria-invalid");
  try {
    const weatherData = await getWeatherData(city, thisController.signal);
    if (thisRequest !== requestId) return;
    const condition = weatherData?.weather?.[0];
    if (!Number.isFinite(weatherData?.main?.temp)
      || typeof weatherData?.name !== "string" || !weatherData.name.trim()
      || !Number.isFinite(condition?.id)
      || typeof condition?.main !== "string" || !condition.main.trim()
      || typeof condition?.description !== "string" || !condition.description.trim()
      || (condition.icon !== undefined && typeof condition.icon !== "string")) {
      throw new Error("The weather service returned incomplete data. Please try again.");
    }
    currentWeather = weatherData;
    lastCity = city;
    delete weatherSection.dataset.stale;
    displayWeatherInfo(weatherData);
    status.textContent = `Current weather loaded for ${weatherData.name}.`;
    refreshButton.hidden = false;
    if (reveal) revealResult();
  } catch (error) {
    if (thisRequest !== requestId) return;
    const message = error.name === "AbortError"
      ? "The weather service took too long. Please try again."
      : error instanceof TypeError
        ? "Couldn't connect to the weather service. Check your connection and try again."
        : error.message;
    if (currentWeather) weatherSection.dataset.stale = "true";
    showError(message + (currentWeather ? " Previous results are still shown below." : ""));
  } finally {
    clearTimeout(timeout);
    if (thisRequest === requestId) {
      searchButton.disabled = false;
      searchButton.querySelector("span").textContent = "Find weather";
      weatherSection.setAttribute("aria-busy", "false");
    }
  }
}

async function getWeatherData(city, signal) {
  const url = new URL("./api/weather", document.baseURI);
  url.searchParams.set("q", city);
  const response = await fetch(url, { signal });
  let data;
  try { data = await response.json(); }
  catch (error) {
    if (response.status === 404) throw new Error("Weather search is not configured on this host. Please try again after the service is connected.");
    if (error instanceof SyntaxError) throw new Error("The weather service returned incomplete data. Please try again.");
    throw error;
  }
  if (data?.code === "SERVICE_NOT_CONFIGURED") throw new Error("The weather service isn't configured correctly. Please try again later.");
  if (response.status === 404) throw new Error("We couldn't find that city. Check the spelling, or add a country code (for example, Paris, FR).");
  if (response.status === 401 || response.status === 403) throw new Error("The weather service isn't configured correctly. Please try again later.");
  if (response.status === 429) throw new Error("The weather service is busy. Please wait a moment and try again.");
  if (!response.ok) throw new Error("The weather service is unavailable right now. Please try again shortly.");
  return data;
}

function toUnit(celsius) {
  return unit === "f" ? celsius * 9 / 5 + 32 : celsius;
}
function temperature(value) {
  return Number.isFinite(value) ? `${Math.round(toUnit(value))}°${unit.toUpperCase()}` : "—";
}
function showMetric(id, value, suffix = "") {
  const element = document.getElementById(id);
  element.textContent = value;
  if (suffix && value !== "—") {
    const small = document.createElement("small");
    small.textContent = ` ${suffix}`;
    element.append(small);
  }
}

// One table maps an OpenWeather condition id to its colour code and pictogram.
function classify(id, icon = "") {
  const night = icon.endsWith("n");
  if (id === 800) return night ? { code: "clear-night", picto: "#moon" } : { code: "sunny", picto: "#sun" };
  if (id >= 200 && id < 300) return { code: "stormy", picto: "#storm" };
  if (id >= 300 && id < 600) return { code: "rainy", picto: "#rain" };
  if (id >= 600 && id < 700) return { code: "snowy", picto: "#snow" };
  if (id >= 700 && id < 800) return { code: "foggy", picto: "#mist" };
  if (id === 801 || id === 802) return { code: "cloudy", picto: night ? "#moon-cloud" : "#sun-cloud" };
  if (id > 802 && id < 810) return { code: "cloudy", picto: "#cloud" };
  return { code: "default", picto: "#cloud" };
}

function displayWeatherInfo(data) {
  const condition = data.weather[0];
  const { temp, temp_min: low, temp_max: high, feels_like: feelsLike, humidity } = data.main;
  document.getElementById("empty-state").hidden = true;
  document.getElementById("weather-result").hidden = false;
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("country").textContent = data.sys?.country || "";

  const tempElement = document.getElementById("temperature");
  tempElement.textContent = Math.round(toUnit(temp));
  const unitLabel = document.createElement("span");
  unitLabel.textContent = `°${unit.toUpperCase()}`;
  tempElement.append(unitLabel);
  document.getElementById("description").textContent = condition.description;
  document.getElementById("temp-low").textContent = temperature(low);
  document.getElementById("temp-high").textContent = temperature(high);
  const track = document.getElementById("range-track");
  const hasRange = Number.isFinite(low) && Number.isFinite(high) && high >= low;
  track.hidden = !hasRange;
  if (hasRange) track.style.setProperty("--at", `${high > low ? Math.min(Math.max((temp - low) / (high - low), 0), 1) * 100 : 50}%`);

  document.getElementById("feels-like").textContent = temperature(feelsLike);
  showMetric("humidity", Number.isFinite(humidity) ? humidity : "—", "%");
  const wind = Number.isFinite(data.wind?.speed) ? (unit === "f" ? data.wind.speed * 2.23694 : data.wind.speed * 3.6).toFixed(1) : "—";
  showMetric("wind-speed", wind, unit === "f" ? "mph" : "km/h");
  const deg = data.wind?.deg;
  const windArrow = document.getElementById("wind-arrow");
  windArrow.toggleAttribute("hidden", !Number.isFinite(deg));
  // The arrow points where the wind blows to; the text names where it comes from.
  if (Number.isFinite(deg)) windArrow.style.setProperty("--deg", `${deg + 180}deg`);
  document.getElementById("wind-direction").textContent = Number.isFinite(deg) ? `From the ${COMPASS[Math.round(deg / 45) % 8]}` : "At ground level";
  const visibility = Number.isFinite(data.visibility) ? (data.visibility / (unit === "f" ? 1609.344 : 1000)).toFixed(1) : "—";
  showMetric("visibility", visibility, unit === "f" ? "mi" : "km");

  const { code, picto } = classify(condition.id, condition.icon);
  document.getElementById("condition-icon").setAttribute("href", picto);
  plate.dataset.weather = code;
  codeBar.dataset.active = code;
  document.getElementById("weather-state-label").textContent = condition.main;
  document.getElementById("details-label").textContent = "Current observations";
  const date = new Date(Number.isFinite(data.dt) ? (data.dt + (Number.isFinite(data.timezone) ? data.timezone : 0)) * 1000 : NaN);
  const time = Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(date) : null;
  document.getElementById("observation-time").textContent = time ? `Observed at ${time} · city local time` : "Current weather observation";
}

// On phones the result sits below the search; bring it into view once it arrives.
function revealResult() {
  if (!window.matchMedia?.("(max-width: 767px)").matches || typeof plate.scrollIntoView !== "function") return;
  if (plate.getBoundingClientRect().top < window.innerHeight * 0.4) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  plate.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

function showError(message) {
  status.textContent = message;
  status.classList.add("is-error");
}
