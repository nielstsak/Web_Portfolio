// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';

// Instance Axios centralisée pour communiquer avec l'API Django.
// Utilise l'URL de l'environnement ou une valeur par défaut pour le développement local.
export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

/**
 * Store global Zustand pour la gestion de l'état de l'application.
 * Contient toutes les données récupérées depuis l'API ainsi que les états de chargement/erreur.
 */
export const useAppStore = create((set) => ({
  // --- État initial du store ---
  projets: [],
  donneesParcours: [],
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  chargement: true,
  erreur: null,

  /**
   * Action pour récupérer toutes les données initiales de l'application.
   * Les requêtes sont lancées en parallèle pour optimiser le temps de chargement.
   */
  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    try {
      // Lance toutes les requêtes en parallèle pour un chargement plus rapide.
      const [
        reponseProjets,
        reponseParcours,
        reponsePresentation,
        reponsePostes,
        reponseDiplomes,
        reponseCompetences,
      ] = await Promise.all([
        clientApi.get('/projets/'),
        clientApi.get('/parcours/'),
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
      ]);

      // Met à jour l'état global avec les données reçues
      set({
        projets: reponseProjets.data,
        donneesParcours: reponseParcours.data,
        // L'API retourne un tableau, mais on n'utilise que le premier objet.
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
}));