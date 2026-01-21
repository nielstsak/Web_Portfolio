// [Symbole Commentaire] FICHIER : frontend/src/config.js

export const LABELS = {
  // Parcours
  FORMATION: 'Formation',
  SERVICE: 'Service Civique',
  FREELANCE: 'Freelance',
  SALARIE: 'Expérience Salariée', // Présent en base, à filtrer selon besoins

  // Projets
  PROJET_ETU: 'Projet Étudiant',
  PROJET_PERSO: 'Projet Personnel',
  PROJET_FREELANCE: 'Projet Freelance',
  PROJET_PRO: 'Projet Professionnel', // Présent en base, à filtrer selon besoins
};

// Mapping : Valeur Backend (Projet.categorie) -> Label Frontend
export const CATEGORY_LABELS = {
  'ETU': LABELS.PROJET_ETU,
  'PERSO': LABELS.PROJET_PERSO,
  'FREELANCE': LABELS.PROJET_FREELANCE,
  'PRO': LABELS.PROJET_PRO
};

// Mapping : Valeur Backend (ActiviteProfessionnelle.type_contrat) -> Label Frontend
export const CONTRACT_LABELS = {
  'FREELANCE': LABELS.FREELANCE,
  'SALARIE': LABELS.SALARIE
};

// Liste exhaustive pour typage et itérations
export const TYPES_EVENEMENTS = [
  LABELS.FORMATION,
  LABELS.SERVICE,
  LABELS.FREELANCE,
  LABELS.SALARIE,
  LABELS.PROJET_ETU,
  LABELS.PROJET_PERSO,
  LABELS.PROJET_FREELANCE,
  LABELS.PROJET_PRO
];

// Configuration des couleurs (RGBA) pour fonds et graphiques
export const COULEURS_TYPES_RGBA = {
  [LABELS.FORMATION]: 'rgba(2, 136, 209, 0.15)',      // Light Blue
  [LABELS.SERVICE]: 'rgba(156, 39, 176, 0.15)',        // Purple
  [LABELS.FREELANCE]: 'rgba(255, 152, 0, 0.15)',       // Orange
  [LABELS.SALARIE]: 'rgba(97, 97, 97, 0.15)',          // Grey (Legacy)
  [LABELS.PROJET_ETU]: 'rgba(76, 175, 80, 0.15)',      // Green
  [LABELS.PROJET_PERSO]: 'rgba(0, 150, 136, 0.15)',    // Teal
  [LABELS.PROJET_FREELANCE]: 'rgba(255, 193, 7, 0.15)',// Amber
  [LABELS.PROJET_PRO]: 'rgba(69, 90, 100, 0.15)',      // Blue Grey (Legacy)
};

// Configuration des variantes MUI (Chip, Alert)
export const COULEURS_TYPES_MUI = {
  [LABELS.FORMATION]: 'info',
  [LABELS.SERVICE]: 'secondary',
  [LABELS.FREELANCE]: 'warning',
  [LABELS.SALARIE]: 'default',
  [LABELS.PROJET_ETU]: 'success',
  [LABELS.PROJET_PERSO]: 'success',
  [LABELS.PROJET_FREELANCE]: 'warning',
  [LABELS.PROJET_PRO]: 'default',
};

// Configuration des couleurs (HEX) pour bordures et textes
export const COULEURS_TYPES_HEX = {
  [LABELS.FORMATION]: '#0288d1',
  [LABELS.SERVICE]: '#9c27b0',
  [LABELS.FREELANCE]: '#ed6c02',
  [LABELS.SALARIE]: '#616161',
  [LABELS.PROJET_ETU]: '#2e7d32',
  [LABELS.PROJET_PERSO]: '#009688',
  [LABELS.PROJET_FREELANCE]: '#ffb300',
  [LABELS.PROJET_PRO]: '#455a64',
};