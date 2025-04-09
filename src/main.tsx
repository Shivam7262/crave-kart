
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById("root");

// Make sure rootElement exists
if (!rootElement) {
  throw new Error("Root element not found");
}

// Create a root and render the app
createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
