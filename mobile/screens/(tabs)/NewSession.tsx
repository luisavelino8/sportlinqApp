import {View, Text, Modal, TouchableOpacity, StyleSheet, FlatList, Animated,Dimensions, TextStyle} from 'react-native';
import React, { useEffect, useState } from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useAuth } from '../../AuthContext';
import RNPickerSelect from 'react-native-picker-select';
//import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { showMessage, hideMessage } from 'react-native-flash-message';


interface Friend {
    // user_id: number;
    // userName: string;
    user1_id: number;
    user2_id: number;
    user1:{
      userName: string;
    },
    user2:{
      userName: string;
    },
}

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



const NewSession = () => {
    const { API_URL, setAPI_URL} = useAuth();

    const isFocused = useIsFocused();
    const navigation = useNavigation();
    const [visible, setVisible] = useState(isFocused);

    const { useToken, setToken, userObject, setUserObject, locations, setLocations } = useAuth();
    const { listenToSessions, setListenToSessions } = useAuth();
    const currentUser = userObject.user_id;

    const [listOfFriends, setListOfFriends] = useState<Friend[]>([]);

    // luister of er nieuwe pending sessions zijn, dan sessies opnieuw laden
    const { listenPendingSessions, setListenPendingSessions } = useAuth();

    useEffect(() => {
        setVisible(isFocused);
        
        // om direct alle friends te krijgen
        getFriendsForSessions();
    }, [isFocused, locations]);

    const show = () => {
        setVisible(true);
    };

    const hide = () => {
        setVisible(false);
        setFormattedDate('');
        navigation.goBack();

        setFriendError(false);
        setLocationError(false);
        setDateError(false);

        setSelectedFriendID(null);
        setSelectedLocationID(null);
        setSelectedDate(null); //fixen later met selectedDate
    };

    // Functie om de datum te formatteren
    const formatDateCustomOrder = (date: Date) => {
        const options: Intl.DateTimeFormatOptions = {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
        };
        // Gebruik de locale en opties om de datum te formatteren
        const formattedDate = date.toLocaleDateString('nl-NL', options);

        // Handmatig hoofdletters toevoegen aan de eerste letter van de dag en de maand
        const formattedDateWithCaps = formattedDate.replace(
          /\b\w/g,
          (char) => char.toUpperCase()
        );
      
        // Splits de geformatteerde datum op spaties
        const dateParts = formattedDateWithCaps.split(' ');
      
        // Bepaal de aangepaste volgorde van de elementen
        const customOrder = [0, 1, 2, 4, 5];
      
        // Creëer een nieuwe geformatteerde datumstring met aangepaste volgorde
        const customFormattedDate = customOrder.map((index) => {
            if (index === 4) {
              return dateParts[index].toLowerCase();
            }
            return dateParts[index];
        }).join(' ');

        const customFormattedDateWithHour = customFormattedDate + ' uur';
      
        return customFormattedDateWithHour;
    };

    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [selectedFriendID, setSelectedFriendID] = useState<number | null>(null);
    const [selectedLocationID, setSelectedLocationID] = useState<number | null>(null);
    //const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); //fixen later met selectedDate
    const [formattedDate, setFormattedDate] = useState('');
    const showDatePicker = () => {
        setDatePickerVisibility(true);
      };
    
      const hideDatePicker = () => {
        setDatePickerVisibility(false);
      };

    const handleFriendChange = (value: number) => {
        console.log('gekozen vriend waarde: ' + value);
        setSelectedFriendID(value);
    };
    
    const handleLocationChange = (value: number) => {
        console.log('gekozen locatie waarde: ' + value);
        setSelectedLocationID(value);
    };

    const handleDateConfirm = (date: Date) => {
        const formattedDate = formatDateCustomOrder(date);
        setFormattedDate(formattedDate);
        console.log(formattedDate);
        
        //setSelectedDate(date.toISOString());
        setSelectedDate(date);
        hideDatePicker();
    };

    // validatie const
    const [friendError, setFriendError] = useState(false);
    const [locationError, setLocationError] = useState(false);
    const [dateError, setDateError] = useState(false);
    const [oldDateError, setOldDateError] = useState(false);

    // deze dus veranderen wanneer er een friend table is, user_id
    // in query weghalen etc, want door gebruik alle users, moet ik
    // mezelf van die lijst uitsluiten
    const getFriendsForSessions = () => {
        const currentUserID = userObject.user_id;
        fetch(`${API_URL}/getFriendsForSessions?user_id=${currentUserID}`, {
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
                    setListOfFriends(jsonRes);
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

    const sendSessionRequest = () => {
        // Validatie/foutmelding
        let hasErrors = false;

        if (!selectedFriendID) {
            hasErrors = true;
            setFriendError(true);
        } else {
            setFriendError(false);
        }

        if (!selectedLocationID) {
            hasErrors = true;
            setLocationError(true);
        } else {
            setLocationError(false);
        }

        if (selectedDate) {
            const currentDate = new Date();
            if (selectedDate < currentDate) {
                hasErrors = true;
                setDateError(true);
            } else {
                setDateError(false);
            }
        }

        if (hasErrors) {
            return;
        }

        const payload = {
          currentUser,
          selectedFriendID,
          selectedLocationID,
          selectedDate
        };
        fetch(`${API_URL}/sendSessionRequest`, {
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
              } else {
                console.log(jsonRes.message);
                showToast(jsonRes.message);
                setListenPendingSessions(true);
              }
            } catch (err) {
              console.log(err);
            } finally {
                // Sluit de modal na de toast
                hide();
            }
          })
          .catch(err => {
            console.log(err);
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
        <Modal visible={visible} animationType="slide" onRequestClose={hide} transparent>  
            <View style={styles.modalContainer}>

              <View style={{flexDirection:'row', alignItems:'center',justifyContent:'center' ,marginBottom:16, position:'relative', width:'70%'}}>
                <Text style={{fontSize:22, marginRight:10, color:'white'}}>nieuwe sessie</Text>
                <TouchableOpacity onPress={hide} style={{position:'absolute', right:0, backgroundColor:'#6C79CF', padding:6, borderRadius:8}}>
                    <FontAwesome name="close" size={26} color='white'/>
                </TouchableOpacity>
              </View>

              {listOfFriends.length > 0 ? (
              <>
                <View testID="sessionModal" style={styles.modal}>
                
                <RNPickerSelect
                items={listOfFriends.map(friend => ({ 
                  label: friend.user1_id === currentUser ? friend.user2.userName : friend.user1.userName,
                  value: friend.user1_id === currentUser ? friend.user2_id : friend.user1_id,
                }))}
                placeholder={{ label: 'Vriend', value: '' }}
                onValueChange={handleFriendChange}
                style={{
                  inputAndroid: { width:'80%',fontSize: 16,paddingVertical: 12,paddingHorizontal: 10,borderBottomWidth: 2,
                    borderColor: 'white',color: 'white',alignSelf: 'center',marginBottom:6,paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  inputIOS: {width:'80%',fontSize: 16,paddingVertical: 12,paddingHorizontal: 10,borderBottomWidth: 2,
                    borderColor: 'white',color: 'white',alignSelf: 'center',marginBottom:6, paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  placeholder: {
                    color: 'white',
                  },
                }}
                />
                {friendError && <Text style={styles.errorText}>Selecteer een vriend</Text>}

                <RNPickerSelect
                items={(locations as LocationType[]).map(location => ({ label: location.locationName, value: location.location_id }))}
                placeholder={{ label: 'Locatie', value: '' }}
                onValueChange={handleLocationChange}
                style={{
                  inputAndroid: { width:'80%',fontSize: 16,paddingVertical: 12,paddingHorizontal: 10,borderBottomWidth: 2,
                    borderColor: 'white',color: 'white',alignSelf: 'center',marginBottom:6,paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  inputIOS: {width:'80%',fontSize: 16,paddingVertical: 12,paddingHorizontal: 10,borderBottomWidth: 2,
                    borderColor: 'white',color: 'white',alignSelf: 'center',marginBottom:6,paddingRight: 30, // to ensure the text is never behind the icon
                  },
                  placeholder: {
                    color: 'white',
                  },
                }}
                />
                {locationError && <Text style={styles.errorText}>Selecteer een locatie</Text>}

                <TouchableOpacity onPress={showDatePicker} style={{width:'80%'}}>
                <Text style={{width:'100%',fontSize: 16,paddingVertical: 12,paddingHorizontal: 10,borderBottomWidth: 2,
                    borderColor: 'white',color: 'white',alignSelf: 'center',paddingRight: 30}}>Datum  <FontAwesome name="angle-down" size={25} color='#BAC3FE' style={{ marginLeft: 15}}/></Text>
                {/* <View style={{borderBottomColor:'#BAC3FE',borderBottomWidth:2}}></View> */}
                </TouchableOpacity>
                <Text style={{fontSize:16, width:'60%', textAlign:'center',color: 'white',marginBottom:6 }}>{formattedDate}</Text>
                {dateError && <Text style={styles.errorText}>Selecteer een datum</Text>}

                <DateTimePickerModal
                isVisible={isDatePickerVisible}
                mode="datetime"
                onConfirm={handleDateConfirm}
                onCancel={hideDatePicker}
                />
                </View>
              
                <TouchableOpacity onPress={() => sendSessionRequest()} style={{
                width:300, height:50, backgroundColor:'white', marginTop:16, borderRadius:16, alignItems:'center',
                justifyContent:'center'}}>
                  <Text style={{fontSize:16, color:'#7D8DF6', fontWeight:'bold' }}>Verstuur uitnodiging</Text>
                </TouchableOpacity> 
              </>
              ) : (
                <View style={styles.modal}>
                  <Text style={{color: 'white' }}>Geen vrienden om van te kiezen</Text>
                </View>
              )}

            </View>
        </Modal>
        </View>
    );
}

export default NewSession

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor:'white',
    },
    modalContainer: {
        flex:1,
        width:'100%',
        height:'100%',
        backgroundColor:'#7D8DF6',
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
    errorText: {
        color:'red',
        //textAlign:'center'
    },
    //
    //
    // styling voor RNpicker
    inputAndroid: {
      width:'80%',
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 2,
      borderColor: 'white',
      color: 'black',
      alignSelf: 'center',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputIOS: {
      width:'80%',
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 2,
      borderColor: 'white',
      color: 'black',
      alignSelf: 'center',
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    placeholder: {
      color: 'white',
    },
});