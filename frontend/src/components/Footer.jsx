// frontend/src/components/Footer.jsx

import { Box, Typography, IconButton, Container } from '@mui/material';
import GitHubIcon from '@mui/icons-material/GitHub';
import LinkedInIcon from '@mui/icons-material/LinkedIn';

/**
 * Affiche le pied de page du site avec les liens sociaux et le copyright.
 */
function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        color: 'text.primary',
        py: 2,
        zIndex: 1200,
        position: 'relative',
        borderTop: '1px solid #e7e7e7',
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