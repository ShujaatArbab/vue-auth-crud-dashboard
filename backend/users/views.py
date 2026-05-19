from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
)
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from .serializer import RegisterSerializer
from .serializer import LoginSerializer
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# class InfoApi(APIView):
#     def get(self, request):
#         queryset = Info.objects.all()
#         serializer = InfoSerializer(queryset, many=True)

#         return Response({
#             "status": True,
#             "data": serializer.data
#         })
 

# class LoginApi(APIView):
#     def post(self, request):
#         serializer = LoginSerializer(data=request.data)

#         if not serializer.is_valid():
#             return Response({
#                 "status": False,
#                 "message": "Invalid input",
#                 "errors": serializer.errors
#             })

#         email = serializer.validated_data['email']
#         password = serializer.validated_data['password']

#         user = Login.objects.filter(email=email).first()

#         if user is None:
#             return Response({
#                 "status": False,
#                 "message": "Email not found"
#             })

#         if user.password == password:
#             return Response({
#                 "status": True,
#                 "message": "Login successful",
#                 "data": {
#                     "id": user.id,
#                     "email": user.email
#                 }
#             })

#         return Response({
#             "status": False,
#             "message": "Invalid credentials"
#         })


# class SignupApi(APIView):




    # def post(self, request):
    #     serializer = SignupSerializer(data=request.data)

    #     if not serializer.is_valid():
    #         return Response({
    #             "status": False,
    #             "message": "Validation failed",
    #             "errors": serializer.errors
    #         })

    #     name = serializer.validated_data['name']
    #     email = serializer.validated_data['email']
    #     phone = serializer.validated_data['phone']
    #     password = serializer.validated_data['password']

    #     # check email already exists
    #     if Signup.objects.filter(email=email).exists():
    #         return Response({
    #             "status": False,
    #             "message": "Email already exists"
    #         })

    #     # create user
    #     user = Signup.objects.create(
    #         name=name,
    #         email=email,
    #         phone=phone,
    #         password=make_password(password)
    #     )

    #     return Response({
    #         "status": True,
    #         "message": "User Registered Successfully",
    #         "data": {
    #             "id": user.id,
    #             "name": user.name,
    #             "email": user.email,
    #             "phone": user.phone
    #         }
    #     })
                                     
                                     # 
                                                ####   Dashboard  #####
@api_view(['POST'])
def register_user(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():

        # Save user
        user = serializer.save()

        # Generate JWT Tokens
        refresh = RefreshToken.for_user(user)

        return Response({
            "status": True,
            "message": "User Registered Successfully",
            "data": {
                "access": str(refresh.access_token),
                "refresh": str(refresh),

                "user": {
                    "id": user.id,
                    "username": user.username,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "email": user.email,
                    "date_joined": user.date_joined
                }
            }
        }, status=status.HTTP_201_CREATED)

    return Response({
        "status": False,
        "message": "Validation Failed",
        "errors": serializer.errors
    }, status=status.HTTP_400_BAD_REQUEST)
                                             ####   login  #####
@api_view(['POST'])
def login_user(request):
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response({
            "status": False,
            "message": "Validation Failed",
            "errors": serializer.errors
        }, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data['email']
    password = serializer.validated_data['password']

    try:
        user = User.objects.get(email=email)
    except User.DoesNotExist:
        return Response({
            "status": False,
            "message": "Email not Found"
        }, status=status.HTTP_404_NOT_FOUND)

    if not user.check_password(password):
        return Response({
            "status": False,
            "message": "Invalid Credentials"
        }, status=status.HTTP_401_UNAUTHORIZED)

    # 🔥 GENERATE JWT TOKEN
    refresh = RefreshToken.for_user(user)

    return Response({
        "status": True,
        "message": "Login successful",
        "data": {
            "access": str(refresh.access_token),
            "refresh": str(refresh),

            "user": {
                "id": user.id,
                "username": user.username,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "date_joined": user.date_joined
            }
        }
    }, status=status.HTTP_200_OK)
                                 ####   Dashboard  #####
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_data(request):

    users = User.objects.all()

    total_users = users.count()

    male = 0
    female = 0

    for u in users:
        try:
            gender = u.userprofile.gender
        except:
            gender = None

        if gender == "male":
            male += 1
        elif gender == "female":
            female += 1

    return Response({
        "status": True,
        "data": {
            "summary": {
                "total_users": total_users,
                "male": male,
                "female": female
            },
            "user": {
                "id": request.user.id,
                "username": request.user.username,
                "email": request.user.email,
                "date_joined": request.user.date_joined
            }
        }
    })