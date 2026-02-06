import {View, Text, StyleSheet, TouchableOpacity, SafeAreaView} from "react-native";
import { MenuButton } from "../component.js";
import Header from '../component.js';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from '../i18n';


export default function LanguageScreen() {

    const { t } = useTranslation();
    const navigation = useNavigation();

    const changeLanguage = async(lng) => {
        await i18n.changeLanguage(lng);
    };

    return (
    <SafeAreaView style={{flex:1}}>
        <Header menuButton={<MenuButton />} navigation={navigation}/>
        <View style={{marginTop: 10}}>
            <TouchableOpacity style={styles.languageElement} onPress={() =>{ changeLanguage('uk');   }}>
                <Text style={styles.languageElementText}>Ukranian</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageElement} onPress={() => {changeLanguage('en');  }}>
                <Text style={styles.languageElementText}>English</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.languageElement} onPress={() =>{ changeLanguage('ru');  }}>
                <Text style={styles.languageElementText}>Russian</Text>
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