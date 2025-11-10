// frontend/src/components/PageLayout.jsx

import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Composant de mise en page principal qui enveloppe le contenu
 * de la page avec une barre de navigation et un pied de page.
 * @param {{
 * enfants: React.ReactNode,
 * onNaviguer: function,
 * sectionActive: string
 * }} props
 */
function PageLayout({ enfants, onNaviguer, sectionActive }) {
  return (
    <>
      <Navbar onNaviguer={onNaviguer} sectionActive={sectionActive} />
      <Box
        component="main"
        sx={{
          flexGrow: 1, // Permet au contenu principal de prendre toute la place disponible
          margin: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {enfants} {/* Affiche le contenu de la page actuelle */}
      </Box>
      <Footer />
    </>
  );
}

export default PageLayout;