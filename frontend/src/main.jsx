// frontend/src/main.jsx

// Point d'entrée de l'application React.

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Importe les styles globaux
import App from './App.jsx'; // Importe le composant racine

// Cible l'élément DOM avec l'ID 'root' (défini dans index.html)
const conteneurRoot = document.getElementById('root');

// Crée la racine React pour le rendu de l'application
const root = createRoot(conteneurRoot);

// Rend le composant principal <App> dans la racine.
root.render(
  // StrictMode active des vérifications supplémentaires en développement 
  // pour détecter les problèmes potentiels (ex: effets de bord).
  <StrictMode>
    <App />
  </StrictMode>,
);