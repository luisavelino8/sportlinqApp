import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import React, { useEffect, useState } from 'react';
//import { FIREBASE_AUTH } from '../../FirebaseConfig';
//import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { LogBox } from 'react-native';
import { useAuth } from '../../mobile/AuthContext';
LogBox.ignoreAllLogs(true);

interface Routerprops {
    navigation: NavigationProp<any, any>;
}


const InloggenNew = ({ navigation }: Routerprops) => {
    const { API_URL, setAPI_URL} = useAuth();

    const [email, setEmail] = useState('');
    const [userName, setName] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(true);

    const [loading, setLoading] = useState(false);
    const { useToken, setToken } = useAuth();
    const { userObject, setUserObject} = useAuth();
    const { locations, setLocations} = useAuth();


    // check of token binnenkomt
    useEffect(() => {
        console.log(useToken);
      }, [useToken]);
    
    const onChangeHandler = () => {
        //setIsLogin(!isLogin);
        setMessage('');
    };

    function resetValues(){
        setEmail('');
        setName('');
        setPassword('');
        setMessage('');
    }

    const onLoggedIn = (token: any) => {
        fetch(`${API_URL}/private`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`, 
            },
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setMessage(jsonRes.message);
                    setToken(token);
                    getInfo(token);
                    getLocations(token);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    const onSubmitHandler = () => {
        //setLoading(true);
        const payload = {
            email,
            userName,
            password,
        };
        fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
        .then(async res => { 
            try {
                const jsonRes = await res.json();
                if (res.status !== 200) {
                    setIsError(true);
                    setMessage(jsonRes.message);
                } else {
                    onLoggedIn(jsonRes.token);
                    setIsError(false);
                    setMessage(jsonRes.message);
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    };

    const getInfo = (token: any) => {
        const payload = {
            email,
        };
        fetch(`${API_URL}/getUserInfo`, {
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

    // naar inloggen verplaatst
    const getLocations = (token: any) => {
        fetch(`${API_URL}/locations`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        })
        .then(async res => {
            try {
                const jsonRes = await res.json();
                if (res.status === 200) {
                    setLocations(jsonRes);
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

    const getMessage = () => {
        //const status = isError ? `Error: ` : `Success: `;
        //return status + message;
        return message;
    }

    return (
        // <ImageBackground source={require('../assets/images/bg1.png')} style={styles.imageBG}>
        <View style={styles.container}>
            <View style={styles.inlogContainer}>
                <View style={styles.inputContainer}>
                    <TextInput testID="emailInput" style={[styles.input, message ==='Gebruiker niet gevonden' && styles.errorInput]} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} value={email} clearButtonMode='always'></TextInput>
                    <TextInput testID="passwordInput" secureTextEntry={true} style={[styles.input, (message === 'Vul de juiste wachtwoord in'||message === 'Gebruiker niet gevonden') && styles.errorInput]} placeholder="Password" onChangeText={(text) => setPassword(text)} value={password} clearButtonMode='always'></TextInput>
                    <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity testID="loginButton" style={styles.button} onPress={onSubmitHandler}>
                        <Text style={styles.buttonText}>Log in</Text>
                    </TouchableOpacity>
                    <Text style={{padding:2, color:'dimgrey'}}>or</Text>
                    <TouchableOpacity 
                        style={styles.button2} 
                        onPress={() => {
                            resetValues();
                            navigation?.navigate('Registreren');
                        }}>
                    <Text style={styles.buttonText2}>Sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
        // </ImageBackground>
    );

    // // voor loading indicator
    // return (
    //     <View style={styles.container}>
    //         <View style={styles.inlogContainer}>
    //             <View style={styles.inputContainer}>
    //                 <TextInput style={[styles.input, message ==='Gebruiker niet gevonden' && styles.errorInput]} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} value={email}></TextInput>
    //                 <TextInput secureTextEntry={true} style={[styles.input, (message === 'Vul de juiste wachtwoord in'||message === 'Gebruiker niet gevonden') && styles.errorInput]} placeholder="Password" onChangeText={(text) => setPassword(text)} value={password}></TextInput>
    //                 <Text style={[styles.message, {color: isError ? 'red' : 'green'}]}>{message ? getMessage() : null}</Text>
    //             </View>
    //             { loading ? (<ActivityIndicator size='large' color='#7D8DF6' />)
    //             : (<>
    //             <View style={styles.buttonContainer}>
    //                 <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
    //                     <Text style={styles.buttonText}>Log in</Text>
    //                 </TouchableOpacity>
    //                 <Text style={{padding:2, color:'dimgrey'}}>or</Text>
    //                 <TouchableOpacity 
    //                     style={styles.button2} 
    //                     onPress={() => {
    //                         resetValues();
    //                         navigation?.navigate('Registreren');
    //                 }}>
    //                 <Text style={styles.buttonText2}>Sign up</Text>
    //                 </TouchableOpacity>
    //             </View>
    //             </>)}
    //         </View>
    //     </View>
    // );

    // check voor later -> keyboardavoiding binnen de eerste View van return
    //<KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
};

export default InloggenNew

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        width:'100%',
        backgroundColor:'#7D8DF6',
    },
    inlogContainer: {
        width: '80%',
        height: '44%',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius:30
    },
    inputContainer: {
        width: '100%',
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 10,
    },
    input: {
        width: '90%',
        marginVertical: 4,
        height: 50,
        padding: 10,
        backgroundColor: 'transparent',
        borderBottomWidth: 1, 
        borderColor: '#7D8DF6',
        fontSize:17,
        color:'#7D8DF6'
    },
    message: {
        fontSize: 16,
        marginVertical: '5%',
    },
    buttonContainer: {
        width:'100%',
        paddingTop:10,
        paddingBottom:30,
        flexDirection:'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        backgroundColor:'#7D8DF6',
        padding: 11,
        borderRadius: 14,
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    button2: {
        padding: 11,
        borderRadius: 14,
        borderWidth:1,
        borderColor:'#7D8DF6',
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
      },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    buttonText2: {
        color: '#7D8DF6',
        fontSize: 16,
    },
    errorInput: {
        borderColor:'red'
    },
    imageBG: {
        flex: 1,
        width: '100%',
    },
});