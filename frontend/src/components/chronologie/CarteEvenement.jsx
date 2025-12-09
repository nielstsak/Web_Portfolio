// frontend/src/components/chronologie/CarteEvenement.jsx

import { useState } from 'react';
import { Paper, Typography, Box, CardMedia, IconButton } from '@mui/material'; 
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'; // AJOUTÉ: Icône pour indiquer le détail 
import { motion } from 'framer-motion';
import ModaleEvenement from './ModaleEvenement'; 

// Mappage des couleurs (HEX pour la bordure)
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

  // --- LOGIQUE DE SÉLECTION DU MÉDIA (inchangée) ---
  const isProjet = evenement.type.startsWith('Projets');
  const specificites = evenement.specificites || {};
  const photos = specificites.media_photos;
  const video = specificites.media_video;

  let mediaSource = null;
  let mediaType = null;

  if (isProjet) {
    // Priorité 1 : Première photo disponible
    if (photos && photos.length > 0) {
      mediaSource = photos[0].image;
      mediaType = 'img';
    } 
    // Priorité 2 : Vidéo (affichée comme image statique)
    else if (video) {
      mediaSource = video;
      mediaType = 'video';
    }
  }

  // AJOUTÉ: Hauteur fixe pour forcer l'uniformité 
  const HAUTEUR_CARTE = 220; 

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ height: '100%' }}
      >
        <Paper
          elevation={2}
          onClick={() => setModaleOuverte(true)}
          sx={{
            height: HAUTEUR_CARTE, // HAUTEUR FIXE 
            cursor: 'pointer',
            borderRadius: 2,
            borderLeft: `5px solid ${couleur}`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: 0,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          {/* --- AFFICHAGE DU MÉDIA --- */}
          {mediaSource && (
            <CardMedia
              component={mediaType}
              height="120"
              // 'image' est utilisé par le composant img, 'src' par video
              image={mediaType === 'img' ? mediaSource : undefined}
              src={mediaType === 'video' ? mediaSource : undefined}
              alt={mediaType === 'img' ? `Aperçu ${evenement.titre}` : undefined}
              sx={{ objectFit: 'cover' }}
              // Paramètres pour que la vidéo soit traiter comme  une image (1ère frame)
              controls={false}
              muted
              playsInline
              preload="metadata" 
            />
          )}
          
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: couleur, fontWeight: 600 }}>
                {evenement.type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formaterPeriode(evenement.date_debut, evenement.date_fin)}
              </Typography>
            </Box>
            
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {evenement.titre}
            </Typography>
            
            {/* MODIFIÉ: Remplacement de la description par un indicateur visuel  */}
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end' }}>
              <IconButton size="small" sx={{ color: couleur }} aria-label="Voir les détails">
                <MoreHorizIcon />
              </IconButton>
            </Box>
            {/* FIN MODIFICATION */}

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