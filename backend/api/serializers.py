from rest_framework import serializers
from .models import (
    Presentation, SousTitrePresentation, PosteCible, Diplome,
    CompetenceTechnologique, SectionCompetence,
    Formation, ActiviteProfessionnelle, ServiceCivique,
    Projet, MediaProjet, DetailEvenement
)

# --- Utils ---

class DetailEvenementSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        text = ret.get('descriptions', '')
        ret['descriptions'] = [l.strip() for l in text.splitlines() if l.strip()] if text else []
        return ret

    class Meta:
        model = DetailEvenement
        fields = ['id', 'sous_titre', 'descriptions', 'ordre']

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    logo = serializers.FileField(use_url=True)
    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

# --- Transverses ---

class SectionCompetenceSerializer(serializers.ModelSerializer):
    competences = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    class Meta:
        model = SectionCompetence
        fields = ['id', 'titre', 'ordre', 'competences']

class PresentationSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(use_url=True)
    details = serializers.SerializerMethodField()

    def get_details(self, obj):
        # Utilisation d'un serializer inline simple pour éviter la complexité
        return obj.details.values('id', 'titre', 'description', 'ordre')

    class Meta:
        model = Presentation
        fields = ['id', 'nom', 'prenom', 'email', 'photo', 'details']

class PosteCibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosteCible
        fields = '__all__'

class DiplomeSerializer(serializers.ModelSerializer):
    parchemin = serializers.FileField(use_url=True, required=False)
    class Meta:
        model = Diplome
        fields = ['id', 'titre', 'institution', 'parchemin']

# --- Chronologie ---

class FormationSerializer(serializers.ModelSerializer):
    justificatif = serializers.FileField(use_url=True, required=False)
    details = DetailEvenementSerializer(many=True, read_only=True)
    class Meta:
        model = Formation
        fields = '__all__'

class ActiviteProfessionnelleSerializer(serializers.ModelSerializer):
    missions = DetailEvenementSerializer(source='details', many=True, read_only=True)
    class Meta:
        model = ActiviteProfessionnelle
        fields = '__all__'

class ServiceCiviqueSerializer(serializers.ModelSerializer):
    missions = DetailEvenementSerializer(source='details', many=True, read_only=True)
    class Meta:
        model = ServiceCivique
        fields = '__all__'

# --- Projets Unifiés ---

class MediaProjetSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjet
        fields = ['id', 'image', 'legende']

class ProjetSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = DetailEvenementSerializer(source='details', many=True, read_only=True)
    
    # Champ calculé pour le frontend si besoin d'un mapping spécifique
    type_display = serializers.CharField(source='get_categorie_display', read_only=True)

    class Meta:
        model = Projet
        fields = '__all__'