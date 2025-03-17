// src/components/DishCard.jsx
import React, { useState } from 'react';
import './DishCard.css';

export default function DishCard({ dish }) {
  const [favorite, setFavorite] = useState(false);

  const toggleFavorite = () => {
    setFavorite(!favorite);
    // Here you might add logic to persist the favorite state.
  };

  // Replace with actual image URL when available.
  const placeholderImg = 'https://via.placeholder.com/150';

  return (
    <div className="dish-card">
      <img src={dish.img || 'https://via.placeholder.com/150'} alt={dish.name} className="dish-image" />
      <div className="dish-info">
        <h3>{dish.name}</h3>
        <p>{dish.description}</p>
        <p><strong>Category:</strong> {dish.category}</p>
        <p><strong>Rating:</strong> {dish.rating}</p>
        <p><strong>Views:</strong> {dish.views}</p>
      </div>
      <button className={`favorite-btn ${favorite ? 'favorited' : ''}`} onClick={toggleFavorite}>
        {favorite ? '♥' : '♡'}
      </button>
    </div>
  );
}
