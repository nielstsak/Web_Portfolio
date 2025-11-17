// frontend/src/components/SectionChronologie.jsx

import { Container, Typography, Box, Divider, Paper } from '@mui/material';
import { motion } from 'framer-motion';
// Imports décommentés
import ControlesFiltrage from './chronologie/ControlesFiltrage';
import GrilleEvenements from './chronologie/GrilleEvenements';
import CalendrierActivite from './chronologie/CalendrierActivite';

// Gère l'animation d'apparition en cascade des éléments.
const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.1 },
  },
};

// Animation pour chaque bloc (Filtres, Grille, Calendrier)
const variantsElement = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/**
 * Section principale affichant la timeline chronologique (Filtres, Grille, Calendrier).
 * @param {{ evenementsFiltres: Array<object> }} props
 */
function SectionChronologie({ evenementsFiltres }) {

  return (
    <Container 
      maxWidth="xl" 
      sx={{ 
        py: 4, 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column' 
      }}
    >
      {/* Conteneur motion principal qui gère la hauteur de la section */}
      <motion.div 
        variants={variantsConteneur} 
        initial="hidden" 
        animate="visible" 
        style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, minHeight: 0 }}
      >
        
        <motion.div variants={variantsElement}>
          <Typography variant="h3" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
            Chronologie
          </Typography>
        </motion.div>

        {/* Filtres (Tâche 12) */}
        <motion.div variants={variantsElement} style={{ flexShrink: 0 }}>
          <ControlesFiltrage />
        </motion.div>
        
        {/* Grille des événements (Tâche 13) */}
        {/* 'flexGrow: 1' et 'overflowY: auto' sont cruciaux */}
        {/* 'minHeight: 0' est requis pour que flexbox gère correctement le débordement */}
        <motion.div 
          variants={variantsElement} 
          style={{ 
            flexGrow: 1, 
            overflowY: 'auto', 
            padding: '2px', 
            minHeight: 0, 
            maxHeight: 'calc(100vh - 400px)', // Limite la hauteur
          }}
        >
          <GrilleEvenements evenements={evenementsFiltres} />
        </motion.div>

        {/* Calendrier (Tâche 15) */}
        <motion.div variants={variantsElement} style={{ flexShrink: 0, marginTop: '32px' }}>
          <Paper 
            elevation={2} 
            sx={{ 
              p: 2, 
              borderRadius: 2, 
              overflow: 'hidden' 
            }}
          >
            <Divider sx={{ mb: 2 }}>
              <Typography variant="overline">Calendrier</Typography>
            </Divider>
            
            <CalendrierActivite evenements={evenementsFiltres} />
          </Paper>
        </motion.div>

      </motion.div>
    </Container>
  );
}

export default SectionChronologie;