# backend/api/models.py

from django.db import models
from django.core.validators import FileExtensionValidator
import sys
from cloudinary.models import CloudinaryField

# --- MODÈLES CONSERVÉS (POUR L'INTRODUCTION) ---

class CompetenceTechnologique(models.Model):
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
    titre = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    parchemin = CloudinaryField(
        resource_type='image', 
        folder='diplomes',
        null=True,
        blank=True,
        help_text="Lien vers le PDF ou l'image du diplôme."
    )
    def __str__(self):
        return self.titre

# --- NOUVEAUX MODÈLES (CHRONOLOGIE) ---

class BaseEvenement(models.Model):
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True, help_text="Laisser vide si en cours ou ponctuel.")
    class Meta:
        abstract = True
        ordering = ['-date_debut']

class BaseProjet(BaseEvenement):
    titre = models.CharField(max_length=255)
    introduction = models.TextField(verbose_name="Introduction (Description)")
    role = models.CharField(max_length=255, blank=True)
    technologies = models.ManyToManyField(
        'CompetenceTechnologique',
        blank=True,
        related_name="%(class)s_projets",
        help_text="Sélectionnez les technologies utilisées"
    )
    media_video = CloudinaryField(
        resource_type='video', 
        folder='projets_videos', 
        null=True, blank=True, 
        help_text="Vidéo unique de démonstration"
    )
    
    # --- MODIFICATION ---
    # Remplacement du champ d'upload par un champ de lien URL
    url_code_source = models.URLField(
        max_length=500, 
        blank=True, null=True, 
        help_text="Lien vers le dépôt GitHub, GitLab, etc.",
        verbose_name="Lien Code Source"
    )
    # --- FIN MODIFICATION ---
    
    class Meta(BaseEvenement.Meta):
        abstract = True
    def __str__(self):
        return self.titre

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

class ActiviteProfessionnelle(BaseEvenement):
    poste = models.CharField(max_length=255, verbose_name="Poste (Titre du job)")
    class Meta(BaseEvenement.Meta):
        verbose_name = "Activité Professionnelle"
        verbose_name_plural = "Activités Professionnelles"
    def __str__(self):
        return self.poste

class ServiceCivique(BaseEvenement):
    mission = models.CharField(max_length=255, verbose_name="Mission (Titre)")
    organisme_accueil = models.CharField(max_length=255)
    class Meta(BaseEvenement.Meta):
        verbose_name = "Service Civique"
        verbose_name_plural = "Services Civiques"
    def __str__(self):
        return self.mission

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

# --- MODÈLES RELATIONNELS (POUR L'ADMIN INTUITIF) ---

class MissionActivitePro(models.Model):
    activite = models.ForeignKey(ActiviteProfessionnelle, related_name='missions', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, help_text="Un point par ligne. Chaque ligne deviendra une puce.")
    class Meta:
        verbose_name = "Mission (Activité Pro)"
    def __str__(self):
        return self.sous_titre

class MissionServiceCivique(models.Model):
    service = models.ForeignKey(ServiceCivique, related_name='missions', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, help_text="Un point par ligne. Chaque ligne deviendra une puce.")
    class Meta:
        verbose_name = "Mission (Service Civique)"
    def __str__(self):
        return self.sous_titre

class TravailEffectueProjetPro(models.Model):
    projet = models.ForeignKey(ProjetProfessionnel, related_name='travail_effectue', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, help_text="Un point par ligne. Chaque ligne deviendra une puce.")
    class Meta:
        verbose_name = "Travail Effectué (Projet Pro)"
    def __str__(self):
        return self.sous_titre

class TravailEffectueProjetEtu(models.Model):
    projet = models.ForeignKey(ProjetEtudiant, related_name='travail_effectue', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, help_text="Un point par ligne. Chaque ligne deviendra une puce.")
    class Meta:
        verbose_name = "Travail Effectué (Projet Étudiant)"
    def __str__(self):
        return self.sous_titre

class TravailEffectueProjetPerso(models.Model):
    projet = models.ForeignKey(ProjetPersonnel, related_name='travail_effectue', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=255)
    descriptions = models.TextField(blank=True, help_text="Un point par ligne. Chaque ligne deviendra une puce.")
    class Meta:
        verbose_name = "Travail Effectué (Projet Perso)"
    def __str__(self):
        return self.sous_titre