from .serializers import UserSerializer,ProfileDataSerializer, FollowDataSerializer, NotificationSerializer, SearchSerializer
from django.contrib.auth import authenticate, login
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth import login as django_login
from rest_framework.response import Response
from rest_framework.decorators import api_view
from whisper_app.backends import CustomUserBackend
from whisper_app.models import WhisperUser, Post, Follow, Offset, Notification,Username
from django.shortcuts import get_object_or_404
from django.core.mail import send_mail
from django.conf import settings
from rest_framework import status
from itertools import chain
from .language import generate_verification_message
import asyncio
import random
import uuid


@api_view(['POST'])
def register(request):
    if request.method == 'POST':
        
        language = request.data.get('language')
        username = request.data.get('username')
        notification = Notification.objects.create(username=username,category="checkverification")
        
        if Username.objects.filter(username__exact=username).exists():
        
            obj = get_object_or_404(Username, username=username)
            

            if obj.image:
                obj.image.delete(save=False)
                obj.image = None
                
            obj.save()
            obj.delete()


        
        code = str(uuid.uuid4()).replace("-", "")[:20]
        title = "VERIFICATION"
        message = generate_verification_message(language, code)
        email = request.data.get('email')

        try:
            send_mail(title,"",settings.EMAIL_HOST_USER,[email],html_message=message,fail_silently=False)
        except:
            print("wrong email")
            
            
            
        data = {'username': request.data.get('username'),
                'email': request.data.get('email'),
                'password':request.data.get('password'),
                'image': None,
                'code': code
                }

        serializer = UserSerializer(data=data)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
            


@api_view(['POST'])
def login(request):
    if request.method == 'POST':
        user_obj = WhisperUser.objects.filter(username=request.data.get('username')).first()

        if user_obj is not None:
            credentials = {
                'username': user_obj.username,
                'password': request.data.get('password')
            }

            
            user = authenticate(**credentials)

            if user:
                print(request.user)
                user_serializer = UserSerializer(user)
                return Response(user_serializer.data)
            else:
                return Response({'error': 'Invalid credentials.'}, status=400)
        
        else:
            return Response({'error': 'User not found.'}, status=400)

@api_view(['POST'])
def logout(request):
    print(request.user)
    return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)



@api_view(['GET'])
def getProfileData(request):
    
    username = request.query_params.get('username')

    if username:
        queryset = Post.objects.filter(username=username).order_by('-id')
    else:
        queryset = []

    
    serializer = ProfileDataSerializer(queryset, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getSearchFollowingUsers(request):
    username = request.query_params.get('username')
    data = Username.objects.all().exclude(username=username).values('id','username', 'image')
    data2 = WhisperUser.objects.all().exclude(username=username).values('id','username', 'image')

    for d in data:
        d['source'] = 'Username'
    for d2 in data2:
        d2['source'] = 'WhisperUser'

    combined_data = list(chain(data, data2))
    for idx, item in enumerate(combined_data, start=1):
        item['id'] = idx
    
    u_data = {obj['username']: obj for obj in combined_data}.values()

    return Response(u_data)


@api_view(['POST'])
def sendMessage(request):
    if request.method == 'POST':
        serializer = ProfileDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def follow(request):
    if request.method == 'POST':
        following = request.data.get('following')
        follower = request.data.get('follower')
        text = f"{follower}"
        serializer = FollowDataSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            notification = Notification.objects.create(text=text,username=following,category="follow")
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def unfollow(request):
    follower = request.query_params.get('follower')
    following = request.query_params.get('following')
    instance = get_object_or_404(Follow, follower=follower, following=following)
    instance.delete()
    return Response({"message": "relation deleted"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def checkfollow(request):
    follower = request.query_params.get('follower')
    following = request.query_params.get('following')
    result = Follow.objects.filter(follower=follower, following=following)
    if result.exists():
        return Response({"message": "True"}, status=status.HTTP_200_OK)
    else:
        return Response({"message": "False"}, status=status.HTTP_200_OK)

@api_view(['GET'])
def getNumbers(request):
    follower = request.query_params.get('username')

    followers = Follow.objects.filter(following=follower)
    followings = Follow.objects.filter(follower=follower)
    followers = followers.count()
    followings = followings.count()

    data = {
                'followers': str(followers),
                'followings': str(followings)
            }


    return Response(data)


@api_view(['GET'])
def feed(request):
    follower = request.query_params.get('username')
    followings = Follow.objects.filter(follower=follower).order_by("-id")
    data = []
    sorted_data = []
    followers = []

    for u in followings:
        p = Post.objects.filter(username=u).order_by('-time').first()
        if p:
            followers.append(p.username)
    

    offset_obj = Offset.objects.first()
    offset = offset_obj.value

    limit = 10
    total_count = len(followers)

    if (offset + limit) > total_count:
        offset = 0
    
    for f in followers[offset:offset+limit]:
        post = Post.objects.filter(username=f).order_by('-time').first()
       
        user = Username.objects.filter(username=f).first()
        user2 = WhisperUser.objects.filter(username=f).first()

        if user2 and user2.image: 
            user_image_url = str(user2.image) 
        elif user and user.image:
            user_image_url = str(user.image)
        else:
            user_image_url = None

        new_dict = {
            'id': post.id,
            'userprofile': str(user_image_url),
            'text': post.text,
            'image': str(post.image),
             'username': post.username,
        }
        data.append(new_dict)
        sorted_data = sorted(data, key=lambda x: x['id'], reverse=True)

    offset_obj.value = offset + limit
    offset_obj.save()

    return Response(sorted_data)

@api_view(['GET'])
def getNotification(request):
     user = request.query_params.get('username')
     notifications = Notification.objects.filter(username=user).order_by('-id')
     serializer = NotificationSerializer(notifications, many=True)
     return Response(serializer.data)

@api_view(['GET'])
def checkuser(request):
     username = request.query_params.get('username')
     user = WhisperUser.objects.filter(username=username)
     if user.exists():
        return Response({"message": "True"}, status=status.HTTP_200_OK)
     else:
        return Response({"message": "False"}, status=status.HTTP_200_OK)


@api_view(['POST'])
def uploadProfileImage(request):
    if request.method == 'POST':
        username = request.data.get('username')
        image = request.data.get('image')
        if username:
            try:
                user = WhisperUser.objects.get(username=username)
            except WhisperUser.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = UserSerializer(user, data={'image': image}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Username not provided."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def deleteProfileImage(request):
    username = request.query_params.get('username')
    obj = WhisperUser.objects.get(username=username)

    if obj.image:
        obj.image.delete(save=False)
        obj.image = None
        
    obj.save()

    return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
def addUserToSearch(request):
    username = request.query_params.get('username')

    if not Username.objects.filter(username__exact=username).exists() and not WhisperUser.objects.filter(username__exact=username).exists():
                    search = Username.objects.create(username=username)
    
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['POST'])
def uploadUknownProfileImage(request):
    if request.method == 'POST':
        username = request.data.get('username')
        image = request.data.get('image')
        if username:
            try:
                user = Username.objects.get(username=username)
            except Username.DoesNotExist:
                return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
            
            serializer = SearchSerializer(user, data={'image': image}, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error": "Username not provided."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def getUserProfileImage(request):
    username = request.query_params.get('username')

    try:
        username_obj = Username.objects.get(username=username)
        if username_obj.image:
            response_data = {
                "image": str(username_obj.image)
            }
            return Response(response_data)
    except Username.DoesNotExist:
        pass 

    try:
        whisper_user_obj = WhisperUser.objects.get(username=username)
        if whisper_user_obj.image:
            response_data = {
                "image": str(whisper_user_obj.image)
            }
            return Response(response_data)
    except WhisperUser.DoesNotExist:
        pass  

    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(['GET'])
def user_database_exists(request):
    username = request.query_params.get('username')
    user_in_model1 = WhisperUser.objects.filter(username=username).exists()
    user_in_model2 = Username.objects.filter(username=username).exists()

    if user_in_model1 or user_in_model2:
        return Response({"message": "True"}, status=status.HTTP_200_OK)

    return Response({"message": "False"}, status=status.HTTP_200_OK)




    

