from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType
from cloudinary.models import CloudinaryField

# --- Modèles Transverses ---

class SectionCompetence(models.Model):
    """Catégorie pour organiser les compétences techniques."""
    titre = models.CharField(max_length=100, verbose_name="Titre de la section")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage (plus petit = plus haut)")

    class Meta:
        verbose_name = "Section de Compétences"
        verbose_name_plural = "Sections de Compétences"
        ordering = ['ordre']

    def __str__(self):
        return self.titre

class CompetenceTechnologique(models.Model):
    """Compétence individuelle (ex: Python, React)."""
    nom = models.CharField(max_length=100)
    section = models.ForeignKey(
        SectionCompetence, 
        related_name='competences', 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        verbose_name="Section / Catégorie"
    )
    logo = CloudinaryField(
        resource_type='image',
        folder='competences_logos',
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Compétence Technologique"
        verbose_name_plural = "Compétences Technologiques"

    def __str__(self):
        return self.nom

class DetailEvenement(models.Model):
    """
    Modèle générique pour stocker les détails (missions, tâches effectuées)
    liés à n'importe quel type d'événement (Projet, Expérience, Formation, etc.).
    Remplace les multiples modèles spécifiques (MissionActivitePro, TravailEffectue...).
    """
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    content_object = GenericForeignKey('content_type', 'object_id')

    sous_titre = models.CharField(max_length=255, verbose_name="Sous-titre / Intitulé")
    descriptions = models.TextField(
        blank=True, 
        help_text="Un point par ligne. Chaque ligne deviendra une puce dans l'affichage."
    )
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")

    class Meta:
        verbose_name = "Détail / Mission"
        verbose_name_plural = "Détails & Missions"
        ordering = ['ordre']

    def __str__(self):
        return self.sous_titre

class Presentation(models.Model):
    """Informations générales du profil."""
    nom = models.CharField(max_length=100, default="John")
    prenom = models.CharField(max_length=100, default="Doe")
    email = models.EmailField(default="john.doe@example.com")
    photo = CloudinaryField(
        resource_type='image',
        folder='photos',
        null=True,
        blank=True,
    )

    class Meta:
        verbose_name = "Texte de Présentation"
        verbose_name_plural = "Texte de Présentation"

    def __str__(self):
        return f"{self.prenom} {self.nom}"

class SousTitrePresentation(models.Model):
    """Blocs de texte détaillés liés à la présentation."""
    presentation = models.ForeignKey(Presentation, related_name='details', on_delete=models.CASCADE)
    titre = models.CharField(max_length=255, verbose_name="Sous-titre / Accroche")
    description = models.TextField(verbose_name="Description détaillée")
    ordre = models.IntegerField(default=0, help_text="Ordre d'affichage")

    class Meta:
        verbose_name = "Détail de Présentation"
        verbose_name_plural = "Détails de Présentation"
        ordering = ['ordre']

    def __str__(self):
        return self.titre

class PosteCible(models.Model):
    """Postes recherchés."""
    nom = models.CharField(max_length=100)

    class Meta:
        verbose_name = "Poste Ciblé"
        verbose_name_plural = "Postes Ciblés"

    def __str__(self):
        return self.nom

class Diplome(models.Model):
    """Diplômes obtenus (liste simple)."""
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

# --- Classes Abstraites ---

class BaseEvenement(models.Model):
    """Classe de base pour tout événement temporel."""
    date_debut = models.DateField()
    date_fin = models.DateField(null=True, blank=True, help_text="Laisser vide si en cours ou ponctuel.")
    
    # Relation générique inverse pour accéder aux détails depuis l'événement
    details = GenericRelation(DetailEvenement)

    class Meta:
        abstract = True
        ordering = ['-date_debut']

class BaseProjet(BaseEvenement):
    """Classe de base pour les projets (Pro, Perso, Etudiant)."""
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
    url_code_source = models.URLField(
        max_length=500, 
        blank=True, null=True, 
        help_text="Lien vers le dépôt GitHub, GitLab, etc.",
        verbose_name="Lien Code Source"
    )

    class Meta(BaseEvenement.Meta):
        abstract = True

    def __str__(self):
        return self.titre

# --- Modèles Concrets ---

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