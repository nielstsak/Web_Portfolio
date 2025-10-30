from django.db import migrations

PROJECTS_DATA = [
  {
    "title": "Kasa - Application de location",
    "video_url": "https://videos.pexels.com/video-files/8343140/8343140-hd_1920_1080_25fps.mp4",
    "description": "Refonte du site web de Kasa...",
    "role_personnel": "En tant que développeur front-end freelance...",
    "architecture_projet": "L'application est structurée autour d'une architecture de composants React...",
    "technologies": [
      "JavaScript (ES6+)", "React", "React Router", "HTML5", "CSS (avec CSS Modules)", "Vite (Bundler)"
    ],
    "specificites_competences": [
      "Développement d'une Single Page Application (SPA) avec React.",
      "Création de composants React fonctionnels et réutilisables.",
      "Gestion de l'état local des composants avec le hook `useState`.",
      "Utilisation du hook `useEffect` pour la récupération de données.",
      "Mise en place du routage côté client avec React Router.",
      "Intégration de maquettes Figma pour un design responsive.",
      "Logique de programmation pour des fonctionnalités spécifiques.",
      "Écriture de tests unitaires pour les composants React."
    ]
  },
  {
    "title": "Portfolio d'Architecte - Dynamisation",
    "video_url": "https://videos.pexels.com/video-files/5993444/5993444-hd_1920_1080_25fps.mp4",
    "description": "Développement de la partie dynamique du site portfolio d'une architecte...",
    "role_personnel": "En tant que développeur front-end, mon rôle était de concevoir...",
    "architecture_projet": "Le projet est structuré avec un front-end en HTML, CSS et JavaScript pur...",
    "technologies": [
      "JavaScript (ES6+)", "HTML5", "CSS3", "Node.js (pour l'environnement back-end)"
    ],
    "specificites_competences": [
      "Manipulation avancée du DOM.",
      "Utilisation de l'API `fetch` pour réaliser des requêtes asynchrones.",
      "Mise en place d'un système d'authentification basé sur un token.",
      "Gestion de l'affichage conditionnel des éléments de l'interface.",
      "Création et gestion complète d'une fenêtre modale.",
      "Gestion des événements du navigateur.",
      "Utilisation de `FormData` pour l'envoi de fichiers (images).",
      "Validation de formulaires et affichage de messages d'erreur."
    ]
  }
]

def populate_projects(apps, schema_editor):
    Project = apps.get_model('api', 'Project')
    for project_data in PROJECTS_DATA:
        Project.objects.create(**project_data)

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_update_project_model'),
    ]

    operations = [
        migrations.RunPython(populate_projects),
    ]
