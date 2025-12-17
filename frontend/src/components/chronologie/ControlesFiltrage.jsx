import { Box, Button } from '@mui/material';
import { useAppStore } from '../../store/appStore';
import { motion } from 'framer-motion';

function ControlesFiltrage() {
  const filtreActif = useAppStore((state) => state.filtreActif);
  const setFiltre = useAppStore((state) => state.setFiltre);
  const categories = useAppStore((state) => state.listeCategories());

  if (!categories || categories.length <= 1) return null;

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: 1.5 
      }}
    >
      {categories.map((categorie) => {
        const estActif = filtreActif === categorie;
        
        return (
          <motion.div 
            key={categorie}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant={estActif ? "contained" : "outlined"}
              onClick={() => setFiltre(categorie)}
              disableElevation
              sx={{
                borderRadius: '20px',
                textTransform: 'none',
                fontWeight: estActif ? 600 : 400,
                borderWidth: '1.5px',
                borderColor: estActif ? 'primary.main' : 'rgba(0, 0, 0, 0.12)',
                backgroundColor: estActif ? 'primary.main' : 'transparent',
                color: estActif ? '#fff' : 'text.primary',
                padding: '6px 20px',
                '&:hover': {
                  borderWidth: '1.5px',
                  backgroundColor: estActif ? 'primary.dark' : 'rgba(0, 0, 0, 0.04)',
                }
              }}
            >
              {categorie}
            </Button>
          </motion.div>
        );
      })}
    </Box>
  );
}

export default ControlesFiltrage;