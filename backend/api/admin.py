from django.contrib import admin
from django.utils.html import mark_safe
import sys
from django.db import models
from django.forms import Textarea

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
)

@admin.register(SectionCompetence)
class SectionCompetenceAdmin(admin.ModelAdmin):
    list_display = ('titre', 'ordre')
    ordering = ('ordre',)

@admin.register(CompetenceTechnologique)
class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'section', 'afficher_apercu_logo')
    list_filter = ('section',)
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

class BaseListInlineAdmin(admin.TabularInline):
    extra = 1
    formfield_overrides = {
        models.TextField: {'widget': Textarea(attrs={'rows': 5, 'cols': 60})},
    }

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
            'fields': ('technologies', 'media_video', 'url_code_source')
        }),
    )

    def save_model(self, request, obj, form, change):
        print("--- LOGGING ADMIN SAVE_MODEL ---", file=sys.stdout)
        try:
            if 'media_video' in request.FILES:
                print(f"[ADMIN] Fichier 'media_video' détecté: {request.FILES['media_video'].name}", file=sys.stdout)
            
            if 'code_source_zip' in request.FILES:
                print(f"[ADMIN] Fichier 'code_source_zip' détecté: {request.FILES['code_source_zip'].name}", file=sys.stdout)

            print("[ADMIN] Tentative de super().save_model()", file=sys.stdout)
            super().save_model(request, obj, form, change)
            print("[ADMIN] super().save_model() RÉUSSI", file=sys.stdout)

            if obj.media_video:
                print(f"[ADMIN] Retour Cloudinary 'media_video' URL: {getattr(obj.media_video, 'url', 'Pas dURL')}", file=sys.stdout)
            
            if obj.url_code_source:
                print(f"[ADMIN] 'url_code_source' sauvegardé: {obj.url_code_source}", file=sys.stdout)
            else:
                print("[ADMIN] Pas de 'url_code_source' sauvegardé.", file=sys.stdout)

        except Exception as e:
            print(f"[ADMIN] ERREUR CRITIQUE PENDANT save_model: {type(e).__name__} - {e}", file=sys.stdout)
            raise
        finally:
            print("--- FIN LOGGING ADMIN SAVE_MODEL ---", file=sys.stdout)

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
            'fields': ('technologies', 'media_video', 'url_code_source')
        }),
    )
    list_display = ('titre', 'date_debut', 'institution', 'role')

@admin.register(ProjetPersonnel)
class ProjetPersonnelAdmin(BaseProjetAdmin):
    inlines = [MediaProjetPersonnelInline, TravailEffectueProjetPersoInline]

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