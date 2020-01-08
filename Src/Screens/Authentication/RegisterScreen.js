import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ToastAndroid,
  Image,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import {Database, Auth} from '../../config';
import Geolocation from 'react-native-geolocation-service';
import * as firebase from 'firebase';

class RegisterScreen extends Component {
  static navigationOptions = {
    header: null,
  };
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      name: '',
      email: '',
      password: '',
      latitude: null,
      longitude: null,
      errorMessage: null,
      loading: false,
      updatesEnabled: false,
    };
  }

  componentDidMount = async () => {
    await this.getLocation();
  };

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
          console.warn(position);
        },
        error => {
          this.setState({errorMessage: error, loading: false});
          console.warn(error);
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

  handleSignUp = async () => {
    const {email, name, password} = this.state;
    if (name.length < 1) {
      ToastAndroid.show('Please input your fullname', ToastAndroid.LONG);
    } else if (email.length < 6) {
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
      try {
        const userCredentials = await firebase.auth().createUserWithEmailAndPassword(email, password)
            if (userCredentials.user) {
                console.log(userCredentials.user)
                const dataUser = firebase.database().ref('/user/' + userCredentials.user.uid)
                await dataUser.set({
                    name: this.state.name,
                    status: 'Online',
                    email: this.state.email,
                    photo: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/8_avatar-512.png',
                    latitude: this.state.latitude || null,
                    longitude: this.state.longitude || null,
                })

                await userCredentials.user.updateProfile({
                    displayName: this.state.name,
                    photoURL: 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/8_avatar-512.png',
                }).then(async () => {
                    await userCredentials.user.reload()
                    console.log(firebase.auth().currentUser.displayName)
                    firebase.auth().onAuthStateChanged(user => {
                        this.props.navigation.navigate(user ? 'App' : 'Auth')
                    })
                })
              }
        
      } catch (error) {
        this.setState({
          errorMessage: error.message,
          name: '',
          email: '',
          password: '',
        });
        ToastAndroid.show(this.state.errorMessage.message, ToastAndroid.LONG);
      }
      
  };
}

  render() {
    return (
      <View style={styles.container}>
        <Image
          source={require('./OIT!.png')}
          style={{
            width: 80,
            height: 80,
            alignSelf: 'center',
            marginVertical: 20,
          }}
        />
        <Text style={styles.greeting}>{'Sign up to get started.'}</Text>

        <View style={styles.errorMessage}>
          {this.state.errorMessage && (
            <Text style={styles.error}>{this.state.errorMessage}</Text>
          )}
        </View>

        <View style={styles.form}>
          <View>
            <Text style={styles.inputTitle}>Full Name</Text>
            <TextInput
              style={styles.input}
              autoCapitalize="none"
              onChangeText={name => this.setState({name})}
              value={this.state.name}
            />
          </View>

          <View style={{marginTop: 32}}>
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

        <TouchableOpacity style={styles.button} onPress={this.handleSignUp}>
          <Text style={{color: '#FFF', fontWeight: '500'}}>Sign up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{alignSelf: 'center', marginTop: 32}}>
          <Text style={{color: '#414959', fontSize: 13}}>
            New to ChatApp?{' '}
            <Text style={{fontWeight: '500', color: '#8DBF8B'}}>Login</Text>
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default RegisterScreen;

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
    marginBottom: 30,
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
});
