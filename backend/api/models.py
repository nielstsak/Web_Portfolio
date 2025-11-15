# backend/api/models.py

from django.db import models
from django.core.validators import FileExtensionValidator
import sys
from cloudinary.models import CloudinaryField

# --- MODÈLES CONSERVÉS (POUR L'INTRODUCTION) ---

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

# --- NOUVEAUX MODÈLES (CHRONOLOGIE) ---

# --- Classes de Base Abstraites ---

class BaseEvenement(models.Model):
    """Modèle abstrait pour les champs de date communs."""
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True, help_text="Laisser vide si en cours ou ponctuel.")

    class Meta:
        abstract = True
        ordering = ['-date_debut']

class BaseProjet(BaseEvenement):
    """Modèle abstrait pour les champs communs aux trois types de projets."""
    titre = models.CharField(max_length=255)
    introduction = models.TextField(verbose_name="Introduction (Description)")
    role = models.CharField(max_length=255, blank=True)
    technologies = models.JSONField(default=list, blank=True, help_text="Liste de textes")
    media_video = CloudinaryField(
        resource_type='video', 
        folder='projets_videos', 
        null=True, blank=True, 
        help_text="Vidéo unique de démonstration"
    )
    code_source_zip = models.FileField(
        upload_to='project_sources/', 
        null=True, blank=True, 
        help_text="Archive ZIP du code source."
    )
    travail_effectue = models.JSONField(
        default=list, blank=True, 
        help_text="Liste d'objets: [{'sous_titre': '...', 'description': '...'}]"
    )

    class Meta(BaseEvenement.Meta):
        abstract = True

    def __str__(self):
        return self.titre

# --- Modèles Concrets ---

# 1. Formation
class Formation(BaseEvenement):
    titre = models.CharField(max_length=255, verbose_name="Titre (Formation/Diplôme)")
    institution = models.CharField(max_length=255, verbose_name="Institution (École, Organisme)")
    description = models.TextField(verbose_name="Description (Cursus)", blank=True)
    justificatif = CloudinaryField(
        resource_type='image', 
        folder='justificatifs_formation', 
        null=True, blank=True,
        help_text="Upload PDF/Image"
    )
    
    class Meta(BaseEvenement.Meta):
        verbose_name = "Formation / Diplôme"
        verbose_name_plural = "Formations / Diplômes"
        
    def __str__(self):
        return self.titre

# 2. Activité Professionnelle
class ActiviteProfessionnelle(BaseEvenement):
    poste = models.CharField(max_length=255, verbose_name="Poste (Titre du job)")
    missions = models.JSONField(
        default=list, blank=True, 
        help_text="Liste d'objets: [{'sous_titre': '...', 'description': '...'}]"
    )
    
    class Meta(BaseEvenement.Meta):
        verbose_name = "Activité Professionnelle"
        verbose_name_plural = "Activités Professionnelles"
        
    def __str__(self):
        return self.poste

# 3. Service Civique
class ServiceCivique(BaseEvenement):
    mission = models.CharField(max_length=255, verbose_name="Mission (Titre)")
    organisme_accueil = models.CharField(max_length=255)
    missions = models.JSONField(
        default=list, blank=True, 
        help_text="Liste d'objets: [{'sous_titre': '...', 'description': '...'}]"
    )
    
    class Meta(BaseEvenement.Meta):
        verbose_name = "Service Civique"
        verbose_name_plural = "Services Civiques"
        
    def __str__(self):
        return self.mission

# 4. Projet Professionnel
class ProjetProfessionnel(BaseProjet):
    class Meta(BaseProjet.Meta):
        verbose_name = "Projet Professionnel"
        verbose_name_plural = "Projets Professionnels"

class MediaProjetProfessionnel(models.Model):
    projet = models.ForeignKey(ProjetProfessionnel, related_name='media_photos', on_delete=models.CASCADE)
    image = CloudinaryField(resource_type='image', folder='projets_photos_pro')
    legende = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = "Média (Photo Projet Pro)"
        
    def __str__(self):
        return f"Photo pour {self.projet.titre}"

# 5. Projet Étudiant
class ProjetEtudiant(BaseProjet):
    institution = models.CharField(max_length=255, verbose_name="Institution (Cadre scolaire)", blank=True)
    
    class Meta(BaseProjet.Meta):
        verbose_name = "Projet Étudiant"
        verbose_name_plural = "Projets Étudiants"

class MediaProjetEtudiant(models.Model):
    projet = models.ForeignKey(ProjetEtudiant, related_name='media_photos', on_delete=models.CASCADE)
    image = CloudinaryField(resource_type='image', folder='projets_photos_etudiant')
    legende = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = "Média (Photo Projet Étudiant)"
        
    def __str__(self):
        return f"Photo pour {self.projet.titre}"

# 6. Projet Personnel
class ProjetPersonnel(BaseProjet):
    class Meta(BaseProjet.Meta):
        verbose_name = "Projet Personnel"
        verbose_name_plural = "Projets Personnels"

class MediaProjetPersonnel(models.Model):
    projet = models.ForeignKey(ProjetPersonnel, related_name='media_photos', on_delete=models.CASCADE)
    image = CloudinaryField(resource_type='image', folder='projets_photos_perso')
    legende = models.CharField(max_length=255, blank=True)
    
    class Meta:
        verbose_name = "Média (Photo Projet Perso)"
        
    def __str__(self):
        return f"Photo pour {self.projet.titre}"