from django.db import models
from django.contrib.auth.models import User
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
    role=models.CharField(max_length=50, default="user")

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
                                    ## Table Task ##
class Task(models.Model):
    title=models.CharField(max_length=200,unique=True)
    description=models.TextField(blank=True, null=True)
    assigned_to=models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="tasks",
         null=True,
         blank=True
    )
    status=models.CharField(
        max_length=20,
        choices=[
            ("pending","pending"),
            ("in_progress", "In Progress"),
            ("completed", "Completed"),
        ],
        default="pending"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.title
                                        ## Table TaskComment ##
class TaskComment(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    comment = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Comment by {self.user.username}"
class TaskStatusLog(models.Model):
    task = models.ForeignKey(
        Task,
        on_delete=models.CASCADE,
        related_name="status_logs"
    )

    updated_by = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    status = models.CharField(max_length=20)

    is_read = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    