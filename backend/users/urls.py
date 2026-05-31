from django.urls import path
from .views import login_user, register_user,dashboard_data,getuserlist
from .views import UserUpdateAPIView
from .views import view_user
from .views import UserDetailAPIView
from .views import AddUserAPIView
from .views import AssignTaskApi
from .views import TaskListApi
urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('dashboard/', dashboard_data),
    path('users/', getuserlist),
    path("users/<int:id>/", UserUpdateAPIView.as_view()),
    path("view/<int:user_id>/",view_user,name="view_user"),
    path("delete/<int:id>/", UserDetailAPIView.as_view()),
    path("adduser/", AddUserAPIView.as_view(), name="add-user"),
    path("assign-task/", AssignTaskApi.as_view(), name="assign-task"),
    path("get-task/", TaskListApi.as_view(), name="get-task"),
]