// frontend/src/components/chronologie/GrilleEvenements.jsx

import { Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CarteEvenement from './CarteEvenement';

// Variantes pour l'animation en cascade
const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 },
  },
};

const variantsElement = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

/**
 * Grille responsive des événements.
 * Utilise le Grid system standard de MUI v7.
 * @param {{ evenements: Array<object> }} props
 */
function GrilleEvenements({ evenements }) {
  if (!evenements || evenements.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4, color: 'text.secondary' }}>
        Aucun élément ne correspond aux filtres actuels.
      </Box>
    );
  }

  return (
    <Box 
      component={motion.div} 
      variants={variantsConteneur} 
      initial="hidden" 
      animate="visible"
      sx={{ p: { xs: 1, md: 2 } }} 
    >
      {/* Grid Container : gère l'espacement et les colonnes */}
      <Grid container spacing={3} alignItems="stretch">
        {evenements.map((evenement) => (
          <Grid item size={{ xs: 12, sm: 6, md: 4 }} key={evenement.id} sx={{ display: 'flex' }}>
            <motion.div 
              variants={variantsElement} 
              style={{ width: '100%', height: '100%' }} // Assure que la motion div remplit la cellule
            >
              <CarteEvenement evenement={evenement} />
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default GrilleEvenements;