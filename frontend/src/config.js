// frontend/src/config.js

// Mapping Backend Category -> Frontend Label
export const CATEGORY_LABELS = {
  'PRO': 'Projets Professionnels',
  'ETU': 'Projets Etudiant',
  'PERSO': 'Projets Personnels'
};

export const TYPES_EVENEMENTS = [
  'Formation',
  'Activité rémunératrice',
  'Service civique',
  CATEGORY_LABELS['PRO'],
  CATEGORY_LABELS['ETU'],
  CATEGORY_LABELS['PERSO']
];

export const COULEURS_TYPES_RGBA = {
  'Formation': 'rgba(2, 136, 209, 0.7)',
  'Activité rémunératrice': 'rgba(237, 108, 2, 0.7)',
  'Service civique': 'rgba(156, 39, 176, 0.7)',
  [CATEGORY_LABELS['PRO']]: 'rgba(46, 125, 50, 0.7)',
  [CATEGORY_LABELS['ETU']]: 'rgba(102, 187, 106, 0.7)',
  [CATEGORY_LABELS['PERSO']]: 'rgba(76, 175, 80, 0.7)',
};

export const COULEURS_TYPES_MUI = {
  'Formation': 'info',
  'Activité rémunératrice': 'warning',
  'Service civique': 'secondary',
  [CATEGORY_LABELS['PRO']]: 'success',
  [CATEGORY_LABELS['ETU']]: 'success',
  [CATEGORY_LABELS['PERSO']]: 'success',
};

export const COULEURS_TYPES_HEX = {
  'Formation': '#0288d1',
  'Activité rémunératrice': '#ed6c02',
  'Service civique': '#9c27b0',
  [CATEGORY_LABELS['PRO']]: '#2e7d32',
  [CATEGORY_LABELS['ETU']]: '#66bb6a',
  [CATEGORY_LABELS['PERSO']]: '#4caf50',
};