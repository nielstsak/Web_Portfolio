// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';
import { TYPES_EVENEMENTS, CATEGORY_LABELS, LABELS } from '../config';

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
});

const normaliserEvent = (item, type, extraProps = {}) => ({
  id: `${type.replace(/\s+/g, '')}-${item.id}`,
  type,
  titre: item.titre || item.poste || item.mission || 'Sans titre',
  date_debut: item.date_debut,
  date_fin: item.date_fin,
  description: item.introduction || item.description || '',
  specificites: { ...item, ...extraProps }
});

export const useAppStore = create((set, get) => ({
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],
  evenementsChronologiques: [],
  
  // Variables "Cache" pour éviter les boucles de rendu infinies
  _cacheEvenementsFiltres: [],
  _cacheCategories: ['Tous'],
  
  filtreActif: 'Tous',
  chargementIntro: true,
  chargementChronologie: true,
  erreur: null,

  // Action interne pour recalculer les données dérivées
  // Cela garantit que les références des tableaux ne changent que si les données changent vraiment.
  calculerDerives: () => {
    const { evenementsChronologiques, filtreActif } = get();
    
    // 1. Calcul des catégories
    let categories = ['Tous'];
    if (evenementsChronologiques && evenementsChronologiques.length > 0) {
      const types = evenementsChronologiques.map(e => e.type).filter(Boolean);
      categories = ['Tous', ...[...new Set(types)].sort()];
    }

    // 2. Calcul du filtrage
    let filtres = [];
    if (evenementsChronologiques) {
      if (filtreActif === 'Tous') {
        filtres = evenementsChronologiques;
      } else {
        filtres = evenementsChronologiques.filter(evt => evt.type === filtreActif);
      }
    }

    // Mise à jour du cache dans le store
    set({ _cacheCategories: categories, _cacheEvenementsFiltres: filtres });
  },

  setFiltre: (nouveauFiltre) => {
    set({ filtreActif: nouveauFiltre });
    get().calculerDerives(); // Recalcule le cache après changement de filtre
  },

  // Les getters retournent maintenant les valeurs en cache (stables)
  evenementsFiltres: () => get()._cacheEvenementsFiltres,
  listeCategories: () => get()._cacheCategories,

  fetchAllData: async () => {
    const { fetchIntro, fetchTimeline } = get();
    set({ erreur: null });
    
    try {
      await fetchIntro();
      fetchTimeline(); 
    } catch (e) {
      console.error("Erreur critique chargement données:", e);
      set({ erreur: "Impossible de charger le profil. Vérifiez la connexion API." });
    }
  },

  fetchIntro: async () => {
    set({ chargementIntro: true });
    try {
      const [
        responsePresentation, 
        responsePostes, 
        responseDiplomes, 
        responseCompetences, 
        responseSections
      ] = await Promise.all([
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
        clientApi.get('/sections-competences/'),
      ]);

      set({
        presentation: responsePresentation.data[0] || null,
        postes: responsePostes.data,
        diplomes: responseDiplomes.data,
        competences: responseCompetences.data,
        sectionsCompetences: responseSections.data,
        chargementIntro: false,
      });
    } catch (error) {
      console.error("Erreur fetchIntro:", error);
      set({ chargementIntro: false, erreur: "Erreur lors du chargement de l'introduction." });
      throw error; 
    }
  },

  fetchTimeline: async () => {
    set({ chargementChronologie: true });
    try {
      const [
        responseFormations, 
        responseActivites, 
        responseServices, 
        responseProjets
      ] = await Promise.all([
        clientApi.get('/formations/'),
        clientApi.get('/activites-professionnelles/'),
        clientApi.get('/services-civiques/'),
        clientApi.get('/projets/'),
      ]);

      const events = [
        ...responseFormations.data.map(i => normaliserEvent(i, LABELS.FORMATION)),
        ...responseActivites.data.map(i => normaliserEvent(i, LABELS.ACTIVITE, { poste: i.poste })),
        ...responseServices.data.map(i => normaliserEvent(i, LABELS.SERVICE, { mission: i.mission })),
        ...responseProjets.data.map(p => {
            const typeLabel = CATEGORY_LABELS[p.categorie] || LABELS.PRO_PERSO;
            return normaliserEvent(p, typeLabel);
        })
      ];

      events.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

      // Mise à jour des données brutes ET appel du calcul des dérivés
      set({ evenementsChronologiques: events, chargementChronologie: false });
      get().calculerDerives();

    } catch (e) {
      console.warn("Erreur chargement timeline:", e);
      set({ chargementChronologie: false, evenementsChronologiques: [] });
      get().calculerDerives(); // S'assure que le cache est vide mais propre
    }
  },
}));