import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import * as firebase from "firebase";
import {Database, Auth} from '../../config';

export default class LoadingScreen extends React.Component {

    componentDidMount() {
        
        firebase.auth().onAuthStateChanged(user => {
            console.log(user)
            if (!user) {
                this.props.navigation.navigate("Auth");
            } else {
                if (user.displayName) {
                    this.props.navigation.navigate("App");
                } else {
                    console.log('masuk')
                 } 
            }
        });
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>Loading...</Text>
                <ActivityIndicator size="large"></ActivityIndicator>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
