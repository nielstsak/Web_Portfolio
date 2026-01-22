// FICHIER : frontend/src/App.jsx

import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProjectPage from './pages/ProjectPage'; // Import critique pour le routage
import AnimatedBackground from './components/AnimatedBackground';
import { useAppStore } from './store/appStore';

/**
 * Composant racine de l'application.
 * Intègre le routeur et la gestion du thème global.
 */
function App() {
  const chargerToutesDonnees = useAppStore((state) => state.fetchAllData);

  // Initialisation des données au montage
  useEffect(() => {
    chargerToutesDonnees();
  }, [chargerToutesDonnees]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <AnimatedBackground />
          <Navbar />
          
          <Box component="main" sx={{ flexGrow: 1, zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              {/* Route Accueil : Introduction + Parcours + Liste Projets */}
              <Route 
                path="/" 
                element={<LandingPage />} 
              />
              
              {/* Route Détail Projet : Indispensable pour la navigation via ID */}
              <Route 
                path="/project/:idProjet" 
                element={<ProjectPage />} 
              />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;