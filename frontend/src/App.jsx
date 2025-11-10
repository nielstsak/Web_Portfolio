// frontend/src/App.jsx

import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme'; // Importe le thème MUI personnalisé
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProjectPage from './pages/ProjectPage';
import AnimatedBackground from './components/AnimatedBackground';
import { useAppStore } from './store/appStore'; // Importe le store global

// Définit les sections navigables de la page d'accueil.
const sections = ['introduction', 'parcours', 'projects'];

/**
 * Composant racine de l'application.
 * Gère le thème, le routage, la disposition générale et l'état de la section active.
 */
function App() {
  // État pour suivre la section actuellement visible sur la page d'accueil.
  const [sectionActive, setSectionActive] = useState(sections[0]);
  const chargerToutesDonnees = useAppStore((state) => state.fetchAllData);

  // Au premier chargement de l'application, récupère toutes les données nécessaires depuis l'API.
  useEffect(() => {
    chargerToutesDonnees();
  }, [chargerToutesDonnees]); // 'useCallback' dans le store garantit que la fonction ne change pas

  // Gère la navigation entre les sections de la page d'accueil.
  // 'useCallback' mémorise la fonction pour éviter les re-rendus inutiles.
  const gererNavigation = useCallback((section) => {
    if (sections.includes(section) && section !== sectionActive) {
      setSectionActive(section);
    }
  }, [sectionActive]); // Se recrée uniquement si 'sectionActive' change

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalise les styles CSS par défaut */}
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <AnimatedBackground /> {/* Arrière-plan animé global */}
          <Navbar onNaviguer={gererNavigation} sectionActive={sectionActive} />
          
          {/* Conteneur principal pour le contenu des pages */}
          <Box component="main" sx={{ flexGrow: 1, zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Route pour la page d'accueil */}
              <Route 
                path="/" 
                element={<LandingPage sectionActive={sectionActive} onNaviguer={gererNavigation} />} 
              />
              {/* Route dynamique pour les pages de projet individuelles */}
              <Route path="/project/:idProjet" element={<ProjectPage />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;