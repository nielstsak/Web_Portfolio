from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from cloudinary.models import CloudinaryField

# --- Modèles Transverses ---

class SectionCompetence(models.Model):
    titre = models.CharField(max_length=100, verbose_name="Titre de la section")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")

    class Meta:
        verbose_name = "Section de Compétences"
        verbose_name_plural = "Sections de Compétences"
        ordering = ['ordre']

    def __str__(self):
        return self.titre

class CompetenceTechnologique(models.Model):
    nom = models.CharField(max_length=100)
    section = models.ForeignKey(
        SectionCompetence, 
        related_name='competences', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True
    )
    logo = CloudinaryField('image', folder='competences_logos', null=True, blank=True)

    class Meta:
        verbose_name = "Compétence Technologique"
        verbose_name_plural = "Compétences Technologiques"

    def __str__(self):
        return self.nom

class DetailEvenement(models.Model):
    """Modèle générique pour les listes à puces (missions, tâches)."""
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    sous_titre = models.CharField(max_length=255, verbose_name="Sous-titre / Intitulé")
    descriptions = models.TextField(
        blank=True, 
        help_text="Un point par ligne."
    )
    ordre = models.IntegerField(default=0)

    class Meta:
        verbose_name = "Détail / Mission"
        verbose_name_plural = "Détails & Missions"
        ordering = ['ordre']

    def __str__(self):
        return self.sous_titre

class Presentation(models.Model):
    nom = models.CharField(max_length=100, default="John")
    prenom = models.CharField(max_length=100, default="Doe")
    email = models.EmailField(default="john.doe@example.com")
    photo = CloudinaryField('image', folder='photos', null=True, blank=True)

    class Meta:
        verbose_name = "Profil"
        verbose_name_plural = "Profil"

    def __str__(self):
        return f"{self.prenom} {self.nom}"

class SousTitrePresentation(models.Model):
    presentation = models.ForeignKey(Presentation, related_name='details', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255)
    description = models.TextField()
    ordre = models.IntegerField(default=0)

    class Meta:
        ordering = ['ordre']

class PosteCible(models.Model):
    nom = models.CharField(max_length=100)

    def __str__(self):
        return self.nom

class Diplome(models.Model):
    titre = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)
    parchemin = CloudinaryField('image', folder='diplomes', null=True, blank=True)

    def __str__(self):
        return self.titre

# --- Événements Temporels ---

class BaseEvenement(models.Model):
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True)
    details = GenericRelation(DetailEvenement)

    class Meta:
        abstract = True
        ordering = ['-date_debut']

class Formation(BaseEvenement):
    titre = models.CharField(max_length=255)
    institution = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    justificatif = CloudinaryField('image', folder='justificatifs_formation', null=True, blank=True)

    def __str__(self):
        return self.titre

class ActiviteProfessionnelle(BaseEvenement):
    poste = models.CharField(max_length=255)

    class Meta(BaseEvenement.Meta):
        verbose_name = "Activité Pro"
        verbose_name_plural = "Activités Pro"

    def __str__(self):
        return self.poste

class ServiceCivique(BaseEvenement):
    mission = models.CharField(max_length=255)
    organisme_accueil = models.CharField(max_length=255)

    class Meta(BaseEvenement.Meta):
        verbose_name = "Service Civique"
        verbose_name_plural = "Services Civiques"

    def __str__(self):
        return self.mission

# --- PROJETS UNIFIÉS ---

class Projet(BaseEvenement):
    CATEGORIES = [
        ('PRO', 'Professionnel'),
        ('ETU', 'Étudiant'),
        ('PERSO', 'Personnel'),
    ]

    categorie = models.CharField(max_length=10, choices=CATEGORIES, default='PERSO')
    titre = models.CharField(max_length=255)
    introduction = models.TextField(verbose_name="Description courte")
    role = models.CharField(max_length=255, blank=True)
    institution = models.CharField(max_length=255, blank=True, help_text="Entreprise ou École")
    
    technologies = models.ManyToManyField(
        CompetenceTechnologique,
        blank=True,
        related_name="projets"
    )
    media_video = CloudinaryField('video', folder='projets_videos', null=True, blank=True)
    url_code_source = models.URLField(max_length=500, blank=True, null=True)

    class Meta(BaseEvenement.Meta):
        verbose_name = "Projet"
        verbose_name_plural = "Projets"

    def __str__(self):
        return f"[{self.get_categorie_display()}] {self.titre}"

class MediaProjet(models.Model):
    """Photos additionnelles pour un projet."""
    projet = models.ForeignKey(Projet, related_name='media_photos', on_delete=models.CASCADE)
    image = CloudinaryField('image', folder='projets_photos')
    legende = models.CharField(max_length=255, blank=True)

    def __str__(self):
        return f"Img: {self.projet.titre}"