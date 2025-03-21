"use client"

import { useState, useRef, useEffect } from "react"
import DishCard from "./DishCard"
import NewsCard from "./NewsCard"
import "../styles/Carousel.css"

/**
 * Carousel component for iLoveRU application
 * Displays a horizontal scrollable list of DishCards or NewsCards
 *
 * @param {Object} props - Component props
 * @param {Array} props.items - Array of items to display (dishes or news)
 * @param {string} props.title - Carousel section title
 * @param {string} props.description - Carousel section description
 * @param {function} props.onFavoriteToggle - Function to toggle favorite status
 * @param {Array} props.favorites - Array of favorited dish IDs
 * @param {string} props.itemType - Type of items to display ("dish", "news", or "mixed")
 * @param {Array} props.trendingItems - Array of trending items to check against
 */
const Carousel = ({
  items = [],
  title,
  description,
  onFavoriteToggle,
  favorites = [],
  itemType = "dish",
  trendingItems = [],
}) => {
  const carouselRef = useRef(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeftState, setScrollLeftState] = useState(0)

  // Check if arrows should be displayed
  useEffect(() => {
    const checkArrows = () => {
      if (!carouselRef.current) return

      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }

    // Initial check
    checkArrows()

    // Add scroll event listener
    const carousel = carouselRef.current
    if (carousel) {
      carousel.addEventListener("scroll", checkArrows)
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener("scroll", checkArrows)
      }
    }
  }, [items])

  // Scroll left
  const scrollLeft = () => {
    if (!carouselRef.current) return

    const scrollAmount = carouselRef.current.clientWidth * 0.8
    carouselRef.current.scrollBy({
      left: -scrollAmount,
      behavior: "smooth",
    })
  }

  // Scroll right
  const scrollRight = () => {
    if (!carouselRef.current) return

    const scrollAmount = carouselRef.current.clientWidth * 0.8
    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: "smooth",
    })
  }

  // Mouse down handler for drag scrolling
  const handleMouseDown = (e) => {
    setIsDragging(true)
    setStartX(e.pageX - carouselRef.current.offsetLeft)
    setScrollLeftState(carouselRef.current.scrollLeft)
  }

  // Mouse leave handler
  const handleMouseLeave = () => {
    setIsDragging(false)
  }

  // Mouse up handler
  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Mouse move handler for drag scrolling
  const handleMouseMove = (e) => {
    if (!isDragging) return
    e.preventDefault()

    const x = e.pageX - carouselRef.current.offsetLeft
    const walk = (x - startX) * 2 // Scroll speed multiplier
    carouselRef.current.scrollLeft = scrollLeftState - walk
  }

  // Check if a dish is favorited
  const isFavorite = (dishId) => {
    return favorites.includes(dishId)
  }

  // Check if a dish is in the trending list
  const isDishTrending = (dishId) => {
    return trendingItems.some(
      (item) => item.id === dishId && (item.type === "dish" || (!item.type && item.rating !== undefined)),
    )
  }

  // Determine if an item is a dish or news
  const isItemDish = (item) => {
    return item.type === "dish" || (!item.type && item.rating !== undefined)
  }

  // Render appropriate card based on item type
  const renderItem = (item, index) => {
    if (itemType === "mixed") {
      // For mixed type, determine each item individually
      if (isItemDish(item)) {
        return (
          <div key={`dish-${item.id}-${index}`} className="carousel-item">
            <DishCard
              dish={item}
              onFavoriteToggle={onFavoriteToggle}
              isFavorite={isFavorite(item.id)}
              isTrending={true} // Items in trending carousel are always trending
            />
          </div>
        )
      } else {
        return (
          <div key={`news-${item.id}-${index}`} className="carousel-item">
            <NewsCard news={item} trending={true} />
          </div>
        )
      }
    } else if (itemType === "news") {
      return (
        <div key={`news-${item.id}-${index}`} className="carousel-item">
          <NewsCard news={item} trending={true} />
        </div>
      )
    } else {
      // Default to dish type
      return (
        <div key={`dish-${item.id}-${index}`} className="carousel-item">
          <DishCard
            dish={item}
            onFavoriteToggle={onFavoriteToggle}
            isFavorite={isFavorite(item.id)}
            isTrending={isDishTrending(item.id)} // Check if this dish is in the trending list
          />
        </div>
      )
    }
  }

  return (
    <div className="carousel-section">
      {/* Section Header */}
      {(title || description) && (
        <div className="carousel-header">
          {title && <h2 className="carousel-title">{title}</h2>}
          {description && <p className="carousel-description">{description}</p>}
        </div>
      )}

      {/* Carousel Container */}
      <div className="carousel-container">
        {/* Left Arrow */}
        {showLeftArrow && (
          <button className="carousel-arrow left-arrow" onClick={scrollLeft} aria-label="Scroll left">
            <i className="fas fa-chevron-left"></i>
          </button>
        )}

        {/* Carousel Items */}
        <div
          className="carousel-items"
          ref={carouselRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
        >
          {items.length > 0 ? (
            items.map((item, index) => renderItem(item, index))
          ) : (
            <div className="empty-carousel">
              <p>Nenhum item disponível</p>
            </div>
          )}
        </div>

        {/* Right Arrow */}
        {showRightArrow && (
          <button className="carousel-arrow right-arrow" onClick={scrollRight} aria-label="Scroll right">
            <i className="fas fa-chevron-right"></i>
          </button>
        )}
      </div>
    </div>
  )
}

export default Carousel

