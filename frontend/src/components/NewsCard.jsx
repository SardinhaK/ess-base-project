"use client"
import { useNavigate } from "react-router-dom"
import { PLACEHOLDER_NEWS } from "../utils/api"
import "../styles/NewsCard.css"

/**
 * NewsCard component for iLoveRU application
 * Displays a news item with title, subtitle, date, and trending badge if applicable
 *
 * @param {Object} props - Component props
 * @param {Object} props.news - News data
 * @param {boolean} props.trending - Whether the news is trending
 */
const NewsCard = ({ news, trending = false }) => {
  const navigate = useNavigate()

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  }

  // Handle click to navigate to news page with this news selected
  const handleClick = () => {
    navigate("/news", { state: { selectedNewsId: news.id } })
  }

  return (
    <div className="news-card" onClick={handleClick}>
      {/* News Image (placeholder for now) */}
      <div className="news-image">
        <img src={news.img || PLACEHOLDER_NEWS} alt={news.title} />

        {/* Trending Badge */}
        {trending && (
          <div className="trending-badge">
            <i className="fas fa-fire"></i> Em Alta
          </div>
        )}
      </div>

      {/* News Content */}
      <div className="news-card-content">
        <h3 className="news-card-title">{news.title}</h3>
        <p className="news-card-subtitle">{news.subtitle}</p>

        <div className="news-card-meta">
          <span className="news-card-date">
            <i className="far fa-calendar-alt"></i> {formatDate(news.publicationDate)}
          </span>
          <span className="news-card-views">
            <i className="fas fa-eye"></i> {news.views || 0} visualizações
          </span>
        </div>
      </div>
    </div>
  )
}

export default NewsCard

