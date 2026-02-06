import {View, Text, Image,TouchableOpacity} from "react-native";
import { useNavigation } from '@react-navigation/native';

export default function Header(props){
    return (
        <View style={{ flexDirection: 'row', height: 40, marginTop: 35}}>
            <View style={{flex:1}}>
                {props.leftUpperButton}
            </View>
            <View style={{flex:7, alignItems:'center', justifyContent: 'center'}}>
                {props.middle}
            </View>
            <View style={{flex:1, justifyContent:'center', alignItems: 'flex-end'}}>
                {props.menuButton}
            </View>
        </View>
    );

}



export function MenuButton(){
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
        <Image style={{width: 20, height: 20, marginRight: 20}} source={require('./img/more.png')} resizeMode="contain" />
        </TouchableOpacity>
    )
}
