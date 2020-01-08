import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  StatusBar,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import {Database, Auth} from '../../config';
import * as firebase from 'firebase'
import {GoogleSignin, statusCodes} from '@react-native-community/google-signin';

export default class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this._isMounted = false;
    this.state = {
      email: '',
      password: '',
      errorMessage: null,
      visible: false,
      Onprosess: false,
    };
  }

  

  componentDidMount = async () => {
    this._isMounted = true;
    await this.getLocation();
  };

  componentWillUnmount() {
    this._isMounted = false;
    Geolocation.clearWatch();
    Geolocation.stopObserving();
  }

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }
    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (hasPermission) {
      return true;
    }
    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }
    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location Permission Denied By User.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location Permission Revoked By User.',
        ToastAndroid.LONG,
      );
    }
    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      Geolocation.getCurrentPosition(
        position => {
          this.setState({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            loading: false,
          });
        },
        error => {
          this.setState({errorMessage: error});
        },
        {
          enableHighAccuracy: true,
          timeout: 8000,
          maximumAge: 8000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  hideToast = () => {
    this.setState({
      visible: false,
    });
  };

  handleLogin = async () => {
    const {email, password} = this.state;
    if (email.length < 6) {
      ToastAndroid.show(
        'Please input a valid email address',
        ToastAndroid.LONG,
      );
    } else if (password.length < 6) {
      ToastAndroid.show(
        'Password must be at least 6 characters',
        ToastAndroid.LONG,
      );
    } else {
      Database.ref('user/')
        .orderByChild('/email')
        .equalTo(email)
        .once('value', result => {
          let data = result.val();
          if (data !== null) {
            let user = Object.values(data);

            AsyncStorage.setItem('user.email', user[0].email);
            AsyncStorage.setItem('user.name', user[0].name);
            AsyncStorage.setItem('user.photo', user[0].photo);
          }
        });
      Auth.signInWithEmailAndPassword(email, password)
        .then(async response => {
          Database.ref('/user/' + response.user.uid).update({
            status: 'Online',
            latitude: this.state.latitude || null,
            longitude: this.state.longitude || null,
          });
          // AsyncStorage.setItem('user', response.user);
          await AsyncStorage.setItem('userid', response.user.uid);
          await AsyncStorage.setItem('user', response.user);
          ToastAndroid.show('Login success', ToastAndroid.LONG);
          await this.props.navigation.navigate('App');
        })
        .catch(error => {
          this.setState({
            errorMessage: error.message,
            email: '',
            password: '',
          });
          ToastAndroid.show(this.state.errorMessage, ToastAndroid.LONG);
        });
      // Alert.alert('Error Message', this.state.errorMessage);
    }
  };

  loginGoogle = async () => {
    this.setState({Onprosess: true});
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const {idToken, accessToken} = userInfo;
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await Auth.signInWithCredential(credential)
        .then(response => {
          const data = Database.ref(`/user/${response.user.uid}`);
          if (data) {
            Database.ref('/user/' + response.user.uid).update({
              name: userInfo.user.name,
              status: 'Online',
              email: userInfo.user.email,
              photo: userInfo.user.photo,
              latitude: this.state.latitude || null,
              longitude: this.state.longitude || null,
              id: response.user.uid,
            });
          } else {
            Database.ref('/user/' + response.user.uid).set({
              name: userInfo.user.name,
              status: 'Online',
              email: userInfo.user.email,
              photo: userInfo.user.photo,
              latitude: this.state.latitude || null,
              longitude: this.state.longitude || null,
              id: response.user.uid,
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
      this.setState({Onprosess: false});
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        this.setState({Onprosess: false});
        return;
      } else if (error.code === statusCodes.IN_PROGRESS) {
        this.setState(
          {
            errorMessage: 'In Progress..',
            visible: true,
            Onprosess: false,
          },
          () => this.hideToast(),
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        this.setState(
          {
            errorMessage: 'Please Install Google Play Services',
            visible: true,
            Onprosess: false,
          },
          () => this.hideToast(),
        );
      } else {
        this.setState(
          {
            errorMessage: error.code || error.message,
            visible: true,
            Onprosess: false,
          },
          () => this.hideToast(),
        );
      }
    }
  };

  render() {
    return (
      <View style={styles.container}>
        <StatusBar backgroundColor="#8DBF8B" barStyle="dark-content" />
        <Image
          source={require('./OIT!.png')}
          style={{width: 100, height: 100, alignSelf: 'center', marginTop: 50}}
        />
        <Text style={styles.greeting}>{'Welcome back.'}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Email Address</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={email => this.setState({email})}
              value={this.state.email}
            />
          </View>

          <View style={{marginTop: 32}}>
            <Text style={styles.inputTitle}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              autoCapitalize="none"
              onChangeText={password => this.setState({password})}
              value={this.state.password}
            />
          </View>
        </View>

        <View>
          <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
            <Text style={{color: '#FFF', fontWeight: '500'}}>Sign in</Text>
          </TouchableOpacity>
          <Text style={{textAlign: 'center'}}> ----- OR ----- </Text>
          <TouchableOpacity style={styles.buttonG} onPress={this.loginGoogle}>
            <Text> Sign in with Google Account </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{alignSelf: 'center', marginTop: 10}}
          onPress={() => this.props.navigation.navigate('Register')}>
          <Text style={{color: '#414959', fontSize: 13}}>
            New to OIT! ?{' '}
            <Text style={{fontWeight: '500', color: '#8DBF8B'}}>Sign Up</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

GoogleSignin.configure({
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    webClientId: '778489604851-8gj2jq6jourmfo61v12vc02nsst5p2q1.apps.googleusercontent.com',
})

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  greeting: {
    marginTop: 10,
    fontSize: 18,
    fontWeight: '400',
    textAlign: 'center',
  },
  errorMessage: {
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 30,
  },
  error: {
    color: '#E9446A',
    fontSize: 13,
    fontWeight: '600',
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
    marginHorizontal: 30,
  },
  inputTitle: {
    color: '#8A8F9E',
    fontSize: 10,
    textTransform: 'uppercase',
  },
  input: {
    borderBottomColor: '#8A8F9E',
    borderBottomWidth: StyleSheet.hairlineWidth,
    height: 40,
    fontSize: 15,
    color: '#161F3D',
  },
  button: {
    marginHorizontal: 30,
    backgroundColor: '#8DBF8B',
    borderRadius: 25,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonG: {
    marginHorizontal: 30,
    backgroundColor: 'white',
    borderRadius: 25,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
});
