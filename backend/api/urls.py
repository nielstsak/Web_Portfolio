from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PresentationViewSet, 
    PosteCibleViewSet, 
    DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, SectionCompetenceViewSet,
    FormationViewSet,
    ActiviteProfessionnelleViewSet,
    ServiceCiviqueViewSet,
    ProjetProfessionnelViewSet,
    ProjetEtudiantViewSet,
    ProjetPersonnelViewSet,
)

router = DefaultRouter()

router.register(r'presentations', PresentationViewSet, basename='presentation')
router.register(r'postes', PosteCibleViewSet, basename='poste')
router.register(r'diplomes', DiplomeViewSet, basename='diplome')
router.register(r'competences', CompetenceTechnologiqueViewSet, basename='competence')
router.register(r'sections-competences', SectionCompetenceViewSet, basename='section-competence')

router.register(r'formations', FormationViewSet, basename='formation')
router.register(r'activites-professionnelles', ActiviteProfessionnelleViewSet, basename='activite')
router.register(r'services-civiques', ServiceCiviqueViewSet, basename='service')
router.register(r'projets-professionnels', ProjetProfessionnelViewSet, basename='projet-pro')
router.register(r'projets-etudiants', ProjetEtudiantViewSet, basename='projet-etu')
router.register(r'projets-personnels', ProjetPersonnelViewSet, basename='projet-perso')

urlpatterns = [
    path('', include(router.urls)),
]