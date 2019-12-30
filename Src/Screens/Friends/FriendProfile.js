import React, { Component } from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
    View,
    Text,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    StyleSheet,
    Image,
    ToastAndroid,
    ImageBackground,
    StatusBar,
    ScrollView,
} from 'react-native';
import { Icon } from 'native-base';
// import Header from '../layouts/Header';
import firebase from 'firebase';
import { Database, Auth } from '../../config';
import AsyncStorage from '@react-native-community/async-storage';

export default class Profile extends Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: navigation.getParam('item').name + "'s Profile",
        };
    };
    constructor(props) {
        super(props);
        this.state = {
            person: props.navigation.getParam('item'),
            items: props.navigation.getParam('item'),
        };
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar translucent backgroundColor="transparent" />
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

                        <View>
                            <Image
                                source={{
                                    uri: this.state.person.photo,
                                }}
                                style={{
                                    resizeMode: "cover",
                                    flexDirection: 'row',
                                    width: 150,
                                    height: 150,
                                    alignItems: 'center',
                                    paddingLeft: 20,
                                    borderRadius: 200,
                                    bottom: 30
                                }} />
                        </View>

                    </View>
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ color: '#8DBF8B', marginVertical: 10, fontSize: 22 }}>
                            Account
            </Text>
                        <Text style={{ fontSize: 12, color: '#99A3A4' }}>
                            Full name
            </Text>
                        <Text style={{ fontSize: 18 }}>{this.state.person.name}</Text>
                        <View style={styles.separator} />
                        <Text style={{ fontSize: 12, color: '#99A3A4' }}>Email</Text>
                        <Text style={{ fontSize: 18 }}>{this.state.person.email}</Text>
                        <View style={styles.separator} />
                        <Text style={{ fontSize: 12, color: '#99A3A4' }}>Bio</Text>
                        <Text style={{ ontSize: 18 }}>
                            Add a few words about yourself
            </Text>
                    </View>
                    <View style={styles.bigseparator} />
                    <View style={{ marginHorizontal: 20 }}>
                        <Text style={{ color: '#8DBF8B', marginVertical: 10, fontSize: 22 }}>
                            Settings
            </Text>
                        <TouchableOpacity
                            style={{ flexDirection: 'row' }}
                            onPress={() =>
                                this.props.navigation.navigate('Chatting', {
                                    item: this.state.person,
                                })
                            }>
                            <Icon
                                name="message"
                                type="MaterialIcons"
                                style={{
                                    width: 25,
                                    height: 25,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginLeft: 6,
                                }}
                            />
                            <Text style={{ fontSize: 18, marginLeft: 20 }}>
                                Send Message to {this.state.person.name}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.separator} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    separator: {
        height: 2,
        backgroundColor: '#eeeeee',
        marginTop: 10,
        marginHorizontal: 10,
    },
    bigseparator: {
        height: 10,
        backgroundColor: '#eeeeee',
        marginTop: 10,
    },
    logoutButton: {
        marginTop: 10,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#00BFFF',
    },
    logoutButtonText: {
        color: '#FFFFFF',
        fontSize: 20,
    },
    logoutContainer: {
        marginHorizontal: 30,
    },
    btnTxt: {
        color: '#fff',
    },
    image: {
        marginTop: 20,
        minWidth: 200,
        height: 200,
        resizeMode: 'contain',
        backgroundColor: '#ccc',
    },
    img: {
        flex: 1,
        height: 100,
        margin: 5,
        resizeMode: 'contain',
        borderWidth: 1,
        borderColor: '#eee',
        backgroundColor: '#ccc',
    },
    progressBar: {
        backgroundColor: 'rgb(3, 154, 229)',
        height: 3,
        shadowColor: '#000',
    },
    btn: {
        paddingLeft: 20,
        paddingRight: 20,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 20,
        backgroundColor: 'rgb(3, 154, 229)',
        marginTop: 20,
        alignItems: 'center',
    },
    disabledBtn: {
        backgroundColor: 'rgba(3,155,229,0.5)',
    },
});
