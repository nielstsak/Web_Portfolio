// frontend/src/components/ProjectList.jsx

import { useRef } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, CardMedia } from '@mui/material';
import { Masonry } from '@mui/lab'; // Composant Masonry pour une grille décalée
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Variantes d'animation pour le conteneur de la grille (animation en cascade)
const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }, // Délai entre l'apparition de chaque enfant
  },
};

// Variantes d'animation pour chaque carte de projet.
const variantsElement = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/**
 * Affiche une carte de projet individuelle avec un aperçu vidéo au survol.
 * @param {{ projet: object, onSelectionnerProjet: function }} props
 */
function CarteProjet({ projet, onSelectionnerProjet }) {
  const refVideo = useRef(null); // Référence à l'élément <video>

  // Lance la lecture de la vidéo au survol de la carte.
  const gererSurvolEntree = () => {
    if (refVideo.current) {
      refVideo.current.play().catch(() => {}); // catch() pour ignorer les erreurs si la lecture est interrompue.
    }
  };

  // Met la vidéo en pause lorsque le curseur quitte la carte.
  const gererSurvolSortie = () => {
    if (refVideo.current) {
      refVideo.current.pause();
    }
  };

  return (
    <motion.div
      variants={variantsElement}
      whileHover={{ scale: 1.03 }} // Léger zoom au survol
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelectionnerProjet(projet.id)}
      onMouseEnter={gererSurvolEntree}
      onMouseLeave={gererSurvolSortie}
    >
      <Card sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid transparent',
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        '&:hover': {
          borderColor: 'primary.main',
          boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
        },
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Média : Vidéo du projet */}
        {projet.video && (
          <CardMedia
            ref={refVideo}
            component="video"
            src={projet.video}
            loop
            muted
            playsInline // Nécessaire pour l'autoplay sur mobile
            sx={{ height: 200, objectFit: 'cover' }}
          />
        )}
        {/* Contenu : Titre, description, technologies */}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {projet.titre}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' }}>
            {projet.description.substring(0, 100)}...
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {projet.technologies.slice(0, 3).map(tech => ( // Affiche max 3 technos
              <Chip key={tech.id} label={tech.nom} size="small" />
            ))}
          </Box>
        </CardContent>
        
        {/* Icône fléchée qui apparaît au survol */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }} // Apparaît seulement au survol de la carte (via propagation)
          transition={{ duration: 0.3 }}
          style={{ position: 'absolute', bottom: 16, right: 16 }}
        >
          <IconButton sx={{ backgroundColor: 'primary.main', color: 'white', '&:hover': { backgroundColor: 'primary.dark' } }}>
            <ArrowForwardIcon />
          </IconButton>
        </motion.div>
      </Card>
    </motion.div>
  );
}

/**
 * Affiche une liste de projets sous forme de grille Masonry.
 * @param {{ projets: Array<object>, onSelectionnerProjet: function }} props
 */
function ListeProjets({ projets, onSelectionnerProjet }) {
  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Mes Projets
      </Typography>
      <motion.div variants={variantsConteneur} initial="hidden" animate="visible">
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
          {projets.map((projet) => (
            <CarteProjet key={projet.id} projet={projet} onSelectionnerProjet={onSelectionnerProjet} />
          ))}
        </Masonry>
      </motion.div>
    </Box>
  );
}

export default ListeProjets;