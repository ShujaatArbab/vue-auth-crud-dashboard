from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializer import TaskCommentSerializer
def notify_comment_update(comment):
    channel_layer = get_channel_layer()

    if channel_layer is None:
        print(" CHANNEL LAYER NOT CONFIGURED")
        return

    data = TaskCommentSerializer(comment).data

    async_to_sync(channel_layer.group_send)(
        f"task_{comment.task.id}",
        {
            "type": "comment_message",
            "data": data
        }
    )