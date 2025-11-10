# backend/core/urls.py

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

# Liste principale des routes du projet
urlpatterns = [
    # Route vers l'interface d'administration
    path('admin/', admin.site.urls),
    
    # Inclut toutes les routes de l'application 'api' sous le préfixe /api/
    path('api/', include('api.urls')),
]

# En mode DEBUG (développement), Django sert les fichiers média (uploads)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)