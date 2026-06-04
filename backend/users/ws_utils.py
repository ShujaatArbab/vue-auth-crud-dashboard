from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializer import TaskCommentSerializer
def notify_comment_update(comment_data):
    channel_layer = get_channel_layer()

    

    async_to_sync(channel_layer.group_send)(
    "comments_global",
    {
        "type": "comment_message",   # MUST match consumer method name
        "data": comment_data
    }
)