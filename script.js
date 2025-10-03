const apiKey = "c94cf34aed817932140ea14b9818d666"; // your API key

async function getWeatherByCity() {
  const cityInput = document.getElementById("cityInput");
  if (!cityInput || !cityInput.value) {
    alert("Please enter a city name");
    return;
  }

  const city = cityInput.value.trim();
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  console.log("Fetching city weather:", url);
  fetchWeather(url);
}

function getWeatherByLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        console.log("Fetching location weather:", url);
        fetchWeather(url);
      },
      (error) => {
        console.error("Location error:", error);
        alert("Location access denied.");
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
}

async function fetchWeather(url) {
  try {
    const response = await fetch(url);
    console.log("Response status:", response.status);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Weather data:", data);

    const weatherResult = document.getElementById("weatherResult");
    if (!weatherResult) return;

    if (data.cod === "404") {
      weatherResult.innerHTML = `<p>City not found ❌</p>`;
      return;
    }

    const weatherHTML = `
      <h2>${data.name}, ${data.sys.country}</h2>
      <h3>${data.weather[0].description} 🌥️</h3>
      <p>🌡️ Temperature: ${data.main.temp}°C</p>
      <p>💧 Humidity: ${data.main.humidity}%</p>
      <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
    `;

    weatherResult.innerHTML = weatherHTML;
  } catch (error) {
    console.error("Fetch error:", error);
    document.getElementById("weatherResult").innerHTML = `<p>Error fetching data ⚠️</p>`;
  }
}
