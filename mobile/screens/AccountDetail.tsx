import {View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Pressable} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../mobile/AuthContext';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationProp } from '@react-navigation/native';
import { showMessage, hideMessage } from 'react-native-flash-message';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

const AccountDetail = ({ navigation }: Routerprops) => {
    const { API_URL, setAPI_URL} = useAuth();

    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    
    const [ newUserName, setNewUserName] = useState('');
    const [ newFullName, setNewFullName] = useState('');
    const [ newCity, setNewCity] = useState('');
    const [newAboutMe, setNewAboutMe] = useState('');
    const email = userObject.email;
    // deze const moet hier blijven voor het gebruik binnen
    // updateButton en getInfo
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    
    const [visible, setVisible] = useState(false);
    const show = () => setVisible(true);
    const hide = () => {
        setVisible(false);
        setPassword('');
        setNewPassword('');
        setPasswordBackendMessage('');
    };
    const hideWhenConfirm = () => {
        setVisible(false);
        setPassword('');
    };
    const [passwordConfirmed, setPasswordConfirmed] = useState(false);

    // const voor validatie
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [fullNameError, setFullNameError] = useState(false);
    const [cityError, setCityError] = useState(false);
    const [aboutMeError, setAboutMeError] = useState(false);

    const [passwordBackendMessage, setPasswordBackendMessage] = useState('');

    useEffect(() => {
        setNewUserName(userObject.userName || '');
        setNewFullName(userObject.fullName || '');
        setNewCity(userObject.city || '');
        setNewAboutMe(userObject.aboutMe || '');
    }, [userObject]);

    function validatePassword(passwordCheck: string) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(passwordCheck);
    }

    type UpdatePayload = {
        email: any;
        newUserName: string;
        newPassword?: string;
        newFullName: string;
        newCity: string;
        newAboutMe: string;
    };

    const updateButton = () => {
        let hasErrors = false;
        
        if (newUserName.length < 6 || newUserName.length > 30) {
            setUserNameError(true);
            hasErrors = true;
        }else{
            setUserNameError(false);
        }

        if (newFullName.length > 45) {
            setFullNameError(true);
            hasErrors = true;
        }else{
            setFullNameError(false);
        }

        if (newCity.length > 45) {
            setCityError(true);
            hasErrors = true;
        }else{
            setCityError(false);
        }

        if (newAboutMe.length > 220) {
            setAboutMeError(true);
            hasErrors = true;
        }else{
            setAboutMeError(false);
        }

        if (hasErrors) {
            return;
        }


        let payload: UpdatePayload = {
            email,
            newUserName,
            newPassword,
            newFullName,
            newCity,
            newAboutMe,
        };
    
        if (!passwordConfirmed) {
            payload = {
                email,
                newUserName,
                newFullName,
                newCity,
                newAboutMe,
            };
        }

        fetch(`${API_URL}/updateProfile`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    console.log(jsonRes.message);
                    setNewPassword('');
                    showFailToast(jsonRes.message);
                } else {
                    console.log(jsonRes.message);
                    getUpdatedUserInfo(useToken);
                    setNewPassword('');
                    showToast(jsonRes.message);
                    navigation.goBack();
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getUpdatedUserInfo = (token: any) => {
        const payload = {
            email,
        };
        fetch(`${API_URL}/getUpdatedUserInfo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setUserObject(jsonRes);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const passwordCheck = (token: any) => {
        let hasErrors = false;
        if (!validatePassword(newPassword)) {
            setPasswordError(true);
            hasErrors = true;
        }else{
            setPasswordError(false);
        }

        if (hasErrors) {
            return;
        }

        const payload = {
            email,
            password,
        };
        fetch(`${API_URL}/passwordCheck`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setPasswordBackendMessage(jsonRes.message);
                    hideWhenConfirm();
                    setPasswordConfirmed(true);
                } else {
                    setPasswordBackendMessage(jsonRes.message);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
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
        <View style={styles.mainContainer}>
            <View testID="emailField" style={styles.emailContainer}>
                <Text style={styles.textInput}>{userObject.email}</Text>
            </View>
            <View style={styles.otherContainer}>
                <View testID="usernameField" style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Gebruikersnaam</Text>
                <TextInput style={styles.textInput} placeholder="Gebruikersnaam" autoCapitalize="none" onChangeText={(text) => setNewUserName(text)} value={newUserName} clearButtonMode='always'></TextInput>
                </View>
                <Text style={{color: userNameError ? 'red' : 'white'}}>Gebruikersnaam mag niet leeg zijn</Text>

                <View testID="fullnameField" style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Volledige naam</Text>
                <TextInput style={styles.textInput} placeholder="Volledige naam" autoCapitalize="none" onChangeText={(text) => setNewFullName(text)} value={newFullName} clearButtonMode='always'></TextInput>
                </View>
                <Text style={{color: fullNameError ? 'red' : 'white'}}>verkort je naam voor het profiel</Text>


                <View testID="cityField" style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Stad</Text>
                <TextInput style={styles.textInput} placeholder="Stad" autoCapitalize="none" onChangeText={(text) => setNewCity(text)} value={newCity} clearButtonMode='always'></TextInput>
                </View>
                <Text style={{color: cityError ? 'red' : 'white'}}>verkort de stadsnaam</Text>

                <View testID="aboutmeField" style={styles.dataContainer}>
                <Text style={{fontSize:12, marginBottom:5}}>Over mij</Text>
                <TextInput style={styles.textInput} placeholder="Over mij" autoCapitalize="none" onChangeText={(text) => setNewAboutMe(text)} value={newAboutMe} clearButtonMode='always'></TextInput>
                </View>
                <Text style={{color: aboutMeError ? 'red' : 'white'}}>Maximaal 220 karakters</Text>

            </View>

            <TouchableOpacity onPress={show}>
                <View testID="passwordField" style={styles.passwordContainer}>
                <Text style={styles.textInput}>Wachtwoord</Text>
                <FontAwesome name="angle-right" size={25} color='black' style={{ marginRight: 15}}/>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={updateButton} style={{width:'100%',justifyContent:'center',alignItems:'center',marginTop:30}}>
                    <Text style={{ textAlign: 'center', fontSize:17, backgroundColor: '#7D8DF6',width:'22%',padding:10, color:'white'}}>Opslaan</Text>
            </TouchableOpacity>
            

            <Modal visible={visible} animationType="fade" onRequestClose={hide} transparent>
            {passwordConfirmed ? (
                <>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <TouchableOpacity onPress={hide} style={{position:'absolute', top:14,right:14}}>
                                <FontAwesome name="close" size={30} color='black'/>
                            </TouchableOpacity>
                            <Text style={{width:'60%', textAlign:'center'}}>Er is al een nieuwe wachtwoord ingevoerd.</Text>
                        </View>
                    </View>
                </>
            ) : (
                <>
                    <View style={styles.modalContainer}>
                        <View style={styles.modal}>
                            <TouchableOpacity onPress={hide} style={{position:'absolute', top:14,right:14}}>
                                <FontAwesome name="close" size={30} color='black'/>
                            </TouchableOpacity>

                            <Text style={{width:'90%'}} >&#8226; Gebruik minstens 8 tekens</Text>
                            <Text style={{width:'90%'}}>&#8226; Gebruik letters, cijfers en speciale tekens door elkaar</Text>
                            <Text style={{width:'90%',marginBottom:40}}>&#8226; Combineer woorden en tekens in een unieke samenstelling</Text>

                            <TextInput style={styles.wachtwoordStyle} secureTextEntry={true} placeholder="Huidig wachtwoord" onChangeText={(text) => setPassword(text)} value={password} clearButtonMode='always'></TextInput>
                            <Text style={{ color: passwordBackendMessage ? 'red' : 'white' }}>{passwordBackendMessage || 'Tekst die altijd wit is'}</Text>
                            <TextInput style={styles.wachtwoordStyle} secureTextEntry={true} placeholder="Nieuwe wachtwoord" onChangeText={(text) => setNewPassword(text)} value={newPassword} clearButtonMode='always'></TextInput>
                            <Text style={{color: passwordError ? 'red' : 'white'}}>8 tekens, hoofdletter, cijfer en speciaal teken</Text>


                            <TouchableOpacity onPress={passwordCheck}>
                                <Text style={{ textAlign: 'center', fontSize:15, backgroundColor: '#7D8DF6',width:'90%',padding:10, color:'white', marginTop:8}}>Wachtwoord wijzigen</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </>
            )}
            </Modal>
        </View>
        
    );
    
}

export default AccountDetail

const styles = StyleSheet.create({
    mainContainer: {
        flex:1,
        width:'100%',
    },
    emailContainer: {
        height: 70,
        width:'100%',
        backgroundColor:'white',
        marginTop:22,
        justifyContent:'center',
        paddingLeft:18,
    },
    otherContainer: {
        justifyContent:'flex-start',
        alignItems:'center',
        width: '100%',
        height:350,
        backgroundColor:'white',
        marginTop:22,
    },
    dataContainer: {
        width:'90%',
        height:66,
        borderBottomColor:'lightgrey',
        borderBottomWidth:1,
        justifyContent:'flex-end',
        paddingBottom:5,
    },
    passwordContainer: {
        height: 70,
        width:'100%',
        backgroundColor:'white',
        marginTop:22,
        justifyContent:'space-between',
        alignItems:'center',
        paddingLeft:18,
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
        alignItems:'center',
        justifyContent:'center',
        position:'relative',
    },
    textInput: {
        fontSize:16,
    },
    errorText: {
        color:'red',
        justifyContent:'flex-start',
    },
    errorInput: {
        borderColor:'red'
    },
    wachtwoordStyle: {
        width:'90%',
        height:30,
        borderBottomColor:'lightgrey',
        borderBottomWidth:1,
        justifyContent:'flex-end',
        paddingBottom:5,
        marginBottom:8,
    },
});