import {useContext} from "react";
import {View, Text, StyleSheet, Image} from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {AuthContext} from '../context/AuthContext';
import FeedScreen from "../screens/FeedScreen";
import SearchScreen from "../screens/SearchScreen";
import NotifactionScreen from "../screens/NotificationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import { useTranslation } from 'react-i18next';

const Tab =  createBottomTabNavigator()

export default function AppScreen(){

    const { t } = useTranslation();
    const contextValue = useContext(AuthContext);

    return(
        <Tab.Navigator screenOptions={ 
            ({ route }) => {
                return ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;

                        if (route.name === t('feed')) {
                            iconName = focused
                                ? require('../img/home-black.png')
                                : require('../img/home.png');
                        } else if (route.name === t('search')) {
                            iconName = focused
                                ? require('../img/search-black.png')
                                : require('../img/search.png');
                        } else if (route.name === t('notification')) {
                            iconName = focused
                                ? require('../img/bell-black.png')
                                : require('../img/bell.png');
                        } else if (route.name === t('profile')) {
                            iconName = focused
                                ? require('../img/user-black.png')
                                : require('../img/user.png');
                        }

                        // You can return any component that you like here!
                        return <Image source={iconName} style={{ width: 20, height: 20 }}
                            resizeMod="contain" />;
                    },
                    tabBarActiveTintColor: 'tomato',
                    tabBarInactiveTintColor: 'gray',
                    headerShown: false,
                    tabBarHideOnKeyboard: true,

                })}}>
                    
            <Tab.Screen name={t('feed')} component={FeedScreen}  listeners={{tabPress: () => {contextValue.feed(contextValue.userInfo.username); contextValue.checkuser(contextValue.userInfo.username)}}}/>
            <Tab.Screen name={t('search')} component={SearchScreen} listeners={{tabPress: () => {contextValue.getSearchFollowingUsers(contextValue.userInfo.username);contextValue.checkuser(contextValue.userInfo.username) } }} />
            <Tab.Screen name={t('notification')} component={NotifactionScreen } listeners={{tabPress: () => {contextValue.notification(contextValue.userInfo.username); contextValue.checkuser(contextValue.userInfo.username)}}} />
            <Tab.Screen name={t('profile')} component={ProfileScreen} listeners={{tabPress: () => {contextValue.getProfileData(contextValue.userInfo.username); contextValue.getNumbers(contextValue.userInfo.username); contextValue.checkuser(contextValue.userInfo.username)} }} />
            <Tab.Screen 
                options={{ tabBarButton: () => null, tabBarVisible: false }}
                name="User" 
                component={UserProfileScreen} 
            />
        </Tab.Navigator>
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
    }
});