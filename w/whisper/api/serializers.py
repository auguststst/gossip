from rest_framework import serializers
from whisper_app.models import WhisperUser, Post, Follow,Notification,Username
from django.contrib.auth.hashers import make_password
from rest_framework_jwt.settings import api_settings
from django.core.files.uploadedfile import InMemoryUploadedFile
from django.utils import timezone
from PIL import Image
from io import BytesIO
import os


def convert_to_webp(image_bytes):
    image = Image.open(BytesIO(image_bytes))
    output_buffure = BytesIO()
    image.save(output_buffure, format='webp')
    return output_buffure.getvalue()

def delete_image(file_path):
    
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Deleted image: {file_path}")
        else:
            print(f"Image not found: {file_path}")
    

class UserSerializer(serializers.ModelSerializer):
    
    token = serializers.SerializerMethodField()

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None: 
            instance.password = make_password(password)
        instance.save()
        return instance

    def update(self, instance, validated_data):
    
        image_file = validated_data.get('image', None)
        if image_file:
            
            username = instance.username
            file_name = f'{username}_{image_file.name}'

            image_bytes = image_file.read()
            converted_image_bytes = convert_to_webp(image_bytes)

            if converted_image_bytes:
                if instance.image:
                    delete_image(instance.image.path)

            converted_image = InMemoryUploadedFile(
                BytesIO(converted_image_bytes),
                None,
                file_name,
                'image/webp',
                len(converted_image_bytes),
                None
            )

            instance.image = converted_image

        instance = super(UserSerializer, self).update(instance, validated_data)
        return instance

        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            image_url = representation['image']
            cache_busting_param = f"?timestamp={timezone.now().timestamp()}"
            representation['image'] = image_url + cache_busting_param
        return representation

    def get_token(self,obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER
        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    class Meta:
        model = WhisperUser
        fields = '__all__'
        
        extra_kwargs = {
            'password': {'write_only': True}       
        }

class ProfileDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def create(self, validated_data):
        image_file = validated_data.get('image')
        if image_file:
            image_bytes = validated_data['image'].read()
            converted_image_bytes = convert_to_webp(image_bytes)
            
            file_name = os.path.basename(validated_data['image'].name)
            converted_image = InMemoryUploadedFile(
                BytesIO(converted_image_bytes),
                None,
                file_name,
                'image/webp',
                len(converted_image_bytes),
                None
            )
            
            validated_data['image'] = converted_image
        
        return super().create(validated_data)


    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            image_url = representation['image']
            cache_busting_param = f"?timestamp={timezone.now().timestamp()}"
            representation['image'] = image_url + cache_busting_param
        return representation


class FollowDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = Follow
        fields = '__all__'

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

class SearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Username
        fields = '__all__'

    def update(self, instance, validated_data):
    
        image_file = validated_data.get('image', None)
        if image_file:
            
            username = instance.username
            file_name = f'{username}_{image_file.name}'

            image_bytes = image_file.read()
            converted_image_bytes = convert_to_webp(image_bytes)

            if converted_image_bytes:
                if instance.image:
                    delete_image(instance.image.path)

            converted_image = InMemoryUploadedFile(
                BytesIO(converted_image_bytes),
                None,
                file_name,
                'image/webp',
                len(converted_image_bytes),
                None
            )

            instance.image = converted_image

        instance = super(SearchSerializer, self).update(instance, validated_data)
        return instance

        
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            image_url = representation['image']
            cache_busting_param = f"?timestamp={timezone.now().timestamp()}"
            representation['image'] = image_url + cache_busting_param
        return representation
