import React from 'react';
import './Weather.css';


const FavoriteCities = ({ favoriteCities }) => {
  return (
    <div className="favorites">
      <h3>Favorites</h3>
      <ul>
        {favoriteCities.length > 0 ? (
          favoriteCities.map((city, index) => (
            <li key={index}>
              {city.name}, {city.country}
            </li>
          ))
        ) : (
          <li>No favorite cities found</li>
        )}
      </ul>
    </div>
  );
};

export default FavoriteCities;
