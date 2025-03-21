"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { searchApi } from "../utils/api"
import { categoriesApi } from "../utils/api"
import "../styles/SearchBar.css"

/**
 * SearchBar component for iLoveRU application
 * Includes search input, advanced filters, and search history
 */
const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [categories, setCategories] = useState([])
  const [filters, setFilters] = useState({
    category: "",
    minNota: "",
    maxNota: "",
    minViews: "",
    maxViews: "",
  })
  const [selectedHistoryItem, setSelectedHistoryItem] = useState(null)

  const searchBarRef = useRef(null)
  const filtersRef = useRef(null)
  const historyRef = useRef(null)
  const navigate = useNavigate()

  // Fetch search history and categories on component mount
  useEffect(() => {
    fetchSearchHistory()
    fetchCategories()

    // Add click outside listener to close dropdowns
    const handleClickOutside = (event) => {
      if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
        setShowHistory(false)
        setShowFilters(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  useEffect(() => {
    if (selectedHistoryItem) {
      setSearchTerm(selectedHistoryItem.termo || "")
      if (selectedHistoryItem.filtros) {
        setFilters({
          ...filters,
          ...selectedHistoryItem.filtros,
        })
      }
      setShowHistory(false)
      setSelectedHistoryItem(null)
    }
  }, [selectedHistoryItem])

  // Fetch search history from API
  const fetchSearchHistory = async () => {
    try {
      const history = await searchApi.getHistory()
      setSearchHistory(history)
    } catch (error) {
      console.error("Error fetching search history:", error)
    }
  }

  // Fetch categories from API
  const fetchCategories = async () => {
    try {
      const categoriesData = await categoriesApi.getAll()
      setCategories(categoriesData)
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  // Handle search submission
  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim() && !Object.values(filters).some((v) => v)) return

    try {
      // Prepare search parameters
      const searchParams = {
        name: searchTerm.trim(),
      }

      // Add filters if they exist
      if (filters.category) {
        // Use the category name, not ID
        const selectedCategory = categories.find((cat) => cat.id.toString() === filters.category)
        if (selectedCategory) {
          searchParams.category = selectedCategory.name
        }
      }

      if (filters.minNota) searchParams.minNota = filters.minNota
      if (filters.maxNota) searchParams.maxNota = filters.maxNota
      if (filters.minViews) searchParams.minViews = filters.minViews
      if (filters.maxViews) searchParams.maxViews = filters.maxViews

      // Perform search
      const searchResults = await searchApi.search(searchParams)

      // Navigate to feed page with search results
      navigate("/", {
        state: {
          searchResults,
          searchParams,
        },
      })

      // Refresh search history
      fetchSearchHistory()

      // Reset search term and close dropdowns
      setSearchTerm("")
      setShowHistory(false)
      setShowFilters(false)
    } catch (error) {
      console.error("Error performing search:", error)
      // Navigate to feed page with error
      navigate("/", {
        state: {
          searchError: "Nenhum prato encontrado com esses filtros",
          searchParams: {
            name: searchTerm,
            ...filters,
          },
        },
      })
    }
  }

  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // Delete search history item
  const deleteHistoryItem = async (index, e) => {
    e.stopPropagation()
    try {
      await searchApi.deleteFromHistory(index)
      fetchSearchHistory()
    } catch (error) {
      console.error("Error deleting search history item:", error)
    }
  }

  // Clear all search history
  const clearAllHistory = async () => {
    try {
      await searchApi.clearHistory()
      setSearchHistory([])
    } catch (error) {
      console.error("Error clearing search history:", error)
    }
  }

  // Use search history item
  const handleHistoryItemClick = (item) => {
    setSelectedHistoryItem(item)
  }

  const useHistoryItem = (item) => {
    setSelectedHistoryItem(item)
  }

  return (
    <div className="search-bar" ref={searchBarRef}>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setShowHistory(true)}
            placeholder="Buscar pratos..."
            className="search-input"
          />

          {/* Settings/Filter icon */}
          <button type="button" className="filter-button" onClick={() => setShowFilters(!showFilters)}>
            <i className="fas fa-cog"></i>
          </button>

          {/* Search button */}
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>

        {/* Advanced filters dropdown */}
        {showFilters && (
          <div className="filters-dropdown" ref={filtersRef}>
            <h3>Filtros Avançados</h3>

            <div className="filter-group">
              <label>Categoria:</label>
              <select name="category" value={filters.category} onChange={handleFilterChange}>
                <option value="">Todas as categorias</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Nota Mínima:</label>
                <input
                  type="number"
                  name="minNota"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.minNota}
                  onChange={handleFilterChange}
                />
              </div>

              <div className="filter-group">
                <label>Nota Máxima:</label>
                <input
                  type="number"
                  name="maxNota"
                  min="0"
                  max="5"
                  step="0.1"
                  value={filters.maxNota}
                  onChange={handleFilterChange}
                />
              </div>
            </div>

            <div className="filter-row">
              <div className="filter-group">
                <label>Views Mínimas:</label>
                <input type="number" name="minViews" min="0" value={filters.minViews} onChange={handleFilterChange} />
              </div>

              <div className="filter-group">
                <label>Views Máximas:</label>
                <input type="number" name="maxViews" min="0" value={filters.maxViews} onChange={handleFilterChange} />
              </div>
            </div>

            <div className="filter-actions">
              <button
                type="button"
                onClick={() =>
                  setFilters({
                    category: "",
                    minNota: "",
                    maxNota: "",
                    minViews: "",
                    maxViews: "",
                  })
                }
                className="clear-filters-button"
              >
                Limpar Filtros
              </button>

              <button type="button" onClick={() => setShowFilters(false)} className="apply-filters-button">
                Aplicar
              </button>
            </div>
          </div>
        )}

        {/* Search history dropdown */}
        {showHistory && searchHistory.length > 0 && (
          <div className="history-dropdown" ref={historyRef}>
            <div className="history-header">
              <h3>Histórico de Buscas</h3>
              <button type="button" onClick={clearAllHistory} className="clear-history-button">
                Limpar Tudo
              </button>
            </div>

            <ul className="history-list">
              {searchHistory.map((item, index) => (
                <li key={index} onClick={() => handleHistoryItemClick(item)}>
                  <span className="history-item-text">
                    {item.termo || "Busca sem termo"}
                    {item.filtros && Object.values(item.filtros).some((v) => v) && (
                      <span className="history-item-filters">(com filtros)</span>
                    )}
                  </span>
                  <button type="button" onClick={(e) => deleteHistoryItem(index, e)} className="delete-history-item">
                    <i className="fas fa-times"></i>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </form>
    </div>
  )
}

export default SearchBar

