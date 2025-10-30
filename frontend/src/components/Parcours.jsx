// frontend/src/components/Parcours.jsx

import { Box, Typography, Paper, Container } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import { motion } from 'framer-motion';

// Animation pour l'apparition en cascade de chaque item de la timeline.
const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

/**
 * Convertit une chaîne de date "JJ/MM/AAAA" en un objet Date JavaScript.
 * @param {string} dateString La date au format "JJ/MM/AAAA".
 * @returns {Date} L'objet Date correspondant.
 */
const parseDate = (dateString) => {
  const parts = dateString.split('/');
  // Les mois en JS sont indexés à partir de 0 (0 = Janvier).
  return new Date(parts[2], parts[1] - 1, parts[0]);
};

/**
 * Affiche le parcours professionnel et académique sous forme de timeline verticale.
 * @param {{ parcoursData: Array<object> }} props
 */
function Parcours({ parcoursData }) {
  if (!parcoursData || parcoursData.length === 0) {
    return null;
  }

  // Tri des expériences de la plus ancienne à la plus récente pour l'affichage chronologique.
  const sortedParcours = [...parcoursData].sort((a, b) => {
    const dateA = parseDate(a.periode.split('⟶')[0].trim());
    const dateB = parseDate(b.periode.split('⟶')[0].trim());
    return dateA - dateB;
  });

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h3" component="h2" sx={{ mb: 6, textAlign: 'center', fontWeight: 'bold' }}>
        Mon Parcours
      </Typography>
      <Timeline position="alternate">
        {sortedParcours.map((item, index) => (
          <TimelineItem 
            key={item.id}
            component={motion.div}
            custom={index}
            initial="hidden"
            animate="visible"
            variants={itemVariants}
          >
            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
              <Paper 
                elevation={2} 
                sx={{ p: 1, textAlign: 'center', display: 'inline-block' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {item.periode}
                </Typography>
              </Paper>
            </TimelineOppositeContent>

            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
              <TimelineDot color="primary" variant="outlined">
                {/* Affiche une icône différente pour la formation ou l'expérience professionnelle. */}
                {item.poste.toLowerCase().includes('etudiant') || item.poste.toLowerCase().includes('formation') 
                  ? <SchoolIcon color="primary" /> 
                  : <WorkIcon color="primary" />}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
            </TimelineSeparator>

            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2.5,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: 8
                  }
                }}
              >
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {item.poste}
                </Typography>
                <Typography>{item.description}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}

export default Parcours;