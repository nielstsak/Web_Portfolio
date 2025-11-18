from rest_framework import serializers
from .models import (
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique, SectionCompetence,
    Formation, 
    ActiviteProfessionnelle, MissionActivitePro,
    ServiceCivique, MissionServiceCivique,
    ProjetProfessionnel, MediaProjetProfessionnel, TravailEffectueProjetPro,
    ProjetEtudiant, MediaProjetEtudiant, TravailEffectueProjetEtu,
    ProjetPersonnel, MediaProjetPersonnel, TravailEffectueProjetPerso,
    SousTitrePresentation, # CORRIGÉ: Import manquant ajouté ici
)

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

# NOUVEAU SERIALIZER (Obj. 1)
class SousTitrePresentationSerializer(serializers.ModelSerializer):
    class Meta:
        model = SousTitrePresentation
        fields = ['titre', 'description', 'ordre'] 

class PresentationSerializer(serializers.ModelSerializer):
    photo = serializers.FileField(use_url=True)
    details = SousTitrePresentationSerializer(many=True, read_only=True) # MODIFIÉ pour inclure les détails
    class Meta:
        model = Presentation
        # MODIFIÉ pour n'inclure que les champs existants + le champ imbriqué 'details'
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

class BaseListSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        ret = super().to_representation(instance)
        text_data = ret.get('descriptions')
        
        if not text_data:
            list_data = []
        else:
            list_data = [line.strip() for line in text_data.splitlines() if line.strip()]
            
        ret['descriptions'] = list_data
        return ret

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

class MediaProjetProfessionnelSerializer(serializers.ModelSerializer):
    image = serializers.FileField(use_url=True)
    class Meta:
        model = MediaProjetProfessionnel
        fields = ['id', 'image', 'legende']

class ProjetProfessionnelSerializer(serializers.ModelSerializer):
    media_photos = MediaProjetProfessionnelSerializer(many=True, read_only=True)
    media_video = serializers.FileField(use_url=True, required=False)
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
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    travail_effectue = TravailEffectueProjetPersoSerializer(many=True, read_only=True)

    class Meta:
        model = ProjetPersonnel
        fields = '__all__'