from django.urls import re_path
from .consumers import CommentConsumer
print("TASK ROUTING LOADED")
websocket_urlpatterns = [
    re_path(r"ws/comments/", CommentConsumer.as_asgi()),
]