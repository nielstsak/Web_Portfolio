// frontend/src/components/chronologie/GrilleEvenements.jsx

import { Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import CarteEvenement from './CarteEvenement'; 
// Masonry est retiré car il est incompatible avec des hauteurs uniformes.

// Variantes pour l'animation en cascade de la grille
const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.07 }, // Délai rapide entre chaque carte
  },
};

const variantsElement = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/**
 * Affiche la grille des événements filtrés avec une structure Grid standard
 * pour garantir l'uniformité des dimensions des cartes.
 * @param {{ evenements: Array<object> }} props
 */
function GrilleEvenements({ evenements }) {
  return (
    <Box 
      component={motion.div} 
      variants={variantsConteneur} 
      initial="hidden" 
      animate="visible"
      // Le padding est appliqué ici pour ne pas interférer avec le scrollbar
      sx={{ p: { xs: 1, md: 3 } }} 
    >
      {/* Utilisation de Grid standard pour des hauteurs uniformes */}
      <Grid container spacing={3}>
        {evenements.map((evenement) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={4} 
            key={evenement.id}
            // Ces styles forcent l'élément Grid à prendre toute la hauteur disponible dans sa ligne.
            sx={{ display: 'flex', height: '100%' }}
          >
            <motion.div 
              variants={variantsElement} 
              // Assure que le conteneur motion prend 100% de la hauteur de l'item Grid
              style={{ height: '100%', width: '100%' }}
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