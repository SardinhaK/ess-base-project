// src/app/home/pages/feed/FeedPage.jsx
import React, { useState, useEffect } from 'react';
import NavigationBar from '../../components/NavigationBar';
import FeedSearchBar from '../../components/FeedSearchBar';
import DishCard from '../../components/DishCard';
import './FeedPage.css';

export default function FeedPage() {
  const [dishes, setDishes] = useState([]);
  const [trendingDishes, setTrendingDishes] = useState([]);

  const fetchDishes = () => {
    fetch('http://localhost:4001/dishes')
      .then(res => res.json())
      .then(data => setDishes(data))
      .catch(error => console.error('Error fetching dishes:', error));
  };

  const fetchTrendingDishes = () => {
    fetch('http://localhost:4001/trending')
      .then(res => res.json())
      .then(data => setTrendingDishes(data))
      .catch(error => console.error('Error fetching trending dishes:', error));
  };

  useEffect(() => {
    fetchDishes();
    fetchTrendingDishes();
  }, []);

  // This callback is triggered whenever the user searches in the FeedSearchBar
  const handleSearchResults = (results) => {
    // Immediately update the feed page with new results
    setDishes(results);
  };

  return (
    <div className="feed-page">
      <NavigationBar />
      <main className="feed-main">
        <FeedSearchBar onSearch={handleSearchResults} />
        <section className="dishes-section">
          <h2>All Dishes</h2>
          <div className="dishes-grid">
            {dishes.length > 0 ? (
              dishes.slice(0, 12).map((dish) => (
                <DishCard key={dish.id} dish={dish} />
              ))
            ) : (
              <p>No dishes available.</p>
            )}
          </div>
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
      </main>
      <footer className="feed-footer">
        <p>© 2025 University Pub Dish Reviews</p>
      </footer>
    </div>
  );
}
