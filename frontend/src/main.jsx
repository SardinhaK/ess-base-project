import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./styles/global.css"

// Add Font Awesome for icons
const fontAwesomeLink = document.createElement("link")
fontAwesomeLink.rel = "stylesheet"
fontAwesomeLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css"
document.head.appendChild(fontAwesomeLink)

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

