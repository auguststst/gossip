from django.contrib.auth.backends import BaseBackend
from .models import WhisperUser

class CustomUserBackend(BaseBackend):
    def authenticate(self,request, username=None, password=None, **kwargs):
        try:
            user = WhisperUser.objects.get(username=username)
            if user.check_password(password):
                return user
        except WhisperUser.DoesNotExist:
            return None

    def get_user(self, user_id):
        try:
            return WhisperUser.objects.get(pk=user_id)
        except WhisperUser.DoesNotExist:
            return None
