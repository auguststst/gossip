import {View, Text, StyleSheet,SafeAreaView, ScrollView, Button, TextInput, TouchableOpacity} from "react-native"
import { Feather } from '@expo/vector-icons';
import { useState, useContext } from 'react';
import {AuthContext} from '../context/AuthContext';
import Spinner from 'react-native-loading-spinner-overlay';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignUpScreen({ navigation }){

    const { t } = useTranslation();
    
    const [passwordIsVisible, setPasswordIsVisible] = useState(false);
    const [username, setUsername] = useState(null)
    const [email, setEmail] = useState(null)
    const [password, setPassword] = useState(null)

    const contextValue = useContext(AuthContext);
    const language = AsyncStorage.getItem('language');

    function handleClick(){
        contextValue.register(username,email,password,language._j);
    }

    return(
        <SafeAreaView style={styles.container}>
            <ScrollView
            contentContainerStyle={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
            }}
            >
            <View style={styles.content}>
                <Spinner visible={contextValue.isLoading} />
                <View style={styles.inputContainer}>
                    <View style={styles.icon}>
                        <Feather name="instagram" size={22} color="#7C808D"/>
                    </View>
                    <TextInput 
                    style={styles.input} 
                    placeholder={t('instagram')} 
                    value={username}
                    onChangeText={(text) => setUsername(text)}
                    placeholderTextColor="#7C808D"
                    selectionColor="#3662AA" />                 
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.icon}>
                        <Feather name="mail" size={22} color="#7C808D"/>
                    </View>
                    <TextInput 
                    style={styles.input} 
                    placeholder={t('email')}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
                    placeholderTextColor="#7C808D"
                    selectionColor="#3662AA" />                 
                </View>

                <View style={styles.inputContainer}>
                    <View style={styles.icon}>
                        <Feather name="lock" size={22} color="#7C808D"/>
                    </View>
                    <TextInput 
                    style={styles.input} 
                    placeholder={t('password')}
                    value={password}
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={!passwordIsVisible}
                    placeholderTextColor="#7C808D"
                    selectionColor="#3662AA" />    
                    <TouchableOpacity style={styles.passwordVisibleButton} onPress={() => setPasswordIsVisible(!passwordIsVisible)}>
                        <Feather 
                        name={passwordIsVisible ? "eye" : "eye-off"} 
                        size={20} 
                        color="#7C808D"/>      
                    </TouchableOpacity>             
                </View>

                <TouchableOpacity onPress={ () => { handleClick(); }} style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>{t('registration')}</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.SignUp} onPress={ () => navigation.navigate("Login")}>
                    <Text style={styles.SignText}>{t('accountalready')}</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor: "#fff",
    },
    content: {
        paddingHorizontal: 32,
    },
    title: {
        fontSize: 33,
        fontWeight: "bold",
        marginBottom: 40,
    },
    inputContainer: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 20,
        position: 'relative',
    },
    input: {
        borderBottomWidth: 1.5,
        flex: 1,
        paddingBottom: 5,
        borderBottomColor: '#eee',
        fontSize: 16,
    },
    icon: {
        marginRight: 15,
        justifyContent: 'center',
    },
    passwordVisibleButton: {
        position: 'absolute',
        right: 0,
    },
    forgotPasswordButton: {
        alignSelf: 'flex-end',
    },
    forgotPasswordButtonText: {
        fontSize: 16,
        fontWeight: "500",
    },
    loginButton: {
        backgroundColor: "#3662AA",
        padding: 14,
        borderRadius: 10,
        marginTop: 20,
    },
    loginButtonText: {
        color: "#fff",
        textAlign: 'center',
        fontSize: 16,
        fontWeight: "bold",
    },
    SignText: {
        textAlign: 'center',
        fontSize: 17,
        color: "#7C808D",
    },
    SignUp: {
        position: "absolute",
        bottom: 50,
    }
});