import React from 'react';
import './Weather.css';
import { weatherConditions } from "../data/WeatherConditions";
import {
  FaSun,
  FaMoon,
  FaCloudSun,
  FaCloud,
  FaSmog,
  FaCloudShowersHeavy,
  FaBolt,
  FaSnowflake,
  FaCloudRain,
  FaTint,
  FaQuestion,
  FaCloudSunRain
} from "react-icons/fa";


const HourlyForecastModal = ({ isOpen, onClose, hourlyData, day, descriptions, airQualityData }) => {
  if (!isOpen) return null;

  const { temperature, windSpeed, precipitation, humidity } = hourlyData || {};
  const hasData = temperature && windSpeed && precipitation && humidity && descriptions;

  const currentDate = new Date();
  const currentHour = currentDate.getHours();

  const selectedDate = new Date(day); 
  const isToday = selectedDate.toDateString() === currentDate.toDateString();

  const filterHoursForSelectedDay = (time) => {
    const timeDate = new Date(time); 
    const isSameDay = selectedDate.toDateString() === timeDate.toDateString(); 
    if (isSameDay && isToday) {
      return timeDate.getHours() >= currentHour; 
    }
    return isSameDay; 
  };

  const getWeatherIcon = (description) => {
    if (!description) return <FaQuestion />;
    console.log("Item: ", description);
    const condition = weatherConditions.find(
      (item) =>
        
        item.day.trim().toLowerCase() === description.trim().toLowerCase() ||
        item.night.trim().toLowerCase() === description.trim().toLowerCase()
        
    );
  
    if (!condition) return <FaQuestion />;
  
    switch (condition.icon) {
      case "fas fa-sun":
        return <FaSun style={{ color: "orange" }} />;
      case "fas fa-moon":
        return <FaMoon style={{ color: "gray" }} />;
      case "fas fa-cloud-sun":
        return <FaCloudSun style={{ color: "lightblue" }} />;
      case "fas fa-cloud":
        return <FaCloud style={{ color: "gray" }} />;
      case "fas fa-smog":
        return <FaSmog style={{ color: "darkgray" }} />;
      case "fas fa-cloud-showers-heavy":
        return <FaCloudShowersHeavy style={{ color: "blue" }} />;
      case "fas fa-bolt":
        return <FaBolt style={{ color: "yellow" }} />;
      case "fas fa-snowflake":
        return <FaSnowflake style={{ color: "lightblue" }} />;
      case "fas fa-cloud-sleet":
        return <FaCloudShowersHeavy style={{ color: "blue" }} />;
      case "fas fa-cloud-bolt":
        return <FaBolt style={{ color: "yellow" }} />;
      case "fas fa-cloud-sun-rain":
        return <FaCloudSunRain style={{ color: "lightblue" }} />;
      case "fas fa-thunder":
        return <FaBolt style={{ color: "yellow" }} />;
      case "fas fa-cloud-rain":
        return <FaCloudRain style={{ color: "lightgrey" }} />;
      case "fas fa-rain-bolt":
        return <FaBolt style={{ color: "yellow" }} />;
      default:
        return <FaQuestion style={{ color: "gray" }} />;
    }
  };
  


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-modal" onClick={onClose}>&times;</span>
        
        <h2>Hourly Forecast for {selectedDate.toDateString()}</h2>
        <table className="hourly-forecast-table">
          <thead>
            <tr>
              <th>Hour</th>
              <th>Temperature (°C)</th>
              <th>Wind Speed (m/s)</th>
              <th>Precipitation (%)</th>
              <th>Humidity (%)</th>
              <th>Weather Description</th>
              <th>PM2.5</th>
              <th>PM10</th>
            </tr>
          </thead>
          <tbody>
            {hasData ? (
              Object.keys(temperature)
                .filter(filterHoursForSelectedDay) 
                .map((time) => {
                  const date = new Date(time);
                  const isValidDate = !isNaN(date.getTime());
                  
                  const temp = temperature[time] ?? 'N/A';
                  const wind = windSpeed[time] ?? 'N/A';
                  const precip = precipitation[time] ?? 'N/A';
                  const humid = humidity[time] ?? 'N/A';
                  const desc = descriptions[time] ?? 'N/A';
                  const airQuality = airQualityData[time] || { pm2_5: 'N/A', pm10: 'N/A' };

                  return (
                    <tr key={time}>
                      <td>
                        {isValidDate
                          ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                          : 'Invalid time'}
                      </td>
                      <td className="temp">{temp}°C</td>
                      <td>{wind} m/s</td>
                      <td className="precip">{precip}%</td>
                      <td>{humid}%</td>
                      <td className="icon">{getWeatherIcon(desc)}</td>
                      <td>{airQuality.pm2_5}</td>
                      <td>{airQuality.pm10}</td>
                    </tr>
                  );
                })
            ) : (
              <tr>
                <td colSpan="8">No data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HourlyForecastModal;
