// frontend/src/components/chronologie/ModaleEvenement.jsx

import { Box, Modal, Paper, Typography, IconButton, Divider, Chip, Link, List, ListItemText } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
 * Helper interne pour afficher les données du JSON 'specificites'
 * en fonction du type d'événement.
 */
const AffichageSpecificites = ({ type, specificites }) => {
  // Types "Projet" (Pro, Etudiant, Perso)
  if (type.startsWith('Projets')) {
    const { institution, role, technologies, media, url_code_source, travaux_details } = specificites;
    
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

        {media && (media.url_video || media.urls_photos?.length > 0) && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Média</Typography>
            {/* Cas Vidéo */}
            {media.url_video && (
              <Box 
                component="video" 
                src={media.url_video} 
                controls 
                muted 
                playsInline 
                sx={{ width: '100%', borderRadius: 1, backgroundColor: '#000' }} 
              />
            )}
            {/* Cas Photos (Carrousel non implémenté, affiche la première photo) */}
            {media.urls_photos?.length > 0 && !media.url_video && (
               <Box 
                component="img" 
                src={media.urls_photos[0]} 
                alt="Aperçu projet" 
                sx={{ width: '100%', borderRadius: 1 }} 
              />
            )}
          </Box>
        )}

        {/* Sections "Travail Détaillé" (sous-titres) */}
        {travaux_details?.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Travail Détaillé</Typography>
            {travaux_details.map((travail, idx) => (
              <Box key={idx} sx={{ mb: 1.5 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>{travail.sous_titre}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                  {travail.description}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        {url_code_source && (
          <Link href={url_code_source} target="_blank" rel="noopener" sx={{ mt: 2 }}>
            Voir le code source
          </Link>
        )}
      </Box>
    );
  }

  // Autres types d'événements
  switch (type) {
    case 'Etudes':
      return (
        <List dense>
          <ListItemText primary="Institution" secondary={specificites.institution} />
          <ListItemText primary="Description" secondary={specificites.description_formation} />
          <ListItemText primary="Compétences" secondary={specificites.competences_acquises?.join(', ')} />
        </List>
      );
    case 'Diplome':
      return (
         <List dense>
          <ListItemText primary="Institution" secondary={specificites.institution} />
          {specificites.url_parchemin && (
             <Link href={specificites.url_parchemin} target="_blank" rel="noopener">Voir le parchemin</Link>
          )}
        </List>
      );
    case 'Service civique':
       return (
        <List dense>
          <ListItemText primary="Organisme" secondary={specificites.organisme_accueil} />
          <ListItemText primary="Missions" secondary={specificites.missions_principales?.join('; ')} />
        </List>
      );
    case 'Activité rémunératrice':
      return (
        <List dense>
          <ListItemText primary="Poste" secondary={specificites.poste} />
          <ListItemText primary="Missions" secondary={specificites.missions_principales?.join('; ')} />
        </List>
      );
    default:
      // Cas où 'specificites' est vide ou le type n'est pas géré
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
              
              {/* Détails spécifiques (JSON) */}
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