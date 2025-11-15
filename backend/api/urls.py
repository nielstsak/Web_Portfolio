# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # CONSERVÉS
    PresentationViewSet, 
    PosteCibleViewSet, 
    DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, 

    # NOUVEAUX VIEWSETS
    FormationViewSet,
    ActiviteProfessionnelleViewSet,
    ServiceCiviqueViewSet,
    ProjetProfessionnelViewSet,
    ProjetEtudiantViewSet,
    ProjetPersonnelViewSet,
)

# Crée un routeur pour générer automatiquement les routes de l'API
router = DefaultRouter()

# Routeurs CONSERVÉS (Introduction)
router.register(r'presentations', PresentationViewSet, basename='presentation')
router.register(r'postes', PosteCibleViewSet, basename='poste')
router.register(r'diplomes', DiplomeViewSet, basename='diplome')
router.register(r'competences', CompetenceTechnologiqueViewSet, basename='competence')

# NOUVEAUX Routeurs (Chronologie)
router.register(r'formations', FormationViewSet, basename='formation')
router.register(r'activites-professionnelles', ActiviteProfessionnelleViewSet, basename='activite')
router.register(r'services-civiques', ServiceCiviqueViewSet, basename='service')
router.register(r'projets-professionnels', ProjetProfessionnelViewSet, basename='projet-pro')
router.register(r'projets-etudiants', ProjetEtudiantViewSet, basename='projet-etu')
router.register(r'projets-personnels', ProjetPersonnelViewSet, basename='projet-perso')


# Définit les URLs principales de l'API
urlpatterns = [
    path('', include(router.urls)),
]