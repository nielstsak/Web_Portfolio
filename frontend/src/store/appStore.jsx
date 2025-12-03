// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';
import { TYPES_EVENEMENTS, CATEGORY_LABELS } from '../config';

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
});

// Normalisation générique
const normaliserEvent = (item, type, extraProps = {}) => ({
  id: `${type}-${item.id}`,
  type,
  titre: item.titre || item.poste || item.mission,
  date_debut: item.date_debut,
  date_fin: item.date_fin,
  description: item.introduction || item.description || '',
  specificites: { ...item, ...extraProps }
});

export const useAppStore = create((set, get) => ({
  // Data
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],
  evenementsChronologiques: [], 
  
  // UI
  typesFiltres: new Set(TYPES_EVENEMENTS),
  chargementIntro: true,
  chargementChronologie: true,
  erreur: null,

  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    if (typesFiltres.size === TYPES_EVENEMENTS.length) return evenementsChronologiques;
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  basculerFiltreType: (type) => {
    set((state) => {
      const nouveaux = new Set(state.typesFiltres);
      nouveaux.has(type) ? nouveaux.delete(type) : nouveaux.add(type);
      return { typesFiltres: nouveaux };
    });
  },

  fetchAllData: async () => {
    const { fetchIntro, fetchTimeline } = get();
    set({ erreur: null });
    try {
      await fetchIntro();
      fetchTimeline(); 
    } catch (e) {
      console.error(e);
      set({ erreur: "Impossible de charger le profil." });
    }
  },
// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';
import { TYPES_EVENEMENTS, CATEGORY_LABELS, LABELS } from '../config';

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 15000,
});

// Normalisation sécurisée
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
  // --- Données ---
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],
  evenementsChronologiques: [], 
  
  // --- UI ---
  typesFiltres: new Set(TYPES_EVENEMENTS),
  chargementIntro: true,
  chargementChronologie: true,
  erreur: null,

  // --- Sélecteurs ---
  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    if (!evenementsChronologiques) return [];
    if (typesFiltres.size === TYPES_EVENEMENTS.length) return evenementsChronologiques;
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  basculerFiltreType: (type) => {
    set((state) => {
      const nouveaux = new Set(state.typesFiltres);
      nouveaux.has(type) ? nouveaux.delete(type) : nouveaux.add(type);
      return { typesFiltres: nouveaux };
    });
  },

  // --- Actions Asynchrones ---

  fetchAllData: async () => {
    const { fetchIntro, fetchTimeline } = get();
    set({ erreur: null });
    
    try {
      await fetchIntro();
      // On lance la suite sans attendre (non bloquant)
      fetchTimeline(); 
    } catch (e) {
      console.error("Erreur critique chargement données:", e);
      set({ erreur: "Impossible de charger le profil. Vérifiez la connexion API." });
    }
  },

  fetchIntro: async () => {
    set({ chargementIntro: true });
    try {
      // Utilisation de noms explicites 'response...' pour éviter toute confusion
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
      presentation: resPres.data[0] || null,
      postes: resPostes.data,
      diplomes: resDiplomes.data,
      competences: resComp.data,
      sectionsCompetences: resSect.data,
      chargementIntro: false,
    });
  },

  fetchTimeline: async () => {
    set({ chargementChronologie: true });
    try {
      const [resForm, resAct, resServ, resProjets] = await Promise.all([
        clientApi.get('/formations/'),
        clientApi.get('/activites-professionnelles/'),
        clientApi.get('/services-civiques/'),
        clientApi.get('/projets/'),
      ]);

      const events = [
        ...resForm.data.map(i => normaliserEvent(i, 'Formation')),
        ...resAct.data.map(i => normaliserEvent(i, 'Activité rémunératrice', { poste: i.poste })),
        ...resServ.data.map(i => normaliserEvent(i, 'Service civique', { mission: i.mission })),
        ...resProjets.data.map(p => {
            // Mapping de la catégorie backend vers le libellé frontend
            const typeLabel = CATEGORY_LABELS[p.categorie] || 'Projets Personnels';
            return normaliserEvent(p, typeLabel);
        })
      ];

      events.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

      set({ evenementsChronologiques: events, chargementChronologie: false });
    } catch (e) {
      console.warn("Erreur timeline:", e);
    }
  },
}));