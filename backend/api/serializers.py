# backend/api/serializers.py
from rest_framework import serializers
from .models import (
    # NOUVEAU
    EvenementChronologique,
    
    # CONSERVÉS
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,

    # SUPPRIMÉS (retirés des imports)
    # Projet,
    # Parcours,
    # TravailEffectue,
)

# --- SÉRIALISEURS CONSERVÉS (Mis à jour) ---

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
    """Sérialiseur pour le modèle Diplome."""
    # Champ 'parchemin' ajouté (CloudinaryField est traité comme FileField)
    parchemin = serializers.FileField(use_url=True, required=False)

    class Meta:
        model = Diplome
        fields = ['id', 'titre', 'institution', 'parchemin'] # Mise à jour explicite


# --- NOUVEAU SÉRIALISEUR ---

class EvenementChronologiqueSerializer(serializers.ModelSerializer):
    """Sérialiseur pour le nouveau modèle EvenementChronologique."""
    class Meta:
        model = EvenementChronologique
        # Inclut titre, description, dates, type, specificites
        fields = '__all__' 


# --- SÉRIALISEURS SUPPRIMÉS (retirés) ---
# class TravailEffectueSerializer(serializers.ModelSerializer): ...
# class ProjetSerializer(serializers.ModelSerializer): ...
# class ParcoursSerializer(serializers.ModelSerializer): ...