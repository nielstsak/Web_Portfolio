// frontend/src/components/Navbar.jsx

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

/**
 * Barre de navigation principale.
 * Gère la navigation vers les ancres logiques définies dans LandingPage.
 */
function Navbar() {
  
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
            href="#introduction"
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
              component="a"
              href="#introduction"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
                '&:hover': { color: 'primary.dark' },
              }}
            >
              Introduction
            </Button>
            
            {/* Correction: La cible est maintenant 'chronologie' pour correspondre à LandingPage */}
            <Button
              component="a"
              href="#chronologie"
              sx={{
                color: 'text.secondary',
                fontWeight: 400,
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