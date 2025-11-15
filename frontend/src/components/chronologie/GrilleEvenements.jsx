// frontend/src/components/chronologie/GrilleEvenements.jsx

import { Box } from '@mui/material';
import { Masonry } from '@mui/lab';
import { motion } from 'framer-motion';
import CarteEvenement from './CarteEvenement'; // Import de la carte créée à l'étape 13a

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
 * Affiche la grille "Masonry" des événements filtrés.
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
      <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={3}>
        {evenements.map((evenement) => (
          <motion.div variants={variantsElement} key={evenement.id}>
            <CarteEvenement evenement={evenement} />
          </motion.div>
        ))}
      </Masonry>
    </Box>
  );
}

export default GrilleEvenements;