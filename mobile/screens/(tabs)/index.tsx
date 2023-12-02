import {View, Text} from 'react-native';
import React from 'react';
import { useAuth } from '../../AuthContext';

const Home = () => {
    const { userObject, setUserObject} = useAuth();
    const currentUserName = userObject ? userObject.userName : null;
    
    return (
        <View style={{flex:1, alignItems:'center', justifyContent:'center'}}>
            <Text style={{fontSize:25}}>Welcome {currentUserName}</Text>
        </View>
    )
}

export default Home