// frontend/src/components/PageLayout.jsx

import { Box } from '@mui/material';
import Navbar from './Navbar';
import Footer from './Footer';

/**
 * Composant de mise en page principal qui enveloppe le contenu
 * de la page avec une barre de navigation et un pied de page.
 * @param {{
 * children: React.ReactNode,
 * onNavigate: function,
 * activeSection: string
 * }} props
 */
function PageLayout({ children, onNavigate, activeSection }) {
  return (
    <>
      <Navbar onNavigate={onNavigate} activeSection={activeSection} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          margin: 'auto',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignContent: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {children}
      </Box>
      <Footer />
    </>
  );
}

export default PageLayout;