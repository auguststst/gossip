import {View, Text, StyleSheet, TouchableOpacity, Image} from "react-native"
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';


export default function StartScreen({ navigation }){


    const { t } = useTranslation();

    return(
        <View style={styles.container}>
           <Image source={  require('../img/whisper.png') } style={styles.photo }></Image>
           <Text style={styles.header }>Gossip</Text>
           <Text style={styles.paragraph }>{t('welcome')}</Text>
           
           <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Login")}>
                <Text style={{ color: '#4681f4', textAlign: 'center', fontSize: 20 }}>{t('start')} Gossip</Text>
           </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    header:{
      fontSize: 30,
      marginTop: -70
    },
    paragraph: {
      width: 431,
      marginTop: 10, 
      paddingHorizontal:40,
      fontSize: 16,
      textAlign: "center",
    },
    photo: {
      width: 290, 
      height: 290, 
      marginTop: -300
    },
    button:{
        position: 'absolute',
        paddingVertical: 5,
        bottom: 30,
        width: "75%",
    },

  });