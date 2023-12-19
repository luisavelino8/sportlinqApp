import {View, Text, StyleSheet, ScrollView, Image, Button, TouchableOpacity, Switch} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../mobile/AuthContext';
import { imageRoutes } from '../../assets/images/imagesRoutes';
import MapView, { Callout, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { useNavigation } from '@react-navigation/native';

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

const INITIAL_REGION = {
    latitude: 52.3676,
    longitude: 5.2041,
    latitudeDelta: 3,
    longitudeDelta: 3,
};

// voor nu voorbeeld locaties, straks echte locaties gebruiken
const markers = [
    {
        latitude: 52.372353,
        longitude: 4.884312,
        latitudeDelta: 3,
        longitudeDelta: 3,
        name:'KC Move',
        address:'Rozengracht 93A',
        zipcode:'1016 LT Amsterdam',
    },
    {
        latitude: 52.398296,
        longitude: 4.903456,
        latitudeDelta: 3,
        longitudeDelta: 3,
        name:'Sportschool The Golden Lion',
        address:' Van Hogestraat 33',
        zipcode:'1031 HH Amsterdam',
    },
    {
        latitude: 52.292339,
        longitude: 4.990812,
        latitudeDelta: 3,
        longitudeDelta: 3,
        name:'Sportveld de Plas',
        address:'Henk Bernardstraat 494',
        zipcode:'1107 CS Amsterdam',
    },
]

const LocationComponent = () => {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken } = useAuth();

    const { locations, setLocations} = useAuth();
    const navigation = useNavigation();

    const [isChecked, setIsChecked] = useState(false);
    const toggleIsChecked = () => {
        setIsChecked(value => !value);
    };

    useEffect(() => {
        navigation.setOptions({
                    headerRight: () => (
                        <Switch value={isChecked} onValueChange={toggleIsChecked} thumbColor={'#7D8DF6'} 
                        trackColor={{true:'lightgrey', false:'lightgrey'}} style={{marginRight:14}}/>
                    ),
                });
    }, [isChecked]);


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

            {isChecked ? (
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
                            </View>
                        </View>
                    ))}
                </View>
                </ScrollView>
            ) : (
                <MapView style={StyleSheet.absoluteFill} 
                provider={PROVIDER_GOOGLE} 
                initialRegion={INITIAL_REGION}
                showsUserLocation
                showsMyLocationButton
                >
                    {markers.map((marker, index) => (
                        <Marker key={index} coordinate={marker}>
                            <Callout>
                                <View style={{padding:12, justifyContent:'center',alignItems:'center'}}>
                                    <Text style={{color:'#7D8DF6'}} >{marker.name}</Text>
                                    <Text style={{color:'#7D8DF6'}} >{marker.address}</Text>
                                    <Text style={{color:'#7D8DF6'}} >{marker.zipcode}</Text>
                                </View>
                            </Callout>
                        </Marker>
                    ))}
                </MapView>

                // <View>
                //     <Text>Maps</Text>
                // </View>
            )}

        </View>
    );
};

export default LocationComponent

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
    },
    map: {
        width:'100%',
        height:'100%',
    },
    scrollView: {
        width: '100%',
        height: '100%',
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:16,
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