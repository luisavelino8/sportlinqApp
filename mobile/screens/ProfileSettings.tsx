import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import React from 'react';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

const ProfileSettings = ({ navigation }: Routerprops) => {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.infoContainer}>
                <TouchableOpacity 
                testID="profileSettingsOptions"
                onPress={() => {
                    navigation?.navigate('AccountDetail');
                }} >
                <Text style={{color:'darkgrey', fontWeight:'bold'}}>Je account</Text>
                <View style={styles.insideInfo}>
                    <FontAwesome name="user" size={30} color='black' style={{ marginRight: 15}}/>
                    <View style={{flexDirection:'column'}}>
                    <Text style={{color:'black'}}>Accountbeheer</Text>
                    <Text style={{color:'grey', fontSize:13}}>Wachtwoord, persoonlijke gegevens, over mij</Text>
                    </View>
                    <FontAwesome name="angle-right" size={25} color='black' style={{ marginLeft: 35}}/>
                </View>
                <Text style={{color:'grey', fontSize:13}}>Beheer je accountinstellingen</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.endContainer}>
                <TouchableOpacity 
                style={styles.button}
                onPress={() => {
                    setToken(null);
                    setUserObject(null);
                }}>
                    <Text style={{color:'red', marginRight:6}}>Uitloggen</Text>
                    <FontAwesome name="sign-out" size={25} color='red' style={{ marginRight: 15}}/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
      );
}

export default ProfileSettings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        width:'100%',
        height:'100%',
        position:'relative',
    },
    infoContainer: {
        height:'20%',
        width:'100%',
        backgroundColor:'white',
        position:'absolute',
        marginTop:10,
        padding:16,
    },
    insideInfo: {
        height: 60,
        flexDirection:'row',
        alignItems:'center',
    },
    endContainer: {
        height:'10%',
        width:'100%',
        backgroundColor:'white',
        position:'absolute',
        bottom:0,
        paddingBottom:6,
    },
    button: {
        flex:1,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    }
});