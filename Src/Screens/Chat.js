import React, {Component} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {View, Text, TouchableOpacity, Image} from 'react-native';
import {Icon} from 'native-base';
// import Header from '../layouts/Header';
import {withNavigation} from 'react-navigation';
import firebase from 'firebase';
import {
  GiftedChat,
  Actions,
  SystemMessage,
  Send,
} from 'react-native-gifted-chat';
import {Database} from '../config';
import AsyncStorage from '@react-native-community/async-storage';
import {Bubble, Composer} from 'react-native-gifted-chat';

export default class Chat extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      title: navigation.getParam('item').name,
      headerStyle: {
        backgroundColor: '#8DBF8B',
        height: 60,
      },
      headerTitleStyle: {
        color: 'white',
      },
    };
  };
  state = {
    message: '',
    messageList: [],
    person: this.props.navigation.getParam('item'),
    userId: AsyncStorage.getItem('userid'),
    userName: AsyncStorage.getItem('user.name'),
    userAvatar: AsyncStorage.getItem('user.photo'),
  };

  onSend = async () => {
    if (this.state.message.length > 0) {
      let msgId = firebase
        .database()
        .ref('messages')
        .child(this.state.userId)
        .child(this.state.person.id)
        .push().key;
      let updates = {};
      let message = {
        _id: msgId,
        text: this.state.message,
        createdAt: firebase.database.ServerValue.TIMESTAMP,
        user: {
          _id: this.state.userId,
          name: this.state.userName,
          avatar: this.state.userAvatar,
        },
      };
      updates[
        'messages/' +
          this.state.userId +
          '/' +
          this.state.person.id +
          '/' +
          msgId
      ] = message;
      updates[
        'messages/' +
          this.state.person.id +
          '/' +
          this.state.userId +
          '/' +
          msgId
      ] = message;
      firebase
        .database()
        .ref()
        .update(updates);
      this.setState({message: ''});
    }
  };

  componentDidMount = async () => {
    const userId = await AsyncStorage.getItem('userid');
    const userName = await AsyncStorage.getItem('user.name');
    const userAvatar = await AsyncStorage.getItem('user.photo');
    this.setState({userId, userName, userAvatar});
    firebase
      .database()
      .ref('messages')
      .child(this.state.userId)
      .child(this.state.person.id)
      .on('child_added', val => {
        this.setState(previousState => ({
          messageList: GiftedChat.append(previousState.messageList, val.val()),
        }));
      });
  };

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: "#8bbfa3",
          },
        }}
      />
    );
  }

  renderSend(props) {
    return (
      <Send {...props}>
        <View
          style={{
            marginRight: 20,
            marginBottom: 25,

            width: 35,
            height: 35,
          }}>
          <Icon name="send" type="FontAwesome" style={{marginTop: 25, paddingRight: 10}} />
        </View>
      </Send>
    );
  }

  render() {
    return (
      <View style={{flex: 1, backgroundColor: '#111'}}>
        <GiftedChat
          renderSend={this.renderSend}
          renderBubble={this.renderBubble}
          text={this.state.message}
          onInputTextChanged={val => {
            this.setState({message: val});
          }}
          messages={this.state.messageList}
          onSend={() => this.onSend()}
          user={{
            _id: this.state.userId,
          }}
        />
      </View>
    );
  }
}
