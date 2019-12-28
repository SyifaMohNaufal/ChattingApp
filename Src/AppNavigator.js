import {createAppContainer} from 'react-navigation';
import React from 'react';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

import Chat from './Screens/Home/HomeScreen';
import Friends from './Screens/Friends/Friends';
import Profile from './Screens/Profile/Profile';

const Navigator = createMaterialTopTabNavigator(
  {
    chat: {
      screen: Chat,
      navigationOptions: () => ({
        tabBarLabel: 'Chat',
      })
    },
    friends: {
      screen: Friends,
      navigationOptions: {
        tabBarLabel: 'Friends',
      }
    },
    profile: {
      screen: Profile,
      navigationOptions: {
        tabBarLabel: 'Profile',
      }
    }
  }, {
    initialRouteName: 'chat',
    tabBarOptions: {
      pressColor: '#FADC9C',
      labelStyle: {
        margin: 0,
        fontSize: 14,
        paddingVertical: 10,
      },
      tabStyle: {
        margin: 0,
      },

      activeTintColor: '#8DBF8B',
      inactiveTintColor: '#F09E56',
      style: {backgroundColor: '#fffbf1', height: 60},
      indicatorStyle: {
        backgroundColor: '#8DBF8B',
      },
    },
    tabBarPosition: 'bottom',
  },
);

const AppNavigator = createAppContainer(Navigator);

export default AppNavigator;
