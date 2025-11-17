// frontend/src/components/chronologie/CalendrierActivite.jsx

import { Box, Typography, Tooltip } from '@mui/material';

// Mappage des couleurs (RGBA pour la transparence)
const COULEURS_TYPES = {
  'Formation': 'rgba(2, 136, 209, 0.7)',
  'Activité rémunératrice': 'rgba(237, 108, 2, 0.7)',
  'Service civique': 'rgba(156, 39, 176, 0.7)',
  'Projets Etudiant': 'rgba(46, 125, 50, 0.7)',
  'Projets Professionnels': 'rgba(46, 125, 50, 0.7)',
  'Projets Personnels': 'rgba(46, 125, 50, 0.7)',
};

const MOIS = ['Janv', 'Fév', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'];

/**
 * Calcule la plage d'années à afficher en fonction des événements fournis.
 */
const obtenirPlageAnnees = (evenements) => {
  if (evenements.length === 0) {
    const anneeActuelle = new Date().getFullYear();
    return Array.from({ length: 3 }, (_, i) => anneeActuelle - i); // 3 dernières années par défaut
  }
  
  let anneeMin = Infinity;
  let anneeMax = -Infinity;
  
  evenements.forEach(evt => {
    const anneeDebut = new Date(evt.date_debut).getFullYear();
    anneeMin = Math.min(anneeMin, anneeDebut);
    anneeMax = Math.max(anneeMax, anneeDebut);
    
    if (evt.date_fin) {
      const anneeFin = new Date(evt.date_fin).getFullYear();
      anneeMax = Math.max(anneeMax, anneeFin);
    } else {
      anneeMax = Math.max(anneeMax, new Date().getFullYear());
    }
  });

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

  if (finEvt < debutMois) return false;
  if (debutEvt > finMois) return false;
  
  // Sinon, il y a chevauchement
  return true;
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
    const couleur = COULEURS_TYPES[evtsActifs[0].type] || 'rgba(224, 224, 224, 0.7)';
    return {
      style: { backgroundColor: couleur },
      titre: titre
    };
  }

  const couleur1 = COULEURS_TYPES[evtsActifs[0].type] || 'rgba(224, 224, 224, 0.7)';
  const couleur2 = COULEURS_TYPES[evtsActifs[1].type] || 'rgba(224, 224, 224, 0.7)';
  
  return {
    style: {
      background: `linear-gradient(45deg, ${couleur1} 50%, ${couleur2} 50%)`,
    },
    titre: titre
  };
};

/**
 * Affiche un calendrier d'activité basé sur les événements filtrés.
 * @param {{ evenements: Array<object> }} props
 */
function CalendrierActivite({ evenements }) {
  const annees = obtenirPlageAnnees(evenements); // Déjà trié du plus récent au plus ancien

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'auto repeat(12, 1fr)', gap: '4px', minWidth: '600px' }}>
      
      {/* Entête des mois */}
      <Box /> {/* Cellule vide pour le coin */}
      {MOIS.map(mois => (
        <Typography key={mois} variant="caption" sx={{ textAlign: 'center' }}>
          {mois}
        </Typography>
      ))}

      {/* Grille Années / Mois */}
      {annees.map(annee => (
        <>
          {/* Étiquette de l'année */}
          <Typography 
            key={`annee-${annee}`} 
            variant="body2" 
            sx={{ fontWeight: 600, pr: 1, textAlign: 'right', gridColumn: '1 / 2', alignSelf: 'center' }}
          >
            {annee}
          </Typography>
          
          {/* Cellules des mois */}
          {MOIS.map((mois, indexMois) => {
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
                    paddingBottom: '100%', 
                    borderRadius: '2px',
                    ...style, 
                    gridColumn: `${indexMois + 2} / span 1`,
                  }}
                />
              </Tooltip>
            );
          })}
        </>
      ))}
    </Box>
  );
}

export default CalendrierActivite;