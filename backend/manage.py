#!/usr/bin/env python

"""Utilitaire de ligne de commande Django pour les tâches d'administration."""
import os
import sys


def main():
    """Exécute les tâches d'administration."""
    # Lie l'exécution au fichier de configuration de Django
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
    try:
        from django.core.management import execute_from_command_line
    except ImportError as erreur_import:
        # Fournit un message d'erreur clair si Django n'est pas installé ou accessible
        raise ImportError(
            "Impossible d'importer Django. Êtes-vous sûr qu'il est installé et "
            "disponible sur votre variable d'environnement PYTHONPATH ? Avez-vous "
            "oublié d'activer un environnement virtuel ?"
        ) from erreur_import
    
    # Exécute la commande passée en argument (ex: "runserver", "migrate")
    execute_from_command_line(sys.argv)


if __name__ == "__main__":
    main()