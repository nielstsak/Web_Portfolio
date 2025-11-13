// frontend/src/pages/ProjectPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, CircularProgress, Alert, Grid, Paper, IconButton, Tooltip, Tabs, Tab } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CloseIcon from '@mui/icons-material/Close';
import CodeBrowser from '../components/CodeBrowser';
import { clientApi } from '../store/appStore'; // Renommé depuis apiClient

// --- Variantes d'animation Framer Motion ---
const variantsPage = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const variantsPanneauOnglet = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const variantsModale = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

/**
 * Composant utilitaire pour les panneaux d'onglets (Tabs).
 * N'affiche son contenu que si 'value' (ongletActif) correspond à son 'index'.
 */
function PanneauOnglet(props) {
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
  const { idProjet } = useParams(); // Récupère l'ID du projet depuis l'URL
  const navigation = useNavigate();
  // --- États locaux ---
  const [projet, setProjet] = useState(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState(null);
  const [ongletActif, setOngletActif] = useState(0); // Index de l'onglet
  const [estModaleCodeOuverte, setEstModaleCodeOuverte] = useState(false);

  // Charge les données du projet au montage ou si l'ID change.
  useEffect(() => {
    const chargerProjet = async () => {
      setChargement(true);
      setErreur(null);
      try {
        const reponse = await clientApi.get(`/projets/${idProjet}/`);
        setProjet(reponse.data);
      } catch (err) {
        setErreur('Erreur lors de la récupération du projet.');
      } finally {
        setChargement(false);
      }
    };
    chargerProjet();
  }, [idProjet]);

  // Gère le changement d'onglet.
  const gererChangementOnglet = (evenement, nouvelIndex) => {
    if (nouvelIndex === 3) { // L'onglet "Code Source" (index 3)
      setEstModaleCodeOuverte(true); // Ouvre la modale
    } else {
      setOngletActif(nouvelIndex); // Change l'onglet
    }
  };

  // --- Rendu conditionnel (chargement, erreur) ---
  if (chargement) {
    return <Container sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><CircularProgress color="primary" /></Container>;
  }
  if (erreur) {
    return <Container sx={{ py: 8 }}><Alert severity="error" variant="filled">{erreur}</Alert></Container>;
  }
  if (!projet) return null; // Ne rien afficher si le projet n'est pas (encore) chargé

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={variantsPage}>
        <Container maxWidth="xl" sx={{ py: 5 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
            {/* Bouton de retour */}
            <IconButton onClick={() => navigation('/')} sx={{ mr: 2, backgroundColor: 'rgba(255,255,255,1)' }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h3" component="h1" sx={{ fontWeight: 700 }}>{projet.titre}</Typography>
          </Box>
          
          <Grid container spacing={4} sx={{ alignItems: 'stretch' }}>
            {/* Colonne principale : Vidéo */}
            <Grid item xs={12} md={9}>
              <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden', height: '100%' }}>
                {projet.video && (
                  <Box component="video" src={projet.video} controls muted playsInline sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                )}
              </Paper>
            </Grid>
            
            {/* Colonne latérale : Technologies */}
            <Grid item xs={12} md={3}>
              <Paper elevation={2} sx={{ p: 3, borderRadius: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Typography variant="h5" sx={{ paddingBottom: 6, mb: 2, fontWeight: 600 }}>Technologies</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, alignItems: 'center', justifyContent: 'space-around' }}>
                  {projet.technologies.map(tech => (
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
            <Grid item xs={12}>
              <Paper elevation={2} sx={{ borderRadius: 2, display: 'flex', flexDirection: 'column', height: 'auto' }}>
                <Box sx={{ p: 3, pb: 0, borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={ongletActif} onChange={gererChangementOnglet} variant="fullWidth">
                    <Tab label="Description" />
                    <Tab label="Tâches" />
                    <Tab label="Travail Détaillé" />
                    <Tab label="Code Source" />
                  </Tabs>
                </Box>
                <Box sx={{ p: 3 }}>
                  <AnimatePresence mode="wait">
                    {/* La 'key' force le composant à se remonter à chaque changement d'onglet, déclenchant l'animation */}
                    <motion.div key={ongletActif} initial="hidden" animate="visible" variants={variantsPanneauOnglet}>
                      <PanneauOnglet value={ongletActif} index={0}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{projet.description}</Typography>
                      </PanneauOnglet>
                      <PanneauOnglet value={ongletActif} index={1}>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.8 }}>{projet.tasks_effectuees}</Typography>
                      </PanneauOnglet>
                      <PanneauOnglet value={ongletActif} index={2}>
                        {projet.travaux_effectues.map((travail) => (
                          <Box key={travail.id} sx={{ mb: 2.5 }}>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>{travail.sous_titre}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>{travail.description}</Typography>
                          </Box>
                        ))}
                      </PanneauOnglet>
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
        {estModaleCodeOuverte && (
          <>
            {/* Fond assombri et flouté */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setEstModaleCodeOuverte(false)} // Ferme la modale en cliquant sur le fond
              style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)', zIndex: 1300 }}
            />
            {/* Contenu de la modale */}
            <Box sx={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1301 }}>
              <motion.div
                variants={variantsModale} initial="hidden" animate="visible" exit="exit"
                style={{ width: '90%', height: '90%', display: 'flex', flexDirection: 'column' }}
              >
                <Paper elevation={4} sx={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <Box sx={{ p: 1, display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid rgba(0,0,0,0.12)' }}>
                    <IconButton onClick={() => setEstModaleCodeOuverte(false)}><CloseIcon /></IconButton>
                  </Box>
                  <Box sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <CodeBrowser idProjet={idProjet} />
                  </Box>
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