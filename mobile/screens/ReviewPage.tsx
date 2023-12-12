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
                <FontAwesome key={i} name="star" size={22} color={starColor} />
            );
        }
        return stars;
    };

    const getTimeAgo = (sessionDate: string) => {
        const today = new Date();
        const session = new Date(sessionDate);
    
        const timeDifference = today.getTime() - session.getTime();
        // const daysDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
    
        // if (daysDifference < 1) {
        //     return 'Vandaag';
        // } else if (daysDifference < 2) {
        //     return 'Gisteren';
        // } else if (daysDifference < 30) {
        //     return `${daysDifference} dagen geleden`;
        // } else {
        //     const monthsDifference = Math.floor(daysDifference / 30);
        //     return `${monthsDifference} ${monthsDifference === 1 ? 'maand' : 'maanden'} geleden`;
        // }

        const hoursDifference = Math.ceil(timeDifference / (1000 * 60 * 60));
        if (hoursDifference < 24) {
            return 'Vandaag';
        } else if (hoursDifference < 48) {
            return 'Gisteren';
        } else if (hoursDifference < 24 * 30) {
            const daysDifference = Math.floor(hoursDifference / 24);
            return `${daysDifference} ${daysDifference === 1 ? 'dag' : 'dagen'} geleden`;
        } else {
            const monthsDifference = Math.floor(hoursDifference / (24 * 30));
            return `${monthsDifference} ${monthsDifference === 1 ? 'maand' : 'maanden'} geleden`;
        }
    };


    return (
        <View style={styles.container}>
            <View style={styles.optionBar}>
                <Text style={{color:'#7D8DF6'}} >Reviews van afgeronde sessies</Text>
            </View>

            <View style={styles.reviewContainer}>
            <FlatList
                data={myReviews} 
                keyExtractor={(item) => item.review_id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.textContainer}>
                            {/* <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/> */}
                            <View style={styles.reviewInfo}>
                                <View style={{width:'100%', flexDirection:'row'}}>
                                    <View style={{width:'60%'}}>
                                        <Text style={{ fontSize: 16 }}>{item.locationReview.locationName}</Text>
                                    </View>
                                    <View style={{width:'40%', alignItems:'flex-end'}}>
                                        <Text style={{ fontSize: 16, color:'dimgrey' }}>{getTimeAgo(item.sessionReview.date)}</Text>
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    {renderStars(item.rating)}
                                </View>
                                <Text style={{ fontSize: 13, width:'100%', paddingTop:6 }}>{item.reviewText}</Text>
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
        height:140,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'lightgrey',
        padding:12,
    },
    reviewInfo: {
        height:110,
        width:'100%',
        justifyContent:'flex-start',
    },
    image: {
        width:60,
        height:60,
        borderRadius:50,
        backgroundColor:'#555FA3',
        marginHorizontal:16,
    },
});