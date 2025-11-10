# backend\api\serializers.py
from rest_framework import serializers
from .models import (
    Projet,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
    TravailEffectue,
)

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle CompetenceTechnologique."""
    # Retourne l'URL complète du fichier, plutôt que juste le chemin.
    logo = serializers.FileField(use_url=True)

    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

class TravailEffectueSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les tâches effectuées au sein d'un projet."""
    class Meta:
        model = TravailEffectue
        fields = ['id', 'sous_titre', 'description']

class ProjetSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Projet, incluant ses relations."""
    # Imbrique les données complètes des technologies associées.
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    # Imbrique les données des tâches via le 'related_name' défini dans le modèle TravailEffectue.
    travaux_effectues = TravailEffectueSerializer(many=True, read_only=True)

    class Meta:
        model = Projet
        fields = [
            'id', 
            'titre', 
            'video', 
            'description',
            'tasks_effectuees',
            'technologies',
            'travaux_effectues' # Doit correspondre au champ défini ci-dessus
        ]

class PresentationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Presentation."""
    photo = serializers.FileField(use_url=True)

    class Meta:
        model = Presentation
        fields = '__all__' # Inclut tous les champs du modèle

class PosteCibleSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle PosteCible."""
    class Meta:
        model = PosteCible
        fields = '__all__'

class DiplomeSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Diplome."""
    class Meta:
        model = Diplome
        fields = '__all__'

class ParcoursSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Parcours."""
    class Meta:
        model = Parcours
        fields = '__all__'