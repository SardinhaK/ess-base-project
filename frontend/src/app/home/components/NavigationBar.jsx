// src/components/NavigationBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationBar.css';

export default function NavigationBar() {
  return (
    <nav className="nav-bar">
      <div className="nav-links">
        <Link to="/" className="nav-link">Feed</Link>
        <Link to="/news" className="nav-link">News</Link>
        <Link to="/favorites" className="nav-link">Favorites</Link>
        <Link to="/admin" className="nav-link">Admin</Link>
      </div>
    </nav>
  );
}
