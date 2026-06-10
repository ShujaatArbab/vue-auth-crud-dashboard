import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class CommentConsumer(AsyncWebsocketConsumer):

    @database_sync_to_async
    def get_user_role(self, user):
        return user.profile.role

    async def connect(self):
        user = self.scope["user"]

        if not user or user.is_anonymous:
            await self.close()
            return

        role = await self.get_user_role(user)

        if role == "admin":
            self.group_name = "admin_notifications"
        else:
            self.group_name = f"user_{user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def new_comment(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_comment",
            "task_id": event["task_id"],
            "task_title": event.get("task_title"),
            "comment_id": event.get("comment_id"),
            "comment": event.get("comment"),
            "user_name": event.get("user_name"),
        }))

    async def status_updated(self, event):
        await self.send(text_data=json.dumps({
            "type": "status_updated",
            "task_id": event["task_id"],
            "status": event["status"],
            "updated_by": event["updated_by"]
        }))