// frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';

// Instance Axios centralisée
export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

// Nouveaux types correspondant aux 6 modèles
const TOUS_LES_TYPES = [
  'Formation',
  'Activité rémunératrice',
  'Service civique',
  'Projets Professionnels',
  'Projets Etudiant',
  'Projets Personnels'
];

/**
 * Normalise les données des projets (Pro, Etudiant, Perso)
 * pour qu'elles correspondent à la structure attendue par les composants.
 */
const normaliserProjet = (projet, type) => ({
  id: `${type}-${projet.id}`,
  type: type, // Ajout manuel du type
  titre: projet.titre,
  date_debut: projet.date_debut,
  date_fin: projet.date_fin,
  // 'introduction' est mappé vers 'description' pour la CarteEvenement
  description: projet.introduction,
  // 'specificites' contient tout le reste pour la ModaleEvenement
  specificites: {
    role: projet.role,
    technologies: projet.technologies,
    media_video: projet.media_video,
    media_photos: projet.media_photos,
    code_source_zip: projet.code_source_zip,
    travail_effectue: projet.travail_effectue,
    // Uniquement pour Projets Etudiant
    institution: projet.institution || null,
  }
});

/**
 * Store global Zustand pour la gestion de l'état de l'application.
 */
export const useAppStore = create((set, get) => ({
  // --- État
  evenementsChronologiques: [], // Sera rempli par les données normalisées
  typesFiltres: new Set(TOUS_LES_TYPES),
  
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  
  chargement: true,
  erreur: null,

  // --- Sélecteurs
  
  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    if (typesFiltres.size === TOUS_LES_TYPES.length) {
      return evenementsChronologiques;
    }
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  // --- Actions ---

  /**
   * Récupère les données des 6 endpoints, les normalise et les fusionne.
   */
  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    try {
      // Lance toutes les requêtes en parallèle
      const [
        // Données Introduction
        reponsePresentation,
        reponsePostes,
        reponseDiplomes,
        reponseCompetences,
        
        // Données Chronologie (6 endpoints)
        reponseFormations,
        reponseActivites,
        reponseServices,
        reponseProjetsPro,
        reponseProjetsEtu,
        reponseProjetsPerso,
      ] = await Promise.all([
        // Introduction
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
        
        // Chronologie
        clientApi.get('/formations/'),
        clientApi.get('/activites-professionnelles/'),
        clientApi.get('/services-civiques/'),
        clientApi.get('/projets-professionnels/'),
        clientApi.get('/projets-etudiants/'),
        clientApi.get('/projets-personnels/'),
      ]);

      // --- Normalisation des données de chronologie ---

      const formations = reponseFormations.data.map(item => ({
        id: `formation-${item.id}`,
        type: 'Formation',
        titre: item.titre,
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        description: item.description, // Utilisé par CarteEvenement
        specificites: { // Utilisé par ModaleEvenement
          institution: item.institution,
          description: item.description,
          justificatif: item.justificatif,
        }
      }));

      const activites = reponseActivites.data.map(item => ({
        id: `activite-${item.id}`,
        type: 'Activité rémunératrice',
        titre: item.poste, // 'poste' devient 'titre'
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        description: item.missions.length ? item.missions[0].description : '', // Aperçu
        specificites: {
          poste: item.poste,
          missions: item.missions,
        }
      }));

      const services = reponseServices.data.map(item => ({
        id: `service-${item.id}`,
        type: 'Service civique',
        titre: item.mission, // 'mission' devient 'titre'
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        description: item.missions.length ? item.missions[0].description : '', // Aperçu
        specificites: {
          mission: item.mission,
          organisme_accueil: item.organisme_accueil,
          missions: item.missions,
        }
      }));

      // Normalisation des 3 types de projets
      const projetsPro = reponseProjetsPro.data.map(p => normaliserProjet(p, 'Projets Professionnels'));
      const projetsEtu = reponseProjetsEtu.data.map(p => normaliserProjet(p, 'Projets Etudiant'));
      const projetsPerso = reponseProjetsPerso.data.map(p => normaliserProjet(p, 'Projets Personnels'));

      // Fusion et tri
      const tousEvenements = [
        ...formations,
        ...activites,
        ...services,
        ...projetsPro,
        ...projetsEtu,
        ...projetsPerso,
      ];
      
      // Tri final par date de début (plus récent en premier)
      tousEvenements.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

      // Met à jour l'état global
      set({
        // Données Introduction
        presentation: reponsePresentation.data[0] || null,
        postes: reponsePostes.data,
        diplomes: reponseDiplomes.data,
        competences: reponseCompetences.data,
        
        // Données Chronologie (normalisées)
        evenementsChronologiques: tousEvenements,
        
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