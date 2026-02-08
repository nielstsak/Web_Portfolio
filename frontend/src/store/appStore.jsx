import { create } from 'zustand';
import axios from 'axios';
import { LABELS, CATEGORY_LABELS } from '../config';

export const clientApi = axios.create({
  baseURL: 'https://hammerhead-app-cil8t.ondigitalocean.app/api',
  timeout: 15000,
});

console.log("📢 CONFIGURATION API ACTUELLE :", clientApi.defaults.baseURL);

const normaliserDonnee = (item, idPrefix, labelType) => {
  const debut = new Date(item.date_debut);
  const fin = item.date_fin ? new Date(item.date_fin) : null;
  
  return {
    id: `${idPrefix}-${item.id}`,
    apiId: item.id,
    type: labelType,
    titre: item.titre || item.poste || item.mission || 'Sans titre',
    description: item.description || item.introduction || '',
    
    date_debut_obj: debut,
    periode: fin 
      ? `${debut.getFullYear()} - ${fin.getFullYear()}` 
      : `${debut.getFullYear()} - En cours`,
    
    technologies: item.technologies || [],
    video: item.media_video || null,
    
    raw: item 
  };
};

export const useAppStore = create((set) => ({
  chargement: true,
  erreur: null,

  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],

  parcours: [],
  projets: [],

  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    
    try {
      const [
        resPres, resPostes, resDiplomes, resCompt, resSectCompt,
        resForm, resActiv, resServ, resProj
      ] = await Promise.all([
        clientApi.get('/presentations/'),
        clientApi.get('/postes/'),
        clientApi.get('/diplomes/'),
        clientApi.get('/competences/'),
        clientApi.get('/sections-competences/'),
        clientApi.get('/formations/'),
        clientApi.get('/activites-professionnelles/'),
        clientApi.get('/services-civiques/'),
        clientApi.get('/projets/'),
      ]);

      const formations = resForm.data.map(i => normaliserDonnee(i, 'FORM', LABELS.FORMATION));
      const services = resServ.data.map(i => normaliserDonnee(i, 'SERV', LABELS.SERVICE));
      
      const freelanceActivites = resActiv.data
        .filter(a => a.type_contrat === 'FREELANCE')
        .map(i => normaliserDonnee(i, 'FREE_ACT', LABELS.FREELANCE));

      const listeParcours = [...formations, ...services, ...freelanceActivites]
        .sort((a, b) => b.date_debut_obj - a.date_debut_obj);

      const categoriesAutorisees = ['ETU', 'PERSO', 'FREELANCE'];
      
      const listeProjets = resProj.data
        .filter(p => categoriesAutorisees.includes(p.categorie))
        .map(p => {
          const label = CATEGORY_LABELS[p.categorie] || LABELS.PROJET_PERSO;
          return normaliserDonnee(p, 'PROJ', label);
        })
        .sort((a, b) => b.date_debut_obj - a.date_debut_obj);

      set({
        presentation: resPres.data[0] || null,
        postes: resPostes.data,
        diplomes: resDiplomes.data,
        competences: resCompt.data,
        sectionsCompetences: resSectCompt.data,
        parcours: listeParcours,
        projets: listeProjets,
        chargement: false
      });

    } catch (error) {
      console.error("Erreur critique store:", error);
      set({ 
        erreur: "Impossible de charger les données. Vérifiez la connexion API.", 
        chargement: false 
      });
    }
  }
}));