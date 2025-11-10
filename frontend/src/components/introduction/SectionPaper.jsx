// frontend/src/components/introduction/SectionPaper.jsx

import { Paper } from '@mui/material';
import { motion } from 'framer-motion';

// Variante d'animation pour l'apparition des blocs de section.
const variantsElement = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Composant réutilisable qui enveloppe une section dans un 'Paper' (carte) MUI
 * et ajoute des animations avec Framer Motion.
 * @param {{ children: React.ReactNode }} props
 */
const SectionPaper = ({ children }) => (
  <motion.div
    variants={variantsElement}
    // Ajoute un effet de "soulèvement" au survol
    whileHover={{ y: -8, transition: { type: 'spring', stiffness: 300 } }}
    style={{ height: '100%' }} // S'assure que le 'Paper' remplit la grille
  >
    <Paper
      elevation={2}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        padding: 3,
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'box-shadow 0.3s ease-in-out, transform 0.3s ease-in-out',
      }}
    >
      {children}
    </Paper>
  </motion.div>
);

export default SectionPaper;