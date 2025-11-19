// frontend/src/components/Navbar.jsx

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

/**
 * Barre de navigation principale.
 * Gère la navigation vers les ancres logiques définies dans LandingPage.
 * @param {{ onNaviguer: function, sectionActive: string }} props
 */
function Navbar({ onNaviguer, sectionActive }) {
  
  const gererClic = (cible) => (e) => {
    e.preventDefault();
    if (onNaviguer) onNaviguer(cible);
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        top: 0,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(10px)',
        boxShadow: 'inset 0px -1px 1px #e7e7e7',
        zIndex: 1200,
      }}
    >
      <Container minwidth="100%" sx={{ px: { xs: 2, md: 6 } }}>
        <Toolbar disableGutters>
          {/* Logo / Titre */}
          <Typography
            variant="h6"
            component="a"
            href="#"
            onClick={gererClic('introduction')}
            sx={{
              flexGrow: 1,
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            Mon Portfolio
          </Typography>
          
          {/* Menu de Navigation */}
          <Box>
            <Button
              onClick={gererClic('introduction')}
              sx={{
                color: sectionActive === 'introduction' ? 'primary.main' : 'text.secondary',
                fontWeight: sectionActive === 'introduction' ? 700 : 400,
                '&:hover': { color: 'primary.dark' },
              }}
            >
              Introduction
            </Button>
            
            {/* Correction: La cible est maintenant 'chronologie' pour correspondre à LandingPage */}
            <Button
              onClick={gererClic('chronologie')}
              sx={{
                color: sectionActive === 'chronologie' ? 'primary.main' : 'text.secondary',
                fontWeight: sectionActive === 'chronologie' ? 700 : 400,
                '&:hover': { color: 'primary.dark' },
              }}
            >
              Chronologie & Projets
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;