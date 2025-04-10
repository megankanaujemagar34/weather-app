import React, { useState } from "react";
import axios from "axios";
import "./App.css"; 

const App = () => {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState("");

  const apiKey = process.env.REACT_APP_API_KEY;


  const handleInputChange = (e) => {
    setLocation(e.target.value);
  };

  const fetchWeather = async () => {
    try {
   
      const current = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`
      );
      setWeather(current.data);


      const future = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=${apiKey}`
      );
      setForecast(future.data);
      setError("");
    } catch (err) {
      setError(" Location not found. Please try again.");
      setWeather(null);
      setForecast(null);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (location.trim() !== "") {
      fetchWeather();
    }
  };

  return (
    <div className="app">
      <h1>🌤️ Natakii Weather App</h1>

      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={location}
          onChange={handleInputChange}
          placeholder="Enter location"
        />
        <button type="submit">Search</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "20px" }}>
          <h2>{weather.name}</h2>
          <p>{weather.weather[0].description}</p>
          <p>{weather.main.temp}°C</p>
        </div>
      )}

      {forecast && (
        <div>
          <h3>5-Day Forecast</h3>
          <div className="forecast">
            {forecast.list
              .filter((item) => item.dt_txt.includes("12:00:00"))
              .map((item, index) => (
                <div className="forecast-card" key={index}>
                  <p>
                    <strong>
                      {new Date(item.dt_txt).toLocaleDateString("en-US", {
                        weekday: "long",
                      })}
                    </strong>
                  </p>
                  <p>{item.main.temp}°C</p>
                  <p>{item.weather[0].description}</p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
