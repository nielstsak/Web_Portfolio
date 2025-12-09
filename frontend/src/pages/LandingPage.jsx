// frontend/src/pages/LandingPage.jsx

// useNavigate est retiré, la navigation vers un projet spécifique n'est plus gérée ici.
import { Box } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import Introduction from '../components/Introduction';
import { useAppStore } from '../store/appStore';

// NOUVEAU composant pour la section fusionnée
import SectionChronologie from '../components/SectionChronologie'; 

// SUPPRIMÉS
// import Parcours from '../components/Parcours';
// import ListeProjets from '../components/ProjectList'; 

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
function LandingPage({ sectionActive }) {
  // Récupère les événements déjà filtrés depuis le store
  const evenementsFiltres = useAppStore((state) => state.evenementsFiltres());
  
  // La fonction 'gererSelectionProjet' est supprimée.

  // Rend le composant de la section active (MIS À JOUR).
  const afficherContenuSection = () => {
    switch (sectionActive) {
      case 'introduction':
        return <Introduction estVisible={true} />;
      case 'chronologie':
        // Remplace les anciens composants 'Parcours' et 'ListeProjets'
        return <SectionChronologie evenementsFiltres={evenementsFiltres} />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1, overflow: 'hidden' }}>
      {/* Gère l'animation de sortie (exit) et d'entrée (enter) */}
      <AnimatePresence mode="wait">
        <motion.div
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