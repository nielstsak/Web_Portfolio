// frontend/src/App.jsx

import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import AnimatedBackground from './components/AnimatedBackground';
import { useAppStore } from './store/appStore';

// Sections navigables de la page d'accueil (Mises à jour)
const sections = ['introduction', 'chronologie'];

/**
 * Composant racine de l'application.
 */
function App() {
  const [sectionActive, setSectionActive] = useState(sections[0]);
  const chargerToutesDonnees = useAppStore((state) => state.fetchAllData);

  // Au premier chargement, récupère toutes les données de l'API.
  useEffect(() => {
    chargerToutesDonnees();
  }, [chargerToutesDonnees]);

  // Gère la navigation entre les sections (passée à Navbar et LandingPage)
  const gererNavigation = useCallback((section) => {
    if (sections.includes(section) && section !== sectionActive) {
      setSectionActive(section);
    }
  }, [sectionActive]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <AnimatedBackground />
          <Navbar onNaviguer={gererNavigation} sectionActive={sectionActive} />
          
          <Box component="main" sx={{ flexGrow: 1, zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Route principale pour la LandingPage */}
              <Route 
                path="/" 
                element={<LandingPage sectionActive={sectionActive} onNaviguer={gererNavigation} />} 
              />
              {/* La route /project/:idProjet est supprimée */}
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;