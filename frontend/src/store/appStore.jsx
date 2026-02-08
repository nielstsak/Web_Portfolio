// [Symbole Commentaire] FICHIER : frontend/src/store/appStore.jsx

import { create } from 'zustand';
import axios from 'axios';
import { LABELS, CATEGORY_LABELS } from '../config';

// Instance Axios configurée pour l'API Django
export const clientApi = axios.create({
  baseURL: 'https://hammerhead-app-cil8t.ondigitalocean.app/api',
  timeout: 15000,
});

/**
 * Normalise les objets API hétérogènes en une structure unique pour l'UI.
 * Applique le principe de Ségrégation des Interfaces.
 */
const normaliserDonnee = (item, idPrefix, labelType) => {
  const debut = new Date(item.date_debut);
  const fin = item.date_fin ? new Date(item.date_fin) : null;
  
  return {
    id: `${idPrefix}-${item.id}`,
    apiId: item.id, // ID original pour les requêtes de détail
    type: labelType,
    titre: item.titre || item.poste || item.mission || 'Sans titre',
    description: item.description || item.introduction || '',
    
    // Données temporelles pré-calculées
    date_debut_obj: debut,
    periode: fin 
      ? `${debut.getFullYear()} - ${fin.getFullYear()}` 
      : `${debut.getFullYear()} - En cours`,
    
    // Métadonnées spécifiques aux Projets
    technologies: item.technologies || [],
    video: item.media_video || null,
    
    // Payload complet pour les modales/détails
    raw: item 
  };
};

export const useAppStore = create((set) => ({
  // --- État Global ---
  chargement: true,
  erreur: null,

  // --- Données Statiques (Intro) ---
  presentation: null,
  postes: [],
  diplomes: [],
  competences: [],
  sectionsCompetences: [],

  // --- Données Dynamiques (Listes) ---
  parcours: [], // Contient : Formation, Service Civique, Freelance
  projets: [],  // Contient : Etudiant, Perso, Freelance

  // --- Actions ---
  
  fetchAllData: async () => {
    set({ chargement: true, erreur: null });
    
    try {
      // Exécution concurrente pour minimiser le temps de blocage réseau
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

      // 1. Construction de la section PARCOURS
      // Règles : Formation + Service Civique + Activité Freelance uniquement
      const formations = resForm.data.map(i => normaliserDonnee(i, 'FORM', LABELS.FORMATION));
      const services = resServ.data.map(i => normaliserDonnee(i, 'SERV', LABELS.SERVICE));
      
      const freelanceActivites = resActiv.data
        .filter(a => a.type_contrat === 'FREELANCE')
        .map(i => normaliserDonnee(i, 'FREE_ACT', LABELS.FREELANCE));

      const listeParcours = [...formations, ...services, ...freelanceActivites]
        .sort((a, b) => b.date_debut_obj - a.date_debut_obj); // Tri antéchronologique (plus récent en haut)

      // 2. Construction de la section PROJETS
      // Règles : Etudiant + Perso + Freelance uniquement (Exclusion PRO/Salarié)
      const categoriesAutorisees = ['ETU', 'PERSO', 'FREELANCE'];
      
      const listeProjets = resProj.data
        .filter(p => categoriesAutorisees.includes(p.categorie))
        .map(p => {
          const label = CATEGORY_LABELS[p.categorie] || LABELS.PROJET_PERSO;
          return normaliserDonnee(p, 'PROJ', label);
        })
        .sort((a, b) => b.date_debut_obj - a.date_debut_obj);

      // Mise à jour atomique du store
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