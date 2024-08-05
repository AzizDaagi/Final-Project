import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {jwtDecode} from "jwt-decode"; // Ensure proper import
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "../styles/propertyPage.css"
import StaticMap from "../components/StaticMap";

function PropertyPage() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkInDate, setCheckInDate] = useState(null);
  const [checkOutDate, setCheckOutDate] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axios.get(`/properties/find/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const propertyData = response.data
        setProperty(propertyData);
        console.log(propertyData)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, token]);

  const handleReturn = () => {
    navigate("/result");
  };

  const handleBooking = async () => {
    if (!checkInDate || !checkOutDate || !property) {
      alert("Please fill in all the details.");
      return;
    }

    const numberOfDays = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );
    const totalAmount = numberOfDays * property.pricePerNight;

    const payload = {
      guest: jwtDecode(token).id,
      property: property._id,
      checkInDate: checkInDate.toISOString(),
      checkOutDate: checkOutDate.toISOString(),
      totalAmount,
    };

    try {
      await axios.post("/bookings/create", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      alert("Booking successful!");
      navigate("/result");
    } catch (error) {
      console.error("Error making booking:", error);
      alert("An error occurred while making the booking. Please try again.");
    }
  };

  const calculateTotalAmount = () => {
    if (checkInDate && checkOutDate && property) {
      const numberOfDays = Math.ceil(
        (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
      );
      return numberOfDays * property.pricePerNight;
    }
    return 0;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!property) return <p>No property found</p>;

  return (
    <div>
      <Navbar />

      <div className="property-container">
        <div className="property-header">
          <h1 className="property-title">{property.title}</h1>
          <div className="property-price">{property.pricePerNight} Dt/Lila</div>
        </div>

        <div className="property-images">
          {property.images && property.images.length > 0 ? (
            property.images.map((image, index) => (
              <img key={index} src={image} alt={`property ${index + 1}`} />
            ))
          ) : (
            <p>No images available</p>
          )}
        </div>

        <div className="property-description">
          <h2>Description</h2>
          <p>{property.description}</p>
          <h4>S+{property.rooms}</h4>
        </div>

        <div className="booking-form">
          <div>
            <label>Check-In Date:</label>
            <DatePicker
              selected={checkInDate}
              onChange={(date) => setCheckInDate(date)}
              selectsStart
              startDate={checkInDate}
              endDate={checkOutDate}
              required
            />
          </div>
          <div>
            <label>Check-Out Date:</label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date) => setCheckOutDate(date)}
              selectsEnd
              startDate={checkInDate}
              endDate={checkOutDate}
              required
            />
          </div>
          <div>
            <p className="total-amount">Total Amount: {calculateTotalAmount()} Dt</p>
          </div>
          {property && property.location && property.location.coordinates && (
            <StaticMap
              coordinates={property.location.coordinates}
            />
          )}
          <button onClick={handleBooking}>Book Now</button>
        </div>

        <button onClick={handleReturn}>Back to results</button>
      </div>

      <Footer />
    </div>
  );
}

export default PropertyPage;
