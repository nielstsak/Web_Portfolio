from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import ProjetProfessionnel, DetailEvenement, ActiviteProfessionnelle

class TestsArchitectureApi(APITestCase):
    """Tests validant l'architecture des modèles et les réponses API."""

    def setUp(self):
        """Configuration initiale des données de test."""
        
        # Création d'un projet professionnel
        self.projet_pro = ProjetProfessionnel.objects.create(
            titre="Projet Test Generic",
            introduction="Une description de test.",
            date_debut="2024-01-01"
        )
        
        # Ajout d'un détail via la relation générique
        self.detail_projet = DetailEvenement.objects.create(
            content_object=self.projet_pro,
            sous_titre="Phase de conception",
            descriptions="- Analyse des besoins\n- Maquettage"
        )

        # Création d'une activité pro
        self.activite = ActiviteProfessionnelle.objects.create(
            poste="Développeur Fullstack",
            date_debut="2023-01-01"
        )

        # Ajout d'un détail à l'activité (polymorphisme)
        self.detail_activite = DetailEvenement.objects.create(
            content_object=self.activite,
            sous_titre="Responsabilités",
            descriptions="- Développement backend\n- Tests unitaires"
        )

    def test_generic_relations_models(self):
        """Vérifie que les relations génériques fonctionnent au niveau ORM."""
        self.assertEqual(self.projet_pro.details.count(), 1)
        self.assertEqual(self.projet_pro.details.first().sous_titre, "Phase de conception")
        
        self.assertEqual(self.activite.details.count(), 1)
        self.assertEqual(self.activite.details.first().sous_titre, "Responsabilités")

    def test_api_projet_structure(self):
        """Vérifie que l'API Projet expose correctement les détails imbriqués."""
        url = reverse('projet-pro-list')
        reponse = self.client.get(url, format='json')
        
        self.assertEqual(reponse.status_code, status.HTTP_200_OK)
        data = reponse.data
        
        # Vérifie qu'on a bien un projet
        self.assertTrue(len(data) > 0)
        projet_data = data[0]
        
        # Vérifie le champ 'travail_effectue' (mappé sur 'details')
        self.assertIn('travail_effectue', projet_data)
        self.assertEqual(len(projet_data['travail_effectue']), 1)
        
        detail = projet_data['travail_effectue'][0]
        self.assertEqual(detail['sous_titre'], "Phase de conception")
        
        # Vérifie la transformation du texte en liste (fait par le Serializer)
        self.assertIsInstance(detail['descriptions'], list)
        self.assertEqual(len(detail['descriptions']), 2)
        self.assertEqual(detail['descriptions'][0], "- Analyse des besoins")

    def test_api_activite_structure(self):
        """Vérifie que l'API Activité expose correctement les missions."""
        url = reverse('activite-list')
        reponse = self.client.get(url, format='json')
        
        self.assertEqual(reponse.status_code, status.HTTP_200_OK)
        activite_data = reponse.data[0]
        
        self.assertIn('missions', activite_data)
        self.assertEqual(len(activite_data['missions']), 1)
        self.assertEqual(activite_data['missions'][0]['sous_titre'], "Responsabilités")