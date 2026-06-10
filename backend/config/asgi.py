"""
ASGI config for config project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/6.0/howto/deployment/asgi/
"""

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from users.middleware import JWTAuthMiddleware
from users.routing import websocket_urlpatterns
import users

print("WEBSOCKET ROUTES IMPORTED")

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

#  THIS WAS MISSING
django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(users.routing.websocket_urlpatterns)
    ),
})