// frontend/src/components/chronologie/CarteEvenement.jsx

import { useState } from 'react';
import { Paper, Typography, Box, CardMedia, IconButton } from '@mui/material'; 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { motion } from 'framer-motion';
import ModaleEvenement from './ModaleEvenement'; 

const COULEURS_TYPES = {
  'Formation': '#0288d1',
  'Activité rémunératrice': '#ed6c02',
  'Service civique': '#9c27b0',
  'Projets Professionnels': '#2e7d32',
  'Projets Etudiant': '#2e7d32',
  'Projets Personnels': '#2e7d32',
};

const formaterPeriode = (debut, fin) => {
  const optionsDate = { year: 'numeric', month: 'short' };
  const dateDebut = new Date(debut).toLocaleDateString('fr-FR', optionsDate);
  
  if (!fin) {
    return dateDebut;
  }
  
  const dateFin = new Date(fin).toLocaleDateString('fr-FR', optionsDate);
  return `${dateDebut} ⟶ ${dateFin}`;
};

function CarteEvenement({ evenement }) {
  const [modaleOuverte, setModaleOuverte] = useState(false);

  const couleur = COULEURS_TYPES[evenement.type] || '#bdbdbd'; 

  const isProjet = evenement.type.startsWith('Projets');
  const specificites = evenement.specificites || {};
  const photos = specificites.media_photos;
  const video = specificites.media_video;

  let mediaSource = null;
  let mediaType = null;

  if (isProjet) {
    if (photos && photos.length > 0) {
      mediaSource = photos[0].image;
      mediaType = 'img';
    } 
    else if (video) {
      mediaSource = video;
      mediaType = 'video';
    }
  }

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.02 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ height: '100%' }}
      >
        <Paper
          elevation={2}
          onClick={() => setModaleOuverte(true)}
          sx={{
            height: '100%',
            minHeight: 280,
            cursor: 'pointer',
            borderRadius: 2,
            borderLeft: `5px solid ${couleur}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          <Box sx={{ p: 2.5, pb: 1, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: couleur, fontWeight: 600 }}>
                {evenement.type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formaterPeriode(evenement.date_debut, evenement.date_fin)}
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, lineHeight: 1.3 }}>
              {evenement.titre}
            </Typography>
          </Box>

          <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {mediaSource ? (
              <CardMedia
                component={mediaType}
                height="180"
                image={mediaType === 'img' ? mediaSource : undefined}
                src={mediaType === 'video' ? mediaSource : undefined}
                alt={mediaType === 'img' ? `Aperçu ${evenement.titre}` : undefined}
                sx={{ objectFit: 'cover', width: '100%' }}
                controls={false}
                muted
                playsInline
                preload="metadata" 
              />
            ) : (
              <Box sx={{ height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'rgba(0,0,0,0.03)' }}>
                 {/* Espace vide stylisé si pas de média */}
              </Box>
            )}
          </Box>

          <Box sx={{ p: 1, pr: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <IconButton size="small" sx={{ color: couleur }} aria-label="Voir les détails">
              <MoreHorizIcon />
            </IconButton>
          </Box>
        </Paper>
      </motion.div>

      <ModaleEvenement
        evenement={evenement}
        ouvert={modaleOuverte}
        onFermer={() => setModaleOuverte(false)}
      />
    </>
  );
}

export default CarteEvenement;