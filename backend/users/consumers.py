import json
from channels.generic.websocket import AsyncWebsocketConsumer


class CommentConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.group_name = "comments_global"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def new_comment(self, event):
        await self.send(text_data=json.dumps({
            "type": "new_comment",
            "task_id": event["task_id"],
            "comment": event["comment"],
            "user": event.get("user")
        }))