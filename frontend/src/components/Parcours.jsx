// frontend/src/components/Parcours.jsx

import { Box, Typography, Paper, Container } from '@mui/material';
import { Timeline, TimelineItem, TimelineSeparator, TimelineConnector, TimelineContent, TimelineDot, TimelineOppositeContent } from '@mui/lab';
import SchoolIcon from '@mui/icons-material/School'; // Icône pour la formation
import WorkIcon from '@mui/icons-material/Work'; // Icône pour l'expérience pro
import { motion } from 'framer-motion';

// Animation pour l'apparition en cascade de chaque élément
const variantsElement = {
  hidden: { opacity: 0, y: 50 },
  visible: (i) => ({ // 'i' est l'index de l'élément
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.2, // Délai progressif
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

/**
 * Convertit une chaîne de date "JJ/MM/AAAA" en un objet Date JavaScript.
 * @param {string} chaineDate La date au format "JJ/MM/AAAA".
 * @returns {Date} L'objet Date correspondant.
 */
const analyserDate = (chaineDate) => {
  const elements = chaineDate.split('/');
  // Les mois en JS sont indexés à partir de 0 (0 = Janvier)
  return new Date(elements[2], elements[1] - 1, elements[0]);
};

/**
 * Affiche le parcours professionnel et académique sous forme de timeline verticale.
 * @param {{ donneesParcours: Array<object> }} props
 */
function Parcours({ donneesParcours }) {
  if (!donneesParcours || donneesParcours.length === 0) {
    return null;
  }

  // Trie les expériences de la plus ancienne à la plus récente pour l'affichage chronologique.
  const parcoursTrie = [...donneesParcours].sort((a, b) => {
    // Extrait la date de début (partie avant '⟶')
    const dateA = analyserDate(a.periode.split('⟶')[0].trim());
    const dateB = analyserDate(b.periode.split('⟶')[0].trim());
    return dateA - dateB; // Tri chronologique ascendant
  });

  return (
    <Container maxWidth="md" sx={{ py: 4, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h3" component="h2" sx={{ mb: 6, textAlign: 'center', fontWeight: 'bold' }}>
        Mon Parcours
      </Typography>
      <Timeline position="alternate">
        {parcoursTrie.map((element, index) => (
          <TimelineItem 
            key={element.id}
            component={motion.div}
            custom={index} // Passe l'index à l'animation 'visible'
            initial="hidden"
            animate="visible"
            variants={variantsElement}
          >
            {/* Colonne de gauche (ou droite) : Période */}
            <TimelineOppositeContent sx={{ m: 'auto 0' }}>
              <Paper 
                elevation={2} 
                sx={{ p: 1, textAlign: 'center', display: 'inline-block' }}
              >
                <Typography variant="body2" color="text.secondary">
                  {element.periode}
                </Typography>
              </Paper>
            </TimelineOppositeContent>

            {/* Centre : Point et connecteurs */}
            <TimelineSeparator>
              <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
              <TimelineDot color="primary" variant="outlined">
                {/* Affiche une icône différente pour formation ou expérience */}
                {element.poste.toLowerCase().includes('etudiant') || element.poste.toLowerCase().includes('formation') 
                  ? <SchoolIcon color="primary" /> 
                  : <WorkIcon color="primary" />}
              </TimelineDot>
              <TimelineConnector sx={{ bgcolor: 'primary.main' }} />
            </TimelineSeparator>

            {/* Contenu principal : Carte de l'expérience */}
            <TimelineContent sx={{ py: '12px', px: 2 }}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 2.5,
                  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-5px)', // Léger soulèvement au survol
                    boxShadow: 8
                  }
                }}
              >
                <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                  {element.poste}
                </Typography>
                <Typography>{element.description}</Typography>
              </Paper>
            </TimelineContent>
          </TimelineItem>
        ))}
      </Timeline>
    </Container>
  );
}

export default Parcours;