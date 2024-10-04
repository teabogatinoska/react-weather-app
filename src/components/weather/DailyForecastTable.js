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

const DailyForecastTable = ({ forecast, currentUser, location }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hourlyData, setHourlyData] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [airQualityData, setairQualityData] = useState({});
  const [selectedDay, setSelectedDay] = useState('');

  const openHourlyModal = async (day) => {
    setSelectedDay(day.day);  
    try {
      const response = await axios.get(
        `http://localhost:8080/api/data/weather/hourly?username=${currentUser.username}&location=${location.name}&country=${location.country}`
      );
      const data = response.data;
      console.log("Hourly response: ", data);
      setHourlyData(data.hourlyData);
      setDescriptions(data.weatherDescriptions);
      setairQualityData(data.airQualityData);
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
          {forecast.map((day, index) => (
            <tr key={index}>
              <td className="weekDay">{getDayOfWeek(day.day)}</td>
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
