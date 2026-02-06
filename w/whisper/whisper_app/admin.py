from django.contrib import admin
from .models import WhisperUser,Post, Follow, Offset,Notification,Username
from django.utils.safestring import mark_safe


class WhisperUserAdmin(admin.ModelAdmin):
    list_display = ('id','username','email','code', 'verification','created_at')
    readonly_fields = ('username','email','password','image')
    list_display_links = ('username',)
    #list_editable = ("verification")

class PostAdmin(admin.ModelAdmin):
    search_fields = ['username']
    list_display = ('id','username','text','get_image')
    list_display_links = ('username',)
    readonly_fields = ('get_image',)

    def get_image(self, obj):
        try:
            return mark_safe(f'<img src={obj.image.url} width="300" height="300"')
        except:
            return "No image"
    
    get_image.short_description = "Image"


class FollowAdmin(admin.ModelAdmin):
    list_display = ('id','follower', 'following')

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id','text', 'username','category')

class UsernameAdmin(admin.ModelAdmin):
    list_display = ('id','username','get_image')
    list_display_links = ('username',)

    def get_image(self, obj):
        try:
            return mark_safe(f'<img src={obj.image.url} width="250" height="200"')
        except:
            return "No image"
    
    get_image.short_description = "Image"


# Register your models here.
admin.site.register(WhisperUser,WhisperUserAdmin)
admin.site.register(Post,PostAdmin)
admin.site.register(Follow,FollowAdmin)
admin.site.register(Offset) 
admin.site.register(Notification,NotificationAdmin)
admin.site.register(Username,UsernameAdmin)
