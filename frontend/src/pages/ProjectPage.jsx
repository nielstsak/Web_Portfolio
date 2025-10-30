// frontend/src/pages/ProjectPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Paper, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CodeBrowser from '../components/CodeBrowser';
import { apiClient } from '../store/appStore'; // Assumant que apiClient est exporté depuis le store

// --- Variantes d'animation Framer Motion ---
const pageVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const tabPanelVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Composant utilitaire pour les panneaux d'onglets (Tabs).
 */
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box>{children}</Box>}
    </div>
  );
}

/**
 * Page affichant les détails complets d'un projet spécifique.
 */
function ProjectPage() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  // --- États locaux ---
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);

  // Charge les données du projet au montage du composant ou si l'ID change.
  useEffect(() => {
    const fetchProject = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.get(`/projects/${projectId}/`);
        setProject(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération du projet.');
      } finally {
        setLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  // Gère le changement d'onglet, avec un cas spécial pour ouvrir la modale du code.
  const handleTabChange = (event, newValue) => {
    if (newValue === 3) { // L'onglet "Code Source"
      setIsCodeModalOpen(true);
    } else {
      setTabValue(newValue);
    }
  };

  // --- Rendu conditionnel (chargement, erreur) ---
  if (loading) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color="primary" /></Container>;
  }
  if (error) {
    return <Container sx={{ py: 8 }}><Alert severity="error" variant="filled">{error}</Alert></Container>;
  }
  if (!project) return null;

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={pageVariants}>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            <IconButton onClick={() => navigate('/')} sx={{ mr: 2, backgroundColor: 'rgba(255,255,255,1)' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>{project.title}</Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
            {/* Colonne principale : Vidéo */}
            <Grid item size={{ xs: 12, md: 9 }}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                {project.video && (
                  <Box component="video" src={project.video} controls muted playsInline sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </Paper>
            </Grid>
            
            {/* Colonne latérale : Technologies */}
            <Grid item size={{ xs: 12, md: 3 }}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ paddingBottom: 6, mb: 2, fontWeight: 600 }}>Technologies</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'space-around' }}>
                  {project.technologies.map(tech => (
                    <Tooltip title={tech.nom} key={tech.id} arrow>
                      <motion.div whileHover={{ y: -4, transition: { type: 'spring', stiffness: 300 } }}>
                        <img src={tech.logo} alt={tech.nom} style={{ height: '75px', width: '75px', objectFit: 'contain' }} loading="lazy" />
                      </motion.div>
                    </Tooltip>
                  ))}
                </Box>
              </Paper>
            </Grid>

            {/* Section inférieure : Onglets de détails */}
            <Grid item size={{ xs: 12 }}>
              <Paper elevation={2} sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'auto' }}>
                <Box sx={{ p: 3, pb: 0, borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
                    <Tab label="Description" />
                    <Tab label="Tâches" />
                    <Tab label="Travail Détaillé" />
                    <Tab label="Code Source" />
                  </Tabs>
                </Box>
                <Box sx={{ p: 3 }}>
                  <AnimatePresence mode="wait">
                    <motion.div key={tabValue} initial="hidden" animate="visible" variants={tabPanelVariants}>
                      <TabPanel value={tabValue} index={0}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{project.description}</Typography>
                      </TabPanel>
                      <TabPanel value={tabValue} index={1}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{project.tasks_effectuees}</Typography>
                      </TabPanel>
                      <TabPanel value={tabValue} index={2}>
                        {project.work_done.map((work) => (
                          <Box key={work.id} sx={{ mb: 2.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{work.subtitle}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{work.description}</Typography>
                          </Box>
                        ))}
                      </TabPanel>
                    </motion.div>
                  </AnimatePresence>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </motion.div>

      {/* Modale pour l'explorateur de code */}
      <AnimatePresence>
        {isCodeModalOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCodeModalOpen(false)}
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1300 }}
            />
            <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1301 }}>
              <motion.div
                variants={modalVariants} initial="hidden" animate="visible" exit="exit"
                style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column' }}
              >
                <Paper elevation={4} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <IconButton onClick={() => setIsCodeModalOpen(false)}><CloseIcon /></IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}><CodeBrowser projectId={projectId} /></Box>
                </Paper>
              </motion.div>
            </Box>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default ProjectPage;