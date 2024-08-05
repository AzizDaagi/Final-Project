import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import locationData from "../data/locationData";
import axios from "axios";
import axiosInstance from "../axiosInstance";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/homePage.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function HomePage() {
  const [governorate, setGovernorate] = useState("");
  const [state, setState] = useState("");
  const [checkIn, setCheckIn] = useState(null);
  const [checkOut, setCheckOut] = useState(null);
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [rooms, setRooms] = useState("");
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const api_key = "df26c889f5da40f8816b986c9acf6942";
  const handleGovernorate = (e) => {
    setGovernorate(e.target.value);
    setState("");
  };

  const handleState = (e) => {
    const selectedState = e.target.value;
    setState(selectedState);

    handleCoordinates(selectedState);
  };

  useEffect(() => {
    console.log(lng, lat);
  }, [lng, lat]);

  const handleRooms = (e) => {
    setRooms(e.target.value);
  };

  const handleCoordinates = async (e) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?key=${api_key}&q=${e}%2C+${governorate}%2C+Tunisia&pretty=1`;

    try {
      const response = await axios.get(url);
      const result = response.data.results[0]?.geometry;

      if (result) {
        const { lat, lng } = result;
        setLat(lat);
        setLng(lng);
      } else {
        console.error("No results found");
      }
    } catch (err) {
      console.error("Error fetching data:", err.message);
    }
  };

  const handleSearch = async () => {
    try {
      const response = await axiosInstance.get("/properties/search", {
        params: {
          lng,
          lat,
          checkIn: checkIn ? checkIn.toISOString() : undefined,
          checkOut: checkOut ? checkOut.toISOString() : undefined,
          rooms,
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const properties = response.data
      localStorage.setItem("searchResults", JSON.stringify(properties));
      navigate("/result")
      console.log(properties)
    } catch (err) {
      console.error(err)
    }
  };

  return (
    <div className="home-page">
      <Navbar />
      <div className="search-bar-container">
        <div className="location">
          <label htmlFor="governorate">Governorate:</label>
          <select
            value={governorate}
            id="governorate"
            onChange={handleGovernorate}
          >
            <option value="">Select...</option>
            {Object.keys(locationData).map((gov) => (
              <option key={gov} value={gov}>
                {gov}
              </option>
            ))}
          </select>
          <label htmlFor="state">State:</label>
          <select
            id="state"
            value={state}
            onChange={handleState}
            disabled={!governorate}
          >
            <option value="">Select...</option>
            {governorate &&
              locationData[governorate].map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
          <label htmlFor="room">Number of rooms:</label>
          <select name="room" id="room" onChange={handleRooms}>
            <option value="">Select...</option>
            <option value="0">0</option>
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
            <option value="6">6</option>
          </select>
        </div>
        <DatePicker
          selected={checkIn}
          onChange={(date) => setCheckIn(date)}
          placeholderText="Check-In"
          className="date-picker"
          dateFormat="dd/MM/yyyy"
        />
        <DatePicker
          selected={checkOut}
          onChange={(date) => setCheckOut(date)}
          placeholderText="Check-Out"
          className="date-picker"
          dateFormat="dd/MM/yyyy"
        />
        <button onClick={handleSearch} className="search-button">
          Search
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;
