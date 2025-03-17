// src/components/FeedSearchBar.jsx
import React, { useState } from 'react';
import './FeedSearchBar.css';

export default function FeedSearchBar({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [minNota, setMinNota] = useState('');
  const [maxNota, setMaxNota] = useState('');
  const [minViews, setMinViews] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append('name', searchTerm);
    if (category) params.append('category', category);
    if (minNota) params.append('minNota', minNota);
    if (maxNota) params.append('maxNota', maxNota);
    if (minViews) params.append('minViews', minViews);
    if (maxViews) params.append('maxViews', maxViews);

    fetch(`http://localhost:4001/search?${params.toString()}`)
      .then(res => {
        if (!res.ok) {
          if (res.status === 404) return [];
          throw new Error('Search error');
        }
        return res.json();
      })
      .then(data => {
        onSearch(data);
      })
      .catch(error => {
        console.error('Error performing search:', error);
        onSearch([]);
      });
  };

  return (
    <form className="feed-search-form" onSubmit={handleSearch}>
      <div className="search-main">
        <input
          type="text"
          placeholder="Search dishes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="search-btn">Search</button>
        <button type="button" className="filter-toggle-btn" onClick={toggleFilters}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>
      {showFilters && (
        <div className="search-filters">
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Min Rating"
            value={minNota}
            onChange={(e) => setMinNota(e.target.value)}
          />
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            placeholder="Max Rating"
            value={maxNota}
            onChange={(e) => setMaxNota(e.target.value)}
          />
          <input
            type="number"
            placeholder="Min Views"
            value={minViews}
            onChange={(e) => setMinViews(e.target.value)}
          />
          <input
            type="number"
            placeholder="Max Views"
            value={maxViews}
            onChange={(e) => setMaxViews(e.target.value)}
          />
        </div>
      )}
    </form>
  );
}
