// frontend/src/components/Footer.jsx

import { Box, Typography, IconButton, Container } from '@mui/material';
// Icônes non utilisées (GitHubIcon, LinkedInIcon) retirées du 'import'

/**
 * Affiche le pied de page du site avec les liens sociaux et le copyright.
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond semi-transparent
        backdropFilter: 'blur(10px)', // Effet de flou
        color: 'text.primary',
        py: 2, // Espacement vertical (padding)
        zIndex: 1200, // Au-dessus de l'arrière-plan animé
        position: 'relative',
        borderTop: '1px solid #e7e7e7', // Ligne de séparation fine
      }}
    >
      <Container maxWidth={false} sx={{ textAlign: 'center', px: { xs: 2, md: 6 } }}>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontSize: '0.8rem' }}>
          © {new Date().getFullYear()} Portfolio de Niels TSAKIRIS. Tous droits réservés.
        </Typography>
      </Container>
    </Box>
  );
}

export default Footer;