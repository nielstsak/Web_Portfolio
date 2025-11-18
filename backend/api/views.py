from django.conf import settings
from rest_framework import viewsets, permissions
from .models import (
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique, SectionCompetence,
    Formation,
    ActiviteProfessionnelle,
    ServiceCivique,
    ProjetProfessionnel,
    ProjetEtudiant,
    ProjetPersonnel,
)
from .serializers import (
    PresentationSerializer,
    PosteCibleSerializer,
    DiplomeSerializer,
    CompetenceTechnologiqueSerializer, SectionCompetenceSerializer,
    FormationSerializer,
    ActiviteProfessionnelleSerializer,
    ServiceCiviqueSerializer,
    ProjetProfessionnelSerializer,
    ProjetEtudiantSerializer,
    ProjetPersonnelSerializer,
)

class PresentationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Presentation.objects.all()
    serializer_class = PresentationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class PosteCibleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = PosteCible.objects.all()
    serializer_class = PosteCibleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class DiplomeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Diplome.objects.all()
    serializer_class = DiplomeSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class CompetenceTechnologiqueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = CompetenceTechnologique.objects.all()
    serializer_class = CompetenceTechnologiqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class SectionCompetenceViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SectionCompetence.objects.all()
    serializer_class = SectionCompetenceSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class FormationViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Formation.objects.all()
    serializer_class = FormationSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ActiviteProfessionnelleViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActiviteProfessionnelle.objects.all()
    serializer_class = ActiviteProfessionnelleSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ServiceCiviqueViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ServiceCivique.objects.all()
    serializer_class = ServiceCiviqueSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetProfessionnelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjetProfessionnel.objects.all()
    serializer_class = ProjetProfessionnelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetEtudiantViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjetEtudiant.objects.all()
    serializer_class = ProjetEtudiantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

class ProjetPersonnelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ProjetPersonnel.objects.all()
    serializer_class = ProjetPersonnelSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]