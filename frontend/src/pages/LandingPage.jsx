// frontend/src/pages/LandingPage.jsx

import { useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Introduction from '../components/Introduction';
import Parcours from '../components/Parcours';
import ListeProjets from '../components/ProjectList'; // Renommé depuis ProjectList
import { useAppStore } from '../store/appStore';

// Ordre de navigation des sections pour le défilement.
const sections = ['introduction', 'parcours', 'projects'];

// Variantes d'animation pour la transition entre les sections.
const variantsSection = {
  initial: { opacity: 0, y: 20 },
  enter: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Page d'accueil qui gère l'affichage et la navigation entre les sections principales.
 * @param {{ sectionActive: string, onNaviguer: function }} props
 */
function LandingPage({ sectionActive, onNaviguer }) {
  const navigation = useNavigate();
  const projets = useAppStore((state) => state.projecs);
  const donneesParcours = useAppStore((state) => state.parcoursData);
  
  const dernierAppel = useRef(0);
  const delaiAntiRebond = 1000; // Délai (ms) pour limiter la fréquence de changement de section

  const gererSelectionProjet = (idProjet) => {
    navigation(`/project/${idProjet}`);
  };

  // Gère la navigation entre les sections avec la molette de la souris.
  const gererDefilement = useCallback((evenement) => {
    const maintenant = Date.now();
    // "Throttle" : Empêche les changements de section trop rapides.
    if (maintenant - dernierAppel.current < delaiAntiRebond) {
      return;
    }
    dernierAppel.current = maintenant;

    const indexActuel = sections.indexOf(sectionActive);
    if (evenement.deltaY > 0 && indexActuel < sections.length - 1) { // Scroll vers le bas
      onNaviguer(sections[indexActuel + 1]);
    } else if (evenement.deltaY < 0 && indexActuel > 0) { // Scroll vers le haut
      onNaviguer(sections[indexActuel - 1]);
    }
  }, [sectionActive, onNaviguer, delaiAntiRebond]);

  // Ajoute et retire l'écouteur d'événement pour le défilement.
  useEffect(() => {
    window.addEventListener('wheel', gererDefilement);
    return () => window.removeEventListener('wheel', gererDefilement);
  }, [gererDefilement]);

  // Rend le composant de la section active.
  const afficherContenuSection = () => {
    switch (sectionActive) {
      case 'introduction':
        return <Introduction estVisible={true} />;
      case 'parcours':
        return <Parcours donneesParcours={donneesParcours} />;
      case 'projects':
        return <ListeProjets projets={projets} onSelectionnerProjet={gererSelectionProjet} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
      {/* Gère l'animation de sortie (exit) et d'entrée (enter) */}
      <AnimatePresence mode="wait">
        <motion.div
          // La clé 'key' est cruciale : elle dit à AnimatePresence que le composant a changé.
          key={sectionActive}
          variants={variantsSection}
          initial="initial"
          animate="enter"
          exit="exit"
          style={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}
        >
          {afficherContenuSection()}
        </motion.div>
      </AnimatePresence>
    </Box>
  );
}

export default LandingPage;