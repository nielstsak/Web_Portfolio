// [Symbole Commentaire] FICHIER : frontend/src/components/Parcours.jsx

import { Box, Typography, Paper, Container } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import ComputerIcon from '@mui/icons-material/Computer';
import { motion } from 'framer-motion';
import { LABELS } from '../config';

// Animation pour l'apparition en cascade
const variantsElement = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: 'easeOut',
    },
  }),
};

/**
 * Sélectionne l'icône appropriée selon le type d'élément.
 */
const obtenirIcone = (type) => {
  switch (type) {
    case LABELS.FORMATION:
      return <SchoolIcon />;
    case LABELS.SERVICE:
      return <VolunteerActivismIcon />;
    case LABELS.FREELANCE:
      return <ComputerIcon />;
    default:
      return <WorkIcon />;
  }
};

/**
 * Composant de présentation du parcours (Formation, Service Civique, Freelance).
 * Reçoit des données normalisées par le store.
 */
function Parcours({ donnees }) {
  if (!donnees || donnees.length === 0) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Typography 
        variant="h3" 
        component="h2" 
        sx={{ mb: 6, textAlign: 'center', fontWeight: 800, letterSpacing: '-0.5px' }}
      >
        Parcours
      </Typography>
      
      <Timeline position="alternate">
        {donnees.map((element, index) => (
          <TimelineItem 
            key={element.id}
            component={motion.div}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={variantsElement}
          >
            {/* Période (Gauche ou Droite selon parité) */}
            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
              <Typography variant="body2" color="text.secondary" fontWeight={500}>
                {element.periode}
              </Typography>
            </TimelineOppositeContent>

            {/* Connecteur Central */}
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: 'primary.light', opacity: 0.3 }} />
              <TimelineDot color="primary" variant="outlined">
                {obtenirIcone(element.type)}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'primary.light', opacity: 0.3 }} />
            </TimelineSeparator>

            {/* Carte de Contenu */}
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Paper 
                elevation={1} 
                sx={{ 
                  p: 2.5,
                  borderRadius: 2,
                  textAlign: 'left',
                  transition: 'box-shadow 0.3s ease',
                  '&:hover': { boxShadow: 4 }
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                    {element.titre}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 600, textTransform: 'uppercase' }}>
                    {element.type}
                  </Typography>
                </Box>
                
                {/* Description courte ou détails spécifiques */}
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {element.description}
                </Typography>

                {/* Affichage conditionnel des missions pour Freelance/Service */}
                {element.raw?.missions && element.raw.missions.length > 0 && (
                  <Box component="ul" sx={{ pl: 2, mt: 1, mb: 0, typography: 'caption', color: 'text.secondary' }}>
                    {element.raw.missions.slice(0, 3).map((m, i) => (
                      <li key={i}>{m.sous_titre}</li>
                    ))}
                  </Box>
                )}
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}

export default Parcours;