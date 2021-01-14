import os

from django.urls import path
from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from app import consumers

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "tictactoe.settings")

ws_urlpatterns = [
    path('ws/game/<room_code>/', consumers.GameRoom.as_asgi())
]

application = ProtocolTypeRouter({
  "http": get_asgi_application(),
  "websocket": AuthMiddlewareStack(
        URLRouter(
            ws_urlpatterns
        )
    ),
})