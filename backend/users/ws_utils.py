from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializer import TaskCommentSerializer
def notify_comment_update(comment_data):
    channel_layer = get_channel_layer()

    

    async_to_sync(channel_layer.group_send)(
    "comments_global",
    {
            "type": "new_comment",                    #  MUST match consumer method
            "task_id": comment_data["task_id"],
            "comment": comment_data["comment"],
            "user": comment_data.get("user")
        }
)
def notify_status_update(data):
    channel_layer = get_channel_layer()

    async_to_sync(channel_layer.group_send)(
        "comments_global",  # or create "tasks_global"
        {
            "type": "status_updated",
            "task_id": data["task_id"],
            "status": data["status"],
            "updated_by": data["updated_by"]
        }
    )