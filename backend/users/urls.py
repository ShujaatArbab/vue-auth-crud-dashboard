from django.urls import path
from .views import login_user, register_user,dashboard_data,getuserlist
from .views import UserUpdateAPIView
from .views import view_user
from .views import UserDetailAPIView
from .views import AddUserAPIView
from .views import AssignTaskApi
from .views import TaskListApi
from .views import TaskViewApi
from .views import TaskDetailApi
from .views import CreateTaskApi
from .views import my_tasks
from .views import add_comment
urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('dashboard/', dashboard_data),
    path('users/', getuserlist),
    path("users/<int:id>/", UserUpdateAPIView.as_view()),
    path("view/<int:user_id>/",view_user,name="view_user"),
    path("delete/<int:id>/", UserDetailAPIView.as_view()),
    path("adduser/", AddUserAPIView.as_view(), name="add-user"),
    path("tasks/", TaskListApi.as_view(), name="tasks"),
    path("view-task/<int:pk>/", TaskViewApi.as_view()),
    path("tasks/<int:id>/", TaskDetailApi.as_view()),
    path("createtask/", CreateTaskApi.as_view(), name="create-task"),
    path("tasks/<int:task_id>/assign/",AssignTaskApi.as_view(),name="assign-task"),
    path("my-tasks/", my_tasks, name="my-tasks"),
    path("tasks/<int:task_id>/comments/",add_comment,name="add-comment"),

    
]