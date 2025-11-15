// frontend/src/components/chronologie/ControlesFiltrage.jsx

import { Box, Chip } from '@mui/material';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

// Doit correspondre à TOUS_LES_TYPES dans appStore.jsx
const TYPES_EVENEMENTS = [
  'Etudes',
  'Diplome',
  'Service civique',
  'Projets Etudiant',
  'Projets Professionnels',
  'Projets Personnels',
  'Activité rémunératrice'
];

// Mappage des couleurs pour la cohérence visuelle
const COULEURS_TYPES = {
  'Etudes': 'info',
  'Diplome': 'info',
  'Service civique': 'secondary',
  'Projets Etudiant': 'success',
  'Projets Professionnels': 'success',
  'Projets Personnels': 'success',
  'Activité rémunératrice': 'warning',
};

/**
 * Affiche les puces (Chips) cliquables pour filtrer les événements par type.
 */
function ControlesFiltrage() {
  const typesFiltres = useAppStore((state) => state.typesFiltres);
  const basculerFiltreType = useAppStore((state) => state.basculerFiltreType);

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 1, 
        justifyContent: 'center', 
        mb: 4 
      }}
    >
      {TYPES_EVENEMENTS.map((type) => {
        const estActif = typesFiltres.has(type);
        return (
          <motion.div 
            key={type}
            whileHover={{ y: -3 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Chip
              label={type}
              color={COULEURS_TYPES[type] || 'default'}
              variant={estActif ? 'filled' : 'outlined'}
              onClick={() => basculerFiltreType(type)}
              sx={{ cursor: 'pointer', fontWeight: estActif ? 600 : 400 }}
            />
          </motion.div>
        );
      })}
    </Box>
  );
}

export default ControlesFiltrage;