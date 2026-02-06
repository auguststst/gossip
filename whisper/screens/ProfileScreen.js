import {useState, useContext,useEffect} from "react";
import {View, Text, StyleSheet, SafeAreaView, RefreshControl, Image,ScrollView,TouchableOpacity, Modal} from "react-native";
import { createDrawerNavigator } from '@react-navigation/drawer';
import {AuthContext} from '../context/AuthContext';
import LanguageScreen from "./LanguageScreen.js";
import SettingsScreen from "./SettingsScreen.js";
import * as ImagePicker from 'expo-image-picker';
import { MenuButton } from "../component.js";
import { Feather } from '@expo/vector-icons';
import RNUrlPreview from 'react-native-url-preview';
import Hyperlink from 'react-native-hyperlink';
import { useTranslation } from 'react-i18next';
import {BASE_URL} from '../config';
import Header from '../component.js';


const Drawer = createDrawerNavigator();




function HomeScreen({navigation}){

    const { t } = useTranslation();
    const contextValue = useContext(AuthContext);
    const [open, setOpen] = useState(false);
    const [profilephoto, setProfilePhoto] = useState(null);

    const handleContainerPress = () => {
        setOpen(false);
      };
    
    const handleContentPress = (event) => {
        event.stopPropagation(); 
    };


    const onRefresh = () => {
        contextValue.setRefreshing(true); 
        contextValue.getProfileData(contextValue.userInfo.username); 
      };

    const chooseImage = async() => {
        const pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if(!pickerResult.canceled){
            setProfilePhoto(pickerResult.assets[0].uri);
            setOpen(false);
            contextValue.uploadProfilePhoto(pickerResult.assets[0].uri, contextValue.userInfo.username)
        }
    };

    
    return(
        <SafeAreaView style={{flex:1}}>
            
            <Modal visible={open} 
                   transparent={true}
                   animationType='fade'
                   onRequestClose={() => setOpen(false)}
            >
                 <View style={styles.modalContainer} onTouchStart={handleContainerPress}>
                    <View style={styles.modalContent} onTouchStart={handleContentPress}>
                        <Text style={{fontSize: 24, marginTop: 10}}>{t('profilephoto')}</Text>
                        <View style={styles.straight}>
                        <TouchableOpacity onPress={()=>chooseImage()}>
                            <Feather 
                            name="image" 
                            size={35} 
                            color="#000"
                            style={{marginLeft: 4}}
                            /> 
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{setProfilePhoto(null); contextValue.deleteProfile(contextValue.userInfo.username); setOpen(false); onRefresh()}}>
                            <Feather 
                                name="trash-2" 
                                size={35} 
                                color="#000"
                                style={{marginLeft: 7}}
                                />
                        </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>



            <Header menuButton={<MenuButton />} navigation={navigation}/>
            <ScrollView refreshControl={<RefreshControl 
                        refreshing={contextValue.refreshing} 
                        onRefresh={onRefresh} 
                        colors={['#0000ff']} 
                        tintColor={'#0000ff'}
            />
            }>
              <View style={styles.profile}>
                <View style={{flex: 1, alignItems: "center"}}>
                    {contextValue.userInfo.image != null && contextValue.userInfo.image != "" ? (
                        <Image source={{ uri: BASE_URL+contextValue.userInfo.image}} style={styles.profileMainPhoto }></Image>
                    ) : (
                        <Image source={profilephoto ? ({uri:profilephoto}) : (require('../img/zaglushka.jpg')) } style={styles.profileMainPhoto }></Image>
                    )}
                </View>
                <View>
                    <Text style={styles.nickname}>@{contextValue.userInfo.username}</Text>
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
                <TouchableOpacity style={styles.buttonLeft} onPress={() => setOpen(true)}>
                    <Text>{t('edit')}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRight}>
                    <Text>{t('share')}</Text>
                </TouchableOpacity>
                </View>
              </View>

              { contextValue.profileData !== null && contextValue.profileData.map((item)=>{
                

                return(
                    <View key={item.id} style={styles.element}>              
                    <View style={{flex:14}}>
                         <Text style={styles.handle}>@{item.username}</Text>
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
                             {contextValue.userInfo.image != null && contextValue.userInfo.image != "" ? (
                                    <Image source={{ uri: BASE_URL+contextValue.userInfo.image}} style={styles.profilePhoto }></Image>
                             ) : (
                                    <Image source={ require('../img/zaglushka.jpg') } style={styles.profilePhoto}></Image>
                             )}
                         </TouchableOpacity>
                     </View>
                  </View>
                )
            
            })
         }
           





            </ScrollView>
        </SafeAreaView>
    );
}


export default function ProfileScreen(){

    const { t } = useTranslation();
    const contextValue = useContext(AuthContext);
    //add options to every screen to hide the standart button and <Header /> to add my
    return(
    <Drawer.Navigator screenOptions={{drawerPosition: 'right'}} initialRouteName="Home"  >
        <Drawer.Screen options= {{headerShown: false}} name={t('home')} component={HomeScreen} />
        <Drawer.Screen options= {{headerShown: false}} name={t('language')} component={LanguageScreen} />
        <Drawer.Screen options= {{headerShown: false}} name={t('settings')} component={SettingsScreen} />
      </Drawer.Navigator>
    )
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
    buttons:{
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
     contentText:{
        fontWeight: "500",
     },
     contentImage:{
        height: 400,
        width: "100%",
        borderRadius: 10,
        marginTop: 10,
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
        paddingTop: 10, 
        
     },
     profilePhoto: {
        height:45,
        width: 45,
        borderRadius: 50,
     },
     wrapperProfilePhoto: {
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
     
     //start
     

     handle:{
        textAlign: 'right',
        fontSize:15, 
        fontWeight:'bold', 
        marginTop: 2, 
        marginRight: 5
     },

     modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modalContent: {
        height: 150,
        width: 350,
        backgroundColor: 'white',
        alignItems: 'center',
        borderRadius: 10,
      },

      straight:{
        marginTop: 20,
        flexDirection: "row",
        width: 350,
        justifyContent: "space-evenly",
      }
});