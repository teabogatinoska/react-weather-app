import React from 'react';
import './Weather.css';

const getDayOfWeek = (dateString) => {
  const date = new Date(dateString);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const monthsOfYear = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const dayOfWeek = daysOfWeek[date.getDay()];
  const day = date.getDate();
  const month = monthsOfYear[date.getMonth()]; 

  return `${dayOfWeek} ${day} ${month}`; 
};


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
               <td className='weekDay'>{getDayOfWeek(day.day)}</td> 
              <td className='temp'>{day.temperature}</td>
              <td>{day.wind} m/s</td>
              <td className='precip'>{day.precipitation}%</td>
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
