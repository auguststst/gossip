import os
import django
import sys
sys.path.append('/home/jamaaato/w/whisper')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'settings')
django.setup()

from whisper_app.models import WhisperUser, Notification, Username
from instagrapi import Client
from itertools import chain



cl = Client()
cl.request_timeout = 0.1
cl.load_settings("session.json") 
cl.login('justdimaaaaaa', '@#$_&-+()/m$') 


def getCode(username):
    try:
        info = cl.user_info_by_username_v1(username)
        return(info.biography)
    except:
        cl.relogin()
        print("no discription")

    
def userExists(username):
    try:
        user_id = cl.user_info_by_username_v1(username)

        return True
    except:
        return False



def clean():
    data = Username.objects.all().values('username')
    data2 = WhisperUser.objects.all().values('username')
    combined_data = list(chain(data, data2))
    usernames = []
    for x in combined_data:
        usernames.append(x['username'])
    
    result = []

    for x in usernames:
        if userExists(x) == False:
            result.append(x)
    
    print(result)


def verificate():
    users =  WhisperUser.objects.all()
    for u in users:
        if u.verification == False:
            if u.code == getCode(u.username):
                u.verification = True
                u.save()
                notification = Notification.objects.create(username=u.username,category="sverification")


#verificate()
#clean()

cl.dump_settings("session.json")