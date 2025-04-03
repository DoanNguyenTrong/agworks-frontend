
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// More robust error handling for script loading errors
window.addEventListener('error', (event) => {
  // Only handle script loading errors, not regular runtime errors
  if (event.filename && (event.filename.includes('.js') || event.filename.includes('.ts'))) {
    console.error('Script loading error:', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  }
}, true);

const mount = () => {
  const rootElement = document.getElementById("root");
  
  if (!rootElement) {
    console.error("Could not find root element to mount React app");
    return;
  }
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log("React app successfully mounted");
  } catch (error) {
    console.error("Failed to render React app:", error);
  }
};

// Ensure the DOM is fully loaded before mounting
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", mount);
} else {
  mount();
}
