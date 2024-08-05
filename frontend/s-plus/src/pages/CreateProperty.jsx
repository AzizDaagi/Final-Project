import React, { useState, useEffect } from "react";
import Map from "../components/Map";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from "../axiosInstance";
import { jwtDecode } from "jwt-decode";
import "../styles/propertyCreation.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function PropertyCreation() {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rooms, setRooms] = useState("");
  const [pricePerNight, setPricePerNight] = useState("");
  const [error, setError] = useState(null);
  const [availability, setAvailability] = useState([new Date(), new Date()]);

  // Retrieve and decode token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      console.log("Decoded token:", decoded); // Debug token decoding
    } catch (err) {
      setError("Invalid token. Please log in again.");
      console.error("Token decoding error:", err);
    }
  }

  useEffect(() => {
    if (selectedLocation) {
      console.log("Selected location:", selectedLocation); // Debug selected location
    }
  }, [selectedLocation]);

  const handleLocationSelected = ({ lat, lng }) => {
    setSelectedLocation({ lat, lng });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedLocation) {
      alert("Please select a location on the map.");
      return;
    }

    // Create the property payload
    const payload = {
      title,
      description,
      rooms,
      pricePerNight,
      availability: {
        startDate: availability[0].toISOString(),
        endDate: availability[1].toISOString(),
      },
      host: userId,
      location: {
        type: "Point",
        coordinates: [selectedLocation.lng, selectedLocation.lat],
      },
    };

    // Log payload for debugging
    console.log("Payload:", payload);

    try {
      // Adjust the URL to your backend endpoint
      const response = await axios.post("/properties/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("Property saved successfully:", response.data);
      // Optionally, redirect the user or reset the form
    } catch (error) {
      console.error(
        "Error saving property:",
        error.response ? error.response.data : error.message
      );
      alert("An error occurred while saving the property. Please try again.");
    }
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="creation-page">
      <Navbar/>
      <div className="creation-wrapper">
        <h1 className="page-title">Create Property</h1>
        <div className="form-container">
          <form className="create-property" onSubmit={handleSubmit}>
            <div>
              <label>Title</label>
              <input
                className="creation-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Description</label>
              <textarea
                className="creation-input"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Rooms</label>
              <input
                className="creation-input"
                type="number"
                value={rooms}
                onChange={(e) => setRooms(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Price per Night</label>
              <input
                className="creation-input"
                type="number"
                value={pricePerNight}
                onChange={(e) => setPricePerNight(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Availability</label>
              <DatePicker
                selected={availability[0]}
                onChange={(date) => setAvailability([date, availability[1]])}
                startDate={availability[0]}
                endDate={availability[1]}
                selectsStart
                required
              />
              <DatePicker
                selected={availability[1]}
                onChange={(date) => setAvailability([availability[0], date])}
                startDate={availability[0]}
                endDate={availability[1]}
                selectsEnd
                required
              />
            </div>
            <div>
              <p className="location-info">Selected Location:</p>
              <p>Latitude: {selectedLocation?.lat || "N/A"}</p>
              <p>Longitude: {selectedLocation?.lng || "N/A"}</p>
            </div>
          </form>
          <Map onLocationSelected={handleLocationSelected} />
          <button className="save-button" onClick={handleSubmit}>
            Save Property
          </button>
        </div>
      </div>
      <Footer/>
    </div>
  );
}

export default PropertyCreation;
