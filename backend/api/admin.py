# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
import sys
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
from django.contrib import messages

# --- MODÈLES CONSERVÉS ---

@admin.register(CompetenceTechnologique)
class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'afficher_apercu_logo')
    def afficher_apercu_logo(self, competence):
        if competence.logo:
            return mark_safe(f'<img src="{competence.logo.url}" alt="{competence.nom}" height="40" >')
        return "Aucun logo"
    afficher_apercu_logo.short_description = 'Aperçu du Logo'

@admin.register(Presentation)
class PresentationAdmin(admin.ModelAdmin):
    pass

@admin.register(Diplome)
class DiplomeAdmin(admin.ModelAdmin):
    list_display = ('titre', 'institution', 'afficher_parchemin')
    def afficher_parchemin(self, diplome):
        if diplome.parchemin:
            return mark_safe(f'<a href="{diplome.parchemin.url}" target="_blank">Voir justificatif</a>')
        return "Aucun justificatif"
    afficher_parchemin.short_description = 'Justificatif'

@admin.register(PosteCible)
class PosteCibleAdmin(admin.ModelAdmin):
    pass

# --- NOUVEAUX MODÈLES (CHRONOLOGIE) ---

# --- Inlines pour les Missions / Travaux ---
class MissionActiviteProInline(admin.TabularInline):
    model = MissionActivitePro
    extra = 1
    verbose_name = "Mission détaillée"
    verbose_name_plural = "Missions détaillées"

class MissionServiceCiviqueInline(admin.TabularInline):
    model = MissionServiceCivique
    extra = 1
    verbose_name = "Mission détaillée"
    verbose_name_plural = "Missions détaillées"

class TravailEffectueProjetProInline(admin.TabularInline):
    model = TravailEffectueProjetPro
    extra = 1
    verbose_name = "Section de travail effectué"
    verbose_name_plural = "Travail Détaillé"

class TravailEffectueProjetEtuInline(admin.TabularInline):
    model = TravailEffectueProjetEtu
    extra = 1
    verbose_name = "Section de travail effectué"
    verbose_name_plural = "Travail Détaillé"

class TravailEffectueProjetPersoInline(admin.TabularInline):
    model = TravailEffectueProjetPerso
    extra = 1
    verbose_name = "Section de travail effectué"
    verbose_name_plural = "Travail Détaillé"


# --- Inlines pour les Médias de Projet ---
class MediaProjetProfessionnelInline(admin.TabularInline):
    model = MediaProjetProfessionnel
    extra = 1
    verbose_name = "Média (Carrousel Photo)"
    verbose_name_plural = "Médias (Carrousel Photos)"

class MediaProjetEtudiantInline(admin.TabularInline):
    model = MediaProjetEtudiant
    extra = 1
    verbose_name = "Média (Carrousel Photo)"
    verbose_name_plural = "Médias (Carrousel Photos)"

class MediaProjetPersonnelInline(admin.TabularInline):
    model = MediaProjetPersonnel
    extra = 1
    verbose_name = "Média (Carrousel Photo)"
    verbose_name_plural = "Médias (Carrousel Photos)"

# --- Admins pour les Projets ---
class BaseProjetAdmin(admin.ModelAdmin):
    list_display = ('titre', 'date_debut', 'date_fin', 'role')
    search_fields = ('titre', 'introduction', 'role')
    list_filter = ('date_debut',)
    filter_horizontal = ('technologies',)
    fieldsets = (
        ('Informations Générales', {
            'fields': ('titre', 'introduction', 'role', ('date_debut', 'date_fin'))
        }),
        ('Détails Techniques', {
            'fields': ('technologies', 'media_video', 'code_source_zip')
        }),
    )

@admin.register(ProjetProfessionnel)
class ProjetProfessionnelAdmin(BaseProjetAdmin):
    inlines = [MediaProjetProfessionnelInline, TravailEffectueProjetProInline]

@admin.register(ProjetEtudiant)
class ProjetEtudiantAdmin(BaseProjetAdmin):
    inlines = [MediaProjetEtudiantInline, TravailEffectueProjetEtuInline]
    fieldsets = (
        ('Informations Générales', {
            'fields': ('titre', 'institution', 'introduction', 'role', ('date_debut', 'date_fin'))
        }),
        ('Détails Techniques', {
            'fields': ('technologies', 'media_video', 'code_source_zip')
        }),
    )
    list_display = ('titre', 'date_debut', 'institution', 'role')

@admin.register(ProjetPersonnel)
class ProjetPersonnelAdmin(BaseProjetAdmin):
    inlines = [MediaProjetPersonnelInline, TravailEffectueProjetPersoInline]

# --- Admins pour les autres Événements ---

@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    list_display = ('titre', 'institution', 'date_debut', 'date_fin')
    search_fields = ('titre', 'institution', 'description')

@admin.register(ActiviteProfessionnelle)
class ActiviteProfessionnelleAdmin(admin.ModelAdmin):
    list_display = ('poste', 'date_debut', 'date_fin')
    search_fields = ('poste',)
    inlines = [MissionActiviteProInline]

@admin.register(ServiceCivique)
class ServiceCiviqueAdmin(admin.ModelAdmin):
    list_display = ('mission', 'organisme_accueil', 'date_debut', 'date_fin')
    search_fields = ('mission', 'organisme_accueil',)
    inlines = [MissionServiceCiviqueInline]

# Enregistrement des modèles de média (pour gestion manuelle si nécessaire)
admin.site.register(MediaProjetProfessionnel)
admin.site.register(MediaProjetEtudiant)
admin.site.register(MediaProjetPersonnel)