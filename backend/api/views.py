# backend/api/views.py

import zipfile
import io
from pathlib import Path
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Projet,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
)
from .serializers import (
    ProjetSerializer,
    PresentationSerializer,
    PosteCibleSerializer,
    DiplomeSerializer,
    CompetenceTechnologiqueSerializer,
    ParcoursSerializer,
)

class ProjetViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les projets, avec des actions personnalisées pour le code source."""
    queryset = Projet.objects.all()
    serializer_class = ProjetSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly] # Lecture seule pour les non-authentifiés

    def obtenir_repertoire_cache(self, id_projet):
        """Crée et retourne le chemin du répertoire de cache pour un projet donné."""
        chemin_cache = Path(settings.MEDIA_ROOT) / 'zip_cache' / str(id_projet)
        chemin_cache.mkdir(parents=True, exist_ok=True) # Crée le dossier s'il n'existe pas
        return chemin_cache

    def extraire_zip_si_necessaire(self, projet):
        """Extrait le fichier ZIP du code source dans un répertoire de cache, si nécessaire."""
        repertoire_cache = self.obtenir_repertoire_cache(projet.id)
        
        # N'extrait que si le dossier de cache est vide
        if not any(repertoire_cache.iterdir()):
            try:
                with zipfile.ZipFile(projet.zip_code_source.file, 'r') as fichier_zip:
                    fichier_zip.extractall(repertoire_cache)
            except Exception as e:
                raise IOError(f"Échec de l'extraction du fichier zip : {str(e)}")
        return repertoire_cache

    @action(detail=True, methods=['get'], url_path='source-code-tree')
    def arborescence_code_source(self, requete, pk=None):
        """Action personnalisée pour lister l'arborescence des fichiers du code source."""
        projet = self.get_object()
        if not projet.zip_code_source:
            return Response({"error": "Aucun fichier zip de code source disponible."}, status=status.HTTP_404_NOT_FOUND)

        try:
            repertoire_cache = self.extraire_zip_si_necessaire(projet)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # --- Construction de l'arborescence (dictionnaire imbriqué) ---
        racine = {}
        for chemin in sorted(repertoire_cache.rglob('*')):
            if '.DS_Store' in str(chemin) : # Ignore les fichiers système
                continue
            
            segments = chemin.relative_to(repertoire_cache).parts
            niveau_actuel = racine
            for segment in segments[:-1]:
                niveau_actuel = niveau_actuel.setdefault(segment, {})
            if chemin.is_file():
                niveau_actuel[segments[-1]] = segments[-1]
        
        def construire_arborescence(d, prefixe_chemin=''):
            """Fonction récursive pour formater l'arborescence en liste."""
            resultat = []
            for cle, valeur in d.items():
                chemin_actuel = f"{prefixe_chemin}{cle}"
                noeud = {'name': cle, 'path': chemin_actuel}
                if isinstance(valeur, dict): # Dossier
                    noeud['type'] = 'directory'
                    noeud['children'] = construire_arborescence(valeur, f"{chemin_actuel}/")
                else: # Fichier
                    noeud['type'] = 'file'
                resultat.append(noeud)
            # Trie pour afficher les dossiers avant les fichiers
            return sorted(resultat, key=lambda x: (x['type'] == 'file', x['name']))

        arborescence = construire_arborescence(racine)
        return Response(arborescence)

    @action(detail=True, methods=['get'], url_path='source-code-file')
    def fichier_code_source(self, requete, pk=None):
        """Récupérer le contenu d'un fichier source spécifique."""
        projet = self.get_object()
        chemin_fichier_str = requete.query_params.get('path')

        if not chemin_fichier_str:
            return Response({"error": "Le paramètre 'path' du fichier est requis."}, status=status.HTTP_400_BAD_REQUEST)

        if not projet.zip_code_source:
            return Response({"error": "Aucun fichier zip de code source disponible."}, status=status.HTTP_404_NOT_FOUND)

        try:
            repertoire_cache = self.extraire_zip_si_necessaire(projet)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        fichier_cible = repertoire_cache.joinpath(chemin_fichier_str).resolve()
        
        # Sécurité : empêche l'accès à des fichiers hors du répertoire de cache (Path Traversal)
        if not fichier_cible.is_file() or not str(fichier_cible).startswith(str(repertoire_cache.resolve())):
            return Response({"error": "Fichier non trouvé ou accès refusé."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            contenu = fichier_cible.read_text(encoding='utf-8', errors='ignore')
            return Response({'path': chemin_fichier_str, 'content': contenu})
        except Exception as e:
            return Response({"error": f"Échec de la lecture du fichier : {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# --- ViewSets standards en lecture seule ---

class PresentationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets Presentation."""
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PosteCibleViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets PosteCible."""
    queryset = PosteCible.objects.all()
    serializer_class = PosteCibleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DiplomeViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets Diplome."""
    queryset = Diplome.objects.all()
    serializer_class = DiplomeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CompetenceTechnologiqueViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets CompetenceTechnologique."""
    queryset = CompetenceTechnologique.objects.all()
    serializer_class = CompetenceTechnologiqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ParcoursViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets Parcours."""
    queryset = Parcours.objects.all()
    serializer_class = ParcoursSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]