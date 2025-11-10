# backend/api/tests.py

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Projet # Import du modèle 'Projet'

# Note : Les tests relatifs à 'ContactMessage' ont été retirés
# car le modèle a été supprimé dans la migration 0009.

class TestsApi(APITestCase):

    def setUp(self):
        """Configuration initiale pour les tests : crée des projets."""
        Projet.objects.create(titre="Projet Test 1", description="Une description.")
        Projet.objects.create(titre="Projet Test 2", description="Une autre description.")

    def test_obtenir_liste_projets(self):
        """Vérifie que l'API retourne correctement la liste des projets."""
        # Préparation
        url_api = reverse('projet-list') # Utilise le 'basename' défini dans urls.py
        
        # Action
        reponse = self.client.get(url_api, format='json')
        
        # Assertions
        self.assertEqual(reponse.status_code, status.HTTP_200_OK)
        self.assertEqual(len(reponse.data), 2)
        self.assertEqual(reponse.data[0]['titre'], 'Projet Test 1')