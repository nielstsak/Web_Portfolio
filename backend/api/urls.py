# backend/api/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ProjectViewSet, 
    PresentationViewSet, 
    PosteCibleViewSet, 
    DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, 
    ParcoursViewSet,
)

# Génération des URLs  pour chaque ViewSet.
router = DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'presentations', PresentationViewSet, basename='presentation')
router.register(r'postes', PosteCibleViewSet, basename='poste')
router.register(r'diplomes', DiplomeViewSet, basename='diplome')
router.register(r'competences', CompetenceTechnologiqueViewSet, basename='competence')
router.register(r'parcours', ParcoursViewSet, basename='parcours')

# URL principale de l'API 
urlpatterns = [
    path('', include(router.urls)),
]