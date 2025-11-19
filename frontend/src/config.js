// frontend/src/config.js

/**
 * Définition centralisée des types d'événements et de leur style visuel.
 * Permet de modifier une couleur ou un libellé à un seul endroit pour toute l'application.
 */

export const TYPES_EVENEMENTS = [
  'Formation',
  'Activité rémunératrice',
  'Service civique',
  'Projets Professionnels',
  'Projets Etudiant',
  'Projets Personnels'
];

// Palette de couleurs associée à chaque type (Format RGBA pour les graphiques)
export const COULEURS_TYPES_RGBA = {
  'Formation': 'rgba(2, 136, 209, 0.7)',         // Bleu
  'Activité rémunératrice': 'rgba(237, 108, 2, 0.7)', // Orange
  'Service civique': 'rgba(156, 39, 176, 0.7)',      // Violet
  'Projets Professionnels': 'rgba(46, 125, 50, 0.7)', // Vert Foncé
  'Projets Etudiant': 'rgba(102, 187, 106, 0.7)',     // Vert Clair (Nuance différenciée)
  'Projets Personnels': 'rgba(76, 175, 80, 0.7)',     // Vert Moyen
};

// Mappage pour les composants MUI (Chip, Alert, etc. qui attendent des noms de palette)
export const COULEURS_TYPES_MUI = {
  'Formation': 'info',
  'Activité rémunératrice': 'warning',
  'Service civique': 'secondary',
  'Projets Professionnels': 'success',
  'Projets Etudiant': 'success',
  'Projets Personnels': 'success',
};

// Mappage pour les bordures ou indicateurs solides (HEX)
export const COULEURS_TYPES_HEX = {
  'Formation': '#0288d1',
  'Activité rémunératrice': '#ed6c02',
  'Service civique': '#9c27b0',
  'Projets Professionnels': '#2e7d32',
  'Projets Etudiant': '#66bb6a',
  'Projets Personnels': '#4caf50',
};