// frontend/src/theme.js

// Ce fichier définit le thème personnalisé pour la bibliothèque Material-UI (MUI).
// Il centralise les couleurs, la typographie et les styles de composants.

import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  // --- Palette de couleurs ---
  palette: {
    mode: 'light',
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
    text: {
      primary: '#172b4d',
      secondary: '#6b778c',
    },
    divider: 'rgba(0, 0, 0, 0.12)',
    primary: {
      main: '#0052cc',
    },
    secondary: {
      main: '#edf2ff',
    },
  },

  // --- Styles de typographie ---
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: '3.5rem', letterSpacing: '-0.5px' },
    h2: { fontWeight: 700, fontSize: '3rem' },
    h3: { fontWeight: 600, fontSize: '2.5rem' },
    h4: { fontWeight: 600, fontSize: '2rem' },
    h5: { fontWeight: 600, fontSize: '1.5rem' },
    h6: { fontWeight: 600, fontSize: '1.25rem' },
    body1: { fontSize: '1rem', lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: {
      textTransform: 'none', // Empêche les boutons d'être en majuscules par défaut.
      fontWeight: 600,
    }
  },

  // --- Surcharges de styles pour les composants MUI ---
  components: {
    MuiContainer: {
      styleOverrides: {
        root: {
          // Augmente la largeur maximale du conteneur sur les grands écrans.
          '@media (min-width: 1300px)': {
            maxWidth: '1400px',
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Applique des coins plus arrondis aux boutons.
        },
      },
    },
  },
});

export default theme;