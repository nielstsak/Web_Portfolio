# backend/api/models.py

from django.db import models
from django.core.validators import FileExtensionValidator
import sys
from cloudinary_storage.fields import CloudinaryField

class CompetenceTechnologique(models.Model):
    """Représente une compétence technologique (ex: Python, React) avec son logo."""
    nom = models.CharField(max_length=100)
    logo = CloudinaryField(
        resource_type='image',
        upload_to='competences_logos/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp', 'svg'])]
    )

    class Meta:
        verbose_name = "Compétence Technologique"
        verbose_name_plural = "Compétences Technologiques"

    def __str__(self):
        return self.nom

    def save(self, *args, **kwargs):
        print(f"[MODEL] Sauvegarde CompetenceTechnologique: {self.nom}", file=sys.stdout)
        if self.logo:
            print(f"[MODEL] Logo détecté: {self.logo.name}", file=sys.stdout)
            try:
                print(f"[MODEL] Taille du fichier: {self.logo.size} bytes", file=sys.stdout)
            except Exception as e:
                print(f"[MODEL] Impossible de lire la taille: {e}", file=sys.stdout)
        else:
            print("[MODEL] Aucun logo fourni", file=sys.stdout)
        super().save(*args, **kwargs)

class TravailEffectue(models.Model):
    """Détaille une tâche ou une réalisation spécifique au sein d'un projet."""
    projet = models.ForeignKey('Projet', related_name='travaux_effectues', on_delete=models.CASCADE)
    sous_titre = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return f"{self.projet.titre} - {self.sous_titre}"

class Projet(models.Model):
    """Modèle central représentant un projet réalisé dans le portfolio."""
    titre = models.CharField(max_length=200)
    video = CloudinaryField(
        resource_type='video',
        upload_to='project_videos/', 
        null=True, 
        blank=True
    )
    description = models.TextField()
    tasks_effectuees = models.TextField(help_text="Décrivez les tâches générales effectuées.")
    technologies = models.ManyToManyField(CompetenceTechnologique, related_name="projets")
    zip_code_source = CloudinaryField(
        resource_type='raw',
        upload_to='project_sources/', 
        null=True, 
        blank=True, 
        help_text="Archive ZIP du code source."
    )

    def __str__(self):
        return self.titre

    def save(self, *args, **kwargs):
        print(f"[MODEL] Sauvegarde Projet: {self.titre}", file=sys.stdout)
        if self.video:
            print(f"[MODEL] Vidéo détectée: {self.video.name}", file=sys.stdout)
        else:
            print("[MODEL] Aucune vidéo fournie", file=sys.stdout)
        
        if self.zip_code_source:
            print(f"[MODEL] Code source ZIP détecté: {self.zip_code_source.name}", file=sys.stdout)
        
        super().save(*args, **kwargs)

class Presentation(models.Model):
    """Contient les informations générales de présentation (bio, photo, contact)."""
    texte = models.TextField()
    nom = models.CharField(max_length=100, default="John")
    prenom = models.CharField(max_length=100, default="Doe")
    email = models.EmailField(default="john.doe@example.com")
    photo = CloudinaryField(
        resource_type='image',
        upload_to='photos/',
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'webp'])]
    )

    class Meta:
        verbose_name = "Texte de Présentation"
        verbose_name_plural = "Texte de Présentation"

    def __str__(self):
        return "Texte de présentation du projet professionnel"

    def save(self, *args, **kwargs):
        print(f"[MODEL] Sauvegarde Presentation: {self.prenom} {self.nom}", file=sys.stdout)
        if self.photo:
            print(f"[MODEL] Photo détectée: {self.photo.name}", file=sys.stdout)
        super().save(*args, **kwargs)

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

    def __str__(self):
        return self.titre

class Parcours(models.Model):
    poste = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    periode = models.CharField(max_length=100)
    
    class Meta:
        ordering = ['-periode']
        verbose_name = "Parcours"
        verbose_name_plural = "Parcours"

    def __str__(self):
        return self.poste