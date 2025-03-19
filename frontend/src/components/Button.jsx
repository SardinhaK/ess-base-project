"use client"
import "../styles/Button.css"

/**
 * Button component for iLoveRU application
 * @param {Object} props - Component props
 * @param {string} props.text - Button text
 * @param {string} props.type - Button type (primary, secondary, etc.)
 * @param {function} props.onClick - Click handler function
 * @param {boolean} props.isActive - Whether the button is active
 * @param {string} props.className - Additional CSS classes
 */
const Button = ({ text, type = "primary", onClick, isActive = false, className = "" }) => {
  return (
    <button className={`button ${type} ${isActive ? "active" : ""} ${className}`} onClick={onClick}>
      {text}
    </button>
  )
}

export default Button

