import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LoadingScreen from './Screens/LoadingScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import Chat from './Screens/Chat';
import FriendProfile from './Screens/FriendProfile'
import SplashScreen from './Screens/SplashScreen'

import AppNavigator from './AppNavigator';

const AppStack = createStackNavigator(
  {
    home: {
      screen: HomeScreen,
    },
    navi: {
        screen: AppNavigator,
        navigationOptions: {
            title: 'OIT!',
            headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerStyle: {
            backgroundColor: '#8DBF8B',
        },
    },
},
        Chatting: {
          screen: Chat,
        },
        FriendProfile: {
          screen: FriendProfile
        }
},
{
    initialRouteName: 'navi',
    headerMode: 'screen',
  },
);

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Splash: SplashScreen,
      Loading: LoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Splash',
    },
  ),
);
