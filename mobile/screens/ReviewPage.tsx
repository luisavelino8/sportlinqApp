import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../mobile/AuthContext';
import { NavigationProp } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface Routerprops {
  navigation: NavigationProp<any, any>;
}

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://192.168.0.101:5000';

const ReviewPage = ({ navigation }: Routerprops) => {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject.user_id;

    const {myReviews, setMyReviews} = useAuth();

    const renderStars = (rating: number) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const starColor = i <= rating ? '#FFC436' : 'white';
            stars.push(
                <FontAwesome key={i} name="star" size={18} color={starColor} />
            );
        }
        return stars;
    };


    return (
        <View style={styles.container}>
            <View style={styles.optionBar}></View>

            <View style={styles.reviewContainer}>
            <FlatList
                data={myReviews} 
                keyExtractor={(item) => item.review_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.textContainer}>
                            {/* <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/> */}
                            <View style={styles.reviewInfo}>
                                <Text style={{ fontSize: 16 }}>{item.locationReview.locationName}</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    {renderStars(item.rating)}
                                </View>
                                <Text style={{ fontSize: 16 }}>{item.reviewText}</Text>
                                <Text style={{ fontSize: 16 }}>{item.sessionReview.date}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
        </View>
      );
}

export default ReviewPage

const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
        height:'100%',
    },
    optionBar: {
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
    },
    reviewContainer: {
        height:'auto',
        width:'100%',
    },
    textContainer: {
        height:100,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'lightgrey',
    },
    reviewInfo: {
        height:'100%',
        width:'70%',
        justifyContent:'center',
    },
    image: {
        width:60,
        height:60,
        borderRadius:50,
        backgroundColor:'#555FA3',
        marginHorizontal:16,
    },
});