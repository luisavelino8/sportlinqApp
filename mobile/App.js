import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from './screens/Welcome';
import InloggenNew from './screens/Inloggen';
import RegistrerenNew from './screens/Registreren';
import TabLayout from './screens/(tabs)/_layout';
import ProfileSettings from './screens/ProfileSettings';
import AccountDetail from './screens/AccountDetail';
import Vrienden from './screens/Vrienden';
import { AuthProvider, useAuth } from '../mobile/AuthContext';
import { useEffect } from 'react';
import FlashMessage from "react-native-flash-message";

const Stack = createNativeStackNavigator();
const InsideStack = createNativeStackNavigator();
const OutsideStack = createNativeStackNavigator();

export default function AppWrapper() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

function InsideLayout() {
  return (
    <InsideStack.Navigator initialRouteName='tabs' screenOptions={{ headerShown: false }}>
      <InsideStack.Screen name='tabs' component={TabLayout} />
      <InsideStack.Screen name='ProfileSettings' component={ProfileSettings} 
      options={{
        headerShown:true,
        headerStyle:{
          backgroundColor:'white',
        },
        headerTintColor: 'black',
      }}/>
      <InsideStack.Screen name='AccountDetail' component={AccountDetail}
      options={{
        headerShown:true,
        headerStyle:{
          backgroundColor:'white',
        },
        headerTintColor: 'black',
        headerTitle: '',
      }}/>
      <InsideStack.Screen name='Vrienden' component={Vrienden}
      options={{
        headerShown:true,
        headerStyle:{
          backgroundColor:'white',
        },
        headerTintColor: 'black',
      }} />
    </InsideStack.Navigator>
  );
}

function OutsideLayout() {
  return (
    <OutsideStack.Navigator initialRouteName='Welcome' screenOptions={{ headerShown: false }}>
      <OutsideStack.Screen name='Welcome' component={WelcomeScreen} />
      <OutsideStack.Screen name='Inloggen' component={InloggenNew} 
      options={{ 
        headerShown: true, 
        headerTitle:'',
        headerStyle: {
          //backgroundColor: '#7D8DF6',
        },
        headerTransparent: true,
        headerTintColor: 'white',
        headerShadowVisible: false,
      }} />
      <OutsideStack.Screen name='Registreren' component={RegistrerenNew} 
      options={{ 
        headerShown: true, 
        headerTitle:'',
        headerStyle: {
          backgroundColor: '#7D8DF6',
        },
        headerTintColor: 'white',
        headerShadowVisible: false,
      }}/>
    </OutsideStack.Navigator>
  );
}

function App() {
  const { useToken } = useAuth();

  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const isWeb = windowWidth > 600;
  // style={isWeb ? styles.webContainer : styles.mobileContainer}

  // // check token
  // useEffect(() => {
  //   console.log('App.js krijgt de token :', useToken);
  // }, [useToken]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={'Outside'}>
        {useToken != null ? (
          <Stack.Screen name='Inside' component={InsideLayout} options={{headerShown: false }} />
          ) : (
          <Stack.Screen name='Outside' component={OutsideLayout} options={{headerShown: false }} />
          )}
      </Stack.Navigator>
      <FlashMessage position="top" />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  webContainer: {
    width: 390,
    height: 844,
    margin: 'auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
});