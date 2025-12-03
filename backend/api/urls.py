from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PresentationViewSet, PosteCibleViewSet, DiplomeViewSet, 
    CompetenceTechnologiqueViewSet, SectionCompetenceViewSet,
    FormationViewSet, ActiviteProfessionnelleViewSet, ServiceCiviqueViewSet,
    ProjetViewSet
)

router = DefaultRouter()
router.register(r'presentations', PresentationViewSet)
router.register(r'postes', PosteCibleViewSet)
router.register(r'diplomes', DiplomeViewSet)
router.register(r'competences', CompetenceTechnologiqueViewSet)
router.register(r'sections-competences', SectionCompetenceViewSet)
router.register(r'formations', FormationViewSet)
router.register(r'activites-professionnelles', ActiviteProfessionnelleViewSet)
router.register(r'services-civiques', ServiceCiviqueViewSet)
# Route unifiée
router.register(r'projets', ProjetViewSet)

urlpatterns = [
    path('', include(router.urls)),
]