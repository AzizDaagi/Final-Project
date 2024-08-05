import React from "react";
import "../styles/card.css"

function Card({ image, title, price, onButtonClick }) {
  return (
    <div className="card">
      <img
        src={
          image ||
          "https://cdn.dribbble.com/users/450177/screenshots/17606976/media/813f07ac09c6ebda6a12ca22401f5a99.jpg?resize=400x0"
        }
        alt={title}
        className="card-image"
      />
      <div className="card-content">
        <h3 className="card-title">{title}</h3>
        <p className="card-price">{price} Dt/Lila</p>
        <button className="card-button" onClick={onButtonClick}>
          View Details
        </button>
      </div>
    </div>
  );
}

export default Card;
