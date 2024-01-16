import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';



interface SessionFriend {
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
    };
    user1: {
        userName: string;
    };
    user2: {
        userName: string;
    };
    whichUserIsFriend: string;
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

const Home = () => {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject ? userObject.user_id : null;
    const currentUserName = userObject ? userObject.userName : null;

    const [sessionsFromFriends, setSessionsFromFriends] = useState([]);
    const { mySessions, setMySessions} = useAuth();


    useEffect(() => {
        // nodig!, anders begint request al terwijl currentUser null is
        if (currentUser) {
            getSessionsFromFriends();
            getSessions();
        }
    }, [currentUser]);

    const getTimeAgo = (sessionDate: string) => {
        const today = new Date();
        const session = new Date(sessionDate);
    
        const timeDifference = today.getTime() - session.getTime();
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

    // origineel dus geplaatst in sessions.tsx
    const getSessions = () => {
        fetch(`${API_URL}/sessions?user_id=${currentUser}`, {
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

    const getSessionsFromFriends = () => {
        fetch(`${API_URL}/getSessionsFromFriends?user_id=${currentUser}`, {
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
                    setSessionsFromFriends(jsonRes);
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

    const showFirstSession = (mySessions as SessionType[])
    .filter(session => session.finished !== "YES")
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 1);
    
    return (
        <View testID="homeScreenContainer" style={styles.container}>

            <View style={styles.topContainer} >
                <View style={{width:'85%'}} >
                    <Text style={{fontSize:18}}>Welcome {currentUserName}</Text>
                </View>

                {mySessions && mySessions.length > 0 ? (
                
                // (mySessions as SessionType[]).filter(session => session.finished !== "YES").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 1).map(session => {

                // const originalDate = new Date(session.date);
                // const formattedDate = `${originalDate.getDate()}-${originalDate.getMonth() + 1}-${originalDate.getFullYear().toString().slice(2)} ${originalDate.getHours()}:${originalDate.getMinutes()}`;

                // return (
                //     <View style={styles.card} key={session.session_id}>

                //     <View style={styles.textContainer}>
                //         <Text style={[styles.text2, { fontSize: 20 }]}>{session.locationRelation.locationName}</Text>
                //         <Text style={[styles.text2, { fontSize: 14 }]}>{session.locationRelation.street}</Text>

                //         <View style={styles.lowerBox}>
                //         <Text style={[styles.dateBox, { fontSize: 18, color: 'white' }]}>{formattedDate} uur</Text>

                //             <View style={styles.lowerBox2}>
                //                 <Text style={{ color: 'white', fontSize: 18 }}>Sessie met:</Text>
                //                 {session.user1.userName !== currentUserName && (
                //                 <Text style={[styles.text2, { fontSize: 18 }]}>{session.user1.userName}</Text>
                //                 )}

                //                 {session.user2.userName !== currentUserName && (
                //                 <Text style={[styles.text2, { fontSize: 18 }]}>{session.user2.userName}</Text>
                //                 )}
                //             </View>
                //         </View>
                //     </View>

                //     </View>
                // );
                // })

                showFirstSession.length > 0 ? (
                    // Als er sessies zijn om weer te geven
                    showFirstSession.map(session => {
                      const originalDate = new Date(session.date);
                      const formattedDate = `${originalDate.getDate()}-${originalDate.getMonth() + 1}-${originalDate.getFullYear().toString().slice(2)} ${originalDate.getHours()}:${originalDate.getMinutes()}`;
              
                      return (
                        <View style={styles.card} key={session.session_id}>

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

                        </View>
                      );
                    })
                ) : (
                        <View style={styles.emptyCard}>
                          <Text style={{ color: 'white', fontSize: 18 }}>Geen geplande sessies</Text>
                        </View>
                    )
            ) : (
                // Als sessions leeg is
                <View style={styles.emptyCard}>
                <Text style={{color:'white', fontSize:18}}>Geen geplande sessies</Text>
                </View>
            )}
            </View>



            <View style={styles.friendSessionContainer} >

            <View style={{width:'85%', marginBottom:14}} >
                <Text style={{fontSize:18}}>Recente sessies</Text>
            </View>

            {sessionsFromFriends && sessionsFromFriends.length > 0 ? (
                (sessionsFromFriends as SessionFriend[]).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5).map(sessionFriend => {
                
                const whichUser = sessionFriend.whichUserIsFriend === "BOTH"
                ? `${sessionFriend.user1.userName} & ${sessionFriend.user2.userName}`
                : sessionFriend.whichUserIsFriend === "USER1"
                    ? sessionFriend.user1.userName
                    : sessionFriend.user2.userName;

                return (
                    <View style={styles.friendSessionCard} key={sessionFriend.session_id}>
                        <View style={{width:'12%',height:'100%', justifyContent:'center',alignItems:'center'}} >
                        <FontAwesome name="circle" size={28} color='lightgrey'/>
                        </View>

                        <View style={{width:'56%',height:'100%', justifyContent:'center'}} >
                        <Text style={{fontSize:15, fontWeight:'500', marginBottom:2}}>{whichUser}</Text>
                        <Text style={{color:'dimgrey'}}>{sessionFriend.locationRelation.locationName}</Text>
                        </View>

                        <View style={{width:'32%',height:'100%', alignItems:'center', paddingTop:5}} >
                        <Text style={{fontSize:14, color:'dimgrey'}} >{getTimeAgo(sessionFriend.date)}</Text>
                        </View>
                        
                    </View>
                );
                })
            ) : (
                // Als sessions leeg is
                <View style={{width:'85%', marginBottom:14}} >
                    <Text style={{color:'dimgrey'}}>Geen sessies beschikbaar</Text>
                </View>
            )}
            </View>

        </View>
    )
}

export default Home

const styles = StyleSheet.create({
    container: {
        flex:1,
        width:'100%',
        height:'100%',
    },
    topContainer: {
        width:'100%',
        height:'33%',
        justifyContent:'center',
        alignItems:'center',
    },
    friendSessionContainer: {
        width:'100%',
        height:'67%',
        justifyContent:'flex-start',
        alignItems:'center',
    },
    friendSessionCard: {
        height: 70,
        width:'100%',
        backgroundColor:'#E8E7E7',
        marginBottom:20,
        flexDirection:'row',
        alignItems:'center',
    },
    // dit is overgenomen van session.tsx
    card: {
        width:'85%',
        height:130,
        backgroundColor:'#7D8DF6',
        marginVertical: 12,
        borderRadius:16,
        overflow:'hidden',
    },
    emptyCard:{
        width:'85%',
        height:130,
        backgroundColor:'#7D8DF6',
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
    text2: {
        color:'white',
        fontSize:10,
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
});