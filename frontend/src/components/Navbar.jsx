// frontend/src/components/Navbar.jsx

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

/**
 * Barre de navigation principale du site.
 * @param {{
 * onNaviguer: function,
 * sectionActive: string
 * }} props
 */
function Navbar({ onNaviguer, sectionActive }) {
  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)', // Fond blanc semi-transparent
        backdropFilter: 'blur(10px)', // Effet de flou
        boxShadow: 'inset 0px -1px 1px #e7e7e7', // Ombre intérieure subtile
        zIndex: 1200,
      }}
    >
      <Container minwidth="100%" sx={{ px: { xs: 2, md: 6 } }}>
        <Toolbar disableGutters>
          {/* Titre/Logo cliquable pour revenir à l'introduction */}
          <Typography
            variant="h6"
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onNaviguer) onNaviguer('introduction');
            }}
            sx={{
              flexGrow: 1, // Pousse les boutons vers la droite
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Mon Portfolio
          </Typography>
          
          {/* Liens de navigation */}
          <Box>
            <Button
              onClick={() => onNaviguer && onNaviguer('introduction')}
              sx={{
                // Style dynamique basé sur la section active
                color: sectionActive === 'introduction' ? 'text.primary' : 'text.secondary',
                fontWeight: sectionActive === 'introduction' ? 'bold' : 'normal',
                '&:hover': { color: 'text.primary' },
              }}
            >
              Introduction
            </Button>
            <Button
              onClick={() => onNaviguer && onNaviguer('projects')}
              sx={{
                color: sectionActive === 'projects' ? 'text.primary' : 'text.secondary',
                fontWeight: sectionActive === 'projects' ? 'bold' : 'normal',
                '&:hover': { color: 'text.primary' },
              }}
            >
              Mes Projets
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;