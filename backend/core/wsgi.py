# backend/core/wsgi.py

"""
Configuration WSGI (Web Server Gateway Interface) pour le projet.

Ce fichier expose le point d'entrée 'application' que les serveurs web
synchrones (comme Gunicorn) utilisent pour communiquer avec l'application Django.
"""

import os

from django.core.wsgi import get_wsgi_application

# Définit le fichier de configuration par défaut pour l'application
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# 'application' est le callable standard que le serveur WSGI recherche.
application = get_wsgi_application()