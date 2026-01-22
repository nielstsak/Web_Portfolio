// [Symbole Commentaire] FICHIER : frontend/src/pages/LandingPage.jsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Divider } from '@mui/material';
import { useAppStore } from '../store/appStore';
import Introduction from '../components/Introduction';
import Parcours from '../components/Parcours';
import ProjectList from '../components/ProjectList';

/**
 * Page d'accueil orchestrant les différentes sections.
 * Remplace l'ancienne structure basée sur "SectionChronologie".
 */
function LandingPage() {
  // Récupération des données normalisées depuis le store
  const parcours = useAppStore((state) => state.parcours);
  const projets = useAppStore((state) => state.projets);
  const navigate = useNavigate();

  // Navigation vers la page de détail
  const gererSelectionProjet = (id) => {
    navigate(`/project/${id}`);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      
      {/* SECTION 1 : Introduction & Présentation */}
      <Box component="section" id="introduction" sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Introduction />
      </Box>

      <Divider sx={{ my: 2, opacity: 0.5 }} />

      {/* Conteneur principal pour la navigation (Ancre #chronologie conservée pour compatibilité Navbar) */}
      <div id="chronologie">
        
        {/* SECTION 2 : Parcours (Timeline Verticale) */}
        <Box component="section" sx={{ py: 4 }}>
          <Parcours donnees={parcours} />
        </Box>

        <Divider variant="middle" sx={{ my: 6, width: '40%', mx: 'auto', opacity: 0.6 }} />

        {/* SECTION 3 : Projets (Grille Masonry) */}
        <Box component="section" sx={{ py: 4, minHeight: '60vh' }}>
          <ProjectList 
            projets={projets} 
            onSelectionnerProjet={gererSelectionProjet} 
          />
        </Box>
      
      </div>
    </Box>
  );
}

export default LandingPage;