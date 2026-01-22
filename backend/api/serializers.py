# [Symbole Commentaire] FICHIER : backend/api/serializers.py

from rest_framework import serializers
from .models import (
    Presentation, SousTitrePresentation, PosteCible, Diplome,
    CompetenceTechnologique, SectionCompetence,
    Formation, ActiviteProfessionnelle, ServiceCivique,
    Projet, MediaProjet, DetailEvenement
)

# --- Sérialiseurs Utilitaires ---

class DetailEvenementSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les listes à puces (missions, tâches)."""
    
    def to_representation(self, instance):
        """Transforme le bloc texte en liste de chaînes pour le frontend."""
        ret = super().to_representation(instance)
        text = ret.get('descriptions', '')
        ret['descriptions'] = [l.strip() for l in text.splitlines() if l.strip()] if text else []
        return ret

    class Meta:
        model = DetailEvenement
        fields = ['id', 'sous_titre', 'descriptions', 'ordre']
        read_only_fields = fields

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    logo = serializers.FileField(use_url=True)
    
    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']
        read_only_fields = fields

class MediaProjetSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    
    class Meta:
        model = MediaProjet
        fields = ['id', 'image', 'legende']
        read_only_fields = fields

# --- Sérialiseurs Transverses ---

class SectionCompetenceSerializer(serializers.ModelSerializer):
    competences = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    
    class Meta:
        model = SectionCompetence
        fields = ['id', 'titre', 'ordre', 'competences']
        read_only_fields = fields

class PresentationSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(use_url=True)
    details = serializers.SerializerMethodField()

    def get_details(self, obj):
        return obj.details.values('id', 'titre', 'description', 'ordre')

    class Meta:
        model = Presentation
        fields = ['id', 'nom', 'prenom', 'email', 'photo', 'details']
        read_only_fields = fields

class PosteCibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = PosteCible
        fields = ['id', 'nom']
        read_only_fields = fields

class DiplomeSerializer(serializers.ModelSerializer):
    parchemin = serializers.FileField(use_url=True, required=False)
    
    class Meta:
        model = Diplome
        fields = ['id', 'titre', 'institution', 'parchemin']
        read_only_fields = fields

# --- Sérialiseurs Chronologiques ---

class FormationSerializer(serializers.ModelSerializer):
    justificatif = serializers.FileField(use_url=True, required=False)
    details = DetailEvenementSerializer(many=True, read_only=True)
    
    class Meta:
        model = Formation
        fields = ['id', 'date_debut', 'date_fin', 'titre', 'institution', 'description', 'justificatif', 'details']
        read_only_fields = fields

class ActiviteProfessionnelleSerializer(serializers.ModelSerializer):
    missions = DetailEvenementSerializer(source='details', many=True, read_only=True)
    
    class Meta:
        model = ActiviteProfessionnelle
        fields = ['id', 'date_debut', 'date_fin', 'poste', 'type_contrat', 'missions']
        read_only_fields = fields

class ServiceCiviqueSerializer(serializers.ModelSerializer):
    missions = DetailEvenementSerializer(source='details', many=True, read_only=True)
    
    class Meta:
        model = ServiceCivique
        fields = ['id', 'date_debut', 'date_fin', 'mission', 'organisme_accueil', 'missions']
        read_only_fields = fields

# --- Sérialiseurs Projets ---

class ProjetSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = DetailEvenementSerializer(source='details', many=True, read_only=True)
    
    categorie_display = serializers.CharField(source='get_categorie_display', read_only=True)

    class Meta:
        model = Projet
        fields = [
            'id', 'date_debut', 'date_fin', 'categorie', 'categorie_display',
            'titre', 'introduction', 'role', 'institution', 
            'technologies', 'media_video', 'de_source', 
            'media_photos', 'travail_effectue'
        ]
        read_only_fields = fields