import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const API_URL = 'http://localhost:5000';
//const API_URL = 'http://192.168.0.101:5000';

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

const Home = () => {
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject ? userObject.user_id : null;
    const currentUserName = userObject ? userObject.userName : null;

    const [sessionsFromFriends, setSessionsFromFriends] = useState([]);

    useEffect(() => {
        // nodig!, anders begint request al terwijl currentUser null is
        if (currentUser) {
            getSessionsFromFriends();
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
    
    return (
        <View style={styles.container}>

            <View style={styles.topContainer} >
                <Text style={{fontSize:18}}>Welcome {currentUserName}</Text>
            </View>

            <View style={styles.friendSessionContainer} >
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
                <View>
                <Text>Geen sessies van vrienden</Text>
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
        height:'35%',
    },
    friendSessionContainer: {
        width:'100%',
        height:'65%',
        justifyContent:'flex-start',
    },
    friendSessionCard: {
        height: 70,
        width:'100%',
        backgroundColor:'#E8E7E7',
        marginBottom:20,
        flexDirection:'row',
        alignItems:'center',
    }
});