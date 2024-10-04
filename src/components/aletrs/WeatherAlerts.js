import React, { useState, useEffect } from 'react';
import axios from 'axios';

const WeatherAlerts = ({ currentUser }) => {
  const [alertsData, setAlertsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/api/data/weather/alerts?userId=${currentUser.id}`);
      setAlertsData(response.data.locationAlerts);
      setLoading(false);
    } catch (error) {
      setError("Failed to load weather alerts.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, [currentUser.id]);

  if (loading) {
    return <div>Loading weather alerts...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="weather-alerts-container">
    <h2 className="section-title">Weather Alerts</h2>
    {alertsData.map((locationAlert, index) => (
      <div key={index} className="location-alert-card">
        <h3 className="location-title">{locationAlert.location.name}, {locationAlert.location.country}</h3>
        <ul>
          {locationAlert.alerts.map((alert, idx) => (
            <li key={idx} className="alert-item-card">
              <div className="alert-header">
                <strong>{alert.headline}</strong>
                <span className={`alert-severity severity-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
              </div>
              <div className="alert-info">
                <span><strong>Event:</strong> {alert.event}</span><br />
                <span><strong>Urgency:</strong> {alert.urgency}</span><br />
                <span><strong>Areas affected:</strong> {alert.areas}</span><br />
                <span><strong>Effective:</strong> {new Date(alert.effective).toLocaleString()}</span><br />
                <span><strong>Expires:</strong> {new Date(alert.expires).toLocaleString()}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ))}
  </div>
  );
};

export default WeatherAlerts;
