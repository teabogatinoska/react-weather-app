import React, { useState, useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import LocationHeader from "./LocationHeader";
import CurrentConditions from "./CurrentConditions";
import DailyForecastTable from "./DailyForecastTable";
import FavoriteCities from "./FavoriteCities";
import FavoriteBanner from "./FavoriteBanner";
import axios from "axios";
import "./Weather.css";

const WeatherDashboard = ({ currentUser }) => {
  const { state } = useLocation();
  const [favoriteCities, setFavoriteCities] = useState([]);
  const [dailyForecast, setDailyForecast] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const previousLocation = useRef(null);
  const [favoritesLoaded, setFavoritesLoaded] = useState(false);
  const [bannerMessage, setBannerMessage] = useState("");
  const [isFavoriteBanner, setIsFavoriteBanner] = useState(null);

  const location = useMemo(() => {
    if (!favoritesLoaded) return null;
  
    return state?.location || (favoriteCities.length > 0 ? {
      name: favoriteCities[0].name,
      country: favoriteCities[0].country,
      latitude: favoriteCities[0].latitude,
      longitude: favoriteCities[0].longitude,
    } : null); 
  }, [state, favoriteCities, favoritesLoaded]);

  const fetchDailyForecast = async (retryCount = 3) => {
    if (!location || !location.name || !location.country) return;
    
    setLoading(true);
    setError(null);
    let isMounted = true;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/data/weather/daily?username=${currentUser.username}&location=${location.name}&country=${location.country}`,
        { timeout: 10000 } 
      );
      const forecastData = response.data.dailyData;

      if (isMounted) {
        const formattedForecast = Object.entries(forecastData).map(([day, data]) => ({
          day,
          temperature: `${data.max} / ${data.min}`,
          wind: data.windSpeed,
          precipitation: data.precipitation,
          humidity: data.humidity,
        }));
        setDailyForecast(formattedForecast);
      }
    } catch (error) {
      if (retryCount > 0) {
        console.warn(`Retrying fetch... Attempts left: ${retryCount}`);
        setTimeout(() => fetchDailyForecast(retryCount - 1), 1000);
      } else {
        if (isMounted) {
          setError("Failed to fetch daily forecast. Please try again.");
        }
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const fetchFavoriteCities = async () => {
    let isMounted = true;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/location/favorite-locations/${currentUser.id}`
      );
      if (isMounted) {
        setFavoriteCities(response.data);
        setFavoritesLoaded(true);
      }
    } catch (error) {
      console.error("Error fetching favorite cities:", error);
      if (isMounted) {
        setFavoritesLoaded(true);
      }
    }

    return () => {
      isMounted = false;
    };
  };

  const handleFavoriteAdded = (message, isFavorite) => {
    setBannerMessage(message);
    setIsFavoriteBanner(isFavorite);
  };

  const closeBanner = () => {
    setBannerMessage("");
    setIsFavoriteBanner(null);
  };

  useEffect(() => {
    fetchFavoriteCities();
  }, [currentUser.id]);

  useEffect(() => {
    if (!favoritesLoaded) return;  
  
    if (location && (previousLocation.current?.name !== location.name || previousLocation.current?.country !== location.country)) {
      previousLocation.current = location;
      fetchDailyForecast();
    }
  }, [location, currentUser.username, favoritesLoaded]);

  return (
    <div className="weather-dashboard">
      {bannerMessage && (
        <FavoriteBanner
          message={bannerMessage}
          onClose={closeBanner}
          isFavorite={isFavoriteBanner}
        />
      )}

      {location ? (
        <>
          <div className="left-section">
            <LocationHeader
              location={location}
              userId={currentUser.id}
              refreshFavorites={fetchFavoriteCities}
              onFavoriteAdded={handleFavoriteAdded}
            />
            <CurrentConditions location={location} currentUser={currentUser} />
          </div>
          <div className="right-section">
            <FavoriteCities
              favoriteCities={favoriteCities}
              currentUser={currentUser}
            />
          </div>
          <div className="forecast-section">
            {loading ? (
              <div>Loading daily forecast...</div>
            ) : error ? (
              <div>{error}</div>
            ) : (
              <DailyForecastTable
                forecast={dailyForecast}
                location={location}
                currentUser={currentUser}
              />
            )}
          </div>
        </>
      ) : (
        <div>No location selected</div>
      )}
    </div>
  );
};

export default WeatherDashboard;
