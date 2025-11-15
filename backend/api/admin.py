# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
import sys
from .models import (
    # NOUVEAU
    EvenementChronologique,
    MediaProjet,
    
    # CONSERVÉS
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
)
from django.contrib import messages

# --- MODÈLES CONSERVÉS ---

class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    list_display = ('nom', 'afficher_apercu_logo')
    
    def afficher_apercu_logo(self, competence):
        if competence.logo:
            return mark_safe(f'<img src="{competence.logo.url}" alt="{competence.nom}" height="40" >')
        return "Aucun logo"
    afficher_apercu_logo.short_description = 'Aperçu du Logo'

class PresentationAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde présentation", file=sys.stdout)
        if 'photo' in request.FILES:
            print(f"[ADMIN] Photo reçue: {request.FILES['photo'].name}", file=sys.stdout)
        super().save_model(request, obj, form, change)
        if obj.photo:
             print(f"[ADMIN] URL Photo après sauvegarde: {getattr(obj.photo, 'url', 'Pas dURL')}", file=sys.stdout)

class DiplomeAdmin(admin.ModelAdmin):
    list_display = ('titre', 'institution', 'afficher_parchemin')
    
    def afficher_parchemin(self, diplome):
        if diplome.parchemin:
            # Cloudinary renvoie 'image' même pour les PDF, donc l'URL est 'url'
            return mark_safe(f'<a href="{diplome.parchemin.url}" target="_blank">Voir justificatif</a>')
        return "Aucun justificatif"
    afficher_parchemin.short_description = 'Justificatif'


# --- NOUVEAU MODÈLE ---

class MediaProjetInline(admin.TabularInline):
    """
    Permet d'ajouter plusieurs photos (carrousel) directement
    sur la page d'un événement de type Projet.
    """
    model = MediaProjet
    extra = 1 # Affiche un slot vide par défaut
    verbose_name = "Média (Photo Projet)"
    verbose_name_plural = "Médias (Carrousel Photos)"


class EvenementChronologiqueAdmin(admin.ModelAdmin):
    """
    Personnalise l'admin pour 'EvenementChronologique'.
    Utilise 'fieldsets' et du JS pour afficher les champs conditionnels.
    """
    list_display = ('titre', 'type', 'date_debut', 'date_fin')
    list_filter = ('type',)
    search_fields = ('titre', 'description')
    
    inlines = [MediaProjetInline]

    # Définition des groupes de champs pour le JS
    fieldsets = (
        ('Informations Communes', {
            'fields': ('titre', 'type', 'date_debut', 'date_fin', 'description')
        }),
        # Chaque 'fieldset' suivant a une classe CSS (ex: 'grp-etudes')
        # que le JS utilisera pour afficher/masquer.
        ('Détails (Études)', {
            'classes': ('grp-etudes', 'grp-projets-etudiant', 'grp-diplome'),
            'fields': ('institution',)
        }),
        ('Détails (Études)', {
            'classes': ('grp-etudes',),
            'fields': ('description_formation', 'competences_acquises')
        }),
        ('Détails (Diplôme)', {
            'classes': ('grp-diplome',),
            'fields': ('url_parchemin',)
        }),
        ('Détails (Service Civique)', {
            'classes': ('grp-service-civique',),
            'fields': ('organisme_accueil', 'missions_principales')
        }),
        ('Détails (Projets)', {
            'classes': ('grp-projets-etudiant', 'grp-projets-professionnels', 'grp-projets-personnels'),
            'fields': ('role', 'technologies', 'media_video', 'url_code_source', 'travaux_details')
        }),
        ('Détails (Activité Rémunératrice)', {
            'classes': ('grp-activite-remuneratrice',),
            'fields': ('poste', 'missions_principales')
        }),
    )

    class Media:
        # Charge jQuery (fourni par Django) avant le script personnalisé
        js = (
            '//ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js', 
            'admin/js/evenement_admin.js', # Ce fichier sera créé à l'étape suivante
        )


# --- Enregistrement des modèles ---
admin.site.register(EvenementChronologique, EvenementChronologiqueAdmin)
admin.site.register(MediaProjet)
admin.site.register(Presentation, PresentationAdmin)
admin.site.register(PosteCible)
admin.site.register(Diplome, DiplomeAdmin) # Utilise le nouvel Admin
admin.site.register(CompetenceTechnologique, CompetenceTechnologiqueAdmin)