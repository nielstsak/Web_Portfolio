# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
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
    """Permet d'éditer les objets 'TravailEffectue' directement depuis la page d'un 'Projet'."""
    model = TravailEffectue
    extra = 1 # Affiche un champ vide par défaut


class ProjetAdmin(admin.ModelAdmin):
    """Personnalise l'interface d'administration pour le modèle Projet."""
    inlines = [TravailEffectueInline]
    # Utilise un widget plus pratique pour les champs 'ManyToManyField'
    filter_horizontal = ('technologies',)


class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    """Personnalise l'affichage en liste du modèle CompetenceTechnologique."""
    list_display = ('nom', 'afficher_apercu_logo')
    
    def afficher_apercu_logo(self, competence):
        """Affiche un petit aperçu du logo dans la liste de l'interface d'administration."""
        if competence.logo:
            # Affiche l'image de manière sécurisée dans l'admin
            return mark_safe(f'<img src="{competence.logo.url}" alt="{competence.nom}" height="40" />')
        return "Aucun logo"
    afficher_apercu_logo.short_description = 'Aperçu du Logo'


# --- Enregistrement des modèles sur le site d'administration Django ---
# Rend les modèles accessibles et gérables depuis l'URL /admin/.

admin.site.register(Projet, ProjetAdmin)
admin.site.register(Presentation)
admin.site.register(PosteCible)
admin.site.register(Diplome)
admin.site.register(CompetenceTechnologique, CompetenceTechnologiqueAdmin)
admin.site.register(Parcours)
