# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
import sys
from .models import (
    Projet,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
    TravailEffectue,
)


class TravailEffectueInline(admin.TabularInline):
    model = TravailEffectue
    extra = 1 


class ProjetAdmin(admin.ModelAdmin):
    inlines = [TravailEffectueInline]
    filter_horizontal = ('technologies',)

    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde du projet: {obj.titre}", file=sys.stdout)
        if 'video' in request.FILES:
            print(f"[ADMIN] Fichier vidéo reçu dans la requête: {request.FILES['video'].name}", file=sys.stdout)
            print(f"[ADMIN] Taille vidéo: {request.FILES['video'].size}", file=sys.stdout)
        else:
            print("[ADMIN] Pas de fichier vidéo dans request.FILES", file=sys.stdout)
        
        super().save_model(request, obj, form, change)
        
        if obj.video:
             print(f"[ADMIN] URL Vidéo après sauvegarde: {getattr(obj.video, 'url', 'Pas d\'URL')}", file=sys.stdout)


class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'afficher_apercu_logo')
    
    def afficher_apercu_logo(self, competence):
        if competence.logo:
            return mark_safe(f'<img src="{competence.logo.url}" alt="{competence.nom}" height="40" />')
        return "Aucun logo"
    afficher_apercu_logo.short_description = 'Aperçu du Logo'

    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde compétence: {obj.nom}", file=sys.stdout)
        if 'logo' in request.FILES:
             print(f"[ADMIN] Fichier logo reçu: {request.FILES['logo'].name}", file=sys.stdout)
        
        super().save_model(request, obj, form, change)
        
        if obj.logo:
            print(f"[ADMIN] URL Logo après sauvegarde: {getattr(obj.logo, 'url', 'Pas d\'URL')}", file=sys.stdout)


class PresentationAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde présentation", file=sys.stdout)
        if 'photo' in request.FILES:
            print(f"[ADMIN] Photo reçue: {request.FILES['photo'].name}", file=sys.stdout)
        super().save_model(request, obj, form, change)
        if obj.photo:
             print(f"[ADMIN] URL Photo après sauvegarde: {getattr(obj.photo, 'url', 'Pas d\'URL')}", file=sys.stdout)


admin.site.register(Projet, ProjetAdmin)
admin.site.register(Presentation,QN=PresentationAdmin)
admin.site.register(PosteCible)
admin.site.register(Diplome)
admin.site.register(CompetenceTechnologique, CompetenceTechnologiqueAdmin)
admin.site.register(Parcours)