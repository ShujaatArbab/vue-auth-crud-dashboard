from django.urls import path
from .consumers import TaskCommentConsumer

websocket_urlpatterns = [
    path("ws/tasks/<int:task_id>/comments/", TaskCommentConsumer.as_asgi()),
]