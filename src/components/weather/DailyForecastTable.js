import React from 'react';
import './Weather.css';

const DailyForecastTable = ({ forecast }) => {
    return (
      <table className="forecast-table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Temperature</th>
            <th>Wind</th>
            <th>Precipitation</th>
            <th>Humidity</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {forecast.map((day, index) => (
            <tr key={index}>
              <td>{day.day}</td>
              <td>{day.temperature}</td>
              <td>{day.wind} m/s</td>
              <td>{day.precipitation}%</td>
              <td>{day.humidity}%</td>
              <td className="open-forecast">
              <span>Open hourly forecast</span> 
              <span className="arrow">→</span>
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };
  
export default DailyForecastTable;
