# backend/core/settings.py

import os
from pathlib import Path
from dotenv import load_dotenv # Gère les variables d'environnement (fichier .env)
import dj_database_url # Facilite la configuration de la base de données en production

# Charge les variables depuis le fichier .env
load_dotenv()

# REPERTOIRE_BASE pointe vers le dossier 'backend'
REPERTOIRE_BASE = Path(__file__).resolve().parent.parent

# Clé secrète lue depuis l'environnement
SECRET_KEY = os.getenv('SECRET_KEY')

# Le mode DEBUG est activé si la variable d'env DEBUG est 'True'
DEBUG = os.getenv('DEBUG', 'False') == 'True'

# Hôtes autorisés
ALLOWED_HOSTS = []

# Ajoute l'hôte de production (Koyeb, Render, etc.) s'il est fourni
HOTE_APPLICATION = os.environ.get('APP_HOSTNAME')
if HOTE_APPLICATION:
    ALLOWED_HOSTS.append(HOTE_APPLICATION)


# --- Applications installées ---
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    'whitenoise.runserver_nostatic', # Service des fichiers statiques en dev
    "django.contrib.staticfiles",
    'rest_framework', # Django REST Framework
    'corsheaders', # Gestion CORS
    'api', # Application locale
    'cloudinary_storage', # Stockage média Cloudinary
    'cloudinary',
]

# --- Middlewares ---
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # Doit être placé tôt
    'corsheaders.middleware.CorsMiddleware', # Gestion des requêtes cross-origin
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# Fichier de routes principal
ROOT_URLCONF = "core.urls"

# --- Templates Django ---
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# Point d'entrée pour les serveurs WSGI (déploiement synchrone)
WSGI_APPLICATION = "core.wsgi.application"

# --- Base de données ---
# Configure la DB via la variable d'env DATABASE_URL (pour la prod)
# ou utilise un fichier SQLite local par défaut (pour le dev).
DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{REPERTOIRE_BASE / "db.sqlite3"}',
        conn_max_age=600
    )
}

# --- Validateurs de mot de passe ---
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

# --- Internationalisation ---
LANGUAGE_CODE = "fr-fr" # Langue du projet
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# --- Configuration CORS ---
# Liste des origines autorisées à faire des requêtes à cette API
CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", # Autorise le frontend Vite en local
]
URL_FRONTEND_VERCEL = os.environ.get('VERCEL_FRONTEND_URL')
if URL_FRONTEND_VERCEL:
    CORS_ALLOWED_ORIGINS.append(URL_FRONTEND_VERCEL)

# --- Fichiers Statiques (Admin) ---
STATIC_URL = "static/"
STATIC_ROOT = REPERTOIRE_BASE / "staticfiles"
STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# --- Fichiers Média (Uploads) ---
# Utilise Cloudinary pour le stockage des fichiers téléversés
CLOUDINARY_STORAGE = {
    'CLOUDINARY_URL': os.environ.get('CLOUDINARY_URL'),
}
MEDIA_URL = '/media/' # URL de base pour les médias
DEFAULT_FILE_STORAGE = 'cloudinary_storage.storage.MediaCloudinaryStorage'