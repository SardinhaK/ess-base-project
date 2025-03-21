"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import Button from "../components/Button"
import Carousel from "../components/Carousel"
import FeaturedCarousel from "../components/FeaturedCarousel"
import DishCard from "../components/DishCard"
import { dishesApi, trendingApi } from "../utils/api"
import "../styles/FeedPage.css"

/**
 * FeedPage component for iLoveRU application
 * Main landing page with hero section, carousels, and dish grid
 */
const FeedPage = () => {
  const [dishes, setDishes] = useState([])
  const [trendingItems, setTrendingItems] = useState([])
  const [mostViewedDishes, setMostViewedDishes] = useState([])
  const [bestRatedDishes, setBestRatedDishes] = useState([])
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
      } else if (location.state.selectedNewsId) {
        // If coming from a trending news item, we don't need to do anything here
        // The NewsPage component will handle the selection
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

      // Fetch most viewed dishes
      try {
        const mostViewedData = await dishesApi.getMostViewed()
        if (Array.isArray(mostViewedData)) {
          setMostViewedDishes(mostViewedData)
        } else {
          console.error("Most viewed dishes data is not an array:", mostViewedData)
          setMostViewedDishes([])
        }
      } catch (mostViewedError) {
        console.error("Error fetching most viewed dishes:", mostViewedError)
        setMostViewedDishes([])
      }

      // Fetch best rated dishes
      try {
        const bestRatedData = await dishesApi.getBestRated()
        if (Array.isArray(bestRatedData)) {
          setBestRatedDishes(bestRatedData)
        } else {
          console.error("Best rated dishes data is not an array:", bestRatedData)
          setBestRatedDishes([])
        }
      } catch (bestRatedError) {
        console.error("Error fetching best rated dishes:", bestRatedError)
        setBestRatedDishes([])
      }

      // Fetch trending items (dishes and news)
      try {
        const trendingData = await trendingApi.getTrending()
        if (Array.isArray(trendingData)) {
          setTrendingItems(trendingData)
        } else {
          console.error("Trending items data is not an array:", trendingData)
          setTrendingItems([])
        }
      } catch (trendingError) {
        console.error("Error fetching trending items:", trendingError)
        setTrendingItems([])
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
      setTrendingItems([])
      setMostViewedDishes([])
      setBestRatedDishes([])
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

  // Check if a dish is in the trending list
  const isDishTrending = (dishId) => {
    return trendingItems.some(
      (item) => item.id === dishId && (item.type === "dish" || (!item.type && item.rating !== undefined)),
    )
  }

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

  // Render carousel based on active section
  const renderCarousel = () => {
    if (activeSection === "trending") {
      return (
        <FeaturedCarousel
          items={trendingItems}
          title="Em Alta"
          description="Os itens que estão fazendo sucesso agora"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
        />
      )
    } else if (activeSection === "most-viewed") {
      return (
        <Carousel
          items={mostViewedDishes}
          title="Pratos Mais Vistos"
          description="Os pratos mais populares do Restaurante Universitário"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          itemType="dish"
          trendingItems={trendingItems}
        />
      )
    } else if (activeSection === "best-rated") {
      return (
        <Carousel
          items={bestRatedDishes}
          title="Melhores Avaliados"
          description="Os pratos com as melhores avaliações dos usuários"
          onFavoriteToggle={handleFavoriteToggle}
          favorites={favorites}
          itemType="dish"
          trendingItems={trendingItems}
        />
      )
    }

    // Default to trending if no match
    return (
      <FeaturedCarousel
        items={trendingItems}
        title="Em Alta"
        description="Os itens que estão fazendo sucesso agora"
        onFavoriteToggle={handleFavoriteToggle}
        favorites={favorites}
      />
    )
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
              <i className="fas fa-times"></i> Retornar
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
            renderCarousel()
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
                    isTrending={isDishTrending(dish.id)}
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
                  isTrending={isDishTrending(dish.id)}
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

