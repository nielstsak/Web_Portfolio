# backend/core/asgi.py

"""
Configuration ASGI (Asynchronous Server Gateway Interface) pour le projet.

Point d'entrée standard pour les serveurs web asynchrones 
(comme Daphne ou Uvicorn) qui exécutent l'application Django.
"""

import os

from django.core.asgi import get_asgi_application

# Lie l'application au fichier de configuration principal
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

# 'application' est le callable que le serveur ASGI utilisera.
application = get_asgi_application()