// frontend/src/components/chronologie/ModaleEvenement.jsx

import { 
  Box, Modal, Paper, Typography, IconButton, Divider, 
  Chip, Link, List, ListItem, ListItemIcon, ListItemText, Button, Avatar
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CodeIcon from '@mui/icons-material/Code'; 
import ArticleIcon from '@mui/icons-material/Article';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { motion, AnimatePresence } from 'framer-motion';

const styleContenuModale = {
  width: { xs: '95%', md: '80%', lg: '60%' },
  maxHeight: '90vh', 
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden', 
};

const variantsDropIn = {
  hidden: { y: "-5vh", opacity: 0 },
  visible: { y: "0", opacity: 1, transition: { duration: 0.2, type: "spring", stiffness: 300, damping: 25 } },
  exit: { y: "5vh", opacity: 0, transition: { duration: 0.2 } },
};

const AffichageMissions = ({ items, titre }) => {
  if (!items || items.length === 0) return null;
  
  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom>{titre}</Typography>
      {items.map((item, idx) => (
        <Box key={idx} sx={{ mb: 2 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>{item.sous_titre}</Typography>
          <List dense disablePadding>
            {item.descriptions && item.descriptions.map((desc, descIdx) => (
              <ListItem key={descIdx} sx={{ pl: 2, py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: '30px' }}>
                  <FiberManualRecordIcon sx={{ fontSize: '0.6rem' }} />
                </ListItemIcon>
                <ListItemText primary={<Typography variant="body2" color="text.secondary">{desc}</Typography>} />
              </ListItem>
            ))}
          </List>
        </Box>
      ))}
    </Box>
  );
};

const AffichageSpecificites = ({ type, specificites }) => {

  if (type.startsWith('Projets')) {
    const { 
      institution, role, technologies, media_video, 
      media_photos, url_code_source, travail_effectue
    } = specificites;
    
    return (
      <Box>
        {institution && <Typography variant="overline">Cadre: {institution}</Typography>}
        {role && <Typography variant="overline">Rôle: {role}</Typography>}
        
        {technologies?.length > 0 && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Technologies</Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {technologies.map(tech => (
                <Chip 
                  key={tech.id} 
                  label={tech.nom} 
                  avatar={
                    <Avatar 
                      src={tech.logo} 
                      alt={tech.nom} 
                      sx={{ 
                        objectFit: 'contain', 
                        backgroundColor: 'transparent', 
                        p: 0.5 
                      }} 
                    />
                  }
                  variant="outlined"
                  sx={{ p: 1 }}
                />
              ))}
            </Box>
          </Box>
        )}

        {(media_video || media_photos?.length > 0) && (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6" gutterBottom>Média</Typography>
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

        <AffichageMissions items={travail_effectue} titre="Travail Détaillé" />

        {url_code_source && (
          <Button 
            variant="outlined" 
            href={url_code_source} 
            target="_blank" 
            rel="noopener" 
            startIcon={<CodeIcon />}
            sx={{ mt: 2 }}
          >
            Voir le code source
          </Button>
        )}
      </Box>
    );
  }

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


function ModaleEvenement({ evenement, ouvert, onFermer }) {
  if (!evenement) return null;

  return (
    <Modal
      open={ouvert}
      onClose={onFermer}
      closeAfterTransition
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(3px)',
          backgroundColor: 'rgba(0,0,0,0.5)'
        }
      }}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <AnimatePresence>
        {ouvert && (
          <Paper 
            component={motion.div} 
            variants={variantsDropIn}
            initial="hidden"
            animate="visible"
            exit="exit"
            sx={styleContenuModale} 
            elevation={10}
          >
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

            <Box sx={{ p: 3, overflowY: 'auto' }}>
              {evenement.description && (
                <Typography variant="body1" sx={{ mb: 2, fontStyle: 'italic', whiteSpace: 'pre-wrap' }}>
                  {evenement.description}
                </Typography>
              )}
              
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