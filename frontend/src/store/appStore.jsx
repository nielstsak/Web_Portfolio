// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';

// Instance Axios centralisée pour communiquer avec l'API Django.
// Utilise l'URL de l'environnement ou une valeur par défaut pour le développement local.
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

/**
 * Store global Zustand pour la gestion de l'état de l'application.
 * Contient toutes les données récupérées depuis l'API ainsi que les états de chargement/erreur.
 */
export const useAppStore = create((set) => ({
  // --- État initial du store ---
  projects: [],
  parcoursData: [],
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  loading: true,
  error: null,

  /**
   * Action pour récupérer toutes les données initiales de l'application.
   * Les requêtes sont lancées en parallèle pour optimiser le temps de chargement.
   */
  fetchAllData: async () => {
    set({ loading: true, error: null });
    try {
      // Lance toutes les requêtes en parallèle pour un chargement plus rapide.
      const [
        projectsRes,
        parcoursRes,
        presentationRes,
        postesRes,
        diplomesRes,
        competencesRes,
      ] = await Promise.all([
        apiClient.get('/projects/'),
        apiClient.get('/parcours/'),
        apiClient.get('/presentations/'),
        apiClient.get('/postes/'),
        apiClient.get('/diplomes/'),
        apiClient.get('/competences/'),
      ]);

      set({
        projects: projectsRes.data,
        parcoursData: parcoursRes.data,
        // L'API retourne un tableau, mais on n'utilise que le premier objet de présentation.
        presentation: presentationRes.data[0] || null,
        postes: postesRes.data,
        diplomes: diplomesRes.data,
        competences: competencesRes.data,
        loading: false,
      });
    } catch (error) {
      console.error("Échec de la récupération des données de l'application:", error);
      set({
        error: "Erreur lors de la récupération des données de l'application.",
        loading: false,
      });
    }
  },
}));