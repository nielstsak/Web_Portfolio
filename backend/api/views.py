# backend/api/views.py

import zipfile
import io
from pathlib import Path
from django.conf import settings
from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import (
    # NOUVEAU
    EvenementChronologique,
    
    # CONSERVÉS
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,

    # SUPPRIMÉS (retirés des imports)
    # Projet,
    # Parcours,
)
from .serializers import (
    # NOUVEAU
    EvenementChronologiqueSerializer,

    # CONSERVÉS
    PresentationSerializer,
    PosteCibleSerializer,
    DiplomeSerializer,
    CompetenceTechnologiqueSerializer,

    # SUPPRIMÉS (retirés des imports)
    # ProjetSerializer,
    # ParcoursSerializer,
)

# --- NOUVEAU VIEWSET ---

class EvenementChronologiqueViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour le nouveau modèle EvenementChronologique."""
    queryset = EvenementChronologique.objects.all().order_by('-date_debut')
    serializer_class = EvenementChronologiqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    
    # NOTE : Les actions personnalisées pour le code source ('source-code-tree', 'source-code-file')
    # ont été retirées car elles dépendaient de l'ancien modèle 'Projet'.
    # Si cette fonctionnalité doit être reportée, elle doit être réimplémentée
    # en utilisant le champ 'specificites' du nouveau modèle.

# --- VIEWSETS CONSERVÉS ---

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

# --- VIEWSETS SUPPRIMÉS (retirés) ---
# class ProjetViewSet(viewsets.ReadOnlyModelViewSet): ...
# class ParcoursViewSet(viewsets.ReadOnlyModelViewSet): ...