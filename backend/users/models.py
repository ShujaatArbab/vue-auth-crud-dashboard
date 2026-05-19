from django.db import models
from django.contrib.auth.models import User
#Create your models here.
# class Info(models.Model):
#     name=models.CharField(max_length=100)
#     email=models.EmailField()
#     phone=models.CharField(max_length=15)

# class Login(models.Model):
#     email=models.EmailField()
#     password=models.CharField(max_length=50)
# class Signup(models.Model):
#     name=models.CharField(max_length=50)
#     email=models.EmailField()
#     phone = models.CharField(max_length=15)
#     password=models.CharField(max_length=50)

from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name="profile"
    )

    phone = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    dob = models.DateField(blank=True, null=True)

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.user.username