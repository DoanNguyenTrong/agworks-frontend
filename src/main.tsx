
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Global error handler for script loading errors
window.addEventListener('error', (event) => {
  // Only log to console, don't disrupt the app
  console.error('Script loading error:', event);
}, true);

// Make sure to get a valid DOM node before rendering
const rootElement = document.getElementById("root");
if (rootElement) {
  try {
    createRoot(rootElement).render(<App />);
  } catch (error) {
    console.error("Failed to render React app:", error);
  }
} else {
  console.error("Could not find root element to mount React app");
}
