import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// Global error handler for common media playback errors
window.addEventListener('unhandledrejection', (event) => {
  // Check if the error is related to media playback interruption
  if (event.reason && 
      (event.reason.name === 'AbortError' || 
       event.reason.message?.includes('play() request was interrupted') ||
       event.reason.message?.includes('pause()'))) {
    // Suppress the error from appearing in console
    event.preventDefault();
    console.debug('Media playback interruption handled:', event.reason.message);
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
