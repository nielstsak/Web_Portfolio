import { useState } from 'react';
import { Box, Typography, List, ListItem, ListItemText, Tooltip, Divider, Modal, Fade, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';

const AffichageCompetences = () => {
  const diplomes = useAppStore((state) => state.diplomes);
  const sectionsCompetences = useAppStore((state) => state.sectionsCompetences);
  
  const [diplomeSelectionne, setDiplomeSelectionne] = useState(null);

  const ouvrirDiplome = (diplome) => {
    if (diplome.parchemin) {
      setDiplomeSelectionne(diplome);
    }
  };

  const fermerDiplome = () => {
    setDiplomeSelectionne(null);
  };

  return (
    <>
      {diplomes.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', mt: 1 }}>
            Diplômes
          </Typography>
          <List dense>
            {diplomes.map((diplome) => (
              <ListItem 
                key={diplome.id} 
                sx={{ 
                  px: 0, 
                  cursor: diplome.parchemin ? 'pointer' : 'default',
                  '&:hover .MuiTypography-primary': {
                    color: diplome.parchemin ? 'primary.main' : 'inherit',
                    textDecoration: diplome.parchemin ? 'underline' : 'none'
                  }
                }}
                onClick={() => ouvrirDiplome(diplome)}
              >
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {diplome.titre}
                      {diplome.parchemin && <VisibilityIcon fontSize="inherit" color="action" sx={{ opacity: 0.7 }} />}
                    </Box>
                  } 
                  secondary={diplome.institution}
                  primaryTypographyProps={{ fontWeight: 500, transition: 'color 0.2s' }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      <Box sx={{ mt: 2 }}>
        {sectionsCompetences.map((section) => (
          <Box key={section.id} sx={{ mb: 3 }}>
            <Typography 
              variant="subtitle2" 
              sx={{ fontWeight: 'bold', mb: 1.5, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem' }}
            >
              {section.titre}
            </Typography>
            
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, alignItems: 'center' }}>
              {section.competences.map((competence) => (
                <Tooltip title={competence.nom} key={competence.id} arrow>
                  <motion.div 
                    whileHover={{ scale: 1.2, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  >
                    <Box
                      component="img"
                      src={competence.logo}
                      alt={competence.nom}
                      loading="lazy"
                      sx={{
                        height: 32,
                        width: 32,
                        objectFit: 'contain',
                        filter: 'grayscale(20%)',
                        transition: 'filter 0.3s',
                        '&:hover': { filter: 'grayscale(0%)' }
                      }}
                    />
                  </motion.div>
                </Tooltip>
              ))}
            </Box>
          </Box>
        ))}
      </Box>

      <Modal
        open={!!diplomeSelectionne}
        onClose={fermerDiplome}
        closeAfterTransition
        BackdropProps={{
          timeout: 500,
          sx: { backgroundColor: 'rgba(0, 0, 0, 0.85)' }
        }}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Fade in={!!diplomeSelectionne}>
          <Box sx={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh', outline: 'none' }}>
            <IconButton 
              onClick={fermerDiplome}
              sx={{ 
                position: 'absolute', 
                top: -40, 
                right: -10, 
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              <CloseIcon fontSize="large" />
            </IconButton>

            {diplomeSelectionne && (
              <Box
                component="img"
                src={diplomeSelectionne.parchemin}
                alt={`Diplôme ${diplomeSelectionne.titre}`}
                sx={{
                  maxWidth: '100%',
                  maxHeight: '85vh',
                  borderRadius: 1,
                  boxShadow: 24,
                  display: 'block'
                }}
              />
            )}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default AffichageCompetences;