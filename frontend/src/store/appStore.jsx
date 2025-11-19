// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';
import { TYPES_EVENEMENTS } from '../config';

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000, // Timeout de sécurité
});

// Helpers de normalisation (Purs)
const normaliserProjet = (projet, type) => ({
  id: `${type}-${projet.id}`,
  type: type, 
  titre: projet.titre,
  date_debut: projet.date_debut,
  date_fin: projet.date_fin,
  description: projet.introduction,
  specificites: {
    role: projet.role,
    technologies: projet.technologies,
    media_video: projet.media_video,
    media_photos: projet.media_photos,
    url_code_source: projet.url_code_source,
    travail_effectue: projet.travail_effectue,
    institution: projet.institution || null,
  }
});

const extraireDescriptionActivite = (missions) => {
  if (missions?.length > 0 && missions[0].descriptions?.length > 0) {
    return missions[0].descriptions[0] || '';
  }
  return ''; 
};

export const useAppStore = create((set, get) => ({
  // --- État des Données ---
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],
  
  evenementsChronologiques: [], 
  
  // --- État de l'UI ---
  typesFiltres: new Set(TYPES_EVENEMENTS),
  chargementIntro: true,     // Chargement critique (Haut de page)
  chargementChronologie: true, // Chargement secondaire
  erreur: null,

  // --- Sélecteurs ---
  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    // Si tous les filtres sont actifs, on retourne tout sans filtrer (optimisation)
    if (typesFiltres.size === TYPES_EVENEMENTS.length) {
      return evenementsChronologiques;
    }
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  // --- Actions ---

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

  /**
   * Orchestrateur de chargement :
   * Lance le chargement critique (Intro) et enchaîne avec le reste sans bloquer l'UI.
   */
  fetchAllData: async () => {
    const { fetchIntroduction, fetchChronologie } = get();
    
    set({ erreur: null });

    // 1. Chargement prioritaire : nécessaire pour le "First Contentful Paint" significatif
    try {
      await fetchIntroduction();
    } catch (e) {
      console.error("Erreur critique chargement intro:", e);
      set({ erreur: "Impossible de charger le profil." });
      return; // On arrête si l'intro plante
    }

    // 2. Chargement secondaire : exécuté en tâche de fond
    fetchChronologie().catch(e => {
      console.warn("Erreur chargement chronologie (non bloquant):", e);
      // On peut choisir d'afficher une notification toast ici au lieu d'une erreur bloquante
    });
  },

  fetchIntroduction: async () => {
    set({ chargementIntro: true });
    const [resPresentation, resPostes, resDiplomes, resCompetences, resSections] = await Promise.all([
      clientApi.get('/presentations/'),
      clientApi.get('/postes/'),
      clientApi.get('/diplomes/'),
      clientApi.get('/competences/'),
      clientApi.get('/sections-competences/'),
    ]);

    set({
      presentation: resPresentation.data[0] || null,
      postes: resPostes.data,
      diplomes: resDiplomes.data,
      competences: resCompetences.data,
      sectionsCompetences: resSections.data,
      chargementIntro: false,
    });
  },

  fetchChronologie: async () => {
    set({ chargementChronologie: true });
    
    const [resFormations, resActivites, resServices, resProjetsPro, resProjetsEtu, resProjetsPerso] = await Promise.all([
      clientApi.get('/formations/'),
      clientApi.get('/activites-professionnelles/'),
      clientApi.get('/services-civiques/'),
      clientApi.get('/projets-professionnels/'),
      clientApi.get('/projets-etudiants/'),
      clientApi.get('/projets-personnels/'),
    ]);

    const formations = resFormations.data.map(item => ({
      id: `formation-${item.id}`,
      type: 'Formation',
      titre: item.titre,
      date_debut: item.date_debut,
      date_fin: item.date_fin,
      description: item.description, 
      specificites: { 
        institution: item.institution,
        description: item.description,
        justificatif: item.justificatif,
      }
    }));

    const activites = resActivites.data.map(item => ({
      id: `activite-${item.id}`,
      type: 'Activité rémunératrice',
      titre: item.poste, 
      date_debut: item.date_debut,
      date_fin: item.date_fin,
      description: extraireDescriptionActivite(item.missions),
      specificites: {
        poste: item.poste,
        missions: item.missions,
      }
    }));

    const services = resServices.data.map(item => ({
      id: `service-${item.id}`,
      type: 'Service civique',
      titre: item.mission, 
      date_debut: item.date_debut,
      date_fin: item.date_fin,
      description: extraireDescriptionActivite(item.missions),
      specificites: {
        mission: item.mission,
        organisme_accueil: item.organisme_accueil,
        missions: item.missions,
      }
    }));

    const projetsPro = resProjetsPro.data.map(p => normaliserProjet(p, 'Projets Professionnels'));
    const projetsEtu = resProjetsEtu.data.map(p => normaliserProjet(p, 'Projets Etudiant'));
    const projetsPerso = resProjetsPerso.data.map(p => normaliserProjet(p, 'Projets Personnels'));

    const tousEvenements = [
      ...formations,
      ...activites,
      ...services,
      ...projetsPro,
      ...projetsEtu,
      ...projetsPerso,
    ];
    
    // Tri descendant par date
    tousEvenements.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

    set({
      evenementsChronologiques: tousEvenements,
      chargementChronologie: false,
    });
  },
}));