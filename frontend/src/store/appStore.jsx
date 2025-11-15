// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';

// Instance Axios centralisée pour communiquer avec l'API Django.
export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

// Doit correspondre aux 'Choices' du modèle Django EvenementChronologique.TypeEvenement
const TOUS_LES_TYPES = [
  'Etudes',
  'Diplome',
  'Service civique',
  'Projets Etudiant',
  'Projets Professionnels',
  'Projets Personnels',
  'Activité rémunératrice'
];

/**
 * Store global Zustand pour la gestion de l'état de l'application.
 */
export const useAppStore = create((set, get) => ({
  // --- État
  evenementsChronologiques: [],
  typesFiltres: new Set(TOUS_LES_TYPES), // Filtres actifs (par défaut, tous)
  
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  
  chargement: true,
  erreur: null,

  // --- Sélecteurs (États dérivés)
  
  /**
   * Retourne les événements filtrés en fonction du Set 'typesFiltres' actif.
   */
  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    // Optimisation : si tout est coché, retourner le tableau complet
    if (typesFiltres.size === TOUS_LES_TYPES.length) {
      return evenementsChronologiques;
    }
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  // --- Actions ---

  /**
   * Action pour récupérer toutes les données initiales de l'application.
   */
  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    try {
      // Lance toutes les requêtes en parallèle pour optimiser le chargement.
      const [
        reponseEvenements,
        reponsePresentation,
        reponsePostes,
        reponseDiplomes,
        reponseCompetences,
      ] = await Promise.all([
        clientApi.get('/evenements-chronologiques/'), // NOUVELLE ROUTE
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
      ]);

      // Met à jour l'état global avec les données reçues
      set({
        evenementsChronologiques: reponseEvenements.data,
        presentation: reponsePresentation.data[0] || null,
        postes: reponsePostes.data,
        diplomes: reponseDiplomes.data,
        competences: reponseCompetences.data,
        chargement: false,
      });
    } catch (erreur) {
      console.error("Échec de la récupération des données de l'application:", erreur);
      set({
        erreur: "Erreur lors de la récupération des données de l'application.",
        chargement: false,
      });
    }
  },

  /**
   * Ajoute ou retire un type d'événement du filtre.
   * @param {string} type - Le type à basculer (ex: 'Etudes')
   */
  basculerFiltreType: (type) => {
    set((state) => {
      const nouveauxFiltres = new Set(state.typesFiltres);
      if (nouveauxFiltres.has(type)) {
        nouveauxFiltres.delete(type);
      } else {
        nouveauxFiltres.add(type);
      }
      return { typesFiltres: nouveauxFiltres };
    });
  },
}));