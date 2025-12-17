import { useState } from 'react';
import { Paper, Typography, Box, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
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

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.03 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        style={{ height: '100%' }}
      >
        <Paper
          elevation={2}
          onClick={() => setModaleOuverte(true)}
          sx={{
            height: '100%',
            minHeight: 140,
            cursor: 'pointer',
            borderRadius: 3,
            borderLeft: `5px solid ${couleur}`,
            background: `linear-gradient(${alpha(couleur, 0.08)}, ${alpha(couleur, 0.08)}), #fff`,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'box-shadow 0.3s ease, transform 0.2s ease',
            '&:hover': {
              boxShadow: 4,
            },
          }}
        >
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
              <Typography variant="caption" sx={{ color: couleur, fontWeight: 700, textTransform: 'uppercase', fontSize: '0.7rem', letterSpacing: 0.5 }}>
                {evenement.type}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.75rem', fontWeight: 500 }}>
                {formaterPeriode(evenement.date_debut, evenement.date_fin)}
              </Typography>
            </Box>
            
            <Typography variant="subtitle1" component="h3" sx={{ fontWeight: 700, lineHeight: 1.3, fontSize: '1rem' }}>
              {evenement.titre}
            </Typography>
          </Box>

          <Box sx={{ p: 1.5, display: 'flex', justifyContent: 'flex-end', pt: 0 }}>
            <IconButton size="small" sx={{ color: couleur, backgroundColor: alpha(couleur, 0.1), '&:hover': { backgroundColor: alpha(couleur, 0.2) } }} aria-label="Voir les détails">
              <MoreHorizIcon fontSize="small" />
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