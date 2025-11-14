# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    # NOUVEAU
    EvenementChronologiqueViewSet,
    
    # CONSERVÉS
    PresentationViewSet, 
    PosteCibleViewSet, 
    DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, 

    # SUPPRIMÉS (retirés des imports)
    # ProjetViewSet, 
    # ParcoursViewSet,
)

# Crée un routeur pour générer automatiquement les routes de l'API
router = DefaultRouter()

# NOUVEAU routeur
router.register(r'evenements-chronologiques', EvenementChronologiqueViewSet, basename='evenement')

# Routeurs CONSERVÉS
router.register(r'presentations', PresentationViewSet, basename='presentation')
router.register(r'postes', PosteCibleViewSet, basename='poste')
router.register(r'diplomes', DiplomeViewSet, basename='diplome')
router.register(r'competences', CompetenceTechnologiqueViewSet, basename='competence')

# SUPPRIMÉS (retirés)
# router.register(r'projets', ProjetViewSet, basename='projet')
# router.register(r'parcours', ParcoursViewSet, basename='parcours')

# Définit les URLs principales de l'API
urlpatterns = [
    path('', include(router.urls)),
]