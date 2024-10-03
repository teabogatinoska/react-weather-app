import React, { useEffect, useState, useMemo } from "react";
import { FaWind, FaCloudRain, FaTint, FaSmog } from "react-icons/fa";
import axios from "axios";
import "./Weather.css";
import { weatherConditions } from "../data/WeatherConditions";

const CurrentConditions = ({ location, currentUser }) => {
  const [currentConditions, setCurrentConditions] = useState({
    temperature: null,
    wind: null,
    precipitation: null,
    humidity: null,
    airQuality: { pm2_5: null, pm10: null },
    description: "",
  });
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(null); 

  const memoizedLocation = useMemo(() => location, [location]);

  const getWeatherIcon = (description) => {
    if (!description) return "❓"; 
    const condition = weatherConditions.find(
      (item) =>
        item.day.toLowerCase() === description.toLowerCase() ||
        item.night.toLowerCase() === description.toLowerCase()
    );
    return condition ? condition.icon : "❓";
  };

  const fetchWeatherData = async (retryCount = 3) => {
    setLoading(true); 
    setError(null);
    setCurrentConditions({ 
      temperature: null,
      wind: null,
      precipitation: null,
      humidity: null,
      airQuality: { pm2_5: null, pm10: null },
      description: "",
    });

    try {
      const response = await axios.get(
        `http://localhost:8080/api/data/weather/hourly?username=${currentUser.username}&location=${memoizedLocation.name}&country=${memoizedLocation.country}`,
        { timeout: 10000 } 
      );

      const data = response.data;

      const now = new Date();
      const timezoneOffset = now.getTimezoneOffset() * 60000;
      const localTime = new Date(now.getTime() - timezoneOffset);

      const year = localTime.getUTCFullYear();
      const month = String(localTime.getUTCMonth() + 1).padStart(2, "0");
      const day = String(localTime.getUTCDate()).padStart(2, "0");
      const hour = String(localTime.getUTCHours()).padStart(2, "0");

      const currentHour = `${year}-${month}-${day}T${hour}:00`;

      const temperature = data.hourlyData.temperature[currentHour];
      const wind = data.hourlyData.windSpeed[currentHour];
      const precipitation = data.hourlyData.precipitation[currentHour];
      const humidity = data.hourlyData.humidity[currentHour];
      const airQuality = data.airQualityData[currentHour];
      const description = data.weatherDescriptions[currentHour];

      setCurrentConditions({
        temperature,
        wind,
        precipitation,
        humidity,
        airQuality: {
          pm2_5: airQuality ? airQuality.pm2_5 : null,
          pm10: airQuality ? airQuality.pm10 : null,
        },
        description,
      });
    } catch (error) {
      if (retryCount > 0) {
        console.warn(`Retrying... Attempts left: ${retryCount}`);
        setTimeout(() => fetchWeatherData(retryCount - 1), 2000); 
      } else {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again.");
      }
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if (!memoizedLocation || !currentUser.username) {
      return;
    }

    fetchWeatherData(); 
  }, [memoizedLocation, currentUser.username]);

  if (loading) {
    return <div>Loading current conditions...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!currentConditions.temperature) {
    return <div>Loading current conditions...</div>;
  }

  return (
    <div className="current-conditions">
      <h2>Current Conditions</h2>

      <div className="temp-icon-container">
        <div className="temp">{currentConditions.temperature}°</div>
        <div className="icon">{getWeatherIcon(currentConditions.description)}</div>
        <div className="description">{currentConditions.description}</div>
      </div>

      <div className="details-horizontal">
        <div className="detail-item">
          <FaWind className="detail-icon" /> Wind: {currentConditions.wind} m/s
        </div>
        <div className="detail-item">
          <FaCloudRain className="detail-icon" /> Precipitation:{" "}
          {currentConditions.precipitation}%
        </div>
        <div className="detail-item">
          <FaTint className="detail-icon" /> Humidity:{" "}
          {currentConditions.humidity}%
        </div>
        <div className="detail-item airQuality">
          <FaSmog className="detail-icon" />
          <span>
            Air Quality PM2.5: {currentConditions.airQuality.pm2_5}, PM10:{" "}
            {currentConditions.airQuality.pm10}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CurrentConditions;