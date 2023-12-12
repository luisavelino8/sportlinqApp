import { View, Text, StyleSheet, TextInput, ActivityIndicator, Button, KeyboardAvoidingView, TouchableOpacity} from 'react-native';
import React, { useState } from 'react';
//import { FIREBASE_AUTH } from '../../FirebaseConfig';
//import { createUserWithEmailAndPassword, sendEmailVerification, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { NavigationProp } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}

const RegistrerenNew = ({ navigation }: Routerprops) => {
    const { API_URL, setAPI_URL} = useAuth();

    const [email, setEmail] = useState('');
    const [userName, setName] = useState('');
    const [password, setPassword] = useState('');

    const [isError, setIsError] = useState(false);
    const [message, setMessage] = useState('');
    const [useToken, setToken] = useState(null);

    const [emailError, setEmailError] = useState(false);
    const [userNameError, setUserNameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);

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
                }
            } catch (err) {
                console.log(err);
            };
        })
        .catch(err => {
            console.log(err);
        });
    }

    function resetValues(){
        setEmail('');
        setName('');
        setPassword('');
        setMessage('');
    }

    function validatePassword(passwordCheck: string) {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return passwordRegex.test(passwordCheck);
    }

    const onSubmitHandler = () => {
        let hasErrors = false;
        setMessage('');

        if (!email.includes('@gmail.com')) {
            setEmailError(true);
            hasErrors = true;
        }else{
            setEmailError(false);
        }

        if (userName.length < 6 || userName.length > 30) {
            setUserNameError(true);
            hasErrors = true;
        }else{
            setUserNameError(false);
        }

        if (!validatePassword(password)) {
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
            userName,
            password,
        };
        fetch(`${API_URL}/signup`, {
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
                    //onLoggedIn(jsonRes.token);
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

    const getMessage = () => {
        const status = isError ? `Error: ` : `Success: `;
        return status + message;
    }

    return (
        <View style={styles.container}> 
            {message === 'Gebruiker is aangemaakt' ? (
              <View style={{justifyContent:'center',alignItems:'center',width:'100%'}}>
                <Text style={{fontSize:26, marginBottom:20, color:'white'}}>De gebruiker is aangemaakt!</Text>
                <TouchableOpacity style={styles.buttonDone}
                  onPress={() => {
                    resetValues();
                    navigation?.navigate('Inloggen');
                }}>
                <Text style={styles.buttonText2}>Log in</Text>
                </TouchableOpacity>
              </View>
            ) : (<>
            <View style={styles.registerContainer}>
              <View style={styles.inputContainer}>
                <TextInput style={[styles.input, emailError && styles.errorInput]} placeholder="Email" autoCapitalize="none" onChangeText={(text) => setEmail(text)} value={email} clearButtonMode='always'/>
                {/* {emailError && <Text style={styles.errorText}>email moet eindigen op "@gmail.com"</Text>} */}
                <Text style={{color: emailError ? 'red' : 'white'}}>email moet eindigen op "@gmail.com"</Text>

                <TextInput style={[styles.input, userNameError && styles.errorInput]} placeholder="Username" onChangeText={(text) => setName(text)} value={userName} clearButtonMode='always'/>
                {/* {userNameError && <Text style={styles.errorText}>naam moet tussen 6 en 30 karakters</Text>} */}
                <Text style={{color: userNameError ? 'red' : 'white'}}>naam moet tussen 6 en 30 karakters</Text>


                <TextInput secureTextEntry={true} style={[styles.input, passwordError && styles.errorInput]} placeholder="Password" onChangeText={(text) => setPassword(text)} value={password} clearButtonMode='always'/>
                {/* {passwordError && <Text style={styles.errorText}>minimaal 8 tekens, hoofdletter, cijfer en speciaal teken</Text>} */}
                <Text style={{color: passwordError ? 'red' : 'white'}}>minimaal 8 tekens, hoofdletter, cijfer en speciaal teken</Text>


                <Text style={[styles.message, { color: isError ? 'red' : 'green' }]}>{message ? getMessage() : null}</Text>
              </View>
              <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={onSubmitHandler}>
                  <Text style={styles.buttonText}>Sign up</Text>
              </TouchableOpacity>
              <Text style={{padding:2, color:'dimgrey'}}>or</Text>
              <TouchableOpacity 
                  style={styles.button2} 
                  onPress={() => {
                      resetValues();
                      navigation?.navigate('Inloggen');
              }}>
              <Text style={styles.buttonText2}>Log in</Text>
              </TouchableOpacity>
             </View>
            </View>
            </>
            )}
        
        </View>
    );

    // check voor later -> keyboardavoiding binnen de eerste View van return
    //<KeyboardAvoidingView behavior='padding'></KeyboardAvoidingView>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems:'center',
        width:'100%',
        backgroundColor:'#7D8DF6',
    },
    registerContainer: {
        width: '80%',
        height: '53%',
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
        padding: 10
    },
    input: {
        width: '90%',
        //marginVertical: 4,
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
        //marginVertical: '5%',
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
    buttonDone: {
        backgroundColor:'white',
        padding: 10,
        borderRadius: 14,
        width: '50%',
        justifyContent: 'center',
        alignItems: 'center',
      },
    errorText: {
        color:'red',
        textAlign:'center'
    },
    errorInput: {
        borderColor:'red'
    },
});

export default RegistrerenNew;
