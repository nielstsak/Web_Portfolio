# [Symbole Commentaire] FICHIER : backend/api/admin.py

from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from .models import (
    Presentation, SousTitrePresentation, PosteCible, Diplome,
    SectionCompetence, CompetenceTechnologique,
    Formation, ActiviteProfessionnelle, ServiceCivique,
    Projet, MediaProjet, DetailEvenement
)

# --- Inlines (Éléments imbriqués) ---

class DetailEvenementInline(GenericTabularInline):
    """Permet d'ajouter des détails/missions directement dans la page de l'événement."""
    model = DetailEvenement
    extra = 0 # Pas de ligne vide par défaut pour plus de propreté

class MediaProjetInline(admin.TabularInline):
    model = MediaProjet
    extra = 0

class SousTitrePresentationInline(admin.StackedInline):
    model = SousTitrePresentation
    extra = 0

class CompetenceInline(admin.TabularInline):
    model = CompetenceTechnologique
    extra = 0

# --- Configurations d'Administration ---

@admin.register(Presentation)
class PresentationAdmin(admin.ModelAdmin):
    inlines = [SousTitrePresentationInline]
    list_display = ('prenom', 'nom', 'email')

@admin.register(SectionCompetence)
class SectionCompetenceAdmin(admin.ModelAdmin):
    inlines = [CompetenceInline]
    list_display = ('titre', 'ordre')
    list_editable = ('ordre',)
    ordering = ('ordre',)

@admin.register(ActiviteProfessionnelle)
class ActiviteAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    # Ajout de 'type_contrat' pour faciliter la gestion Freelance vs Salarié
    list_display = ('poste', 'type_contrat', 'date_debut', 'date_fin')
    list_filter = ('type_contrat',) # Filtre latéral indispensable
    search_fields = ('poste', 'details__descriptions')
    ordering = ('-date_debut',)

@admin.register(ServiceCivique)
class ServiceAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('mission', 'organisme_accueil', 'date_debut')
    ordering = ('-date_debut',)

@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('titre', 'institution', 'date_debut')
    ordering = ('-date_debut',)

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline, MediaProjetInline]
    list_display = ('titre', 'categorie', 'date_debut')
    list_filter = ('categorie', 'technologies') # Filtre par catégorie (ex: FREELANCE)
    filter_horizontal = ('technologies',) # Interface améliorée pour les ManyToMany
    search_fields = ('titre', 'introduction')
    ordering = ('-date_debut',)

# --- Enregistrements Simples ---

admin.site.register(PosteCible)
admin.site.register(Diplome)
admin.site.register(CompetenceTechnologique)