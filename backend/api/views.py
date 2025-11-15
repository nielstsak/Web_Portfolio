# backend/api/views.py

from django.conf import settings
from rest_framework import viewsets, permissions
from .models import (
    # CONSERVÉS
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,

    # NOUVEAUX MODÈLES
    Formation,
    ActiviteProfessionnelle,
    ServiceCivique,
    ProjetProfessionnel,
    ProjetEtudiant,
    ProjetPersonnel,
)
from .serializers import (
    # CONSERVÉS
    PresentationSerializer,
    PosteCibleSerializer,
    DiplomeSerializer,
    CompetenceTechnologiqueSerializer,

    # NOUVEAUX SÉRIALISEURS
    FormationSerializer,
    ActiviteProfessionnelleSerializer,
    ServiceCiviqueSerializer,
    ProjetProfessionnelSerializer,
    ProjetEtudiantSerializer,
    ProjetPersonnelSerializer,
)

# --- VIEWSETS CONSERVÉS (INTRODUCTION) ---

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
    """ViewSet pour l'accès en lecture seule aux objets Diplome (Introduction)."""
    queryset = Diplome.objects.all()
    serializer_class = DiplomeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CompetenceTechnologiqueViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet pour l'accès en lecture seule aux objets CompetenceTechnologique."""
    queryset = CompetenceTechnologique.objects.all()
    serializer_class = CompetenceTechnologiqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


# --- NOUVEAUX VIEWSETS (CHRONOLOGIE) ---

class FormationViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les formations."""
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ActiviteProfessionnelleViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les activités professionnelles."""
    queryset = ActiviteProfessionnelle.objects.all()
    serializer_class = ActiviteProfessionnelleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceCiviqueViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les services civiques."""
    queryset = ServiceCivique.objects.all()
    serializer_class = ServiceCiviqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetProfessionnelViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les projets professionnels."""
    queryset = ProjetProfessionnel.objects.all()
    serializer_class = ProjetProfessionnelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetEtudiantViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les projets étudiants."""
    queryset = ProjetEtudiant.objects.all()
    serializer_class = ProjetEtudiantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetPersonnelViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint pour les projets personnels."""
    queryset = ProjetPersonnel.objects.all()
    serializer_class = ProjetPersonnelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]