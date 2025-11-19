// frontend/src/components/introduction/SkillsDisplay.jsx

import { Box, Typography, List, ListItem, ListItemText, Tooltip, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppStore } from '../../store/appStore';

/**
 * Affiche les diplômes et la grille de logos de compétences.
 * Connecté au store global.
 */
const AffichageCompetences = () => {
  const diplomes = useAppStore((state) => state.diplomes);
  const sectionsCompetences = useAppStore((state) => state.sectionsCompetences);

  return (
    <>
      {/* Section Diplômes */}
      {diplomes.length > 0 && (
        <>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'text.secondary', textTransform: 'uppercase', fontSize: '0.75rem', mt: 1 }}>
            Diplômes
          </Typography>
          <List dense>
            {diplomes.map((diplome) => (
              <ListItem key={diplome.id} sx={{ px: 0 }}>
                <ListItemText 
                  primary={diplome.titre} 
                  secondary={diplome.institution}
                  primaryTypographyProps={{ fontWeight: 500 }}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
        </>
      )}

      {/* Section Compétences Techniques */}
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
    </>
  );
};

export default AffichageCompetences;