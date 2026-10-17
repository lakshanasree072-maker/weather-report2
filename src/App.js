
import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const searchWeather = async () => {
    if (!city.trim()) {
      setError("Please enter a city name!");
      setWeather(null);
      return;
    }

    setLoading(true);
    setError("");
    setWeather(null);

    try {
      const response = await axios.get(
        "https://api.openweathermap.org/data/2.5/weather",
        {
          params: {
            q: city.trim(),
            appid: "ded93b1245edff926bc3824bb0e3fd43",
            units: "metric",
          },
        }
      );

      setWeather(response.data);
    } catch (error) {
      if (error.response?.status === 401) {
        setError("Invalid API key or key not activated yet.");
      } else if (error.response?.status === 404) {
        setError("City not found. Please try another city.");
      } else {
        setError("Unable to load weather. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <h1>🌦️ Weather Report</h1>
      <p>Check the current weather in your city</p>

      <div>
        <input
          type="text"
          placeholder="Enter city name"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") searchWeather();
          }}
        />

        <button onClick={searchWeather} disabled={loading}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <h1>🌡️ {Math.round(weather.main.temp)}°C</h1>

          <p>
            {weather.weather[0].description}
          </p>

          <p>Feels like: {Math.round(weather.main.feels_like)}°C</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind speed: {weather.wind.speed} m/s</p>
          <p>Pressure: {weather.main.pressure} hPa</p>
        </div>
      )}

      <footer>Weather data powered by OpenWeatherMap</footer>
    </div>
  );
}

export default App;
