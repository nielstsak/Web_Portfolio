# backend/api/admin.py

from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from .models import (
    Presentation, SousTitrePresentation,
    PosteCible,
    Diplome,
    SectionCompetence, CompetenceTechnologique,
    Formation,
    ActiviteProfessionnelle,
    ServiceCivique,
    ProjetProfessionnel, MediaProjetProfessionnel,
    ProjetEtudiant, MediaProjetEtudiant,
    ProjetPersonnel, MediaProjetPersonnel,
    DetailEvenement  # Le modèle manquant
)

# --- Configuration des Inlines (Sous-formulaires) ---

class DetailEvenementInline(GenericTabularInline):
    """Permet d'éditer les détails directement dans le parent (Projet, Activité, etc.)"""
    model = DetailEvenement
    extra = 1 # Nombre de lignes vides affichées par défaut

class MediaProjetProInline(admin.TabularInline):
    model = MediaProjetProfessionnel
    extra = 1

class MediaProjetEtuInline(admin.TabularInline):
    model = MediaProjetEtudiant
    extra = 1

class MediaProjetPersoInline(admin.TabularInline):
    model = MediaProjetPersonnel
    extra = 1

class SousTitrePresentationInline(admin.StackedInline):
    model = SousTitrePresentation
    extra = 1

class CompetenceInline(admin.TabularInline):
    model = CompetenceTechnologique
    extra = 1

# --- Enregistrement des Modèles ---

@admin.register(Presentation)
class PresentationAdmin(admin.ModelAdmin):
    inlines = [SousTitrePresentationInline]

@admin.register(SectionCompetence)
class SectionCompetenceAdmin(admin.ModelAdmin):
    inlines = [CompetenceInline]
    list_display = ('titre', 'ordre')
    list_editable = ('ordre',)

@admin.register(CompetenceTechnologique)
class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'section')
    list_filter = ('section',)

@admin.register(ActiviteProfessionnelle)
class ActiviteProfessionnelleAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline] # Ajout de l'édition des détails ici
    list_display = ('poste', 'date_debut', 'date_fin')

@admin.register(ServiceCivique)
class ServiceCiviqueAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('mission', 'organisme_accueil', 'date_debut')

@admin.register(ProjetProfessionnel)
class ProjetProfessionnelAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline, MediaProjetProInline]
    list_display = ('titre', 'date_debut')
    filter_horizontal = ('technologies',) # Facilite la sélection des ManyToMany

@admin.register(ProjetEtudiant)
class ProjetEtudiantAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline, MediaProjetEtuInline]
    list_display = ('titre', 'institution', 'date_debut')
    filter_horizontal = ('technologies',)

@admin.register(ProjetPersonnel)
class ProjetPersonnelAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline, MediaProjetPersoInline]
    list_display = ('titre', 'date_debut')
    filter_horizontal = ('technologies',)

@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('titre', 'institution', 'date_debut')

# Enregistrement simple pour les autres
admin.site.register(PosteCible)
admin.site.register(Diplome)

# Optionnel : Enregistrer DetailEvenement seul si tu veux voir la liste complète globale
@admin.register(DetailEvenement)
class DetailEvenementAdmin(admin.ModelAdmin):
    list_display = ('sous_titre', 'content_type', 'content_object', 'ordre')
    list_filter = ('content_type',)