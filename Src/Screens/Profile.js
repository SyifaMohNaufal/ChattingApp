import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ToastAndroid,
  ImageBackground,
  StatusBar,
  PermissionsAndroid,
  Dimensions,
} from 'react-native';
import {Icon} from 'native-base';
import SafeAreaView from 'react-native-safe-area-view';
import * as firebase from 'firebase';
import AsyncStorage from '@react-native-community/async-storage';
import {Database, Auth} from '../config';
import ImagePicker from 'react-native-image-picker';
import RNFetchBlob from 'rn-fetch-blob';

export default class Profile extends React.Component {
  static navigationOptions = {
    title: ' Profile',
  };

  state = {
    userId: null,
    permissionsGranted: null,
    errorMessage: null,
    loading: false,
    updatesEnabled: false,
    location: {},
    photo: null,
    imageUri: null,
    imgSource: '',
    uploading: false,
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    const userEmail = await AsyncStorage.getItem('user.email');
    this.setState({userId, userName, userAvatar, userEmail});
  };

  signOutUser = async () => {
    try {
      Database.ref('user/' + Auth.currentUser.uid).update({status: 'Offline'});
      await AsyncStorage.clear();
      Auth.signOut();
      ToastAndroid.show('Logout success', ToastAndroid.SHORT);
    } catch (error) {
      this.setState({errorMessage: error.message});
      ToastAndroid.show('logout error', ToastAndroid.SHORT);
      // Alert.alert('Error Message', this.state.errorMessage);
    }
  };
  // firebase.auth().signOut();

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ]);
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.log(err);
      return false;
    }
  };

  changeImage = async type => {
    // console.log(upp)
    const Blob = RNFetchBlob.polyfill.Blob;
    const fs = RNFetchBlob.fs;
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
    window.Blob = Blob;

    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
    };

    let cameraPermission =
      (await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      ) &&
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      );
    if (!cameraPermission) {
      cameraPermission = await this.requestCameraPermission();
    } else {
      ImagePicker.showImagePicker(options, response => {
        ToastAndroid.show(
          'Rest asure, your photo is flying to the shiny cloud',
          ToastAndroid.LONG,
        );
        let uploadBob = null;
        const imageRef = firebase
          .storage()
          .ref('avatar/' + this.state.userId)
          .child('photo');
        fs.readFile(response.path, 'base64')
          .then(data => {
            return Blob.build(data, {type: `${response.mime};BASE64`});
          })
          .then(blob => {
            uploadBob = blob;
            return imageRef.put(blob, {contentType: `${response.mime}`});
          })
          .then(() => {
            uploadBob.close();
            return imageRef.getDownloadURL();
          })
          .then(url => {
            ToastAndroid.show(
              'Your cool avatar is being uploaded, its going back to your phone now',
              ToastAndroid.LONG,
            );
            firebase
              .database()
              .ref('user/' + this.state.userId)
              .update({photo: url});
            this.setState({userAvatar: url});
            AsyncStorage.setItem('user.photo', this.state.userAvatar);
          })

          .catch(err => console.log(err));
      });
    }
  };

  render() {
    const {uploading} = this.state;

    const disabledStyle = uploading ? styles.disabledBtn : {};
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar backgroundColor="#8DBF8B" barStyle="dark-content" />
        <ScrollView>
          <View
            style={{
              alignItems: 'center',
              paddingTop: 60,
              flex: 1,
              flexDirection: 'column',
              backgroundColor: '#8DBF8B',
              height: 200,
              justifyContent: 'flex-end',
            }}>
            <ImageBackground
              resizeMode="contain"
              style={{
                flexDirection: 'row',
                width: '100%',
                height: '100%',
                alignItems: 'flex-end',
                paddingLeft: 20,
              }}
              source={{
                uri: this.state.userAvatar,
              }}>
              <TouchableOpacity
                style={{
                  right: 'auto',
                  left: 250,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: 'white',
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderColor: '#E5E7E9',
                  borderWidth: 1,
                  marginBottom: -25,
                }}
                onPress={this.changeImage}>
                <Image
                  source={require('../../Public/assets/Icon/photoblack.png')}
                  style={{
                    width: 25,
                    height: 25,
                  }}
                />
              </TouchableOpacity>
            </ImageBackground>
          </View>
          <View style={{marginHorizontal: 20}}>
            <Text style={{color: '#8DBF8B', marginVertical: 10, fontSize: 22}}>
              Account
            </Text>
            <Text style={{fontSize: 18}}>{this.state.userName}</Text>
            <Text style={{fontSize: 12, color: '#99A3A4'}}>
              tap to change Profile Name
            </Text>
            <View style={styles.separator} />
            <Text style={{fontSize: 18}}>{this.state.userEmail}</Text>
            <Text style={{fontSize: 12, color: '#99A3A4'}}>Email</Text>
            <View style={styles.separator} />
            <Text style={{fontSize: 18}}>Bio</Text>
            <Text style={{fontSize: 12, color: '#99A3A4'}}>
              Add a few words about yourself
            </Text>
          </View>
          <View style={styles.bigseparator} />
          <View style={{marginHorizontal: 20}}>
            <Text style={{color: '#8DBF8B', marginVertical: 10, fontSize: 22}}>
              Settings
            </Text>
            <View style={styles.separator} />
            <TouchableOpacity
              style={{marginTop: 32, flexDirection: 'row'}}
              onPress={this.signOutUser}>
              <Icon name="logout" type="SimpleLineIcons" />
              <Text style={{fontSize: 16, paddingLeft: 20}}>LOGOUT</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
