// frontend/src/components/chronologie/ControlesFiltrage.jsx

import { Box, Chip } from '@mui/material';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';
import { TYPES_EVENEMENTS, COULEURS_TYPES_MUI } from '../../config';

/**
 * Affiche les puces (Chips) cliquables pour filtrer les événements par type.
 * Utilise la configuration centralisée.
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
              color={COULEURS_TYPES_MUI[type] || 'default'}
              variant={estActif ? 'filled' : 'outlined'}
              onClick={() => basculerFiltreType(type)}
              sx={{ 
                cursor: 'pointer', 
                fontWeight: estActif ? 600 : 400,
                boxShadow: estActif ? 2 : 0 
              }}
            />
          </motion.div>
        );
      })}
    </Box>
  );
}

export default ControlesFiltrage;