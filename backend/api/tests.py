from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from .models import Project, ContactMessage

class ApiTests(APITestCase):

    def setUp(self):
        Project.objects.create(title="Test Project 1", description="A description.")
        Project.objects.create(title="Test Project 2", description="Another description.")

    def test_get_project_list(self):
        url = reverse('project-list')
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['title'], 'Test Project 1')

    def test_create_contact_message(self):
        url = reverse('contact-list')
        data = {
            'name': 'Test User',
            'email': 'test@example.com',
            'message': 'This is a test message.'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(ContactMessage.objects.count(), 1)
        self.assertEqual(ContactMessage.objects.get().name, 'Test User')

    def test_create_contact_message_invalid_data(self):
        url = reverse('contact-list')
        data = {
            'name': 'Test User',
            'email': 'not-an-email',
            'message': ''
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', response.data)
        self.assertIn('message', response.data)
