import {View, Text, StyleSheet, SafeAreaView, ScrollView, FlatList, TextInput,TouchableOpacity, Image} from "react-native";
import {AuthContext} from '../context/AuthContext';
import Header from '../component.js';
import {useContext, useRef, useState} from "react";
import { Feather } from '@expo/vector-icons';
import filter from "lodash.filter";
import {BASE_URL} from '../config';
import { useTranslation } from 'react-i18next';





function Search({reference, onFocus, keyType, submit, searchText, searchTextf, capitalize}){
    const { t } = useTranslation();
    return (
        <TextInput 
        ref={reference}
        onFocus={onFocus}
        returnKeyType={keyType}
        onSubmitEditing={submit}
        
        value={searchText}
        onChangeText={searchTextf}
        placeholder={t('search')}
        style={ styles.searchInput }
        autoCapitalize={capitalize}
        />
    );
};


export default function SearchScreen({navigation}){


    const contextValue = useContext(AuthContext);
    const [searchText, setSearchText] = useState(null);
    const [searchShowContent, setSearchShowContent] = useState(false);
    const [pressed, setPressed] = useState(false);
    

    const handleProfilePress = (username) => {
        navigation.navigate("User", { username });
        contextValue.getProfileData(username);
        contextValue.checkFollow(contextValue.userInfo.username, username);
        contextValue.getNumbers(username);
        contextValue.checkRegistered(username);
        contextValue.getProfileUserImage(username);
        contextValue.setProfileImage(null);
        contextValue.databaseExists(username);
        setSearchText(null);
    };

    
    

    const handleSearch = (query) => {
        setSearchText(query);
        const formattedQuery = query.toLowerCase();
        const filteredData = filter(contextValue.SearchFollowingUsers, (user) => {
            return contains(user, formattedQuery);
        });
        contextValue.setData(filteredData);
    };

    const renderItem = ({ item }) => {

        const imageUrl = item.image ? `${BASE_URL}/media/${item.image}` : null;

        return(
            <View style={styles.element} >
                    <View style={styles.wrapperHandle}>
                        <TouchableOpacity style={{flex:3}} onPress={()=> handleProfilePress(item.username)}>
                        <Text style={styles.handle}>@{item.username}</Text>
                    </TouchableOpacity>
                </View>
            
                <View style={{flex:3}}>
                    <TouchableOpacity style={styles.wrapperProfilePhoto} onPress={()=> handleProfilePress(item.username)}>
                        {item.image != null && item.image != "" ? (
                                <Image source={{ uri: imageUrl }} style={styles.profilePhoto }></Image>
                    ) : (
                                <Image source={ require('../img/zaglushka.jpg') } style={styles.profilePhoto }></Image>
                    )}
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    const contains = ({username}, query) => {

        if (username.includes(query)){
            return true;
        }else{
            return false;
        }
    };


    return(
        <SafeAreaView>
            <Header middle={<Search keyType={"search"}
                                    submit={()=> {
                                        let username = contextValue.removeSymbol(searchText);
                                        console.log(username);
                                        if(username != null && username != ""){
                                            navigation.navigate("User", {username: username }); 
                                            contextValue.getProfileData(username); 
                                            contextValue.checkFollow(contextValue.userInfo.username, username); 
                                            contextValue.getNumbers(username);
                                            contextValue.checkRegistered(username);
                                            setSearchText(null); 
                                            contextValue.addToSearch(username); 
                                            contextValue.getProfileUserImage(username);
                                            contextValue.databaseExists(username, true);
                                        }  
                                    }}
                                    searchText={searchText}
                                    searchTextf={(query) => handleSearch(query)}
                                    capitalize="none"

                                    />} />

            
{ contextValue.data && Array.isArray(contextValue.data) && (
            <FlatList
                keyExtractor={(item) => item.id}
                data={contextValue.data}
                renderItem={renderItem}
            />
        )}
            
          

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
    searchInput: {
        borderRadius: 30, 
        width: "100%", 
        padding: 8, 
        backgroundColor: '#d9d9d9', 
        fontSize: 17, 
        paddingHorizontal: 20
    },
    element: {
        flexDirection: 'row-reverse',
        borderBottomWidth: 1.5,
        borderBottomColor: "#eee",
        paddingVertical: 10,
        width: "80%",
        alignSelf: "center",
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
     followButton: {
        flex: 1,
        padding: 9, 
        backgroundColor: "#d9d9d9", 
        borderRadius: 10,
        fontWeight: "bold",
        alignSelf: "flex-end",
        marginRight: 20,
        marginBottom: 5,
     },
     wrapperHandle:{
        flex:13,
        flexDirection:"row", 
        alignItems:"center"
     },
     handle:{
        flex:3,
        textAlign: 'left',
        fontSize:15, 
        fontWeight:'bold',
        marginTop: 15,
     },
    });