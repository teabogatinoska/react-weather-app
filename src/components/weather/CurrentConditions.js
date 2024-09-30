import React from "react";
import "./Weather.css";

const CurrentConditions = ({
  temperature,
  wind,
  precipitation,
  humidity,
  airQuality,
}) => {
  return (
    <div className="current-conditions">
      <h2>Current Conditions</h2>

      <div className="temp-icon-container">
        <div className="temp">{temperature}°</div>
        <div className="icon">☀️</div>
      </div>

      <div className="details">
        <p>Wind: {wind} m/s</p>
        <p>Precipitation: {precipitation}%</p>
        <p>Humidity: {humidity}%</p>
        <p>
          Air Quality PM2.5: {airQuality.pm2_5}, PM10: {airQuality.pm10}
        </p>
      </div>
    </div>
  );
};

export default CurrentConditions;
