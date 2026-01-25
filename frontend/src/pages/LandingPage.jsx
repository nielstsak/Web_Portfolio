// [Symbole Commentaire] FICHIER : frontend/src/pages/LandingPage.jsx

import { useState } from 'react';
import { Box, Divider } from '@mui/material';
import { useAppStore } from '../store/appStore';
import Introduction from '../components/Introduction';
// RETIRÉ : import Parcours from '../components/Parcours';
import ProjectList from '../components/ProjectList';
import ModaleEvenement from '../components/chronologie/ModaleEvenement';

function LandingPage() {
  // RETIRÉ : const parcours = useAppStore((state) => state.parcours);
  const projets = useAppStore((state) => state.projets);
  
  const [projetSelectionne, setProjetSelectionne] = useState(null);

  const gererSelectionProjet = (id) => {
    const projet = projets.find(p => p.apiId === id);
    if (projet) {
      setProjetSelectionne(projet);
    }
  };

  const fermerModale = () => {
    setProjetSelectionne(null);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100vh' }}>
      
      {/* SECTION 1 : Introduction */}
      <Box component="section" id="introduction" sx={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Introduction />
      </Box>

      <Divider sx={{ my: 2, opacity: 0.5 }} />

      <div id="chronologie">
        
        {/* RETIRÉ : SECTION 2 : Parcours */}
        
        {/* RETIRÉ : Divider variant="middle" */}

        {/* SECTION 3 : Projets */}
        <Box component="section" sx={{ py: 4, minHeight: '60vh' }}>
          <ProjectList 
            projets={projets} 
            onSelectionnerProjet={gererSelectionProjet} 
          />
        </Box>
      
      </div>

      <ModaleEvenement 
        evenement={projetSelectionne}
        ouvert={!!projetSelectionne}
        onFermer={fermerModale}
      />
    </Box>
  );
}

export default LandingPage;