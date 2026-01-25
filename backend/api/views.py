# [Symbole Commentaire] FICHIER : backend/api/views.py

from rest_framework import viewsets, permissions
from django_filters.rest_framework import DjangoFilterBackend
from .models import (
    Presentation, PosteCible, Diplome, CompetenceTechnologique, SectionCompetence,
    Formation, ActiviteProfessionnelle, ServiceCivique, Projet
)
from .serializers import (
    PresentationSerializer, PosteCibleSerializer, DiplomeSerializer,
    CompetenceTechnologiqueSerializer, SectionCompetenceSerializer,
    FormationSerializer, ActiviteProfessionnelleSerializer, ServiceCiviqueSerializer,
    ProjetSerializer
)

class BaseReadOnlyViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet abstrait pour l'accès en lecture seule (GET).
    Autorise l'accès public, mais restreint les modifications aux utilisateurs authentifiés (Admin).
    Intègre par défaut le backend de filtrage Django.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend]

class PresentationViewSet(BaseReadOnlyViewSet):
    queryset = Presentation.objects.prefetch_related('details').all()
    serializer_class = PresentationSerializer

class PosteCibleViewSet(BaseReadOnlyViewSet):
    queryset = PosteCible.objects.all()
    serializer_class = PosteCibleSerializer

class DiplomeViewSet(BaseReadOnlyViewSet):
    queryset = Diplome.objects.all()
    serializer_class = DiplomeSerializer

class CompetenceTechnologiqueViewSet(BaseReadOnlyViewSet):
    queryset = CompetenceTechnologique.objects.all()
    serializer_class = CompetenceTechnologiqueSerializer

class SectionCompetenceViewSet(BaseReadOnlyViewSet):
    queryset = SectionCompetence.objects.prefetch_related('competences').all()
    serializer_class = SectionCompetenceSerializer

class FormationViewSet(BaseReadOnlyViewSet):
    queryset = Formation.objects.prefetch_related('details').all()
    serializer_class = FormationSerializer

class ActiviteProfessionnelleViewSet(BaseReadOnlyViewSet):
    queryset = ActiviteProfessionnelle.objects.prefetch_related('details').all()
    serializer_class = ActiviteProfessionnelleSerializer
    filterset_fields = ['type_contrat']

class ServiceCiviqueViewSet(BaseReadOnlyViewSet):
    queryset = ServiceCivique.objects.prefetch_related('details').all()
    serializer_class = ServiceCiviqueSerializer

class ProjetViewSet(BaseReadOnlyViewSet):
    queryset = Projet.objects.prefetch_related('details', 'media_photos', 'technologies').all()
    serializer_class = ProjetSerializer
    filterset_fields = ['categorie']