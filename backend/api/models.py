# backend/api/models.py

from django.db import models
from django.core.validators import FileExtensionValidator
import sys
from cloudinary.models import CloudinaryField

# --- MODÈLES CONSERVÉS ---

class CompetenceTechnologique(models.Model):
    """Représente une compétence technologique (ex: Python, React) avec son logo."""
    nom = models.CharField(max_length=100)
    logo = CloudinaryField(
        resource_type='image',
        folder='competences_logos',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'svg'])]
    )

    class Meta:
        verbose_name = "Compétence Technologique"
        verbose_name_plural = "Compétences Technologiques"

    def __str__(self):
        return self.nom

class Presentation(models.Model):
    """Contient les informations générales de présentation (bio, photo, contact)."""
    texte = models.TextField()
    nom = models.CharField(max_length=100, default="John")
    prenom = models.CharField(max_length=100, default="Doe")
    email = models.EmailField(default="john.doe@example.com")
    photo = CloudinaryField(
        resource_type='image',
        folder='photos',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])]
    )

    class Meta:
        verbose_name = "Texte de Présentation"
        verbose_name_plural = "Texte de Présentation"

    def __str__(self):
        return "Texte de présentation du projet professionnel"

class PosteCible(models.Model):
    nom = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Poste Ciblé"
        verbose_name_plural = "Postes Ciblés"

    def __str__(self):
        return self.nom

class Diplome(models.Model):
    """Modèle conservé pour les diplômes (utilisé dans la section Introduction)."""
    titre = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    # Champ ajouté pour le lien vers le justificatif
    parchemin = CloudinaryField(
        resource_type='image', # Cloudinary gère 'image' et 'raw' (pdf)
        folder='diplomes',
        null=True,
        blank=True,
        help_text="Lien vers le PDF ou l'image du diplôme."
    )

    def __str__(self):
        return self.titre

# --- NOUVEAU MODÈLE ---

class EvenementChronologique(models.Model):
    """
    Modèle unifié remplaçant Projet et Parcours.
    Capture toutes les expériences (pro, perso, études) dans une timeline.
    """
    
    # Définition des types d'événements
    class TypeEvenement(models.TextChoices):
        ETUDES = 'Etudes', 'Études'
        DIPLOME = 'Diplome', 'Diplôme' # Lié à l'obtention, différent du modèle Diplome
        SERVICE_CIVIQUE = 'Service civique', 'Service civique'
        PROJETS_ETUDIANT = 'Projets Etudiant', 'Projets Étudiant'
        PROJETS_PROFESSIONNELS = 'Projets Professionnels', 'Projets Professionnels'
        PROJETS_PERSONNELS = 'Projets Personnels', 'Projets Personnels' # Type ajouté
        ACTIVITE_REMUNERATRICE = 'Activité rémunératrice', 'Activité rémunératrice'

    # Champs communs
    titre = models.CharField(max_length=255, verbose_name="Titre")
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True, help_text="Laisser vide si en cours ou ponctuel.")
    type = models.CharField(
        max_length=50,
        choices=TypeEvenement.choices,
        default=TypeEvenement.PROJETS_PROFESSIONNELS
    )
    
    # Description/Introduction (principalement pour les Projets)
    description = models.TextField(
        verbose_name="Description (Introduction)", 
        blank=True,
        help_text="Utilisé comme introduction pour les projets."
    )
    
    # Données spécifiques à chaque type
    specificites = models.JSONField(
        default=dict,
        blank=True,
        help_text="Données variables selon le type (voir documentation de la structure)"
    )

    class Meta:
        verbose_name = "Événement Chronologique"
        verbose_name_plural = "Événements Chronologiques"
        ordering = ['-date_debut'] # Tri par défaut (plus récent en premier)

    def __str__(self):
        return f"[{self.get_type_display()}] {self.titre} ({self.date_debut})"

# --- MODÈLES SUPPRIMÉS (retirés) ---
# Projet
# TravailEffectue
# Parcours