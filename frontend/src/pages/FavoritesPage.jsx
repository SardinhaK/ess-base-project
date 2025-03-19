"use client"

import { useState, useEffect } from "react"
import DishCard from "../components/DishCard"
import { dishesApi } from "../utils/api"
import "../styles/FavoritesPage.css"

/**
 * FavoritesPage component for iLoveRU application
 * Displays user's favorite dishes
 */
const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([])
  const [favoriteDishes, setFavoriteDishes] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  // Load favorites on component mount
  useEffect(() => {
    loadFavorites()
  }, [])

  // Load favorites from local storage and fetch dish details
  const loadFavorites = async () => {
    setIsLoading(true)
    try {
      // Load favorite IDs from local storage
      const storedFavorites = localStorage.getItem("favorites")
      const favoriteIds = storedFavorites ? JSON.parse(storedFavorites) : []
      setFavorites(favoriteIds)

      if (favoriteIds.length === 0) {
        setFavoriteDishes([])
        setIsLoading(false)
        return
      }

      // Fetch all dishes
      const allDishes = await dishesApi.getAll()

      // Filter dishes by favorite IDs
      const favorites = allDishes.filter((dish) => favoriteIds.includes(dish.id))
      setFavoriteDishes(favorites)
    } catch (error) {
      console.error("Error loading favorites:", error)
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
      // Also remove from displayed dishes
      setFavoriteDishes((prevDishes) => prevDishes.filter((dish) => dish.id !== dishId))
    }

    setFavorites(updatedFavorites)
    localStorage.setItem("favorites", JSON.stringify(updatedFavorites))
  }

  return (
    <div className="favorites-page">
      <div className="favorites-header">
        <h1>Meus Favoritos</h1>
        <p>Aqui estão os pratos que você marcou como favoritos</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando favoritos...</span>
        </div>
      ) : (
        <div className="favorites-container">
          {favoriteDishes.length > 0 ? (
            <div className="favorites-grid">
              {favoriteDishes.map((dish) => (
                <DishCard key={dish.id} dish={dish} onFavoriteToggle={handleFavoriteToggle} isFavorite={true} />
              ))}
            </div>
          ) : (
            <div className="empty-favorites">
              <div className="empty-favorites-content">
                <i className="far fa-heart empty-icon"></i>
                <h2>Nenhum favorito ainda</h2>
                <p>Você ainda não adicionou nenhum prato aos seus favoritos.</p>
                <p>Explore o feed e clique no ícone de coração para adicionar pratos aos seus favoritos.</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage

