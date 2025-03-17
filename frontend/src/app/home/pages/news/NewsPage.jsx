// src/app/home/pages/news/NewsPage.jsx
import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import './NewsPage.css';

export default function NewsPage() {
  return (
    <div className="news-page">
      <NavigationBar />
      <header className="news-header">
        <h1>News</h1>
      </header>
      <main className="news-content">
        <p>This is the news page. Content coming soon...</p>
      </main>
      <footer className="news-footer">
        <p>© 2025 University Pub Dish Reviews</p>
      </footer>
    </div>
  );
}
