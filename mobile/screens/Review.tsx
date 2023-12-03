import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Modal} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const API_URL = 'http://localhost:5000';
//const API_URL = 'http://192.168.0.101:5000';


const Review = () => {
    const navigation = useNavigation();
    const [visible, setVisible] = useState(true);
    const [visibleReviewModal, setVisibleReviewModal] = useState(false);
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUserID = userObject.user_id;
    const currentUserName = userObject.userName;
    const { mySessions, setMySessions} = useAuth();
    const [reviewTextError, setReviewTextError] = useState(false);
    const [ratingError, setRatingError] = useState(false);
    const { sessionReviewed, setSessionReviewed} = useAuth();


    const { selectedSessionForReview, setSelectedSessionForReview} = useAuth();
    const session_id = selectedSessionForReview ? selectedSessionForReview.session_id : null;
    const location_id = selectedSessionForReview ? selectedSessionForReview.location_id : null;

    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(0);

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            const starColor = i <= rating ? 'white' : '#C59217';
            stars.push(
                <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <FontAwesome name="star" size={26} color={starColor} />
                </TouchableOpacity>
            );
        }
        return stars;
    };

    const hide = () => {
        setVisible(false);
        setVisibleReviewModal(false);
        setSelectedSessionForReview(null); // ook nog voor andere handelingen binnen deze page
    };

    const handleDismiss = () => {
        navigation.goBack();
    };

    const openReviewModal = () => {
        setVisibleReviewModal(true);
    };

    useEffect(() => {
        console.log(selectedSessionForReview);
    }, []);

    const finishSessionWithoutReview = () => {
        let userInDB;
        if (currentUserID === selectedSessionForReview.user1_id){
            userInDB = 'user1';
        } else{
            userInDB = 'user2';
        }

        const payload = {
            userInDB,
            session_id,
            currentUserID,
        };
        fetch(`${API_URL}/finishSessionWithoutReview`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
            body: JSON.stringify(payload),
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    console.log(jsonRes.message);
                    setSessionReviewed(true);
                    hide();
                } else {
                    console.log(jsonRes.message);
                }
            } catch (err) {
                console.error(err);
            }
        })
        .catch(err => {
            console.error(err);
        });
    };

    const finishSessionWithReview = () => {
        let hasErrors = false;

        if (!reviewText || reviewText.length > 200) {
            setReviewTextError(true);
            hasErrors = true;
        }else{
            setReviewTextError(false);
        }

        if (rating === 0) {
            setRatingError(true);
            hasErrors = true;
        }else{
            setRatingError(false);
        }

        if (hasErrors) {
            return;
        }

        let userInDB;
        if (currentUserID === selectedSessionForReview.user1_id){
            userInDB = 'user1';
        } else{
            userInDB = 'user2';
        }

        const payload = {
            userInDB,
            session_id,
            location_id,
            currentUserID,
            reviewText,
            rating,
        };
        fetch(`${API_URL}/finishSessionWithReview`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
            body: JSON.stringify(payload),
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    console.log(jsonRes.message);
                    setSessionReviewed(true);
                    hide();
                } else {
                    console.log(jsonRes.message);
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
        <Modal visible={visible} animationType="slide" onRequestClose={hide} transparent onDismiss={handleDismiss}>  
            <View style={styles.modalContainer}>

              <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center' ,marginBottom:16, position:'relative', width:'70%'}}>
                <Text style={{fontSize:22, marginRight:10, color:'#6C79CF'}}>Sportsessie</Text>
                <TouchableOpacity onPress={hide} style={{position:'absolute', left:0, backgroundColor:'#6C79CF', padding:6, borderRadius:8}}>
                    <FontAwesome name="chevron-left" size={26} color='white'/>
                </TouchableOpacity>
              </View>

                <View style={styles.modal}>
                    <Text>Jij en gebruiker hebben de sessie afgerond!</Text>
                    <Text>Zou je nog een review aan gebruiker willen achterlaten?</Text>

                    <View>
                        <TouchableOpacity onPress={()=>{finishSessionWithoutReview()}}>
                            <Text>Nee</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{openReviewModal()}}>
                            <Text>Ja</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
        </Modal>

        <Modal visible={visibleReviewModal} animationType="slide" onRequestClose={hide} transparent>  
            <View style={styles.modalContainer}>

              <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center' ,marginBottom:16, position:'relative', width:'70%'}}>
                <Text style={{fontSize:22, marginRight:10, color:'#FFC436'}}>Review</Text>
              </View>

                <View style={[styles.modal,{backgroundColor:'#FFC436'}]}>
                    <View>
                        <Text>Hoe was jouw ervaring op deze locatie?</Text>
                        <TextInput placeholder="" autoCapitalize="none" onChangeText={(text) => setReviewText(text)} value={reviewText}/>
                        <Text style={{color: reviewTextError ? 'red' : '#FFC436'}}>veld mag niet leeg zijn of groter dan 200 karakters</Text>
                    </View>

                    <View style={{flexDirection:'row'}}>
                        {renderStars()}
                    </View>
                    <Text style={{color: ratingError ? 'red' : '#FFC436'}}>geef een rating door</Text>


                    <View>
                        <TouchableOpacity onPress={()=>{hide()}}>
                            <Text>Annuleren</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{finishSessionWithReview()}}>
                            <Text>Verzenden</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                
            </View>
        </Modal>
        </View>
    );
};

export default Review

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
    },
    modalContainer: {
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor:'white',
        justifyContent:'center',
        alignItems:'center',
    },
    modal: {
        width:300,
        height:380,
        backgroundColor:'#6C79CF',
        alignItems:'center',
        paddingTop:50,
        borderRadius:30,
    },
});