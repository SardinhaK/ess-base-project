"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import SearchBar from "./SearchBar"
import "../styles/Header.css"

/**
 * Header component for iLoveRU application
 * Contains logo, navigation links, and search bar
 */
const Header = () => {
  const location = useLocation()
  const [activeLink, setActiveLink] = useState("")

  // Update active link based on current path
  useEffect(() => {
    const path = location.pathname
    if (path === "/") {
      setActiveLink("feed")
    } else {
      const currentPath = path.split("/")[1]
      setActiveLink(currentPath)
    }
  }, [location])

  return (
    <header className="header">
      <div className="header-container">
        {/* Logo */}
        <div className="logo">
          <Link to="/">
            <h1>iLoveRU</h1>
          </Link>
        </div>

        {/* Navigation Links */}
        <nav className="nav-links">
          <ul>
            <li className={activeLink === "feed" ? "active" : ""}>
              <Link to="/">Feed</Link>
            </li>
            <li className={activeLink === "news" ? "active" : ""}>
              <Link to="/news">News</Link>
            </li>
            <li className={activeLink === "favorites" ? "active" : ""}>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li className={activeLink === "admin" ? "active" : ""}>
              <Link to="/admin">Admin</Link>
            </li>
          </ul>
        </nav>

        {/* Search Bar */}
        <div className="search-container">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

export default Header

