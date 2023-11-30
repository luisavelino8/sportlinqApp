import {View, Text, StyleSheet, ScrollView, Image, Button, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../mobile/AuthContext';
import { imageRoutes } from '../../assets/images/imagesRoutes';

interface ImageRoutes {
    [key: string]: any;
}
const myImageRoutes: ImageRoutes = imageRoutes;

interface LocationType {
    location_id: number;
    locationName: string;
    description: string;
    sport: string;
    street: string;
    city: string;
    zipcode: string;
    image: string;
}

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://192.168.0.101:5000';
//const API_URL = 'http://145.44.217.63:5000'; //van school
//const API_URL = 'http://192.168.178.24:5000';



const LocationComponent = () => {
    const { useToken, setToken } = useAuth();

    const { locations, setLocations} = useAuth();

    // getlocations uitvoeren wanneer component geladen
    // useEffect(() => {
    //     getLocations();
    // }, []);

    // deze request is verplaatst naar Inloggen
    const getLocations = () => {
        fetch(`${API_URL}/locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setLocations(jsonRes);
                } else {
                    console.error(jsonRes.message);
                }
            } catch (err) {
                console.error(err);
            }
        })
        .catch(err => {
            console.error(err);
        });
    };

    return (
        <View style={styles.container}>
            {/*<Text style={{marginTop:50, width:'100%'}}></Text>*/}
            <ScrollView style={styles.scrollView}>
                <View style={styles.cardContainer}>
                    {(locations as LocationType[]).map(location => (
                        <View style={styles.card} key={location.location_id}>
                            <Image
                                style={styles.image}
                                source={myImageRoutes[location.image]}
                                //source={ require(`../../assets/images/${location.image}`)}
                            />
                            <View style={styles.textContainer}>
                                <Text style={[styles.text,{fontSize:18}]}>{location.locationName}</Text>
                                <Text style={[styles.text,{fontSize:14, color:'#C0C9FF'}]}>{location.sport}</Text>
                                <Text style={styles.text}>{location.street}</Text>
                                <Text style={styles.text}>{location.city}</Text>
                                {/* <TouchableOpacity style={styles.button} onPress={() => {}}>
                                    <Text style={{color:'white'}}>Info</Text>
                                </TouchableOpacity> */}
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
};

export default LocationComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        marginTop:16,
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width:'85%',
        height:180,
        backgroundColor:'white',
        marginVertical: 12,
        borderRadius:16,
        overflow:'hidden',
    },
    textContainer: {
        flex:1,
        paddingLeft:18,
        justifyContent:'center',
        position:'relative',
    },
    text: {
        color:'#7D8DF6',
        fontSize:10,
    },
    image: {
        width: 'auto',
        height: '55%',
    },
    headerText:{
        color:'red',
        fontSize:12,
    },
    button: {
        position:'absolute',
        bottom: 14,
        right: 14,
        backgroundColor:'#7D8DF6',
        paddingVertical:4,
        paddingHorizontal:12,
        borderRadius:6,
    }

});