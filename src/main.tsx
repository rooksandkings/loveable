import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Add performance monitoring
if (process.env.NODE_ENV === 'development') {
  const reportWebVitals = async () => {
    const webVitals = await import('web-vitals');
    webVitals.getCLS(console.log);
    webVitals.getFID(console.log);
    webVitals.getFCP(console.log);
    webVitals.getLCP(console.log);
    webVitals.getTTFB(console.log);
  };
  reportWebVitals();
}

// Implement progressive loading
const loadApp = async () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) return;

  // Load critical CSS first
  const criticalStyles = document.createElement('link');
  criticalStyles.rel = 'stylesheet';
  criticalStyles.href = '/src/index.css';
  document.head.appendChild(criticalStyles);

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
