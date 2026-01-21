// [Symbole Commentaire] FICHIER : frontend/src/components/ProjectList.jsx

import { useRef, useCallback } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, CardMedia, Avatar } from '@mui/material';
import { Masonry } from '@mui/lab';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LABELS, COULEURS_TYPES_MUI } from '../config';

const variantsConteneur = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const variantsElement = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

/**
 * Carte interactive affichant un projet.
 * Gère la prévisualisation vidéo au survol.
 */
function CarteProjet({ projet, onSelectionner }) {
  const refVideo = useRef(null);

  const gererSurvolEntree = useCallback(() => {
    if (refVideo.current) {
      refVideo.current.play().catch(() => {}); // Ignorer les erreurs d'autoplay (ex: interaction requise)
    }
  }, []);

  const gererSurvolSortie = useCallback(() => {
    if (refVideo.current) {
      refVideo.current.pause();
      refVideo.current.currentTime = 0; // Reset pour le prochain survol
    }
  }, []);

  // Détermine la couleur du Chip selon la catégorie
  const couleurChip = COULEURS_TYPES_MUI[projet.type] || 'default';

  return (
    <motion.div
      variants={variantsElement}
      whileHover={{ y: -8 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        onClick={() => onSelectionner(projet.apiId)} // Utilise l'ID numérique pour l'URL
        onMouseEnter={gererSurvolEntree}
        onMouseLeave={gererSurvolSortie}
        sx={{
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          '&:hover': {
            borderColor: 'primary.main',
            boxShadow: '0 12px 40px rgba(0,0,0,0.12)',
          }
        }}
      >
        <Box sx={{ position: 'relative', height: 220, backgroundColor: '#000' }}>
          {projet.video ? (
            <CardMedia
              ref={refVideo}
              component="video"
              src={projet.video}
              muted
              playsInline
              loop
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            // Fallback si pas de vidéo : Image ou Placeholder
            <Box sx={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
            }}>
              <Typography variant="h4" sx={{ color: 'white', fontWeight: 700, opacity: 0.8 }}>
                {projet.titre.charAt(0)}
              </Typography>
            </Box>
          )}
          
          {/* Badge Catégorie */}
          <Chip
            label={projet.type}
            color={couleurChip}
            size="small"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              fontWeight: 600,
              backdropFilter: 'blur(4px)',
              backgroundColor: 'rgba(255,255,255,0.9)'
            }}
          />
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Typography variant="h6" component="h3" sx={{ fontWeight: 700, mb: 1, lineHeight: 1.3 }}>
            {projet.titre}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ 
            mb: 2, 
            minHeight: '4.5em', // Hauteur fixe pour alignement (3 lignes)
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {projet.description}
          </Typography>

          {/* Stack Technique (Max 3) */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {projet.technologies.slice(0, 3).map((tech) => (
              <Chip
                key={tech.id}
                label={tech.nom}
                size="small"
                variant="outlined"
                avatar={
                  tech.logo ? <Avatar src={tech.logo} sx={{ bgcolor: 'transparent' }} /> : null
                }
                sx={{ borderRadius: '6px', border: '1px solid rgba(0,0,0,0.1)' }}
              />
            ))}
            {projet.technologies.length > 3 && (
              <Typography variant="caption" sx={{ alignSelf: 'center', color: 'text.secondary' }}>
                +{projet.technologies.length - 3}
              </Typography>
            )}
          </Box>
        </CardContent>

        {/* Bouton d'action flottant au survol */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            pointerEvents: 'none' // Laisse le clic passer à la Card
          }}
        >
          <IconButton 
            sx={{ 
              backgroundColor: 'primary.main', 
              color: 'white',
              boxShadow: 3,
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            <ArrowForwardIcon fontSize="small" />
          </IconButton>
        </motion.div>
      </Card>
    </motion.div>
  );
}

/**
 * Galerie des projets (Étudiant, Perso, Freelance).
 * Affiche une grille Masonry responsive.
 */
function ProjectList({ projets, onSelectionnerProjet }) {
  if (!projets || projets.length === 0) {
    return null;
  }

  return (
    <Box sx={{ width: '100%', py: 8, px: { xs: 2, md: 4 } }}>
      <Typography 
        variant="h3" 
        component="h2" 
        sx={{ mb: 6, textAlign: 'center', fontWeight: 800, letterSpacing: '-0.5px' }}
      >
        Réalisations
      </Typography>

      <motion.div
        variants={variantsConteneur}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <Masonry columns={{ xs: 1, sm: 2, lg: 3 }} spacing={4}>
          {projets.map((projet) => (
            <CarteProjet 
              key={projet.id} 
              projet={projet} 
              onSelectionner={onSelectionnerProjet} 
            />
          ))}
        </Masonry>
      </motion.div>
    </Box>
  );
}

export default ProjectList;