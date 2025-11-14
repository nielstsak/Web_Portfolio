# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
import sys
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
from django.contrib import messages


# --- MODÈLES CONSERVÉS ---

class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    """Personnalise l'affichage en liste du modèle CompetenceTechnologique."""
    list_display = ('nom', 'afficher_apercu_logo')
    
    def afficher_apercu_logo(self, competence):
        """Affiche un petit aperçu du logo dans la liste de l'interface d'administration."""
        if competence.logo:
            return mark_safe(f'<img src="{competence.logo.url}" alt="{competence.nom}" height="40" >')
        return "Aucun logo"
    afficher_apercu_logo.short_description = 'Aperçu du Logo'

    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde compétence: {obj.nom}", file=sys.stdout)
        if 'logo' in request.FILES:
             print(f"[ADMIN] Fichier logo reçu: {request.FILES['logo'].name}", file=sys.stdout)
        
        super().save_model(request, obj, form, change)
        
        if obj.logo:
            print(f"[ADMIN] URL Logo après sauvegarde: {getattr(obj.logo, 'url', 'Pas dURL')}", file=sys.stdout)


class PresentationAdmin(admin.ModelAdmin):
    def save_model(self, request, obj, form, change):
        print(f"[ADMIN] Tentative de sauvegarde présentation", file=sys.stdout)
        if 'photo' in request.FILES:
            print(f"[ADMIN] Photo reçue: {request.FILES['photo'].name}", file=sys.stdout)
        super().save_model(request, obj, form, change)
        if obj.photo:
             print(f"[ADMIN] URL Photo après sauvegarde: {getattr(obj.photo, 'url', 'Pas dURL')}", file=sys.stdout)

# NOUVELLE CONFIG (pour le champ 'parchemin' ajouté)
class DiplomeAdmin(admin.ModelAdmin):
    list_display = ('titre', 'institution', 'afficher_parchemin')
    
    def afficher_parchemin(self, diplome):
        if diplome.parchemin:
            return mark_safe(f'<a href="{diplome.parchemin.url}" target="_blank">Voir justificatif</a>')
        return "Aucun justificatif"
    afficher_parchemin.short_description = 'Justificatif'

# --- NOUVEAU MODÈLE ---

class EvenementChronologiqueAdmin(admin.ModelAdmin):
    """Configuration de base pour le nouveau modèle chronologique."""
    list_display = ('titre', 'type', 'date_debut', 'date_fin')
    list_filter = ('type',)
    search_fields = ('titre', 'description', 'specificites')
    
    # Instructions pour l'édition du JSON (rappel)
    fieldsets = (
        (None, {
            'fields': ('titre', 'type', 'date_debut', 'date_fin', 'description')
        }),
        ('Données Spécifiques (JSON)', {
            'classes': ('collapse',),
            'fields': ('specificites',),
            'description': """
                <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; margin-top: 10px;">
                    <strong>Rappel de la structure JSON attendue par type :</strong>
                    <ul>
                        <li><strong>Etudes:</strong> {"institution": "...", "description_formation": "...", "competences_acquises": ["..."]}</li>
                        <li><strong>Diplome:</strong> {"institution": "...", "url_parchemin": "..."}</li>
                        <li><strong>Service civique:</strong> {"organisme_accueil": "...", "missions_principales": ["..."]}</li>
                        <li><strong>Projets (Tous):</strong> {"role": "...", "technologies": ["..."], "media": {"url_video": "..." ou "urls_photos": ["..."]}, "url_code_source": "...", "travaux_details": [{"sous_titre": "...", "description": "..."}]}</li>
                        <li><strong>Activité rémunératrice:</strong> {"poste": "...", "missions_principales": ["..."]}</li>
                    </ul>
                </div>
            """
        }),
    )

# --- SUPPRESSIONS (retirées) ---
# TravailEffectueInline
# ProjetAdmin

# --- Enregistrement des modèles sur le site d'administration Django ---
admin.site.register(EvenementChronologique, EvenementChronologiqueAdmin) # NOUVEAU
admin.site.register(Presentation, PresentationAdmin)
admin.site.register(PosteCible)
admin.site.register(Diplome, DiplomeAdmin) # MIS A JOUR
admin.site.register(CompetenceTechnologique, CompetenceTechnologiqueAdmin)

# SUPPRIMÉS
# admin.site.register(Projet, ProjetAdmin)
# admin.site.register(Parcours)