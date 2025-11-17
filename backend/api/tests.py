# backend/api/tests.py
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import ProjetProfessionnel # <-- CORRIGÉ

class TestsApi(APITestCase):

    def setUp(self):
        """Configuration initiale pour les tests : crée des projets."""
        ProjetProfessionnel.objects.create(titre="Projet Test 1", introduction="Une description.") # <-- CORRIGÉ
        ProjetProfessionnel.objects.create(titre="Projet Test 2", introduction="Une autre description.") # <-- CORRIGÉ

    def test_obtenir_liste_projets(self):
        """Vérifie que l'API retourne correctement la liste des projets."""
        # Préparation
        url_api = reverse('projet-pro-list') # <-- CORRIGÉ (basename 'projet-pro' de urls.py)
        
        # Action
        reponse = self.client.get(url_api, format='json')
        
        # Assertions
        self.assertEqual(reponse.status_code, status.HTTP_200_OK)
        self.assertEqual(len(reponse.data), 2)
        self.assertEqual(reponse.data[0]['titre'], 'Projet Test 1')