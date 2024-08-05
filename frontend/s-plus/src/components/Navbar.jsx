import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/home" className="navbar-logo">
          SPlus
        </Link>
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link to="/home" className="navbar-links">
              Search
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/property/create" className="navbar-links">
              Create
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/notification" className="navbar-links">
              Notification
            </Link>
          </li>
          <li className="navbar-item">
            <Link to="/profile" className="navbar-links">
              Profile
            </Link>
          </li>
          <button className="logout-button" onClick={handleLogout}>
            Log out
          </button>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
