"use client"

import { useState, useEffect } from "react"
import { useLocation } from "react-router-dom"
import { newsApi } from "../utils/api"
import "../styles/NewsPage.css"

/**
 * NewsPage component for iLoveRU application
 * Displays news articles from the restaurant
 */
const NewsPage = () => {
  const [news, setNews] = useState([])
  const [selectedNews, setSelectedNews] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const location = useLocation()

  // Fetch news on component mount
  useEffect(() => {
    fetchNews()
  }, [])

  // Check for selected news in location state
  useEffect(() => {
    if (location.state && location.state.selectedNewsId && news.length > 0) {
      const newsItem = news.find((item) => item.id === location.state.selectedNewsId)
      if (newsItem) {
        setSelectedNews(newsItem)
      }
      // Clear location state
      window.history.replaceState({}, document.title)
    }
  }, [location.state, news])

  // Fetch news from API
  const fetchNews = async () => {
    setIsLoading(true)
    try {
      const newsData = await newsApi.getAll()
      setNews(newsData)

      // Select the first news item by default if available
      if (newsData.length > 0 && !selectedNews) {
        // Check if we have a selected news ID from location state
        if (location.state && location.state.selectedNewsId) {
          const newsItem = newsData.find((item) => item.id === location.state.selectedNewsId)
          if (newsItem) {
            setSelectedNews(newsItem)
          } else {
            setSelectedNews(newsData[0])
          }
        } else {
          setSelectedNews(newsData[0])
        }
      }
    } catch (error) {
      console.error("Error fetching news:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Format date for display
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    // Fix the date issue by adding the timezone offset
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", options)
  }

  // Select a news item
  const handleSelectNews = (newsItem) => {
    setSelectedNews(newsItem)

    // Scroll to top on mobile
    if (window.innerWidth < 768) {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Notícias do RU</h1>
        <p>Fique por dentro das novidades do Restaurante Universitário</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando notícias...</span>
        </div>
      ) : (
        <div className="news-container">
          {/* News Sidebar */}
          <div className="news-sidebar">
            <h2>Últimas Notícias</h2>

            {news.length > 0 ? (
              <ul className="news-list">
                {news.map((item) => (
                  <li
                    key={item.id}
                    className={`news-item ${selectedNews && selectedNews.id === item.id ? "active" : ""}`}
                    onClick={() => handleSelectNews(item)}
                  >
                    <div className="news-item-content">
                      <h3>{item.title}</h3>
                      <span className="news-date">{formatDate(item.publicationDate)}</span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="empty-news">
                <p>Nenhuma notícia disponível</p>
              </div>
            )}
          </div>

          {/* News Content */}
          <div className="news-content">
            {selectedNews ? (
              <article className="news-article">
                <h2 className="news-title">{selectedNews.title}</h2>
                <h3 className="news-subtitle">{selectedNews.subtitle}</h3>
                <div className="news-meta">
                  <span className="news-date">
                    <i className="far fa-calendar-alt"></i> {formatDate(selectedNews.publicationDate)}
                  </span>
                  <span className="news-views">
                    <i className="fas fa-eye"></i> {selectedNews.views} visualizações
                  </span>
                </div>

                <div className="news-body">
                  {selectedNews.body.split("\n").map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </article>
            ) : (
              <div className="no-news-selected">
                <p>Selecione uma notícia para ler</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default NewsPage

