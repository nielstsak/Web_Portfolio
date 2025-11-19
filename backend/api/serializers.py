from rest_framework import serializers
from .models import (
    Presentation, SousTitrePresentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique, SectionCompetence,
    Formation, 
    ActiviteProfessionnelle,
    ServiceCivique,
    ProjetProfessionnel, MediaProjetProfessionnel,
    ProjetEtudiant, MediaProjetEtudiant,
    ProjetPersonnel, MediaProjetPersonnel,
    DetailEvenement
)

# --- Serializers Transverses ---

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    logo = serializers.FileField(use_url=True)
    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

class SectionCompetenceSerializer(serializers.ModelSerializer):
    competences = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    class Meta:
        model = SectionCompetence
        fields = ['id', 'titre', 'ordre', 'competences']

class SousTitrePresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousTitrePresentation
        fields = ['titre', 'description', 'ordre']

class PresentationSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(use_url=True)
    details = SousTitrePresentationSerializer(many=True, read_only=True)
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

class DetailEvenementSerializer(serializers.ModelSerializer):
    """Sérialiseur générique pour les listes de tâches/missions."""
    
    def to_representation(self, instance):
        """Transforme le champ texte brut en liste de chaînes pour le frontend."""
        ret = super().to_representation(instance)
        text_data = ret.get('descriptions')
        
        if not text_data:
            list_data = []
        else:
            # Découpe par ligne et supprime les espaces vides
            list_data = [line.strip() for line in text_data.splitlines() if line.strip()]
            
        ret['descriptions'] = list_data
        return ret

    class Meta:
        model = DetailEvenement
        fields = ['id', 'sous_titre', 'descriptions', 'ordre']

# --- Serializers Événements ---

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

# --- Serializers Projets ---

class MediaProjetProfessionnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetProfessionnel
        fields = ['id', 'image', 'legende']

class ProjetProfessionnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetProfessionnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    # Mappe la relation générique 'details' vers le nom attendu par le front
    travail_effectue = DetailEvenementSerializer(source='details', many=True, read_only=True)

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
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = DetailEvenementSerializer(source='details', many=True, read_only=True)

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
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = DetailEvenementSerializer(source='details', many=True, read_only=True)

    class Meta:
        model = ProjetPersonnel
        fields = '__all__'