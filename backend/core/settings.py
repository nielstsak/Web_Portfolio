# backend/core/settings.py

import os
from pathlib import Path
from dotenv import load_dotenv 
import dj_database_url 

load_dotenv()

REPERTOIRE_BASE = Path(__file__).resolve().parent.parent

SECRET_KEY = os.getenv('SECRET_KEY')

DEBUG = os.getenv('DEBUG', 'False') == 'True'

ALLOWED_HOSTS = []

HOTE_APPLICATION = os.environ.get('APP_HOSTNAME')
if HOTE_APPLICATION:
    ALLOWED_HOSTS.append(HOTE_APPLICATION)

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    'whitenoise.runserver_nostatic', 
    "django.contrib.staticfiles",
    'rest_framework', 
    'corsheaders', 
    'api', 
    'cloudinary_storage', 
    'cloudinary',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'corsheaders.middleware.CorsMiddleware', 
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "core.urls"

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

WSGI_APPLICATION = "core.wsgi.application"

DATABASES = {
    'default': dj_database_url.config(
        default=f'sqlite:///{REPERTOIRE_BASE / "db.sqlite3"}',
        conn_max_age=600
    )
}

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",},
]

LANGUAGE_CODE = "fr-fr" 
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

CORS_ALLOWED_ORIGINS = [
    "http://localhost:5173", 
]
URL_FRONTEND_VERCEL = os.environ.get('VERCEL_FRONTEND_URL')
if URL_FRONTEND_VERCEL:
    CORS_ALLOWED_ORIGINS.append(URL_FRONTEND_VERCEL)

STATIC_URL = "static/"
STATIC_ROOT = REPERTOIRE_BASE / "staticfiles"

# --- CONFIGURATION STOCKAGE (Django 5+) ---
# Remplacement de DEFAULT_FILE_STORAGE et STATICFILES_STORAGE par STORAGES
STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
    },
}

CLOUDINARY_STORAGE = {
    'CLOUDINARY_URL': os.environ.get('CLOUDINARY_URL'),
    'RESOURCE_TYPE_OVERRIDES': {
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'webp': 'image',
        'svg': 'image',
        'mp4': 'video',
        'mov': 'video',
        'webm': 'video',
    }
}
MEDIA_URL = '/media/' 

# --- LOGS DEBUG (Conservés pour vérification finale) ---
print("--- DEBUG CONFIGURATION CLOUDINARY ---")
print(f"Django Version: 5.x detected (Using STORAGES setting)")
print(f"DEBUG Mode: {DEBUG}")
print(f"CLOUDINARY_URL Configured: {bool(os.environ.get('CLOUDINARY_URL'))}")
print(f"MEDIA_URL: {MEDIA_URL}")
print("--- FIN DEBUG CONFIGURATION ---")