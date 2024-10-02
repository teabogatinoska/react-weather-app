import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { FaLocationArrow, FaCheck } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "1000px",
  height: "600px",
  margin: "0 auto",
  display: "block",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ currentUser }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
  console.log("User: ", currentUser);
  const [currentPosition, setCurrentPosition] = useState(null);
  const mapRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
          mapRef.current?.panTo({ lat: latitude, lng: longitude });
        },
        () => {
          alert("Unable to retrieve user's location.");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }, []); 

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panToCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newCenter = { lat: latitude, lng: longitude };
          console.log("Coordinates: ", position.coords);
          setCurrentPosition(newCenter);
          // console.log("Current position: ", currentPosition);
          mapRef.current.panTo(newCenter);
          mapRef.current.setZoom(14);
        },
        () => {
          alert("Unable to retrieve your location.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  const onMarkerDragEnd = (event) => {
    const newLat = event.latLng.lat();
    const newLng = event.latLng.lng();
    setCurrentPosition({ lat: newLat, lng: newLng });
    mapRef.current.panTo({ lat: newLat, lng: newLng });
  };

  const confirmLocation = async () => {
    if (!currentUser) {
      alert("User not found. Please log in.");
      return;
    }
    try {
      const requestData = {
        userId: currentUser.id,
        username: currentUser.username,
        latitude: currentPosition.lat,
        longitude: currentPosition.lng
      };

      const response = await axios.post('http://localhost:8080/api/weather/request', requestData);
      // console.log("Weather response: ", response);
      navigate("/weather", { state: { location: response.data } });
    } catch (error) {
      console.error("Error confirming location:", error);
      alert("An error occurred while confirming the location.");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={currentPosition}
        options={options}
        onLoad={onMapLoad}
      >
        {/* Draggable Marker */}
        <Marker
          position={currentPosition}
          draggable={true}
          onDragEnd={onMarkerDragEnd}
        />
      </GoogleMap>

      {/* Button to get current location */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          padding: "1rem",
        }}
      >
        <button
          className="locateBtn"
          onClick={panToCurrentLocation}
          style={{
            marginTop: "10px",
            marginRight: "10px",
            padding: "10px",
            backgroundColor: "#0f63af",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaLocationArrow style={{ marginRight: "5px" }} /> Locate Me
        </button>
        <button
          className="confirmBtn"
          onClick={confirmLocation}
          style={{
            marginTop: "10px",
            padding: "10px",
            backgroundColor: "#049963",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
          }}
        >
          <FaCheck style={{ marginRight: "5px" }} /> Confirm Location
        </button>
      </div>
    </div>
  );
};
export default Map;
