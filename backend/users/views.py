from rest_framework.views import APIView
from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes
)
from rest_framework.generics import RetrieveUpdateDestroyAPIView
from rest_framework import generics
from rest_framework.decorators import api_view 
from rest_framework.response import Response
from .serializer import RegisterSerializer
from .serializer import LoginSerializer
from .serializer import UserSerializer
from .serializer import UserUpdateSerializer
from .serializer import ViewSerializer
from .serializer import AddUserSerializer
from .serializer import TaskAssignSerializer
from .serializer import TaskListSerializer
from .serializer import TaskViewSerializer
from .serializer import CreateTaskSerializer
from .serializer import MyTaskSerializer
from .serializer import TaskCommentSerializer
from .serializer import TaskStatusUpdateSerializer
from .serializer import TaskStatusLogSerializer
from .ws_utils import notify_comment_update
from .ws_utils import notify_status_update
from rest_framework import status
from django.contrib.auth.hashers import check_password
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Task
from .models import TaskComment
from django.shortcuts import get_object_or_404
from .models import TaskStatusLog

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
                                     
def is_admin(user):
    return (
        user.is_authenticated and
        hasattr(user, "profile") and
        user.profile.role == "admin"
    )
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
            "status":False,
            "message":"invalid password"
        })
    if not user.email:
        return Response({
            "status":False,
            "message":"invalid email"   
        })

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
                "date_joined": user.date_joined,
                "role":user.profile.role
            }
        }
    }, status=status.HTTP_200_OK)
                                 ####   Dashboard  #####
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    if not is_admin(request.user):
        return Response({"detail": "Not allowed"}, status=403)

    users = User.objects.all()

    total_users = users.count()

    male = 0
    female = 0

    for u in users:
        gender = getattr(getattr(u, "profile", None), "gender", None)

        if gender:
            gender = gender.strip().lower()

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
                            #fetching users
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def getuserlist(request):
    if not is_admin(request.user):
        return Response({"detail": "Not allowed"}, status=403)

    users = User.objects.filter(profile__role="user").order_by('id')

    data = []

    for u in users:
        profile = getattr(u, "profile", None)

        data.append({
            "id": u.id,
            "username": u.username,
            "first_name": u.first_name,
            "last_name": u.last_name,
            "email": u.email,
            'date_joined':u.date_joined,

            "phone": profile.phone if profile else None,
            "country": profile.country if profile else None,
            "city": profile.city if profile else None,
            "dob": profile.dob if profile else None,
            "gender": profile.gender if profile else None,
        })

    return Response(data)

                        #Edit APi
@api_view(["PUT", "PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_user(request, id):
    user = get_object_or_404(User, id=id)

    serializer = UserUpdateSerializer(
        user,
        data=request.data,
        partial=request.method == "PATCH"
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)

@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def view_user(request, user_id):

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response({"success": False}, status=404)

    profile = getattr(user, "profile", None)

    return Response({
        "success": True,
        "data": {
            "id": user.id,
            "username": user.username,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,

            "phone": profile.phone if profile else None,
            "country": profile.country if profile else None,
            "city": profile.city if profile else None,
            "dob": profile.dob if profile else None,
            "gender": profile.gender if profile else None,
        }
    })
@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_user(request, id):
    user = get_object_or_404(User, id=id)
    user.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_user(request):
    serializer = AddUserSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(
            {"message": "User created successfully"},
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def assign_task(request, task_id):

    # 1. Only admin check
    if request.user.profile.role != "admin":
        return Response(
            {"error": "Only admin can assign tasks"},
            status=status.HTTP_403_FORBIDDEN
        )

    # 2. Get task
    try:
        task = Task.objects.get(id=task_id)
    except Task.DoesNotExist:
        return Response(
            {"error": "Task not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    # 3. Already assigned check
    if task.assigned_to_id:
        return Response(
            {"error": "Task already assigned"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 4. Get user from request
    user_id = request.data.get("assigned_to")

    if not user_id:
        return Response(
            {"error": "assigned_to is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # 5. Assign task
    try:
        task.assigned_to_id = user_id
        task.save()

    except Exception as e:
        return Response(
            {"error": str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    # 6. Success response
    return Response({
        "message": "Task assigned successfully",
        "task": {
            "id": task.id,
            "assigned_to": task.assigned_to_id
        }
    }, status=status.HTTP_200_OK)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def task_list(request):

    # admin sees all tasks
    if is_admin(request.user):
        tasks = Task.objects.all()
    else:
        tasks = Task.objects.filter(assigned_to=request.user)

    serializer = TaskListSerializer(tasks, many=True)

    return Response({
        "message": "Tasks Fetched Successfully",
        "data": serializer.data
    }, status=status.HTTP_200_OK)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def task_detail(request, pk):

    task = get_object_or_404(Task.objects.select_related("assigned_to"), id=pk)

    serializer = TaskViewSerializer(task)

    return Response({
        "message": "Task fetched Successfully",
        "data": serializer.data
    }, status=status.HTTP_200_OK)
@api_view(["DELETE"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def delete_task(request, pk):
    task = get_object_or_404(Task, id=pk)

    if not is_admin(request.user):
        return Response(
            {"error": "Not allowed"},
            status=status.HTTP_403_FORBIDDEN
        )

    task.delete()

    return Response(
        {"message": "Task deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def create_task(request):

    # Only admin allowed
    if request.user.profile.role != "admin":
        return Response(
            {"error": "Only admin can create tasks"},
            status=status.HTTP_403_FORBIDDEN
        )

    serializer = CreateTaskSerializer(data=request.data)

    if serializer.is_valid():
        task = serializer.save()

        return Response(
            {
                "message": "Task created successfully",
                "task": CreateTaskSerializer(task).data
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def my_tasks(request):

    tasks = Task.objects.filter(assigned_to=request.user).order_by("-id")

    serializer = MyTaskSerializer(tasks, many=True)

    return Response({
        "status":"True",
        "message":"Tasks fetched successfully",
        "data": serializer.data
    })
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def add_comment(request, task_id):

    task = get_object_or_404(Task, id=task_id)

    # permission check
    if not (request.user.profile.role == "admin" or task.assigned_to == request.user):
        return Response({"error": "Not allowed"}, status=403)

    serializer = TaskCommentSerializer(data=request.data)

    if serializer.is_valid():
        comment = serializer.save(
            user=request.user,
            task=task
        )

        # serialize clean output
        data = TaskCommentSerializer(comment).data

        notify_comment_update({
            "task_id": task.id,
            "comment": data,
            "user": request.user.username
        })

        return Response({
            "message": "Comment added successfully",
            "data": data
        }, status=201)

    return Response(serializer.errors, status=400)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_task_comments(request, task_id):
    comments = TaskComment.objects.filter(task_id=task_id).order_by("-created_at")
    serializer = TaskCommentSerializer(comments, many=True)
    return Response({"data": serializer.data}, status=status.HTTP_200_OK)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_unread_task_comments(request):

    comments = TaskComment.objects.filter(
        is_read=False
    ).order_by("-created_at")

    serializer = TaskCommentSerializer(comments, many=True)

    return Response({"data": serializer.data})
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def mark_as_read(request):
    TaskComment.objects.filter(is_read=False).update(is_read=True)
    return Response({"message": "marked"})
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def unread_comment_count(request):

    count = TaskComment.objects.filter(is_read=False).count()

    return Response({"count": count})
@api_view(["PATCH"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def update_task_status(request, task_id):

    task = get_object_or_404(Task, id=task_id)

    # ONLY assigned user can update
    if task.assigned_to != request.user:
        return Response({"error": "Not allowed"}, status=403)

    serializer = TaskStatusUpdateSerializer(task, data=request.data, partial=True)

    if serializer.is_valid():
        task = serializer.save()
        TaskStatusLog.objects.create(
        task=task,
        updated_by=request.user,
        status=task.status
)

        # send realtime notification to admin
        notify_status_update({
            "task_id": task.id,
            "status": task.status,
            "updated_by": request.user.username
        })

        return Response({
            "message": "Status updated successfully",
            "data": serializer.data
        })

    return Response(serializer.errors, status=400)
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def unread_status_notifications(request):

    logs = TaskStatusLog.objects.filter(
        is_read=False
    ).order_by("-created_at")

    serializer = TaskStatusLogSerializer(
        logs,
        many=True
    )

    return Response({
        "data": serializer.data
    })
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def unread_status_count(request):

    count = TaskStatusLog.objects.filter(
        is_read=False
    ).count()

    return Response({
        "count": count
    })
@api_view(["POST"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def mark_status_read(request):

    TaskStatusLog.objects.filter(
        is_read=False
    ).update(is_read=True)

    return Response({
        "message": "done"
    })
@api_view(["GET"])
@authentication_classes([JWTAuthentication])
@permission_classes([IsAuthenticated])
def get_my_task_comments(request,task_id):
    comments=TaskComment.objects.filter(
        task_id=task_id,
        user=request.user
        ).order_by("-created_at")
    serializer=TaskCommentSerializer(comments,many=True)
    return Response(
        {
            "data":serializer.data
        },
            status=status.HTTP_200_OK
        
    )