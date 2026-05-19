from django.urls import path
from .views import login_user, register_user,dashboard_data

urlpatterns = [
    path('login/', login_user),
    path('register/', register_user),
    path('dashboard/', dashboard_data),

]