from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register),
    path('login/', views.login),
    path('logout/', views.logout),
    path('getprofiledata/', views.getProfileData),
    path('sendmessage/', views.sendMessage),
    path('feed/', views.feed),
    path('notification/', views.getNotification),
    path('follow/', views.follow),
    path('unfollow/',views.unfollow),
    path('checkuser/',views.checkuser),
    path('getnumbers/',views.getNumbers),
    path('checkfollow/',views.checkfollow),
    path('getsearchfollowingusers/',views.getSearchFollowingUsers),
    path('uploadprofile/',views.uploadProfileImage),
    path('uploaduknownprofile/',views.uploadUknownProfileImage),
    path('deleteprofile/', views.deleteProfileImage),
    path('addusertosearch/', views.addUserToSearch),
    path('getuserprofileimage/',views.getUserProfileImage),
    path('userdatabaseexists/', views.user_database_exists),
]