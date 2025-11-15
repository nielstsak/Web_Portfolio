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
    parchemin = CloudinaryField(
        resource_type='image', # Gère PDF et images
        folder='diplomes',
        null=True,
        blank=True,
        help_text="Lien vers le PDF ou l'image du diplôme."
    )
    def __str__(self):
        return self.titre

# --- NOUVEAU MODÈLE UNIFIÉ (Structure Corrigée) ---

class EvenementChronologique(models.Model):
    """
    Modèle unifié remplaçant Projet et Parcours, avec des champs distincts 
    pour une meilleure expérience dans l'interface d'administration.
    """
    
    class TypeEvenement(models.TextChoices):
        ETUDES = 'Etudes', 'Études'
        DIPLOME = 'Diplome', 'Diplôme'
        SERVICE_CIVIQUE = 'Service civique', 'Service civique'
        PROJETS_ETUDIANT = 'Projets Etudiant', 'Projets Étudiant'
        PROJETS_PROFESSIONNELS = 'Projets Professionnels', 'Projets Professionnels'
        PROJETS_PERSONNELS = 'Projets Personnels', 'Projets Personnels'
        ACTIVITE_REMUNERATRICE = 'Activité rémunératrice', 'Activité rémunératrice'

    # --- Champs Communs ---
    titre = models.CharField(max_length=255, verbose_name="Titre")
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True, help_text="Laisser vide si en cours ou ponctuel.")
    type = models.CharField(
        max_length=50,
        choices=TypeEvenement.choices,
        default=TypeEvenement.PROJETS_PROFESSIONNELS
    )
    description = models.TextField(
        verbose_name="Description (Introduction)", 
        blank=True,
        help_text="Utilisé comme introduction pour les projets."
    )

    # --- Champs Spécifiques (tous 'nullable' et gérés par l'admin) ---

    # Types: Etudes, Diplome, Projets Etudiant
    institution = models.CharField(max_length=255, blank=True, null=True, help_text="[Etudes, Diplome, Projets Etudiant]")
    
    # Type: Etudes
    description_formation = models.TextField(blank=True, null=True, help_text="[Etudes]")
    competences_acquises = models.JSONField(default=list, blank=True, help_text="[Etudes] (Liste de textes)")

    # Type: Diplome
    url_parchemin = CloudinaryField(resource_type='image', folder='parchemins_timeline', null=True, blank=True, help_text="[Diplome] (Upload PDF/Image)")

    # Type: Service civique
    organisme_accueil = models.CharField(max_length=255, blank=True, null=True, help_text="[Service civique]")
    missions_principales = models.JSONField(default=list, blank=True, help_text="[Service civique, Activité rémunératrice] (Liste de textes)")

    # Types: Projets (Tous)
    role = models.CharField(max_length=255, blank=True, null=True, help_text="[Projets (Tous)]")
    technologies = models.JSONField(default=list, blank=True, help_text="[Projets (Tous)] (Liste de textes)")
    media_video = CloudinaryField(resource_type='video', folder='projets_videos', null=True, blank=True, help_text="[Projets (Tous)] (Si vidéo)")
    url_code_source = models.URLField(max_length=500, blank=True, null=True, help_text="[Projets (Tous)] (Lien GitHub, etc.)")
    travaux_details = models.JSONField(default=list, blank=True, help_text="[Projets (Tous)] (Liste d'objets: [{'sous_titre': '...', 'description': '...'}])")

    # Type: Activité rémunératrice
    poste = models.CharField(max_length=255, blank=True, null=True, help_text="[Activité rémunératrice]")

    class Meta:
        verbose_name = "Événement Chronologique"
        verbose_name_plural = "Événements Chronologiques"
        ordering = ['-date_debut']

    def __str__(self):
        return f"[{self.get_type_display()}] {self.titre} ({self.date_debut})"

class MediaProjet(models.Model):
    """
    Modèle séparé pour gérer les galeries d'images (carrousel) 
    pour les événements de type Projet.
    """
    evenement = models.ForeignKey(
        EvenementChronologique, 
        related_name='media_photos', 
        on_delete=models.CASCADE,
        limit_choices_to={'type__in': [
            EvenementChronologique.TypeEvenement.PROJETS_ETUDIANT,
            EvenementChronologique.TypeEvenement.PROJETS_PROFESSIONNELS,
            EvenementChronologique.TypeEvenement.PROJETS_PERSONNELS,
        ]}
    )
    image = CloudinaryField(resource_type='image', folder='projets_photos')
    legende = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        verbose_name = "Média (Photo Projet)"
        verbose_name_plural = "Médias (Photos Projet)"

    def __str__(self):
        return f"Photo pour {self.evenement.titre}"