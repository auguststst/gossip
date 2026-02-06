import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import React, {createContext, useEffect, useState} from 'react';
import {BASE_URL} from '../config';
import axios from 'axios';
import i18n from '../i18n';

export const AuthContext = createContext();


export const AuthProvider = ({children}) =>  {
    const [userInfo, setUserInfo] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [profileData, setProfileData] = useState(null);
    const [refreshing, setRefreshing] = useState(false);
    const [SearchFollowingUsers, setSearchFollowingUsers]= useState(null);
    const [showContent, setShowContent] = useState(true);
    const [pressedFollow, setPressedFollow] = useState(false);
    const [numberInfo, setNumberInfo] = useState({});
    const [feeddata, setFeeddata] = useState(null);
    const [notif, setNotif] = useState(null);
    const [data, setData] = useState(null);
    const [splashLoading, setSplashLoading] = useState(false);
    const [registered, setRegistered] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profilephoto, setProfilePhoto] = useState(null);
    const [exist, setExist] = useState(false);


      


    function removeSymbol(word){
        if(typeof word === 'string' && word.startsWith('@')){
            return word.substring(1);
            console.log("work");
        }else {
            return word;
        }
    }

    const register = (username, email, password, language) => {
        setIsLoading(true);
        username = removeSymbol(username);

        axios.post(`${BASE_URL}/register/`,{
             username, email, password, language  
        }, {
            headers: {
                'Content-Type': 'application/json',
                "Access-Control-Allow-Origin": "*"
            }
        }).then(res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            //AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            AsyncStorage.setItem('tooltip', 'true');
            
        }).catch(e => {
            console.log(`register error ${e}`);
            setIsLoading(false);
        });
    };

    const login = (username, password) => {
        setIsLoading(true);
        username = removeSymbol(username);

        axios.post(`${BASE_URL}/login/`,{
            username, password,
        }).then(res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            //AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
            setIsLoading(false);
            AsyncStorage.setItem('tooltip', 'true');
        }).catch(e => {
            console.log(`login errror ${e}`);
            setIsLoading(false);
        });

    };

    const logout = () => {
        setIsLoading(true);

        axios.post(`${BASE_URL}/logout/`, {},{
            headers: {Authorization: `Bearer ${userInfo.token}`},
        },
        ).then(res => {
            //AsyncStorage.removeItem('userInfo');
            SecureStore.deleteItemAsync('userInfo');
            setUserInfo({});
            setIsLoading(false);
        }).catch(e => {
            console.log(`logout error ${e}`);
            setIsLoading(false);
        });
    };

    const isLoggedIn = async () => {
        try{
            setSplashLoading(true);
            //let userInfo = await AsyncStorage.getItem('userInfo');
            let userInfo = await SecureStore.getItemAsync('userInfo')
            userInfo = JSON.parse(userInfo);
            if(userInfo){
                setUserInfo(userInfo);
            } 
            
            setSplashLoading(false);
        }catch(e){
            setSplashLoading(false);
            console.log(`is logged in error ${e}`);
        }
    };

    useEffect(() => {
        isLoggedIn();
    }, []);
    
    const getProfileData = (username) => {
        setProfileData(null);
        axios.get(`${BASE_URL}/getprofiledata/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let profileData = res.data;
            setProfileData(profileData);
            setRefreshing(false);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };

    const getSearchFollowingUsers = (username) => {
        axios.get(`${BASE_URL}/getsearchfollowingusers/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let SearchFollowingUsers = res.data;
            let data = res.data;
            setSearchFollowingUsers(SearchFollowingUsers);
            setData(data);
        })
        .catch(e => {
            console.error('Error occurred:', e);
            setSearchFollowingUsers([]);
        });
    };

    const sendMessage = (photo,text,username) => {
        if (photo != null || text != null){
            const formData = new FormData();
            if(text != null && photo == null){
                formData.append('text', text); 
                formData.append('username', username);
            }else if(photo != null && text == null){
                formData.append('image', {
                    uri: photo,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
                formData.append('username', username);
            }else{
                formData.append('image', {
                    uri: photo,
                    type: 'image/jpeg',
                    name: 'image.jpg',
                });
                formData.append('text', text);
                formData.append('username', username);
            }
        
            axios.post(`${BASE_URL}/sendmessage/`,formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(res => {
                console.log(res.data);
            }).catch(e => {
                 console.log(`login errror ${e}`);
            });

        }else{
            console.log("no information");
        }
    
    
    }


    const follow = (follower,following) => {
        axios.post(`${BASE_URL}/follow/`,{
            follower,following
       }, {
           headers: {
               'Content-Type': 'application/json',
               "Access-Control-Allow-Origin": "*"
           }
       }).then(res => {
           console.log(res.data);
       }).catch(e => {
           console.log(`register error ${e}`);
       });
    };

    const unfollow = (follower, following) => {
        axios.get(`${BASE_URL}/unfollow/`, {
            params: {
                follower: follower,
                following: following,
            }
        }).then(res => {
            console.log(res.data);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };

    //return button follow and unfollow
    const checkFollow = (follower, following) => {
        axios.get(`${BASE_URL}/checkfollow/`, {
            params: {
                follower: follower,
                following: following,
            }
        }).then(res => {
            let followInfo = res.data;
            if(followInfo.message == "True"){
                setPressedFollow(true);
            }else{
                setPressedFollow(false);
            }
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });

    };

    const getNumbers = (username) => {
        axios.get(`${BASE_URL}/getnumbers/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let numberInfo = res.data;
            setNumberInfo(numberInfo);
            setRefreshing(false);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };


    const feed = (username) => {
        axios.get(`${BASE_URL}/feed/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let feeddata = res.data;
            setFeeddata(feeddata);
            setRefreshing(false);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };

    const notification = (username) => {
        axios.get(`${BASE_URL}/notification/`, {
            params: {
                username: username
            }
        })
        .then(res => {
           let notif = res.data;
           setNotif(notif);
           setRefreshing(false);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };

    const checkuser = (username) => {
        axios.get(`${BASE_URL}/checkuser/`, {
            params: {
                username: username
            }
        })
        .then(res => {
           let m = res.data;
           if(m.message == "False"){
                logout();
           }
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });

    };

    const checkRegistered = (username) => {
        axios.get(`${BASE_URL}/checkuser/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let m = res.data;
            if(m.message == "True"){
                setRegistered(true);
            }else{
                setRegistered(false);
            }
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };

    const uploadProfilePhoto = (photo, username) =>{
        const formData = new FormData();

        formData.append('image', {
            uri: photo,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        formData.append('username', username);

        axios.post(`${BASE_URL}/uploadprofile/`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            let userInfo = res.data;
            setUserInfo(userInfo);
            //AsyncStorage.setItem('userInfo', JSON.stringify(userInfo));
            SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
        }).catch(e => {
             console.log(`login errror ${e}`);
        });

    };


    const getUserInfo = async () => {
        try {
          const jsonValue = await SecureStore.getItemAsync('userInfo');
          return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch (error) {
          console.error('Error retrieving user info from AsyncStorage:', error);
          return null;
        }
      };


      const deleteProfile = async (username) => {
        try {
          const res = await axios.get(`${BASE_URL}/deleteprofile/`, {
            params: {
              username: username
            }
          });
      
          const userInfo = await getUserInfo();
      
          if (userInfo && userInfo.image) {
            delete userInfo.image; 
      
            await SecureStore.setItemAsync('userInfo', JSON.stringify(userInfo));
            setUserInfo(userInfo);
            console.log('Image deleted from userInfo');
          } else {
            console.log('No image found in userInfo');
          }
        } catch (error) {
          console.error('Error occurred:', error);
        }
      };


      const addToSearch = (username) => {
        axios.get(`${BASE_URL}/addusertosearch/`, {
            params: {
                username: username
            }
        })
        .then(res => {
           console.log(res.data);
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });

    };


    const uploadUknownProfilePhoto = (photo, username) =>{
        const formData = new FormData();

        formData.append('image', {
            uri: photo,
            type: 'image/jpeg',
            name: 'image.jpg',
        });

        formData.append('username', username);

        axios.post(`${BASE_URL}/uploaduknownprofile/`,formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        }).then(res => {
            console.log(res.data);

        }).catch(e => {
             console.log(`login errror ${e}`);
        });

    };

    const getProfileUserImage = (username) => {
        axios.get(`${BASE_URL}/getuserprofileimage/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let profileImage = `${BASE_URL}/media/${res.data.image}`;
            if(res.data.image != null && res.data.image != ""){
                setProfileImage(profileImage);
                setProfilePhoto(profileImage);
            }else{
                setProfileImage(null);
                setProfilePhoto(null);
            }

        })
        .catch(e => {
            console.error('Error occurred:', e);
        });

    };


    const databaseExists = (username, send = false) => {
        axios.get(`${BASE_URL}/userdatabaseexists/`, {
            params: {
                username: username
            }
        })
        .then(res => {
            let m = res.data;
            if(m.message == "True"){
                setExist(true);
            }else{
                if(send == true){
                    setExist(true);  
                }else{
                    setExist(false);
                }
            }
        })
        .catch(e => {
            console.error('Error occurred:', e);
        });
    };





    
    const contextValue = {
        isLoading,
        userInfo,
        profileData,
        refreshing,
        showContent,
        SearchFollowingUsers,
        pressedFollow,
        numberInfo,
        feeddata,
        notif,
        data,
        splashLoading,
        registered,
        profileImage,
        profilephoto,
        exist,
        register,
        login,
        logout,
        getProfileData,
        setRefreshing,
        getSearchFollowingUsers,
        sendMessage,
        setShowContent,
        follow,
        checkFollow,
        setPressedFollow,
        unfollow,
        getNumbers,
        feed,
        notification,
        checkuser,
        setSearchFollowingUsers,
        setData,
        checkRegistered,
        uploadProfilePhoto,
        deleteProfile,
        addToSearch,
        uploadUknownProfilePhoto,
        getProfileUserImage,
        setProfileImage,
        setProfilePhoto,
        removeSymbol,
        databaseExists,
    };

    
    
    return(
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
}