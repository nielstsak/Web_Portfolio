from django.db import models
from django.core.validators import FileExtensionValidator

class CompetenceTechnologique(models.Model):
    """Représente une compétence technologique (ex: Python, React) avec son logo."""
    nom = models.CharField(max_length=100)
    logo = models.FileField(
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

class WorkDone(models.Model):
    """Détaille une tâche ou une réalisation spécifique au sein d'un projet."""
    project = models.ForeignKey('Project', related_name='work_done', on_delete=models.CASCADE)
    subtitle = models.CharField(max_length=200)
    description = models.TextField()

    def __str__(self):
        return f"{self.project.title} - {self.subtitle}"

class Project(models.Model):
    """Modèle central représentant un projet réalisé dans le portfolio."""
    title = models.CharField(max_length=200)
    video = models.FileField(upload_to='project_videos/', null=True, blank=True)
    description = models.TextField()
    tasks_effectuees = models.TextField(help_text="Décrivez les tâches générales effectuées.")
    technologies = models.ManyToManyField(CompetenceTechnologique, related_name="projects")
    source_code_zip = models.FileField(upload_to='project_sources/', null=True, blank=True, help_text="Archive ZIP du code source.")

    def __str__(self):
        return self.title

class Presentation(models.Model):
    """Contient les informations générales de présentation (bio, photo, contact)."""
    texte = models.TextField()
    nom = models.CharField(max_length=100, default="John")
    prenom = models.CharField(max_length=100, default="Doe")
    email = models.EmailField(default="john.doe@example.com")
    photo = models.FileField(
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

class PosteCible(models.Model):
    """Définit un type de poste visé par le professionnel (ex: Développeur Backend)."""
    nom = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Poste Ciblé"
        verbose_name_plural = "Postes Ciblés"

    def __str__(self):
        return self.nom

class Diplome(models.Model):
    """Représente un diplôme ou une certification obtenue."""
    titre = models.CharField(max_length=200)
    institution = models.CharField(max_length=200)

    def __str__(self):
        return self.titre

class Parcours(models.Model):
    """Décrit une expérience professionnelle ou une étape du parcours."""
    poste = models.CharField(max_length=200)
    description = models.CharField(max_length=200)
    periode = models.CharField(max_length=100)
    
    class Meta:
        # Trie les expériences de la plus récente à la plus ancienne par défaut.
        ordering = ['-periode']
        verbose_name = "Parcours"
        verbose_name_plural = "Parcours"

    def __str__(self):
        return self.poste