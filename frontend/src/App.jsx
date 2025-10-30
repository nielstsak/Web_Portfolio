// frontend/src/App.jsx

import { useState, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline } from '@mui/material';
import theme from './theme';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import ProjectPage from './pages/ProjectPage';
import AnimatedBackground from './components/AnimatedBackground';
import { useAppStore } from './store/appStore';

// Définit les sections navigables de la page d'accueil.
const sections = ['introduction', 'parcours', 'projects'];

/**
 * Composant racine de l'application.
 * Gère le thème, le routage, la disposition générale et l'état de la section active.
 */
function App() {
  // État pour suivre la section actuellement visible sur la page d'accueil.
  const [activeSection, setActiveSection] = useState(sections[0]);
  const fetchAllData = useAppStore((state) => state.fetchAllData);

  // Au premier chargement de l'application, récupère toutes les données nécessaires depuis l'API.
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]); 

  // Gère la navigation entre les sections de la page d'accueil.
  const handleNavigate = useCallback((section) => {
    if (sections.includes(section) && section !== activeSection) {
      setActiveSection(section);
    }
  }, [activeSection]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
          <AnimatedBackground />
          <Navbar onNavigate={handleNavigate} activeSection={activeSection} />
          
          {/* Conteneur principal pour le contenu des pages */}
          <Box component="main" sx={{ flexGrow: 1, zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column' }}>
            <Routes>
              <Route path="/" element={<LandingPage activeSection={activeSection} onNavigate={handleNavigate} />} />
              <Route path="/project/:projectId" element={<ProjectPage />} />
            </Routes>
          </Box>
          
          <Footer />
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;