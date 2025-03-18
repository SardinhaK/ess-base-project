// src/components/FeedSearchBar.jsx
import React, { useState, useEffect, useRef } from 'react';
import { MdSearch, MdSettings } from 'react-icons/md';
import './FeedSearchBar.css';

export default function FeedSearchBar({ onSearch }) {
  // Basic search term
  const [searchTerm, setSearchTerm] = useState('');

  // Advanced filters
  const [showFilters, setShowFilters] = useState(false);
  const [category, setCategory] = useState('');
  const [minNota, setMinNota] = useState('');
  const [maxNota, setMaxNota] = useState('');
  const [minViews, setMinViews] = useState('');
  const [maxViews, setMaxViews] = useState('');

  // Search history
  const [searchHistory, setSearchHistory] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const inputRef = useRef(null);

  // Fetch existing search history from backend
  const fetchHistory = () => {
    fetch('http://localhost:4001/search/historico')
      .then((res) => res.json())
      .then((data) => {
        // Filter out completely empty queries
        const filtered = data.filter((item) => {
          const hasTerm = item.termo && item.termo.trim() !== '';
          const hasFilters =
            item.filtros && Object.keys(item.filtros).length > 0;
          return hasTerm || hasFilters;
        });
        setSearchHistory(filtered);
      })
      .catch((error) =>
        console.error('Error fetching search history:', error)
      );
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  // Build query params from both searchTerm and advanced filters
  const buildQueryParams = () => {
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.append('name', searchTerm.trim());
    }
    if (category.trim()) {
      params.append('category', category.trim());
    }
    if (minNota.trim()) {
      params.append('minNota', minNota.trim());
    }
    if (maxNota.trim()) {
      params.append('maxNota', maxNota.trim());
    }
    if (minViews.trim()) {
      params.append('minViews', minViews.trim());
    }
    if (maxViews.trim()) {
      params.append('maxViews', maxViews.trim());
    }
    return params;
  };

  // Handle main search (triggered by Enter or search button)
  const handleSearch = (e) => {
    e.preventDefault();
    const params = buildQueryParams();

    fetch(`http://localhost:4001/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return [];
          throw new Error('Search error');
        }
        return res.json();
      })
      .then((data) => {
        onSearch(data);
        fetchHistory();
      })
      .catch((error) => {
        console.error('Error performing search:', error);
        onSearch([]);
      });
    setShowSuggestions(false);
  };

  // Toggle advanced filters
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  // Show suggestions on focus
  const handleFocus = () => {
    setShowSuggestions(true);
  };

  // Delay hiding suggestions to allow clicks on them
  const handleBlur = () => {
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  // Click on a suggestion to re-run that search
  const handleSuggestionClick = (item, index) => {
    const params = new URLSearchParams();
    if (item.termo) params.append('name', item.termo);
    if (item.filtros) {
      Object.entries(item.filtros).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          params.append(key, value);
        }
      });
    }
    fetch(`http://localhost:4001/search?${params.toString()}`)
      .then((res) => {
        if (!res.ok) {
          if (res.status === 404) return [];
          throw new Error('Search error');
        }
        return res.json();
      })
      .then((data) => {
        onSearch(data);
        fetchHistory();
      })
      .catch((error) => {
        console.error('Error performing search:', error);
        onSearch([]);
      });
    setShowSuggestions(false);
  };

  // Delete a single history entry
  const handleDeleteSuggestion = (index, e) => {
    e.stopPropagation(); // prevent suggestion click
    fetch(`http://localhost:4001/search/historico/${index}`, {
      method: 'DELETE',
    })
      .then(() => fetchHistory())
      .catch((error) =>
        console.error('Error deleting history entry:', error)
      );
  };

  // Format a history entry for display
  const formatHistoryEntry = (item) => {
    const parts = [];
    if (item.termo && item.termo.trim() !== '') {
      parts.push(item.termo);
    }
    if (item.filtros) {
      Object.entries(item.filtros).forEach(([key, value]) => {
        if (value && value.toString().trim() !== '') {
          parts.push(`${key}: ${value}`);
        }
      });
    }
    return parts.join(', ');
  };

  return (
    <div className="google-like-search">
      <form className="google-search-form" onSubmit={handleSearch}>
        <div className="google-search-bar">
          <input
            ref={inputRef}
            type="text"
            placeholder="Pesquise pratos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          <button
            type="button"
            className="gear-btn"
            onClick={toggleFilters}
            aria-label="Toggle advanced filters"
          >
            <MdSettings className="icon" />
          </button>
          <button type="submit" className="search-btn" aria-label="Search">
            <MdSearch className="icon" />
          </button>
        </div>

        {showFilters && (
          <div className="advanced-filters">
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

      {showSuggestions && searchHistory.length > 0 && (
        <ul className="google-suggestions">
          {searchHistory.map((item, index) => (
            <li
              key={index}
              className="suggestion-item"
              onClick={() => handleSuggestionClick(item, index)}
            >
              <span className="suggestion-text">
                {formatHistoryEntry(item)}
              </span>
              <span
                className="suggestion-delete"
                onClick={(e) => handleDeleteSuggestion(index, e)}
              >
                Excluir
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
