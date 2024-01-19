import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ImageBackground, FlatList, TextInput, Modal } from 'react-native';
import { NavigationContext, NavigationProp } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useAuth } from '../../mobile/AuthContext';
import FlashMessage from "react-native-flash-message";
import { showMessage, hideMessage } from 'react-native-flash-message';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

interface User {
    user_id: number;
    email: string;
    userName: string;
    fullName: string;
    city: string;
}

interface MyRequests {
    id: number;
    user_id: number;
    userName: string;
    fullName: string;
    city: string;
}

interface Friend {
    friend_id: number;
    user1_id: number;
    user1: {
        userName: string;
    };
    user2_id: number;
    user2: {
        userName: string;
    };
}
 
export default function Vrienden({ navigation }: Routerprops) {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject.user_id;

    const [search, setSearch] = useState('');
    const [searchUsers, setSearchUsers] = useState<User[]>([]);
    const [searchErrorMessage, setSearchErrorMessage] = useState('');
    const [noFoundUsersError, setNoFoundUsersError] = useState('');

    const [friendTab, setFriendTab] = useState(true);
    const [verzoekenTab, setVerzoekenTab] = useState(false);

    const [visible, setVisible] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const selectedUserId = selectedUser?.user_id;
    const show = (selectedItem: User) => {
        setVisible(true);
        setSelectedUser(selectedItem);
    };
    const hide = () => {
        setVisible(false);
        setSelectedUser(null);
    };

    const [myRequests, setMyRequests] = useState<MyRequests[]>([]);
    const {myFriends, setMyFriends} = useAuth();
    const {friendsCount, setFriendsCount} = useAuth();

    const [searchError, setSearchError] = useState(false);

    const searchFriend = () => {
    
        let hasErrors = false;

        if (search == '') {
            hasErrors = true;
            setSearchError(true);
        } else {
            setSearchError(false);
        }

        if (hasErrors) {
            setSearchUsers([]);
            setNoFoundUsersError('');
            return;
        }

        const payload = {
            currentUser,
            search,
        };
        console.log('frontend: '+payload);
        fetch(`${API_URL}/searchFriend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${useToken}`,
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                console.log('Response:', jsonRes);
                if (res.status === 404){
                    setNoFoundUsersError(jsonRes.message);
                } else if (res.status !== 200) {
                    setSearchErrorMessage(jsonRes.message);
                } else {
                    setSearchUsers(jsonRes);
                    setNoFoundUsersError('');
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const sendFriendRequest = () => {
        const payload = {
          currentUser,
          selectedUserId,
        };
        fetch(`${API_URL}/sendFriendRequest`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${useToken}`,
          },
          body: JSON.stringify(payload),
        })
          .then(async res => {
            try {
              const jsonRes = await res.json();
              if (res.status !== 200) {
                console.log(jsonRes.message);
                showFailToast(jsonRes.message);
                hide();
              } else {
                console.log(jsonRes.message);
                showToast(jsonRes.message);
                hide();
              }
            } catch (err) {
              console.log(err);
            }
          })
          .catch(err => {
            console.log(err);
          });
    };

    const getFriendRequests = () => {
        fetch(`${API_URL}/getFriendRequests?user_id=${currentUser}`, {
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
                    setMyRequests(jsonRes);
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

    const deleteRequest = (id: number) => {
        fetch(`${API_URL}/deleteRequest?id=${id}`, {
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
                    showToast(jsonRes.message);
                    getFriendRequests();
                } else {
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

    const acceptRequest = (id: number) => {
        fetch(`${API_URL}/acceptRequest?id=${id}`, {
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
                    showToast(jsonRes.message);
                    getFriendRequests();
                    getFriends();
                } else {
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

    const getFriends = () => {
        fetch(`${API_URL}/getFriends?user_id=${currentUser}`, {
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
                    setMyFriends(jsonRes.myFriends);
                    setFriendsCount(jsonRes.friendsCount);
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
          type: 'success',
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
          type: 'danger',
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
        <View style={styles.optionBar}>

            <TouchableOpacity onPress={() => {
            getFriends();
            setFriendTab(true);
            setVerzoekenTab(false);
            }} 
            style={{
            borderBottomWidth: friendTab ? 2 : 0,
            borderBottomColor: friendTab ? '#7D8DF6' : 'transparent',
            }}>
            <Text style={{ color: friendTab ? '#7D8DF6' : 'black' }}>Vrienden</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
            setFriendTab(false);
            setVerzoekenTab(false);
            }} 
            style={{
            borderBottomWidth: !friendTab && !verzoekenTab ? 2 : 0,
            borderBottomColor: !friendTab && !verzoekenTab ? '#7D8DF6' : 'transparent',
            }}>
            <Text style={{ color: !friendTab && !verzoekenTab ? '#7D8DF6' : 'black' }}>Zoek</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => {
            getFriendRequests();
            setFriendTab(false);
            setVerzoekenTab(true);
            }} 
            style={{
            borderBottomWidth: verzoekenTab ? 2 : 0,
            borderBottomColor: verzoekenTab ? '#7D8DF6' : 'transparent',
            }}>
            <Text style={{ color: verzoekenTab ? '#7D8DF6' : 'black' }}>Verzoeken</Text>
            </TouchableOpacity>
        </View>

        {verzoekenTab ? (
        <View style={styles.VerzoekenContainer}>
            <FlatList
                data={myRequests} 
                keyExtractor={(item) => item.id.toString()} 
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.userContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
                            <View style={styles.userTextVerzoek}>
                                <Text style={{fontSize:16}}>{item.userName}</Text>
                                
                                <TouchableOpacity onPress={() => {acceptRequest(item.id)}}>
                                <FontAwesome name="check" size={25} color='black'/>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={() => {deleteRequest(item.id)}}>
                                <FontAwesome name="close" size={25} color='black'/>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
        ) :friendTab ? (
        <View style={styles.VriendenContainer}>
            <FlatList
                data={myFriends} 
                keyExtractor={(item) => item.friend_id.toString()} 
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => {}}>
                        <View style={styles.userContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
                            <View style={styles.userText}>
                                {item.user1_id === currentUser ? (
                                    <Text style={{ fontSize: 16 }}>{item.user2.userName}</Text>
                                ) : (
                                    <Text style={{ fontSize: 16 }}>{item.user1.userName}</Text>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
        ) : (
        <View style={styles.zoekContainer}>
            <View style={styles.searchbarContainer}>
            <TextInput style={styles.searchBar} placeholder="Zoek" autoCapitalize="none" onChangeText={(text) => setSearch(text)} value={search} clearButtonMode='always'></TextInput>
            <TouchableOpacity onPress={() => {searchFriend()}}>
            <FontAwesome name="search" size={25} color='#7D8DF6' style={{marginLeft:10}}/>
            </TouchableOpacity>
            </View>
            
            {searchError && <Text style={styles.errorText}>Vul de naam in van een gebruiker</Text>}
            {noFoundUsersError && <Text style={styles.errorText}>{noFoundUsersError}</Text>}

            {!searchError && !noFoundUsersError && (
            <FlatList
                data={searchUsers} 
                keyExtractor={(item) => item.user_id.toString()} 
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => show(item)}>
                        <View style={styles.userContainer}>
                            <Image source={require('../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
                            <View style={styles.userText}>
                                <Text style={{fontSize:16}}>{item.userName}</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
            )}
        </View>
        )}

        <Modal visible={visible} animationType="fade" onRequestClose={hide} transparent>
            <View style={styles.modalContainer}>
                <View style={styles.modal}>
                    <TouchableOpacity onPress={hide} style={{position:'absolute', top:14,right:14}}>
                        <FontAwesome name="close" size={30} color='black'/>
                    </TouchableOpacity>
                    
                    {selectedUser && (
                            <View style={styles.middleContent}>
                                <Image source={require('../assets/images/logo.png')} style={styles.image2} resizeMode='contain'/>
                                    <View style={{alignItems:'center', width:'100%'}}>
                                    <Text style={{fontSize:12, color:'#7D8DF6'}}>Gebruikersnaam</Text>
                                    <Text>{selectedUser.userName}</Text>
                                    </View>

                                    <View style={{alignItems:'center', width:'100%'}}>
                                    <Text style={{fontSize:12, color:'#7D8DF6'}}>Volledige naam</Text>
                                    <Text>{selectedUser.fullName}</Text>
                                    </View>

                                    <View style={{alignItems:'center', width:'100%'}}>
                                    <Text style={{fontSize:12, color:'#7D8DF6'}}>Stad</Text>
                                    <Text>{selectedUser.city}</Text>
                                    </View>
                            </View>
                    )}

                    <TouchableOpacity onPress={() => sendFriendRequest()}>
                        <Text style={{ textAlign: 'center', fontSize:15, backgroundColor: '#7D8DF6',width:'90%',padding:10, color:'white', marginTop:8}}>Toevoegen als vriend</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    </View>
  );
}

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
    VerzoekenContainer: {

    },
    VriendenContainer: {
        height:'auto',
        width:'100%',
    },
    zoekContainer: {
        height:'100%',
        width:'100%',
    },
    searchbarContainer: {
        width:'100%',
        height:50,
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
    },
    searchBar: {
        width:'85%',
        height:40,
        borderRadius:12,
        padding:8,
        backgroundColor:'#E6E6E6'
    },
    userContainer: {
        height:100,
        flexDirection:'row',
        alignItems:'center',
        borderBottomWidth:1,
        borderBottomColor:'lightgrey',
    },
    userText: {
        height:'100%',
        width:'70%',
        justifyContent:'center',
    },
    userTextVerzoek: {
        height:'100%',
        width:'70%',
        alignItems:'center',
        flexDirection:'row',
    },
    modalContainer: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'rgba(200, 200, 200, 0.5)',
    },
    modal: {
        width:300,
        height:500,
        backgroundColor:'white',
        opacity:1, 
        position:'relative',
        justifyContent:'center',
        alignItems:'center',
    },
    middleContent: {
        height:'50%',
        width:'90%',
        justifyContent:'space-evenly',
        alignItems:'center',
    },
    image: {
        width:60,
        height:60,
        borderRadius:50,
        backgroundColor:'#555FA3',
        marginHorizontal:16,
    },
    image2: {
        width:80,
        height:80,
        borderRadius:50,
        backgroundColor:'#555FA3',
        marginHorizontal:16,
    },
    errorText: {
        color:'red',
        textAlign:'center',
        fontSize:14,
        marginTop:14,
    },
});