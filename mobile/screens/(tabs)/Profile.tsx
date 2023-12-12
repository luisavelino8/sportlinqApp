import {View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, FlatList} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../mobile/AuthContext';
import { NavigationProp } from '@react-navigation/native';

interface Routerprops {
  navigation: NavigationProp<any, any>;
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


const Profile = ({ navigation }: Routerprops) => {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const currentUser = userObject.user_id;

    const displayKeys = ['email', 'userName', 'fullName', 'city', 'aboutMe'];
    console.log(userObject);

    const {myFriends, setMyFriends} = useAuth();
    const {friendsCount, setFriendsCount} = useAuth();
    const {myReviews, setMyReviews} = useAuth();
    const { sessionReviewed, setSessionReviewed} = useAuth(); // deze om sessies opnieuw te laden, als sessie is reviewed (YES/NO)


    useEffect(() => {
      getFriends();
      getReviews();
      if (sessionReviewed) {
        getFriends();
        getReviews();
        setSessionReviewed(false);
      }
    }, []);

    // dus origineel aanwezig in vrienden.tsx component
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

    // voor reviews en ReviewPage
    const getReviews = () => {
      fetch(`${API_URL}/getReviews?user_id=${currentUser}`, {
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
                  setMyReviews(jsonRes);
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
          <View style={styles.headerContainer}>
            <View style={styles.namePictureContainer}>
            <Image source={require('../../assets/images/logo.png')} style={styles.image} resizeMode='contain'/>
            <Text style={{color:'white', fontSize:16}}>{userObject.fullName}</Text>
            </View>

            <View style={styles.extraInfoContainer}>
              <TouchableOpacity onPress={() => {navigation?.navigate('Vrienden');}}>
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>{myFriends.length}</Text>
                  <Text style={{color:'white'}}>{myFriends.length === 1 ? ' vriend' : ' vrienden'}</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {}} >
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>0</Text>
                  <Text style={{color:'white'}}>sessies</Text>
                  </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {navigation?.navigate('ReviewPage');}}>
                  <View style={styles.extraInfo}>
                  <Text style={{color:'white', fontSize:24}}>{myReviews.length}</Text>
                  <Text style={{color:'white'}}>{myReviews.length === 1 ? ' review' : ' reviews'}</Text>
                  </View>
              </TouchableOpacity>
            </View>

          </View>

          <ScrollView style={styles.infoContainer}>
            {Object.keys(userObject).filter((key) => displayKeys.includes(key)).map(key => (
              <View style={styles.dataContainer} key={key}>
                <Text style={{ color: '#C0C9FF', fontSize:12,marginBottom:6}}> 
                {(() => {
                  switch (key) {
                    case 'fullName':
                      return 'Volledige naam';
                    case 'email':
                      return 'E-mailadres';
                    case 'userName':
                      return 'Gebruikersnaam';
                    case 'city':
                      return 'Stad';
                    case 'aboutMe':
                      return 'Over mij';
                    default:
                      return userObject[key];
                  }
                })()}
                  </Text>
                  <Text style={{ color: 'black', fontSize: 15 }}>{userObject[key]}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      );
}

export default Profile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        width:'100%',
        height:'100%',
        backgroundColor:'white',
    },
    headerContainer: {
        height:'70%',
        width:'100%',
        backgroundColor:'#7D8DF6',
        flex:1,
    },
    namePictureContainer: {
      width:'100%',
      height:'65%',
      justifyContent:'space-around',
      alignItems:'center',
    },
    image: {
      width:100,
      height:100,
      borderRadius:50,
      backgroundColor:'#555FA3',
    },
    extraInfoContainer: {
      width:'100%',
      height:'30%',
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
    },
    extraInfo: {
      justifyContent:'center',
      alignItems:'center',
      height:'80%',
      width:70,
      //backgroundColor:'#555FA3',
      //borderRadius:14,
      //borderBottomColor:'white',
      //borderBottomWidth:1.3,
    },
    infoContainer: {
        height:'30%',
        width:'100%',
    },
    dataContainer: {
        height:80,
        width:'92%',
        justifyContent:'center',
        paddingLeft:24,
        borderBottomWidth: 1,
        borderBottomColor: 'lightgrey',
        alignSelf: 'center',
    },
    headerText: {
      color:'white',
    },
});