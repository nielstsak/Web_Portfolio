# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
import sys
from django.db import models
from django.forms import Textarea

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

class BaseListInlineAdmin(admin.TabularInline):
    extra = 1
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 60})},
    }

# --- Inlines pour les Missions / Travaux ---
class MissionActiviteProInline(BaseListInlineAdmin):
    model = MissionActivitePro
    verbose_name = "Mission détaillée"
    verbose_name_plural = "Missions détaillées"

class MissionServiceCiviqueInline(BaseListInlineAdmin):
    model = MissionServiceCivique
    verbose_name = "Mission détaillée"
    verbose_name_plural = "Missions détaillées"

class TravailEffectueProjetProInline(BaseListInlineAdmin):
    model = TravailEffectueProjetPro
    verbose_name = "Section de travail effectué"
    verbose_name_plural = "Travail Détaillé"

class TravailEffectueProjetEtuInline(BaseListInlineAdmin):
    model = TravailEffectueProjetEtu
    verbose_name = "Section de travail effectué"
    verbose_name_plural = "Travail Détaillé"

class TravailEffectueProjetPersoInline(BaseListInlineAdmin):
    model = TravailEffectueProjetPerso
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
            # --- MODIFICATION ---
            'fields': ('technologies', 'media_video', 'url_code_source')
            # --- FIN MODIFICATION ---
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
            # --- MODIFICATION ---
            'fields': ('technologies', 'media_video', 'url_code_source')
            # --- FIN MODIFICATION ---
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

admin.site.register(MediaProjetProfessionnel)
admin.site.register(MediaProjetEtudiant)
admin.site.register(MediaProjetPersonnel)