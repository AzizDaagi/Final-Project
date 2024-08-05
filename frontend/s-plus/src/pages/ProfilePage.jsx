import React, { useState, useEffect } from "react";
import axios from "../axiosInstance";
import "../styles/profilePage.css";
import { jwtDecode } from "jwt-decode";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

function ProfilePage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  // Retrieve and decode token
  const token = localStorage.getItem("token");
  let userId = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
    } catch (err) {
      setError("Invalid token. Please log in again.");
    }
  }

  useEffect(() => {
    if (!userId) return;

    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/users/find/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleEdit = () => {
    // Clear the password field when entering edit mode
    setUser((prevUser) => ({ ...prevUser, password: "" }));
    setEditMode(true);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Create an object with the data to be updated
      const updatedUser = {
        name: user.name,
        email: user.email,
        phone: user.phone,
      };

      // Include the password only if it's not blank
      if (user.password) {
        updatedUser.password = user.password;
      }
      // Send a PUT request with JSON data
      const response = await axios.put(`/users/update/${userId}`, updatedUser, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set content type to JSON
        },
      });

      // Update state with the response data
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="profile-page">
      <Navbar />
      <div className="profile-wrapper">
        <h1>Profile</h1>
        <div className="profile-container">
          <div className="profile-picture">
            <img
              src={
                user.profilePicture ||
                "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
              }
              alt="Profile"
            />
          </div>
          <div className="profile-details">
            <div className="profile-field">
              <label>Name:</label>
              {editMode ? (
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.name}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Email:</label>
              {editMode ? (
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.email}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Phone:</label>
              {editMode ? (
                <input
                  type="text"
                  name="phone"
                  value={user.phone}
                  onChange={handleChange}
                />
              ) : (
                <span>{user.phone}</span>
              )}
            </div>
            <div className="profile-field">
              <label>Password:</label>
              {editMode ? (
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Leave blank if not updating"
                />
              ) : (
                <span>**************</span>
              )}
            </div>
            {editMode ? (
              <button onClick={handleSave}>Save</button>
            ) : (
              <button onClick={handleEdit}>Edit</button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
