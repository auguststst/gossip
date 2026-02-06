from django.db import models
from django.utils import timezone
from django.contrib.auth.hashers import make_password, check_password
from django.utils.text import slugify
import uuid

# Create your models here.

class WhisperUser(models.Model):
    username = models.CharField(max_length=50,unique=True)
    email = models.CharField(max_length=50)
    password = models.CharField(max_length=100)
    image = models.ImageField(upload_to='./profile/', null=True, blank=True)  
    verification = models.BooleanField(default=False)  
    code = models.CharField(max_length=100,blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)


    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)

    def save(self, *args, **kwargs):
        if self.image:
            username = self.username
            unique_filename = f'{username}_{uuid.uuid4().hex[:10]}.webp'
            self.image.name = unique_filename

        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

class Post(models.Model):
    image = models.ImageField(upload_to='./media/', null=True, blank=True)  
    text = models.TextField(null=True, blank=True)  
    username = models.CharField(max_length=50)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.username

class Follow(models.Model):
    follower = models.CharField(max_length=50)
    following = models.CharField(max_length=50)

    def __str__(self):
        return self.following

class Offset(models.Model):
    value = models.IntegerField(default=0)

    def __str__(self):
        return str(self.value)

class Notification(models.Model):
    text = models.TextField(null=True, blank=True)  
    username = models.CharField(max_length=50)
    category = models.CharField(max_length=50, default="general")

    def __str__(self):
        return self.username

class Username(models.Model):
    username = models.CharField(max_length=50)
    image = models.ImageField(upload_to='./uknownuser/', null=True, blank=True)

    def __str__(self):
        return self.username

    def save(self, *args, **kwargs):
        if self.image:
            username = self.username
            unique_filename = f'{username}_{uuid.uuid4().hex[:10]}.webp'
            self.image.name = unique_filename

        super().save(*args, **kwargs)

