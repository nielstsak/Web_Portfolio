// frontend/src/main.jsx

// Point d'entrée de l'application React.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

// Rend le composant principal <App> dans l'élément DOM avec l'ID 'root'.
createRoot(document.getElementById('root')).render(
  // StrictMode active des vérifications supplémentaires pour détecter les problèmes potentiels.
  <StrictMode>
    <App />
  </StrictMode>,
);