/**
 * Main entry point for the React application.
 * 
 * This file sets up the root of the React application and renders it into the DOM.
 * It uses StrictMode for highlighting potential problems in the application.
 * It also sets up the Router for handling client-side routing.
 * 
 * @file /home/paulo/Documentos/reloj-checador/src/main.jsx
 * @module main
 * 
 * @requires react.StrictMode
 * @requires react-dom/client.createRoot
 * @requires react-router-dom.BrowserRouter
 * @requires ./index.css
 * @requires ./App.jsx
 */
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>
);