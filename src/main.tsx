import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Implement progressive loading
const loadApp = async () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  // Use requestIdleCallback for better performance
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      createRoot(rootElement).render(<App />);
    });
  } else {
    // Fallback for browsers that don't support requestIdleCallback
    setTimeout(() => {
      createRoot(rootElement).render(<App />);
    }, 0);
  }
};

// Start loading the app
loadApp();
