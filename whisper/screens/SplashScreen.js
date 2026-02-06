import {View, ActivityIndicator, Text, StyleSheet,SafeAreaView} from "react-native";



export default function SplashScreen() {

return (
    <SafeAreaView style={{flex:1}}>
        <View style={{flex: 1, justifyContent: 'center', alignItems:'center'}}>
            <ActivityIndicator size="large" color="black"/>
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
        
    }
});