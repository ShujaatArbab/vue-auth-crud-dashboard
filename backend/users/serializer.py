from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile
from django.db import transaction
from .models import Task
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import UserProfile

class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField()

    class Meta:
        model = User
        fields = [
            'username',
            'first_name',
            'last_name',
            'email',
            'password',
        ]
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        required_fields = [
            'username',
            'password',
            'email',
            'first_name',
            'last_name'
        ]

        for field in required_fields:
            if not data.get(field):
                raise serializers.ValidationError({
                    field: f"{field} cannot be empty"
                })

        if User.objects.filter(email__iexact=data['email']).exists():
            raise serializers.ValidationError({
                "email": "Email already exists"
            })

        return data

    @transaction.atomic
    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        UserProfile.objects.create(user=user)

        return user

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        if not data.get('email'):
            raise serializers.ValidationError('Email cannot be empty')

        if not data.get('password'):
            raise serializers.ValidationError('Password cannot be empty')

        return data

class DashboardSerializer(serializers.ModelSerializer):
    gender = serializers.SerializerMethodField()

    def get_gender(self, obj):
        try:
            return obj.userprofile.gender
        except:
            return None
    
    class Meta:
        model=User
        fields=[
            "id",
            "username",
            "email",
            "date_joined",
            "gender"
        ]

class UserSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="userprofile.phone", read_only=True)
    country = serializers.CharField(source="userprofile.country", read_only=True)
    city = serializers.CharField(source="userprofile.city", read_only=True)
    dob = serializers.DateField(source="userprofile.dob", read_only=True)
    gender = serializers.CharField(source="userprofile.gender", read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "country",
            "city",
            "dob",
            "gender",
        ]
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserUpdateSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(source="userprofile.phone", required=False)
    country = serializers.CharField(source="userprofile.country", required=False)
    city = serializers.CharField(source="userprofile.city", required=False)
    dob = serializers.DateField(source="userprofile.dob", required=False)
    gender = serializers.CharField(source="userprofile.gender", required=False)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "country",
            "city",
            "dob",
            "gender",
        ]

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("userprofile", {})   # FIX HERE

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        profile, _ = UserProfile.objects.get_or_create(user=instance)

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

from rest_framework import serializers
from .models import User

class ViewSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(source="userprofile.phone", allow_null=True)
    country = serializers.CharField(source="userprofile.country", allow_null=True)
    city = serializers.CharField(source="userprofile.city", allow_null=True)
    dob = serializers.DateField(source="userprofile.dob", allow_null=True)
    gender = serializers.CharField(source="userprofile.gender", allow_null=True)

    is_active = serializers.BooleanField(read_only=True)

    class Meta:
        model = User

        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "email",
            "phone",
            "country",
            "city",
            "dob",
            "gender",
            "is_active"
        ]
class AddUserSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(write_only=True)
    country = serializers.CharField(write_only=True)
    city = serializers.CharField(write_only=True)
    gender = serializers.CharField(write_only=True)
    dob = serializers.DateField(write_only=True)

    confirmPassword = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            "username",
            "first_name",
            "last_name",
            "email",
            "password",
            "confirmPassword",
            "phone",
            "country",
            "city",
            "gender",
            "dob",
        ]

        extra_kwargs = {
            "password": {"write_only": True}
        }

    def validate(self, data):

        if data["password"] != data["confirmPassword"]:
            raise serializers.ValidationError({
                "confirmPassword": "Passwords do not match"
            })

        return data

    def create(self, validated_data):

        phone = validated_data.pop("phone")
        country = validated_data.pop("country")
        city = validated_data.pop("city")
        gender = validated_data.pop("gender")
        dob = validated_data.pop("dob")

        validated_data.pop("confirmPassword")

        password = validated_data.pop("password")

        user = User.objects.create(**validated_data)

        user.set_password(password)
        user.save()

        UserProfile.objects.create(
            user=user,
            phone=phone,
            country=country,
            city=city,
            gender=gender,
            dob=dob
        )

        return user
class TaskAssignSerializer(serializers.ModelSerializer):
    class Meta:
        model=Task
        fields="__all__"
        read_only_fields=["created_at","updated_at"]
    def validate(self,data):
        if not data.get("title"):
            raise serializers.ValidationError("Title is required")
        if not data.get("assigned_to"):
            raise serializers.ValidationError("User must be assigned")
        return data
class TaskListSerializer(serializers.ModelSerializer):
    assigned_to_name=serializers.CharField(source="assigned_to.username",read_only=True)
    class Meta:
        model=Task
        fields=[
            "id",
            "title",
            "description",
            "status",
            "assigned_to",
            "assigned_to_name",
            "created_at",
            "updated_at",
        ]