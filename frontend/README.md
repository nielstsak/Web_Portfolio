# Frontend - Portfolio Web (React + Vite)

Cette application constitue l'interface utilisateur (frontend) du projet de portfolio web. Elle est développée avec **React** et utilise **Vite** comme outil de build.

L'objectif principal est de fournir une interface dynamique, animée et réactive pour présenter les projets, le parcours et les compétences, en consommant les données fournies par une API backend distincte (construite avec Django/DRF).

---

## 🚀 Technologies Principales

* **Framework :** React 19 (via Vite)
* **Bibliothèque UI :** Material-UI (MUI) & MUI Lab
* **Gestion d'État :** Zustand (pour une gestion d'état globale minimaliste)
* **Appels API :** Axios (configuré dans `src/store/appStore.jsx`)
* **Animations :** Framer Motion (utilisé pour les transitions de page et les micro-interactions)
* **Routage :** React Router DOM v7
* **Affichage de Code :** React Syntax Highlighter (pour le composant `CodeBrowser`)

---

## 📂 Structure du Projet

L'architecture du frontend est organisée pour séparer les responsabilités :

* **`src/pages/`** : Contient les vues principales de l'application.
    * `LandingPage.jsx` : La page d'accueil qui gère la navigation entre les trois sections principales (Introduction, Parcours, Projets) via le défilement.
    * `ProjectPage.jsx` : La page de détail d'un projet spécifique, incluant le visualiseur de code source.

* **`src/components/`** : Contient tous les composants réutilisables.
    * `CodeBrowser.jsx` : Un composant complexe affichant une arborescence de fichiers et le contenu de ces fichiers avec coloration syntaxique.
    * `introduction/` : Composants spécifiques à la section "Introduction".
    * `Navbar.jsx`, `Footer.jsx`, `AnimatedBackground.jsx` : Composants de mise en page globaux.

* **`src/store/appStore.jsx`** : Fichier central de Zustand.
    * Définit le store global `useAppStore`.
    * Configure l'instance `clientApi` (Axios) pour les requêtes.
    * Contient l'action `fetchAllData` qui récupère toutes les données initiales au chargement de l'application.

* **`src/theme.js`** : Fichier de configuration centralisé pour le thème Material-UI (couleurs, typographie, etc.).

---

## 🛠️ Installation et Lancement

1.  **Installer les dépendances :**
    ```sh
    npm install
    ```

2.  **Lancer le serveur de développement :**
    L'application se lancera (par défaut) sur `http://localhost:5173`.
    ```sh
    npm run dev
    ```

3.  **Lancer le Linter :**
    ```sh
    npm run lint
    ```

4.  **Builder pour la production :**
    Génère les fichiers statiques optimisés dans le dossier `dist/`.
    ```sh
    npm run build
    ```

---

## 🔌 Connexion au Backend

Cette application frontend *nécessite* que l'API backend (Django) soit en cours d'exécution pour fonctionner.

* L'URL de l'API est définie par la variable d'environnement `VITE_API_URL` (dans un fichier `.env`).
* Si cette variable n'est pas définie, l'application tentera par défaut de se connecter à `http://127.0.0.1:8000/api` (voir `src/store/appStore.jsx`).