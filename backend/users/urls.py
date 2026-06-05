from django.urls import path
from .views import login_user
from .views import register_user
from .views import dashboard_data
from .views import getuserlist
from .views import update_user
from .views import view_user
from .views import delete_user
from .views import add_user
from .views import assign_task
from .views import task_list
from .views import task_detail
from .views import delete_task
from .views import create_task
from .views import my_tasks
from .views import add_comment
from .views import get_task_comments
from .views import get_unread_task_comments
from .views import mark_as_read
from .views import unread_comment_count
from .views import update_task_status
from .views import unread_status_notifications
from .views import unread_status_count
from .views import mark_status_read
urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('dashboard/', dashboard_data),
    path('users/', getuserlist),
    path("users/<int:id>/", update_user,name="update-users"),
    path("view/<int:user_id>/",view_user,name="view_user"),
    path("delete-user/<int:id>/", delete_user,name="delete-user"),
    path("adduser/", add_user, name="add-user"),
    path("tasks/", task_list, name="tasks-list"),
    path("view-task/<int:pk>/", task_detail,name="view-task"),
    path("delete-task/<int:pk>/", delete_task,name="delete"),
    path("createtask/", create_task, name="create-task"),
    path("tasks/<int:task_id>/assign/",assign_task,name="assign-task"),
    path("my-tasks/", my_tasks, name="my-tasks"),
    path("tasks/<int:task_id>/comments/",add_comment,name="add-comment"),
    path("get-taskcomment/<int:task_id>/", get_task_comments,name="get-taskcomment"),
    path("get-unreadcomment/", get_unread_task_comments,name="getunredcomment"),
    path("mark-as-read/",mark_as_read,name="markasread"),
    path("unread-taskcomment-count/", unread_comment_count),
    path("tasks/<int:task_id>/status/", update_task_status),
    path("unread-status-notifications/",unread_status_notifications),
    path("unread-status-count/",unread_status_count),
    path("mark-status-read/",mark_status_read),


]