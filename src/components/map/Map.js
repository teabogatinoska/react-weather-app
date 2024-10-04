import React, { useCallback, useRef, useState, useEffect } from "react";
import { GoogleMap, useLoadScript, Marker } from "@react-google-maps/api";
import { FaLocationArrow, FaCheck } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const mapContainerStyle = {
  width: "100%",
  height: "80vh",
  maxWidth: "1300px",
  margin: "20px auto",
  borderRadius: "10px",
  boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
};

const Map = ({ currentUser }) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });
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
          setCurrentPosition(newCenter);
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
        longitude: currentPosition.lng,
      };

      const response = await axios.post(
        "http://localhost:8080/api/weather/request",
        requestData
      );
      navigate("/weather", { state: { location: response.data } });
    } catch (error) {
      console.error("Error confirming location:", error);
      alert("An error occurred while confirming the location.");
    }
  };

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100vh" }}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        zoom={10}
        center={currentPosition}
        options={options}
        onLoad={onMapLoad}
        onClick={(event) => {
          const newLat = event.latLng.lat();
          const newLng = event.latLng.lng();
          setCurrentPosition({ lat: newLat, lng: newLng });
        }}
      >
        {/* Draggable Marker */}
        <Marker position={currentPosition} draggable={true} onDragEnd={onMarkerDragEnd} />
      </GoogleMap>

      {/* Button to get current location */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          gap: "20px",
        }}
      >
        <button
          className="locateBtn"
          onClick={panToCurrentLocation}
          style={{
            padding: "10px 15px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
        >
          <FaLocationArrow style={{ marginRight: "5px" }} /> Locate Me
        </button>
        <button
          className="confirmBtn"
          onClick={confirmLocation}
          style={{
            padding: "10px 15px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
            transition: "background-color 0.3s ease",
          }}
        >
          <FaCheck style={{ marginRight: "5px" }} /> Confirm Location
        </button>
      </div>
    </div>
  );
};

export default Map;
