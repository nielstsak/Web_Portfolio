// frontend/src/components/chronologie/ModaleEvenement.jsx

import { Box, Modal, Paper, Typography, IconButton, Divider, Chip, Link, List, ListItemText, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code'; // Pour le lien vers le code
import ArticleIcon from '@mui/icons-material/Article'; // Pour le justificatif
import { motion, AnimatePresence } from 'framer-motion';

// Style du conteneur de la modale
const styleModale = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '95%', md: '80%', lg: '60%' },
  maxHeight: '90vh', // Hauteur maximale
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', // Géré par les sous-composants
};

// Animation "drop-in" pour la modale
const variantsDropIn = {
  hidden: { y: "-5vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 25 } },
  exit: { y: "5vh", opacity: 0, transition: { duration: 0.2 } },
};

/**
 * Helper interne pour afficher les listes de missions/travaux
 */
const AffichageMissions = ({ items, titre }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>{titre}</Typography>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ mb: 1.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{item.sous_titre}</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {item.description}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

/**
 * Helper interne pour afficher les données (précédemment 'specificites')
 * en fonction du type d'événement.
 */
const AffichageSpecificites = ({ type, specificites }) => {

  // Types "Projet" (Pro, Etudiant, Perso)
  if (type.startsWith('Projets')) {
    const { 
      institution, role, technologies, media_video, 
      media_photos, code_source_zip, travail_effectue 
    } = specificites;
    
    return (
      <Box>
        {institution && <Typography variant="overline">Cadre: {institution}</Typography>}
        {role && <Typography variant="overline">Rôle: {role}</Typography>}
        
        {technologies?.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Technologies</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {technologies.map(tech => <Chip key={tech} label={tech} size="small" />)}
            </Box>
          </Box>
        )}

        {(media_video || media_photos?.length > 0) && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Média</Typography>
            {/* Cas Vidéo */}
            {media_video && (
              <Box 
                component="video" 
                src={media_video} 
                controls 
                muted 
                playsInline 
                sx={{ width: '100%', borderRadius: 1, backgroundColor: '#000' }} 
              />
            )}
            {/* Cas Photos (Affiche la première photo) */}
            {/* TODO: Implémenter un carrousel si plusieurs photos */}
            {media_photos?.length > 0 && !media_video && (
               <Box 
                component="img" 
                src={media_photos[0].image} 
                alt={media_photos[0].legende || "Aperçu projet"} 
                sx={{ width: '100%', borderRadius: 1 }} 
              />
            )}
          </Box>
        )}

        {/* Sections "Travail Détaillé" */}
        <AffichageMissions items={travail_effectue} titre="Travail Détaillé" />

        {code_source_zip && (
          <Button 
            variant="outlined" 
            href={code_source_zip} 
            target="_blank" 
            rel="noopener" 
            startIcon={<CodeIcon />}
            sx={{ mt: 2 }}
          >
            Voir le code source (.zip)
          </Button>
        )}
      </Box>
    );
  }

  // Autres types d'événements
  switch (type) {
    case 'Formation':
      return (
        <Box>
          <List dense>
            <ListItemText primary="Institution" secondary={specificites.institution} />
            <ListItemText primary="Description" secondary={specificites.description} sx={{ whiteSpace: 'pre-wrap' }} />
          </List>
          {specificites.justificatif && (
            <Button 
              variant="outlined" 
              href={specificites.justificatif} 
              target="_blank" 
              rel="noopener" 
              startIcon={<ArticleIcon />}
              sx={{ mt: 2 }}
            >
              Voir le justificatif
            </Button>
          )}
        </Box>
      );
      
    case 'Service civique':
       return (
        <Box>
          <List dense>
            <ListItemText primary="Organisme" secondary={specificites.organisme_accueil} />
          </List>
          <AffichageMissions items={specificites.missions} titre="Missions" />
        </Box>
      );
      
    case 'Activité rémunératrice':
      return (
        <Box>
          <List dense>
            <ListItemText primary="Poste" secondary={specificites.poste} />
          </List>
          <AffichageMissions items={specificites.missions} titre="Missions" />
        </Box>
      );
      
    default:
      return null;
  }
};


/**
 * Modale affichant les détails complets d'un EvenementChronologique.
 * @param {{ evenement: object, ouvert: boolean, onFermer: function }} props
 */
function ModaleEvenement({ evenement, ouvert, onFermer }) {
  if (!evenement) return null;

  return (
    <Modal
      open={ouvert}
      onClose={onFermer}
      closeAfterTransition
    >
      {/* AnimatePresence est nécessaire pour l'animation de sortie */}
      <AnimatePresence>
        {ouvert && (
          <Paper 
            component={motion.div} 
            variants={variantsDropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            sx={styleModale} 
            elevation={10}
          >
            {/* Entête fixe */}
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">{evenement.type}</Typography>
                <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>{evenement.titre}</Typography>
              </Box>
              <IconButton onClick={onFermer} aria-label="Fermer la modale">
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider />

            {/* Contenu défilable */}
            <Box sx={{ p: 3, overflowY: 'auto' }}>
              {/* Introduction (si elle existe) */}
              {evenement.description && (
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                  {evenement.description}
                </Typography>
              )}
              
              {/* Détails spécifiques (normalisés) */}
              <AffichageSpecificites 
                type={evenement.type} 
                specificites={evenement.specificites} 
              />
            </Box>
          </Paper>
        )}
      </AnimatePresence>
    </Modal>
  );
}

export default ModaleEvenement;