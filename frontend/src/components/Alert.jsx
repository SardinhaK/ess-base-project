"use client"

import { useState, useEffect } from "react"
import "../styles/Alert.css"

/**
 * Alert component for displaying error, success, warning, or info messages
 * Fixed at the top of the page, below the header
 *
 * @param {Object} props - Component props
 * @param {string} props.type - Alert type (error, success, warning, info)
 * @param {string} props.message - Alert message
 * @param {boolean} props.autoClose - Whether to automatically close the alert
 * @param {number} props.duration - Duration in ms before auto-closing
 * @param {function} props.onClose - Function to call when alert is closed
 */
const Alert = ({ type = "info", message, autoClose = true, duration = 5000, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (autoClose && message) {
      const timer = setTimeout(() => {
        setVisible(false)
        if (onClose) onClose()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [autoClose, duration, message, onClose])

  if (!message || !visible) return null

  const handleClose = () => {
    setVisible(false)
    if (onClose) onClose()
  }

  const getIcon = () => {
    switch (type) {
      case "error":
        return <i className="fas fa-exclamation-circle"></i>
      case "success":
        return <i className="fas fa-check-circle"></i>
      case "warning":
        return <i className="fas fa-exclamation-triangle"></i>
      case "info":
      default:
        return <i className="fas fa-info-circle"></i>
    }
  }

  return (
    <div className="alert-container">
      <div className={`alert alert-${type}`}>
        <div className="alert-icon">{getIcon()}</div>
        <div className="alert-content">{message}</div>
        <button className="alert-close" onClick={handleClose}>
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  )
}

export default Alert

