// frontend/src/components/Introduction.jsx

import { Box, Grid, Typography, CircularProgress, Alert, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import SectionPaper from './introduction/SectionPaper';
import InfosContact from './introduction/ContactInfo';
import AffichageCompetences from './introduction/SkillsDisplay';

const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.2 },
  },
};

/**
 * Section d'introduction (Haut de page).
 * Orchestre l'affichage des sous-composants Contact et Compétences.
 */
function Introduction({ estVisible }) {
  // Consommation directe des états de chargement/erreur
  const presentation = useAppStore((state) => state.presentation);
  const chargement = useAppStore((state) => state.chargementIntro);
  const erreur = useAppStore((state) => state.erreur);

  if (!estVisible) return null; 
  
  if (chargement) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

  if (erreur) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Alert severity="error">{erreur}</Alert>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', py: 4 }}>
      <motion.div 
        variants={variantsConteneur} 
        initial="hidden" 
        animate="visible" 
        style={{ width: '100%' }}
      >
        <Grid container spacing={4} alignItems="stretch">
          
          {/* Colonne Gauche : Identité & Bio */}
          <Grid item size={{ xs: 12, md: 7 }}>
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Présentation
              </Typography>
              
              {/* Les composants enfants accèdent désormais au store eux-mêmes */}
              <InfosContact />
              
              <Divider sx={{ my: 3 }} />
              
              {/* Affichage conditionnel des détails de présentation */}
              {presentation?.details?.map((detail) => (
                 <Box key={detail.id} sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem', mb: 0.5 }}>
                      {detail.titre}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>
                      {detail.description}
                    </Typography>
                 </Box>
              ))}
            </SectionPaper>
          </Grid>
          
          {/* Colonne Droite : Compétences & Diplômes */}
          <Grid item size={{ xs: 12, md: 5 }}>
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                Compétences & Cursus
              </Typography>
              <AffichageCompetences />
            </SectionPaper>
          </Grid>

        </Grid>
      </motion.div>
    </Container>
  );
}

export default Introduction;