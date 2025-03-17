// src/app/home/pages/favorites/FavoritesPage.jsx
import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import './FavoritesPage.css';

export default function FavoritesPage() {
  return (
    <div className="favorites-page">
      <NavigationBar />
      <header className="favorites-header">
        <h1>Favorites</h1>
      </header>
      <main className="favorites-content">
        <p>Your favorite dishes will appear here. (Coming soon...)</p>
      </main>
      <footer className="favorites-footer">
        <p>© 2025 University Pub Dish Reviews</p>
      </footer>
    </div>
  );
}
