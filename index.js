const weatherForm = document.querySelector(".weatherForm");
const cityInput = document.querySelector(".cityInput");
const status = document.getElementById("search-status");
const searchButton = document.getElementById("search-button");
const weatherSection = document.getElementById("weather");
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
  document.querySelector('meta[name="theme-color"]').content = theme === "dark" ? "#181c17" : "#f5f4ef";
}
updateTheme(document.documentElement.dataset.theme);
document.getElementById("theme-toggle").addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  updateTheme(theme);
  savePreference("weather-theme", theme);
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
  searchWeather(cityInput.value);
});
document.querySelectorAll("[data-city]").forEach(button => button.addEventListener("click", () => {
  cityInput.value = button.dataset.city.split(",")[0];
  searchWeather(button.dataset.city);
}));
document.getElementById("refresh-button").addEventListener("click", () => searchWeather(lastCity));
cityInput.addEventListener("input", () => {
  cityInput.removeAttribute("aria-invalid");
  if (status.classList.contains("is-error")) { status.textContent = ""; status.classList.remove("is-error"); }
});

async function searchWeather(value) {
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
    displayWeatherInfo(weatherData);
    status.textContent = `Current weather loaded for ${weatherData.name}.`;
    document.getElementById("refresh-button").hidden = false;
  } catch (error) {
    if (thisRequest !== requestId) return;
    const message = error.name === "AbortError"
      ? "The weather service took too long. Please try again."
      : error instanceof TypeError
        ? "Couldn't connect to the weather service. Check your connection and try again."
        : error.message;
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
function temperature(value) {
  if (!Number.isFinite(value)) return "—";
  return `${Math.round(unit === "f" ? value * 9 / 5 + 32 : value)}°${unit.toUpperCase()}`;
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
function displayWeatherInfo(data) {
  const condition = data.weather[0];
  document.getElementById("empty-state").hidden = true;
  document.getElementById("weather-result").hidden = false;
  document.getElementById("city-name").textContent = data.name;
  document.getElementById("country").textContent = data.sys?.country || "";
  const tempElement = document.getElementById("temperature");
  tempElement.textContent = Math.round(unit === "f" ? data.main.temp * 9 / 5 + 32 : data.main.temp);
  const unitLabel = document.createElement("span");
  unitLabel.textContent = `°${unit.toUpperCase()}`;
  tempElement.append(unitLabel);
  document.getElementById("description").textContent = condition.description;
  document.getElementById("temp-low").textContent = temperature(data.main.temp_min);
  document.getElementById("temp-high").textContent = temperature(data.main.temp_max);
  document.getElementById("feels-like").textContent = temperature(data.main.feels_like);
  showMetric("humidity", Number.isFinite(data.main.humidity) ? data.main.humidity : "—", "%");
  const wind = Number.isFinite(data.wind?.speed) ? (unit === "f" ? data.wind.speed * 2.23694 : data.wind.speed * 3.6).toFixed(1) : "—";
  showMetric("wind-speed", wind, unit === "f" ? "mph" : "km/h");
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  document.getElementById("wind-direction").textContent = Number.isFinite(data.wind?.deg) ? `From the ${directions[Math.round(data.wind.deg / 45) % 8]}` : "At ground level";
  const visibility = Number.isFinite(data.visibility) ? (data.visibility / (unit === "f" ? 1609.344 : 1000)).toFixed(1) : "—";
  showMetric("visibility", visibility, unit === "f" ? "mi" : "km");
  document.getElementById("condition-icon").setAttribute("href", getConditionIcon(condition.id, condition.icon));
  document.querySelector(".weather-stage").dataset.weather = getBackground(condition.id);
  document.getElementById("weather-state-label").textContent = condition.main.toUpperCase();
  document.getElementById("details-label").textContent = "CURRENT OBSERVATIONS";
  const date = new Date(Number.isFinite(data.dt) ? (data.dt + (Number.isFinite(data.timezone) ? data.timezone : 0)) * 1000 : NaN);
  const time = Number.isFinite(date.getTime()) ? new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "UTC" }).format(date) : null;
  document.getElementById("observation-time").textContent = time ? `OBSERVED AT ${time} · CITY LOCAL TIME` : "CURRENT WEATHER OBSERVATION";
}
function showError(message) {
  status.textContent = message;
  status.classList.add("is-error");
}
function getBackground(id) {
  if (id === 800) return "sunny";
  if (id >= 200 && id < 600) return "rainy";
  if (id >= 600 && id < 700) return "snowy";
  if (id >= 700 && id < 800) return "foggy";
  if (id > 800 && id < 810) return "cloudy";
  return "default";
}
function getConditionIcon(id, icon = "") {
  if (id === 800) return icon.endsWith("n") ? "#moon" : "#sun";
  if (id >= 200 && id < 600) return "#rain";
  if (id >= 600 && id < 700) return "#snow";
  if (id >= 700 && id < 800) return "#mist";
  return "#cloud";
}
