import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import axios from 'axios';
import './Weather.css';

const LocationHeader = ({ location, userId, refreshFavorites, onFavoriteAdded }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null); 


  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/location/favorite-locations/${userId}`);
        const favoriteLocations = response.data;

        const favoriteLocation = favoriteLocations.find(
          (fav) => fav.name === location.name && fav.country === location.country
        );

        if (favoriteLocation) {
          setIsFavorite(true);
          setFavoriteId(favoriteLocation.id); 

        } else {
          setIsFavorite(false);
          setFavoriteId(null);
          console.log('Location not in favorites');
        }
      } catch (error) {
        console.error('Error fetching favorite locations', error);
      }
    };

    checkIfFavorite();
  }, [location, userId]);


  const toggleFavorite = async () => {
    if (!isFavorite) {
      try {
        const response = await axios.post(`http://localhost:8080/api/location/${userId}/favorite-location`, {
          userId: userId,
          name: location.name,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude,
        });

        setIsFavorite(true);
        setFavoriteId(response.data.id);
        refreshFavorites();
        onFavoriteAdded(`${location.name} was added to favorite locations`, true);
      } catch (error) {
        console.error('Error adding favorite location', error);
      }
    } else {
      try {
        if (favoriteId) {
          await axios.delete(`http://localhost:8080/api/location/${userId}/favorite/${favoriteId}`);
          setIsFavorite(false);
          setFavoriteId(null);
          refreshFavorites();
          onFavoriteAdded(`${location.name} was removed from favorite locations`, false); 
        } else {
          console.error('Favorite ID not found for deletion');
        }
      } catch (error) {
        console.error('Error removing favorite location', error);
      }
    }
  };

  return (
    <div className="current-location">
      <h2>
        {location.name}, {location.country}{' '}
        <span onClick={toggleFavorite} className="favorite-star">
          <FontAwesomeIcon
            icon={isFavorite ? solidStar : regularStar}
            className="star-icon"
          />
        </span>
      </h2>
    </div>
  );
};

export default LocationHeader;
