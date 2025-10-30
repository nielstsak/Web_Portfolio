// frontend/src/components/introduction/SkillsDisplay.jsx

import { Box, Typography, List, ListItem, ListItemText, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';

/**
 * Affiche la liste des diplômes et une grille des logos de compétences.
 * @param {{
 * diplomes: Array<{id: number, titre: string, institution: string}>,
 * competences: Array<{id: number, nom: string, logo: string}>
 * }} props
 */
const SkillsDisplay = ({ diplomes, competences }) => (
  <>
    {/* Section des diplômes */}
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

    {/* Section des compétences */}
    <Typography variant="subtitle1" sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}>
      Compétences
    </Typography>
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 6, alignItems: 'center' }}>
      {competences.map((competence) => (
        <Tooltip title={competence.nom} key={competence.id} arrow>
          <motion.div whileHover={{ scale: 1.15, rotate: 5, transition: { type: 'spring', stiffness: 400 } }}>
            <Box
              component="img"
              src={competence.logo}
              alt={competence.nom}
              loading="lazy"
              sx={{
                height: '5vh',
                width: '5vh',
                objectFit: 'contain'
              }}
            />
          </motion.div>
        </Tooltip>
      ))}
    </Box>
  </>
);

export default SkillsDisplay;