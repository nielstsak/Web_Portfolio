// frontend/src/components/chronologie/CarteEvenement.jsx

import { useState } from 'react';
import { Paper, Typography, Box, CardMedia } from '@mui/material';
import { motion } from 'framer-motion';
import ModaleEvenement from './ModaleEvenement'; 

// Mappage des couleurs (HEX pour la bordure)
const COULEURS_TYPES = {
  'Formation': '#0288d1', // info
  'Activité rémunératrice': '#ed6c02', // warning
  'Service civique': '#9c27b0', // secondary
  'Projets Professionnels': '#2e7d32', // success
  'Projets Etudiant': '#2e7d32', // success
  'Projets Personnels': '#2e7d32', // success
};

// Formate les dates (ex: "Janv 2024" ou "Janv 2024 ⟶ Fév 2025")
const formaterPeriode = (debut, fin) => {
  const optionsDate = { year: 'numeric', month: 'short' };
  const dateDebut = new Date(debut).toLocaleDateString('fr-FR', optionsDate);
  
  if (!fin) {
    return dateDebut;
  }
  
  const dateFin = new Date(fin).toLocaleDateString('fr-FR', optionsDate);
  return `${dateDebut} ⟶ ${dateFin}`;
};

/**
 * Affiche une carte individuelle pour un événement chronologique.
 * Gère l'ouverture de sa propre modale de détails.
 * @param {{ evenement: object }} props
 */
function CarteEvenement({ evenement }) {
  const [modaleOuverte, setModaleOuverte] = useState(false);

  const couleur = COULEURS_TYPES[evenement.type] || '#bdbdbd'; // Gris par défaut

  // Vérifie si c'est un projet et s'il a une image
  const isProjet = evenement.type.startsWith('Projets');
  const media = evenement.specificites?.media_photos;
  const imageUrl = (isProjet && media && media.length > 0) ? media[0].image : null;

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 300 }}
        style={{ height: '100%' }}
      >
        <Paper
          elevation={2}
          onClick={() => setModaleOuverte(true)}
          sx={{
            height: '100%',
            cursor: 'pointer',
            borderRadius: 2,
            borderLeft: `5px solid ${couleur}`, // Indicateur visuel du type
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            p: 0, // Padding retiré pour que l'image touche les bords
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
              boxShadow: 6,
            },
          }}
        >
          {/* Affiche l'image si elle existe */}
          {imageUrl && (
            <CardMedia
              component="img"
              height="160"
              image={imageUrl}
              alt={`Aperçu ${evenement.titre}`}
              sx={{ objectFit: 'cover' }}
            />
          )}
          
          {/* Contenu textuel dans un Box avec padding */}
          <Box sx={{ p: 2.5, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            {/* Entête de la carte */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
              <Typography variant="caption" sx={{ color: couleur, fontWeight: 600 }}>
                {evenement.type}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formaterPeriode(evenement.date_debut, evenement.date_fin)}
              </Typography>
            </Box>
            
            {/* Contenu principal (titre normalisé) */}
            <Typography variant="h6" component="h3" sx={{ fontWeight: 600, mb: 1 }}>
              {evenement.titre}
            </Typography>
            
            {/* Description (normalisée) */}
            {evenement.description && (
              <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                {/* Coupe la description pour l'aperçu */}
                {String(evenement.description).substring(0, 120)}...
              </Typography>
            )}
          </Box>
        </Paper>
      </motion.div>

      {/* La modale est gérée ici */}
      <ModaleEvenement
        evenement={evenement}
        ouvert={modaleOuverte}
        onFermer={() => setModaleOuverte(false)}
      />
    </>
  );
}

export default CarteEvenement;