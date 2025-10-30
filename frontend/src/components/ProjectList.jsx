// frontend/src/components/ProjectList.jsx

import { useRef } from 'react';
import { Box, Card, CardContent, Typography, Chip, IconButton, CardMedia } from '@mui/material';
import { Masonry } from '@mui/lab';
import { motion } from 'framer-motion';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Variantes d'animation pour le conteneur de la grille.
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

// Variantes d'animation pour chaque carte de projet.
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

/**
 * Affiche une carte de projet individuelle avec un aperçu vidéo au survol.
 * @param {{ project: object, onSelectProject: function }} props
 */
function ProjectCard({ project, onSelectProject }) {
  const videoRef = useRef(null);

  // Lance la lecture de la vidéo au survol de la carte.
  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {}); // catch() pour éviter les erreurs si la lecture est interrompue.
    }
  };

  // Met la vidéo en pause lorsque le curseur quitte la carte.
  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.03 }}
      transition={{ type: 'spring', stiffness: 300 }}
      style={{ cursor: 'pointer' }}
      onClick={() => onSelectProject(project.id)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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
        {project.video && (
          <CardMedia
            ref={videoRef}
            component="video"
            src={project.video}
            loop
            muted
            playsInline
            sx={{ height: 200, objectFit: 'cover' }}
          />
        )}
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {project.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '60px' }}>
            {project.description.substring(0, 100)}...
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {project.technologies.slice(0, 3).map(tech => (
              <Chip key={tech.id} label={tech.nom} size="small" />
            ))}
          </Box>
        </CardContent>
        {/* Icône fléchée qui apparaît au survol */}
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
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
 * @param {{ projects: Array<object>, onSelectProject: function }} props
 */
function ProjectList({ projects, onSelectProject }) {
  return (
    <Box sx={{ p: 4, height: '100%', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h3" component="h2" sx={{ mb: 4, textAlign: 'center' }}>
        Mes Projets
      </Typography>
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        <Masonry columns={{ xs: 1, sm: 2, md: 3 }} spacing={2} >
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onSelectProject={onSelectProject} />
          ))}
        </Masonry>
      </motion.div>
    </Box>
  );
}

export default ProjectList;