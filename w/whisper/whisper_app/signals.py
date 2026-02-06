from django.db.models.signals import pre_delete
from django.dispatch import receiver
from .models import Post, WhisperUser, Username, Follow

@receiver(pre_delete, sender=Post)
def delete_post_related_files(sender, instance, **kwargs):

    if hasattr(instance, 'image') and instance.image:
        instance.image.delete(save=False)

@receiver(pre_delete, sender=WhisperUser)
def delete_user_related_files(sender, instance, **kwargs):

    if hasattr(instance, 'image') and instance.image:
        instance.image.delete(save=False)

    posts_to_delete = Follow.objects.filter(follower=instance)
    posts_to_delete.delete()

@receiver(pre_delete, sender=Username)
def delete_username_related_files(sender, instance, **kwargs):

    if hasattr(instance, 'image') and instance.image:
        instance.image.delete(save=False)