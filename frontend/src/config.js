// frontend/src/config.js

// Libellés constants pour éviter les fautes de frappe et centraliser les clés
export const LABELS = {
  FORMATION: 'Formation',
  ACTIVITE: 'Activité rémunératrice',
  SERVICE: 'Service civique',
  PRO_PRO: 'Projets Professionnels',
  PRO_ETU: 'Projets Etudiant',
  PRO_PERSO: 'Projets Personnels'
};

// Mapping Catégorie Backend -> Label Frontend
export const CATEGORY_LABELS = {
  'PRO': LABELS.PRO_PRO,
  'ETU': LABELS.PRO_ETU,
  'PERSO': LABELS.PRO_PERSO
};

export const TYPES_EVENEMENTS = [
  LABELS.FORMATION,
  LABELS.ACTIVITE,
  LABELS.SERVICE,
  LABELS.PRO_PRO,
  LABELS.PRO_ETU,
  LABELS.PRO_PERSO
];

// Couleurs (Format RGBA pour les graphiques/fonds)
export const COULEURS_TYPES_RGBA = {
  [LABELS.FORMATION]: 'rgba(2, 136, 209, 0.7)',
  [LABELS.ACTIVITE]: 'rgba(237, 108, 2, 0.7)',
  [LABELS.SERVICE]: 'rgba(156, 39, 176, 0.7)',
  [LABELS.PRO_PRO]: 'rgba(46, 125, 50, 0.7)',
  [LABELS.PRO_ETU]: 'rgba(102, 187, 106, 0.7)',
  [LABELS.PRO_PERSO]: 'rgba(76, 175, 80, 0.7)',
};

// Mappage pour les composants MUI (Chip, Alert, etc.)
export const COULEURS_TYPES_MUI = {
  [LABELS.FORMATION]: 'info',
  [LABELS.ACTIVITE]: 'warning',
  [LABELS.SERVICE]: 'secondary',
  [LABELS.PRO_PRO]: 'success',
  [LABELS.PRO_ETU]: 'success',
  [LABELS.PRO_PERSO]: 'success',
};

// Couleurs (Format HEX pour les bordures/textes)
export const COULEURS_TYPES_HEX = {
  [LABELS.FORMATION]: '#0288d1',
  [LABELS.ACTIVITE]: '#ed6c02',
  [LABELS.SERVICE]: '#9c27b0',
  [LABELS.PRO_PRO]: '#2e7d32',
  [LABELS.PRO_ETU]: '#66bb6a',
  [LABELS.PRO_PERSO]: '#4caf50',
};