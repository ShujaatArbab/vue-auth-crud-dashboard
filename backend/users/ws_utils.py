from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .serializer import TaskCommentSerializer
def notify_comment_update(comment_data):

    channel_layer = get_channel_layer()

    payload = {
        "type": "new_comment",
        "task_id": comment_data["task_id"],
        "task_title": comment_data["task_title"],
        "comment_id": comment_data["comment_id"],
        "comment": comment_data["comment_text"],
        "user_name": comment_data["user_name"],
        "sender_id": comment_data.get("sender_id"),
        "target_user_id": comment_data.get("target_user_id"),
    }

    sender_id = comment_data.get("sender_id")

    # ADMIN group
    async_to_sync(channel_layer.group_send)(
        "admin_notifications",
        payload
    )

    # USER group (BUT exclude sender)
    if comment_data.get("target_user_id") and comment_data["target_user_id"] != sender_id:
        async_to_sync(channel_layer.group_send)(
            f"user_{comment_data['target_user_id']}",
            payload
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