"use client"

import { useState, useEffect, useRef } from "react"
import DishCard from "./DishCard"
import NewsCard from "./NewsCard"
import "../styles/FeaturedCarousel.css"

/**
 * FeaturedCarousel component for iLoveRU application
 * Displays trending items in a cyclic format with one featured item at a time
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display (dishes and news)
 * @param {string} props.title - Carousel section title
 * @param {string} props.description - Carousel section description
 * @param {function} props.onFavoriteToggle - Function to toggle favorite status
 * @param {Array} props.favorites - Array of favorited dish IDs
 */
const FeaturedCarousel = ({ items = [], title, description, onFavoriteToggle, favorites = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef(null)

  // Start the automatic rotation when component mounts
  useEffect(() => {
    if (items.length > 1) {
      startRotation()
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [items])

  // Start automatic rotation
  const startRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    intervalRef.current = setInterval(() => {
      rotateToNext()
    }, 4000) // Change every 4 seconds
  }

  // Rotate to the next item
  const rotateToNext = () => {
    if (items.length <= 1) return

    setIsTransitioning(true)

    // After a short delay, change the active index
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % items.length)

      // After the transition is complete, reset the transition state
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  // Rotate to the previous item
  const rotateToPrev = () => {
    if (items.length <= 1) return

    setIsTransitioning(true)

    // After a short delay, change the active index
    setTimeout(() => {
      setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length)

      // After the transition is complete, reset the transition state
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)
    }, 300)
  }

  // Handle manual navigation
  const handleNavClick = (index) => {
    if (index === activeIndex) return

    // Reset the interval when manually navigating
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }

    setIsTransitioning(true)

    // After a short delay, change the active index
    setTimeout(() => {
      setActiveIndex(index)

      // After the transition is complete, reset the transition state
      setTimeout(() => {
        setIsTransitioning(false)
      }, 300)

      // Restart the rotation
      startRotation()
    }, 300)
  }

  // Check if a dish is favorited
  const isFavorite = (dishId) => {
    return favorites.includes(dishId)
  }

  // Determine if an item is a dish or news
  const isItemDish = (item) => {
    return item.type === "dish" || (!item.type && item.rating !== undefined)
  }

  // Render the active item
  const renderActiveItem = () => {
    if (items.length === 0) return null

    const item = items[activeIndex]

    if (isItemDish(item)) {
      return (
        <div className={`featured-item ${isTransitioning ? "transitioning" : ""}`}>
          <DishCard
            dish={item}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite(item.id)}
            isTrending={true}
          />
        </div>
      )
    } else {
      return (
        <div className={`featured-item ${isTransitioning ? "transitioning" : ""}`}>
          <NewsCard news={item} trending={true} />
        </div>
      )
    }
  }

  return (
    <div className="featured-carousel-section">
      {/* Section Header */}
      {(title || description) && (
        <div className="carousel-header">
          {title && <h2 className="carousel-title">{title}</h2>}
          {description && <p className="carousel-description">{description}</p>}
        </div>
      )}

      {/* Featured Carousel Container */}
      <div className="featured-carousel-container">
        {items.length > 0 ? (
          <>
            {/* Navigation Arrows */}
            {items.length > 1 && (
              <>
                <button className="featured-nav-arrow prev-arrow" onClick={rotateToPrev} aria-label="Previous item">
                  <i className="fas fa-chevron-left"></i>
                </button>

                <button className="featured-nav-arrow next-arrow" onClick={rotateToNext} aria-label="Next item">
                  <i className="fas fa-chevron-right"></i>
                </button>
              </>
            )}

            {/* Featured Item */}
            {renderActiveItem()}

            {/* Navigation Dots */}
            {items.length > 1 && (
              <div className="featured-nav-dots">
                {items.map((_, index) => (
                  <button
                    key={index}
                    className={`nav-dot ${index === activeIndex ? "active" : ""}`}
                    onClick={() => handleNavClick(index)}
                    aria-label={`Go to item ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="empty-featured">
            <p>Nenhum item em alta disponível</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeaturedCarousel

