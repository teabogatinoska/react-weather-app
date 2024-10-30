import React, { useState } from 'react';
import axios from 'axios';
import HourlyForecastModal from './HourlyForecastModal.js';
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

const isTodayOrLater = (dateString) => {
  const today = new Date();
  const date = new Date(dateString);
  return date >= today.setHours(0, 0, 0, 0); 
};

const DailyForecastTable = ({ forecast, currentUser, location }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hourlyData, setHourlyData] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [airQualityData, setAirQualityData] = useState({});
  const [selectedDay, setSelectedDay] = useState('');
  
  const sortedForecast = forecast
    .filter(day => isTodayOrLater(day.day))
    .sort((a, b) => new Date(a.day) - new Date(b.day));

  const openHourlyModal = async (day) => {
    setSelectedDay(day.day);
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/data/weather/hourly?username=${currentUser.username}&location=${location.name}&country=${location.country}`
      );
      const data = response.data;
      setHourlyData(data.hourlyData);
      setDescriptions(data.weatherDescriptions);
      setAirQualityData(data.airQualityData);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching hourly forecast:', error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
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
          {sortedForecast.map((day, index) => (
            <tr key={index} className={isTodayOrLater(day.day) ? 'today' : ''}>
              <td className="weekDay">{getDayOfWeek(day.day)} {isTodayOrLater(day.day) && index === 0 ? "(Today)" : ""}</td>
              <td className="temp">{day.temperature}</td>
              <td>{day.wind} m/s</td>
              <td className="precip">{day.precipitation}%</td>
              <td>{day.humidity}%</td>
              <td className="open-forecast">
                <span onClick={() => openHourlyModal(day)}>Open hourly forecast</span>
                <span className="arrow">→</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hourly Forecast Modal */}
      <HourlyForecastModal
        isOpen={isModalOpen}
        onClose={closeModal}
        hourlyData={hourlyData}
        day={selectedDay}
        descriptions={descriptions}
        airQualityData={airQualityData}
      />
    </>
  );
};

export default DailyForecastTable;
