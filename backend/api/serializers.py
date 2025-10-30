# backend\api\serializers.py
from rest_framework import serializers
from .models import (
    Project,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
    WorkDone,
)

class CompetenceTechnologiqueSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle CompetenceTechnologique."""
    # S'assure que l'URL complète du fichier est retournée dans l'API.
    logo = serializers.FileField(use_url=True)

    class Meta:
        model = CompetenceTechnologique
        fields = ['id', 'nom', 'logo']

class WorkDoneSerializer(serializers.ModelSerializer):
    """Sérialiseur pour les tâches effectuées au sein d'un projet."""
    class Meta:
        model = WorkDone
        fields = ['id', 'subtitle', 'description']

class ProjectSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Project, incluant ses relations."""
    # Imbrique les données complètes des technologies associées.
    technologies = CompetenceTechnologiqueSerializer(many=True, read_only=True)
    # Imbrique les données complètes des tâches effectuées.
    work_done = WorkDoneSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = [
            'id', 
            'title', 
            'video', 
            'description',
            'tasks_effectuees',
            'technologies',
            'work_done'
        ]

class PresentationSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Presentation."""
    # S'assure que l'URL complète de la photo est retournée.
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
    """Sérialiseur pour le modèle Diplome."""
    class Meta:
        model = Diplome
        fields = '__all__'

class ParcoursSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le modèle Parcours."""
    class Meta:
        model = Parcours
        fields = '__all__'