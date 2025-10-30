# backend/api/admin.py 

from django.contrib import admin
from django.utils.html import mark_safe
from .models import (
    Project,
    Presentation,
    PosteCible,
    Diplome,
    CompetenceTechnologique,
    Parcours,
    WorkDone,
)


class WorkDoneInline(admin.TabularInline):
    """Permet d'éditer les objets 'WorkDone' directement depuis la page d'un 'Project'."""
    model = WorkDone
    extra = 1


class ProjectAdmin(admin.ModelAdmin):
    """Personnalise l'interface d'administration pour le modèle Project."""
    inlines = [WorkDoneInline]
    filter_horizontal = ('technologies',)


class CompetenceTechnologiqueAdmin(admin.ModelAdmin):
    """Personnalise l'affichage en liste du modèle CompetenceTechnologique."""
    list_display = ('nom', 'display_logo_preview')
    
    def display_logo_preview(self, obj):
        """Affiche un petit aperçu du logo dans la liste de l'interface d'administration."""
        if obj.logo:
            return mark_safe(f'<img src="{obj.logo.url}" alt="{obj.nom}" height="40" />')
        return "Aucun logo"
    display_logo_preview.short_description = 'Aperçu du Logo'


# --- Enregistrement des modèles sur le site d'administration Django ---
# Rend les modèles accessibles et gérables depuis l'URL /admin/.

admin.site.register(Project, ProjectAdmin)
admin.site.register(Presentation)
admin.site.register(PosteCible)
admin.site.register(Diplome)
admin.site.register(CompetenceTechnologique, CompetenceTechnologiqueAdmin)
admin.site.register(Parcours)
admin.site.register(WorkDone)