import {View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Switch, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { showMessage, hideMessage } from 'react-native-flash-message';
import { NavigationProp } from '@react-navigation/native';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

interface RequestSessionType {
    id: number;
    requesterUserId: number;
    receiverUserId: number;
    location_id: number;
    date: string;
    locationRelation: {
        locationName: string;
        street: string;
    };
    requesterUser: {
        userName: string;
    };
    receiverUser: {
        userName: string;
    };
}

interface SessionType {
    session_id: number;
    user1_id: number;
    user2_id: number;
    location_id: number;
    date: string;
    finished: string;
    reviewUser1: string;
    reviewUser2: string;
    locationRelation: {
        locationName: string;
        street: string;
    };
    user1: {
        userName: string;
    };
    user2: {
        userName: string;
    };
}


const Sessions = ({ navigation }: Routerprops) => {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken, userObject, setUserObject, locations, setLocations } = useAuth();
    const { sessionRequests, setSessionRequests} = useAuth();
    const { mySessions, setMySessions} = useAuth();
    const { selectedSessionForReview, setSelectedSessionForReview} = useAuth();
    const currentUserID = userObject.user_id;
    const currentUserName = userObject.userName;
    const { sessionReviewed, setSessionReviewed} = useAuth(); // deze om sessies opnieuw te laden, als sessie is reviewed (YES/NO)
    const [allObjectsNull, setAllObjectsNull] = useState(true);

    // bij ophalen van sessies checken of array null objects heeft, omdat ze al reviewed zijn
    let areAllObjectsNull = true;



    const [isChecked, setIsChecked] = useState(false);
    const toggleIsChecked = () => {
        setIsChecked(value => !value);
    };


    // luister of er nieuwe pending sessions zijn, dan sessies opnieuw laden
    const { listenPendingSessions, setListenPendingSessions } = useAuth();

    //getSessions uitvoeren wanneer component geladen
    useEffect(() => {
        getSessionRequests();
        getSessions();
        // hier luisteren naar change pending sessions
        if (listenPendingSessions || currentUserName || sessionReviewed) {
            areAllObjectsNull = true;
            getSessionRequests();
            getSessions();
            setListenPendingSessions(false);
            setSessionReviewed(false);
        }
    }, [listenPendingSessions, currentUserName, sessionReviewed]);

    const sessionToReview = (object: SessionType) => {
        setSelectedSessionForReview(object);
        navigation?.navigate('Review');
    };


    const getSessionRequests = () => {
        fetch(`${API_URL}/getSessionRequests?user_id=${currentUserID}`, {
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
                    setSessionRequests(jsonRes)
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

    const deleteSessionRequest = (id: number) => {
        fetch(`${API_URL}/deleteSessionRequest?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    //showToast(jsonRes.message);
                    console.log(jsonRes.message);
                    getSessionRequests();
                    getSessions();
                } else {
                    //showFailToast(jsonRes.message);
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

    const acceptSessionRequest = (id: number) => {
        fetch(`${API_URL}/acceptSessionRequest?id=${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    //showToast(jsonRes.message);
                    console.log(jsonRes.message);
                    getSessionRequests();
                    getSessions();
                } else {
                    //showFailToast(jsonRes.message);
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

    const getSessions = () => {
        fetch(`${API_URL}/sessions?user_id=${currentUserID}`, {
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
                    setMySessions(jsonRes);
                    console.log(jsonRes);
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);

        // Extract components
        const day = date.getDate();
        const month = date.getMonth() + 1; // Months are zero-based
        const hours = date.getHours();
        const minutes = date.getMinutes();

        // Format components
        const formattedDate = `${day < 10 ? '0' : ''}${day}-${month < 10 ? '0' : ''}${month} ${hours}:${minutes}`;

        return formattedDate;
    };


    return (
        <View style={styles.container}>
            {/* <Switch value={isChecked} onValueChange={toggleIsChecked} thumbColor={'#7D8DF6'} 
            trackColor={{true:'lightgrey', false:'lightgrey'}}/> */}

            {isChecked ? (
                // alternatieve lijst vorm
                <View style={styles.alterListScrollView} >

                    <Switch value={isChecked} onValueChange={toggleIsChecked} thumbColor={'#7D8DF6'} 
                    trackColor={{true:'lightgrey', false:'lightgrey'}} style={{alignSelf:'center',marginBottom:10}} />

                    <Text style={{fontSize:12, paddingLeft:8, paddingTop:2, marginBottom:4,borderTopWidth:.8,borderBottomColor:'lightgrey' }}>Sessie verzoeken</Text>
                    <FlatList
                    data={sessionRequests}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{flexDirection:'row', width:'100%',padding:6, borderBottomWidth:.8,borderBottomColor:'lightgrey'}}>
                                <View style={{width:'5%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <View style={{width:16, height:16,borderRadius:50, backgroundColor:'#FFC436'}}></View>
                                </View>

                                <View style={{width:'25%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}} >
                                    {item.requesterUser.userName !== currentUserName && (
                                    <Text style={{fontSize:11}}>{item.requesterUser.userName}</Text>
                                    )}

                                    {item.receiverUser.userName !== currentUserName && (
                                    <Text style={{fontSize:11}}>{item.receiverUser.userName}</Text>
                                    )}
                                </View>

                                <View style={{width:'44%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.locationRelation.locationName}</Text>
                                </View>

                                <View style={{width:'26%'}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{formatDate(item.date)} uur</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    />

                    <Text style={{fontSize:12, paddingLeft:8,paddingTop:2, marginBottom:4,borderTopWidth:.8,borderBottomColor:'lightgrey'}}>Geplande sessies</Text>
                    <FlatList
                    data={mySessions.filter((item: SessionType)  => item.finished !== 'YES')}
                    keyExtractor={(item) => item.session_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{flexDirection:'row', width:'100%', padding:6, borderBottomWidth:.8,borderBottomColor:'lightgrey'}}>
                                <View style={{width:'5%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <View style={{width:16, height:16,borderRadius:50, backgroundColor:'#7D8DF6'}}></View>
                                </View>

                                <View style={{width:'25%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}} >
                                    {item.user1.userName !== currentUserName && (
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.user1.userName}</Text>
                                    )}

                                    {item.user2.userName !== currentUserName && (
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.user2.userName}</Text>
                                    )}
                                </View>

                                <View style={{width:'44%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.locationRelation.locationName}</Text>
                                </View>

                                <View style={{width:'26%'}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{formatDate(item.date)} uur</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    />


                    <Text style={{fontSize:12, paddingLeft:8,paddingTop:2, marginBottom:4,borderTopWidth:.8,borderBottomColor:'lightgrey'}}>Afgeronde sessies</Text>
                    <FlatList
                    data={mySessions.filter((item: SessionType)  => item.finished === 'YES')}
                    keyExtractor={(item) => item.session_id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => {}}>
                            <View style={{flexDirection:'row', width:'100%', padding:6, borderBottomWidth:.8,borderBottomColor:'lightgrey'}}>
                                <View style={{width:'5%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <View style={{width:16, height:16,borderRadius:50, backgroundColor:'#7D8DF6'}}></View>
                                </View>

                                <View style={{width:'25%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}} >
                                    {item.user1.userName !== currentUserName && (
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.user1.userName}</Text>
                                    )}

                                    {item.user2.userName !== currentUserName && (
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.user2.userName}</Text>
                                    )}
                                </View>

                                <View style={{width:'44%', borderRightWidth:.7,borderRightColor:'lightgrey', marginRight:6}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{item.locationRelation.locationName}</Text>
                                </View>

                                <View style={{width:'26%'}}>
                                    <Text style={{fontSize:11}} numberOfLines={1} ellipsizeMode="tail">{formatDate(item.date)} uur</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    />

                </View>
            ) : (
            <ScrollView style={styles.scrollView}>
                <Switch value={isChecked} onValueChange={toggleIsChecked} thumbColor={'#7D8DF6'} 
                trackColor={{true:'lightgrey', false:'lightgrey'}} style={{alignSelf:'center',marginBottom:10}}/>

                <Text style={{fontSize:16, marginLeft:30, marginBottom:6}}>Sessie verzoeken</Text>

            <View style={styles.cardContainer}>
            {sessionRequests && sessionRequests.length > 0 ? (
                // Als sessions niet leeg is
                (sessionRequests as RequestSessionType[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(session => {
                //(sessionRequests.slice().reverse() as RequestSessionType[]).map(session => {
                const originalDate = new Date(session.date);
                const formattedDate = `${originalDate.getDate()}-${originalDate.getMonth() + 1}-${originalDate.getFullYear().toString().slice(2)} ${originalDate.getHours()}:${originalDate.getMinutes()}`;

                return (
                    <View style={styles.card} key={session.id}>

                    <View style={styles.textContainer}>
                        <Text style={[styles.text, { fontSize: 20 }]}>{session.locationRelation.locationName}</Text>
                        <Text style={[styles.text, { fontSize: 14 }]}>{session.locationRelation.street}</Text>

                        <View style={styles.lowerBox}>
                        <Text style={[styles.dateBox, { fontSize: 18, color: 'black' }]}>{formattedDate} uur</Text>

                            <View style={styles.lowerBox2}>
                                <Text style={{ color: 'black', fontSize: 18 }}>Sessie met:</Text>
                                {session.requesterUser.userName !== currentUserName && (
                                <Text style={[styles.text, { fontSize: 18 }]}>{session.requesterUser.userName}</Text>
                                )}

                                {session.receiverUser.userName !== currentUserName && (
                                <Text style={[styles.text, { fontSize: 18 }]}>{session.receiverUser.userName}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={styles.sideButton} onPress={() => {}}>
                        <View>
                        <Text style={{ color: 'black' }}>Bekijk</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => {deleteSessionRequest(session.id)}}>
                        <View>
                            <FontAwesome name="close" size={25} color='black'/>
                        </View>
                    </TouchableOpacity>
                    
                    {currentUserID !== session.requesterUserId && (
                    <TouchableOpacity style={styles.acceptButton} onPress={() => acceptSessionRequest(session.id)}>
                        <View>
                            <FontAwesome name="check" size={25} color="black" />
                        </View>
                    </TouchableOpacity>
                    )}

                    </View>
                );
                })
            ) : (
                // Als sessions leeg is
                <View style={styles.emptyCard}>
                <Text style={{color:'black', fontSize:18}}>Geen sessie verzoeken</Text>
                </View>
            )}
            </View>


            {/* tweede cardContainer voor de daadwerkelijke geplande sessies */}
            <Text style={{fontSize:16, marginLeft:30, marginBottom:6}}>Geplande sessies</Text>
            <View style={styles.cardContainer}>
            {mySessions && mySessions.length > 0 ? (
                // Als sessions niet leeg is
                (mySessions as SessionType[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(session => {
                //(mySessions.slice().reverse() as SessionType[]).map(session => {

                const userInDB = currentUserID === session.user1_id ? 'user1' : 'user2';

                // Controleer of de huidige gebruiker de sessie al heeft beoordeeld
                const sessionReviewed =
                    (userInDB === 'user1' && session.reviewUser1 !== 'notconfirmed') ||
                    (userInDB === 'user2' && session.reviewUser2 !== 'notconfirmed');
        
                if (sessionReviewed) {
                    // Sla het renderen van deze sessiekaart over als deze al is beoordeeld
                    return null;
                }

                areAllObjectsNull = false;
                //setAllObjectsNull(false);
        
                const originalDate = new Date(session.date);
                const formattedDate = `${originalDate.getDate()}-${originalDate.getMonth() + 1}-${originalDate.getFullYear().toString().slice(2)} ${originalDate.getHours()}:${originalDate.getMinutes()}`;

                const currentDate = new Date();
                const threeHoursLater = new Date(originalDate.getTime() + 3 * 60 * 60 * 1000);

                return (
                    <View style={[styles.card, {backgroundColor:'#7D8DF6'}]} key={session.session_id}>

                        {currentDate >= threeHoursLater && (
                        // Voeg nieuwe knop toe als het 3 uur of meer is verstreken
                        <TouchableOpacity style={styles.reviewButton} onPress={() => {sessionToReview(session)}}>
                        <Text style={{color: 'white'}}>Review</Text>
                        </TouchableOpacity>
                        )}

                    <View style={styles.textContainer}>
                        <Text style={[styles.text2, { fontSize: 20 }]}>{session.locationRelation.locationName}</Text>
                        <Text style={[styles.text2, { fontSize: 14 }]}>{session.locationRelation.street}</Text>

                        <View style={styles.lowerBox}>
                        <Text style={[styles.dateBox, { fontSize: 18, color: 'white' }]}>{formattedDate} uur</Text>

                            <View style={styles.lowerBox2}>
                                <Text style={{ color: 'white', fontSize: 18 }}>Sessie met:</Text>
                                {session.user1.userName !== currentUserName && (
                                <Text style={[styles.text2, { fontSize: 18 }]}>{session.user1.userName}</Text>
                                )}

                                {session.user2.userName !== currentUserName && (
                                <Text style={[styles.text2, { fontSize: 18 }]}>{session.user2.userName}</Text>
                                )}
                            </View>
                        </View>
                    </View>

                    <TouchableOpacity style={[styles.sideButton,{backgroundColor:'#6C79CF'}]} onPress={() => {}}>
                        <View>
                        <Text style={{ color: 'white' }}>Bekijk</Text>
                        </View>
                    </TouchableOpacity>

                    </View>
                );
                })
            ) : (
                // Als sessions leeg is
                <View style={[styles.emptyCard, { backgroundColor: '#7D8DF6' }]}>
                    <Text style={{ color: 'white', fontSize: 18 }}>Geen geplande sessies</Text>
                </View>
                
            )}

            {mySessions && mySessions.length > 0 && areAllObjectsNull && (
            // Alle objecten waren null, dus ook hier lege session card weergeven
            <View style={[styles.emptyCard, {backgroundColor:'#7D8DF6'}]}>
                <Text style={{ color: 'white', fontSize: 18 }}>Geen geplande sessies</Text>
            </View>
            )}

            </View>

            </ScrollView>
            )}
        </View>
    );
};


export default Sessions

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        marginTop:16,
        position:'relative',
    },
    scrollView: {
        width: '100%',
        height: '100%',
        paddingTop:8,
    },
    alterListScrollView: {
        width: '100%',
        height: '100%',
        paddingTop:8,
    },
    cardContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    card: {
        width:'85%',
        height:130,
        backgroundColor:'#FFC436',
        marginVertical: 12,
        borderRadius:16,
        overflow:'hidden',
    },
    emptyCard:{
        width:'85%',
        height:130,
        backgroundColor:'#FFC436',
        marginVertical: 12,
        borderRadius:16,
        overflow:'hidden',
        justifyContent:'center',
        alignItems:'center',
    },
    textContainer: {
        flex:1,
        paddingLeft:18,
        justifyContent:'center',
        position:'relative',
    },
    text: {
        color:'black',
        fontSize:10,
    },
    text2: {
        color:'white',
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
    },
    dateBox:{
        width:100,
    },
    lowerBox:{
        flexDirection:'row',
        marginTop:14,
        position:'relative',
    },
    lowerBox2: {
        marginLeft:4, 
        width:200, 
        position:'absolute', 
        right:18,  
        justifyContent: 'center', 
        alignItems: 'flex-end',
    },
    sideButton: {
        top: 42,
        right: 20,
        position:'absolute',
        backgroundColor:'#FFE8B0',
        padding:6,
        borderRadius:8,
    },
    deleteButton: {
        top: 5,
        right: 5,
        position:'absolute',
        backgroundColor:'#FFE8B0',
        padding:6,
        borderRadius:8,
    },
    acceptButton: {
        top: 5,
        right: 40,
        position:'absolute',
        backgroundColor:'#FFE8B0',
        padding:6,
        borderRadius:8,
    },
    reviewButton: {
        top: 5,
        right: 5,
        position:'absolute',
        backgroundColor:'green',
        padding:6,
        borderRadius:8,
        zIndex:99, //review button wordt voorop de card getoond
    },
});