import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';
import './index.css';

/**
 * Application Entry Point
 * -----------------------
 * This file mounts the React application to the DOM.
 * 
 * BrowserRouter is wrapped here to enable client-side routing
 * throughout the entire application.
 * ScrollToTop ensures every route change scrolls to the top.
 */
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
