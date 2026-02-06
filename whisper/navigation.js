import { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import StartScreen from "./screens/StartScreen";
import LoginScreen from "./screens/LoginScreen";
import SignUpScreen from "./screens/SignUpScreen";
import AppScreen from "./screens/AppScreen";
import {AuthContext} from './context/AuthContext';
import 'react-native-gesture-handler';
import SplashScreen from './screens/SplashScreen';


const Stack = createNativeStackNavigator();


export default function Navigation(){

    const contextValue = useContext(AuthContext);

    return(
       <NavigationContainer>
           <Stack.Navigator initialRouteName="Start" screenOptions={{ headerShown: false }}>         
               {contextValue.splashLoading ? 
               (
                <Stack.Screen 
                name="Splash Screen" 
                component={SplashScreen} 
                screenOptions={{ headerShown: false }}  
                />
               ) : 
                contextValue.userInfo.token ? (
                  <Stack.Screen name="App" component={AppScreen} />
                ) : (
                 <>
                 <Stack.Screen name="Start" component={StartScreen} />
                 <Stack.Screen name="Login" component={LoginScreen} />
                 <Stack.Screen name="Register" component={SignUpScreen} />
                 </>
                
               )}
              
               </Stack.Navigator>
       </NavigationContainer>
    );
}