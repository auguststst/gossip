import {View, Text, StyleSheet, Image,SafeAreaView,RefreshControl,TouchableOpacity,ScrollView} from "react-native";
import Header from '../component.js';
import {useContext,useEffect} from "react";
import {AuthContext} from '../context/AuthContext';
import RNUrlPreview from 'react-native-url-preview';
import Hyperlink from 'react-native-hyperlink';
import {BASE_URL} from '../config';


function Logo(){
    return(
        <Image style={styles.headerLogo} source={require('../img/whisper.png')} resizeMode="contain" />
    );
}


export default function FeedScreen({ navigation }){
    
    const contextValue = useContext(AuthContext);

    useEffect(() => {
        contextValue.feed(contextValue.userInfo.username); 
    }, []); 

    const onRefresh = () => {
        contextValue.setRefreshing(true); 
        contextValue.feed(contextValue.userInfo.username); 
      };

    return(
       <SafeAreaView style={{flex:1}}>
            
            
            <Header middle={<Logo/>} /> 
            <ScrollView refreshControl={<RefreshControl 
                        refreshing={contextValue.refreshing} 
                        onRefresh={onRefresh} 
                        colors={['#0000ff']} 
                        tintColor={'#0000ff'}
            />
            }>
        
        
        
        {contextValue.feeddata && Array.isArray(contextValue.feeddata) && contextValue.feeddata.map((item)=>{ 
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
                        {item.image != null && item.image != "" && <Image style={styles.contentImage} source={{ uri: BASE_URL+"/media/"+item.image }} /> }
                    </View>
                    

                    
                </View>
                
                <View style={{flex:2}}>
                    <TouchableOpacity style={styles.wrapperProfilePhoto} onPress={()=> { 
                            navigation.navigate("User",{username: item.username}); 
                            contextValue.getProfileData(item.username);
                            contextValue.checkFollow(contextValue.userInfo.username, item.username); 
                            contextValue.getNumbers(item.username); 
                            contextValue.getProfileUserImage(item.username); 
                            contextValue.checkRegistered(item.username);
                            contextValue.databaseExists(item.username);
                        }}>
                        {item.userprofile != null && item.userprofile != "" && item.userprofile != "None" ? (
                            <Image source={{ uri: BASE_URL+"/media/"+item.userprofile}} style={styles.profilePhoto }></Image>
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

const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: "center",
        justifyContent: "center",
    },
    text: {
        fontSize: 24,
        fontWeight: "bold",
        
    },
    element: {
        flexDirection: 'row',
        borderBottomWidth: 1.5,
        borderBottomColor: "#eee",
        paddingBottom: 20,
        paddingTop: 10, 
        
     },
     bottomElements: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        
     },
     like:{
        fontSize: 14,
     },

     headerLogo:{
        width: 80,
        height: 80
     },

     handle:{
        textAlign: 'right',
        fontSize:15, 
        fontWeight:'bold', 
        marginTop: 2, 
        marginRight: 5
     },

     content:{
        padding: 10,
     },

     contentImage:{
        width:"100",
        height: 400, 
        borderRadius: 10,
        marginTop: 10
     },

     contentText:{
        fontWeight: "500",
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
     }

});