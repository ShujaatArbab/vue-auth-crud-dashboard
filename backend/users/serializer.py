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

        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({
                "password": list(e.messages)
            })

        return data

    @transaction.atomic
    def create(self, validated_data):
        phone = validated_data.pop('phone', None)
        country = validated_data.pop('country', None)
        city = validated_data.pop('city', None)
        dob = validated_data.pop('dob', None)
        gender = validated_data.pop('gender', None)

        user = User.objects.create_user(
            username=validated_data['username'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            password=validated_data['password'],
        )

        UserProfile.objects.create(
    user=user
)

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
    class Meta:
        model=User
        fields=['id','username','email','date_joined']

from django.contrib.auth.models import User
from rest_framework import serializers
from .models import UserProfile


class UserUpdateSerializer(serializers.ModelSerializer):
    phone = serializers.CharField(source="profile.phone", required=False)
    country = serializers.CharField(source="profile.country", required=False)
    city = serializers.CharField(source="profile.city", required=False)
    dob = serializers.DateField(source="profile.dob", required=False)
    gender = serializers.CharField(source="profile.gender", required=False)

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
        profile_data = validated_data.pop("profile", {})

        # update User table
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # update UserProfile table
        profile, _ = UserProfile.objects.get_or_create(user=instance)

        for attr, value in profile_data.items():
            setattr(profile, attr, value)
        profile.save()

        return instance

from rest_framework import serializers
from .models import User

class ViewSerializer(serializers.ModelSerializer):

    phone = serializers.CharField(source="profile.phone", allow_null=True)
    country = serializers.CharField(source="profile.country", allow_null=True)
    city = serializers.CharField(source="profile.city", allow_null=True)
    dob = serializers.DateField(source="profile.dob", allow_null=True)
    gender = serializers.CharField(source="profile.gender", allow_null=True)

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