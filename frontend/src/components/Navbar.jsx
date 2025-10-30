// frontend/src/components/Navbar.jsx

import { AppBar, Toolbar, Typography, Box, Button, Container } from '@mui/material';

/**
 * Barre de navigation principale du site.
 * @param {{
 * onNavigate: function,
 * activeSection: string
 * }} props
 */
function Navbar({ onNavigate, activeSection }) {
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
          <Typography
            variant="h6"
            component="a"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              if (onNavigate) onNavigate('introduction');
            }}
            sx={{
              flexGrow: 1,
              color: 'text.primary',
              textDecoration: 'none',
              fontWeight: 'bold',
            }}
          >
            Mon Portfolio
          </Typography>
          <Box>
            <Button
              onClick={() => onNavigate && onNavigate('introduction')}
              sx={{
                color: activeSection === 'introduction' ? 'text.primary' : 'text.secondary',
                fontWeight: activeSection === 'introduction' ? 'bold' : 'normal',
                '&:hover': { color: 'text.primary' },
              }}
            >
              Introduction
            </Button>
            <Button
              onClick={() => onNavigate && onNavigate('projects')}
              sx={{
                color: activeSection === 'projects' ? 'text.primary' : 'text.secondary',
                fontWeight: activeSection === 'projects' ? 'bold' : 'normal',
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