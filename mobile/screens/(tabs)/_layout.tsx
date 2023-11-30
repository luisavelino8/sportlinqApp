// niks importeren van 'expo-router' anders conflict met @react-navigation
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Pressable, TouchableOpacity, useColorScheme } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import index from './index';
import Sessions from './Sessions';
import NewSession from './NewSession';
import Locations from './Locations';
import Profile from './Profile';
import { NavigationProp, getFocusedRouteNameFromRoute, useIsFocused } from '@react-navigation/native';
//import { FIREBASE_AUTH } from '../../../FirebaseConfig';
import { useAuth } from '../../../mobile/AuthContext';
import { useEffect, useState } from 'react';


const Tab = createBottomTabNavigator();

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

interface Routerprops {
  navigation: NavigationProp<any, any>;
}

export default function TabLayout({ navigation }: Routerprops) {
  const { useToken, setToken } = useAuth();
  const { userObject, setUserObject} = useAuth();

  return (
    <Tab.Navigator screenOptions={{tabBarActiveTintColor: 'grey', tabBarStyle:{backgroundColor:'#7D8DF6'},}}>
      <Tab.Screen
        name="index"
        component={index}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <TabBarIcon name="home" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="Sessions"
        component={Sessions}
        options={{
          title: 'My sessions',
          tabBarIcon: ({ color }) => <TabBarIcon name="calendar" color='white' />,
          tabBarLabelStyle:{color:'white'}
        }}
      />
      <Tab.Screen
        name="NewSession"
        component={NewSession}
        options={{
          title: '',
          tabBarIcon: ({ color }) => <TabBarIcon name="plus-circle" color='white' />,
          tabBarLabelStyle:{color:'white'},
          headerTintColor: 'white',
          headerShadowVisible: false,
        }}
      />
      <Tab.Screen
        name="Locations"
        component={Locations}
        options={{
          title: 'Locations',
          tabBarIcon: ({ color }) => <TabBarIcon name="map-marker" color='white' />,
          tabBarLabelStyle:{color:'white'},
        }}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <TabBarIcon name="user" color='white' />,
          tabBarLabelStyle:{color:'white'},
          headerStyle: { backgroundColor: '#7D8DF6'},
          headerTintColor: 'white',
          headerShadowVisible: false,
          headerRight: () => (
            <Pressable
              onPress={() => {
                navigation?.navigate('ProfileSettings');
              }}
            >
              {({ pressed }) => (
                <FontAwesome
                  name="gear"
                  size={25}
                  color='white'
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          ),
        }}
      />
    </Tab.Navigator>
  );
}