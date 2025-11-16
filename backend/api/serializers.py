# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Formation, 
    ActiviteProfessionnelle, MissionActivitePro,
    ServiceCivique, MissionServiceCivique,
    ProjetProfessionnel, MediaProjetProfessionnel, TravailEffectueProjetPro,
    ProjetEtudiant, MediaProjetEtudiant, TravailEffectueProjetEtu,
    ProjetPersonnel, MediaProjetPersonnel, TravailEffectueProjetPerso,
)

# --- SÉRIALISEURS CONSERVÉS (INTRODUCTION) ---

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    logo = serializers.FileField(use_url=True)
    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

class PresentationSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(use_url=True)
    class Meta:
        model = Presentation
        fields = '__all__'

class PosteCibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosteCible
        fields = '__all__'

class DiplomeSerializer(serializers.ModelSerializer):
    parchemin = serializers.FileField(use_url=True, required=False)
    class Meta:
        model = Diplome
        fields = ['id', 'titre', 'institution', 'parchemin']


# --- SÉRIALISEUR DE BASE POUR TRANSFORMER LE TEXTE EN LISTE ---

class BaseListSerializer(serializers.ModelSerializer):
    """
    Transforme le champ 'descriptions' (TextField) en une liste de strings.
    """
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        text_data = ret.get('descriptions', '')
        # Sépare par ligne, supprime les espaces et filtre les lignes vides
        list_data = [line.strip() for line in text_data.splitlines() if line.strip()]
        ret['descriptions'] = list_data
        return ret

# --- NOUVEAUX SÉRIALISEURS (POUR INLINES) ---

class MissionActiviteProSerializer(BaseListSerializer):
    class Meta:
        model = MissionActivitePro
        fields = ['id', 'sous_titre', 'descriptions']

class MissionServiceCiviqueSerializer(BaseListSerializer):
    class Meta:
        model = MissionServiceCivique
        fields = ['id', 'sous_titre', 'descriptions']

class TravailEffectueProjetProSerializer(BaseListSerializer):
    class Meta:
        model = TravailEffectueProjetPro
        fields = ['id', 'sous_titre', 'descriptions']

class TravailEffectueProjetEtuSerializer(BaseListSerializer):
    class Meta:
        model = TravailEffectueProjetEtu
        fields = ['id', 'sous_titre', 'descriptions']

class TravailEffectueProjetPersoSerializer(BaseListSerializer):
    class Meta:
        model = TravailEffectueProjetPerso
        fields = ['id', 'sous_titre', 'descriptions']


# --- SÉRIALISEURS PRINCIPAUX (CHRONOLOGIE) ---

class FormationSerializer(serializers.ModelSerializer):
    justificatif = serializers.FileField(use_url=True, required=False)
    class Meta:
        model = Formation
        fields = '__all__'

class ActiviteProfessionnelleSerializer(serializers.ModelSerializer):
    missions = MissionActiviteProSerializer(many=True, read_only=True)
    class Meta:
        model = ActiviteProfessionnelle
        fields = '__all__'

class ServiceCiviqueSerializer(serializers.ModelSerializer):
    missions = MissionServiceCiviqueSerializer(many=True, read_only=True)
    class Meta:
        model = ServiceCivique
        fields = '__all__'


# --- Sérialiseurs de Projets (avec médias imbriqués) ---

class MediaProjetProfessionnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetProfessionnel
        fields = ['id', 'image', 'legende']

class ProjetProfessionnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetProfessionnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = TravailEffectueProjetProSerializer(many=True, read_only=True)

    class Meta:
        model = ProjetProfessionnel
        fields = '__all__'

class MediaProjetEtudiantSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetEtudiant
        fields = ['id', 'image', 'legende']

class ProjetEtudiantSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetEtudiantSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = TravailEffectueProjetEtuSerializer(many=True, read_only=True)

    class Meta:
        model = ProjetEtudiant
        fields = '__all__'

class MediaProjetPersonnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetPersonnel
        fields = ['id', 'image', 'legende']

class ProjetPersonnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetPersonnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    code_source_zip = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = TravailEffectueProjetPersoSerializer(many=True, read_only=True)

    class Meta:
        model = ProjetPersonnel
        fields = '__all__'