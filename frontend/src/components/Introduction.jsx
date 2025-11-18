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

function Introduction({ estVisible }) {
  const presentation = useAppStore((state) => state.presentation);
  const postes = useAppStore((state) => state.postes);
  const diplomes = useAppStore((state) => state.diplomes);
  const sectionsCompetences = useAppStore((state) => state.sectionsCompetences);
  const chargement = useAppStore((state) => state.loading);
  const erreur = useAppStore((state) => state.error);

  if (!estVisible) return null; 
  if (chargement) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress color="inherit" /></Box>;
  if (erreur) return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><Alert severity="error">{erreur}</Alert></Box>;

  return (
    <Container maxWidth="lg" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <motion.div 
        variants={variantsConteneur} 
        initial="hidden" 
        animate="visible" 
        style={{ width: '100%' }}
      >
        <Grid container spacing={4} alignItems="stretch">
          
          <Grid item size={{ xs: 12, md: 7 }} >
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom>
                Présentation
              </Typography>
              <InfosContact presentation={presentation} postes={postes} />
              <Divider sx={{ my: 3 }} />
              
              {presentation?.sous_titre && (
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {presentation.sous_titre}
                </Typography>
              )}
              <Typography variant="body2" sx={{ color: 'text.secondary', whiteSpace: 'pre-wrap' }}>
                {presentation?.description}
              </Typography>
            </SectionPaper>
          </Grid>
          
          <Grid item size={{ xs: 12, md: 5 }} >
            <SectionPaper>
              <Typography variant="h5" component="h2" gutterBottom>
                Diplômes & Compétences
              </Typography>
              <AffichageCompetences diplomes={diplomes} sectionsCompetences={sectionsCompetences} />
            </SectionPaper>
          </Grid>

        </Grid>
      </motion.div>
    </Container>
  );
}

export default Introduction;