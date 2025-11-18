import { Box, Typography, List, ListItem, ListItemText, Tooltip, Divider } from '@mui/material';
import { motion } from 'framer-motion';

const AffichageCompetences = ({ diplomes, sectionsCompetences }) => (
  <>
    <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
      Diplômes
    </Typography>
    <List dense>
      {diplomes.map((diplome) => (
        <ListItem key={diplome.id} sx={{ p: 0 }}>
          <ListItemText primary={diplome.titre} secondary={diplome.institution} />
        </ListItem>
      ))}
    </List>

    <Box sx={{ mt: 3 }}>
      {sectionsCompetences.map((section) => (
        <Box key={section.id} sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1, textTransform: 'uppercase', color: 'text.secondary', fontSize: '0.75rem' }}>
            {section.titre}
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, alignItems: 'center' }}>
            {section.competences.map((competence) => (
              <Tooltip title={competence.nom} key={competence.id} arrow>
                <motion.div whileHover={{ scale: 1.15, rotate: 5, transition: { type: 'spring', stiffness: 400 } }}>
                  <Box
                    component="img"
                    src={competence.logo}
                    alt={competence.nom}
                    loading="lazy"
                    sx={{
                      height: '4vh',
                      width: '4vh',
                      objectFit: 'contain'
                    }}
                  />
                </motion.div>
              </Tooltip>
            ))}
          </Box>
          <Divider sx={{ mt: 2, opacity: 0.5 }} />
        </Box>
      ))}
    </Box>
  </>
);

export default AffichageCompetences;