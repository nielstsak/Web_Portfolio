// frontend/src/components/Introduction.jsx

import { Box, Grid, Typography, CircularProgress, Alert, Container, Divider } from '@mui/material';
import { motion } from 'framer-motion';
import { useAppStore } from '../store/appStore';
import SectionPaper from './introduction/SectionPaper';
import ContactInfo from './introduction/ContactInfo';
import SkillsDisplay from './introduction/SkillsDisplay';

// Gère l'animation d'apparition en cascade des éléments.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.2 },
  },
};

/**
 * Section principale présentant les informations personnelles, diplômes et compétences.
 * @param {{isVisible: boolean}} props
 */
function Introduction({ isVisible }) {
  // --- Récupération des données depuis le store global Zustand ---
  const presentation = useAppStore((state) => state.presentation);
  const postes = useAppStore((state) => state.postes);
  const diplomes = useAppStore((state) => state.diplomes);
  const competences = useAppStore((state) => state.competences);
  const loading = useAppStore((state) => state.loading);
  const error = useAppStore((state) => state.error);

  // --- Gestion des rendus conditionnels ---
  if (!isVisible) return null;
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress color="inherit" /></Box>;
  if (error) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div variants={containerVariants} initial="hidden" animate="visible" style={{ width: '100%' }}>
        <Grid container spacing={4} alignItems="stretch">
          
          {/* Colonne de Gauche : Présentation */}
          <Grid item size={{ xs: 12, md: 7 }}>
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom>
                Présentation
              </Typography>
              <ContactInfo presentation={presentation} postes={postes} />
              <Divider sx={{ my: 3 }} />
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {presentation?.texte}
              </Typography>
            </SectionPaper>
          </Grid>
          
          {/* Colonne de Droite : Diplômes & Compétences */}
          <Grid item size={{ xs: 12, md: 5 }}>
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom>
                Diplômes & Compétences
              </Typography>
              <SkillsDisplay diplomes={diplomes} competences={competences} />
            </SectionPaper>
          </Grid>

        </Grid>
      </motion.div>
    </Container>
  );
}

export default Introduction;