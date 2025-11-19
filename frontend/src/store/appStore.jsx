import { create } from 'zustand';
import axios from 'axios';

export const clientApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
});

const TOUS_LES_TYPES = [
  'Formation',
  'Activité rémunératrice',
  'Service civique',
  'Projets Professionnels',
  'Projets Etudiant',
  'Projets Personnels'
];

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

const getApercuDescription = (missions) => {
  try {
    if (missions && missions.length > 0 && 
        missions[0].descriptions && missions[0].descriptions.length > 0) {
      const desc = missions[0].descriptions[0];
      return typeof desc === 'string' ? desc : '';
    }
    return ''; 
  } catch (e) {
    console.warn("Erreur lors de la génération de l'aperçu de description:", e, missions);
    return '';
  }
};

export const useAppStore = create((set, get) => ({
  evenementsChronologiques: [], 
  typesFiltres: new Set(TOUS_LES_TYPES),
  
  presentation: null, // MODIFIÉ: Structure attendue avec le champ 'details'
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],
  
  chargement: true,
  erreur: null,

  evenementsFiltres: () => {
    const { evenementsChronologiques, typesFiltres } = get();
    if (typesFiltres.size === TOUS_LES_TYPES.length) {
      return evenementsChronologiques;
    }
    return evenementsChronologiques.filter(evt => typesFiltres.has(evt.type));
  },

  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    try {
      const [
        reponsePresentation,
        reponsePostes,
        reponseDiplomes,
        reponseCompetences,
        reponseSectionsCompetences,
        reponseFormations,
        reponseActivites,
        reponseServices,
        reponseProjetsPro,
        reponseProjetsEtu,
        reponseProjetsPerso,
      ] = await Promise.all([
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
        clientApi.get('/sections-competences/'),
        clientApi.get('/formations/'),
        clientApi.get('/activites-professionnelles/'),
        clientApi.get('/services-civiques/'),
        clientApi.get('/projets-professionnels/'),
        clientApi.get('/projets-etudiants/'),
        clientApi.get('/projets-personnels/'),
      ]);

      const formations = reponseFormations.data.map(item => ({
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

      const activites = reponseActivites.data.map(item => ({
        id: `activite-${item.id}`,
        type: 'Activité rémunératrice',
        titre: item.poste, 
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        description: getApercuDescription(item.missions),
        specificites: {
          poste: item.poste,
          missions: item.missions,
        }
      }));

      const services = reponseServices.data.map(item => ({
        id: `service-${item.id}`,
        type: 'Service civique',
        titre: item.mission, 
        date_debut: item.date_debut,
        date_fin: item.date_fin,
        description: getApercuDescription(item.missions),
        specificites: {
          mission: item.mission,
          organisme_accueil: item.organisme_accueil,
          missions: item.missions,
        }
      }));

      const projetsPro = reponseProjetsPro.data.map(p => normaliserProjet(p, 'Projets Professionnels'));
      const projetsEtu = reponseProjetsEtu.data.map(p => normaliserProjet(p, 'Projets Etudiant'));
      const projetsPerso = reponseProjetsPerso.data.map(p => normaliserProjet(p, 'Projets Personnels'));

      const tousEvenements = [
        ...formations,
        ...activites,
        ...services,
        ...projetsPro,
        ...projetsEtu,
        ...projetsPerso,
      ];
      
      tousEvenements.sort((a, b) => new Date(b.date_debut) - new Date(a.date_debut));

      set({
        presentation: reponsePresentation.data[0] || null,
        postes: reponsePostes.data,
        diplomes: reponseDiplomes.data,
        competences: reponseCompetences.data,
        sectionsCompetences: reponseSectionsCompetences.data,
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