import React, {useState, useContext,useEffect} from "react";
import {View, Text, StyleSheet, SafeAreaView, Image, RefreshControl,TextInput,ScrollView,TouchableOpacity,Modal,Linking} from "react-native";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import {AuthContext} from '../context/AuthContext';
import Header from '../component.js';
import {BASE_URL} from '../config';
import SplashScreen from '../screens/SplashScreen';
import RNUrlPreview from 'react-native-url-preview';
import Hyperlink from 'react-native-hyperlink';
import Tooltip from 'react-native-walkthrough-tooltip';
import { style } from "deprecated-react-native-prop-types/DeprecatedViewPropTypes.js";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';






function BackButton(){
    const navigation = useNavigation();
    return(
        <TouchableOpacity style={styles.back} onPress={() => navigation.goBack() }>
            <Image source={  require('../img/back.png') } style={styles.backButton}/>
        </TouchableOpacity>
    );
}


export default function UserProfileScreen({route}){
    //add options to every screen to hide the standart button and <Header /> to add my
    const [modalOpen, setModalOpen] = useState(false);
    const [photo, setPhoto] = useState(null);
    const [sendMessage, setSendMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [visiblee, setVisiblee] = useState(false);

    const { username } = route.params; 
    const contextValue = useContext(AuthContext);
    const navigation = useNavigation();
    const { t } = useTranslation();

    const onRefresh = () => {
        contextValue.setRefreshing(true); 
        contextValue.getProfileData(username);
        contextValue.getNumbers(username);
        contextValue.getProfileUserImage(username);
      };
      


    const fetchData = async() => {
        setLoading(true);

        const tooltip = await AsyncStorage.getItem('tooltip');
        
        if(tooltip == "true"){
            setVisible(true);
            setVisiblee(true);
            AsyncStorage.removeItem('tooltip').catch((error) => {
                console.error('Error removing tooltip visibility state:', error);
            });  
        }
        
        
        
        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchData(); 
        }, [])
    );
    
    const updateSendMessage = () => {
        setTimeout(() => {
            onRefresh();
        }, 2200);
    };

    const updateProfileImage = () => {
        setTimeout(() => {
            onRefresh();
        }, 1500);
    };

    const chooseImage = async() => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if(!pickerResult.canceled){
            setPhoto(pickerResult.assets[0].uri);
        }
    };

    const uploadProfileImage = async() => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if(!pickerResult.canceled){
            contextValue.setProfilePhoto(pickerResult.assets[0].uri);
            contextValue.uploadUknownProfilePhoto(pickerResult.assets[0].uri, username);
            updateProfileImage();
        }
    };
    return(
        
        <>
        {loading ? (
            <SplashScreen />
        ):(
        <SafeAreaView style={{flex:1}}>

        <Tooltip
            isVisible={visible}
            content={<Text style={styles.tiptext}>{t('fly')}</Text>}
            placement="bottom"
            onClose={() => {setVisible(false); }}
        />
        
        {contextValue.registered != true && contextValue.profileImage == null  && contextValue.exist &&
        <Tooltip
            isVisible={visiblee}
            tooltipStyle={styles.tipprofile}
            content={<Text>{t('plus')}</Text>}
            placement="top"
            onClose={() => {setVisiblee(false); }}
        />
        }
       
        
        <Modal visible={modalOpen} animationType="slide">
            <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                    <TouchableOpacity onPress={()=>setModalOpen(false)}>
                        <Text style={{fontSize: 21, marginTop: 4}}>{t('cancel')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> {
                            contextValue.sendMessage(photo, sendMessage,username); 
                            setModalOpen(false); 
                            updateSendMessage();
                        }} style={styles.send}>
                        <Text style={styles.sendText}>{t('send')}</Text>
                    </TouchableOpacity>
                </View>
                <View> 
                    <TextInput 
                        style={styles.sendInput} 
                        value={sendMessage}
                        onChangeText={(text)=>setSendMessage(text)}
                        placeholder={t('placeholder')}
                        multiline={true}
                        numberOfLines={1}
                    />
                </View>

               

                <View style={{width: "100%"}}>
                    {photo && <Image source={{ uri: photo }} style={{ width: "100%", height: 400 }} />}
                </View>
            </View>
            
            <View style={styles.modalFooter}>
                <TouchableOpacity onPress={()=>chooseImage()} style={{marginBottom: 18}}>
                        <Text style={{textAlign:"center", fontSize: 20}}>{t('upload')}</Text>
                </TouchableOpacity>
            </View>
            
        </Modal>


        <Header leftUpperButton={<BackButton/>}/>
        <ScrollView refreshControl={<RefreshControl 
                        refreshing={contextValue.refreshing} 
                        onRefresh={onRefresh} 
                        colors={['#0000ff']} 
                        tintColor={'#0000ff'}
            />
            } style={{position: "relative"}}>
          <View style={styles.profile}>
            <View style={{flex: 1, alignItems: "center"}}>
                {contextValue.registered ? (
                    // If user is registered
                    (contextValue.profileImage != null && 
                    contextValue.profileImage !== "" && 
                    contextValue.profileImage !== `${BASE_URL}/media/null` && 
                    contextValue.profileImage !== `${BASE_URL}/media/`) ? (
                        // Render profile image if it meets conditions
                        <Image source={{ uri: contextValue.profileImage }} style={styles.profileMainPhoto} />
                    ) : (
                        // Render placeholder image if profile image conditions are not met
                        <Image source={require('../img/zaglushka.jpg')} style={styles.profileMainPhoto} />
                    )
                ) : (
                    // If user is not registered
                    (contextValue.profileImage != null && 
                    contextValue.profileImage !== "" && 
                    contextValue.profileImage !== `${BASE_URL}/media/null` && 
                    contextValue.profileImage !== `${BASE_URL}/media/`) ? (
                        // Render uploadable profile image if conditions are met
                        <TouchableOpacity onPress={uploadProfileImage}>
                            <Image source={{ uri: contextValue.profileImage }} style={styles.profileMainPhoto} />
                        </TouchableOpacity>
                    ) : (
                        // This is where you have the nested conditional rendering
                        contextValue.exist ? (
                            // If contextValue.exist is true, render the clickable image
                            <TouchableOpacity onPress={uploadProfileImage}>
                                <Image
                                    source={contextValue.profilephoto ? { uri: contextValue.profilephoto } : require('../img/user-image.png')}
                                    style={styles.profileMainPhoto}
                                />
                            </TouchableOpacity>
                        ) : (
                            // If contextValue.exist is false, render the non-clickable image
                            <TouchableOpacity>
                                <Image
                                    source={contextValue.profilephoto ? { uri: contextValue.profilephoto } : require('../img/zaglushka.jpg')}
                                    style={styles.profileMainPhoto}
                                />
                            </TouchableOpacity>
                        )
                    )
                )}  
            </View>

            <View>
                <Text style={styles.nickname}>@{username}</Text>
            </View>

            <View style={{flexDirection: 'row', justifyContent:'space-evenly', marginTop: 10}}>
                <View>
                    <Text style={styles.number}>{contextValue.numberInfo.followers}</Text>
                </View>
                <View >
                   <Text style={styles.number}>{contextValue.numberInfo.followings}</Text>
                </View>
            </View>
            <View style={{flexDirection: 'row', justifyContent:'space-evenly'}}>
                <View>
                    <Text>{t('followers')}</Text>
                </View>
                <View>
                    <Text>{t('following')}</Text>
                </View>
            </View>

            <View style={styles.buttons}>
            { contextValue.pressedFollow ? ( 
            <TouchableOpacity onPress={()=> { 
                    contextValue.unfollow(contextValue.userInfo.username, username); 
                    contextValue.setPressedFollow(false);  
                }} style={styles.buttonLeft}>
                 <Text>{t('unfollow')}</Text>
            </TouchableOpacity>
            ):(
            <TouchableOpacity onPress={()=> {
                    contextValue.setPressedFollow(false); 
                    contextValue.follow(contextValue.userInfo.username, username); 
                    contextValue.setPressedFollow(true); 
                }} style={styles.buttonLeft}>
                <Text>{t('follow')}</Text>
            </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.buttonRight}>
                <Text>{t('share')}</Text>
            </TouchableOpacity>
            </View>
          </View>


          { contextValue.profileData !== null && contextValue.profileData.map((item)=>{
          return(


          <View key={item.id} style={styles.element}>  
                <View style={{flex:14}}>
                    <Text style={styles.handle}>@{username}</Text>
                    <View style={styles.content}>
                        {item.text != null  && 
                        <> 
                        <Hyperlink linkDefault={ true } linkStyle={{ color: 'blue', textDecorationLine: 'underline' }}>
                            <Text style={styles.contentText}>
                                {item.text}
                            </Text>
                        </Hyperlink>
                        {!item.image && 
                        <RNUrlPreview 
                            style={styles.link} 
                            text={item.text}
                            containerStyle={styles.previewContainer}
                            />
                        }
                        </> 
                        }
                        {item.image != null && <Image style={styles.contentImage} source={{ uri: BASE_URL+item.image }} /> }
                    </View>

                </View>
                
                <View style={{flex:2}}>
                    <TouchableOpacity style={styles.wrapperProfilePhoto}>
                        {contextValue.profileImage != null && contextValue.profileImage != "" && contextValue.profileImage != BASE_URL+"/media/null" && contextValue.profileImage != BASE_URL+"/media/" ? (
                            <Image source={{ uri: contextValue.profileImage}} style={styles.profilePhoto }></Image>
                        ) : (
                            <Image source={ require('../img/zaglushka.jpg') } style={styles.profilePhoto }></Image>
                        )}
                    </TouchableOpacity>
                </View>
                
            </View>
          )
        
        })}

    

        </ScrollView>


        <TouchableOpacity onPress={()=> {setModalOpen(true); setPhoto(null); setSendMessage(null)}} style={styles.buttonSend}>
                        <Image source={  require('../img/send.png') } style={styles.sendButtonImage}/>
        </TouchableOpacity>
      
        
    </SafeAreaView>
    )}
    </>
);
    
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 16,
    },
    profileMainPhoto: {
        height: 100,
        width: 100,
        borderRadius: 50,
    },
    profileMainPhotoo: {
        height: 100,
        width: 100,
        borderRadius: 50,
        borderColor: "black",
        borderWidth: 3,
    },
    nickname:{
        fontWeight: "bold",
        textAlign: 'center',
        marginTop: 5,
    },
    description: {
        textAlign: 'center',
        fontSize: 14,
    },
    number: {
        fontWeight: "bold",
        fontSize: 16,
    },
    buttons: {
        flexDirection: 'row', 
        justifyContent:'center', 
        marginTop: 10
    },
    buttonLeft: {
        paddingVertical: 10, 
        paddingHorizontal: 35, 
        marginRight: 10, 
        backgroundColor: "#d9d9d9", 
        borderRadius: 10,
        fontWeight: "bold",
    },
    buttonRight: {
        paddingVertical: 10, 
        paddingHorizontal: 35, 
        marginLeft: 10, 
        backgroundColor: "#d9d9d9", 
        borderRadius: 10,
        fontWeight: "bold",
    },
    profile: {
        borderBottomWidth: 0.5,
        borderBottomColor: "#d9d9d9",
        paddingBottom: 20,
    },
    content:{
        padding: 11,
     },
     bottomElements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 10,
     },

     element: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: "#eee",
        paddingBottom: 20,
        paddingBottom: 10 
        
     },
     profilePhoto: {
        height:45,
        width: 45,
        borderRadius: 50,
     },
     wrapperProfilePhoto:{
        justifyContent: 'flex-start', 
        alignItems:'center', 
        marginTop: 5
     },
     bottomElements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
     },
     like:{
        fontSize: 14,
     },
     backButton:{
        height: 25,
        width: 25,
     },
     back:{
        marginTop: 15,
        marginLeft: 20,
     },
     sendButtonImage: {
        width: 65,
        height: 65,
     },
     buttonSend : {
        flex:1,
        position: 'absolute',
        bottom: 25,
        right: 25,
        backgroundColor: "#fff",
        borderRadius: 55,
     },
     handle:{
        textAlign: 'right',
        fontSize:15, 
        fontWeight:'bold', 
        marginTop: 2, 
        marginRight: 5
     },
     contentText:{
        fontWeight: "500",
     },
     contentImage:{
        width:"100",
        height: 400, 
        borderRadius: 10,
        marginTop: 10
     },
     modalContent:{
        flex:1,
        paddingHorizontal: 20,
        paddingTop: 19,
     },
     modalHeader: {
        justifyContent: "space-between",
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: "#eee",
        paddingBottom: 15,
     },
     send:{
        backgroundColor: "#00aae4",
        paddingVertical: 6,
        paddingHorizontal: 25,
        borderRadius: 10,
     },
     sendText:{
        color: "#fff",
        fontSize: 18,
     },
     sendInput:{
        fontSize: 20,
        paddingTop: 10,
        paddingBottom: 20,
     },
     modalFooter:{
        borderTopWidth: 1.5,
        borderTopColor: "#eee",
        paddingTop: 10,
        backgroundColor: "#fff"
     },
     link:{
        fontFamily: 'Helvetica',
     },
     previewContainer: {
        width: 350,
        paddingTop: 10,
     },
     tiptext:{
        width: 200,
     },

     tipprofile:{
        marginTop: 80,
        marginLeft: -100,
        width: 150,
    }

});