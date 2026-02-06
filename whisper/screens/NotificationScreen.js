import {View, Text, StyleSheet,ScrollView,RefreshControl,TouchableOpacity} from "react-native"
import {AuthContext} from '../context/AuthContext';
import Header from '../component.js';
import {useContext} from "react";
import { useTranslation } from 'react-i18next';



export default function NotificationScreen({navigation}){

    const contextValue = useContext(AuthContext);
    const { t } = useTranslation();

    const onRefresh = () => {
        contextValue.setRefreshing(true); 
        contextValue.notification(contextValue.userInfo.username); 
      };

    return(
        <View style={styles.container}>
             <Header middle={<Text style={styles.title}>{t('notification')}</Text>} />

             <ScrollView refreshControl={<RefreshControl 
                        refreshing={contextValue.refreshing} 
                        onRefresh={onRefresh} 
                        colors={['#0000ff']} 
                        tintColor={'#0000ff'}
            />
            }>

             { contextValue.notif !== null && contextValue.notif.map((item)=>{
                return(
                    <View key={item.id} style={styles.element}>

                        {item.category == "follow" &&
                        <Text style={styles.text}>
                            <TouchableOpacity onPress={ ()=>{ 
                                navigation.navigate("User", {username: item.text});
                                contextValue.getProfileData(item.text);
                                contextValue.checkFollow(contextValue.userInfo.username, item.text);
                                contextValue.getNumbers(item.text);
                                contextValue.checkRegistered(item.text);
                                contextValue.getProfileUserImage(item.text);
                                contextValue.setProfileImage(null);
                                contextValue.databaseExists(item.text);
                                }}>
                                <Text style={{fontSize: 16, color: 'blue', textDecorationLine: 'underline' }}>@{item.text}</Text>
                            </TouchableOpacity>{' '}
                            <TouchableOpacity><Text>{t('followcategory')}</Text></TouchableOpacity>
                        </Text>
                        }

                        {item.category == "checkverification" &&
                            <Text>{t('checkverification')}</Text>
                        }

                        {item.category == "sverification" &&
                            <Text>{t('sverification')}</Text>
                        }

                    </View>
                )
             })}
             </ScrollView>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    element:{
        paddingHorizontal: 30,
        paddingVertical: 5,
    },
});