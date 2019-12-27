import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

import LoadingScreen from './Screens/LoadingScreen';
import LoginScreen from './Screens/LoginScreen';
import RegisterScreen from './Screens/RegisterScreen';
import HomeScreen from './Screens/HomeScreen';
import Chat from './Screens/Chat';

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
},
{
    initialRouteName: 'navi',
    headerMode: 'screen',
  },
);

// const ChatStack = createStackNavigator(
//   {
//     //   Friend: Contact,
//     //   FriendProfile: Profile,
//     Chat: Chat,
//   },
//   {
//     defaultNavigationOptions: {
//       header: null,
//     },
//   },
// );

const AuthStack = createStackNavigator({
  Login: LoginScreen,
  Register: RegisterScreen,
});

export default createAppContainer(
  createSwitchNavigator(
    {
      Loading: LoadingScreen,
      App: AppStack,
    //   Chat: ChatStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'Loading',
    },
  ),
);
