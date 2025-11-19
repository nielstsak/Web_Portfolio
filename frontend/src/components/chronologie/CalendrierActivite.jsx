// frontend/src/components/chronologie/CalendrierActivite.jsx

import { Box, Typography, Tooltip } from '@mui/material';
import { COULEURS_TYPES_RGBA } from '../../config';

const MOIS = ['Janv', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

/**
 * Calcule la plage d'années à afficher en fonction des événements fournis.
 */
const obtenirPlageAnnees = (evenements) => {
  if (!evenements || evenements.length === 0) {
    const anneeActuelle = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => anneeActuelle - i); // 3 dernières années par défaut
  }
  
  let anneeMin = Infinity;
  let anneeMax = -Infinity;
  const anneeCourante = new Date().getFullYear();
  
  evenements.forEach(evt => {
    const anneeDebut = new Date(evt.date_debut).getFullYear();
    anneeMin = Math.min(anneeMin, anneeDebut);
    anneeMax = Math.max(anneeMax, anneeDebut);
    
    if (evt.date_fin) {
      const anneeFin = new Date(evt.date_fin).getFullYear();
      anneeMax = Math.max(anneeMax, anneeFin);
    } else {
      anneeMax = Math.max(anneeMax, anneeCourante);
    }
  });

  // Sécurité pour éviter les boucles infinies si dates invalides
  if (!isFinite(anneeMin) || !isFinite(anneeMax)) {
     return [anneeCourante];
  }

  // Crée un tableau [anneeMax, anneeMax-1, ..., anneeMin]
  return Array.from({ length: anneeMax - anneeMin + 1 }, (_, i) => anneeMax - i);
};

const estActifCeMois = (evt, annee, mois) => {
  const debutEvt = new Date(evt.date_debut);
  const finEvt = evt.date_fin ? new Date(evt.date_fin) : new Date();

  // Date de début du mois [annee, mois, 1]
  const debutMois = new Date(annee, mois, 1);
  // Date de fin du mois [annee, mois+1, 0]
  const finMois = new Date(annee, mois + 1, 0); 

  // Correction logique de chevauchement
  return (debutEvt <= finMois) && (finEvt >= debutMois);
};

/**
 * Calcule le style et le titre du tooltip pour une cellule de mois.
 */
const obtenirStyleCellule = (evenements, annee, indexMois) => {
  // Trouve TOUS les événements actifs ce mois-ci
  const evtsActifs = evenements.filter(evt => estActifCeMois(evt, annee, indexMois));
  
  if (evtsActifs.length === 0) {
    return {
      style: { backgroundColor: '#f5f5f5', opacity: 0.5 },
      titre: 'Aucune activité'
    };
  }

  // Combine les titres pour le tooltip
  const titre = evtsActifs.map(e => e.titre).join(' | ');

  // Cas 1: Un seul événement
  if (evtsActifs.length === 1) {
    const couleur = COULEURS_TYPES_RGBA[evtsActifs[0].type] || 'rgba(224, 224, 224, 0.7)';
    return {
      style: { backgroundColor: couleur },
      titre: titre
    };
  }

  // Cas 2: Plusieurs événements (Dégradé)
  const couleur1 = COULEURS_TYPES_RGBA[evtsActifs[0].type] || 'rgba(224, 224, 224, 0.7)';
  const couleur2 = COULEURS_TYPES_RGBA[evtsActifs[1].type] || 'rgba(224, 224, 224, 0.7)';
  
  return {
    style: {
      background: `linear-gradient(45deg, ${couleur1} 50%, ${couleur2} 50%)`,
    },
    titre: titre
  };
};

/**
 * Affiche un calendrier d'activité heatmap basé sur les événements filtrés.
 * @param {{ evenements: Array<object> }} props
 */
function CalendrierActivite({ evenements }) {
  const annees = obtenirPlageAnnees(evenements);

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(12, 1fr)', gap: '4px', minWidth: '600px' }}>
      
      {/* Entête des mois */}
      <Box /> {/* Cellule vide coin supérieur gauche */}
      {MOIS.map(mois => (
        <Typography key={mois} variant="caption" sx={{ textAlign: 'center', fontWeight: 500, color: 'text.secondary' }}>
          {mois}
        </Typography>
      ))}

      {/* Grille Années / Mois */}
      {annees.map(annee => (
        <Box key={`row-${annee}`} sx={{ display: 'contents' }}> {/* fragment virtuel pour la grille */}
          {/* Étiquette de l'année */}
          <Typography 
            key={`label-${annee}`} 
            variant="body2" 
            sx={{ fontWeight: 600, pr: 1, textAlign: 'right', alignSelf: 'center', color: 'text.primary' }}
          >
            {annee}
          </Typography>
          
          {/* Cellules des mois */}
          {MOIS.map((_, indexMois) => {
            const { style, titre } = obtenirStyleCellule(evenements, annee, indexMois);

            return (
              <Tooltip 
                key={`${annee}-${indexMois}`} 
                title={titre} 
                arrow
              >
                <Box
                  sx={{
                    width: '100%',
                    paddingBottom: '100%', // Ratio carré
                    borderRadius: '3px',
                    ...style, 
                    transition: 'transform 0.1s ease',
                    '&:hover': { transform: 'scale(1.15)', zIndex: 1 }
                  }}
                />
              </Tooltip>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}

export default CalendrierActivite;