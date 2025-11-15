// frontend/src/components/chronologie/CalendrierActivite.jsx

import { Box, Typography, Paper, Tooltip } from '@mui/material';

// Mappage des couleurs (HEX pour la cohérence)
const COULEURS_TYPES = {
  'Formation': '#0288d1',
  'Activité rémunératrice': '#ed6c02',
  'Service civique': '#9c27b0',
  'Projets Etudiant': '#2e7d32',
  'Projets Professionnels': '#2e7d32',
  'Projets Personnels': '#2e7d32',
};

// ... (le reste du fichier 'CalendrierActivite.jsx' est inchangé)
// ... (obtenirPlageAnnees, estActifCeMois, et le composant CalendrierActivite)

// ... (coller le reste du fichier original ici)
// Constantes pour la grille
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
      // Si pas de date de fin, l'activité max est l'année en cours
      anneeMax = Math.max(anneeMax, new Date().getFullYear());
    }
  });

  // Crée un tableau [anneeMax, anneeMax-1, ..., anneeMin]
  return Array.from({ length: anneeMax - anneeMin + 1 }, (_, i) => anneeMax - i);
};

/**
 * Vérifie si un événement était actif pendant un mois/année donné.
 */
const estActifCeMois = (evt, annee, mois) => {
  const debutEvt = new Date(evt.date_debut);
  // Si pas de date de fin, on considère l'événement comme actif jusqu'à aujourd'hui
  const finEvt = evt.date_fin ? new Date(evt.date_fin) : new Date();

  // Date de début du mois [annee, mois, 1]
  const debutMois = new Date(annee, mois, 1);
  // Date de fin du mois [annee, mois+1, 0]
  const finMois = new Date(annee, mois + 1, 0); 

  // L'événement se termine-t-il avant le début du mois ?
  if (finEvt < debutMois) return false;
  // L'événement commence-t-il après la fin du mois ?
  if (debutEvt > finMois) return false;
  
  // Sinon, il y a chevauchement
  return true;
};

/**
 * Affiche un calendrier d'activité basé sur les événements filtrés.
 * @param {{ evenements: Array<object> }} props
 */
function CalendrierActivite({ evenements }) {
  const annees = obtenirPlageAnnees(evenements); // Déjà trié du plus récent au plus ancien

  return (
    <Paper 
      elevation={2} 
      sx={{ p: 2, borderRadius: 2, overflowX: 'auto' }}
    >
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
          // Fragment pour regrouper la ligne (label + 12 cellules)
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
              // Trouve le premier événement actif ce mois-ci pour la couleur
              const evtActif = evenements.find(evt => estActifCeMois(evt, annee, indexMois));
              const couleur = evtActif ? COULEURS_TYPES[evtActif.type] || '#e0e0e0' : '#f5f5f5';

              return (
                <Tooltip 
                  key={`${annee}-${indexMois}`} 
                  title={evtActif ? evtActif.titre : 'Aucune activité'} 
                  arrow
                >
                  <Box
                    sx={{
                      width: '100%',
                      paddingBottom: '100%', // Ratio 1:1
                      backgroundColor: couleur,
                      borderRadius: '2px',
                      opacity: evtActif ? 1 : 0.5,
                      gridColumn: `${indexMois + 2} / span 1`,
                    }}
                  />
                </Tooltip>
              );
            })}
          </>
        ))}
      </Box>
    </Paper>
  );
}

export default CalendrierActivite;