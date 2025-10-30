# backend/api/views.py

import zipfile
import io
from pathlib import Path
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    Project,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
)
from .serializers import (
    ProjectSerializer,
    PresentationSerializer,
    PosteCibleSerializer,
    DiplomeSerializer,
    CompetenceTechnologiqueSerializer,
    ParcoursSerializer,
)

class ProjectViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour les projets, avec des actions personnalisées pour le code source."""
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_cache_dir(self, project_id):
        """Crée et retourne le chemin du répertoire de cache pour un projet donné."""
        cache_path = Path(settings.MEDIA_ROOT) / 'zip_cache' / str(project_id)
        cache_path.mkdir(parents=True, exist_ok=True)
        return cache_path

    def extract_zip_if_needed(self, project):
        """Extrait le fichier ZIP du code source dans un répertoire de cache, si nécessaire."""
        cache_dir = self.get_cache_dir(project.id)
        if not any(cache_dir.iterdir()):
            try:
                with zipfile.ZipFile(project.source_code_zip.file, 'r') as zip_ref:
                    zip_ref.extractall(cache_dir)
            except Exception as e:
                raise IOError(f"Échec de l'extraction du fichier zip : {str(e)}")
        return cache_dir

    @action(detail=True, methods=['get'], url_path='source-code-tree')
    def source_code_tree(self, request, pk=None):
        """Action personnalisée pour lister l'arborescence des fichiers du code source."""
        project = self.get_object()
        if not project.source_code_zip:
            return Response({"error": "Aucun fichier zip de code source disponible."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cache_dir = self.extract_zip_if_needed(project)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # --- Construction d'une arborescence (dictionnaire imbriqué) à partir des chemins ---
        root = {}
        for path in sorted(cache_dir.rglob('*')):
            if '.DS_Store' in str(path) :
                continue
            
            parts = path.relative_to(cache_dir).parts
            current_level = root
            for part in parts[:-1]:
                current_level = current_level.setdefault(part, {})
            if path.is_file():
                current_level[parts[-1]] = parts[-1]
        
        def build_tree(d, path_prefix=''):
            """Fonction  pour convertir le dictionnaire en une liste ."""
            result = []
            for k, v in d.items():
                current_path = f"{path_prefix}{k}"
                node = {'name': k, 'path': current_path}
                if isinstance(v, dict):
                    node['type'] = 'directory'
                    node['children'] = build_tree(v, f"{current_path}/")
                else:
                    node['type'] = 'file'
                result.append(node)
            return sorted(result, key=lambda x: (x['type'] == 'file', x['name']))

        tree = build_tree(root)
        return Response(tree)

    @action(detail=True, methods=['get'], url_path='source-code-file')
    def source_code_file(self, request, pk=None):
        """Récupérer le contenu d'un fichier source spécifique."""
        project = self.get_object()
        file_path_str = request.query_params.get('path')

        if not file_path_str:
            return Response({"error": "Le paramètre 'path' du fichier est requis."}, status=status.HTTP_400_BAD_REQUEST)

        if not project.source_code_zip:
            return Response({"error": "Aucun fichier zip de code source disponible."}, status=status.HTTP_404_NOT_FOUND)

        try:
            cache_dir = self.extract_zip_if_needed(project)
        except IOError as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        target_file = cache_dir.joinpath(file_path_str).resolve()
        # Mesure de sécurité pour empêcher l'accès à des fichiers hors du répertoire de cache (Path Traversal).
        if not target_file.is_file() or not str(target_file).startswith(str(cache_dir.resolve())):
            return Response({"error": "Fichier non trouvé ou accès refusé."}, status=status.HTTP_404_NOT_FOUND)
        
        try:
            content = target_file.read_text(encoding='utf-8', errors='ignore')
            return Response({'path': file_path_str, 'content': content})
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