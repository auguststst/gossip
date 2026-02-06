import {View, Text, StyleSheet,SafeAreaView,TouchableOpacity} from "react-native";
import Spinner from 'react-native-loading-spinner-overlay';
import {useContext} from "react";
import { MenuButton } from "../component.js";
import { AuthContext } from '../context/AuthContext';
import Header from '../component.js';
import { useTranslation } from 'react-i18next';



export default function SettingsScreen({ navigation }) {

    const contextValue = useContext(AuthContext);
    const { t } = useTranslation();


    return (
    <SafeAreaView style={{flex:1}}>
        <Spinner visible={contextValue.isLoading}/>
        <Header menuButton={<MenuButton />} navigation={navigation}/>
        <View style={{marginTop: 10}}>
            <TouchableOpacity style={styles.languageElement} onPress={() =>{ contextValue.logout();  }}>
                <Text style={styles.languageElementText}>{t('logout')}</Text>
            </TouchableOpacity>
        </View>
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
    languageElementText: {
        fontSize: 18,
    },
    languageElement: {
        paddingHorizontal: 40,
        paddingVertical: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: "#eee",
    }
});