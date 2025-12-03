from django.contrib import admin
from django.contrib.contenttypes.admin import GenericTabularInline
from .models import (
    Presentation, SousTitrePresentation, PosteCible, Diplome,
    SectionCompetence, CompetenceTechnologique,
    Formation, ActiviteProfessionnelle, ServiceCivique,
    Projet, MediaProjet, DetailEvenement
)

class DetailEvenementInline(GenericTabularInline):
    model = DetailEvenement
    extra = 0

class MediaProjetInline(admin.TabularInline):
    model = MediaProjet
    extra = 1

class SousTitrePresentationInline(admin.StackedInline):
    model = SousTitrePresentation
    extra = 0

class CompetenceInline(admin.TabularInline):
    model = CompetenceTechnologique
    extra = 0

@admin.register(Presentation)
class PresentationAdmin(admin.ModelAdmin):
    inlines = [SousTitrePresentationInline]

@admin.register(SectionCompetence)
class SectionCompetenceAdmin(admin.ModelAdmin):
    inlines = [CompetenceInline]
    list_display = ('titre', 'ordre')
    list_editable = ('ordre',)

@admin.register(ActiviteProfessionnelle)
class ActiviteAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('poste', 'date_debut')

@admin.register(ServiceCivique)
class ServiceAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('mission', 'organisme_accueil')

@admin.register(Formation)
class FormationAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline]
    list_display = ('titre', 'institution')

@admin.register(Projet)
class ProjetAdmin(admin.ModelAdmin):
    inlines = [DetailEvenementInline, MediaProjetInline]
    list_display = ('titre', 'categorie', 'date_debut')
    list_filter = ('categorie', 'technologies')
    filter_horizontal = ('technologies',)

admin.site.register(PosteCible)
admin.site.register(Diplome)
admin.site.register(CompetenceTechnologique)