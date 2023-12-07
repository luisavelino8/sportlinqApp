import { View, Text, StyleSheet, TextInput, Button, TouchableOpacity, ScrollView, Modal} from 'react-native';
import React, { useEffect, useState } from 'react';
import { NavigationProp, useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { showMessage, hideMessage } from 'react-native-flash-message';


const Review = () => {
    const { API_URL, setAPI_URL} = useAuth();

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
    const locationName = selectedSessionForReview ? selectedSessionForReview.locationRelation.locationName : null;
    const street = selectedSessionForReview ? selectedSessionForReview.locationRelation.street : null;

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
                    //console.log(jsonRes.message);
                    showToast(jsonRes.message);
                    setSessionReviewed(true);
                    hide();
                } else {
                    //console.log(jsonRes.message);
                    showFailToast(jsonRes.message);
                }
            } catch (err) {
                console.error(err);
            }
        })
        .catch(err => {
            console.error(err);
        });
    };

    const showToast = (value: string) => {
        showMessage({
          message: value,
          type: 'success', // 'default', 'info', 'success', 'danger'
          autoHide: true,
          duration: 5000,
          style: {
            borderRadius: 10, 
            padding: 16, 
            width: '95%',
            alignSelf:'center',
            top: 50,
            justifyContent: 'center',
          },
        });
    };

    const showFailToast = (value: string) => {
        showMessage({
          message: value,
          type: 'danger', // 'default', 'info', 'success', 'danger'
          autoHide: true,
          duration: 5000,
          style: {
            borderRadius: 10, 
            padding: 16, 
            width: '95%',
            alignSelf:'center',
            top: 50,
            justifyContent: 'center',
          },
        });
    };

    return (
        <View style={styles.container}>
        <Modal visible={visible} animationType="slide" onRequestClose={hide} transparent onDismiss={handleDismiss}>  
            <View style={styles.modalContainer}>

              <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center' ,marginBottom:16, position:'relative', width:'70%'}}>
                <Text style={{fontSize:22, marginRight:10, color:'#6C79CF'}}>Sportsessie #{session_id}</Text>
                <TouchableOpacity onPress={hide} style={{position:'absolute', left:0, backgroundColor:'#6C79CF', padding:6, borderRadius:8}}>
                    <FontAwesome name="chevron-left" size={26} color='white'/>
                </TouchableOpacity>
              </View>

                <View style={styles.modal}>

                        <View style={{width:'100%', alignItems:'center', marginBottom:20, marginTop:30}}>
                            <Text style={{fontSize:20, color:'white'}} >{locationName}</Text>
                            <Text style={{fontSize:13, color:'white'}} >{street}</Text>
                        </View>

                        <View style={{width:'70%',justifyContent:'space-evenly', alignItems:'center', height:100}}>
                            <Text style={{fontSize:16, color:'white', textAlign:'center'}}>Je hebt de sessie afgerond!</Text>
                            <Text style={{fontSize:16, color:'white', textAlign:'center'}}>Zou je nog een review achter willen laten?</Text>
                        </View>

                        <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'80%', marginTop:30}} >
                            <TouchableOpacity onPress={()=>{finishSessionWithoutReview()}} style={[styles.button]}>
                                <Text style={{color:'white', textAlign:'center'}}>Nee</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>{openReviewModal()}} style={[styles.button, {backgroundColor:'#C0C9FF'}]}>
                                <Text style={{color:'#555FA3', textAlign:'center'}}>Ja</Text>
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

                    <View style={{width:'100%', alignItems:'center', marginBottom:20}}>
                        <Text style={{fontSize:20, color:'white'}} >Sportsessie #{session_id}</Text>
                    </View>

                    <View style={{width:'94%',height:170,alignItems:'center', backgroundColor:'#FFDE8D', borderRadius:8, padding:10}} >
                        <Text style={{fontSize:12, color:'#C59217',width:'100%',justifyContent:'flex-start'}}>Hoe was jouw ervaring op deze locatie?</Text>
                        <TextInput style={{width:'100%',height:120,textAlignVertical: 'top', marginVertical:8}} multiline placeholder="" autoCapitalize="none" onChangeText={(text) => setReviewText(text)} value={reviewText}/>
                        <Text style={{fontSize:12,textAlign:'center',color: reviewTextError ? 'red' : '#FFDE8D'}}>geen lege veld of meer dan 200 karakters</Text>
                    </View>

                    <View style={{flexDirection:'row', marginTop:14}}>
                        {renderStars()}
                    </View>
                    <Text style={{fontSize:12,color: ratingError ? 'red' : '#FFC436', marginVertical:6}}>geef een rating</Text>


                    <View style={{flexDirection:'row', justifyContent:'space-evenly', width:'80%'}}>
                        <TouchableOpacity onPress={()=>{hide()}} style={[styles.button, {backgroundColor:'#FFDE8D'}]}>
                            <Text style={{color:'#C59217', textAlign:'center'}}>Annuleren</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{finishSessionWithReview()}} style={[styles.button,{backgroundColor:'#E09E00'}]}>
                            <Text style={{color:'white', textAlign:'center'}}>Verzenden</Text>
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
    button: {
        width:95,
        height:30,
        alignItems:'center',
        justifyContent:'center',
        padding:16,
        borderRadius:8,
        backgroundColor:'#555FA3',
    }
});