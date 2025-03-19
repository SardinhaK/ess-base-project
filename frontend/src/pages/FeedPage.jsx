"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Button from "../components/Button"
import Carousel from "../components/Carousel"
import DishCard from "../components/DishCard"
import { dishesApi, trendingApi } from "../utils/api"
import "../styles/FeedPage.css"

/**
 * FeedPage component for iLoveRU application
 * Main landing page with hero section, carousels, and dish grid
 */
const FeedPage = () => {
  const [dishes, setDishes] = useState([])
  const [trendingDishes, setTrendingDishes] = useState([])
  const [activeSection, setActiveSection] = useState("trending")
  const [favorites, setFavorites] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [searchParams, setSearchParams] = useState(null)

  const location = useLocation()

  // Check for search results in location state
  useEffect(() => {
    if (location.state) {
      if (location.state.searchResults) {
        setSearchResults(location.state.searchResults)
        setSearchParams(location.state.searchParams)
      } else if (location.state.searchError) {
        setSearchResults([])
        setError(location.state.searchError)
        setSearchParams(location.state.searchParams)
      }
      // Clear location state to prevent showing the same results after refresh
      window.history.replaceState({}, document.title)
    }
  }, [location])

  // Fetch dishes on component mount
  useEffect(() => {
    fetchDishes()
  }, [])

  // Fetch dishes from API
  const fetchDishes = async () => {
    setIsLoading(true)
    setError(null)
    try {
      // Fetch all dishes
      const dishesData = await dishesApi.getAll()
      if (Array.isArray(dishesData)) {
        setDishes(dishesData)
      } else {
        console.error("Dishes data is not an array:", dishesData)
        setDishes([])
      }

      // Fetch trending dishes
      try {
        const trendingData = await trendingApi.getTrending()
        if (Array.isArray(trendingData)) {
          setTrendingDishes(trendingData)
        } else {
          console.error("Trending dishes data is not an array:", trendingData)
          // Fallback: filtrar pratos em alta dos pratos já carregados
          if (Array.isArray(dishesData)) {
            setTrendingDishes(dishesData.filter((dish) => dish.trending))
          } else {
            setTrendingDishes([])
          }
        }
      } catch (trendingError) {
        console.error("Error fetching trending dishes:", trendingError)
        // Fallback: filtrar pratos em alta dos pratos já carregados
        if (Array.isArray(dishesData)) {
          setTrendingDishes(dishesData.filter((dish) => dish.trending))
        } else {
          setTrendingDishes([])
        }
      }

      // Load favorites from local storage
      const storedFavorites = localStorage.getItem("favorites")
      if (storedFavorites) {
        try {
          const parsedFavorites = JSON.parse(storedFavorites)
          if (Array.isArray(parsedFavorites)) {
            setFavorites(parsedFavorites)
          } else {
            console.error("Stored favorites is not an array:", parsedFavorites)
            setFavorites([])
          }
        } catch (parseError) {
          console.error("Error parsing stored favorites:", parseError)
          setFavorites([])
        }
      }
    } catch (error) {
      console.error("Error fetching dishes:", error)
      setError("Erro ao carregar os pratos. Por favor, tente novamente mais tarde.")
      setDishes([])
      setTrendingDishes([])
    } finally {
      setIsLoading(false)
    }
  }

  // Toggle favorite status
  const handleFavoriteToggle = (dishId, isFavorite) => {
    let updatedFavorites

    if (isFavorite) {
      updatedFavorites = [...favorites, dishId]
    } else {
      updatedFavorites = favorites.filter((id) => id !== dishId)
    }

    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  // Get most viewed dishes
  const getMostViewedDishes = () => {
    if (!Array.isArray(dishes) || dishes.length === 0) return []
    return [...dishes]
      .filter((dish) => dish && typeof dish === "object")
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 10)
  }

  // Get best rated dishes
  const getBestRatedDishes = () => {
    if (!Array.isArray(dishes) || dishes.length === 0) return []
    return [...dishes]
      .filter((dish) => dish && typeof dish === "object" && dish.rating !== undefined && dish.rating !== null)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 10)
  }

  // Get carousel data based on active section
  const getCarouselData = () => {
    switch (activeSection) {
      case "most-viewed":
        return {
          items: getMostViewedDishes(),
          title: "Pratos Mais Vistos",
          description: "Os pratos mais populares do Restaurante Universitário",
        }
      case "best-rated":
        return {
          items: getBestRatedDishes(),
          title: "Melhores Avaliados",
          description: "Os pratos com as melhores avaliações dos usuários",
        }
      case "trending":
      default:
        return {
          items: trendingDishes,
          title: "Em Alta",
          description: "Os pratos que estão fazendo sucesso agora",
        }
    }
  }

  // Get carousel data
  const carouselData = getCarouselData()

  // Format search parameters for display
  const formatSearchParams = (params) => {
    if (!params) return ""

    const parts = []
    if (params.name) parts.push(`"${params.name}"`)
    if (params.category) parts.push(`Categoria: ${params.category}`)
    if (params.minNota) parts.push(`Nota mínima: ${params.minNota}`)
    if (params.maxNota) parts.push(`Nota máxima: ${params.maxNota}`)
    if (params.minViews) parts.push(`Views mínimas: ${params.minViews}`)
    if (params.maxViews) parts.push(`Views máximas: ${params.maxViews}`)

    return parts.join(", ")
  }

  // Clear search results
  const clearSearchResults = () => {
    setSearchResults(null)
    setSearchParams(null)
    setError(null)
  }

  return (
    <div className="feed-page">
      {/* Search Results Banner (if search was performed) */}
      {(searchResults || error) && searchParams && (
        <div className={`search-results-banner ${error ? "error" : ""}`}>
          <div className="search-results-content">
            {error ? (
              <h2>
                <i className="fas fa-exclamation-circle"></i> {error}
              </h2>
            ) : (
              <h2>
                <i className="fas fa-search"></i> Resultados da busca: {searchResults.length} prato(s) encontrado(s)
              </h2>
            )}
            <p>Parâmetros: {formatSearchParams(searchParams)}</p>
            <button onClick={clearSearchResults} className="clear-search-button">
              <i className="fas fa-times"></i> Limpar busca
            </button>
          </div>
        </div>
      )}

      {/* Hero Section (hide if showing search results) */}
      {!searchResults && (
        <section className="hero-section">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">O que você procura?</h1>

              <div className="hero-buttons">
                <Button
                  text="Mais Vistos"
                  type={activeSection === "most-viewed" ? "primary" : "secondary"}
                  isActive={activeSection === "most-viewed"}
                  onClick={() => setActiveSection("most-viewed")}
                />

                <Button
                  text="Em Alta"
                  type={activeSection === "trending" ? "primary" : "secondary"}
                  isActive={activeSection === "trending"}
                  onClick={() => setActiveSection("trending")}
                />

                <Button
                  text="Melhores Avaliados"
                  type={activeSection === "best-rated" ? "primary" : "secondary"}
                  isActive={activeSection === "best-rated"}
                  onClick={() => setActiveSection("best-rated")}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Carousel Section (hide if showing search results) */}
      {!searchResults && (
        <section className="carousel-section-container">
          {isLoading ? (
            <div className="loading-spinner">
              <i className="fas fa-spinner fa-spin"></i>
              <span>Carregando...</span>
            </div>
          ) : error && !searchParams ? (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              <span>{error}</span>
            </div>
          ) : (
            <Carousel
              items={carouselData.items || []}
              title={carouselData.title}
              description={carouselData.description}
              onFavoriteToggle={handleFavoriteToggle}
              favorites={favorites}
            />
          )}
        </section>
      )}

      {/* All Dishes or Search Results Grid */}
      <section className="dishes-grid-section">
        <div className="section-header">
          {searchResults ? (
            <h2>Resultados da Busca</h2>
          ) : (
            <>
              <h2>Todos os Pratos</h2>
              <p>Explore todos os pratos disponíveis no Restaurante Universitário</p>
            </>
          )}
        </div>

        {isLoading && !searchResults ? (
          <div className="loading-spinner">
            <i className="fas fa-spinner fa-spin"></i>
            <span>Carregando...</span>
          </div>
        ) : error && !searchParams ? (
          <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            <span>{error}</span>
          </div>
        ) : (
          <div className="dishes-grid">
            {searchResults ? (
              searchResults.length > 0 ? (
                searchResults.map((dish, index) => (
                  <DishCard
                    key={`${dish.id}-${index}`}
                    dish={dish}
                    onFavoriteToggle={handleFavoriteToggle}
                    isFavorite={favorites.includes(dish.id)}
                  />
                ))
              ) : (
                <div className="empty-grid">
                  <p>Nenhum prato encontrado com esses filtros</p>
                </div>
              )
            ) : dishes && dishes.length > 0 ? (
              dishes.map((dish, index) => (
                <DishCard
                  key={`${dish.id}-${index}`}
                  dish={dish}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={favorites.includes(dish.id)}
                />
              ))
            ) : (
              <div className="empty-grid">
                <p>Nenhum prato disponível</p>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default FeedPage

