// frontend/src/pages/LandingPage.jsx

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Introduction from '../components/Introduction';
import Parcours from '../components/Parcours';
import ProjectList from '../components/ProjectList';
import { useAppStore } from '../store/appStore';

// Ordre de navigation des sections pour le défilement.
const sections = ['introduction', 'parcours', 'projects'];

// Variantes d'animation pour la transition entre les sections.
const sectionVariants = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Page d'accueil qui gère l'affichage et la navigation entre les sections principales.
 * @param {{ activeSection: string, onNavigate: function }} props
 */
function LandingPage({ activeSection, onNavigate }) {
  const navigate = useNavigate();
  const projects = useAppStore((state) => state.projects);
  const parcoursData = useAppStore((state) => state.parcoursData);
  
  const lastCall = useRef(0);
  const throttleDelay = 1000; // Délai en ms pour limiter la fréquence de changement de section.

  const handleSelectProject = (projectId) => {
    navigate(`/project/${projectId}`);
  };

  // Gère la navigation entre les sections avec la molette de la souris.
  const handleWheel = useCallback((event) => {
    const now = Date.now();
    // "Throttle" : Empêche les changements de section trop rapides.
    if (now - lastCall.current < throttleDelay) {
      return;
    }
    lastCall.current = now;

    const currentIndex = sections.indexOf(activeSection);
    if (event.deltaY > 0 && currentIndex < sections.length - 1) { // Scroll vers le bas
      onNavigate(sections[currentIndex + 1]);
    } else if (event.deltaY < 0 && currentIndex > 0) { // Scroll vers le haut
      onNavigate(sections[currentIndex - 1]);
    }
  }, [activeSection, onNavigate, throttleDelay]);

  // Ajoute et retire l'écouteur d'événement pour le défilement.
  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Rend le composant de la section active.
  const renderSectionContent = () => {
    switch (activeSection) {
      case 'introduction':
        return <Introduction isVisible={true} />;
      case 'parcours':
        return <Parcours parcoursData={parcoursData} />;
      case 'projects':
        return <ProjectList projects={projects} onSelectProject={handleSelectProject} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
      {/* Gère l'animation de sortie de l'ancienne section et d'entrée de la nouvelle. */}
      <AnimatePresence mode="wait">
        <motion.div
          // La clé est cruciale pour que AnimatePresence détecte le changement de composant.
          key={activeSection}
          variants={sectionVariants}
          initial="initial"
          animate="enter"
          exit="exit"
          // Le conteneur doit être flex pour permettre à son enfant (ex: Introduction) de grandir.
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {renderSectionContent()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

export default LandingPage;