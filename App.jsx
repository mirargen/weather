import React, { useState, useEffect } from "react";
import Navbar from "./components/Navbar";
import MainWeatherCard from "./components/MainweatherCard";
import FiveDayForecast from "./components/FiveDayForecast";
import TodayHighlights from "./components/TodayHighlights";
import axios from "axios";

const WeatherDashboard = () => {
  const [weatherData, setWeatherData] = useState(null);
  const [city, setCity] = useState("Bishkek");
  const [airQualityData, setAirQualityData] = useState(null);
  const [fiveDayForecast, setFiveDayForecast] = useState(null);
  const [isNightMode, setIsNightMode] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    fetchWeatherData(city);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [city]);

  const fetchAirQualityData = (lat, lon) => {
    const API_KEY = "c96908ca87e7adad130beff881d0cfc1";
    axios
      .get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${API_KEY}`
      )
      .then((response) => {
        setAirQualityData(response.data.list[0]);
      })
      .catch((error) => console.error("Error fetching the air quality data:", error));
  };

  const fetchWeatherData = (city) => {
    const API_KEY = "c96908ca87e7adad130beff881d0cfc1";
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        fetchAirQualityData(data.coord.lat, data.coord.lon);
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
          )
          .then((response) => {
            setFiveDayForecast(response.data);
          })
          .catch((error) => console.error("Error fetching the 5-day forecast data:", error));
      })
      .catch((error) => console.error("Error fetching the weather data:", error));
  };

  const handleSearch = (searchedCity) => {
    setCity(searchedCity);
  };

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  };

  return (
    <div
      style={{
        backgroundColor: isNightMode ? "#4F4F4F" : "#4793FF33",
        color: isNightMode ? "#ffffff" : "black",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      <Navbar onSearch={handleSearch} />
      <button
        onClick={toggleNightMode}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          padding: "10px",
          backgroundColor: isNightMode ? "#ffffff" : "#000000",
          color: isNightMode ? "#000000" : "#ffffff",
          border: "none",
          borderRadius: "5px",
        }}
      >
        {isNightMode ? "Day Mode" : "Night Mode"}
      </button>

      {weatherData && airQualityData && (
        <div
          style={{
            display: "flex",
            flexDirection: windowWidth <= 768 ? "column" : "row", // переключаемся на колонку на мобильных устройствах
            padding: "30px",
            gap: "20px",
          }}
        >
          <div
            style={{
              flex: "1",
              marginRight: windowWidth <= 768 ? "0" : "10px", // убираем отступ на мобильных
            }}
          >
            <MainWeatherCard weatherData={weatherData} />
            <p style={{ fontWeight: "700", fontSize: "20px", marginTop: "20px" }}>
              5 Days Forecast
            </p>
            {fiveDayForecast && <FiveDayForecast forecastData={fiveDayForecast} />}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: "0.5",
              gap: "20px",
            }}
          >
            <TodayHighlights weatherData={weatherData} airQualityData={airQualityData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
