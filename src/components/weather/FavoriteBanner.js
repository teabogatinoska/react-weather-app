import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';
import './Weather.css'; 

const FavoriteBanner = ({ message, onClose, isFavorite }) => { 
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`banner ${!visible ? 'hidden' : ''}`}>
      <FontAwesomeIcon
        icon={isFavorite ? solidStar : regularStar}
        className="bannerIcon"
      /> 
      <p>{message}</p>
    </div>
  );
};

export default FavoriteBanner;
