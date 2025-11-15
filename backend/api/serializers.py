# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    # CONSERVÉS
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,

    # NOUVEAUX MODÈLES
    Formation, 
    ActiviteProfessionnelle, 
    ServiceCivique,
    ProjetProfessionnel, MediaProjetProfessionnel,
    ProjetEtudiant, MediaProjetEtudiant,
    ProjetPersonnel, MediaProjetPersonnel,
)

# --- SÉRIALISEURS CONSERVÉS (INTRODUCTION) ---

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle CompetenceTechnologique."""
    logo = serializers.FileField(use_url=True)

    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

class PresentationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Presentation."""
    photo = serializers.FileField(use_url=True)

    class Meta:
        model = Presentation
        fields = '__all__'

class PosteCibleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle PosteCible."""
    class Meta:
        model = PosteCible
        fields = '__all__'

class DiplomeSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Diplome (Introduction)."""
    parchemin = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = Diplome
        fields = ['id', 'titre', 'institution', 'parchemin']


# --- NOUVEAUX SÉRIALISEURS (CHRONOLOGIE) ---

# 1. Formation
class FormationSerializer(serializers.ModelSerializer):
    justificatif = serializers.FileField(use_url=True, required=False)
    class Meta:
        model = Formation
        fields = '__all__'

# 2. Activité Professionnelle
class ActiviteProfessionnelleSerializer(serializers.ModelSerializer):
    class Meta:
        model = ActiviteProfessionnelle
        fields = '__all__'

# 3. Service Civique
class ServiceCiviqueSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServiceCivique
        fields = '__all__'

# --- Sérialiseurs de Projets (avec médias imbriqués) ---

# 4. Projet Professionnel
class MediaProjetProfessionnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetProfessionnel
        fields = ['id', 'image', 'legende']

class ProjetProfessionnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetProfessionnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = ProjetProfessionnel
        fields = '__all__'

# 5. Projet Étudiant
class MediaProjetEtudiantSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetEtudiant
        fields = ['id', 'image', 'legende']

class ProjetEtudiantSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetEtudiantSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = ProjetEtudiant
        fields = '__all__'

# 6. Projet Personnel
class MediaProjetPersonnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetPersonnel
        fields = ['id', 'image', 'legende']

class ProjetPersonnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetPersonnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = ProjetPersonnel
        fields = '__all__'