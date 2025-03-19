"use client"

import { useState, useEffect, createContext } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Alert from "./components/Alert"
import FeedPage from "./pages/FeedPage"
import NewsPage from "./pages/NewsPage"
import FavoritesPage from "./pages/FavoritesPage"
import AdminPage from "./pages/AdminPage"
import { checkBackendAvailability } from "./utils/api"
import "./styles/global.css"

// Create a context for the alert system
export const AlertContext = createContext()

/**
 * Main App component for iLoveRU application
 * Sets up routing and main layout
 */
const App = () => {
  const [backendAvailable, setBackendAvailable] = useState(true)
  const [isChecking, setIsChecking] = useState(true)
  const [alert, setAlert] = useState({ type: "", message: "" })

  useEffect(() => {
    const checkBackend = async () => {
      setIsChecking(true)
      const isAvailable = await checkBackendAvailability()
      setBackendAvailable(isAvailable)
      setIsChecking(false)

      if (!isAvailable) {
        console.warn("Backend não está disponível. Usando dados mockados.")
      }
    }

    checkBackend()
  }, [])

  // Function to show an alert
  const showAlert = (type, message) => {
    setAlert({ type, message })
  }

  // Function to clear the alert
  const clearAlert = () => {
    setAlert({ type: "", message: "" })
  }

  if (isChecking) {
    return (
      <div className="loading-app">
        <div className="loading-spinner">
          <i className="fas fa-spinner fa-spin"></i>
          <span>Carregando aplicação...</span>
        </div>
      </div>
    )
  }

  return (
    <AlertContext.Provider value={{ showAlert, clearAlert }}>
      <Router>
        <div className="app">
          {!backendAvailable && (
            <div className="backend-warning">
              <i className="fas fa-exclamation-triangle"></i>
              Backend não disponível. Usando dados mockados.
            </div>
          )}
          <Header />

          {/* Global Alert */}
          {alert.message && <Alert type={alert.type} message={alert.message} onClose={clearAlert} />}

          <main className="main-content">
            <Routes>
              <Route path="/" element={<FeedPage />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/admin" element={<AdminPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AlertContext.Provider>
  )
}

export default App

