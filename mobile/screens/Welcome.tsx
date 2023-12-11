import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { NavigationContext, NavigationProp } from '@react-navigation/native';
import { useAuth } from '../AuthContext';

interface Routerprops {
    navigation: NavigationProp<any, any>;
}
  
export default function WelcomeScreen() {
  const { API_URL, setAPI_URL} = useAuth();

  useEffect(() => {
    //setAPI_URL('http://localhost:5000');
    setAPI_URL('http://192.168.0.102:5000');
  }, []);

  return (
    <NavigationContext.Consumer>
      {(navigation) => (
        // <ImageBackground source={require('../assets/images/bg1.png')} style={styles.imageBG}>
        <View style={styles.container}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.image}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
              navigation?.navigate('Inloggen');
              }}
            >
            <Text style={styles.buttonText}>Log in</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button2}
              onPress={() => {
              navigation?.navigate('Registreren');
              }}
            >
            <Text style={styles.buttonText2}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
        // </ImageBackground>
      )}
    </NavigationContext.Consumer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7D8DF6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  imageBG: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
    height: '20%',
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 20,
    paddingBottom:30,
    position: 'absolute', 
    bottom: 0,
  },
  button: {
    backgroundColor:'white',
    padding: 13,
    borderRadius: 14,
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button2: {
    backgroundColor:'transparent',
    padding: 13,
    borderRadius: 14,
    borderWidth:1,
    borderColor:'white',
    width: '85%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#7D8DF6',
    fontSize: 17,
  },
  buttonText2: {
    color: 'white',
    fontSize: 17,
  },
});