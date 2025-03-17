// src/app/home/pages/feed/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/NavigationBar';
import FeedSearchBar from '../../components/FeedSearchBar';
import DishCard from '../../components/DishCard';
import './FeedPage.css';

export default function FeedPage() {
  const [dishes, setDishes] = useState([]);
  const [trendingDishes, setTrendingDishes] = useState([]);

  useEffect(() => {
    // Fetch all dishes for the main grid
    fetch('http://localhost:4001/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(error => console.error('Error fetching dishes:', error));
    
    // Fetch trending dishes from trending endpoint
    fetch('http://localhost:4001/trending')
      .then(res => res.json())
      .then(data => setTrendingDishes(data))
      .catch(error => console.error('Error fetching trending dishes:', error));
  }, []);

  // Update dishes when search returns results
  const handleSearchResults = (results) => {
    setDishes(results);
  };

  return (
    <div className="feed-page">
      <NavigationBar />
      <header className="feed-header">
        <h1>iLoveRU</h1>
        <p>Descruba todos os pratos do restaurante universitário da Universidade Federal de Pernambuco</p>
      </header>
      <div className="feed-search-container">
        <FeedSearchBar onSearch={handleSearchResults} />
      </div>
      <section className="dishes-section">
        <h2>All Dishes</h2>
        <main className="dishes-grid">
          {dishes.length > 0 ? (
            dishes.slice(0, 12).map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))
          ) : (
            <p>No dishes available.</p>
          )}
        </main>
      </section>
      <section className="trending-section">
        <h2>Trending</h2>
        <div className="trending-grid">
          {trendingDishes.length > 0 ? (
            trendingDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))
          ) : (
            <p>No trending dishes.</p>
          )}
        </div>
      </section>
      <footer className="feed-footer">
        <p>© 2025 University Pub Dish Reviews</p>
      </footer>
    </div>
  );
}
