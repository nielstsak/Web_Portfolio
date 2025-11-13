# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjetViewSet, 
    PresentationViewSet, 
    PosteCibleViewSet, 
    DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, 
    ParcoursViewSet,
)

# Crée un routeur pour générer automatiquement les routes de l'API
router = DefaultRouter()
router.register(r'projets', ProjetViewSet, basename='projet') # 'projet' est le nom de base
router.register(r'presentations', PresentationViewSet, basename='presentation')
router.register(r'postes', PosteCibleViewSet, basename='poste')
router.register(r'diplomes', DiplomeViewSet, basename='diplome')
router.register(r'competences', CompetenceTechnologiqueViewSet, basename='competence')
router.register(r'parcours', ParcoursViewSet, basename='parcours')

# Définit les URLs principales de l'API
urlpatterns = [
    path('', include(router.urls)),
]